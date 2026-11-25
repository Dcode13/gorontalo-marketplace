// Logika halaman checkout. Bergantung pada js/data.js (products, CONFIG, helper).
 
const $ = (id) => document.getElementById(id);
 
const state = {
    items: [],
    shipping: '',   // id metode pengiriman terpilih
    payment: '',    // id metode pembayaran terpilih
    couponCode: ''
};
 
document.addEventListener('DOMContentLoaded', init);
// Muat ulang keranjang saat kembali dari WhatsApp melalui tombol Back browser.
window.addEventListener('pageshow', (e) => { if (e.persisted) window.location.reload(); });
 
function init() {
    state.items = readCart();
    if (state.items.length === 0) {
        $('emptyCheckout').classList.remove('hidden');
        return;
    }
    $('checkoutMain').classList.remove('hidden');
 
    // Isi dropdown wilayah
    REGIONS.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        $('region').appendChild(opt);
    });
 
    // Isi ulang data pembeli terakhir (jika pernah memesan)
    const buyer = storageGet(BUYER_STORAGE_KEY, null);
    if (buyer) {
        ['fullName', 'phone', 'email', 'region', 'postal', 'address'].forEach((f) => {
            if (buyer[f] && $(f)) $(f).value = buyer[f];
        });
    }
 
    // Kupon
    state.couponCode = couponRate(getCouponCode()) > 0 ? getCouponCode() : '';
    if (state.couponCode) {
        $('couponInput').value = state.couponCode;
        showCouponMessage(true, state.couponCode);
    }
 
    state.shipping = 'local';
    state.payment = 'whatsapp';
 
    bindEvents();
    renderAll();
}
 
function bindEvents() {
    $('region').addEventListener('change', () => { clearError('region'); clearError('shipping'); renderAll(); });
 
    // Hapus pesan error saat pengguna mengetik
    ['fullName', 'phone', 'email', 'postal', 'address'].forEach((f) => {
        $(f).addEventListener('input', () => clearError(f));
    });
 
    // Pilihan pengiriman & pembayaran (delegasi event)
    $('shippingOptions').addEventListener('change', (e) => {
        if (e.target.name === 'shipping') { state.shipping = e.target.value; clearError('shipping'); renderAll(); }
    });
    $('paymentOptions').addEventListener('change', (e) => {
        if (e.target.name === 'payment') { state.payment = e.target.value; clearError('payment'); renderPayment(); }
    });
 
    // Tombol +/- / hapus di ringkasan
    $('summaryItems').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;
        const id = parseInt(btn.dataset.id, 10);
        const item = state.items.find((i) => i.id === id);
        if (!item) return;
        if (btn.dataset.act === 'inc') item.qty = Math.min(item.qty + 1, 99);
        if (btn.dataset.act === 'dec') item.qty -= 1;
        if (btn.dataset.act === 'del') item.qty = 0;
        state.items = state.items.filter((i) => i.qty > 0);
        writeCart(state.items);
        if (state.items.length === 0) {
            $('checkoutMain').classList.add('hidden');
            $('emptyCheckout').classList.remove('hidden');
            return;
        }
        renderAll();
    });
 
    // Kupon
    $('applyCouponBtn').addEventListener('click', applyCoupon);
    $('couponInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); }
    });
 
    $('checkoutForm').addEventListener('submit', onSubmit);

}
 
function applyCoupon() {
    const code = $('couponInput').value.trim().toUpperCase();
    if (couponRate(code) > 0) {
        state.couponCode = code;
        setCouponCode(code);
        showCouponMessage(true, code);
    } else {
        state.couponCode = '';
        setCouponCode('');
        showCouponMessage(false);
    }
    renderTotals();
    renderShipping(); // gratis ongkir bergantung pada subtotal setelah diskon
}
 
function showCouponMessage(ok, code) {
    const el = $('couponMessage');
    if (ok) {
        el.textContent = `✅ Kupon ${code} dipakai. Diskon ${Math.round(couponRate(code) * 100)}%.`;
        el.className = 'text-xs font-semibold text-emerald-600 mt-2';
    } else {
        el.textContent = '❌ Kode kupon tidak valid.';
        el.className = 'text-xs font-semibold text-accent mt-2';
    }
}
 
/* ---------------- Render ---------------- */
 
function renderAll() {
    renderItems();
    renderShipping();
    renderPayment();
    renderTotals();
}
 
function renderItems() {
    $('summaryItems').innerHTML = state.items.map((i) => `
        <div class="flex items-start space-x-3 py-3 first:pt-0">
            <img src="${esc(i.image)}" alt="${esc(i.title)}" class="w-14 h-14 object-cover rounded-xl bg-slate-100 flex-shrink-0">
            <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-slate-900 line-clamp-2">${esc(i.title)}</div>
                <div class="text-[11px] text-slate-500">${esc(i.seller)}</div>
                <div class="flex items-center justify-between mt-1.5">
                    <div class="flex items-center space-x-2">
                        <button type="button" data-act="dec" data-id="${i.id}" aria-label="Kurangi" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold">-</button>
                        <span class="text-xs font-bold w-5 text-center">${i.qty}</span>
                        <button type="button" data-act="inc" data-id="${i.id}" aria-label="Tambah" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold">+</button>
                        <button type="button" data-act="del" data-id="${i.id}" aria-label="Hapus" class="text-slate-400 hover:text-accent text-xs ml-1"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                    <div class="text-xs font-bold text-primary">${rupiah(i.price * i.qty)}</div>
                </div>
            </div>
        </div>`).join('');
}
 
function currentShippingOptions() {
    const subtotal = calcSubtotal(state.items);
    const discount = Math.round(subtotal * couponRate(state.couponCode));
    return getShippingOptions($('region').value, subtotal - discount);
}
 
function renderShipping() {
    const opts = currentShippingOptions();
    $('shippingOptions').innerHTML = opts.map((o) => {
        const disabled = o.cost === null;
        const price = disabled ? 'Pilih wilayah dulu' : (o.cost === 0 ? 'Gratis' : rupiah(o.cost));
        return optionCard('shipping', o, state.shipping === o.id, disabled, price);
    }).join('');
}
 
function renderPayment() {
    const opts = getPaymentOptions();
    const current = opts.find((o) => o.id === state.payment);
    if (!current || !current.enabled) state.payment = 'whatsapp';
    $('paymentOptions').innerHTML = opts.map((o) =>
        optionCard('payment', o, state.payment === o.id, !o.enabled, o.enabled ? '' : 'Tidak tersedia')
    ).join('');
}
 
function optionCard(name, o, checked, disabled, rightText) {
    return `
        <label class="flex items-center justify-between gap-3 p-4 border rounded-xl cursor-pointer transition
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : (checked ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300')}">
            <span class="flex items-center space-x-3 min-w-0">
                <input type="radio" name="${name}" value="${esc(o.id)}" class="accent-green-700" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                <span class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-primary flex-shrink-0"><i class="fa-solid ${esc(o.icon)}"></i></span>
                <span class="min-w-0">
                    <span class="block text-sm font-bold text-slate-900">${esc(o.name)}</span>
                    <span class="block text-[11px] text-slate-500">${esc(o.note)}</span>
                </span>
            </span>
            <span class="text-xs font-bold ${rightText === 'Gratis' ? 'text-emerald-600' : 'text-slate-800'} flex-shrink-0">${esc(rightText)}</span>
        </label>`;
}
 
function selectedShippingCost() {
    const opt = currentShippingOptions().find((o) => o.id === state.shipping);
    return opt ? opt.cost : null;
}
 
function renderTotals() {
    const cost = selectedShippingCost();
    const t = calcTotals(state.items, state.couponCode, cost || 0);
    $('sumSubtotal').textContent = rupiah(t.subtotal);
    $('sumDiscount').textContent = '- ' + rupiah(t.discount);
    $('sumShipping').textContent = cost === null ? 'Pilih wilayah dulu' : (cost === 0 ? 'Gratis' : rupiah(cost));
    $('sumTotal').textContent = rupiah(t.total);
}
 
/* ---------------- Validasi ---------------- */
 
function setError(field, msg) {
    const el = document.querySelector(`.err[data-for="${field}"]`);
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    const input = $(field);
    if (input) input.classList.add('border-accent');
}
function clearError(field) {
    const el = document.querySelector(`.err[data-for="${field}"]`);
    if (el) el.classList.add('hidden');
    const input = $(field);
    if (input) input.classList.remove('border-accent');
}
 
// Normalisasi nomor HP Indonesia ke format 62xxxxxxxxxx. Mengembalikan null jika tidak valid.
function normalizePhone(raw) {
    const cleaned = String(raw).replace(/[\s\-().]/g, '');
    if (!/^(\+62|62|0)8\d{8,12}$/.test(cleaned)) return null;
    return cleaned.replace(/^\+?62/, '').replace(/^0/, '');
}
 
function validate() {
    ['fullName', 'phone', 'email', 'region', 'postal', 'address', 'shipping', 'payment'].forEach(clearError);
    const errors = [];
    if (state.items.length === 0) errors.push(['shipping', 'Keranjang belanja masih kosong.']);
    const v = (id) => $(id).value.trim();
 
    if (v('fullName').length < 3) errors.push(['fullName', 'Nama lengkap minimal 3 karakter.']);
 
    const phone = normalizePhone(v('phone'));
    if (!phone) errors.push(['phone', 'Nomor WhatsApp tidak valid. Contoh: 081234567890']);
 
    if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) errors.push(['email', 'Format email tidak valid.']);
 
    if (!REGIONS.includes(v('region'))) errors.push(['region', 'Pilih kabupaten / kota tujuan.']);
 
    if (v('postal') && !/^\d{5}$/.test(v('postal'))) errors.push(['postal', 'Kode pos harus 5 angka.']);
 
    if (v('address').length < 10) {
        errors.push(['address', 'Alamat lengkap minimal 10 karakter (jalan, nomor, kelurahan, kecamatan).']);
    }
 
    const ship = currentShippingOptions().find((o) => o.id === state.shipping);
    if (!ship || ship.cost === null) errors.push(['shipping', 'Pilih wilayah tujuan agar ongkos kirim bisa dihitung.']);
 
    const pay = getPaymentOptions().find((o) => o.id === state.payment);
    if (!pay || !pay.enabled) errors.push(['payment', 'Pilih metode pembayaran yang tersedia.']);
 
    errors.forEach(([f, m]) => setError(f, m));
    return { ok: errors.length === 0, firstField: errors[0] ? errors[0][0] : null, phone };
}
 
/* ---------------- Buat pesanan ---------------- */
 
function onSubmit(e) {
    e.preventDefault();
    if ($('placeOrderBtn').disabled) return;
    $('checkoutError').classList.add('hidden');
    const result = validate();
    if (!result.ok) {
        const target = $(result.firstField) || document.querySelector(`.err[data-for="${result.firstField}"]`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (target.focus) target.focus({ preventScroll: true });
        }
        return;
    }
 
    const btn = $('placeOrderBtn');
    btn.disabled = true; // cegah klik ganda
    btn.classList.add('opacity-60');
 
    const v = (id) => $(id).value.trim();
    const ship = currentShippingOptions().find((o) => o.id === state.shipping);
    const pay = getPaymentOptions().find((o) => o.id === state.payment);
    const totals = calcTotals(state.items, state.couponCode, ship.cost);
 
    const order = {
        id: newOrderId(),
        createdAt: new Date().toISOString(),
        sandbox: false,
        status: 'Menunggu Pembayaran',
        paymentStatus: 'pending',
        buyer: {
            fullName: v('fullName'),
            phone: '62' + result.phone,
            email: v('email'),
            region: v('region'),
            postal: v('postal'),
            address: v('address'),
            note: v('note')
        },
        items: state.items.map((i) => ({ id: i.id, title: i.title, seller: i.seller, price: i.price, qty: i.qty, image: i.image })),
        shipping: { id: ship.id, name: ship.name, cost: ship.cost },
        payment: { id: pay.id, name: pay.name },
        coupon: couponRate(state.couponCode) > 0 ? state.couponCode : '',
        totals
    };
 
    try {
        saveOrder(order);
    } catch (error) {
        $('checkoutError').textContent = 'Pesanan belum tersimpan. Izinkan penyimpanan browser atau kosongkan ruang, lalu coba lagi. Keranjang Anda tetap tersedia.';
        $('checkoutError').classList.remove('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-60');
        return;
    }
    storageSet(BUYER_STORAGE_KEY, { fullName: order.buyer.fullName, phone: v('phone'), email: order.buyer.email,
        region: order.buyer.region, postal: order.buyer.postal, address: order.buyer.address });
 
    // Pesanan sudah tersimpan agar pembayaran bisa dilanjutkan dari Pesanan Saya.
    writeCart([]);
    setCouponCode('');
    window.location.href = getOrderWhatsAppUrl(order);
}
 
