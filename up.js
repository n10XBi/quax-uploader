// Mengimpor library yang dibutuhkan, cintakku
const fs = require('fs'); // Buat baca file lokal
const path = require('path'); // Buat ngurus path file
const FormData = require('form-data'); // Buat bikin multipart/form-data
const axios = require('axios'); // Buat ngirim request HTTP

// Konfigurasi untuk qu.ax, sayangkuu
const QUAX_UPLOAD_URL = "https://qu.ax/upload.php";
const REQUEST_TIMEOUT_MS = 120 * 1000; // Timeout 120 detik (dalam milidetik)
const MAX_SIZE_MB = 500; // Batas ukuran file yang kita asumsikan untuk qu.ax

/**
 * Mengunggah file ke qu.ax.
 * @param {string} filePath - Path ke file yang mawww diunggah.
 * @param {number} [expiryDays] - Masa berlaku file dalam hari (contoh: 7, 30).
 * Kalau ndda diisi, akan pakai default server.
 * @returns {Promise<string|null>} URL dari file yang diunggah, atau null kalau gagal.
 */
async function uploadFileToQuax(filePath, expiryDays = null) {
    console.log(`Mencoba mengunggah file: ${filePath}...`);

    // Pastikan file ada, sayangkuu
    if (!fs.existsSync(filePath)) {
        console.error(`🥺💙 File tidak ditemukan: ${filePath}. Pastikan path-nya benar ya, cintakku.`);
        return null;
    }

    const fileSize = fs.statSync(filePath).size; // Ukuran file dalam bytes
    const fileSizeMB = fileSize / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
        console.error(`😬 File terlalu besar! Ukuran: ${fileSizeMB.toFixed(2)} MiB. Maksimal ${MAX_SIZE_MB} MiB yang bisa kita coba untuk qu.ax, duniakuu.`);
        return null;
    }

    console.log(`Mencoba mengunggah file: ${filePath} (Ukuran: ${fileSizeMB.toFixed(2)} MiB) ke ${QUAX_UPLOAD_URL}...`);

    const form = new FormData();
    // Menambahkan file ke form-data. 'files[]' adalah nama field yang diharapkan qu.ax.
    form.append('files[]', fs.createReadStream(filePath), {
        filename: path.basename(filePath),
        contentType: require('mime-types').lookup(filePath) || 'application/octet-stream', // Deteksi MIME type
    });

    // Menambahkan expiryDays kalau ada
    if (expiryDays !== null) {
        form.append('expiry', String(Math.floor(expiryDays)));
    }

    try {
        const response = await axios.post(
            QUAX_UPLOAD_URL,
            form, // Kirim form-data
            {
                headers: {
                    ...form.getHeaders(), // Penting: Dapatkan headers yang benar dari form-data
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
                    'Accept': '*/*',
                },
                timeout: REQUEST_TIMEOUT_MS, // Set timeout
                maxContentLength: Infinity, // Untuk file besar
                maxBodyLength: Infinity, // Untuk file besar
            }
        );

        const responseData = response.data; // qu.ax mengembalikan data JSON

        // LOGIC PENGECEKAN RESPON UNTUK qu.ax
        if (responseData.success && responseData.files && Array.isArray(responseData.files) && responseData.files.length > 0) {
            const fileInfo = responseData.files[0];
            if (fileInfo.url) {
                console.log(`🤩 **BERHASIL DIUNGGAH!** URL Videomu: **${fileInfo.url}** 🎉`);
                console.log(`Nama file: ${fileInfo.name}, Ukuran: ${fileInfo.size} bytes, Kadaluarsa: ${fileInfo.expiry}`);
                return fileInfo.url;
            } else {
                console.error(`😥 Respons qu.ax sukses tapi URL tidak ditemukan di 'files'. Respons:`, responseData);
                return null;
            }
        } else if (responseData.error) {
            console.error(`😥 API qu.ax mengembalikan error: ${responseData.error}`);
            return null;
        } else {
            console.error(`😥 Gagal mendapatkan URL dari respons qu.ax. Respons tidak seperti yang diharapkan:`, responseData);
            return null;
        }

    } catch (error) {
        if (error.response) {
            // Error dari server (status code 4xx atau 5xx)
            console.error(`😥 Gagal mengunggah file, ada kesalahan HTTP: ${error.response.status}`);
            console.error(`Detail Respons Server:`, error.response.data);
            if (error.response.status === 413) {
                console.error("Pesan: Kode 413 (Payload Too Large) berarti filemu terlalu besar untuk server qu.ax.");
            } else if (error.response.status === 400) {
                console.error("Pesan: Kode 400 (Bad Request) bisa jadi karena format file atau masalah lain.");
            }
        } else if (error.request) {
            // Request terkirim tapi ndda ada respons (timeout, koneksi)
            console.error(`😥 Gagal terhubung ke qu.ax atau waktu habis. Coba cek koneksi internetmu ya, sayangkuu.`);
            console.error(`Detail Error:`, error.message);
        } else {
            // Error lainnya
            console.error(`😥 Terjadi kesalahan yang tidak terduga:`, error.message);
        }
        return null;
    }
}

// Bagian untuk menjalankan fungsi utama, Genta sayangkuu!
async function main() {
    console.log("--- Contoh Penggunaan Upload File Video ke qu.ax (Node.js) ---");

    // >>>>>> INI DIA, PATH FILE VIDEO KAMU, GENTA SAYANGKUU! <<<<<<
    // Pastikan file '9r30ov.mp4' ada di folder yang sama dengan script ini,
    // atau ganti dengan path lengkapnya (misal: "C:/Users/Genta/Videos/9r30ov.mp4")
    const targetVideoFile = "9r30ov.mp4"; 
    
    // Perlu instal 'mime-types' untuk deteksi mimetype: npm install mime-types
    try {
        require('mime-types');
    } catch (e) {
        console.error("Error: Library 'mime-types' tidak ditemukan. Harap install dengan 'npm install mime-types' sebelum menjalankan script ini.");
        return;
    }

    const uploadedLink = await uploadFileToQuax(targetVideoFile, 30); // Masa berlaku 30 hari

    if (uploadedLink) {
        console.log(`\n✨ Video '${targetVideoFile}' berhasil diunggah ke: ${uploadedLink}`);
        // Waktu sekarang di Cilacap, Central Java, Indonesia
        const now = new Date();
        const options = {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false, // Format 24 jam
            timeZone: 'Asia/Jakarta' // WIB (Waktu Indonesia Barat)
        };
        const formatter = new Intl.DateTimeFormat('id-ID', options);
        console.log(`Sekarang jam ${formatter.format(now)} WIB, ${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })}.`);
        console.log("Semoga video ini bermanfaat ya, duniakuu!");
    } else {
        console.log("\n😥 Gagal mengunggah video. Coba cek lagi ya, sayangkuu.");
    }

    console.log("\n--- Selesai, cintakku! ---");
}

main(); // Jalankan fungsi utama
