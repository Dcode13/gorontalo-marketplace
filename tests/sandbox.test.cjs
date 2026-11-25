const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
function sandbox() {
    const entries = new Map();
    const localStorage = { getItem: key => entries.get(key) ?? null, setItem: (key,value) => entries.set(key,value) };
    const context = vm.createContext({ localStorage, crypto: webcrypto });
    vm.runInContext(readFileSync(require('node:path').join(__dirname, '../js/data.js'), 'utf8'), context);
    return { run: code => vm.runInContext(code,context), entries, localStorage };
}
function seed(run, method='bni') {
    run(`saveOrder({id:'test',sandbox:true,status:'Menunggu Pembayaran',paymentStatus:'pending',payment:{id:'${method}'}})`);
}
test('checkout menggunakan WhatsApp dan kurir lokal; tarif sesuai wilayah', () => {
    const { run } = sandbox();
    assert.equal(run('getPaymentOptions().map(p=>p.id).join(",")'),'whatsapp');
    assert.equal(run('getShippingOptions("Kota Gorontalo",20000).map(p=>p.id).join(",")'),'local');
    for(const [r,c] of [['Kota Gorontalo',10000],['Kab. Gorontalo',15000],['Bone Bolango',15000],['Gorontalo Utara',25000],['Boalemo',25000],['Pohuwato',30000]]) assert.equal(run(`getShippingOptions('${r}',20000)[0].cost`),c);
    for(const r of ['', 'Gorontalo', 'toString']) assert.equal(run(`getShippingOptions('${r}',20000)[0].cost`),null);
});
test('ongkir gratis setelah diskon, tepat batas Rp500.000', () => {
    const { run } = sandbox();
    assert.equal(run('getShippingOptions("Kota Gorontalo",500000)[0].cost'),0);
    assert.equal(run('getShippingOptions("Kota Gorontalo",499999)[0].cost'),10000);
    assert.equal(run('const t=calcTotals([{price:500000,qty:1}],"HULONTHALO10",10000);t.total'),460000);
    assert.equal(run('getShippingOptions("Kota Gorontalo",t.subtotal-t.discount)[0].cost'),10000);
});
for(const method of ['bni','bri','bca','qris']) test(`${method}: gagal, coba lagi, terbayar, diproses, dikirim, selesai`, () => {
    const { run }=sandbox();seed(run,method);
    run('advanceOrder("test")');assert.equal(run('getOrder("test").status'),'Menunggu Pembayaran');
    run('simulatePayment("test","failed")');assert.equal(run('getOrder("test").paymentStatus'),'failed');
    run('simulatePayment("test","success")');const paidAt=run('getOrder("test").paidAt');
    run('simulatePayment("test","success");simulatePayment("test","failed")');
    assert.equal(run('getOrder("test").paymentAttempts.length'),2);assert.equal(run('getOrder("test").paidAt'),paidAt);
    assert.equal(run('getOrder("test").paymentStatus'),'paid');
    run('advanceOrder("test","Pembayaran Selesai");advanceOrder("test","Pembayaran Selesai")');
    assert.equal(run('getOrder("test").status'),'Diproses');
    run('advanceOrder("test","Diproses");advanceOrder("test","Dikirim");advanceOrder("test","Selesai")');
    assert.equal(run('getOrder("test").status'),'Selesai');assert.ok(run('getOrder("test").completedAt'));
});
test('pesanan batal tidak bisa dibayar; pesanan lunas tidak bisa dibatalkan', () => {
    const { run }=sandbox();seed(run);
    run('cancelOrder("test");simulatePayment("test","success");advanceOrder("test")');
    assert.equal(run('getOrder("test").status'),'Dibatalkan');assert.equal(run('getOrder("test").paymentStatus'),'pending');
    run('saveOrder({id:"paid",sandbox:true,status:"Pembayaran Selesai",paymentStatus:"paid"});cancelOrder("paid")');
    assert.equal(run('getOrder("paid").status'),'Pembayaran Selesai');
});
test('pesanan lama terpisah, non-sandbox tidak bisa disimulasikan, ID unik', () => {
    const { run,entries }=sandbox();entries.set('gm_orders','[{"id":"legacy"}]');seed(run);seed(run);
    assert.equal(run('getOrders().length'),1);assert.equal(entries.get('gm_orders'),'[{"id":"legacy"}]');
    run('saveOrder({id:"other",status:"Menunggu Pembayaran",paymentStatus:"pending"});simulatePayment("other","success")');
    assert.equal(run('getOrder("other").paymentStatus'),'pending');assert.equal(run('new Set(Array.from({length:100},newOrderId)).size'),100);
});
test('penyimpanan gagal tidak menghasilkan status sukses atau pesanan baru', () => {
    const { run,localStorage }=sandbox();seed(run);localStorage.setItem=()=>{throw new Error('QuotaExceededError');};
    assert.throws(()=>run('simulatePayment("test","success")'));assert.equal(run('getOrder("test").paymentStatus'),'pending');
    assert.throws(()=>run('saveOrder({id:"new"})'));assert.equal(run('getOrder("new")'),null);
});
