
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

