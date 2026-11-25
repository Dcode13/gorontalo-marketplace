const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function fixture() {
    const entries = new Map();
    const localStorage = {
        getItem: key => entries.get(key) ?? null,
        setItem: (key, value) => entries.set(key, value)
    };
    const context = vm.createContext({ localStorage });
    const run = code => vm.runInContext(code, context);
    run(readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'));
    run(`
        const items = [
            { ...products.find(p => p.id === 1), qty: 2 },
            { ...products.find(p => p.id === 5), qty: 3 }
        ];
        const order = {
            id: 'GM-TEST', sandbox: false, status: 'Menunggu Pembayaran', paymentStatus: 'pending',
            payment: { id: 'whatsapp', name: 'WhatsApp' },
            items, coupon: 'HULONTHALO10',
            shipping: { name: 'Kurir Lokal Gorontalo', cost: 10000 },
            totals: calcTotals(items, 'HULONTHALO10', 10000),
            buyer: { fullName: 'Pembeli Uji', phone: '628111111111', address: 'Jalan Uji Nomor 10',
                region: 'Kota Gorontalo', postal: '96111', note: '' }
        };
    `);
    return { run, entries };
}

test('produk yang dihapus tidak tampil di katalog maupun keranjang tersimpan', () => {
    const { run, entries } = fixture();
    entries.set('gm_cart', JSON.stringify([1, 4, 5, 6, 7, 8].map(id => ({ id, qty: 2 }))));
    assert.equal(run('products.length'), 23);
    assert.equal(run('products.some(p => [4, 6, 7, 8].includes(p.id))'), false);
    assert.equal(run('readCart().map(p => p.id).join(",")'), '1,5');
    assert.equal(run('calcSubtotal(readCart())'), 70000);
});

test('tautan WhatsApp menuju admin dengan semua produk, jumlah, diskon dan ongkir', () => {
    const { run } = fixture();
    const url = new URL(run('getOrderWhatsAppUrl(order)'));
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/6282152720849');
    const message = url.searchParams.get('text');
    for (const expected of [
        'Nomor pesanan: GM-TEST',
        '1. Robusta Coffe 50gr', 'Penjual: mahafimgorontalo_', '2 x Rp 20.000 = Rp 40.000',
        '2. Panada Tore\n', 'Penjual: Bilal Mekar Snack', '3 x Rp 15.000 = Rp 45.000',
        'Subtotal: Rp 85.000', 'Diskon (HULONTHALO10): Rp 8.500',
        'Ongkir (Kurir Lokal Gorontalo): Rp 10.000', 'Total pembayaran: Rp 86.500',
        'Nama: Pembeli Uji', 'WhatsApp: +628111111111',
        'Alamat: Jalan Uji Nomor 10, Kota Gorontalo 96111'
    ]) assert.ok(message.includes(expected), `Pesan harus memuat: ${expected}`);
    assert.doesNotMatch(message, /undefined|null|Catatan:/);
});

test('karakter khusus dan baris baru tidak merusak parameter pesan WhatsApp', () => {
    const { run } = fixture();
    run(`
        order.items[0].title = "Kopi & Camilan #1 + 50% 'Spesial' ☕";
        order.buyer.note = 'Bungkus & pisahkan #2 + sendok\\nTerima kasih 🙏';
        order.buyer.postal = '';
        order.coupon = '';
        order.shipping.cost = 0;
        order.totals = calcTotals(order.items, '', 0);
    `);
    const url = new URL(run('getOrderWhatsAppUrl(order)'));
    assert.equal(url.hash, '');
    assert.deepEqual([...url.searchParams.keys()], ['text']);
    const message = url.searchParams.get('text');
    assert.ok(message.includes("Kopi & Camilan #1 + 50% 'Spesial' ☕"));
    assert.ok(message.includes('Catatan: Bungkus & pisahkan #2 + sendok\nTerima kasih 🙏'));
    assert.ok(message.includes('Diskon: Rp 0'));
    assert.ok(message.includes('Ongkir (Kurir Lokal Gorontalo): Rp 0'));
    assert.ok(message.includes('Total pembayaran: Rp 85.000'));
});

test('tautan pembayaran memakai snapshot pesanan dan tidak menandainya lunas', () => {
    const { run } = fixture();
    const originalUrl = run('saveOrder(order); getOrderWhatsAppUrl(order)');
    run(`
        products.find(p => p.id === 1).price = 999999;
        getOrderWhatsAppUrl(getOrder('GM-TEST'));
        simulatePayment('GM-TEST', 'success');
        advanceOrder('GM-TEST');
    `);
    assert.equal(run("getOrderWhatsAppUrl(getOrder('GM-TEST'))"), originalUrl);
    assert.equal(run("getOrder('GM-TEST').status"), 'Menunggu Pembayaran');
    assert.equal(run("getOrder('GM-TEST').paymentStatus"), 'pending');
});
