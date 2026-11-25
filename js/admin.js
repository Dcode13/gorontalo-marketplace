// Halaman admin (demo, tanpa server). Bergantung pada js/data.js.
// PIN hanya pembatas sederhana: terlihat di kode, jadi bukan keamanan sungguhan.
 
const $ = (id) => document.getElementById(id);
 
function authed() { try { return sessionStorage.getItem('gm_admin') === '1'; } catch (e) { return false; } }
function setAuthed(v) { try { v ? sessionStorage.setItem('gm_admin', '1') : sessionStorage.removeItem('gm_admin'); } catch (e) { /* abaikan */ } }
 
document.addEventListener('DOMContentLoaded', () => {
    $('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if ($('pinInput').value === CONFIG.adminPin) {
            setAuthed(true);
            $('pinError').classList.add('hidden');
            show();
        } else {
            $('pinError').classList.remove('hidden');
            $('pinInput').value = '';
        }
    });
    $('logoutBtn').addEventListener('click', () => { setAuthed(false); show(); });
    $('filter').addEventListener('change', renderList);
 
    $('orderList').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.dataset.act === 'advance') {
            const order = getOrder(id);
            if (order && !isPaid(order)) simulatePayment(id, 'success');
            else if (order) advanceOrder(id, order.status);
        } else if (btn.dataset.act === 'cancel') {
            if (!confirm('Batalkan pesanan ' + id + '?')) return;
            cancelOrder(id);
        }
        render();
    });
 
    // Pesanan baru dari tab lain muncul otomatis
    window.addEventListener('storage', (e) => { if (e.key === ORDER_STORAGE_KEY && authed()) render(); });
 
    show();
});
 
function show() {
    const ok = authed();
    $('loginView').classList.toggle('hidden', ok);
    $('dashView').classList.toggle('hidden', !ok);
    $('logoutBtn').classList.toggle('hidden', !ok);
    if (ok) render();
}
 
function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}
 
function statusBadge(status) {
    const cls = status === 'Dibatalkan' ? 'bg-red-100 text-red-700'
        : (status === 'Menunggu Pembayaran') ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700';
    return `<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cls}">${esc(status)}</span>`;
}
 
function render() { renderStats(); renderList(); }
 
function renderStats() {
    const orders = getOrders();
    const active = orders.filter((o) => o.status !== 'Dibatalkan');
    const unpaid = active.filter((o) => !isPaid(o)).length;
    const paidSum = orders.filter(isPaid).reduce((s, o) => s + o.totals.total, 0);
    const card = (label, val, color) => `
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div class="text-[11px] text-slate-500 font-medium">${label}</div>
            <div class="text-xl font-black ${color} mt-1">${val}</div>
        </div>`;
    $('stats').innerHTML =
        card('Total Pesanan', orders.length, 'text-slate-900') +
        card('Menunggu Pembayaran', unpaid, 'text-amber-600') +
        card('Pembayaran Selesai', orders.filter(isPaid).length, 'text-primary') +
        card('Total Pembayaran Simulasi', rupiah(paidSum), 'text-primary');
}
 
function renderList() {
    const f = $('filter').value;
    let orders = getOrders();
    if (f === 'unpaid') orders = orders.filter((o) => !isPaid(o) && o.status !== 'Dibatalkan');
    if (f === 'paid') orders = orders.filter(isPaid);
    if (f === 'done') orders = orders.filter((o) => o.status === 'Selesai');
    if (f === 'cancelled') orders = orders.filter((o) => o.status === 'Dibatalkan');
 
    if (orders.length === 0) {
        $('orderList').innerHTML = `
            <div class="text-center py-16 text-slate-400">
                <i class="fa-solid fa-box-open text-3xl mb-2"></i>
                <p class="text-xs">Belum ada pesanan pada tampilan ini.</p>
            </div>`;
        return;
    }
    $('orderList').innerHTML = orders.map(orderCard).join('');
}
 
function orderCard(o) {
    const paid = isPaid(o);
    const cancelled = o.status === 'Dibatalkan';
    const next = nextStatus(o);
 
    let actionLabel = '';
    if (next) {
        actionLabel = (next === 'Pembayaran Selesai') ? 'Simulasikan Pembayaran Selesai' : 'Lanjut: ' + next;
    }
    const canAct = !cancelled && next;
    const canCancel = !cancelled && !paid && o.status !== 'Selesai';
    const addr = `${o.buyer.address}, ${o.buyer.region}`;
 
    return `
    <article class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <div class="text-sm font-black text-slate-900">${esc(o.id)}</div>
                <div class="text-[11px] text-slate-500">${esc(formatDate(o.createdAt))}</div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
                ${statusBadge(o.status)}
                ${paid
                    ? '<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">LUNAS</span>'
                    : (cancelled ? '' : '<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">BELUM DIBAYAR</span>')}
            </div>
        </div>
 
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
                <div class="font-bold text-slate-700 mb-1">Pembeli</div>
                <div class="text-slate-800 font-semibold">${esc(o.buyer.fullName)}</div>
                <div class="text-slate-500">+${esc(o.buyer.phone)}</div>
                <div class="text-slate-500">${esc(addr)}</div>
                ${o.buyer.note ? `<div class="text-slate-500 italic mt-1">Catatan: ${esc(o.buyer.note)}</div>` : ''}
            </div>
            <div>
                <div class="font-bold text-slate-700 mb-1">Produk</div>
                <ul class="space-y-0.5 text-slate-600">
                    ${o.items.map((i) => `<li>${i.qty}x ${esc(i.title)} <span class="text-slate-400">(${esc(i.seller)})</span></li>`).join('')}
                </ul>
            </div>
        </div>
 
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
            <div class="text-xs text-slate-500">
                ${esc(o.payment.name)} • ${esc(o.shipping.name)}<br>
                <span class="text-base font-black text-primary">${rupiah(o.totals.total)}</span>
                ${paid && o.paidAt ? `<span class="text-[11px] text-emerald-700 ml-1">dibayar ${esc(formatDate(o.paidAt))}</span>` : ''}
            </div>
            <div class="flex items-center gap-2">
                ${canCancel ? `<button data-act="cancel" data-id="${esc(o.id)}" class="px-3 py-2 text-xs font-semibold text-accent hover:bg-red-50 rounded-xl transition">Batalkan</button>` : ''}
                ${canAct ? `<button data-act="advance" data-id="${esc(o.id)}" class="px-4 py-2 text-xs font-bold bg-primary hover:bg-emerald-800 text-white rounded-xl shadow transition">${esc(actionLabel)}</button>` : ''}
            </div>
        </div>
    </article>`;
}
 
