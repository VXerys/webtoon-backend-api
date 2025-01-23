


### **Penjelasan Kode: registerUser**

#### **Deskripsi Fungsi**
Fungsi `registerUser` adalah handler untuk endpoint pendaftaran pengguna baru. Fungsi ini menangani proses berikut:
1. Validasi input dari pengguna.
2. Pengecekan apakah email pengguna sudah terdaftar di database.
3. Jika email belum terdaftar, fungsi membuat akun baru dan mengirim email verifikasi.
4. Jika email sudah terdaftar tetapi belum terverifikasi, fungsi memperbarui data pengguna dan mengirim ulang email verifikasi.

#### **Penjelasan Kode**
1. **Import Library**
   ```javascript
   const bcrypt = require('bcrypt');
   const crypto = require('crypto');
   const jwt = require('jsonwebtoken');
   const db = require('../db/connection');
   const { sendVerificationEmail, generateVerificationCode } = require('../services/emailService');
   ```
   - `bcrypt`: Digunakan untuk mengenkripsi (hash) kata sandi sebelum menyimpannya ke database.
   - `crypto` dan `jwt`: Tidak digunakan langsung dalam fungsi ini, tetapi biasanya digunakan untuk keamanan, seperti token.
   - `db`: Modul koneksi database untuk menjalankan query SQL.
   - `sendVerificationEmail` dan `generateVerificationCode`: Fungsi untuk mengirim email verifikasi dan membuat kode verifikasi.

2. **Input Data**
   ```javascript
   const { username, email, password, confirmPassword } = req.body;
   console.log('Received data:', { username, email, password, confirmPassword });
   ```
   - Mengambil data yang dikirimkan oleh pengguna dari `req.body`, yaitu `username`, `email`, `password`, dan `confirmPassword`.
   - Logging data ini untuk debugging.

3. **Validasi Kata Sandi**
   ```javascript
   if (password !== confirmPassword) {
       return res.status(400).json({ error: 'Password and confirm password do not match.' });
   }
   ```
   - Mengecek apakah `password` dan `confirmPassword` cocok.
   - Jika tidak cocok, fungsi langsung mengembalikan respons dengan status `400` dan pesan error.

4. **Pengecekan Email di Database**
   ```javascript
   const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
   ```
   - Fungsi melakukan query ke database untuk mencari apakah email yang dimasukkan sudah terdaftar.

5. **Jika Email Sudah Terdaftar**
   ```javascript
   if (existingUser.length > 0) {
       if (!existingUser[0].is_verified) {
           const verificationCode = generateVerificationCode();
           const hashedPassword = await bcrypt.hash(password, 10);
           
           await db.query(
               'UPDATE users SET username = ?, password = ?, verification_code = ? WHERE email = ? AND is_verified = false',
               [username, hashedPassword, verificationCode, email]
           );
           await sendVerificationEmail(email, verificationCode);
           return res.json({ message: 'Verification email resent. Please check your email.' });
       } else {
           return res.status(400).json({ error: 'Email is already registered and verified.' });
       }
   }
   ```
   - **Jika belum diverifikasi**:
     - Membuat kode verifikasi baru menggunakan `generateVerificationCode()`.
     - Mengenkripsi kata sandi menggunakan `bcrypt.hash`.
     - Memperbarui data pengguna di database.
     - Mengirim ulang email verifikasi menggunakan `sendVerificationEmail()`.
     - Mengembalikan pesan bahwa email verifikasi telah dikirim ulang.
   - **Jika sudah diverifikasi**:
     - Mengembalikan respons dengan status `400` dan pesan bahwa email telah terdaftar dan diverifikasi.

6. **Jika Email Belum Terdaftar**
   ```javascript
   const verificationCode = generateVerificationCode();
   const hashedPassword = await bcrypt.hash(password, 10);
   
   await db.query(
       'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)',
       [username, email, hashedPassword, verificationCode]
   );
   await sendVerificationEmail(email, verificationCode);
   res.json({ message: 'User registered successfully. Check your email for verification.' });
   ```
   - Membuat kode verifikasi dan mengenkripsi kata sandi.
   - Menyimpan data pengguna baru ke database dengan query `INSERT INTO`.
   - Mengirim email verifikasi dengan kode verifikasi ke pengguna.
   - Mengembalikan pesan sukses bahwa pengguna telah terdaftar.

7. **Error Handling**
   ```javascript
   catch (error) {
       console.error('Error registering user:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
   ```
   - Menangkap kesalahan yang terjadi selama proses pendaftaran.
   - Mencetak kesalahan ke konsol untuk debugging.
   - Mengembalikan respons dengan status `500` dan pesan "Internal Server Error."

Berikut adalah dokumentasi untuk fungsi `registerUser` pada file `authController`:

---

#### **Endpoint: Register User**

##### **Deskripsi**
Endpoint ini digunakan untuk mendaftarkan pengguna baru. Setelah pendaftaran, sistem akan mengirimkan email verifikasi untuk mengaktifkan akun pengguna.

##### **URL**
`POST /auth/register`

##### **Request Body**
| Parameter         | Tipe Data | Wajib?  | Deskripsi                                   |
|-------------------|-----------|---------|---------------------------------------------|
| `username`        | `string`  | Ya      | Nama pengguna yang akan didaftarkan.        |
| `email`           | `string`  | Ya      | Alamat email pengguna.                      |
| `password`        | `string`  | Ya      | Kata sandi untuk akun pengguna.             |
| `confirmPassword` | `string`  | Ya      | Konfirmasi kata sandi, harus sama dengan `password`. |

##### **Response**
**Berhasil**
- **Status Code:** `200 OK`  
  **Body:**
  ```json
  {
    "message": "User registered successfully. Check your email for verification."
  }
  ```

**Email Sudah Terdaftar (Belum Terverifikasi)**
- **Status Code:** `200 OK`  
  **Body:**
  ```json
  {
    "message": "Verification email resent. Please check your email."
  }
  ```

**Email Sudah Terdaftar (Terverifikasi)**
- **Status Code:** `400 Bad Request`  
  **Body:**
  ```json
  {
    "error": "Email is already registered and verified."
  }
  ```

**Password Tidak Sesuai**
- **Status Code:** `400 Bad Request`  
  **Body:**
  ```json
  {
    "error": "Password and confirm password do not match."
  }
  ```

**Kesalahan Server**
- **Status Code:** `500 Internal Server Error`  
  **Body:**
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

##### **Proses Kerja**
1. Sistem menerima data dari body request berupa `username`, `email`, `password`, dan `confirmPassword`.
2. Validasi dilakukan untuk memastikan:
   - `password` dan `confirmPassword` cocok.
   - Email belum digunakan oleh pengguna lain.
3. Jika email sudah terdaftar tetapi belum terverifikasi:
   - Password diperbarui, dan email verifikasi baru dikirimkan.
4. Jika email belum pernah digunakan:
   - Akun baru dibuat dengan hash password menggunakan `bcrypt`.
   - Kode verifikasi dihasilkan menggunakan `generateVerificationCode()`.
   - Email verifikasi dikirimkan ke alamat email pengguna.
5. Jika terjadi kesalahan di sisi server, respons dengan status `500 Internal Server Error`.

##### **Catatan**
- **Keamanan:** Kata sandi di-hash menggunakan `bcrypt` sebelum disimpan ke database.
- **Email Verifikasi:** Email verifikasi dikirimkan menggunakan `sendVerificationEmail()`.
- **Kode Verifikasi:** Digenerate menggunakan `generateVerificationCode()`.

##### **Contoh Request**
**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Check your email for verification."
}
```

Berikut adalah penjelasan terperinci untuk fungsi `verifyUser` pada file `authController`:

---

### **Penjelasan Kode: verifyUser**

#### **Deskripsi Fungsi**
Fungsi `verifyUser` bertanggung jawab untuk memverifikasi akun pengguna yang telah mendaftar. Proses ini dilakukan dengan mencocokkan kode verifikasi yang dikirimkan melalui email dengan kode yang tersimpan di database.

#### **Langkah-Langkah dalam Kode**
1. **Input Data**
   ```javascript
   const { email, verificationCode } = req.body;
   ```
   - Fungsi ini menerima dua data dari body request:
     - `email`: Alamat email pengguna yang akan diverifikasi.
     - `verificationCode`: Kode verifikasi yang dikirimkan ke email pengguna.

2. **Query untuk Mencari Pengguna Berdasarkan Email**
   ```javascript
   const [user] = await db.query(
       'SELECT * FROM users WHERE email = ?',
       [email]
   );
   ```
   - Fungsi melakukan query ke database untuk mencari data pengguna berdasarkan email.
   - Hasil query berupa array. Jika pengguna ditemukan, data pengguna akan berada di indeks pertama (`user[0]`).

3. **Validasi Jika Pengguna Tidak Ditemukan**
   ```javascript
   if (user.length === 0) {
       return res.status(401).json({ error: 'User not found' });
   }
   ```
   - Jika hasil query kosong (`user.length === 0`), fungsi mengembalikan respons dengan status `401 Unauthorized` dan pesan error bahwa pengguna tidak ditemukan.

4. **Validasi Kode Verifikasi**
   ```javascript
   if (user[0].verification_code !== verificationCode) {
       return res.status(401).json({ error: 'Invalid verification code' });
   }
   ```
   - Fungsi membandingkan kode verifikasi yang dikirimkan oleh pengguna (`verificationCode`) dengan kode yang tersimpan di database (`user[0].verification_code`).
   - Jika kode tidak cocok, fungsi mengembalikan respons dengan status `401 Unauthorized` dan pesan error bahwa kode verifikasi tidak valid.

5. **Update Status Verifikasi di Database**
   ```javascript
   await db.query(
       'UPDATE users SET is_verified = true, verification_code = NULL WHERE id = ?',
       [user[0].id]
   );
   ```
   - Jika kode verifikasi cocok, fungsi memperbarui status pengguna di database:
     - Kolom `is_verified` diubah menjadi `true` untuk menandai bahwa pengguna telah terverifikasi.
     - Kolom `verification_code` dihapus (diset ke `NULL`) untuk alasan keamanan.

6. **Mengembalikan Respons Sukses**
   ```javascript
   res.json({ message: 'User verified successfully' });
   ```
   - Jika proses verifikasi berhasil, fungsi mengembalikan respons dengan pesan bahwa pengguna berhasil diverifikasi.

7. **Error Handling**
   ```javascript
   } catch (error) {
       console.error('Error verifying user:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
   ```
   - Jika terjadi kesalahan saat menjalankan fungsi, error ditangkap dalam blok `catch`.
   - Error dicetak ke konsol untuk debugging.
   - Fungsi mengembalikan respons dengan status `500 Internal Server Error` dan pesan error.

#### **Alur Logika**
1. Sistem menerima data `email` dan `verificationCode` dari pengguna.
2. Query ke database untuk mencari pengguna berdasarkan `email`.
3. Jika pengguna tidak ditemukan, sistem memberikan respons bahwa pengguna tidak ada.
4. Jika pengguna ditemukan tetapi kode verifikasi salah, sistem memberikan respons bahwa kode tidak valid.
5. Jika kode verifikasi benar, sistem:
   - Mengubah status pengguna menjadi terverifikasi (`is_verified = true`).
   - Menghapus kode verifikasi dari database untuk alasan keamanan.
6. Sistem mengembalikan respons sukses jika verifikasi berhasil.

#### **Keamanan dalam Kode**
- **Kode Verifikasi**: Hanya dicocokkan di sisi server untuk mencegah manipulasi data dari klien.
- **Penghapusan Kode Verifikasi**: Setelah pengguna berhasil diverifikasi, kode dihapus dari database untuk mencegah penyalahgunaan.
- **Status Kode HTTP**: Menggunakan kode HTTP yang sesuai (`401` untuk kesalahan autentikasi dan `500` untuk kesalahan server).

#### **Contoh Skenario Penggunaan**
1. Pengguna melakukan registrasi dan menerima email berisi kode verifikasi.
2. Pengguna memasukkan email dan kode verifikasi di aplikasi.
3. Aplikasi memanggil endpoint yang menjalankan fungsi ini untuk memverifikasi akun.

---

Berikut adalah dokumentasi untuk endpoint yang menggunakan fungsi `verifyUser`:

---

#### **Endpoint: Verifikasi Akun Pengguna**

##### **Deskripsi**
Endpoint ini digunakan untuk memverifikasi akun pengguna yang telah didaftarkan. Pengguna harus memasukkan email dan kode verifikasi yang diterima melalui email untuk menyelesaikan proses verifikasi.

---

##### **URL**
**`POST /api/auth/verify`**

---

##### **Header**
- **Content-Type**: `application/json`

---

##### **Body Parameters**
| Parameter         | Tipe Data | Wajib  | Deskripsi                                           |
|--------------------|-----------|--------|---------------------------------------------------|
| `email`           | String    | Ya     | Alamat email pengguna yang akan diverifikasi.      |
| `verificationCode`| String    | Ya     | Kode verifikasi yang dikirimkan ke email pengguna.|

---

##### **Proses di Backend**
1. **Penerimaan Data**: 
   - Backend menerima `email` dan `verificationCode` dari body request.
2. **Pencarian Data Pengguna**:
   - Sistem mencari pengguna di database berdasarkan email.
   - Jika pengguna tidak ditemukan, sistem mengembalikan respons bahwa pengguna tidak ada (`401 Unauthorized`).
3. **Validasi Kode Verifikasi**:
   - Sistem memeriksa apakah kode verifikasi yang diberikan cocok dengan yang tersimpan di database.
   - Jika tidak cocok, sistem mengembalikan pesan error bahwa kode tidak valid (`401 Unauthorized`).
4. **Pembaharuan Data**:
   - Jika kode cocok, sistem memperbarui kolom `is_verified` menjadi `true` dan menghapus `verification_code`.
   - Menandai bahwa akun pengguna telah berhasil diverifikasi.
5. **Pengembalian Respons**:
   - Sistem mengembalikan pesan sukses jika verifikasi berhasil.

---

##### **Respon**
##### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "User verified successfully"
}
```

##### **Respon Gagal**
1. **Pengguna Tidak Ditemukan**
   **Status Code**: `401 Unauthorized`  
   **Body**:
   ```json
   {
     "error": "User not found"
   }
   ```

2. **Kode Verifikasi Tidak Valid**
   **Status Code**: `401 Unauthorized`  
   **Body**:
   ```json
   {
     "error": "Invalid verification code"
   }
   ```

3. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "error": "Internal Server Error"
   }
   ```

---

##### **Catatan**
- Endpoint ini harus diakses setelah pengguna menerima email verifikasi.
- Jika verifikasi gagal, pengguna harus memeriksa kembali kode verifikasi atau meminta pengiriman ulang kode verifikasi melalui sistem.

---

Berikut adalah gabungan penjelasan kode dan dokumentasi endpoint untuk fungsi `loginUser`:

---

### **Fungsi: `loginUser`**

#### **Deskripsi**
Fungsi `loginUser` digunakan untuk melakukan autentikasi pengguna. Dengan memasukkan email dan password yang valid, pengguna akan mendapatkan token **JWT** (JSON Web Token) untuk mengakses endpoint lain yang membutuhkan autentikasi.

---

#### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**
1. **Penerimaan Data dari Request Body**
   ```javascript
   const { email, password } = req.body;
   ```
   - Fungsi menerima dua parameter dari request body:
     - `email`: Alamat email pengguna yang ingin login.
     - `password`: Kata sandi pengguna.

2. **Validasi Input**
   ```javascript
   if (!email || !password) {
       return res.status(400).json({ error: 'Email and password are required.' });
   }
   ```
   - Jika salah satu dari `email` atau `password` kosong, fungsi mengembalikan respons dengan status `400 Bad Request` dan pesan error bahwa data wajib dimasukkan.

3. **Query untuk Mencari Pengguna Berdasarkan Email**
   ```javascript
   const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
   ```
   - Sistem mencari pengguna di database berdasarkan email.
   - Hasil query berupa array, dan data pengguna berada di indeks pertama (`user[0]`).

4. **Validasi Keberadaan Pengguna**
   ```javascript
   if (user.length === 0) {
       return res.status(404).json({ error: 'User not found.' });
   }
   ```
   - Jika pengguna tidak ditemukan di database, fungsi mengembalikan respons dengan status `404 Not Found` dan pesan error bahwa pengguna tidak ditemukan.

5. **Validasi Status Verifikasi Akun**
   ```javascript
   if (!userData.is_verified) {
       return res.status(401).json({ error: 'Your account is not verified. Please verify your email.' });
   }
   ```
   - Jika akun belum diverifikasi (`is_verified` bernilai `false`), fungsi mengembalikan respons dengan status `401 Unauthorized` dan meminta pengguna untuk memverifikasi akun mereka.

6. **Validasi Kata Sandi**
   ```javascript
   const isPasswordValid = await bcrypt.compare(password, userData.password);
   if (!isPasswordValid) {
       return res.status(401).json({ error: 'Invalid email or password.' });
   }
   ```
   - Kata sandi yang diberikan pengguna diperiksa menggunakan fungsi `bcrypt.compare` untuk mencocokkan dengan kata sandi yang sudah di-hash di database.
   - Jika tidak cocok, fungsi mengembalikan respons dengan status `401 Unauthorized` dan pesan error bahwa email atau password salah.

7. **Pembuatan Token JWT**
   ```javascript
   const token = jwt.sign(
       { userId: userData.id, role: userData.role },
       process.env.JWT_SECRET,
       { expiresIn: '2h' }
   );
   ```
   - Jika email dan password valid, sistem membuat token JWT menggunakan library `jsonwebtoken`.
   - Payload token berisi:
     - `userId`: ID pengguna.
     - `role`: Peran pengguna (misalnya admin atau pengguna biasa).
   - Token diatur agar berlaku selama 2 jam (`expiresIn: '2h'`).

8. **Pengembalian Respons Sukses**
   ```javascript
   res.json({
       message: 'Login successful.',
       token,
   });
   ```
   - Jika semua validasi berhasil, fungsi mengembalikan respons sukses dengan token yang dihasilkan.

9. **Error Handling**
   ```javascript
   } catch (error) {
       console.error('Error logging in user:', error);
       res.status(500).json({ error: 'Internal Server Error.' });
   }
   ```
   - Jika terjadi kesalahan dalam proses, error ditangkap di blok `catch` dan sistem mengembalikan respons dengan status `500 Internal Server Error`.

---

#### **Endpoint: Login Pengguna**

##### **URL**
**`POST /api/auth/login`**

---

##### **Header**
- **Content-Type**: `application/json`

---

##### **Body Parameters**
| Parameter   | Tipe Data | Wajib | Deskripsi                                           |
|-------------|-----------|-------|---------------------------------------------------|
| `email`     | String    | Ya    | Alamat email pengguna untuk autentikasi.           |
| `password`  | String    | Ya    | Kata sandi pengguna untuk autentikasi.             |

---

##### **Proses di Backend**
1. **Validasi Input**: 
   - Pastikan `email` dan `password` tidak kosong.
2. **Pencarian Data Pengguna**:
   - Sistem mencari data pengguna di database berdasarkan `email`.
   - Jika pengguna tidak ditemukan, sistem memberikan pesan error.
3. **Validasi Akun**:
   - Sistem memastikan bahwa akun telah diverifikasi sebelum login.
4. **Validasi Kata Sandi**:
   - Sistem memeriksa apakah kata sandi cocok dengan data di database.
5. **Pembuatan Token JWT**:
   - Jika validasi berhasil, sistem menghasilkan token JWT untuk akses autentikasi.
6. **Pengembalian Respons**:
   - Sistem memberikan token JWT jika login berhasil.

---

##### **Respon**
###### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "Login successful.",
  "token": "JWT_TOKEN"
}
```

###### **Respon Gagal**
1. **Email atau Password Kosong**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "error": "Email and password are required."
   }
   ```

2. **Pengguna Tidak Ditemukan**
   **Status Code**: `404 Not Found`  
   **Body**:
   ```json
   {
     "error": "User not found."
   }
   ```

3. **Akun Belum Diverifikasi**
   **Status Code**: `401 Unauthorized`  
   **Body**:
   ```json
   {
     "error": "Your account is not verified. Please verify your email."
   }
   ```

4. **Password Tidak Valid**
   **Status Code**: `401 Unauthorized`  
   **Body**:
   ```json
   {
     "error": "Invalid email or password."
   }
   ```

5. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "error": "Internal Server Error."
   }
   ```

---

###### **Catatan**
- Pastikan variabel lingkungan `JWT_SECRET` telah diatur dengan nilai yang aman untuk menghasilkan token JWT.
- Endpoint ini digunakan sebelum mengakses endpoint lain yang memerlukan autentikasi.

---

Berikut adalah gabungan penjelasan kode dan dokumentasi endpoint untuk fungsi `resetPassword`:

---

### **Fungsi: `resetPassword`**

#### **Deskripsi**
Fungsi `resetPassword` memungkinkan pengguna untuk mengatur ulang kata sandi mereka menggunakan token reset yang valid. Jika proses berhasil, kata sandi baru akan disimpan di database, dan token reset akan dihapus.

---

#### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Penerimaan Data dari Request Body**
   ```javascript
   const { email, newPassword, confirmPassword, resetToken } = req.body;
   ```
   - Data yang diterima:
     - `email`: Email pengguna.
     - `newPassword`: Kata sandi baru yang ingin diatur.
     - `confirmPassword`: Konfirmasi kata sandi baru.
     - `resetToken`: Token reset yang telah dikirimkan sebelumnya melalui email.

2. **Validasi Input**
   ```javascript
   if (!email || !newPassword || !confirmPassword || !resetToken) {
       return res.status(400).json({ error: 'Email, new password, confirm password, and reset token are required.' });
   }
   ```
   - Fungsi memeriksa apakah semua data wajib telah dikirimkan.
   - Jika ada data yang hilang, fungsi mengembalikan status `400 Bad Request`.

3. **Validasi Kesesuaian Kata Sandi Baru**
   ```javascript
   if (newPassword !== confirmPassword) {
       return res.status(400).json({ error: 'New password and confirm password do not match.' });
   }
   ```
   - Fungsi memverifikasi apakah `newPassword` dan `confirmPassword` sama.
   - Jika tidak cocok, fungsi mengembalikan respons error dengan status `400`.

4. **Pencarian Pengguna di Database**
   ```javascript
   const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
   ```
   - Fungsi mencari pengguna di database berdasarkan email yang diberikan.

5. **Validasi Keberadaan Pengguna**
   ```javascript
   if (user.length === 0) {
       return res.status(404).json({ error: 'User not found.' });
   }
   ```
   - Jika pengguna tidak ditemukan, fungsi mengembalikan status `404 Not Found`.

6. **Validasi Token Reset**
   ```javascript
   if (!userData.reset_token || userData.reset_token !== resetToken) {
       return res.status(400).json({ error: 'Invalid reset token.' });
   }
   ```
   - Fungsi memeriksa apakah token reset valid dan cocok dengan token yang ada di database.
   - Jika token tidak valid atau tidak ada, fungsi mengembalikan status `400`.

7. **Hashing Kata Sandi Baru**
   ```javascript
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   ```
   - Kata sandi baru di-hash menggunakan `bcrypt` dengan level hashing 10.

8. **Pembaruan Database**
   ```javascript
   await db.query(
       'UPDATE users SET password = ?, reset_token = NULL WHERE id = ?',
       [hashedPassword, userData.id]
   );
   ```
   - Kata sandi baru disimpan di database.
   - Token reset dihapus dengan mengatur kolom `reset_token` menjadi `NULL`.

9. **Pengembalian Respons Sukses**
   ```javascript
   res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
   ```
   - Jika semua langkah berhasil, fungsi mengembalikan respons sukses.

10. **Error Handling**
   ```javascript
   } catch (err) {
       console.error('Error resetting password:', err);
       res.status(500).json({ error: 'Internal Server Error.' });
   }
   ```
   - Jika terjadi kesalahan selama proses, fungsi menangkap error dan mengembalikan status `500 Internal Server Error`.

---

#### **Endpoint: Reset Password**

##### **URL**
**`POST /api/auth/reset-password`**

---

##### **Header**
- **Content-Type**: `application/json`

---

##### **Body Parameters**
| Parameter        | Tipe Data | Wajib | Deskripsi                                                           |
|------------------|-----------|-------|---------------------------------------------------------------------|
| `email`          | String    | Ya    | Email pengguna yang ingin mengatur ulang kata sandinya.              |
| `newPassword`    | String    | Ya    | Kata sandi baru yang ingin digunakan.                               |
| `confirmPassword`| String    | Ya    | Konfirmasi kata sandi baru (harus sama dengan `newPassword`).       |
| `resetToken`     | String    | Ya    | Token reset yang diterima pengguna melalui email.                   |

---

##### **Proses di Backend**
1. **Validasi Input**:
   - Memastikan semua data wajib (`email`, `newPassword`, `confirmPassword`, `resetToken`) telah disediakan.
   - Memastikan kata sandi baru dan konfirmasinya cocok.
2. **Pencarian Data Pengguna**:
   - Sistem mencari pengguna di database berdasarkan email.
   - Jika pengguna tidak ditemukan, fungsi mengembalikan error.
3. **Validasi Token Reset**:
   - Sistem memeriksa token reset yang diberikan dengan yang ada di database.
4. **Hashing Kata Sandi**:
   - Kata sandi baru di-hash sebelum disimpan.
5. **Pembaruan Database**:
   - Kata sandi baru disimpan, dan token reset dihapus.
6. **Pengembalian Respons**:
   - Sistem memberikan pesan sukses jika semua langkah berhasil.

---

##### **Respon**
###### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "Password reset successfully. You can now log in with your new password."
}
```

###### **Respon Gagal**
1. **Data Tidak Lengkap**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "error": "Email, new password, confirm password, and reset token are required."
   }
   ```

2. **Kata Sandi Tidak Cocok**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "error": "New password and confirm password do not match."
   }
   ```

3. **Pengguna Tidak Ditemukan**
   **Status Code**: `404 Not Found`  
   **Body**:
   ```json
   {
     "error": "User not found."
   }
   ```

4. **Token Reset Tidak Valid**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "error": "Invalid reset token."
   }
   ```

5. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "error": "Internal Server Error."
   }
   ```

---

###### **Catatan**
- Endpoint ini memerlukan token reset yang valid untuk memastikan keamanan.
- Proses hashing kata sandi menggunakan `bcrypt` memastikan bahwa data sensitif tidak disimpan dalam bentuk teks biasa.

---

Berikut adalah dokumentasi gabungan penjelasan kode dan endpoint untuk fungsi `requestResetPassword`:

---

### **Fungsi: `requestResetPassword`**

#### **Deskripsi**
Fungsi `requestResetPassword` digunakan untuk mengirim permintaan pengaturan ulang kata sandi. Jika email pengguna valid dan terverifikasi, sistem akan menghasilkan token reset dan mengirimkannya melalui email untuk memulai proses reset kata sandi.

---

#### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Penerimaan Data dari Request Body**
   ```javascript
   const { email } = req.body;
   ```
   - Data yang diterima:
     - `email`: Email pengguna yang meminta reset kata sandi.

2. **Validasi Input**
   ```javascript
   if (!email) {
       return res.status(400).json({ error: 'Email is required.' });
   }
   ```
   - Fungsi memeriksa apakah email telah disediakan.
   - Jika tidak, sistem mengembalikan status `400 Bad Request`.

3. **Pencarian Pengguna di Database**
   ```javascript
   const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
   ```
   - Sistem mencari pengguna berdasarkan email di database.

4. **Validasi Keberadaan Pengguna**
   ```javascript
   if (user.length === 0) {
       return res.status(404).json({ error: 'User not found.' });
   }
   ```
   - Jika pengguna tidak ditemukan, sistem mengembalikan status `404 Not Found`.

5. **Validasi Verifikasi Akun**
   ```javascript
   if (!userData.is_verified) {
       return res.status(401).json({ error: 'Your account is not verified. Please verify your email.' });
   }
   ```
   - Jika akun pengguna belum diverifikasi, sistem mengembalikan status `401 Unauthorized`.

6. **Pembuatan Token Reset**
   ```javascript
   const resetToken = generateResetToken();
   ```
   - Sistem menghasilkan token reset menggunakan fungsi `generateResetToken`.

7. **Pembaruan Database**
   ```javascript
   await db.query(
       'UPDATE users SET reset_token = ? WHERE id = ?',
       [resetToken, userData.id]
   );
   ```
   - Token reset disimpan di database untuk pengguna terkait.

8. **Pengiriman Email**
   ```javascript
   await sendResetPasswordEmail(email, resetToken);
   ```
   - Sistem mengirim email kepada pengguna yang berisi instruksi untuk mereset kata sandi, termasuk token reset.

9. **Pengembalian Respons Sukses**
   ```javascript
   res.json({ message: 'Password reset request sent. Please check your email.' });
   ```
   - Jika semua langkah berhasil, fungsi mengembalikan respons sukses.

10. **Error Handling**
   ```javascript
   } catch (err) {
       console.error('Error requesting password reset:', err);
       res.status(500).json({ error: 'Internal Server Error.' });
   }
   ```
   - Jika terjadi kesalahan selama proses, fungsi menangkap error dan mengembalikan status `500 Internal Server Error`.

---

#### **Endpoint: Request Reset Password**

#### **URL**
**`POST /api/auth/request-reset-password`**

---

#### **Header**
- **Content-Type**: `application/json`

---

#### **Body Parameters**
| Parameter | Tipe Data | Wajib | Deskripsi                 |
|-----------|-----------|-------|---------------------------|
| `email`   | String    | Ya    | Email pengguna yang terdaftar. |

---

#### **Proses di Backend**
1. **Validasi Input**:
   - Memastikan email telah disediakan oleh pengguna.
2. **Pencarian Data Pengguna**:
   - Sistem memeriksa apakah email yang diberikan terdaftar di database.
3. **Validasi Verifikasi Akun**:
   - Memastikan akun pengguna telah diverifikasi sebelum mengirim token reset.
4. **Pembuatan Token Reset**:
   - Token reset dihasilkan untuk digunakan dalam proses reset kata sandi.
5. **Pembaruan Database**:
   - Token reset disimpan ke dalam database untuk pengguna terkait.
6. **Pengiriman Email**:
   - Email dengan token reset dikirim ke pengguna.
7. **Pengembalian Respons**:
   - Jika semua langkah berhasil, sistem mengembalikan pesan sukses.

---

#### **Respon**
##### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "Password reset request sent. Please check your email."
}
```

##### **Respon Gagal**
1. **Email Tidak Disediakan**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "error": "Email is required."
   }
   ```

2. **Pengguna Tidak Ditemukan**
   **Status Code**: `404 Not Found`  
   **Body**:
   ```json
   {
     "error": "User not found."
   }
   ```

3. **Akun Belum Diverifikasi**
   **Status Code**: `401 Unauthorized`  
   **Body**:
   ```json
   {
     "error": "Your account is not verified. Please verify your email."
   }
   ```

4. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "error": "Internal Server Error."
   }
   ```

---

##### **Catatan**
- Endpoint ini hanya menghasilkan token reset jika email pengguna terdaftar dan telah diverifikasi.
- Proses pengiriman token reset dilakukan melalui email untuk menjaga keamanan.

---