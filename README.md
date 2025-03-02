# 📚 Webtoon Backend API Documentation  
*Platform Backend untuk Aplikasi Komik Digital Modern*  

---

## 👥 **Anggota Kelompok**  
**Kelompok 4 - Proyek Webtoon API**  
| **Nama Anggota**                 | **NIM**       |  
|----------------------------------|---------------|  
| M. Sechan Alfarisi               | 20230040094   |  
| Inda Fadila Ainul Hawa           | 20230040074   |  
| Muhammad Sinar Agusta            | 20230040188   |  


---

## **Daftar Isi**

- 🌟 [Pendahuluan](#pendahuluan)   
- 🗃️ [Database](#database)   
- 🏗️ [Struktur Proyek](#struktur-proyek)
- 🔗 [Endpoint API](#penjelasan-endpoint-api)
  - 🔐 [Autentikasi](#auth)
  - 📖 [Komik](#comics)
  - 🎬 [Episode](#episode)  
  - 💬 [Komentar](#comments)  
- 💻 [Kode Utama dan Fungsionalitas](#kode-utama-dan-fungsionalitas)
  - 🖥️ [Server](#server-file) 
  - 🛡️ [Middleware](#middlewares-folder)  
  - 📧 [Services](#services-folder)  
  - 🗄️ [Database](#database-folder)  
  - 🛣️ [Routes](#routes-folder)  
  - 🎮 [Controller](#controller)
    <details>
      <summary>Klik untuk melihat semua controller</summary>
      
      - [**Auth Controller**](#auth-controller)  
      - [**Comics Controller**](#comics-controller)  
      - [**Comments Controller**](#comments-controller)  
      - [**Episodes Controller**](#episode-controller)  
    </details>
- 🏁 [Kesimpulan](#-kesimpulan)

---

## **Pendahuluan**  

### 🎯 **Deskripsi Proyek**  
**Webtoon Backend API** adalah solusi backend khusus untuk platform komik digital yang menyediakan:  
✨ **Manajemen Konten**: CRUD komik & episode dengan optimasi media  
✨ **Penyimpanan Cloud**: Manajemen gambar cover via Cloudinary  
✨ **Sistem Pengguna**: Registrasi, login, verifikasi email  
✨ **Interaksi**: Komentar & rating (opsional)  
✨ **Keamanan**: JWT Token & role-based access  

Dibangun untuk mendukung aplikasi frontend (web/mobile) dengan arsitektur RESTful API yang scalable.  

---

### 🚀 **Tujuan Proyek**  
| Ikon | Tujuan |  
|------|--------|  
| 🖼️ | Optimasi penyimpanan gambar dengan Cloudinary |  
| 🔑 | Autentikasi pengguna dengan JWT Token |  
| 🚀 | Response API <500ms untuk operasi CRUD |  
| 🛡️ | Proteksi endpoint dengan RBAC |  

---

### ⚙️ **Teknologi Inti**  
| Komponen          | Teknologi               | Ikon |  
|-------------------|-------------------------|------|  
| **Backend**       | Node.js + Express       | 🟢 |  
| **Database**      | MySQL                   | 🐬 |  
| **Auth**          | JWT + Bcrypt            | 🔐 |  
| **Media Cloud**   | Cloudinary              | ☁️ |  
| **Testing**       | Postman                 | 📡 |  

---

### 🎨 **Fitur Unggulan**  
- 🖼️ **Cloud Image Optimization**  
  - Auto-convert gambar ke WebP  
  - Kompresi lossless dengan kualitas terjaga  
  - CDN global untuk delivery cepat  
  
- 🧩 **Modular Codebase**  
- 📊 **Relational Database**  
- 🔍 **Advanced Search**  
- 📅 **Automated Services**  

---

### 🌍 **Penerapan**  
**API ini cocok untuk**:  
- Platform komik dengan kebutuhan unggah gambar intensif  
- Startup yang ingin fokus ke core business tanpa mengelola infrastruktur media  
- Sistem yang membutuhkan delivery gambar berperforma tinggi  

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

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
       cloudinary_public_id VARCHAR(255),
       status ENUM('ongoing', 'completed') DEFAULT 'ongoing',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
   );
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

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

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
│   ├── jwtMiddleware.js
│   └── uploadMiddleware.js
│
├── services/
│   ├── emailService.js
│   └── cloudinary.js
│
├── db/
│   └──connections.js
│
├── utils/
│   └──response.js
│    
│
├── .env
├── server.js
└── package.json
```

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

--- 

### **Penjelasan Endpoint API**

#### **Auth**

Folder `Auth` digunakan untuk mengelola autentikasi dan manajemen pengguna, termasuk registrasi, login, verifikasi email, serta pemulihan kata sandi. Berikut adalah daftar endpoint yang tersedia:

---

##### **1. POST /auth/register**

**Deskripsi:**  
Endpoint ini digunakan untuk mendaftarkan pengguna baru. Data yang diperlukan adalah:
- **`username`**: Nama pengguna.
- **`email`**: Alamat email pengguna.
- **`password`**: Kata sandi.
- **`confirmPassword`**: Konfirmasi kata sandi.

**Contoh Request:**

```json
POST /auth/register
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

**Respons:**  
Jika berhasil, pengguna akan menerima email verifikasi. Jika gagal, akan mengembalikan pesan error.

**Contoh Respons:**

```json
{
  "message": "User registered successfully. Check your email for verification."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![register](https://github.com/user-attachments/assets/48d839c0-d234-4d1e-83f6-13ff4efbe103)

---

##### **2. POST /auth/verify**

**Deskripsi:**  
Endpoint ini digunakan untuk memverifikasi akun pengguna. Data yang diperlukan adalah:
- **`email`**: Alamat email pengguna.
- **`verificationCode`**: Kode verifikasi yang dikirim melalui email.

**Contoh Request:**

```json
POST /auth/verify
{
  "email": "johndoe@example.com",
  "verificationCode": "123456"
}
```

**Respons:**  
Jika berhasil, status akun pengguna diperbarui menjadi terverifikasi.

**Contoh Respons:**

```json
{
  "message": "User verified successfully."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![verify](https://github.com/user-attachments/assets/6d4c3910-70c6-4efa-b6e0-963d55169d99)


*Tampilkan pesan email untuk register:*
> ![WhatsApp Image 2025-01-23 at 21 42 27_d1a0926c](https://github.com/user-attachments/assets/ea604dcd-6254-457c-b77e-d23df3cfd836)

---

##### **3. POST /auth/login**

**Deskripsi:**  
Endpoint ini digunakan untuk login pengguna. Data yang diperlukan adalah:
- **`email`**: Alamat email pengguna.
- **`password`**: Kata sandi pengguna.

**Contoh Request:**

```json
POST /auth/login
{
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

**Respons:**  
Jika berhasil, akan mengembalikan token JWT untuk autentikasi. Jika gagal, pesan error akan diberikan.

**Contoh Respons:**

```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![login](https://github.com/user-attachments/assets/b7136e5a-38bd-440f-adc5-7bda06ae8e05)

---

##### **4. POST /auth/request-reset-password-code**

**Deskripsi:**  
Endpoint ini digunakan untuk meminta kode reset password. Data yang diperlukan adalah:
- **`email`**: Alamat email pengguna.

**Contoh Request:**

```json
POST /auth/request-reset-password-code
{
  "email": "johndoe@example.com"
}
```

**Respons:**  
Jika berhasil, sistem akan mengirimkan kode reset password ke email pengguna.

**Contoh Respons:**

```json
{
  "message": "Reset password code sent. Please check your email."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![request-reset-password](https://github.com/user-attachments/assets/cd27644a-8ca3-42e7-afdc-c68796ab5928)

*Tampilkan pesan email untuk request reset password:*
> ![WhatsApp Image 2025-01-23 at 21 32 47_2c64b281](https://github.com/user-attachments/assets/12b6ef4a-afc9-46c8-ae78-fa85a2035038)

---

##### **5. POST /auth/reset-password**

**Deskripsi:**  
Endpoint ini digunakan untuk mereset kata sandi pengguna. Data yang diperlukan adalah:
- **`email`**: Alamat email pengguna.
- **`verificationCode`**: Kode verifikasi untuk reset password.
- **`newPassword`**: Kata sandi baru.
- **`confirmPassword`**: Konfirmasi kata sandi baru.

**Contoh Request:**

```json
POST /auth/reset-password
{
  "email": "johndoe@example.com",
  "verificationCode": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Respons:**  
Jika berhasil, sistem akan memperbarui kata sandi pengguna di database.

**Contoh Respons:**

```json
{
  "message": "Password reset successfully."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![5-reset-password](https://github.com/user-attachments/assets/c80ed721-7e40-4c39-96b9-fbca23d632af)

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

#### **Comics**

Folder `Comics` digunakan untuk mengelola data komik, mulai dari membuat, membaca, mengedit, hingga menghapus data komik. Berikut adalah daftar endpoint yang tersedia:

##### **1. POST /comics/create**  
**Membuat Komik Baru dengan Upload Cover ke Cloudinary**

###### 🔑 **Headers**
```http
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

###### 📦 **Request Body (form-data)**
| Key             | Type      | Required | Description                          |
|-----------------|-----------|----------|--------------------------------------|
| `title`         | Text      | Yes      | Judul komik (3-255 karakter)         |
| `description`   | Text      | No       | Deskripsi komik (maks 500 karakter)  |
| `creator_id`    | Text      | Yes      | ID pembuat komik (numerik)           |
| `genre`         | Text      | No       | Genre komik (contoh: "Fantasy,Action") |
| `status`        | Text      | No       | Status komik (default: "ongoing")    |
| `cover_image`   | File      | Yes      | File gambar cover (JPEG/PNG/WEBP)    |

###### ✅ **Response Sukses (201 Created)**
```json
{
  "message": "Comic created successfully",
  "data": {
    "id": 5,
    "title": "Amazing Comic",
    "cover_url": "https://res.cloudinary.com/.../webtoon/covers/xyz.webp",
    "cloudinary_public_id": "webtoon/covers/xyz"
  }
}
```

###### 🚨 **Error Scenarios**
1. **Validasi Gagal (400 Bad Request)**  
```json
{
  "message": "Title and creator_id are required"
}
```

2. **File Tidak Valid (400 Bad Request)**  
```json
{
  "message": "Only image files are allowed (JPEG/PNG/WEBP)"
}
```

3. **Ukuran File Melebihi Batas (400 Bad Request)**  
```json
{
  "message": "File size exceeds 10MB limit"
}
```

---

##### 📸 **Contoh Penggunaan di Postman**
1. Pilih **Body** → **form-data**
2. Isi field berikut:  
   ```ini
   Key: title          Value: Amazing Comic
   Key: creator_id     Value: 11
   Key: genre          Value: Fantasy,Action
   Key: cover_image    Value: [Pilih file cover.jpg]
   ```

---

##### 🔧 **Catatan Teknis**
1. **Optimasi Gambar**  
   - Gambar otomatis dikonversi ke format WebP  
   - Kompresi kualitas otomatis (`quality: "auto:good"`)

2. **Keamanan**  
   - File temporary otomatis dihapus setelah upload  
   - Gambar disimpan di folder terisolasi: `webtoon/covers`

3. **Validasi Backend**  
   ```javascript
   if (!req.file) {
     return res.status(400).json({ message: "Cover image is required" });
   }
   ```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![image](https://github.com/user-attachments/assets/21ec43a3-a5c7-4d2e-a2f2-d800c6058706)


---

##### **2. GET /comics**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil semua data komik yang tersedia. Mendukung fitur filter dan pagination melalui parameter query opsional:
- **`page`** (opsional): Halaman data yang diinginkan.
- **`limit`** (opsional): Jumlah data per halaman.
- **`genre`** (opsional): Filter berdasarkan genre.

**Contoh Request:**

```json
GET /comics?page=1&limit=10&genre=Adventure
```

**Respons:**  
Mengembalikan daftar komik beserta metadata pagination.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![2-get-all-comic](https://github.com/user-attachments/assets/2628cfbb-97cd-48f1-96fc-e9317bcb2b84)


---

Berikut revisi dokumentasi endpoint `PUT /comics/edit/:id` yang terintegrasi dengan Cloudinary:

---

##### **3. PUT /comics/edit/:id**  
**Memperbarui Data Komik dengan Opsi Update Cover**

###### 🔑 **Headers**
```http
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

#### 📦 **Request Body (form-data)**
| Key             | Type      | Required | Description                          |
|-----------------|-----------|----------|--------------------------------------|
| `title`         | Text      | Yes      | Judul baru komik                     |
| `creator_id`    | Text      | Yes      | ID pembuat komik (harus valid)       |
| `genre`         | Text      | No       | Genre baru (contoh: "Fantasy,Action")|
| `description`   | Text      | No       | Deskripsi baru                       |
| `status`        | Text      | No       | Status baru (ongoing/completed)      |
| `cover_image`   | File      | No       | File gambar cover baru (opsional)    |

###### ✅ **Response Sukses (200 OK)**
```json
{
  "message": "Comic updated successfully",
  "data": {
    "id": 4,
    "new_cover_url": "https://res.cloudinary.com/.../new_cover.webp",
    "affected_fields": ["title", "cover_image"]
  }
}
```

###### 🚨 **Error Scenarios**
1. **Validasi Gagal (400 Bad Request)**  
```json
{
  "message": "Title and creator_id are required"
}
```

2. **ID Komik Tidak Valid (404 Not Found)**  
```json
{
  "message": "Comic not found"
}
```

3. **Gagal Update Gambar (500 Internal Error)**  
```json
{
  "message": "Failed to process image update"
}
```

---

##### 📸 **Contoh Penggunaan di Postman**
1. Pilih **PUT** method dan URL: `http://localhost:3000/comics/edit/4`  
2. Konfigurasi **Headers**:  
3. Isi **Body** → **form-data**:  
   ```ini
   Key: title          Value: Solo Leveling Reborn
   Key: creator_id     Value: 11
   Key: cover_image    Value: [Pilih file new_cover.jpg]
   ```

---

##### 🔧 **Mekanisme Update Cover**
1. **Jika upload gambar baru**:  
   - Gambar lama dihapus dari Cloudinary  
   - Metadata diupdate:  
     ```sql
     UPDATE comics SET 
       cover_image_url = 'new_url',
       cloudinary_public_id = 'new_public_id' 
     WHERE id = 4
     ```
2. **Tanpa upload gambar**:  
   - Kolom cover tetap menggunakan nilai sebelumnya  

---

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![image](https://github.com/user-attachments/assets/37274561-95ee-4de3-8749-cdcb3164878b)


---

##### **4. GET /comics/4**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil detail data komik berdasarkan ID.

**Contoh Request:**

```json
GET /api/comics/4
```

**Respons:**  
Mengembalikan data komik secara lengkap berdasarkan ID.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![4-getComicById](https://github.com/user-attachments/assets/8e545dae-4108-45c3-886f-a4fdb5a93623)


---

##### **5. DELETE /comics/delete/3**

**Deskripsi:**  
Endpoint ini digunakan untuk menghapus data komik berdasarkan ID.

**Contoh Request:**

```json
DELETE /comics/delete/5
```

**Respons:**  
Jika berhasil, akan mengembalikan pesan konfirmasi penghapusan.

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![image](https://github.com/user-attachments/assets/2d4396f6-cb01-4f47-be19-4f9abb1035d0)


---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

#### **Episode**

Folder `Episode` digunakan untuk mengelola data episode dari sebuah komik, termasuk membuat episode baru, membaca daftar episode berdasarkan ID komik, mengedit, menghapus, dan melihat detail dari sebuah episode tertentu. Berikut daftar endpoint yang tersedia:

---

##### **1. POST /episodes/create**

**Deskripsi:**  
Endpoint ini digunakan untuk membuat episode baru untuk sebuah komik yang telah ada. Data yang diperlukan adalah:
- **`comicId`**: ID komik yang menjadi parent dari episode ini.
- **`title`**: Judul episode.
- **`content`**: Isi atau konten dari episode (bisa berupa teks atau file gambar).
- **`episodeNumber`**: Nomor urut episode.

**Contoh Request:**

```json
POST /episodes/create
{
  "comicId": 1,
  "title": "Episode 1: The Beginning",
  "content": "https://example.com/episode-1-content.jpg",
  "episodeNumber": 1
}
```

**Respons:**  
Jika berhasil, data episode yang baru dibuat akan dikembalikan.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![1-create-episode](https://github.com/user-attachments/assets/0fb707d3-a5cb-47d6-aa5c-0b96b3f516ad)


---

##### **2. GET /episodes/4**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil daftar semua episode berdasarkan **ID komik**. Mendukung pagination dengan parameter opsional:
- **`page`** (opsional): Halaman data yang diinginkan.
- **`limit`** (opsional): Jumlah data per halaman.

**Contoh Request:**

```json
GET /episodes/4
```

**Respons:**  
Mengembalikan daftar episode yang terdaftar dalam komik tersebut, beserta metadata pagination.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![2-get-all-episode-by-comic-id](https://github.com/user-attachments/assets/a8a5709f-1134-4e17-8cd5-5af542d6c925)


---

##### **3. PUT /episodes/edit/10**

**Deskripsi:**  
Endpoint ini digunakan untuk mengedit data episode berdasarkan ID episode. Data yang dapat diubah adalah:
- **`title`**
- **`content`**
- **`episodeNumber`**

**Contoh Request:**

```json
PUT /episodes/edit/10
{
  "title": "Episode 1: A New Beginning",
  "content": "https://example.com/updated-episode-1-content.jpg",
  "episodeNumber": 1
}
```

**Respons:**  
Jika berhasil, data episode yang telah diperbarui akan dikembalikan.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![3-edit-episode](https://github.com/user-attachments/assets/139a7db6-d531-4776-94dc-9d7cb8b95081)


---

##### **4. GET /episodes/details/12**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil detail lengkap dari sebuah episode berdasarkan **ID episode**.

**Contoh Request:**

```json
GET /episodes/details/12
```

**Respons:**  
Mengembalikan detail episode yang diminta.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![4-detail-episode](https://github.com/user-attachments/assets/d8514c7f-7069-490e-b271-c7139f9dc8d7)


---

##### **5. DELETE /episodes/delete/12**

**Deskripsi:**  
Endpoint ini digunakan untuk menghapus sebuah episode berdasarkan **ID episode**.

**Contoh Request:**

```json
DELETE /episodes/delete/12
```

**Respons:**  
Jika berhasil, akan mengembalikan pesan konfirmasi penghapusan.

**Contoh Respons:**

```json
{
  "message": "Episode deleted successfully."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![5-delete-episode](https://github.com/user-attachments/assets/63390814-a2a5-4275-92c2-5487fb81a92a)

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---


#### **Comments**

Folder `Comments` digunakan untuk mengelola komentar yang berkaitan dengan komik dan episode. Komentar dapat ditambahkan, diubah, dihapus, serta diambil berdasarkan ID komik atau ID episode tertentu. Berikut adalah daftar endpoint yang tersedia:

---

##### **1. POST /comments/create-comment**

**Deskripsi:**  
Endpoint ini digunakan untuk menambahkan komentar baru pada sebuah komik atau episode. Data yang diperlukan adalah:
- **`type`**: Jenis komentar, bisa berupa `"comic"` atau `"episode"`.
- **`id`**: ID komik atau episode yang ingin diberikan komentar.
- **`content`**: Isi komentar.

**Contoh Request:**

```json
POST /comments/create-comment
{
  "type": "comic",
  "id": 1,
  "content": "This is an amazing comic! Great job!"
}
```

**Respons:**  
Jika berhasil, data komentar yang baru dibuat akan dikembalikan.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![1-create-comment](https://github.com/user-attachments/assets/0a4ab169-331e-4cda-9d7f-c490cd2344f3)


---

##### **2. PUT /comments/edit-comment/7**

**Deskripsi:**  
Endpoint ini digunakan untuk mengedit komentar berdasarkan **ID komentar**. Data yang dapat diubah adalah:
- **`content`**: Isi komentar.

**Contoh Request:**

```json
PUT /comments/edit-comment/7
{
  "content": "This comic is incredible! Can't wait for more."
}
```

**Respons:**  
Jika berhasil, data komentar yang telah diperbarui akan dikembalikan.

**Contoh Respons:**

```json
{
  "message": "Comment updated successfully.",
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![2-edit-comment](https://github.com/user-attachments/assets/35800f1e-2572-4767-8b1c-855378b259ec)


---

##### **3. DELETE /comments/delete-comment/7**

**Deskripsi:**  
Endpoint ini digunakan untuk menghapus sebuah komentar berdasarkan **ID komentar**.

**Contoh Request:**

```json
DELETE /comments/delete-comment/7
```

**Respons:**  
Jika berhasil, akan mengembalikan pesan konfirmasi penghapusan.

**Contoh Respons:**

```json
{
  "message": "Comment deleted successfully."
}
```

**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![3-deleteComment](https://github.com/user-attachments/assets/cb5f74d5-800c-4e79-a5d0-8447cee6a165)


---

##### **4. GET /comments/get-comment/4**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil semua komentar yang berkaitan dengan **ID komik** tertentu. Mendukung pagination dengan parameter opsional:
- **`page`** (opsional): Halaman data yang diinginkan.
- **`limit`** (opsional): Jumlah data per halaman.

**Contoh Request:**

```json
GET /comments/get-comment/4
```

**Respons:**  
Mengembalikan daftar komentar yang terkait dengan komik tersebut, beserta metadata pagination.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![4-get-comment-by-comic](https://github.com/user-attachments/assets/c9a3220b-48fa-49f3-a778-c4eb971b24fe)


---

##### **5. GET /comments/get-comment-episode/8**

**Deskripsi:**  
Endpoint ini digunakan untuk mengambil semua komentar yang berkaitan dengan **ID episode** tertentu. Mendukung pagination dengan parameter opsional:
- **`page`** (opsional): Halaman data yang diinginkan.
- **`limit`** (opsional): Jumlah data per halaman.

**Contoh Request:**

```json
GET /comments/get-comment-episode/8
```

**Respons:**  
Mengembalikan daftar komentar yang terkait dengan episode tersebut, beserta metadata pagination.


**Screenshot:**  
*Tampilkan hasil pengujian endpoint ini di Postman menggunakan gambar, misalnya:*
> ![5-comment-by-episode](https://github.com/user-attachments/assets/0e40984a-7951-48a7-a6e5-16abff8d5954)


---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

## **Kode Utama dan Fungsionalitas**

### **Server file**
File `server.js` merupakan entry point dari aplikasi backend. File ini bertanggung jawab untuk mengatur server Express, middleware, dan routing ke berbagai fitur aplikasi. Berikut adalah penjelasan fungsi utama dalam file ini:

#### **Fungsi Utama:**
1. **Konfigurasi Environment:**  
   Menggunakan modul `dotenv` untuk membaca variabel lingkungan (`.env`) seperti port aplikasi.

2. **Middleware Body Parser:**  
   Menggunakan `body-parser` untuk mem-parsing payload JSON pada setiap request agar mudah diakses melalui `req.body`.

3. **Routing:**  
   File ini mengatur rute untuk berbagai endpoint:
   - **`/auth`**: Rute yang mengarah ke fitur autentikasi.
   - **`/comics`**: Rute untuk fitur manajemen komik.
   - **`/comments`**: Rute untuk fitur komentar.
   - **`/episodes`**: Rute untuk fitur episode.

4. **Server Initialization:**  
   Aplikasi dijalankan pada port yang ditentukan oleh variabel `PORT`, dengan nilai default 3000 jika `PORT` tidak tersedia.

#### **Kode:**
```javascript
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/comics', require('./routes/comicsRoutes'));
app.use('/comments', require('./routes/commentsRoutes'));
app.use('/episodes', require('./routes/episodeRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Middlewares Folder

#### **jwtMiddlewares file**
File `jwtMiddlewares.js` berisi middleware untuk autentikasi dan otorisasi berbasis JWT (JSON Web Token). File ini bertanggung jawab memastikan request yang masuk memiliki token valid dan memverifikasi apakah pengguna memiliki izin untuk mengakses resource tertentu.

##### **Fungsi Utama:**
1. **`verifyTokenJWT`**  
   - Mengecek apakah request memiliki header otorisasi dengan token JWT.  
   - Memverifikasi token menggunakan kunci rahasia (`process.env.JWT_SECRET`).  
   - Jika token valid, informasi pengguna (ID dan role) ditambahkan ke objek `req.user`.

2. **`checkRole`**  
   - Middleware untuk membatasi akses berdasarkan peran pengguna.
   - Mengambil parameter `requiredRoles` (array peran) dan mengecek apakah peran pengguna sesuai dengan yang diperlukan.

##### **Kode:**
```javascript
const jwt = require('jsonwebtoken');

const verifyTokenJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  verifyTokenJWT,
  checkRole
};
```

Berikut dokumentasi teknis untuk `uploadMiddleware.js`:

---

#### 📁 **uploadMiddleware**  
*Middleware untuk Handle File Upload dengan Multer*

```javascript
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

// Filter tipe file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Konfigurasi utama multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
```

---

##### 🔧 **Konfigurasi Parameter**
| Parameter         | Nilai                  | Deskripsi                                  |
|-------------------|------------------------|--------------------------------------------|
| `destination`     | `tmp/`                 | Folder penyimpanan sementara               |
| `filename`        | `Timestamp + Ekstensi` | Format penamaan file unik                  |
| `fileFilter`      | `image/*`              | Hanya menerima file gambar                 |
| `limits.fileSize` | `10MB`                 | Batas maksimal ukuran file                 |

---

##### 🛠️ **Cara Penggunaan**
### Di Routes
```javascript
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload', upload.single('cover_image'), (req, res) => {
  // File tersedia di req.file
  console.log(req.file);
});
```

---

##### 🚨 **Error Handling**
### Contoh Error Response
```json
{
  "error": "File upload failed",
  "message": "Hanya file gambar yang diperbolehkan!"
}
```

###### Jenis Error
1. **Invalid File Type** (400 Bad Request)
2. **File Too Large** (413 Payload Too Large)
3. **No File Selected** (400 Bad Request)

---

##### 📂 **Struktur File Temporary**
```
project-root/
└── tmp/
    ├── 123456789.jpg
    ├── 987654321.png
    └── ...
```

---

##### 🔒 **Best Practices**
1. **Validasi Ekstensi File**
   ```javascript
   const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
   if (!allowedExtensions.includes(ext.toLowerCase())) {
     cb(new Error('Ekstensi file tidak didukung'), false);
   }
   ```
   
2. **Auto-Cleanup**  
   Hapus file temporary setelah diproses:
   ```javascript
   fs.unlinkSync(req.file.path);
   ```

3. **Environment Safety**  
   Tambahkan `.gitignore`:
   ```gitignore
   tmp/
   ```

---

##### 📸 **Contoh Penggunaan di Postman**
![Postman Example](https://via.placeholder.com/800x400?text=Form-Data+Upload+Example)
```http
POST /api/upload
Headers:
- Content-Type: multipart/form-data

Body:
- Key: cover_image (Type: File)
- Key: other_field (Type: Text)
```
---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---
### Services Folder

#### **emailServices file**
File `emailServices.js` digunakan untuk menangani pengiriman email, seperti email verifikasi dan reset password. File ini menggunakan modul `nodemailer` untuk mengirim email melalui server SMTP.

#### **Fungsi Utama:**
1. **`generateVerificationCode` & `generateResetToken`:**  
   - Membuat kode unik untuk verifikasi email dan reset password.  
   - Kode dihasilkan secara acak dan bersifat sementara.

2. **`transporter`:**  
   - Konfigurasi transport SMTP menggunakan `nodemailer` dengan kredensial email yang disimpan di `.env`.

3. **`sendEmail`:**  
   - Fungsi generik untuk mengirim email berdasarkan parameter `to`, `subject`, dan `html`.

4. **`sendVerificationEmail`:**  
   - Mengirim email berisi kode verifikasi untuk mendaftarkan akun baru.

5. **`sendResetPasswordEmail`:**  
   - Mengirim email berisi kode reset password jika pengguna meminta reset password.

#### **Kode:**
```javascript
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateResetToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  socketTimeout: 20000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`${subject} email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending ${subject} email:`, error);
    throw new Error(`Failed to send ${subject} email`);
  }
};

const sendVerificationEmail = async (to, verificationCode) => {
  const html = `
    <p>Thank you for registering!</p>
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p>Please use this code to verify your email. The code will expire in 1 hour.</p>
  `;
  await sendEmail({ to, subject: 'Email Verification', html });
};

const sendResetPasswordEmail = async (to, resetToken) => {
  const html = `
    <p>Your reset password code is: <strong>${resetToken}</strong></p>
    <p>The code will expire in 1 hour.</p>
  `;
  await sendEmail({ to, subject: 'Reset Password', html });
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmail,
  generateVerificationCode,
  generateResetToken
};
```

---

#### 📁 **Cloudinary**  
*Konfigurasi Cloudinary untuk Manajemen Media*

```javascript
const cloudinary = require('cloudinary').v2;

/**
 * Konfigurasi utama Cloudinary
 * @module CloudinaryConfig
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;
```

---

##### 🔧 **Konfigurasi Parameter**
| Parameter           | Nilai                   | Deskripsi                                  |
|---------------------|-------------------------|--------------------------------------------|
| `cloud_name`        | `process.env.CLOUDINARY_CLOUD_NAME`  | Nama cloud akun Cloudinary                 |
| `api_key`           | `process.env.CLOUDINARY_API_KEY`     | API Key untuk autentikasi                  |
| `api_secret`        | `process.env.CLOUDINARY_API_SECRET`  | API Secret untuk autentikasi               |
| `secure`            | `true`                  | Enforce HTTPS untuk semua request          |

---

##### 🌐 **Environment Variables**
Tambahkan di `.env`:
```ini
# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key_123
CLOUDINARY_API_SECRET=your_api_secret_abc
```

---

##### 💻 **Contoh Penggunaan**
```javascript
// Di controller
const cloudinary = require('../config/cloudinary');

// Upload gambar
const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'webtoon/covers',
    format: 'webp'
  });
};
```

---

##### 🔒 **Best Practices**
1. **Proteksi Credential**
   - Jangan hardcode credential di kode
   - Gunakan environment variables
   - Batasi akses API key di dashboard Cloudinary

2. **Optimasi Upload**
   ```javascript
   cloudinary.uploader.upload(filePath, {
     quality_analysis: true,
     responsive_breakpoints: {
       create_derived: true,
       bytes_step: 20000,
       min_width: 200,
       max_width: 1000
     }
   });
   ```

3. **Error Handling**
   ```javascript
   try {
     await cloudinary.uploader.upload(...);
   } catch (error) {
     console.error('Cloudinary Error:', error.error.message);
   }
   ```

---

##### ⚠️ **Security Considerations**
1. **API Key Rotation**  
   Rotasi API key secara berkala melalui dashboard Cloudinary

2. **Signed Uploads**  
   Untuk operasi sensitif, gunakan signed upload:
   ```javascript
   cloudinary.uploader.upload(filePath, {
     upload_preset: 'webtoon_preset',
     timestamp: Math.round(new Date().getTime()/1000),
     signature: generateSignature() // Implement signing logic
   });
   ```

3. **Access Restriction**  
   - Batasi IP yang bisa akses API
   - Enable Two-Factor Authentication di akun Cloudinary

---

🔗 **Referensi Resmi**:  
[Cloudinary Node.js SDK Documentation](https://cloudinary.com/documentation/node_integration)  
[Cloudinary Security Guide](https://cloudinary.com/documentation/security)

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Database Folder

#### **connection (DB)**

```javascript
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_webtoon'
});

db.getConnection()
    .then((connection) => {
        console.log('Database Connected');
        connection.release();
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });

module.exports = db;
```

**Perubahan dan peningkatan:**
1. Menggunakan `Promise` chaining untuk menangani koneksi database.
2. Menghapus callback `getConnection` yang sebenarnya redundant dengan penggunaan `mysql2/promise`.

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Routes Folder

### 🔐 authRoutes.js
```javascript
const express = require('express');
const router = express.Router();
// ...imports dan setup controller
```

#### 🚪 Public Routes
| Method | Endpoint                | Controller              | Deskripsi                                                                 |
|--------|-------------------------|-------------------------|---------------------------------------------------------------------------|
| POST   | `/register`             | `registerUser`          | Registrasi user baru dengan verifikasi email                              |
| POST   | `/verify`               | `verifyUser`            | Verifikasi akun menggunakan kode dari email                               |
| POST   | `/login`                | `loginUser`             | Autentikasi user dan return JWT token                                     |
| POST   | `/request-reset-password` | `requestResetPassword` | Request reset password dengan mengirim token ke email                     |
| POST   | `/reset-password`       | `resetPassword`         | Reset password menggunakan token yang valid                               |

#### 🔒 Protected Routes (Contoh)
```javascript
// router.get('/profile', verifyTokenJWT, (req, res) => {...});
// router.get('/admin', verifyTokenJWT, checkRole(['admin']), (req, res) => {...});
```
- **Middleware**: 
  - `verifyTokenJWT`: Validasi token JWT dari header Authorization
  - `checkRole`: Role-based access control (RBAC)

---

### 📚 comicsRoutes.js
```javascript
const express = require('express');
const router = express.Router();
// ...imports dan setup controller
```

#### 🌐 Public Routes
| Method | Endpoint    | Controller       | Parameter | Deskripsi                                  |
|--------|-------------|------------------|-----------|--------------------------------------------|
| GET    | `/`         | `getAllComics`   | -         | Get semua komik dengan pagination implisit |
| GET    | `/:id`      | `getComicById`   | `id`      | Get detail komik by ID                     |

#### 🛡️ Protected Routes
| Method | Endpoint       | Middleware       | Controller     | Validasi Input                          |
|--------|----------------|------------------|----------------|-----------------------------------------|
| POST   | `/create`      | `verifyTokenJWT` | `createComic`  | - Title (required)                      |
| PUT    | `/edit/:id`    | `verifyTokenJWT` | `editComic`    | - ID komik valid                        |
| DELETE | `/delete/:id`  | `verifyTokenJWT` | `deleteComic`  | - Kepemilikan resource                  |

---

### 💬 commentsRoutes.js
```javascript
const express = require('express');
const router = express.Router();
// ...imports dan setup controller
```

#### 🌐 Public Routes
| Method | Endpoint                        | Controller               | Response Format                           |
|--------|---------------------------------|--------------------------|-------------------------------------------|
| GET    | `/get-comments/:comic_id`       | `getCommentsByComicId`   | `{ comic_id, comments: [...] }`           |
| GET    | `/get-comments-episode/:episode_id` | `getCommentsByEpisodeId` | `{ episode_id, comments: [...] }`         |

#### 🛡️ Protected Routes
| Method | Endpoint             | Validasi                  | Deskripsi                                  |
|--------|----------------------|---------------------------|--------------------------------------------|
| POST   | `/create-comment`    | - Minimal 3 karakter      | Create comment dengan relasi user          |
| PUT    | `/edit-comment/:id`  | - Kepemilikan komentar    | Update text comment                        |
| DELETE | `/delete-comment/:id`| - Validasi ID numerik     | Hapus comment berdasarkan ID               |

---

### 📺 episodesRoutes.js
```javascript
const express = require('express');
const router = express.Router();
// ...imports dan setup controller
```

#### 🌐 Public Routes
| Method | Endpoint          | Controller             | Query Parameter          |
|--------|-------------------|------------------------|--------------------------|
| GET    | `/:comic_id`      | `getEpisodeByComicId`  | - comic_id (required)    |
| GET    | `/details/:id`    | `getEpisodeDetails`    | - episode_id (required)  |

#### 🛡️ Protected Routes
| Method | Endpoint       | Business Logic                   | Catatan                          |
|--------|----------------|-----------------------------------|----------------------------------|
| POST   | `/create`      | - Validasi unique episode number | Relasi ke komik                  |
| PUT    | `/edit/:id`    | - Update metadata episode        | Tidak bisa ubah comic_id         |
| DELETE | `/delete/:id`  | - Hard delete                    | Pertimbangkan soft delete        |

---

### 🔑 Security Implementation
1. **JWT Validation**
   - Token diambil dari header `Authorization` format: `Bearer <token>`
   - Expire time token: 2 jam
   - Secret key menggunakan environment variable

2. **Endpoint Protection**
   ```javascript
   router.post('/create', verifyTokenJWT, createComic);
   ```
   - Pattern: `Middleware -> Controller`
   - Tidak ada role management di implementasi saat ini

3. **Parameter Handling**
   - ID parameter selalu divalidasi sebagai numerik
   ```javascript
   router.get('/:id', getComicById); // ID auto converted to number
   ```

---

### 📦 Response Standardization
1. **Success Response**
   ```json
   {
     "data": {...},
     "message": "Operasi berhasil"
   }
   ```
2. **Error Response**
   ```json
   {
     "error": "Unauthorized",
     "message": "Token tidak valid",
     "statusCode": 401
   }
   ```

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Controller

### Auth Controller

#### 📁 Imports
```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { 
  sendVerificationEmail,
  generateVerificationCode,
  sendResetPasswordEmail,
  generateResetToken 
} = require('../services/emailService');
```
- **`bcrypt`**: Library hashing password (salt rounds default: 10)
- **`crypto`**: Generator token kriptografi secure
- **`jwt`**: Implementasi JSON Web Token untuk session management
- **`db`**: Koneksi MySQL pool dari konfigurasi lokal
- **`emailService`**: Modul helper untuk:
  - `sendVerificationEmail`: Mengirim email verifikasi
  - `generateVerificationCode`: Membuat kode 6 digit
  - `sendResetPasswordEmail`: Mengirim instruksi reset password
  - `generateResetToken`: Membuat token secure 32 byte

---

#### ✨ registerUser()
```javascript
const registerUser = async (req, res) => { ... }
```

##### 1. **Parameter Ekstraksi**
```javascript
const { username, email, password, confirmPassword } = req.body;
```
- Menerima 4 parameter wajib dari form register

##### 2. **Validasi Dasar**
```javascript
if (password !== confirmPassword) {
  return res.status(400).json({ message: 'Passwords do not match' });
}
```
- Pengecekan kesesuaian password sederhana
- Tidak ada validasi kekuatan password

##### 3. **Duplikasi Email**
```javascript
const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
```
- Pemeriksaan keberadaan email di database
- Handle 2 skenario:
  ```javascript
  if (existingUser[0] && !existingUser[0].is_verified) {
    // Kirim ulang verifikasi
  }
  if (existingUser[0]?.is_verified) {
    // Error email terdaftar
  }
  ```

##### 4. **Proses Registrasi**
```javascript
const verificationCode = generateVerificationCode();
const hashedPassword = await bcrypt.hash(password, 10);
await db.query(
  'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)',
  [username, email, hashedPassword, verificationCode]
);
```
- Hash password dengan salt 10 rounds
- Simpan kode verifikasi plain text di database

---

#### 🔑 verifyUser()
```javascript
const verifyUser = async (req, res) => { ... }
```

##### 1. **Validasi Input**
```javascript
const { email, verificationCode } = req.body;
```
- Tidak ada validasi format email/kode

##### 2. **Pencarian Pengguna**
```javascript
const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (!user.length) {
  return res.status(404).json({ message: 'User not found' });
}
```
- Error handling untuk email tidak terdaftar

##### 3. **Verifikasi Kode**
```javascript
if (user[0].verification_code !== verificationCode) {
  return res.status(400).json({ message: 'Invalid verification code' });
}
```
- Perbandingan string sederhana
- Tidak ada expiry time untuk kode

---

#### 🔐 loginUser()
```javascript
const loginUser = async (req, res) => { ... }
```

##### 1. **Validasi Credential**
```javascript
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ message: 'Email and password are required' });
}
```
- Validasi keberadaan field tanpa format

##### 2. **Authentication Flow**
```javascript
const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (!user.length) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
if (!user[0].is_verified) {
  return res.status(403).json({ message: 'Account not verified' });
}
const isValidPassword = await bcrypt.compare(password, user[0].password);
if (!isValidPassword) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```
- 3 lapis proteksi:
  1. Email terdaftar
  2. Akun terverifikasi
  3. Password valid

##### 3. **Token Generation**
```javascript
const token = jwt.sign(
  { userId: user[0].id, role: user[0].role },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);
```
- Payload minimal dengan userId dan role
- Secret key dari environment variable
- Expire time 2 jam

---

#### 🔄 resetPassword()
```javascript
const resetPassword = async (req, res) => { ... }
```

##### 1. **Validasi Parameter**
```javascript
const { email, newPassword, confirmPassword, resetToken } = req.body;
if (!email || !newPassword || !confirmPassword || !resetToken) {
  return res.status(400).json({ message: 'All fields are required' });
}
if (newPassword !== confirmPassword) {
  return res.status(400).json({ message: 'Passwords do not match' });
}
```
- Validasi kelengkapan input
- Konfirmasi password client-side

##### 2. **Token Validation**
```javascript
const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (!user.length) {
  return res.status(404).json({ message: 'User not found' });
}
if (user[0].reset_token !== resetToken) {
  return res.status(400).json({ message: 'Invalid reset token' });
}
```
- Pengecekan token di database
- Tidak ada validasi waktu kadaluarsa token

---

#### 📧 requestResetPassword()
```javascript
const requestResetPassword = async (req, res) => { ... }
```

##### 1. **User Verification**
```javascript
const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (!user.length) {
  return res.status(404).json({ message: 'User not found' });
}
if (!user[0].is_verified) {
  return res.status(403).json({ message: 'Account not verified' });
}
```
- Double check status verifikasi akun

##### 2. **Token Management**
```javascript
const resetToken = generateResetToken();
await db.query('UPDATE users SET reset_token = ? WHERE email = ?', [resetToken, email]);
```
- Generate token 32 byte hex
- Simpan token plain text di database

---

#### 🛡️ Security Implementation
1. **Password Handling**
   - Hashing dengan bcrypt (10 rounds)
   - Tidak menyimpan password plain text

2. **Session Management**
   - JWT dengan expire time 2 jam
   - Secret key dari environment variable

3. **Error Messages**
   - Pesan error generik untuk credential salah
   ```javascript
   return res.status(401).json({ message: 'Invalid credentials' });
   ```

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Comics Controller

#### 📁 Database Connection
```javascript
const db = require('../db/connection');
```
- Modul untuk mengelola koneksi database MySQL
- Menggunakan promise wrapper untuk operasi async/await

---

#### ✨ createComic()
```javascript
const createComic = async (req, res) => {
  // ...implementation
}
```

##### 1. **Ekstraksi Parameter**
```javascript
const { title, genre, description, creator_id, cover_image_url, status } = req.body;
```
- Menerima 6 parameter dari request body:
  - `title` (wajib): Judul komik (string)
  - `creator_id` (wajib): ID pembuat komik (number)
  - `genre`: Genre komik (string opsional)
  - `description`: Deskripsi panjang (text opsional)
  - `cover_image_url`: URL gambar cover (string opsional)
  - `status`: Status publikasi (default: 'ongoing')

##### 2. **Validasi Input**
```javascript
if (!title || !creator_id) {
  return res.status(400).json({ message: 'Title and creator_id are required' });
}
```
- Memastikan field wajib terisi
- Tidak ada validasi tipe data tambahan

##### 3. **Default Value Handling**
```javascript
status || 'ongoing'
```
- Set nilai default `status` ke 'ongoing' jika tidak disediakan

##### 4. **Operasi Database**
```sql
INSERT INTO comics (title, genre, description, creator_id, cover_image_url, status)
VALUES (?, ?, ?, ?, ?, ?)
```
- Menggunakan parameterized query
- Tidak ada validasi foreign key untuk `creator_id`

##### 5. **Error Handling**
```javascript
} catch (error) {
  console.error('Error creating comic:', error);
  res.status(500).json({ message: 'Internal server error' });
}
```
- Menangkap error umum database
- Log error di server side

---

#### 📚 getAllComics()
```javascript
const getAllComics = async (req, res) => {
  // ...implementation
}
```

##### 1. **Query Database**
```sql
SELECT * FROM comics
```
- Mengambil semua kolom tanpa filter
- Tidak ada pagination atau limit hasil

##### 2. **Response Structure**
```javascript
res.status(200).json(comics)
```
- Mengembalikan array langsung dari database
- Format response mentah tanpa transformasi data

---

#### 🔍 getComicById()
```javascript
const getComicById = async (req, res) => {
  // ...implementation
}
```

##### 1. **Validasi ID**
```javascript
const { id } = req.params
```
- Mengambil ID dari URL parameter
- Tidak ada validasi format numerik

##### 2. **Pencarian Database**
```sql
SELECT * FROM comics WHERE id = ?
```
- Menggunakan parameterized query untuk pencarian
- Return single object bukan array

##### 3. **Handling Not Found**
```javascript
if (results.length === 0) {
  return res.status(404).json({ message: 'Comic not found' });
}
```
- Pemeriksaan keberadaan data eksplisit

---

#### ✏️ editComic()
```javascript
const editComic = async (req, res) => {
  // ...implementation
}
```

##### 1. **Update Logic**
```sql
UPDATE comics SET 
  title = ?, 
  genre = ?, 
  description = ?, 
  creator_id = ?, 
  cover_image_url = ?, 
  status = ? 
WHERE id = ?
```
- Update semua field sekaligus
- Tidak ada pengecekan perubahan data

##### 2. **Validasi Minimal**
```javascript
if (!title || !creator_id) {
  return res.status(400).json({ message: 'Title and creator_id are required' });
}
```
- Validasi sama dengan create endpoint
- Tidak ada pengecekan kepemilikan resource

---

#### 🗑️ deleteComic()
```javascript
const deleteComic = (req, res) => {
  // ...implementation
}
```

##### 1. **Operasi Penghapusan**
```sql
DELETE FROM comics WHERE id = ?
```
- Penghapusan permanen (hard delete)
- Tidak ada pengecekan keberadaan data sebelumnya

---

#### 🛠️ Ekspor Modul
```javascript
module.exports = {
  getAllComics,
  getComicById,
  createComic,
  editComic,
  deleteComic
}
```
- Mengekspos 5 fungsi controller utama
- Siap diintegrasikan dengan router Express

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Comments Controller

#### 📁 Database Connection
```javascript
const db = require('../db/connection');
```
- Mengimpor modul koneksi database dari `../db/connection.js`
- Digunakan untuk mengeksekusi query SQL menggunakan promise wrapper

---

#### createComment()
```javascript
const createComment = async (req, res) => {
  // ...implementation
}
```

##### 1. **Ekstraksi Parameter**
```javascript
const { comment_text, comic_id, user_id, episode_id } = req.body;
```
- Mengekstrak parameter dari body request:
  - `comment_text`: Teks komentar (wajib)
  - `comic_id`: ID komik terkait (wajib)
  - `user_id`: ID user pembuat (wajib)
  - `episode_id`: ID episode (opsional)

##### 2. **Validasi Dasar**
```javascript
if (!comment_text || !comic_id || !user_id) {
  return res.status(400).json({ message: 'Comment text, comic_id, and user_id are required' });
}

if (typeof comment_text !== 'string') {
  return res.status(400).json({ message: 'Comment must be a string' });
}
```
- Memastikan field wajib tersedia
- Memvalidasi tipe data teks komentar

##### 3. **Sanitasi Input**
```javascript
const trimmedComment = comment_text.trim();
if (trimmedComment.length < 3 || trimmedComment.length > 255) {
  return res.status(400).json({ message: 'Comment must be between 3 and 255 characters' });
}
```
- Membersihkan whitespace berlebih
- Membatasi panjang teks komentar (3-255 karakter)

##### 4. **Validasi Numerik**
```javascript
if (isNaN(comic_id) || isNaN(user_id) || (episode_id && isNaN(episode_id))) {
  return res.status(400).json({ message: 'comic_id, user_id, and episode_id (if provided) must be valid numbers.' });
}
```
- Memastikan semua ID berupa angka valid
- Menggunakan `isNaN` untuk mengecek konversi numerik

##### 5. **Pemeriksaan Referensi Database**
```javascript
const [userCheck] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
if (userCheck.length === 0) {
  return res.status(404).json({ message: 'User not found' });
}

if (episode_id) {
  const [episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ? AND comic_id = ?', [episode_id, comic_id]);
  if (episodeCheck.length === 0) {
    return res.status(404).json({ message: 'Episode not found' });
  }
}
```
- Validasi keberadaan user di database
- Validasi relasi episode dan komik jika episode_id disertakan

##### 6. **Eksekusi Query Insert**
```javascript
await db.query(
  'INSERT INTO comments (comment_text, comic_id, user_id, episode_id, create_at) VALUES (?, ?, ?, ?, NOW())',
  [trimmedComment, comic_id, user_id, episode_id || null]
);
```
- Menggunakan parameterized query untuk mencegah SQL injection
- `episode_id` di-set ke `null` jika tidak disediakan
- `NOW()` untuk timestamp otomatis

---

#### editComment()
```javascript
const editComment = async (req, res) => {
  // ...implementation
}
```

##### 1. **Validasi ID Komentar**
```javascript
let { id } = req.params;
if (!id || isNaN(id)) {
  return res.status(404).json({ message: 'Valid comment ID is required' });
}
```
- Memastikan parameter ID valid dan berupa angka

##### 2. **Validasi Konten Komentar**
```javascript
const trimmedComment = comment_text.trim();
if (trimmedComment.length < 3 || trimmedComment.length > 255) {
  return res.status(400).json({ message: 'Comment must be between 3 and 255 characters' });
}
```
- Validasi identik dengan createComment untuk konsistensi

##### 3. **Pemeriksaan Eksistensi Komentar**
```javascript
const [findComment] = await db.query('SELECT * FROM comments WHERE id = ?', [id])
if (findComment.length == 0) {
  return res.status(404).json({ message: 'Comment not found' });
}
```
- Verifikasi komentar benar-benar ada sebelum update

##### 4. **Eksekusi Query Update**
```javascript
await db.query('UPDATE comments SET comment_text = ? WHERE id = ?', [trimmedComment, id]);
```
- Hanya memperbarui kolom `comment_text`
- Tidak mengubah kepemilikan komentar (`user_id`) atau relasi

---

#### deleteComment()
```javascript
const deleteComment = async (req, res) => {
  // ...implementation
}
```

##### 1. **Validasi Cascade**
```javascript
const [findComment] = await db.query('SELECT * FROM comments WHERE id = ?', [id])
if (findComment.length == 0) {
  return res.status(404).json({ message: 'Comment not found' });
}
```
- Pemeriksaan ganda sebelum penghapusan
- Mencegah operasi yang tidak perlu jika komentar tidak ada

##### 2. **Eksekusi Penghapusan**
```javascript
await db.query('DELETE FROM comments WHERE id = ?', [id]);
```
- Menggunakan soft delete (permanen)
- Pertimbangkan arsitektur soft delete jika diperlukan

---

#### getCommentsByComicId()
```javascript
const getCommentsByComicId = async (req, res) => {
  // ...implementation
}
```

##### 1. **Struktur Query**
```javascript
ORDER BY create_at DESC
```
- Menampilkan komentar terbaru pertama
- Pengurutan dilakukan di database untuk efisiensi

##### 2. **Response Format**
```javascript
res.status(200).json({ comic_id, comments });
```
- Mengembalikan ID komik untuk referensi
- Array komentar dalam bentuk mentah dari database

---

#### getCommentsByEpisodeId()
```javascript
const getCommentsByEpisodeId = async (req, res) => {
  // ...implementation
}
```

##### 1. **Complex Join Query**
```sql
SELECT 
  comments.id AS comment_id,
  users.username AS user_name
FROM comments
JOIN users ON comments.user_id = users.id
```
- Join dengan tabel users untuk mendapatkan username
- Alias kolom untuk respons yang lebih deskriptif

##### 2. **Struktur Respons Terformat**
```javascript
{
  "episode_id": "number",
  "comments": [
    {
      "user_name": "string" // Ditambahkan dari join
    }
  ]
}
```
- Menyertakan informasi user tanpa expose data sensitif
- Struktur respons yang lebih informatif

---

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---

### Episode Controller

#### 📁 Database Connection
```javascript
const db = require('../db/connection');
```
- Menggunakan modul koneksi database yang sama dengan controller lain
- Bertanggung jawab untuk eksekusi query SQL

---

#### ✨ createEpisode()
```javascript
const createEpisode = async (req, res) => { ... }
```

##### 1. **Validasi Input**
```javascript
// Validasi field wajib
if (!episode_number || !title || !content_url || !comic_id) {
  return res.status(400).json({ message: 'All fields are required' });
}

// Validasi tipe data episode_number
if (typeof episode_number !== 'number' || episode_number < 0) {
  return res.status(400).json({ message: 'Episode number must be a non-negative number' });
}

// Validasi format title
if (typeof title !== 'string' || title.trim().length === 0 || title.length > 255) {
  return res.status(400).json({ message: 'Title must be a non-empty string with a maximum length of 255 characters' });
}

// Validasi format content_url
if (typeof content_url !== 'string' || content_url.trim().length === 0 || content_url.length > 2048) {
  return res.status(400).json({ message: 'Content URL must be a non-empty string with a maximum length of 2048 characters' });
}
```
- Memastikan semua field wajib terisi
- Validasi ketat untuk tipe data dan format input
- Pembatasan panjang string sesuai kebutuhan database

##### 2. **Pemeriksaan Referensi**
```javascript
// Cek keberadaan komik
const [comic] = await db.query('SELECT * FROM comics WHERE id = ?', [comic_id]);
if (!comic) {
  return res.status(404).json({ message: 'Comic not found' });
}

// Cek duplikasi episode number
const [results] = await db.query('SELECT * FROM episodes WHERE comic_id = ? AND episode_number = ?', [comic_id, episode_number]);
if (results.length > 0) {
  return res.status(400).json({ message: 'Episode number already exists for this comic' });
}
```
- Memverifikasi referensi komik yang valid
- Mencegah duplikasi nomor episode dalam satu komik

##### 3. **Operasi Database**
```javascript
await db.query(
  'INSERT INTO episodes (comic_id, episode_number, title, content_url) VALUES (?, ?, ?, ?)',
  [comic_id, episode_number, title, content_url]
);
```
- Menggunakan parameterized query untuk keamanan
- Menyimpan data episode tanpa timestamp otomatis

---

#### 📚 getEpisodeByComicId()
```javascript
const getEpisodeByComicId = async (req, res) => { ... }
```

##### 1. **Validasi Input**
```javascript
if (!comic_id || isNaN(comic_id)) {
  return res.status(400).json({ message: 'Comic ID is required' });
}
```
- Memastikan comic_id berupa angka valid

##### 2. **Query Database**
```javascript
const [episodes] = await db.query(
  'SELECT episode_number, title FROM episodes WHERE comic_id = ? ORDER BY episode_number ASC', 
  [comic_id]
);
```
- Hanya mengambil data esensial (nomor episode dan judul)
- Pengurutan berdasarkan nomor episode ascending

##### 3. **Format Response**
```javascript
res.status(200).json({
  comic_id,
  episode_number: episodes.map((episode) => ({
    title: episode.title,
    episode_number: episode.episode_number
  })),
});
```
- Struktur respons terorganisir dengan grouping komik
- Menghilangkan field sensitif seperti content_url

---

#### ✏️ editEpisode()
```javascript
const editEpisode = async (req, res) => { ... }
```

##### 1. **Validasi Parameter**
```javascript
if(!id || isNaN(id)) {
  return res.status(400).json({ message: 'Episode ID is required' });
}

if (!episode_number || !title || !content_url) {
  return res.status(400).json({ message: 'Episode number, title, and content_url are required.' });
}
```
- Validasi ID episode dan kelengkapan data
- Tidak ada validasi tipe data tambahan

##### 2. **Pemeriksaan Eksistensi**
```javascript
const[episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
if (episodeCheck.length === 0) {
  return res.status(404).json({ message: 'Episode not found' });
}
```
- Verifikasi episode benar-benar ada sebelum update

##### 3. **Update Data**
```javascript
await db.query(
  'UPDATE episodes SET episode_number = ?, title = ?, content_url = ? WHERE id = ?',
  [episode_number, title, content_url, id]
);
```
- Update semua field sekaligus
- Tidak ada pengecekan perubahan data

---

#### 🗑️ deleteEpisode()
```javascript
const deleteEpisode = async (req, res) => { ... }
```

##### 1. **Validasi Dasar**
```javascript
if (!id) {
  return res.status(400).json({ message: 'Episode ID is required' });
}
```
- Validasi sederhana untuk parameter ID

##### 2. **Konfirmasi Eksistensi**
```javascript
const [episodeCheck] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
if (episodeCheck === 0) {
  return res.status(404).json({ message: 'Episode not found' });
}
```
- Penghapusan hanya dilakukan jika episode ditemukan

##### 3. **Operasi Penghapusan**
```javascript
await db.query('DELETE FROM episodes WHERE id = ?', [id]);
```
- Hard delete tanpa backup
- Tidak ada mekanisme soft delete

---

#### 🔍 getEpisodeDetails()
```javascript
const getEpisodeDetails = async (req, res) => { ... }
```

##### 1. **Validasi ID**
```javascript
if (!id || isNaN(id)) {
  return res.status(400).json({ message: 'Episode ID is required' });
}
```
- Memastikan parameter ID valid

##### 2. **Query Database**
```javascript
const [episode] = await db.query('SELECT * FROM episodes WHERE id = ?', [id]);
```
- Mengambil semua kolom dari tabel episodes

##### 3. **Format Respons**
```javascript
res.status(200).json({
  episode: episode[0],
});
```
- Mengembalikan objek episode lengkap
- Menampilkan semua field termasuk content_url

---

#### 🛠️ Ekspor Modul
```javascript
module.exports = { 
  getEpisodeByComicId, 
  createEpisode, 
  editEpisode, 
  deleteEpisode, 
  getEpisodeDetails 
};
```
- Mengekspos 5 fungsi utama untuk manajemen episode
- Siap diintegrasikan dengan router Express

---

#### 🔄 Alur Error Handling
1. **Try-Catch Block**  
   Semua fungsi menggunakan blok try-catch untuk menangani error database

2. **Response Konsisten**  
   - 400 Bad Request: Validasi input gagal
   - 404 Not Found: Data tidak ditemukan
   - 500 Internal Server Error: Kesalahan server umum

3. **Logging Error**  
   Mencatat error di console untuk kebutuhan debugging:
   ```javascript
   console.error('Error creating episode:', error);
   ```
   
### 🏁 **Kesimpulan**

#### 🌟 **Pencapaian Proyek**  
Webtoon Backend API berhasil menyediakan fondasi kuat untuk platform komik digital modern dengan:  
✅ **Arsitektur Modular** - Kode terstruktur dengan separation of concerns (Controller, Service, Routes)  
✅ **Keamanan Komprehensif** - Implementasi JWT, validasi input, dan error handling terstandarisasi  
✅ **Relasi Database Optimal** - Skema ER yang efisien untuk manajemen komik, episode, dan komentar  
✅ **RESTful Best Practices** - Endpoint intuitif dengan response format konsisten  

#### 🚀 **Keunggulan Utama**  
🛡️ **Proteksi Data** - Enkripsi password + verifikasi 2-layer (email & token)  
📈 **Scalability** - Kode siap untuk pengembangan fitur premium (e.g., subscription system)  
🔌 **Integrasi Mudah** - Dokumentasi API lengkap untuk frontend developer  
⚡ **Optimasi Query** - Indexing database dan parameterized query untuk performa  

#### 🔮 **Potensi Pengembangan**  
Proyek ini dapat dikembangkan lebih lanjut dengan:  
- 🧑💻 Sistem rating dan review pengguna  
- 📊 Analytics pembaca (views, popularity metrics)  
- 💰 Integrasi payment gateway untuk konten premium  
- 🤖 API documentation dengan Swagger/Postman  
- 📱 WebSocket untuk real-time notifications  

#### 📣 **Ajakan Kolaborasi**  
Kami terbuka untuk kontribusi dan saran!  
🔧 *Found a bug?* Buka issue di GitHub repository  
💡 *Punya ide fitur?* Submit pull request dengan proposal  
🌟 *Dukung proyek ini* dengan memberikan star ⭐ pada repo  

---

**"Sebuah langkah awal menuju ekosistem komik digital yang terintegrasi - ringan, aman, dan siap dikembangkan!"**  

**[⬆ Kembali ke Daftar Isi](#daftar-isi)**

---
