const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function fixture() {
    const ctx = vm.createContext({});
    for (const file of ['js/data.js','js/payment-qr.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),ctx);
    vm.runInContext(`const order={id:'GM-123',totals:{total:28000},buyer:{fullName:'Rahasia',phone:'081234567890',address:'Alamat Rahasia'}};`,ctx);
    return code=>vm.runInContext(code,ctx);
}
test('QR pesanan memuat nomor dan total tanpa membocorkan data pembeli',()=>{
    const run=fixture();
    assert.equal(run('getPaymentQr(order).kind'),'order');
    const payload=run('getPaymentQr(order).payload');
    assert.match(payload,/GM-123/);assert.match(payload,/Rp 28\.000/);
    assert.match(payload,/bukan instruksi transfer/);
    assert.doesNotMatch(payload,/Rahasia|081234567890/);
    run('order.totals.total=45000');assert.match(run('getPaymentQr(order).payload'),/Rp 45\.000/);
});
test('payload merchant yang disediakan diteruskan utuh',()=>{
    const run=fixture();
    run("CONFIG.qris.merchantPayload='PAYLOAD-DARI-PENYEDIA';");
    assert.equal(run('getPaymentQr(order).kind'),'merchant');
    assert.equal(run('getPaymentQr(order).payload'),'PAYLOAD-DARI-PENYEDIA');
});
