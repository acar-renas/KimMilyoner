# Kim Milyoner Olmak İster? - Bilgi Yarışması Oyunu

## Proje Özeti
Bu proje, klasik "Kim Milyoner Olmak İster?" yarışmasının mekaniklerine sahip bir mobil uygulamadır. Veri yönetimi hocanın sunduğu gereksinimler doğrultusunda sunucu tabanlı olarak (NestJS & PostgreSQL) sağlanacaktır.

## Kullanılan Teknolojiler

**Mobil Ön Yüz (Frontend):**
* **Geliştirme Ortamı:** Visual Studio Code & Android Studio (Emülatör)
* **Framework:** React Native ile Expo (TypeScript)
* **API İletişimi:** Axios / Fetch API

**Arka Yüz (Backend) ve Veri Tabanı:**
* **Sunucu:** NestJS (TypeScript tabanlı Node.js framework)
* **Veri Tabanı:** PostgreSQL
* **Konteyner Yönetimi:** Docker Desktop (Veri tabanını izole ortamda çalıştırmak için)
* **ORM:** TypeORM

## Veri Tabanı Mimarisi (Taslak - TypeORM)
Sunucu üzerinden şu Entity'ler oluşturulacaktır:

1. **`Question` Entity (Sorular Tablosu):**
   * `@PrimaryGeneratedColumn()` id: number
   * `@Column()` questionText: string
   * `@Column()` optionA: string, vb.
   * `@Column()` correctAnswer: string
   * `@Column({ type: 'int' })` difficultyLevel: number

2. **`Score` Entity (Skorlar Tablosu):**
   * `@PrimaryGeneratedColumn()` id: number
   * `@Column()` playerName: string
   * `@Column({ type: 'int' })` prizeWon: number
   * `@CreateDateColumn()` playedAt: Date
