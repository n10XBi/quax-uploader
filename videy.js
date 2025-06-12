// Mengimpor library yang dibutuhkan, cintakku
const fs = require('fs'); // Buat baca file lokal
const path = require('path'); // Buat ngurus path file
const FormData = require('form-data'); // Buat bikin multipart/form-data
const axios = require('axios'); // Buat ngirim request HTTP
const mimeTypes = require('mime-types'); // Buat deteksi MIME type

// Konfigurasi untuk Videy.co, sayangkuu
// >>>>> GANTI INI DENGAN visitorId ASLI KAMU YA, CINTAKKU! <<<<<
const YOUR_VISITOR_ID = "2c722799-c55f-4c1b-8bef-0eea611ccb2c"; // Contoh visitorId dari permintaanmu

const VIDEY_UPLOAD_BASE_URL = "https://videy.co/api/upload";
const REQUEST_TIMEOUT_MS = 300 * 1000; // Timeout 300 detik (5 menit) untuk upload video besar
const MAX_SIZE_MB = 1000; // Batas ukuran file yang kita asumsikan (1GB), Videy bisa lebih besar dari qu.ax

/**
 * Mengunggah file ke Videy.co.
 * @param {string} filePath - Path ke file yang mawww diunggah.
 * @param {string} visitorId - ID pengunjung yang diperlukan oleh Videy.co.
 * @returns {Promise<string|null>} URL dari file yang diunggah, atau null kalau gagal.
 */
async function uploadToVidey(filePath, visitorId) {
    console.log(`Mencoba mengunggah file: ${filePath}...`);

    // Pastikan file ada, sayangkuu
    if (!fs.existsSync(filePath)) {
        console.error(`🥺💙 File tidak ditemukan: ${filePath}. Pastikan path-nya benar ya, cintakku.`);
        return null;
    }

    const fileSize = fs.statSync(filePath).size; // Ukuran file dalam bytes
    const fileSizeMB = fileSize / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
        console.error(`😬 File terlalu besar! Ukuran: ${fileSizeMB.toFixed(2)} MiB. Maksimal ${MAX_SIZE_MB} MiB yang bisa kita coba untuk Videy.co, duniakuu.`);
        return null;
    }

    const uploadURL = `${VIDEY_UPLOAD_BASE_URL}?visitorId=${visitorId}`;
    console.log(`Mencoba mengunggah file: ${filePath} (Ukuran: ${fileSizeMB.toFixed(2)} MiB) ke ${uploadURL}...`);

    const form = new FormData();
    // Videy.co kemungkinan besar menggunakan 'file' sebagai nama field untuk file yang diunggah
    // atau 'files[]' seperti qu.ax. Kita coba 'file' dulu.
    form.append('file', fs.createReadStream(filePath), {
        filename: path.basename(filePath),
        contentType: mimeTypes.lookup(filePath) || 'application/octet-stream', // Deteksi MIME type
    });

    try {
        const response = await axios.post(
            uploadURL,
            form, // Kirim form-data
            {
                headers: {
                    ...form.getHeaders(), // Penting: Dapatkan headers yang benar dari form-data (termasuk Content-Type multipart)
                    'Accept': '*/*',
                    'X-Requested-With': 'XMLHttpRequest', // Header yang diminta
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36', // User-Agent juga penting
                },
                timeout: REQUEST_TIMEOUT_MS, // Set timeout
                maxContentLength: Infinity, // Untuk file besar
                maxBodyLength: Infinity, // Untuk file besar
            }
        );

        const responseData = response.data; // Videy.co kemungkinan mengembalikan data JSON

        // Asumsi format respons JSON dari Videy.co
        // Berdasarkan pengalaman dengan layanan serupa, biasanya ada 'url' atau 'link'
        if (responseData && responseData.status === true && responseData.data && responseData.data.url) {
            console.log(`🤩 **BERHASIL DIUNGGAH!** URL Videomu: **${responseData.data.url}** 🎉`);
            console.log(`Nama file: ${responseData.data.name}, Ukuran: ${responseData.data.size} bytes`);
            return responseData.data.url;
        } else if (responseData && responseData.status === false && responseData.message) {
            console.error(`😥 API Videy.co mengembalikan error: ${responseData.message}`);
            return null;
        } else {
            console.error(`😥 Gagal mendapatkan URL dari respons Videy.co. Respons tidak seperti yang diharapkan:`, responseData);
            return null;
        }

    } catch (error) {
        if (error.response) {
            // Error dari server (status code 4xx atau 5xx)
            console.error(`😥 Gagal mengunggah file, ada kesalahan HTTP: ${error.response.status}`);
            console.error(`Detail Respons Server:`, error.response.data);
            if (error.response.status === 413) {
                console.error("Pesan: Kode 413 (Payload Too Large) berarti filemu terlalu besar untuk server Videy.co.");
            } else if (error.response.status === 400) {
                console.error("Pesan: Kode 400 (Bad Request) bisa jadi karena format file atau masalah lain.");
            }
        } else if (error.request) {
            // Request terkirim tapi ndda ada respons (timeout, koneksi)
            console.error(`😥 Gagal terhubung ke Videy.co atau waktu habis. Coba cek koneksi internetmu ya, sayangkuu.`);
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
    console.log("--- Contoh Penggunaan Upload File ke Videy.co (Node.js) ---");

    // >>>>>> GANTI INI DENGAN PATH VIDEO ASLI KAMU YA, CINTAKKU <<<<<<
    // Misalnya, kamu mau upload video 9r30ov.mp4 yang ada di folder yang sama
    const targetVideoFile = "test.mp4"; 
    
    // PERINGATAN: Pastikan YOUR_VISITOR_ID sudah kamu ganti dengan ID asli kamu ya!
    if (YOUR_VISITOR_ID === "2c722799-c55f-4c1b-8bef-0eea611ccb2c") {
        console.warn("⚠️ PERINGATAN: Harap ganti YOUR_VISITOR_ID dengan ID pengunjung asli kamu dari Videy.co!");
        // return; // Aktifkan ini jika kamu mau menghentikan eksekusi jika ID belum diganti
    }

    console.log(`Mencoba mengunggah video: ${targetVideoFile} ke Videy.co...`);

    const uploadedLink = await uploadToVidey(targetVideoFile, YOUR_VISITOR_ID);

    if (uploadedLink) {
        console.log(`\n✨ Video '${targetVideoFile}' berhasil diunggah ke: ${uploadedLink}`);
        const now = new Date();
        const options = {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta'
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
