// Katalog produk UMKM Gorontalo. Produk ID 9–27 berasal dari deskripsi produk.pdf.
// Kategori kosong Sadaputea diisi Minuman; Kuliner Khas mengikuti kategori Kuliner.
// Wilayah Gorontalo tanpa rincian dipertahankan; rating yang belum tersedia bernilai null.
const products = [
    {
        id: 1,
        title: "Robusta Coffe 50gr",
        category: "Kopi",
        region: "Bone Bolango",
        price: 20000,
        rating: 4.5,
        reviews: 50,
        seller: "mahafimgorontalo_",
        image: "images/kopi robusta.jpeg",
        description: "Kopi Robusta yang memiliki cita rasa tinggi dengan arome khas.sederhana tapi berkelas cocok untuk yang butuh energi tanpa drama."
    },
    {
        id: 2,
        title: "Thai Smoothies",
        category: "Milk Shake",
        region: "Kota Gorontalo",
        price: 15000,
        rating: 4.8,
        reviews: 54,
        seller: "BY MRT",
        image: "images/Thai Smooties.jpeg",
        description: "Minuman kekinian dengan berbagai rasa yang dicampur dengan keju, white cream, gula pasir dan kental manis."
    },
    {
        id: 3,
        title: "keripik Pisang Keju",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 15000,
        rating: 4.7,
        reviews: 120,
        seller: "Dahlia'Go",
        image: "images/dahlia go.jpeg",
        description: "Keripik pisang dengan rsa keju dari UMKM Dahlia, usaha rumahan yang mengelola makanan di kota gorontalo"
    },
    {
        id: 5,
        title: "Panada Tore ",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 15000,
        rating: 4.9,
        reviews: 210,
        seller: "Bilal Mekar Snack",
        image: "images/panada tore.jpeg",
        description: "Panada kering khas Gorontalo dengan isian abon ikan tuna yang gurih. cocok sebagai camilan dan oleh-oleh."
    },
    {
        id: 9,
        title: "Pisuke 200gr",
        category: "Camilan",
        region: "Kota Gorontalo",
        price: 20000,
        rating: null,
        reviews: 0,
        seller: "IKM Putri",
        image: "images/produk/pisuke.jpeg",
        description: "Keripik pisang dengan perpaduan rasa susu dan keju, cocok untuk camilan dan oleh-oleh khas Gorontalo."
    },
    {
        id: 10,
        title: "Sadaputea Daun Sirsak",
        category: "Minuman",
        region: "Bone Bolango",
        price: 20000,
        rating: null,
        reviews: 0,
        seller: "mafahimgorontalo_",
        image: "images/produk/sadaputea.jpeg",
        description: "Terbuat dari daun sirsak berkualitas, diolah secara higienis untuk menghasilkan seduhan cita rasa khas dan aroma alami."
    },
    {
        id: 11,
        title: "Kacang Bawang",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 17000,
        rating: null,
        reviews: 0,
        seller: "Afikry Gorontalo",
        image: "images/produk/kacang bawang.jpeg",
        description: "Sebuah camilan kacang tanah goreng dengan bumbu bawang putih. Diproduksi secara alami tanpa tambahan pengawet buatan."
    },
    {
        id: 12,
        title: "Dabu Dabu Sagela Kemasan Dus",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 29000,
        rating: null,
        reviews: 0,
        seller: "Afikry Gorontalo",
        image: "images/produk/dabu-dabu sagela.jpeg",
        description: "Menggunakan rajangan daging ikan sagela asap yang dipadukan dengan bumbu-bumbu pedas."
    },
    {
        id: 13,
        title: "Dabu Dabu Sagela Botol",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 45000,
        rating: null,
        reviews: 0,
        seller: "Afikry Gorontalo",
        image: "images/produk/dabu-dabu sagela botol.jpeg",
        description: "Menggunakan rajangan daging ikan sagela asap yang dipadukan dengan bumbu-bumbu pedas."
    },
    {
        id: 14,
        title: "Sari Sirsak",
        category: "Kuliner",
        region: "Bone Bolango",
        price: 15000,
        rating: null,
        reviews: 0,
        seller: "mafahimgorontalo_",
        image: "images/produk/sari sirsak.jpeg",
        description: "Minuman berbahan buah sirsak pilihan yang menghadirkan cita rasa segar dan nikmat dalam setiap tegukan."
    },
    {
        id: 15,
        title: "Tahu Crispy Mini",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 18000,
        rating: null,
        reviews: 0,
        seller: "Rumahcicila.gto",
        image: "images/produk/tahu krispi mini.jpeg",
        description: "Dibuat dari 100% tahu pilihan dan dipadukan dengan bumbu racikan berkualitas menghasilkan cita rasa modern dan enak sehingga cocok untuk cemilan atau teman hidangan keluarga."
    },
    {
        id: 16,
        title: "Keripik Tempe",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 18000,
        rating: null,
        reviews: 0,
        seller: "Rumahcicila.gto",
        image: "images/produk/keripik tempe.jpeg",
        description: "Dibuat dari 100% kedelai pilihan dan dipadukan dengan bumbu racikan berkualitas menghasilkan cita rasa modern dan enak sehingga cocok untuk cemilan atau teman hidangan keluarga."
    },
    {
        id: 17,
        title: "Sambal Sagela",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 36000,
        rating: null,
        reviews: 0,
        seller: "Bilal Mekar Snack",
        image: "images/produk/sambal sagela.jpeg",
        description: "Nikmati sensasi pedas dan gurih dalam setiap sendok Sambal Sagela/Roa khas Gorontalo! Dibuat dengan bahan utama ikan roa pilihan yang diolah secara tradisional, sambal ini menghadirkan cita rasa khas dari Gorontalo yang sulit dilupakan."
    },
    {
        id: 18,
        title: "Sambal Cumi",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 36000,
        rating: null,
        reviews: 0,
        seller: "Bilal Mekar Snack",
        image: "images/produk/sambal cumi.jpeg",
        description: "Nikmati cita rasa autentik sambal cumi khas Gorontalo yang siap memanjakan lidah Anda! Dibuat dari bahan-bahan pilihan, sambal ini menggabungkan kesegaran cumi yang lezat dengan bumbu rempah tradisional yang kaya, memberikan sensasi pedas yang pas untuk menemani berbagai hidangan."
    },
    {
        id: 19,
        title: "Fish Crispy",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 36000,
        rating: null,
        reviews: 0,
        seller: "Bilal Mekar Snack",
        image: "images/produk/fish crispy.jpeg",
        description: "Dibuat dari Ikan Nike, sejenis ikan teri air tawar yang merupakan kekayaan endemik perairan Gorontalo, camilan ini diolah dengan bumbu tradisional dan digoreng hingga garing sempurna, menjadikannya lauk kering sekaligus snack yang lezat."
    },
    {
        id: 20,
        title: "Abon Ikan Tuna",
        category: "Kuliner",
        region: "Kota Gorontalo",
        price: 20000,
        rating: null,
        reviews: 0,
        seller: "Bilal Mekar Snack",
        image: "images/produk/abon ikan tuna.jpeg",
        description: "Abon ikan tuna dari Bilal Mekar Snack, Gorontalo."
    },
    {
        id: 21,
        title: "Keripik Pisang Goroho",
        category: "Kuliner",
        region: "Gorontalo",
        price: 20000,
        rating: null,
        reviews: 0,
        seller: "Mhita Totabuan Gorontalo",
        image: "images/produk/keripik pisang goroho.jpeg",
        description: "Keripik berbahan pisang Goroho, salah satu jenis pisang khas Sulawesi. Diiris tipis dan digoreng hingga renyah tanpa menggunakan pengawet buatan. Memiliki cita rasa original dan tekstur yang tidak berminyak."
    },
    {
        id: 22,
        title: "Keripik Pisang Goroho Susu Keju",
        category: "Kuliner",
        region: "Gorontalo",
        price: 25000,
        rating: null,
        reviews: 0,
        seller: "Mhita Totabuan Gorontalo",
        image: "images/produk/keripik pisang goroho susu keju.jpeg",
        description: "Olahan pisang Goroho khas Sulawesi yang dipotong tipis dan digoreng hingga renyah, kemudian dipadukan dengan susu dan keju. Menghasilkan perpaduan rasa gurih dan manis dengan bahan baku lokal."
    },
    {
        id: 23,
        title: "Keker Cookies",
        category: "Kuliner",
        region: "Gorontalo",
        price: 19000,
        rating: null,
        reviews: 0,
        seller: "Rahida Cookies Gorontalo",
        image: "images/produk/keker cookies.jpeg",
        description: "Kue kering khas Gorontalo yang dibuat menggunakan kelapa parut sebagai bahan utama. Tersedia dalam varian original, gula aren, serta kombinasi rasa cokelat dan keju. Cocok dijadikan camilan maupun oleh-oleh."
    },
    {
        id: 24,
        title: "Biji Biji",
        category: "Kuliner",
        region: "Gorontalo",
        price: 19000,
        rating: null,
        reviews: 0,
        seller: "Rahida Cookies Gorontalo",
        image: "images/produk/biji biji.jpeg",
        description: "Kue kering khas Gorontalo yang dibuat dari campuran tepung terigu, biji ketapang, kacang, bawang, spekuk, jagung, dan wijen. Memiliki beberapa varian rasa sehingga menawarkan pilihan camilan dengan cita rasa tradisional."
    },
    {
        id: 25,
        title: "Gutcookies Vanilla",
        category: "Kuliner",
        region: "Gorontalo",
        price: 15000,
        rating: null,
        reviews: 0,
        seller: "Rahida Cookies Gorontalo",
        image: "images/produk/gutcookies vanilla.jpeg",
        description: "Kue kering dengan cita rasa vanilla yang dibuat dari campuran tepung terigu, margarin, maizena, telur, gula halus, susu bubuk, dan butter. Memiliki tekstur renyah serta rasa manis yang cocok sebagai camilan."
    },
    {
        id: 26,
        title: "Gutcookies Coklat Strawberry",
        category: "Kuliner",
        region: "Gorontalo",
        price: 15000,
        rating: null,
        reviews: 0,
        seller: "Rahida Cookies Gorontalo",
        image: "images/produk/gutcookies coklat strawberry.jpeg",
        description: "Kue kering dengan perpaduan rasa cokelat dan stroberi. Dibuat dari tepung terigu, margarin, maizena, susu bubuk, butter, cokelat batang rasa stroberi, dan gula halus. Menawarkan camilan manis dengan kombinasi rasa yang menarik."
    },
    {
        id: 27,
        title: "Bakpia Ubi Ungu",
        category: "Kuliner",
        region: "Gorontalo",
        price: 40000,
        rating: null,
        reviews: 0,
        seller: "Bakers Afa Gorontalo",
        image: "images/produk/bakpia ubi ungu.jpeg",
        description: "Bakpia dengan cita rasa autentik ubi ungu yang dibuat dari tepung terigu, air, butter, garam, minyak kelapa, dan ubi ungu. Menghadirkan perpaduan kulit bakpia yang lembut dengan cita rasa ubi ungu sebagai bahan utama."
    }
];
 
/* =====================================================================
   KONFIGURASI TOKO  —  EDIT BAGIAN INI SESUAI DATA ASLI KAMU
   ===================================================================== */
const CONFIG = {
    storeName: 'GorontaloMarket',
    // Nomor WhatsApp admin penerima pesanan (format 62xxxxxxxxxx, tanpa +)
    adminWhatsApp: '6282152720849',
    // Gratis ongkir kurir lokal jika subtotal (setelah diskon) >= nilai ini. 0 = nonaktif
    freeLocalShippingMin: 500000,
    // Ongkir Kurir Lokal per wilayah tujuan (Rp)
    localShippingByRegion: {
        'Kota Gorontalo': 10000,
        'Kab. Gorontalo': 15000,
        'Bone Bolango': 15000,
        'Gorontalo Utara': 25000,
        'Boalemo': 25000,
        'Pohuwato': 30000
    },
    // Konfigurasi untuk menampilkan pesanan bank/QRIS lama.
    banks: [
        { id: 'bni', name: 'Transfer Bank BNI', accountNumber: '', accountHolder: '' },
        { id: 'bri', name: 'Transfer Bank BRI', accountNumber: '', accountHolder: '' },
        { id: 'bca', name: 'Transfer Bank BCA', accountNumber: '', accountHolder: '' }
    ],
    // Isi hanya dengan payload QRIS merchant resmi dari penyedia pembayaran.
    // Jika kosong, QR hanya memuat detail pesanan tanpa data pribadi pembeli.
    qris: { merchantPayload: '', merchantName: 'GorontaloMarket' },
    // PIN masuk halaman admin.html (demo saja; bukan keamanan sungguhan karena terlihat di kode)
    adminPin: '1234',                                                            // TODO: ganti
    // Kupon: kode -> persentase diskon
    coupons: { 'HULONTHALO10': 0.10 }
};
 
const REGIONS = Object.keys(CONFIG.localShippingByRegion);
 
/* ===================== Helper umum ===================== */
const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
 
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
 
function storageGet(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* abaikan */ }
}

/* ===================== Favorit (disimpan di browser) ===================== */
const FAVORITES_STORAGE_KEY = 'gm_favorites';
function readFavorites() {
    const saved = storageGet(FAVORITES_STORAGE_KEY, []);
    if (!Array.isArray(saved)) return [];
    // Abaikan duplikat, data tidak valid, dan produk yang sudah dihapus.
    return [...new Set(saved.filter(id => products.some(product => product.id === id)))];
}
function toggleFavorite(productId) {
    const current = readFavorites();
    if (!products.some(product => product.id === productId)) return current;
    const next = current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId];
    // Tampilkan keberhasilan hanya setelah favorit berhasil disimpan.
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    return next;
}
 
/* ===================== Keranjang (disimpan di browser) ===================== */
// Yang disimpan hanya {id, qty}; harga selalu diambil dari katalog agar tidak bisa dimanipulasi.
function readCart() {
    const raw = storageGet('gm_cart', []);
    if (!Array.isArray(raw)) return [];
    return raw
        .map((r) => {
            const p = products.find((x) => x.id === r.id);
            const qty = Math.min(Math.max(parseInt(r.qty, 10) || 0, 0), 99);
            return p && qty > 0 ? { ...p, qty } : null;
        })
        .filter(Boolean);
}
function writeCart(items) {
    storageSet('gm_cart', items.map((i) => ({ id: i.id, qty: i.qty })));
}
function getCouponCode() { return storageGet('gm_coupon', ''); }
function setCouponCode(code) { storageSet('gm_coupon', code || ''); }
function couponRate(code) { return CONFIG.coupons[(code || '').toUpperCase()] || 0; }
 
/* ===================== Perhitungan ===================== */
function calcSubtotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
 
// Daftar metode pengiriman. cost = null berarti belum bisa dihitung (wilayah belum dipilih)
function getShippingOptions(region, subtotalAfterDiscount) {
    const hasRegion = Object.prototype.hasOwnProperty.call(CONFIG.localShippingByRegion, region);
    let localCost = hasRegion ? CONFIG.localShippingByRegion[region] : null;
    let localNote = 'Estimasi tiba 1–2 hari';
    if (hasRegion && CONFIG.freeLocalShippingMin > 0 && subtotalAfterDiscount >= CONFIG.freeLocalShippingMin) {
        localCost = 0;
        localNote += ' • GRATIS ongkir';
    }
    return [
        { id: 'local', name: 'Kurir Lokal Gorontalo', note: localNote, cost: localCost, icon: 'fa-motorcycle' }
    ];
}

// Pembayaran pesanan baru dilanjutkan bersama admin melalui WhatsApp.
function getPaymentOptions() {
    return [
        { id: 'whatsapp', name: 'WhatsApp', note: 'Lanjutkan pembayaran dengan admin. Rincian pesanan akan terisi di pesan WhatsApp.', icon: 'fa-comments', enabled: true }
    ];
}

function getWhatsAppUrl(message) {
    return `https://wa.me/${CONFIG.adminWhatsApp}?text=${encodeURIComponent(message)}`;
}

function getOrderWhatsAppUrl(order) {
    const { buyer, totals } = order;
    const lines = [
        `Halo ${CONFIG.storeName}, saya ingin membayar pesanan berikut:`,
        `Nomor pesanan: ${order.id}`,
        '',
        'Produk:',
        ...order.items.map((item, index) =>
            `${index + 1}. ${item.title.trim()}\n   Penjual: ${item.seller}\n   ${item.qty} x ${rupiah(item.price)} = ${rupiah(item.qty * item.price)}`),
        '',
        `Subtotal: ${rupiah(totals.subtotal)}`,
        `Diskon${order.coupon ? ` (${order.coupon})` : ''}: ${rupiah(totals.discount)}`,
        `Ongkir (${order.shipping.name}): ${rupiah(totals.shipping)}`,
        `Total pembayaran: ${rupiah(totals.total)}`,
        '',
        'Data penerima:',
        `Nama: ${buyer.fullName}`,
        `WhatsApp: +${buyer.phone}`,
        `Alamat: ${buyer.address}, ${buyer.region}${buyer.postal ? ' ' + buyer.postal : ''}`
    ];
    if (buyer.note) lines.push(`Catatan: ${buyer.note}`);
    lines.push('', 'Mohon informasi ketersediaan produk dan cara pembayarannya. Terima kasih.');
    return getWhatsAppUrl(lines.join('\n'));
}

function calcTotals(items, couponCode, shippingCost) {
    const subtotal = calcSubtotal(items);
    const discount = Math.round(subtotal * couponRate(couponCode));
    const shipping = shippingCost || 0;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
 
/* ===================== Pesanan lokal (kunci lama dipertahankan) ===================== */
const ORDER_STORAGE_KEY = 'gm_sandbox_orders';
const BUYER_STORAGE_KEY = 'gm_sandbox_buyer';
const FLOW_ONLINE = ['Menunggu Pembayaran', 'Pembayaran Selesai', 'Diproses', 'Dikirim', 'Selesai'];

function newOrderId() {
    return 'GM-' + crypto.randomUUID();
}
function getOrders() {
    const orders = storageGet(ORDER_STORAGE_KEY, []);
    return Array.isArray(orders) ? orders : [];
}
// Penyimpanan pesanan harus berhasil sebelum keranjang dikosongkan/status ditampilkan.
function persistOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}
function saveOrder(order) {
    const orders = getOrders();
    if (orders.some((o) => o.id === order.id)) return;
    persistOrders([order, ...orders]);
}
function getOrder(id) { return getOrders().find((o) => o.id === id) || null; }
function getFlow() { return FLOW_ONLINE; }
function isPaid(order) { return order.paymentStatus === 'paid'; }
function nextStatus(order) {
    const i = FLOW_ONLINE.indexOf(order.status);
    return i >= 0 && i < FLOW_ONLINE.length - 1 ? FLOW_ONLINE[i + 1] : null;
}
function updateOrder(id, mutate) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    mutate(order);
    persistOrders(orders);
    return order;
}
function simulatePayment(id, outcome) {
    if (!['success', 'failed'].includes(outcome)) return null;
    return updateOrder(id, (o) => {
        if (!o.sandbox || o.status !== 'Menunggu Pembayaran' || isPaid(o)) return;
        const at = new Date().toISOString();
        o.paymentAttempts = [...(o.paymentAttempts || []), { outcome, at }];
        o.paymentStatus = outcome === 'success' ? 'paid' : 'failed';
        if (outcome === 'success') {
            o.status = 'Pembayaran Selesai';
            o.paidAt = at;
        }
    });
}
// Setiap klik hanya memajukan status yang masih sama dengan saat tombol ditampilkan.
function advanceOrder(id, expectedStatus) {
    return updateOrder(id, (o) => {
        if (!o.sandbox || !isPaid(o) || o.status === 'Dibatalkan') return;
        if (expectedStatus && o.status !== expectedStatus) return;
        const next = nextStatus(o);
        if (!next) return;
        o.status = next;
        const field = { Diproses: 'processedAt', Dikirim: 'shippedAt', Selesai: 'completedAt' }[next];
        if (field) o[field] = new Date().toISOString();
    });
}
function cancelOrder(id) {
    return updateOrder(id, (o) => {
        if (o.sandbox && !isPaid(o) && o.status === 'Menunggu Pembayaran') o.status = 'Dibatalkan';
    });
}
