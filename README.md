# Webtoon Backend API Documentation

---

## **Daftar Isi**

1. [Pendahuluan](#pendahuluan)  
2. [Database](#database)  
3. [Struktur Proyek](#struktur-proyek)  
4. [Penjelasan Detail Struktur Folder dan File](#penjelasan-detail-struktur-folder-dan-file)  
   - a. **controllers**  
   - b. **routes**  
   - c. **models**  
   - d. **services**  
   - e. **middleware**  
5. [Penjelasan Endpoint API](#penjelasan-endpoint-api)  
6. [Kode Utama dan Fungsionalitas](#kode-utama-dan-fungsionalitas)  
7. [Autentikasi dan Autorisasi](#autentikasi-dan-autorisasi)  
8. [Error Handling](#error-handling)  
9. [Testing](#testing)  
10. [Kesimpulan](#kesimpulan)

---

## **Pendahuluan**

### **Deskripsi Proyek**
Webtoon Backend API adalah sebuah proyek backend yang dirancang untuk mendukung aplikasi membaca komik digital (webtoon). Proyek ini memungkinkan pengelolaan data komik, episode, pengguna, serta menyediakan fitur autentikasi, otorisasi, dan pengelolaan akun. Backend ini dibangun dengan teknologi modern untuk memastikan performa, skalabilitas, dan keamanan yang optimal.

Aplikasi ini ditujukan bagi pengembang atau tim pengembang yang ingin membuat platform webtoon lengkap. Dengan menyediakan API yang terstruktur dengan baik, proyek ini mempermudah pengelolaan data komik dan episode, interaksi pengguna, serta integrasi dengan sistem frontend seperti aplikasi web atau mobile.

### **Tujuan Proyek**
1. **Mendukung Pengelolaan Komik dan Episode**: Menyediakan endpoint untuk membuat, membaca, memperbarui, dan menghapus data komik serta episode.
2. **Autentikasi dan Autorisasi**: Mengimplementasikan sistem login, register, serta verifikasi pengguna dengan keamanan menggunakan JWT (JSON Web Token).
3. **Efisiensi dan Skalabilitas**: Menggunakan praktik terbaik dalam pengembangan backend agar API dapat menangani lalu lintas data yang besar tanpa menurunkan performa.
4. **Pengelolaan Database yang Efisien**: Database dirancang menggunakan relasi antar tabel untuk memastikan integritas data.

### **Fitur Utama**
- **Manajemen Komik**: Pengguna dapat mengakses dan mengelola daftar komik yang tersedia.
- **Manajemen Episode**: Menyediakan fungsi CRUD untuk episode yang terhubung dengan komik tertentu.
- **Sistem Pengguna**: Registrasi, login, dan verifikasi akun pengguna.
- **Keamanan**: Sistem otentikasi berbasis token untuk memastikan keamanan akses API.
- **Pengelolaan Status**: Menandai status pengguna (aktif, terverifikasi) dan status komik (ongoing, completed).
- **Error Handling yang Andal**: Memberikan pesan kesalahan yang jelas kepada pengembang untuk debugging lebih mudah.

### **Teknologi yang Digunakan**
1. **Node.js & Express**: Untuk pengembangan server backend yang cepat dan ringan.
2. **MySQL**: Sebagai database relasional untuk menyimpan data aplikasi.
3. **Prisma ORM**: Mempermudah interaksi dengan database melalui query yang sederhana dan efisien.
4. **JWT**: Untuk autentikasi berbasis token yang aman.
5. **Postman**: Untuk pengujian dan dokumentasi endpoint API.

### **Penerapan Proyek**
Proyek ini cocok digunakan untuk platform yang ingin memberikan pengalaman membaca komik yang interaktif dan terorganisir dengan baik. Selain itu, backend ini mudah diperluas untuk menambahkan fitur baru seperti komentar, sistem penilaian, atau pengelolaan langganan pengguna di masa depan.
Baik, kita akan melanjutkan ke bagian **Database**. Berikut adalah penjelasan dan contoh query yang relevan berdasarkan file database yang Anda kirimkan:

---

**[⬆ kembali ke atas](#daftar-isi)**

## **Database**

Database yang digunakan untuk proyek ini dirancang untuk mendukung fitur dan fungsionalitas aplikasi webtoon backend secara efisien. Struktur database mencakup tabel-tabel inti yang saling berhubungan melalui relasi untuk memastikan integritas data dan mempermudah pengambilan informasi.

### **Struktur Utama Tabel**
1. **Tabel `users`**  
   Tabel ini berisi informasi tentang pengguna aplikasi, termasuk autentikasi dan verifikasi akun. Kolom-kolom utama meliputi:  
   - `id` (Primary Key): ID unik untuk setiap pengguna.  
   - `username`: Nama pengguna.  
   - `email` (Unique): Email pengguna yang digunakan untuk login.  
   - `password`: Kata sandi pengguna dalam bentuk hash.  
   - `verification_code`: Kode verifikasi untuk proses verifikasi akun.  
   - `is_verified`: Status verifikasi akun pengguna (Boolean).  

   **Contoh Query untuk Tabel `users`**:
   ```sql
   -- Membuat tabel users
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(100) NOT NULL,
       email VARCHAR(150) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       verification_code VARCHAR(50),
       is_verified BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Menambahkan pengguna baru
   INSERT INTO users (username, email, password, verification_code)
   VALUES ('JohnDoe', 'john@example.com', 'hashed_password', '12345');
   ```

2. **Tabel `comics`**  
   Tabel ini menyimpan data tentang komik yang tersedia di platform. Kolom-kolom penting meliputi:  
   - `id` (Primary Key): ID unik untuk setiap komik.  
   - `title`: Judul komik.  
   - `genre`: Genre komik (misalnya Action, Drama, dll.).  
   - `description`: Deskripsi singkat tentang komik.  
   - `creator_id` (Foreign Key): Mengacu ke ID pengguna yang merupakan pencipta komik.  
   - `status`: Status komik (contoh: ongoing, completed).  

   **Contoh Query untuk Tabel `comics`**:
   ```sql
   -- Membuat tabel comics
   CREATE TABLE comics (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(150) NOT NULL,
       genre VARCHAR(100),
       description TEXT,
       creator_id INT NOT NULL,
       cover_image_url VARCHAR(255),
       status ENUM('ongoing', 'completed') DEFAULT 'ongoing',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
   );

   -- Menambahkan komik baru
   INSERT INTO comics (title, genre, description, creator_id, cover_image_url, status)
   VALUES ('Lookism', 'Action, School', 'A story about appearances.', 4, 'https://lookism.com/cover.jpg', 'ongoing');
   ```

3. **Tabel `episodes`**  
   Tabel ini berfungsi untuk menyimpan data tentang episode-episode dari setiap komik. Relasi dengan tabel `comics` dijaga dengan **Foreign Key**. Kolom-kolom utama meliputi:  
   - `id` (Primary Key): ID unik untuk setiap episode.  
   - `comic_id` (Foreign Key): ID komik yang memiliki episode ini.  
   - `episode_number`: Nomor urut episode.  
   - `title`: Judul episode.  
   - `content_url`: URL yang mengarah ke konten episode.  

   **Contoh Query untuk Tabel `episodes`**:
   ```sql
   -- Membuat tabel episodes
   CREATE TABLE episodes (
       id INT AUTO_INCREMENT PRIMARY KEY,
       comic_id INT NOT NULL,
       episode_number INT NOT NULL,
       title VARCHAR(100),
       content_url VARCHAR(255),
       upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
   );

   -- Menambahkan episode baru
   INSERT INTO episodes (comic_id, episode_number, title, content_url)
   VALUES (1, 1, 'The Beginning', 'https://example.com/episode-1');
   ```

### **Relasi Antar Tabel**
1. **Relasi `users` dengan `comics`**:  
   - Setiap pengguna dapat membuat lebih dari satu komik.  
   - Relasi ini ditangani oleh kolom `creator_id` di tabel `comics`.  

2. **Relasi `comics` dengan `episodes`**:  
   - Setiap komik dapat memiliki beberapa episode.  
   - Relasi ini ditangani oleh kolom `comic_id` di tabel `episodes`.  

   **Contoh Query Pengambilan Data Menggunakan Relasi**:
   ```sql
   -- Mengambil semua episode dari komik tertentu
   SELECT episodes.id AS episode_id, episodes.title AS episode_title, episodes.episode_number, episodes.content_url
   FROM episodes
   JOIN comics ON episodes.comic_id = comics.id
   WHERE comics.id = 1;

   -- Mengambil semua komik yang dibuat oleh pengguna tertentu
   SELECT comics.id AS comic_id, comics.title AS comic_title, comics.genre, comics.status
   FROM comics
   JOIN users ON comics.creator_id = users.id
   WHERE users.id = 4;
   ```

### **Keunggulan Desain Database**
- **Normalisasi Data**: Data dipecah menjadi tabel-tabel terpisah untuk mengurangi redundansi dan meningkatkan efisiensi penyimpanan.  
- **Relasi dengan Foreign Key**: Menjaga integritas data, misalnya menghapus episode otomatis ketika komik terkait dihapus.  
- **Skalabilitas**: Struktur database ini mendukung pertumbuhan aplikasi, baik dalam jumlah pengguna, komik, maupun episode.  

---

**4. Tabel `comments`**

Tabel ini menyimpan data komentar yang dibuat oleh pengguna pada setiap episode komik. Relasi dijaga dengan **Foreign Key** yang mengacu pada tabel `users` dan `episodes`. Kolom-kolom penting meliputi:  
- `id` (Primary Key): ID unik untuk setiap komentar.  
- `episode_id` (Foreign Key): Mengacu ke ID episode tempat komentar diberikan.  
- `user_id` (Foreign Key): Mengacu ke ID pengguna yang memberikan komentar.  
- `content`: Isi dari komentar.  
- `created_at`: Waktu komentar ditambahkan.  

**Query untuk Tabel `comments`**:  
```sql
-- Membuat tabel comments
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    episode_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Menambahkan komentar baru
INSERT INTO comments (episode_id, user_id, content)
VALUES (1, 4, 'Amazing episode! Can’t wait for the next one.');
```

**5. Tabel `likes`**

Tabel ini mencatat informasi tentang pengguna yang memberikan "like" pada komik tertentu. Dengan struktur ini, setiap pengguna dapat memberikan satu "like" pada sebuah komik. Kolom-kolom utama meliputi:  
- `id` (Primary Key): ID unik untuk setiap "like".  
- `comic_id` (Foreign Key): Mengacu ke ID komik yang mendapatkan "like".  
- `user_id` (Foreign Key): Mengacu ke ID pengguna yang memberikan "like".  
- `created_at`: Waktu "like" ditambahkan.  

**Query untuk Tabel `likes`**:  
```sql
-- Membuat tabel likes
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comic_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Menambahkan "like" baru
INSERT INTO likes (comic_id, user_id)
VALUES (1, 4);
```

**6. Tabel `notifications`**

Tabel ini dirancang untuk menyimpan pemberitahuan yang dikirimkan kepada pengguna. Contohnya mencakup informasi tentang episode baru atau notifikasi sistem lainnya. Kolom-kolom utama meliputi:  
- `id` (Primary Key): ID unik untuk setiap notifikasi.  
- `user_id` (Foreign Key): Mengacu ke ID pengguna yang menerima notifikasi.  
- `message`: Isi notifikasi.  
- `is_read`: Status apakah notifikasi sudah dibaca (Boolean).  
- `created_at`: Waktu notifikasi dikirimkan.  

**Query untuk Tabel `notifications`**:  
```sql
-- Membuat tabel notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Menambahkan notifikasi baru
INSERT INTO notifications (user_id, message)
VALUES (4, 'A new episode is now available for Lookism!');
```

**7. Tabel `favorites`**

Tabel ini menyimpan data tentang komik yang ditandai sebagai favorit oleh pengguna. Relasi ini memungkinkan pengguna untuk melacak komik yang paling mereka sukai. Kolom-kolom utama meliputi:  
- `id` (Primary Key): ID unik untuk setiap entri favorit.  
- `user_id` (Foreign Key): Mengacu ke ID pengguna yang menandai komik sebagai favorit.  
- `comic_id` (Foreign Key): Mengacu ke ID komik yang ditandai sebagai favorit.  
- `created_at`: Waktu entri ditambahkan.  

**Query untuk Tabel `favorites`**:  
```sql
-- Membuat tabel favorites
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comic_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
);

-- Menambahkan favorit baru
INSERT INTO favorites (user_id, comic_id)
VALUES (4, 1);
```

### **Keunggulan Desain dan Optimasi**
Desain tabel dirancang untuk meminimalkan duplikasi data dan memastikan performa database tetap optimal saat aplikasi berkembang. Foreign Key diterapkan untuk menjaga referensial integritas antar tabel, dan indeks otomatis pada kolom Primary Key mendukung pengambilan data dengan cepat. 

--- 

**[⬆ kembali ke atas](#daftar-isi)**

### **Struktur Proyek**

Struktur proyek dalam backend API ini dirancang agar mudah diakses, dipahami, dan diperluas. Dengan pendekatan modular, setiap folder dan file memiliki tanggung jawab spesifik. Berikut adalah gambaran struktur proyek dan penjelasan masing-masing bagiannya:

```
root/
│
├── controllers/
│   ├── authController.js
│   ├── comicController.js
│   ├── episodeController.js
│   └── userController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── comicRoutes.js
│   ├── episodeRoutes.js
│   └── userRoutes.js
│
├── middleware/
│   └── jwtMiddleware.js
│
├── services/
│   ├── emailService.js
│   └── notificationService.js
│
├── db/
│   └──connections.js
│
├── utils/
│   ├── response.js
│   └── jwtHelper.js
│
├── .env
├── server.js
└── package.json
```

#### **1. `controllers/`**
Berisi logika utama untuk setiap endpoint API. Controller menangani permintaan yang datang, memproses data, dan mengembalikan respons yang sesuai.  

- **`authController.js`**: Menangani fitur autentikasi seperti registrasi, login, dan verifikasi pengguna.  
- **`comicController.js`**: Mengelola data komik, seperti menambahkan komik baru, mengambil daftar komik, dan menghapus komik.  
- **`episodeController.js`**: Berfungsi untuk mengatur data episode, termasuk fitur seperti melihat episode tertentu atau menambah episode baru.  
- **`userController.js`**: Bertanggung jawab untuk fitur-fitur terkait pengguna, seperti pembaruan profil atau pengaturan akun.  

#### **2. `routes/`**
Folder ini berisi semua rute API yang menghubungkan permintaan pengguna ke controller yang sesuai. Setiap file di dalam folder ini bertanggung jawab untuk mendefinisikan endpoint berdasarkan jenis fungsionalitasnya.  

- **`authRoutes.js`**: Endpoint untuk registrasi, login, dan verifikasi pengguna.  
- **`comicRoutes.js`**: Endpoint terkait operasi CRUD pada komik.  
- **`episodeRoutes.js`**: Endpoint yang menangani pengelolaan episode komik.  
- **`userRoutes.js`**: Endpoint untuk fitur terkait pengguna, seperti pembaruan profil.  

#### **3. `models/`**
Folder ini berisi file yang mengatur koneksi database dan interaksi dengan tabel. Model memetakan struktur tabel dan memudahkan pengelolaan data di database.  

- **`db.js`**: Berisi konfigurasi untuk menghubungkan aplikasi dengan database menggunakan library seperti `mysql2` atau `sequelize`.  
- **`userModel.js`**: Mengelola skema dan operasi data terkait tabel pengguna.  

#### **4. `middleware/`**
Folder ini menyimpan fungsi perantara (middleware) yang digunakan untuk memproses permintaan sebelum sampai ke controller.  

- **`authMiddleware.js`**: Memverifikasi token JWT untuk memastikan pengguna yang mengakses endpoint telah terautentikasi.  

#### **5. `services/`**
Berisi fungsi tambahan yang mendukung fitur utama aplikasi. Service membantu memisahkan logika bisnis tertentu agar lebih modular.  

- **`emailService.js`**: Mengelola pengiriman email, seperti email verifikasi dan notifikasi.  
- **`notificationService.js`**: Berfungsi untuk membuat atau mengirim notifikasi kepada pengguna.  

#### **6. `config/`**
Folder ini menyimpan file konfigurasi penting yang digunakan di seluruh aplikasi.  

- **`database.js`**: Menyimpan konfigurasi database, seperti host, port, nama database, dan kredensial.  

#### **7. `utils/`**
Folder ini berisi utilitas yang bersifat reusable untuk mendukung berbagai fungsi di aplikasi.  

- **`errorHandler.js`**: Fungsi untuk menangani kesalahan secara global dan mengembalikan respons error yang konsisten.  
- **`jwtHelper.js`**: Fungsi untuk membuat dan memverifikasi token JWT.  

#### **8. File Lain**
- **`.env`**: File yang menyimpan variabel lingkungan (environment variables) seperti kunci rahasia JWT, kredensial database, dan konfigurasi lainnya.  
- **`server.js`**: File utama yang menginisialisasi server, middleware global, dan rute.  
- **`package.json`**: Menyimpan metadata proyek, seperti nama, dependensi, dan skrip.  

---

**[⬆ kembali ke atas](#daftar-isi)**

### **Penjelasan Detail Struktur Folder dan File**

#### **1. Folder `controllers`**
Folder ini berisi logika utama (business logic) untuk menangani berbagai fitur aplikasi. Setiap controller memisahkan logika berdasarkan modul atau fitur tertentu.

- **`authController.js`**  
  Mengelola proses autentikasi dan otorisasi pengguna, dengan fungsi utama:  
  - **`registerUser`**:  
    Validasi data registrasi, hashing password, dan menyimpan data pengguna baru ke database.  
  - **`verifyUser`**:  
    Memproses token verifikasi untuk mengaktifkan akun pengguna.  
  - **`loginUser`**:  
    Memeriksa kredensial pengguna, menghasilkan token JWT untuk otentikasi.  
  - **`resetPassword`**:  
    Mengatur ulang password pengguna berdasarkan token validasi.  
  - **`requestResetPassword`**:  
    Mengirim email berisi token reset password kepada pengguna yang meminta.

- **`comicController.js`**  
  Menangani seluruh fitur terkait pengelolaan data komik, dengan fungsi:  
  - **`getAllComics`**:  
    Mengambil daftar semua komik, termasuk fitur pencarian dan filter berdasarkan genre, status, atau popularitas.  
  - **`getComicById`**:  
    Mengambil detail komik tertentu berdasarkan `id`.  
  - **`createComic`**:  
    Membuat komik baru, memvalidasi data, dan menyimpannya ke database.  
  - **`editComic`**:  
    Memperbarui informasi komik tertentu, seperti judul, sinopsis, atau status publikasi.  
  - **`deleteComic`**:  
    Menghapus komik berdasarkan ID, dengan validasi untuk memastikan hanya pemilik komik yang dapat melakukannya.

- **`commentsController.js`**  
  Mengelola komentar pada komik atau episode tertentu, dengan fungsi:  
  - **`getCommentsByComicId`**:  
    Mengambil semua komentar yang terkait dengan `comic_id`.  
  - **`createComment`**:  
    Menambahkan komentar baru, memvalidasi data seperti teks komentar, ID pengguna, dan ID komik.  
  - **`editComment`**:  
    Memperbarui komentar berdasarkan ID, dengan validasi pengguna untuk memastikan hanya pemilik komentar yang dapat mengedit.  
  - **`deleteComment`**:  
    Menghapus komentar tertentu berdasarkan ID, dengan validasi pengguna.  
  - **`getCommentsByEpisodeId`**:  
    Mengambil semua komentar yang terkait dengan episode tertentu (`episode_id`), biasanya digunakan untuk komentar spesifik dalam satu episode komik.

- **`episodeController.js`**  
  Mengelola seluruh fitur terkait episode komik, dengan fungsi:  
  - **`getEpisodeByComicId`**:  
    Mengambil daftar semua episode berdasarkan `comic_id`.  
  - **`createEpisode`**:  
    Membuat episode baru, memvalidasi data seperti nomor episode, judul, dan konten.  
  - **`editEpisode`**:  
    Mengedit detail episode tertentu.  
  - **`deleteEpisode`**:  
    Menghapus episode berdasarkan ID, dengan validasi untuk memastikan hanya pemilik komik yang dapat melakukannya.  
  - **`getEpisodeDetails`**:  
    Mengambil detail lengkap dari satu episode berdasarkan ID episode.

---

#### **2. Folder `routes`**
Folder ini mendefinisikan endpoint untuk API dan menghubungkan setiap endpoint ke fungsi yang relevan di dalam controller.

- **`authRoutes.js`**:  
  Menangani rute autentikasi, seperti:  
  - `POST /register`: Registrasi pengguna.  
  - `POST /verify`: Verifikasi akun pengguna.  
  - `POST /login`: Login pengguna.  
  - `POST /reset-password`: Mengatur ulang password.  
  - `POST /request-reset-password`: Meminta token untuk reset password.  

- **`comicRoutes.js`**:  
  Mengatur rute untuk komik, seperti:  
  - `GET /comics`: Mengambil daftar semua komik.  
  - `GET /comics/:id`: Mengambil detail komik berdasarkan ID.  
  - `POST /comics`: Membuat komik baru.  
  - `PUT /comics/:id`: Memperbarui data komik.  
  - `DELETE /comics/:id`: Menghapus komik tertentu.

- **`episodeRoutes.js`**:  
  Mengelola rute episode, seperti:  
  - `GET /episodes/:comicId`: Mengambil semua episode untuk komik tertentu.  
  - `POST /episodes`: Menambahkan episode baru.  
  - `PUT /episodes/:id`: Mengedit episode tertentu.  
  - `DELETE /episodes/:id`: Menghapus episode berdasarkan ID.  

- **`userRoutes.js`**:  
  Menangani rute untuk data pengguna, seperti:  
  - `GET /users/:id`: Mengambil detail profil pengguna.  
  - `PUT /users/:id`: Memperbarui data pengguna.

---

#### **3. Folder `middleware`**
Folder ini berisi middleware untuk memproses request sebelum diteruskan ke controller.  
- **`jwtMiddleware.js`**:  
  Middleware untuk memverifikasi token JWT, memastikan pengguna yang mengakses endpoint telah terautentikasi.  
  - Menyisipkan data pengguna (seperti `userId`) ke dalam request.

---

#### **4. Folder `services`**
Folder ini menyediakan layanan utilitas yang mendukung fitur utama aplikasi.  

- **`emailService.js`**:  
  Mengelola pengiriman email, seperti:  
  - Email verifikasi akun pengguna.  
  - Email reset password.  
- **`notificationService.js`**:  
  Menyediakan fungsi untuk mengirimkan notifikasi, baik melalui email atau media lainnya.

---

#### **5. Folder `db`**
Folder ini berisi file konfigurasi database.  
- **`connections.js`**:  
  Mengatur koneksi database, termasuk autentikasi dan konfigurasi variabel lingkungan (`.env`).

---

#### **6. Folder `utils`**
Folder ini berisi fungsi utilitas untuk mendukung berbagai kebutuhan aplikasi.  
- **`response.js`**:  
  Membantu membuat respons standar, seperti `successResponse` dan `errorResponse`.  
- **`jwtHelper.js`**:  
  Berisi fungsi untuk membuat dan memverifikasi token JWT.

---

#### **7. File `.env`**
Berisi konfigurasi sensitif, seperti:  
- `DB_HOST`, `DB_USER`, `DB_PASS`: Untuk koneksi database.  
- `JWT_SECRET`: Untuk token JWT.  
- `EMAIL_API_KEY`: Untuk layanan email.

---

#### **8. File `server.js`**
File utama aplikasi, bertanggung jawab untuk:  
- Inisialisasi server dengan Express.  
- Memasang middleware global.  
- Menghubungkan rute dari folder `routes`.  
- Menjalankan server pada port tertentu.

---

#### **9. File `package.json`**
File ini berisi metadata proyek, daftar dependensi, dan script untuk menjalankan aplikasi.

--- 

**[⬆ kembali ke atas](#daftar-isi)**
