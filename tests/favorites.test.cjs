const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function fixture(entries = new Map()) {
    const localStorage = {
        getItem: key => entries.get(key) ?? null,
        setItem: (key, value) => entries.set(key, value)
    };
    const context = vm.createContext({ localStorage });
    vm.runInContext(readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), context);
    return { entries, localStorage, run: code => vm.runInContext(code, context) };
}

test('favorit tersimpan setelah muat ulang dan klik ulang menghapusnya', () => {
    const { run, entries } = fixture();
    assert.equal(run('readFavorites().length'), 0);
    assert.equal(run('toggleFavorite(1).join(",")'), '1');
    assert.equal(run('toggleFavorite(5).join(",")'), '1,5');
    const reloaded = fixture(entries);
    assert.equal(reloaded.run('readFavorites().join(",")'), '1,5');
    assert.equal(reloaded.run('toggleFavorite(1).join(",")'), '5');
    assert.equal(reloaded.run('toggleFavorite(5).length'), 0);
    assert.equal(entries.get('gm_favorites'), '[]');
});

test('favorit mengabaikan data rusak, duplikat, dan produk yang dihapus', () => {
    const { run, entries } = fixture();
    for (const value of ['invalid json', 'null', '{}', '"1"', '123']) {
        entries.set('gm_favorites', value);
        assert.equal(run('readFavorites().length'), 0);
    }
    entries.set('gm_favorites', JSON.stringify([1, 1, '1', 4, 6, 7, 8, 5, null, {}, 999]));
    assert.equal(run('readFavorites().join(",")'), '1,5');
    assert.equal(run('toggleFavorite(4).join(",")'), '1,5');
    assert.equal(run('toggleFavorite(2).join(",")'), '1,5,2');
    assert.equal(entries.get('gm_favorites'), '[1,5,2]');
});

test('perubahan dari tab lain dipertahankan saat menyimpan favorit berikutnya', () => {
    const entries = new Map();
    const first = fixture(entries);
    const second = fixture(entries);
    first.run('toggleFavorite(1)');
    second.run('toggleFavorite(5)');
    assert.equal(first.run('toggleFavorite(2).join(",")'), '1,5,2');
    second.run('toggleFavorite(1)');
    assert.equal(first.run('readFavorites().join(",")'), '5,2');
});

test('kegagalan penyimpanan favorit tidak menghapus data atau mengubah keranjang', () => {
    const { run, entries, localStorage } = fixture();
    entries.set('gm_cart', '[{"id":1,"qty":2}]');
    run('toggleFavorite(5)');
    localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.throws(() => run('toggleFavorite(5)'), /QuotaExceededError/);
    assert.equal(run('readFavorites().join(",")'), '5');
    assert.equal(entries.get('gm_cart'), '[{"id":1,"qty":2}]');
});
