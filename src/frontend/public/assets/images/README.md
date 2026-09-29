# Foto Anda

Aplikasi ini menampilkan foto Anda di dua tempat, dan keduanya memakai file
gambar dari folder ini:

| Halaman     | Foto kiri          | Foto kanan          |
| ----------- | ------------------ | ------------------- |
| **Message** | `message-1.jpg`    | `message-2.jpg`     |
| **Memories**| `memory-1.jpg`     | `memory-2.jpg`      |

Anda bisa mengganti foto mana pun sendiri lewat GitHub — cukup unggah file baru
dengan **nama yang sama persis**. Tidak perlu mengubah kode.

## Mengganti foto halaman Message

1. Buka proyek ini di GitHub.
2. Masuk ke folder `src/frontend/public/assets/images/`.
3. Klik **Add file → Upload files**.
4. Unggah foto Anda dan beri nama **persis** seperti salah satu file berikut:

   - `message-1.jpg` → polaroid **kiri** di halaman Message
   - `message-2.jpg` → polaroid **kanan** di halaman Message

   Karena namanya sama, file baru akan **menggantikan** file lama.
   (Bisa juga klik file lama, lalu pakai ikon pensil/unggah untuk menimpanya.)
5. Klik **Commit changes**. Aplikasi akan dibangun ulang dan foto baru muncul
   di bingkai polaroid.

## Mengganti foto halaman Memories

Caranya sama seperti di atas, hanya nama filenya berbeda:

- `memory-1.jpg` → polaroid **kiri** di halaman Memories
- `memory-2.jpg` → polaroid **kanan** di halaman Memories

## Yang perlu diperhatikan

- Foto ditampilkan **apa adanya** — tidak pernah dipotong, diregangkan, atau
  diedit. Seluruh gambar tetap terlihat di dalam bingkai polaroid.
- Bingkai berbentuk **persegi** dan memakai penyesuaian *contain*, jadi foto
  **potret (portrait)** atau **persegi** tampil paling pas.
- Gunakan format **`.jpg`**. Nama file harus sama persis — huruf kecil semua dan
  berakhiran `.jpg` — jika tidak, foto tidak akan muncul.
- Selama file belum ada, bingkai menampilkan placeholder yang rapi, jadi
  halaman selalu terlihat selesai.
