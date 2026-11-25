// Halaman konfirmasi pesanan (?id=GM-...) dan daftar "Pesanan Saya" (tanpa ?id).
// Bergantung pada js/data.js. Semua teks dari pengguna di-escape lewat esc().
 
const app = document.getElementById('app');
 
document.addEventListener('DOMContentLoaded', () => {
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
        const order = getOrder(id);
        order ? renderOrder(order) : renderNotFound();
    } else {
        renderList();
    }
});
 
// Perbarui otomatis saat admin mengubah status di tab lain (browser yang sama)
window.addEventListener('storage', (e) => { if (e.key === ORDER_STORAGE_KEY) location.reload(); });
 
function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 1800);
}
 
function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Makassar' });
}
 
function badgeClass(status) {
    if (status === 'Dibatalkan') return 'bg-red-100 text-red-700';
    if (status === 'Menunggu Pembayaran') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
}
 
function timelineHtml(o) {
    if (o.status === 'Dibatalkan') {
        return '<div class="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">Pesanan ini dibatalkan.</div>';
    }
    const flow = getFlow(o);
    const cur = flow.indexOf(o.status);
    return `<ol class="flex items-start justify-between gap-1">${flow.map((st, i) => `
        <li class="flex-1 text-center">
            <div class="mx-auto w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${i <= cur ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}">${i < cur ? '&#10003;' : i + 1}</div>
            <div class="mt-1 text-[10px] leading-tight ${i === cur ? 'font-bold text-primary' : 'text-slate-500'}">${esc(st)}</div>
        </li>`).join('')}</ol>`;
}
 
function paidPanel(o) {
    const when = o.paidAt ? formatDate(o.paidAt) : '';
    return `
        <div class="text-center py-2">
            <div class="w-14 h-14 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto text-2xl mb-2"><i class="fa-solid fa-circle-check"></i></div>
            <div class="text-base font-black text-primary">Pembayaran Selesai</div>
            <div class="text-[11px] text-slate-500 mt-1">${esc(rupiah(o.totals.total))} • ${esc(o.payment.name)}${when ? '<br>' + esc(when) : ''}</div>
            <p class="text-xs text-slate-600 mt-3">${o.status === 'Selesai' ? 'Pesanan telah diterima. Terima kasih sudah berbelanja di GorontaloMarket.' : 'Konfirmasi pembayaran telah dicatat. Pesanan siap diproses.'}</p>
        </div>`;
}
 
function renderNotFound() {
    app.innerHTML = `
        <div class="text-center py-24">
            <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-3xl mb-4"><i class="fa-solid fa-file-circle-question"></i></div>
            <h1 class="text-xl font-bold text-slate-900 mb-1">Pesanan tidak ditemukan</h1>
            <p class="text-sm text-slate-500 mb-6">Pesanan disimpan di browser yang dipakai saat memesan.</p>
            <a href="order.html" class="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl">Lihat Pesanan Saya</a>
        </div>`;
}
 
function renderList() {
    const orders = getOrders();
    if (orders.length === 0) {
        app.innerHTML = `
            <div class="text-center py-24">
                <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-3xl mb-4"><i class="fa-solid fa-box-open"></i></div>
                <h1 class="text-xl font-bold text-slate-900 mb-1">Belum ada pesanan</h1>
                <p class="text-sm text-slate-500 mb-6">Pesanan yang Anda buat akan muncul di sini.</p>
                <a href="index.html#productSection" class="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl">Mulai Belanja</a>
            </div>`;
        return;
    }
    app.innerHTML = `
        <h1 class="text-2xl font-black text-slate-900 mb-6">Pesanan Saya</h1>
        <div class="space-y-3">
            ${orders.map((o) => `
                <a href="order.html?id=${encodeURIComponent(o.id)}" class="block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition p-5">
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0">
                            <div class="text-sm font-bold text-slate-900 break-all">${esc(o.id)}</div>
                            <div class="text-[11px] text-slate-500">${esc(formatDate(o.createdAt))} • ${o.items.reduce((s, i) => s + i.qty, 0)} barang</div>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <div class="text-sm font-black text-primary">${rupiah(o.totals.total)}</div>
                            <span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass(o.status)}">${esc(o.status)}</span>
                        </div>
                    </div>
                </a>`).join('')}
        </div>`;
}
 
function paymentInstructions(o) {
    const total = esc(rupiah(o.totals.total));
    const amount = `<div class="text-center mb-4"><p class="text-xs text-slate-500">Total Pembayaran</p><p class="text-2xl font-black text-primary mt-1">${total}</p></div>`;
    if (o.payment.id === 'whatsapp') {
        return `${amount}
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm">
                <div class="font-bold text-primary"><i class="fa-brands fa-whatsapp mr-1"></i>Bayar via WhatsApp</div>
                <p class="text-xs text-slate-600 mt-2">Hubungi admin di +${esc(CONFIG.adminWhatsApp)} untuk melanjutkan pembayaran. Pesan berisi rincian produk, total belanja, dan data penerima.</p>
                <p class="text-xs text-slate-600 mt-2">Periksa pesan lalu tekan Kirim di WhatsApp. Konfirmasi pembayaran dan pengiriman dilanjutkan bersama admin melalui chat.</p>
            </div>`;
    }
    if (o.payment.id === 'qris') {
        const merchantQr = getPaymentQr(o).kind === 'merchant';
        return `${amount}
            <div class="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <div class="flex items-center justify-between mb-2 text-xs font-bold text-slate-600"><span>${merchantQr ? 'QRIS' : 'QR Detail Pesanan'}</span><span>${esc(CONFIG.storeName)}</span></div>
                <div id="paymentQr" class="bg-white min-h-48 flex items-center justify-center text-xs text-slate-500" aria-live="polite">Menyiapkan kode QR…</div>
                <p class="font-bold text-sm mt-2">${esc(CONFIG.qris.merchantName)}</p>
                <p class="text-[11px] text-slate-500 mt-1 break-all">${esc(o.id)}</p>
            </div>
            <p class="text-xs text-slate-500 mt-3 leading-relaxed">${merchantQr
                ? 'Pindai dengan aplikasi bank atau dompet digital, periksa nama merchant, lalu masukkan total pembayaran di atas.'
                : 'Pindai dengan kamera untuk melihat detail pesanan. Kode ini belum terhubung ke pembayaran bank.'}</p>
            <a id="downloadQr" class="hidden no-print block text-center mt-3 text-xs font-bold text-primary hover:underline">Unduh Kode QR</a>`;
    }
    const bank = CONFIG.banks.find((b) => b.id === o.payment.id);
    return `${amount}
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div class="flex items-center gap-2 text-sm font-bold text-slate-900"><i class="fa-solid fa-building-columns text-primary"></i>${esc(o.payment.name)}</div>
            ${bank && bank.accountNumber
                ? `<p class="text-lg font-black tracking-wider mt-3">${esc(bank.accountNumber)}</p><p class="text-xs text-slate-500">a.n. ${esc(bank.accountHolder)}</p><p class="text-xs text-slate-600 mt-3">Transfer tepat ${total}, lalu konfirmasikan pembayaran Anda.</p>`
                : '<p class="text-xs text-slate-500 mt-3">Informasi rekening tujuan belum tersedia.</p>'}
            <p class="text-[11px] text-slate-500 mt-3 break-all">Referensi pesanan: ${esc(o.id)}</p>
        </div>`;
}

function orderActions(o) {
    if (o.status === 'Dibatalkan') return '<p class="text-sm text-slate-600">Pesanan dibatalkan. Anda dapat kembali berbelanja dari katalog.</p>';
    if (o.status === 'Selesai') return '<p class="text-sm font-bold text-primary">Pesanan selesai. Terima kasih sudah berbelanja!</p>';
    const button = (action, label, secondary = false) => `<button type="button" data-order-action="${action}" class="w-full rounded-xl px-4 py-3 text-xs font-bold ${secondary ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-primary text-white hover:bg-emerald-800'}">${label}</button>`;
    if (o.payment.id === 'whatsapp') {
        return `<a href="${esc(getOrderWhatsAppUrl(o))}" class="block w-full rounded-xl px-4 py-3 text-center text-xs font-bold bg-primary text-white hover:bg-emerald-800"><i class="fa-brands fa-whatsapp mr-1"></i>${isPaid(o) ? 'Hubungi Admin via WhatsApp' : 'Bayar via WhatsApp'}</a>
            <p class="text-[11px] text-slate-500 text-center">Pesanan tersimpan di browser ini. Status pembayaran dikonfirmasi oleh admin melalui WhatsApp.</p>`;
    }
    if (!o.sandbox) return '';
    if (!isPaid(o)) return button('success', 'Konfirmasi Pembayaran') + '<p class="text-[11px] text-slate-500 text-center">Konfirmasi dicatat secara manual pada pesanan ini.</p>' + button('cancel', 'Batalkan Pesanan', true);
    const labels = { 'Pembayaran Selesai': 'Proses Pesanan', Diproses: 'Tandai Sedang Dikirim', Dikirim: 'Pesanan Diterima' };
    return labels[o.status] ? button('advance', labels[o.status]) : '';
}

function renderOrder(o) {
    const paid = isPaid(o);
    const cancelled = o.status === 'Dibatalkan';
    const addr = `${o.buyer.address}, ${o.buyer.region}${o.buyer.postal ? ' ' + o.buyer.postal : ''}`;
 
    app.innerHTML = `
        <!-- Stepper -->
        <div class="no-print flex items-center justify-center space-x-2 sm:space-x-4 text-xs font-semibold mb-8">
            <span class="flex items-center space-x-2 text-primary"><span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"><i class="fa-solid fa-check text-[10px]"></i></span><span>Keranjang</span></span>
            <span class="w-8 sm:w-12 h-px bg-primary"></span>
            <span class="flex items-center space-x-2 text-primary"><span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"><i class="fa-solid fa-check text-[10px]"></i></span><span>Checkout</span></span>
            <span class="w-8 sm:w-12 h-px bg-primary"></span>
            <span class="flex items-center space-x-2 text-primary"><span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">3</span><span>${paid ? 'Terbayar' : 'Pembayaran'}</span></span>
        </div>
 
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto text-2xl mb-3"><i class="fa-solid fa-circle-check"></i></div>
            <h1 class="text-2xl font-black text-slate-900">${cancelled ? 'Pesanan Dibatalkan' : o.status === 'Selesai' ? 'Pesanan Selesai!' : paid ? 'Pembayaran Dikonfirmasi!' : 'Pesanan Berhasil Dibuat!'}</h1>
            <p class="text-sm text-slate-500 mt-1">Terima kasih sudah mendukung UMKM Gorontalo, ${esc(o.buyer.fullName)}.</p>
        </div>
 
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            <div class="md:col-span-3 space-y-6">
                <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">${timelineHtml(o)}</section>
                <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div class="min-w-0">
                            <div class="text-[11px] text-slate-500">Nomor Pesanan</div>
                            <div class="text-sm font-black text-slate-900 break-all">${esc(o.id)}</div>
                            <div class="text-[11px] text-slate-500">${esc(formatDate(o.createdAt))}</div>
                        </div>
                        <span class="text-[11px] font-bold px-3 py-1 rounded-full ${badgeClass(o.status)}">${esc(o.status)}</span>
                    </div>
                    <div class="divide-y divide-slate-100">
                        ${o.items.map((i) => `
                            <div class="flex items-center space-x-3 py-3 first:pt-0">
                                <img src="${esc(i.image)}" alt="${esc(i.title)}" class="w-14 h-14 object-cover rounded-xl bg-slate-100 flex-shrink-0">
                                <div class="flex-1 min-w-0">
                                    <div class="text-xs font-bold text-slate-900">${esc(i.title)}</div>
                                    <div class="text-[11px] text-slate-500">${esc(i.seller)} • ${i.qty} x ${rupiah(i.price)}</div>
                                </div>
                                <div class="text-xs font-bold text-slate-900">${rupiah(i.price * i.qty)}</div>
                            </div>`).join('')}
                    </div>
                    <div class="space-y-1.5 text-sm mt-4 pt-4 border-t border-slate-100">
                        <div class="flex justify-between text-slate-500"><span>Subtotal</span><span class="font-semibold text-slate-800">${rupiah(o.totals.subtotal)}</span></div>
                        ${o.totals.discount > 0 ? `<div class="flex justify-between text-slate-500"><span>Diskon (${esc(o.coupon)})</span><span class="font-semibold text-emerald-600">- ${rupiah(o.totals.discount)}</span></div>` : ''}
                        <div class="flex justify-between text-slate-500"><span>Ongkir (${esc(o.shipping.name)})</span><span class="font-semibold text-slate-800">${o.shipping.cost === 0 ? 'Gratis' : rupiah(o.shipping.cost)}</span></div>
                        <div class="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200"><span>Total</span><span class="text-primary">${rupiah(o.totals.total)}</span></div>
                    </div>
                </section>
 
                <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 text-sm">
                    <h2 class="font-bold text-slate-900 mb-3">Detail Penerima</h2>
                    <dl class="space-y-2 text-xs">
                        <div class="flex gap-3"><dt class="w-24 text-slate-500 flex-shrink-0">Nama</dt><dd class="font-semibold text-slate-800">${esc(o.buyer.fullName)}</dd></div>
                        <div class="flex gap-3"><dt class="w-24 text-slate-500 flex-shrink-0">WhatsApp</dt><dd class="font-semibold text-slate-800">+${esc(o.buyer.phone)}</dd></div>
                        ${o.buyer.email ? `<div class="flex gap-3"><dt class="w-24 text-slate-500 flex-shrink-0">Email</dt><dd class="font-semibold text-slate-800">${esc(o.buyer.email)}</dd></div>` : ''}
                        <div class="flex gap-3"><dt class="w-24 text-slate-500 flex-shrink-0">Alamat</dt><dd class="font-semibold text-slate-800">${esc(addr)}</dd></div>
                        ${o.buyer.note ? `<div class="flex gap-3"><dt class="w-24 text-slate-500 flex-shrink-0">Catatan</dt><dd class="font-semibold text-slate-800">${esc(o.buyer.note)}</dd></div>` : ''}
                    </dl>
                </section>
            </div>
 
            <aside class="md:col-span-2 space-y-4">
                <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                    ${paid ? paidPanel(o) : cancelled ? '<p class="text-xs text-slate-600">Pesanan dibatalkan, tidak ada pembayaran yang perlu dilakukan.</p>' : `
                    <h2 class="font-bold text-slate-900 mb-1">Pembayaran</h2>
                    <div class="text-[11px] text-slate-500 mb-3">${esc(o.payment.name)}</div>
                    ${paymentInstructions(o)}`}
                </section>
 
                <section class="no-print bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                    <h2 class="font-bold text-sm">Kelola Pesanan</h2>
                    <div id="orderActions" class="space-y-3">${orderActions(o)}</div>
                    <p id="orderError" role="alert" class="hidden text-xs text-accent"></p>
                </section>
                <button type="button" onclick="window.print()" class="no-print w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-print"></i><span>Cetak / Simpan PDF</span>
                </button>
                <a href="order.html" class="no-print block text-center text-xs font-semibold text-primary hover:underline">Lihat semua pesanan saya</a>
            </aside>
        </div>`;
 
    renderPaymentQr(o);
    app.querySelectorAll('[data-order-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
            app.querySelectorAll('[data-order-action]').forEach((b) => { b.disabled = true; });
            try {
                const action = btn.dataset.orderAction;
                const updated = action === 'advance' ? advanceOrder(o.id, o.status)
                    : action === 'cancel' ? cancelOrder(o.id) : simulatePayment(o.id, action);
                if (!updated) { renderNotFound(); return; }
                renderOrder(updated);
                toast(updated.status === 'Selesai' ? 'Pesanan selesai' : 'Status pesanan diperbarui');
            } catch (error) {
                const message = document.getElementById('orderError');
                message.textContent = 'Status belum tersimpan. Periksa ruang penyimpanan browser, lalu coba lagi.';
                message.classList.remove('hidden');
                app.querySelectorAll('[data-order-action]').forEach((b) => { b.disabled = false; });
            }
        });
    });
}
