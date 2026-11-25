// Data produk, konfigurasi & helper ada di js/data.js
let cart = readCart();
let currentCategory = 'all';
let currentRegion = 'all';
let currentSearch = '';
let discountRate = couponRate(getCouponCode());
let favoriteIds = readFavorites();
let showFavoritesOnly = false;
let favoriteStatusTimer;
 
// DOM Elements
const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesCount = document.getElementById('favoritesCount');
const showAllProductsBtn = document.getElementById('showAllProductsBtn');
const favoriteStatus = document.getElementById('favoriteStatus');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItemsList = document.getElementById('cartItemsList');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDiscount = document.getElementById('cartDiscount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const couponMessage = document.getElementById('couponMessage');
 
// Modal Elements
const productModal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImg = document.getElementById('modalImg');
const modalCategoryBadge = document.getElementById('modalCategoryBadge');
const modalLocation = document.getElementById('modalLocation');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalSeller = document.getElementById('modalSeller');
const modalSellerInitial = document.getElementById('modalSellerInitial');
const modalAddToCart = document.getElementById('modalAddToCart');
const modalChatSeller = document.getElementById('modalChatSeller');
const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
 
// Store Modal Elements
const openStoreBtn = document.getElementById('openStoreBtn');
const heroOpenStore = document.getElementById('heroOpenStore');
const storeModal = document.getElementById('storeModal');
const storeBackdrop = document.getElementById('storeBackdrop');
const closeStoreModalBtn = document.getElementById('closeStoreModalBtn');
const storeForm = document.getElementById('storeForm');
 
// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    updateCart();
    const savedCoupon = getCouponCode();
    if (savedCoupon && discountRate > 0) {
        couponInput.value = savedCoupon;
        couponMessage.textContent = "✅ Kupon berhasil digunakan! Diskon " + Math.round(discountRate * 100) + "%.";
        couponMessage.className = "text-xs font-semibold text-emerald-600";
    }
});
 
// Render Products function
function renderProducts() {
    productGrid.innerHTML = '';
    document.getElementById('catalogTitle').textContent = showFavoritesOnly ? 'Produk Favorit' : 'Katalog Produk UMKM';
    document.getElementById('catalogDescription').textContent = showFavoritesOnly
        ? `${favoriteIds.length} produk tersimpan di favorit Anda`
        : 'Pilih wilayah atau kategori produk yang ingin Anda temukan';
    showAllProductsBtn.classList.toggle('hidden', !showFavoritesOnly);
    
    const filtered = products.filter(p => {
        const matchCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchRegion = currentRegion === 'all' || p.region === currentRegion;
        const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                            p.seller.toLowerCase().includes(currentSearch.toLowerCase()) ||
                            p.description.toLowerCase().includes(currentSearch.toLowerCase());
        const matchFavorite = !showFavoritesOnly || favoriteIds.includes(p.id);
        return matchCategory && matchRegion && matchSearch && matchFavorite;
    });

    emptyState.classList.toggle('hidden', filtered.length > 0);
    const noFavorites = showFavoritesOnly && favoriteIds.length === 0;
    document.getElementById('emptyStateTitle').textContent = noFavorites
        ? 'Belum Ada Produk Favorit' : 'Produk Tidak Ditemukan';
    document.getElementById('emptyStateDescription').textContent = noFavorites
        ? 'Klik ikon hati pada produk yang Anda sukai, lalu lihat kembali di sini.'
        : 'Coba kata kunci lain atau ubah filter wilayah / kategori Anda.';
 
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer";
        card.innerHTML = `
            <div class="relative h-48 overflow-hidden bg-slate-100">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    ${p.category}
                </span>
                <button type="button" data-favorite-id="${p.id}" aria-pressed="false" aria-label="Simpan ${esc(p.title.trim())} ke favorit" class="favorite-toggle absolute top-3 right-3 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center text-slate-600 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent">
                    <i class="fa-regular fa-heart text-lg" aria-hidden="true"></i>
                </button>
                <span class="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1">
                    <i class="fa-solid fa-location-dot text-yellow-400"></i>
                    <span>${p.region}</span>
                </span>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div class="text-[11px] text-slate-500 font-medium mb-1 flex items-center justify-between">
                        <span>${p.seller}</span>
                        ${p.rating != null && p.reviews > 0
                            ? `<span class="text-amber-500 flex items-center"><i class="fa-solid fa-star mr-1"></i>${p.rating} (${p.reviews})</span>`
                            : '<span class="text-slate-400">Belum ada ulasan</span>'}
                    </div>
                    <h3 class="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-primary transition mb-2">${p.title}</h3>
                </div>
                <div>
                    <div class="text-base font-black text-primary mb-3">Rp ${p.price.toLocaleString('id-ID')}</div>
                    <button onclick="event.stopPropagation(); addToCart(${p.id})" class="w-full bg-slate-100 hover:bg-primary hover:text-white text-slate-800 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-cart-plus"></i>
                        <span>+ Keranjang</span>
                    </button>
                </div>
            </div>
        `;
        card.querySelector('[data-favorite-id]').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProductFavorite(p.id, e.currentTarget);
        });
        card.addEventListener('click', () => openProductModal(p));
        productGrid.appendChild(card);
    });
    renderFavoriteControls();
}

function renderFavoriteControls() {
    favoritesCount.textContent = favoriteIds.length;
    favoritesCount.classList.toggle('hidden', favoriteIds.length === 0);
    favoritesBtn.setAttribute('aria-pressed', String(showFavoritesOnly));
    favoritesBtn.setAttribute('aria-label', `${showFavoritesOnly ? 'Kembali ke katalog' : 'Lihat produk favorit'} (${favoriteIds.length} favorit)`);
    favoritesBtn.querySelector('i').className = `${favoriteIds.length > 0 ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`;
    document.querySelectorAll('[data-favorite-id]').forEach(button => {
        const id = Number(button.dataset.favoriteId);
        const product = products.find(p => p.id === id);
        if (!product) return;
        const saved = favoriteIds.includes(id);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', saved ? `Hapus ${product.title.trim()} dari favorit` : `Simpan ${product.title.trim()} ke favorit`);
        button.title = button.getAttribute('aria-label');
        button.querySelector('i').className = `${saved ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`;
        if (button === modalFavoriteBtn) button.querySelector('span').textContent = saved ? 'Hapus dari Favorit' : 'Simpan ke Favorit';
    });
}

function showFavoriteStatus(message) {
    clearTimeout(favoriteStatusTimer);
    favoriteStatus.textContent = message;
    favoriteStatus.classList.remove('hidden');
    favoriteStatusTimer = setTimeout(() => favoriteStatus.classList.add('hidden'), 3500);
}

function toggleProductFavorite(productId, trigger) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    try {
        favoriteIds = toggleFavorite(productId);
    } catch (error) {
        showFavoriteStatus('Favorit belum tersimpan. Izinkan penyimpanan browser atau kosongkan ruang, lalu coba lagi.');
        return;
    }
    if (showFavoritesOnly) renderProducts();
    else renderFavoriteControls();
    showFavoriteStatus(`${product.title.trim()} ${favoriteIds.includes(productId) ? 'ditambahkan ke' : 'dihapus dari'} favorit.`);
    if (trigger && !trigger.isConnected) {
        const nextButton = productGrid.querySelector('[data-favorite-id]') || showAllProductsBtn;
        nextButton.focus({ preventScroll: true });
    }
}

function setFavoritesView(show) {
    showFavoritesOnly = show;
    // Mulai dari seluruh daftar agar favorit tidak tersembunyi oleh filter sebelumnya.
    currentCategory = 'all';
    currentRegion = 'all';
    currentSearch = '';
    searchInput.value = '';
    document.querySelectorAll('.cat-btn, .region-btn').forEach(button => {
        const selected = (button.dataset.category || button.dataset.region) === 'all';
        ['bg-primary', 'text-white', 'shadow-sm'].forEach(name => button.classList.toggle(name, selected));
        ['bg-white', 'text-slate-600', 'border', 'border-slate-200'].forEach(name => button.classList.toggle(name, !selected));
    });
    renderProducts();
    document.getElementById('productSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
 
// Event Listeners setup
function setupEventListeners() {
    favoritesBtn.addEventListener('click', () => setFavoritesView(!showFavoritesOnly));
    showAllProductsBtn.addEventListener('click', () => {
        setFavoritesView(false);
        favoritesBtn.focus({ preventScroll: true });
    });
    modalFavoriteBtn.addEventListener('click', (e) => toggleProductFavorite(Number(modalFavoriteBtn.dataset.favoriteId), e.currentTarget));
    // Sinkronkan ikon dan daftar jika favorit diubah dari tab lain.
    window.addEventListener('storage', (e) => {
        if (e.key === FAVORITES_STORAGE_KEY || e.key === null) {
            favoriteIds = readFavorites();
            renderProducts();
        }
    });
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            favoriteIds = readFavorites();
            renderProducts();
        }
    });
    // Search
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderProducts();
    });
 
    // Region Filters
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.region-btn').forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
                b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            });
            e.currentTarget.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            e.currentTarget.classList.add('bg-primary', 'text-white', 'shadow-sm');
            currentRegion = e.currentTarget.getAttribute('data-region');
            renderProducts();
        });
    });
 
    // Category Filters
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
                b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            });
            e.currentTarget.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            e.currentTarget.classList.add('bg-primary', 'text-white', 'shadow-sm');
            currentCategory = e.currentTarget.getAttribute('data-category');
            renderProducts();
        });
    });
 
    // Cart Drawer Toggle
    cartBtn.addEventListener('click', () => cartDrawer.classList.remove('hidden'));
    closeCartBtn.addEventListener('click', () => cartDrawer.classList.add('hidden'));
    cartBackdrop.addEventListener('click', () => cartDrawer.classList.add('hidden'));
 
    // Coupon Apply
    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        const rate = couponRate(code);
        if (rate > 0) {
            discountRate = rate;
            setCouponCode(code);
            couponMessage.textContent = "✅ Kupon berhasil digunakan! Diskon " + Math.round(rate * 100) + "%.";
            couponMessage.className = "text-xs font-semibold text-emerald-600";
        } else {
            discountRate = 0;
            setCouponCode('');
            couponMessage.textContent = "❌ Kode kupon tidak valid. Coba: HULONTHALO10";
            couponMessage.className = "text-xs font-semibold text-accent";
        }
        updateCartSummary();
    });
 
    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Keranjang belanja masih kosong!");
            return;
        }
        window.location.href = 'checkout.html';
    });
 
    // Product Modal Close
    closeModalBtn.addEventListener('click', () => productModal.classList.add('hidden'));
    modalBackdrop.addEventListener('click', () => productModal.classList.add('hidden'));
 
    // Store Modal Toggle
    const toggleStoreModal = (show) => {
        if(show) storeModal.classList.remove('hidden');
        else storeModal.classList.add('hidden');
    };
    openStoreBtn.addEventListener('click', () => toggleStoreModal(true));
    heroOpenStore.addEventListener('click', () => toggleStoreModal(true));
    closeStoreModalBtn.addEventListener('click', () => toggleStoreModal(false));
    storeBackdrop.addEventListener('click', () => toggleStoreModal(false));
 
    storeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Selamat! Toko UMKM Anda berhasil didaftarkan di GorontaloMarket. Tim kami akan segera menghubungi Anda.");
        storeForm.reset();
        toggleStoreModal(false);
    });
}
 
// Cart Management Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
    cartDrawer.classList.remove('hidden');
}
 
function updateCartQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCart();
}
 
function updateCart() {
    writeCart(cart);
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalCount;
 
    cartItemsList.innerHTML = '';
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i class="fa-solid fa-cart-shopping text-3xl mb-2"></i>
                <p class="text-xs">Keranjang Anda masih kosong</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = "flex items-center space-x-4 py-4 first:pt-0";
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 truncate">${item.title}</h4>
                    <div class="text-xs text-primary font-bold mt-1">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div class="flex items-center space-x-2 mt-2">
                        <button onclick="updateCartQty(${item.id}, -1)" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold">-</button>
                        <span class="text-xs font-bold">${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold">+</button>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(div);
        });
    }
    updateCartSummary();
}
 
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = subtotal * discountRate;
    const total = subtotal - discount;
 
    cartSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    cartDiscount.textContent = `- Rp ${discount.toLocaleString('id-ID')}`;
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}
 
// Product Modal Function
function openProductModal(p) {
    modalFavoriteBtn.dataset.favoriteId = p.id;
    renderFavoriteControls();
    modalImg.src = p.image;
    modalImg.alt = p.title;
    modalCategoryBadge.textContent = p.category;
    modalLocation.innerHTML = `<span class="font-semibold">${p.region}</span> • Penjual: ${p.seller}`;
    modalTitle.textContent = p.title;
    modalPrice.textContent = `Rp ${p.price.toLocaleString('id-ID')}`;
    modalDescription.textContent = p.description;
    modalSeller.textContent = p.seller;
    modalSellerInitial.textContent = p.seller.substring(0, 2).toUpperCase();
 
    modalAddToCart.onclick = () => {
        addToCart(p.id);
        productModal.classList.add('hidden');
    };
 
    modalChatSeller.onclick = () => {
        const message = `Halo ${CONFIG.storeName}, saya tertarik dengan produk ${p.title.trim()} dari ${p.seller}. Mohon informasi ketersediaannya.`;
        window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    };
 
    productModal.classList.remove('hidden');
}
 
