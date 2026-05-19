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