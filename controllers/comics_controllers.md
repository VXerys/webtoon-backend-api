
### **Fungsi: `createComic`**

#### **Deskripsi**
Fungsi `createComic` digunakan untuk membuat komik baru. Data komik yang dibuat akan disimpan dalam tabel `comics` di database, termasuk informasi seperti judul, genre, deskripsi, ID pembuat, URL gambar sampul, dan status komik.

---

### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Penerimaan Data dari Request Body**
   ```javascript
   const { title, genre, description, creator_id, cover_image_url, status } = req.body;
   ```
   - Data yang diterima:
     - `title`: Judul komik (wajib).
     - `genre`: Genre komik (opsional).
     - `description`: Deskripsi komik (opsional).
     - `creator_id`: ID pengguna yang membuat komik (wajib).
     - `cover_image_url`: URL gambar sampul komik (opsional).
     - `status`: Status komik, misalnya "ongoing" atau "completed" (opsional, default adalah "ongoing").

2. **Validasi Input**
   ```javascript
   if (!title || !creator_id) {
       return res.status(400).json({ message: 'Title and creator_id are required' });
   }
   ```
   - Fungsi memeriksa apakah `title` dan `creator_id` telah disediakan.
   - Jika tidak, sistem mengembalikan status `400 Bad Request`.

3. **Query SQL untuk Menyimpan Data**
   ```javascript
   const query = `
       INSERT INTO comics (title, genre, description, creator_id, cover_image_url, status)
       VALUES (?, ?, ?, ?, ?, ?);
   `;
   const values = [title, genre, description, creator_id, cover_image_url, status || 'ongoing'];
   ```
   - Sistem membuat query SQL untuk menyimpan data komik ke tabel `comics`.
   - Nilai `status` akan diatur ke "ongoing" secara default jika tidak disediakan.

4. **Eksekusi Query**
   ```javascript
   await db.query(query, values);
   ```
   - Sistem menjalankan query SQL dengan nilai-nilai yang diberikan.

5. **Pengembalian Respons Sukses**
   ```javascript
   res.status(201).json({ message: 'Comic created successfully' });
   ```
   - Jika data berhasil disimpan, sistem mengembalikan status `201 Created` dengan pesan sukses.

6. **Error Handling**
   ```javascript
   } catch (error) {
       console.error('Error creating comic:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
   ```
   - Jika terjadi kesalahan selama proses, error akan ditangkap dan sistem mengembalikan status `500 Internal Server Error`.

---

### **Endpoint: Create Comic**

#### **URL**
**`POST /api/comics`**

---

#### **Header**
- **Content-Type**: `application/json`

---

#### **Body Parameters**
| Parameter          | Tipe Data | Wajib | Deskripsi                                          |
|--------------------|-----------|-------|--------------------------------------------------|
| `title`           | String    | Ya    | Judul komik.                                     |
| `genre`           | String    | Tidak | Genre komik (opsional).                          |
| `description`     | String    | Tidak | Deskripsi singkat komik (opsional).              |
| `creator_id`      | Integer   | Ya    | ID pembuat komik (terhubung ke tabel `users`).    |
| `cover_image_url` | String    | Tidak | URL gambar sampul komik (opsional).              |
| `status`          | String    | Tidak | Status komik, seperti "ongoing" atau "completed". |

---

#### **Proses di Backend**
1. **Validasi Input**:
   - Memastikan bahwa `title` dan `creator_id` telah disediakan.
2. **Pembuatan Query SQL**:
   - Menyiapkan query untuk menyimpan data ke tabel `comics`.
3. **Eksekusi Query**:
   - Sistem menjalankan query untuk menyimpan data ke database.
4. **Pengembalian Respons**:
   - Jika proses berhasil, sistem mengembalikan status `201 Created` beserta pesan sukses.
5. **Error Handling**:
   - Jika terjadi kesalahan, sistem menangkap error dan mengembalikan status `500 Internal Server Error`.

---

#### **Respon**
##### **Respon Sukses**
**Status Code**: `201 Created`  
**Body**:
```json
{
  "message": "Comic created successfully"
}
```

##### **Respon Gagal**
1. **Input Tidak Lengkap**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "message": "Title and creator_id are required"
   }
   ```

2. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "message": "Internal server error"
   }
   ```

---

#### **Catatan**
- Endpoint ini memerlukan validasi tambahan jika genre, deskripsi, atau URL gambar sampul memiliki format atau panjang tertentu.
- Sistem dapat menambahkan middleware otentikasi untuk memastikan hanya pengguna tertentu yang dapat membuat komik.

---

### **Fungsi: `getAllComics`**

#### **Deskripsi**
Fungsi `getAllComics` digunakan untuk mengambil semua data komik yang tersedia di tabel `comics` pada database. Data ini kemudian dikirimkan kembali sebagai respons dalam format JSON.

---

### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Eksekusi Query untuk Mengambil Data**
   ```javascript
   const [comics] = await db.query('SELECT * FROM comics');
   ```
   - Query SQL `SELECT * FROM comics` digunakan untuk mengambil semua baris data dari tabel `comics`.
   - Hasil query disimpan dalam variabel `comics`.

2. **Pengembalian Data dalam Format JSON**
   ```javascript
   res.status(200).json(comics);
   ```
   - Jika query berhasil, data yang diambil dari database dikembalikan dengan status `200 OK` dan disertai body berupa array JSON berisi data komik.

3. **Penanganan Error**
   ```javascript
   } catch (error) {
       console.error('Error retrieving data from database:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
   ```
   - Jika terjadi kesalahan selama proses pengambilan data, error ditangkap, dan sistem mengembalikan status `500 Internal Server Error` dengan pesan error yang sesuai.

---

### **Endpoint: Get All Comics**

#### **URL**
**`GET /api/comics`**

---

#### **Header**
Tidak memerlukan header khusus.

---

#### **Query Parameters**
Tidak ada parameter query yang diperlukan untuk endpoint ini.

---

#### **Proses di Backend**
1. **Eksekusi Query SQL**:
   - Sistem menjalankan query untuk mengambil semua data dari tabel `comics`.
2. **Pengembalian Respons**:
   - Data hasil query dikembalikan dalam format JSON.
3. **Penanganan Error**:
   - Jika terjadi kesalahan, sistem menangkap error dan mengembalikan status `500 Internal Server Error`.

---

#### **Respon**
##### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
[
  {
    "id": 1,
    "title": "Comic Title 1",
    "genre": "Fantasy",
    "description": "A great fantasy story.",
    "creator_id": 10,
    "cover_image_url": "http://example.com/cover1.jpg",
    "status": "ongoing"
  },
  {
    "id": 2,
    "title": "Comic Title 2",
    "genre": "Action",
    "description": "An action-packed adventure.",
    "creator_id": 11,
    "cover_image_url": "http://example.com/cover2.jpg",
    "status": "completed"
  }
]
```

##### **Respon Gagal**
1. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "message": "Internal server error"
   }
   ```

---

#### **Catatan**
- Endpoint ini mengembalikan semua data dari tabel `comics` tanpa filter atau batasan. Jika dataset besar, pertimbangkan untuk menambahkan **pagination** atau **filter** berdasarkan kebutuhan.
- Middleware otentikasi dapat ditambahkan untuk memastikan bahwa hanya pengguna yang memiliki hak akses yang dapat mengambil data ini.

---

### **Fungsi: `editComic`**

#### **Deskripsi**
Fungsi `editComic` digunakan untuk mengedit data komik yang sudah ada di tabel `comics` pada database berdasarkan `id` komik. Data yang diubah diperoleh dari body permintaan, dan jika berhasil, sistem akan memberikan respons sukses.

---

### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Pengambilan Parameter dan Body Request**
   ```javascript
   const { id } = req.params;
   const { title, genre, description, creator_id, cover_image_url, status } = req.body;
   ```
   - Parameter `id` diambil dari URL endpoint.
   - Data komik yang akan diubah diambil dari `req.body`.

2. **Validasi Input**
   ```javascript
   if (!title || !creator_id) {
       return res.status(400).json({ message: 'Title and creator_id are required' });
   }
   ```
   - Memastikan bahwa `title` dan `creator_id` wajib disertakan dalam body request.
   - Jika salah satu tidak ada, fungsi akan mengembalikan status `400 Bad Request` dengan pesan error.

3. **Eksekusi Query untuk Memperbarui Data**
   ```javascript
   await db.query(
       'UPDATE comics SET title = ?, genre = ?, description = ?, creator_id = ?, cover_image_url = ?, status = ? WHERE id = ?',
       [title, genre, description, creator_id, cover_image_url, status, id]
   );
   ```
   - Query SQL `UPDATE` digunakan untuk memperbarui data komik berdasarkan `id`.
   - Nilai-nilai baru untuk kolom yang ingin diubah diambil dari `req.body`.

4. **Pengembalian Respons Sukses**
   ```javascript
   res.status(200).json({ message: 'Comic updated successfully' });
   ```
   - Jika query berhasil, fungsi akan mengembalikan status `200 OK` dengan pesan sukses.

5. **Penanganan Error**
   ```javascript
   } catch (error) {
       console.error('Error updating comic:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
   ```
   - Jika terjadi kesalahan selama proses pembaruan, error akan ditangkap dan sistem mengembalikan status `500 Internal Server Error` dengan pesan error.

---

### **Endpoint: Edit Comic**

#### **URL**
**`PUT /api/comics/:id`**

---

#### **Header**
Content-Type: `application/json`

---

#### **Path Parameters**
- **`id`** *(required)*: ID komik yang ingin diperbarui.

---

#### **Body Request**
Body request harus dalam format JSON dengan struktur berikut:
```json
{
  "title": "string",
  "genre": "string",
  "description": "string",
  "creator_id": "integer",
  "cover_image_url": "string",
  "status": "string"
}
```

---

#### **Proses di Backend**
1. **Validasi Input**:
   - Memastikan bahwa `title` dan `creator_id` ada dalam body request.
2. **Eksekusi Query SQL**:
   - Sistem memperbarui data komik berdasarkan `id`.
3. **Pengembalian Respons**:
   - Memberikan respons sukses jika pembaruan berhasil.
4. **Penanganan Error**:
   - Menangkap kesalahan selama proses pembaruan dan memberikan respons error.

---

#### **Respon**
##### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "Comic updated successfully"
}
```

##### **Respon Gagal**
1. **Input Tidak Valid**
   **Status Code**: `400 Bad Request`  
   **Body**:
   ```json
   {
     "message": "Title and creator_id are required"
   }
   ```

2. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "message": "Internal server error"
   }
   ```

---

#### **Catatan**
- Endpoint ini hanya memperbarui data berdasarkan ID yang diberikan. Jika ID tidak ditemukan, sistem tetap akan mengembalikan respons sukses tetapi tidak ada data yang diperbarui.
- Middleware otentikasi dapat ditambahkan untuk membatasi akses hanya kepada pengguna yang berwenang.

---

### **Fungsi: `deleteComic`**

#### **Deskripsi**
Fungsi `deleteComic` digunakan untuk menghapus data komik dari tabel `comics` pada database berdasarkan `id` yang diberikan dalam parameter URL. Jika berhasil, sistem akan mengembalikan pesan sukses.

---

### **Penjelasan Kode**

#### **Langkah-Langkah dalam Fungsi**

1. **Pengambilan Parameter Request**
   ```javascript
   const { id } = req.params;
   ```
   - Parameter `id` diambil dari URL endpoint, yang mewakili ID komik yang akan dihapus.

2. **Eksekusi Query untuk Menghapus Data**
   ```javascript
   db.query('DELETE FROM comics WHERE id = ?', [id]);
   ```
   - Query SQL `DELETE` digunakan untuk menghapus data dari tabel `comics` berdasarkan `id`.
   - ID komik yang diberikan disisipkan sebagai parameter query untuk mencegah SQL Injection.

3. **Pengembalian Respons Sukses**
   ```javascript
   res.status(200).json({ message: 'Comic deleted successfully' });
   ```
   - Jika query berhasil, fungsi akan mengembalikan status `200 OK` dengan pesan sukses.

4. **Penanganan Error**
   ```javascript
   } catch (error) {
       console.error('Error deleting comic:', error);
       res.status(500).json({ message: 'Internal server error' });
   }
   ```
   - Jika terjadi kesalahan selama proses penghapusan, error akan ditangkap, dan sistem mengembalikan status `500 Internal Server Error` dengan pesan error.

---

### **Endpoint: Delete Comic**

#### **URL**
**`DELETE /api/comics/:id`**

---

#### **Header**
Tidak memerlukan header khusus.

---

#### **Path Parameters**
- **`id`** *(required)*: ID komik yang ingin dihapus.

---

#### **Proses di Backend**
1. **Pengambilan ID Komik**:
   - Sistem membaca `id` dari parameter URL.
2. **Eksekusi Query SQL**:
   - Sistem menghapus data komik dari tabel `comics` berdasarkan `id`.
3. **Pengembalian Respons**:
   - Memberikan respons sukses jika data berhasil dihapus.
4. **Penanganan Error**:
   - Menangkap kesalahan selama proses penghapusan dan memberikan respons error.

---

#### **Respon**
##### **Respon Sukses**
**Status Code**: `200 OK`  
**Body**:
```json
{
  "message": "Comic deleted successfully"
}
```

##### **Respon Gagal**
1. **Kesalahan Server**
   **Status Code**: `500 Internal Server Error`  
   **Body**:
   ```json
   {
     "message": "Internal server error"
   }
   ```

---

#### **Catatan**
- Pastikan bahwa ID yang diberikan adalah valid dan ada di database. Jika ID tidak ditemukan, sistem tetap akan memberikan respons sukses meskipun tidak ada data yang dihapus.
- Middleware otentikasi dan otorisasi dapat ditambahkan untuk memastikan hanya pengguna tertentu yang memiliki izin untuk menghapus data ini.