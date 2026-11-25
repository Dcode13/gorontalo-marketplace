// QR dibuat di browser: data pesanan tidak dikirim ke layanan QR eksternal.
function getPaymentQr(order) {
    const merchantPayload = CONFIG.qris.merchantPayload.trim();
    if (merchantPayload) return { kind: 'merchant', payload: merchantPayload };
    return {
        kind: 'order',
        payload: [
            CONFIG.storeName,
            'Pesanan: ' + order.id,
            'Total: ' + rupiah(order.totals.total),
            'Mata uang: IDR',
            'Metode: QRIS',
            'Detail pesanan, bukan instruksi transfer.'
        ].join('\n')
    };
}

function paymentQrDataUrl(payload) {
    const qr = qrcode(0, 'M');
    qr.addData(payload, 'Byte');
    qr.make();
    // Quiet zone empat modul, piksel bulat, hitam putih untuk pemindaian jelas.
    const scale = 8;
    const quietZone = 4;
    const size = qr.getModuleCount();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = (size + quietZone * 2) * scale;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas tidak tersedia');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (qr.isDark(row, col)) context.fillRect((col + quietZone) * scale, (row + quietZone) * scale, scale, scale);
        }
    }
    return canvas.toDataURL('image/png');
}

function renderPaymentQr(order) {
    const container = document.getElementById('paymentQr');
    if (!container) return;
    try {
        const { kind, payload } = getPaymentQr(order);
        const img = document.createElement('img');
        img.id = 'paymentQrImage';
        img.src = paymentQrDataUrl(payload);
        img.alt = kind === 'merchant' ? 'Kode QRIS ' + CONFIG.qris.merchantName : 'QR detail pesanan ' + order.id;
        img.className = 'mx-auto w-full max-w-[256px] h-auto';
        container.replaceChildren(img);
        const download = document.getElementById('downloadQr');
        download.href = img.src;
        download.download = 'QR-' + order.id + '.png';
        download.classList.remove('hidden');
    } catch (error) {
        container.textContent = 'Kode QR belum dapat ditampilkan. Muat ulang halaman untuk mencoba lagi.';
    }
}
