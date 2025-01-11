# Event Planning Application

## Amaç
Bu proje, kullanıcıların etkinlikler oluşturmasına, etkinliklere katılmasına ve etkinlikler hakkında yorum yapmasına olanak tanıyan bir Etkinlik Planlama Uygulaması geliştirmeyi amaçlamaktadır. Hedef, modern teknolojiler kullanılarak ölçeklenebilir ve sürdürülebilir bir sistem tasarlamak ve uygulamaktır.

## Kullanılan Teknolojiler
### Frontend
Bu projede **React**, **Vite**, ve **TypeScript** kullanılmıştır. Arayüz tasarımı için **Tailwind CSS** tercih edilmiştir. Durum yönetimi ve HTTP istekleri gibi işlemler için ise çeşitli kütüphaneler (örn. `axios`, `zustand`, `react-query`) kullanılmıştır.

### Özellikler

1. **Kullanıcı Dostu ve Responsive Tasarım**
   - Etkinliklerin listelenmesi
   - Yeni etkinlik oluşturma ve düzenleme formları
   - Etkinliklere katılma butonları
   - Yorum ekleme ve görüntüleme

2. **React Router**
   - Çok sayfalı yönlendirme: `/login`, `/events`, `/events/:id`, vb.

3. **State Yönetimi**
   - `zustand` ve `react-query` kombinasyonu ile basit ve hızlı durum yönetimi

4. **Form Yönetimi**
   - `formik` + `yup` kullanımı ile doğrulamalı formlar

5. **Bildirim Sistemi**
   - `react-hot-toast` ile kullanıcıya hatalar ve başarı mesajları gösterme

---


## Kurulum

### Gereksinimler

- Node.js (v16+ veya v18+) ve npm/yarn yüklü olmalı.

### Adımlar

1. **Proje Dizini**
   Frontend projesi, ana proje klasörünüzde `frontend` veya benzeri bir klasörde yer alıyor olabilir. İlgili dizine geçiş yapın:
   ```bash
   cd event-management-frontend
   ```
2. **Bağımlılıkların Yüklenmesi**
   ```bash
   npm install
   ```
   veya
   ```bash
   yarn
   ```
3. **Geliştirme Sunucusunu Başlatma**
   ```bash
   npm run dev
   ```
   Bu komut, lokal geliştirme sunucusunu (Vite) başlatır ve genellikle `http://localhost:5173` veya benzeri bir port üzerinden uygulamaya erişebilirsiniz.

4. **Üretim (Production) Derlemesi Oluşturma**
   ```bash
   npm run build
   ```
   Bu komut, optimize edilmiş ve dağıtıma hazır bir üretim paketi oluşturur. `dist` klasöründe derlenmiş dosyalar yer alır.

5. **Ön İzleme (Preview)**
   Üretim derlemesi sonrasında, uygulamayı yerel ortamda test etmek için:
   ```bash
   npm run preview
   ```
   Bu komut, `dist` klasöründeki dosyaları sunan bir sunucu başlatır.

---

## Önemli Paketler ve Kullanımları

- **`react` & `react-dom`**: Ana UI kütüphanesi ve DOM ile etkileşim.
- **`react-router-dom`**: Sayfalar arası gezinme ve yönlendirme (routing).
- **`zustand`**: Basit ve performanslı state yönetimi.
- **`@tanstack/react-query`**: Sunucudan veri çekme (fetch), önbellekleme ve senkronizasyon işlemleri.
- **`axios`**: HTTP isteklerini gerçekleştirme.
- **`formik` & `yup`**: Form yönetimi ve doğrulama.
- **`tailwindcss`**: Hızlı ve esnek bir CSS framework’ü.
- **`react-hot-toast`**: Kullanıcıya hatalar, uyarılar ve başarı mesajları göstermeye yarayan bildirim kütüphanesi.

---


## API Entegrasyonu

- **Auth Servisi (auth-service)**: `http://localhost:3001` (Docker veya manuel çalıştırma)
- **Event Servisi (event-service)**: `http://localhost:3002`

Geliştirme aşamasında, bu servisler için `BASE_URL` veya benzeri değişkenler `.env` dosyasında tanımlanabilir. Örnek `.env` içeriği:
```
VITE_AUTH_API_URL=http://localhost:3001
VITE_EVENT_API_URL=http://localhost:3002
```

---



### Backend
Backend iki servis olarak yapılandırılacaktır:
1. **User and Authentication Service**
   - **Teknoloji:** Node.js + Express
   - **Veritabanı:** PostgreSQL
   - **İşlev:** Kullanıcı kayıt, giriş, profil yönetimi, şifre değiştirme, kimlik doğrulama (JWT)
2. **Event and Comment Service**
   - **Teknoloji:** Node.js + Express
   - **Veritabanı:** MongoDB
   - **İşlev:** Etkinlik ve Yorum oluşturma, güncelleme, silme



## Özellikler

- **Kullanıcı Yönetimi**
  - Kullanıcı kayıt, giriş (JWT tabanlı kimlik doğrulama)
  - Kullanıcı profilini görüntüleme ve güncelleme
  - Şifre değiştirme

- **Etkinlik Yönetimi**
  - Yeni etkinlik oluşturma
  - Etkinlikleri listeleme, filtreleme (kategori, durum vb.)
  - Etkinlik detaylarını görüntüleme
  - Etkinlik güncelleme
  - Etkinliklere katılma

- **Yorum Yönetimi**
  - Etkinliklere yorum ekleme
  - Etkinlik yorumlarını listeleme
  - Yorum güncelleme ve silme (kullanıcı yetki kontrolü)

- **Microservis Mimarisi**
  - Ayrı servisler (auth-service, event-service) ve bağımsız veritabanları (PostgreSQL, MongoDB)

- **Docker Desteği**
  - Uygulama servislerini ve veritabanlarını Docker Compose ile hızlıca ayağa kaldırma

---



## Kurulum

### Gereksinimler

- [Docker](https://www.docker.com/) ve [Docker Compose](https://docs.docker.com/compose/) kurulu olmalı
- Geliştirme ortamında Node.js (isteğe bağlı, manuel çalıştırmak isterseniz)

### Docker Compose ile Kurulum

Proje dizininde (bu README dosyasının bulunduğu yerde) şu komutu çalıştırın:

```bash
docker compose up --build
```

Bu komut aşağıdaki işlemleri gerçekleştirir:

1. **auth-service** konteyner’ını başlatır (Node.js ve PostgreSQL bağlantısı).
2. **event-service** konteyner’ını başlatır (Node.js ve MongoDB bağlantısı).
3. **postgres** konteyner’ını başlatır (auth-service için veritabanı).
4. **mongodb** konteyner’ını başlatır (event-service için veritabanı).

İlk defa çalıştırdığınızda, bağımlı imajlar indirilecek ve servisler ayağa kalkacaktır. Kurulum tamamlandıktan sonra şu portlar üzerinden erişim sağlayabilirsiniz:

- **auth-service**: `http://localhost:3001`
- **event-service**: `http://localhost:3002`
- **PostgreSQL**: `localhost:5432`
- **MongoDB**: `localhost:27017`

### Manuel Kurulum (İsteğe Bağlı)

Docker kullanmak istemiyorsanız, servisleri manuel olarak şu adımlarla çalıştırabilirsiniz:

1. **PostgreSQL** ve **MongoDB**’yi lokalinizde veya bir bulut servisinde çalıştırın.
2. **auth-service** dizinine girip ortam değişkenlerinizi `.env` veya `environment` dosyasında tanımlayın. Sonra:
   ```bash
   cd auth-service
   npm install
   npm run dev
   ```
3. **event-service** dizinine girip aynı şekilde ortam değişkenlerini tanımlayın ve çalıştırın:
   ```bash
   cd event-service
   npm install
   npm run dev
   ```
4. Servisler varsayılan olarak kendi `PORT` değerleri üzerinden (3001 ve 3002) çalışacaktır.

---


## Uygulamayı Çalıştırma

Eğer **Docker Compose** kullandıysanız, tüm servisler çalışır durumda olacaktır. Durumu kontrol etmek için:

```bash
docker compose ps
```

Komutu ile servislerin ayağa kalktığından emin olabilirsiniz.
Uygulama loglarını görmek isterseniz:

```bash
docker compose logs -f auth-service
docker compose logs -f event-service
```

---

## Servislerin Detayları

### 1. auth-service (Node.js + PostgreSQL)

- **Port**: 3001
- **Ana Görevler**:
  - Kullanıcı kaydı (`POST /api/users/register`)
  - Kullanıcı girişi (`POST /api/users/login`)
  - Kullanıcı profilini görüntüleme, güncelleme (`GET/PUT /api/users/profile`)
  - Şifre değiştirme (`POST /api/users/change-password`)

#### Ortam Değişkenleri (env)

- `DB_HOST`: PostgreSQL sunucusunun host adı (Docker’da `postgres` kullanılır)
- `DB_PORT`: PostgreSQL portu (varsayılan 5432)
- `DB_NAME`: Veritabanı adı (örn: `auth_db`)
- `DB_USER`: Veritabanı kullanıcısı (örn: `postgres`)
- `DB_PASSWORD`: Veritabanı şifresi (örn: `postgres`)
- `JWT_SECRET`: JWT oluşturmak için kullanılan gizli anahtar
- `PORT`: Servisin çalışacağı port (örn: 3001)

### 2. event-service (Node.js + MongoDB)

- **Port**: 3002
- **Ana Görevler**:
  - Etkinlik oluşturma (`POST /api/events`)
  - Etkinlik listeleme ve filtreleme (`GET /api/events`)
  - Etkinlik detayları (`GET /api/events/:id`)
  - Etkinlik güncelleme (`PUT /api/events/:id`)
  - Etkinliğe katılma (`POST /api/events/:id/join`)
  - Yorum ekleme, düzenleme, silme (`POST/PUT/DELETE /api/events/:eventId/comments/...`)
- **Ortam Değişkenleri (env)**:
  - `MONGODB_URI`: MongoDB bağlantı URI (Docker’da `mongodb:27017/event_db`)
  - `PORT`: Servisin çalışacağı port (örn: 3002)

---

## Swagger API Dökümantasyonu

Her iki servis de kendi içinde Swagger kullanarak API dökümantasyonu sunar.
Aşağıdaki linklerden dökümanlara ulaşabilirsiniz:

- **auth-service**: `http://localhost:3001/api-docs`
- **event-service**: `http://localhost:3002/api-docs`

Bu sayede hangi endpoint’lerin mevcut olduğunu, parametrelerin neler olduğunu ve örnek istek/cevap formatlarını görebilirsiniz.

---