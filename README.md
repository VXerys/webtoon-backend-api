# Webtoon Backend API Documentation

---

## **Daftar Isi**

1. [Pendahuluan](#pendahuluan)  
2. [Database](#database)  
3. [Struktur Proyek](#struktur-proyek)  
4. [Penjelasan Folder dan File](#penjelasan-folder-dan-file)  
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

### **4. Tabel `comments`**

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

### **5. Tabel `likes`**

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

### **6. Tabel `notifications`**

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

### **7. Tabel `favorites`**

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

**[⬆ back to top](#Daftar Isi)
