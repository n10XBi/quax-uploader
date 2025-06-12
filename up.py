import requests
import os
import json
import uuid 
import time
import mimetypes 

# Konfigurasi untuk qu.ax, sayangkuu
QUAX_UPLOAD_URL = "https://qu.ax/upload.php" # Endpoint upload untuk qu.ax
DEFAULT_HEADERS_QUAX = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Accept': '*/*', 
}
REQUEST_TIMEOUT = 120 # Timeout dalam detik, diperpanjang untuk file video

def upload_file_quax_ax(file_path, expiry_days=None):
    """
    Mengunggah file ke qu.ax.

    Args:
        file_path (str): Path ke file yang mawww diunggah.
        expiry_days (int, optional): Masa berlaku file dalam hari (contoh: 7, 30). 
                                     Kalau ndda diisi, akan pakai default server.
    Returns:
        str: URL dari file yang diunggah, atau None kalau gagal.
    """
    
    if not os.path.exists(file_path):
        print(f"🥺💙 File tidak ditemukan: {file_path}. Pastikan path-nya benar ya, sayangkuu.")
        return None

    max_size_mb = 500 
    file_size_bytes = os.path.getsize(file_path)
    if file_size_bytes > max_size_mb * 1024 * 1024:
        print(f"😬 File terlalu besar! Ukuran: {file_size_bytes / (1024*1024):.2f} MiB. Maksimal {max_size_mb} MiB yang bisa kita coba untuk qu.ax, duniakuu.")
        return None
    
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        mime_type = 'application/octet-stream'

    print(f"Mencoba mengunggah file: {file_path} (Ukuran: {file_size_bytes / (1024*1024):.2f} MiB, Type: {mime_type}) ke {QUAX_UPLOAD_URL}...")
    
    files = {
        'files[]': (os.path.basename(file_path), open(file_path, 'rb'), mime_type)
    }
    
    data = {}
    if expiry_days is not None:
        data['expiry'] = str(int(expiry_days))

    try:
        response = requests.post(
            QUAX_UPLOAD_URL,
            files=files,
            data=data,
            headers=DEFAULT_HEADERS_QUAX,
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()

        response_json = response.json() # Coba langsung parse sebagai JSON
        
        # LOGIC PERBAIKAN DI SINI, SAYANGKUU!
        if response_json.get('success') and 'files' in response_json and isinstance(response_json['files'], list) and len(response_json['files']) > 0:
            # Kita ambil objek file pertama dari list 'files'
            file_info = response_json['files'][0]
            if 'url' in file_info:
                uploaded_url = file_info['url']
                print(f"🤩 **BERHASIL DIUNGGAH!** URL Videomu: **{uploaded_url}** 🎉")
                print(f"Nama file: {file_info.get('name')}, Ukuran: {file_info.get('size')} bytes, Kadaluarsa: {file_info.get('expiry')}")
                return uploaded_url
            else:
                print(f"😥 Respons qu.ax sukses tapi URL tidak ditemukan di 'files'. Respons: {response_json}")
                return None
        elif 'error' in response_json:
            print(f"😥 API qu.ax mengembalikan error: {response_json.get('error')}")
            return None
        else:
            print(f"😥 Gagal mendapatkan URL dari respons qu.ax. Respons JSON tidak seperti yang diharapkan: {response_json}")
            return None

    except requests.exceptions.HTTPError as e:
        print(f"😥 Gagal mengunggah file, ada kesalahan HTTP: {e}")
        print(f"Detail Respons Server: {response.text.strip()}") 
        print(f"Kode Status: {response.status_code}")
        if response.status_code == 413:
            print("Pesan: Kode 413 (Payload Too Large) berarti filemu terlalu besar untuk server qu.ax.")
        elif response.status_code == 400:
            print("Pesan: Kode 400 (Bad Request) bisa jadi karena format file atau masalah lain.")
    except requests.exceptions.ConnectionError as e:
        print(f"😥 Gagal terhubung ke qu.ax. Coba cek koneksi internetmu ya, sayangkuu: {e}")
    except requests.exceptions.Timeout as e:
        print(f"😥 Waktu habis saat mengunggah (setelah {REQUEST_TIMEOUT} detik). Koneksi mungkin lambat atau server sibuk: {e}")
    except requests.exceptions.RequestException as e:
        print(f"😥 Terjadi kesalahan lain saat mengunggah: {e}")
    except json.JSONDecodeError:
        # Ini case kalau responsnya bukan JSON sama sekali, misalnya cuma string URL polos
        if response_text.startswith("https://qu.ax/"):
            uploaded_url = response_text
            print(f"🤩 **BERHASIL DIUNGGAH!** URL Videomu: **{uploaded_url}** 🎉")
            return uploaded_url
        else:
            print(f"😥 Respons dari qu.ax bukan JSON atau URL langsung. Respons: {response_text}")
            return None
    except Exception as e:
        print(f"😥 Terjadi kesalahan yang tidak terduga: {e}")
    finally:
        if 'files[]' in files and files['files[]'][1]:
            files['files[]'][1].close() 
    return None

if __name__ == "__main__":
    print("--- Contoh Penggunaan Upload File Video ke qu.ax ---")
    
    target_video_file = "27f4273337f94786ae07e67a6ace2113.mp4" 
    
    print(f"Mencoba mengunggah video: {target_video_file}...")

    uploaded_link_video = upload_file_quax_ax(target_video_file, expiry_days=30) 
    
    if uploaded_link_video:
        print(f"\n✨ Video '{target_video_file}' berhasil diunggah ke: {uploaded_link_video}")
        print(f"Sekarang jam {time.strftime('%H:%M:%S WIB')}, {time.strftime('%A, %d %B %Y')}.")
        print("Semoga video ini bermanfaat ya, duniakuu!")
    else:
        print("\n😥 Gagal mengunggah video. Coba cek lagi ya, sayangkuu.")

    print("\n--- Selesai, cintakku! ---")