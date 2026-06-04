Kurulum:

1. Docker Desktop kurulu olmalıdır.
2. Proje GitHub üzerinden klonlanır.
3. Proje klasöründe terminal açılır.
4. Aşağıdaki komut çalıştırılır:

docker compose up --build

5. Docker Desktop üzerinden staj_frontend containerı altında görünen 3000:3000 bağlantısına tıklanır.

Uygulama açılacaktır.


## Docker Desktop Üzerinden Açma

Proje Docker ile ayağa kaldırıldıktan sonra Docker Desktop açılır.

Containers bölümünde `staj_frontend` containerı bulunur.

`staj_frontend` altında görünen `3000:3000` port bağlantısına tıklanır.

Uygulama otomatik olarak tarayıcıda açılır.

http://localhost:3000/dashboard burdanda sıtemıze gidebilirsiniz


Hocam bu proje NextJS fullstack mimarisiyle yapıldı. 
Frontend sayfaları ve backend API servisleri aynı container içinde çalışıyor.
Backend kodları src/app/api klasöründedir.



# Staj Yönetim Sistemi

Bu proje, öğrenci, okul ve işletme gruplarının yönetilebildiği; Supervisor tarafından yetki ataması yapılabilen fullstack admin panelidir.

## Kullanılan Teknolojiler

- NextJS 16
- React
- TailwindCSS
- PostgreSQL
- Prisma ORM
- Redis
- RabbitMQ
- Docker
- Docker Compose
- Mammoth Word to HTML Converter

## Proje Özellikleri

- Login ekranı
- Dashboard paneli
- Öğrenci CRUD işlemleri
- Okul CRUD işlemleri
- İşletme CRUD işlemleri
- Supervisor yetki paneli
- CRUD yetki mantığı
- Dosya yükleme sistemi
- Dosya türü kısıtlama
- TXT dosya analizi
- Word dosyasını HTML'e dönüştürme
- RabbitMQ event sistemi
- RabbitMQ consumer sistemi
- Log kayıt sistemi
- PostgreSQL JSONB veri yapısı

## Docker Servisleri

Proje aşağıdaki servisleri Docker ile çalıştırır:

- PostgreSQL
- Redis
- RabbitMQ

## Docker Çalıştırma

```bash
docker compose up -d