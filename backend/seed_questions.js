const http = require('http');

const questions = [
  // Difficulty 1
  {
    questionText: "Hangi renk bir ana renk değildir?",
    optionA: "Kırmızı", optionB: "Mavi", optionC: "Sarı", optionD: "Turuncu",
    correctAnswer: "D", difficultyLevel: 1
  },
  {
    questionText: "Haftanın ilk günü hangisidir?",
    optionA: "Pazar", optionB: "Pazartesi", optionC: "Salı", optionD: "Çarşamba",
    correctAnswer: "B", difficultyLevel: 1
  },
  {
    questionText: "Hangisi kış mevsiminin bir ayıdır?",
    optionA: "Haziran", optionB: "Eylül", optionC: "Ocak", optionD: "Nisan",
    correctAnswer: "C", difficultyLevel: 1
  },
  {
    questionText: "Türkiye'nin plaka kodu '01' olan ili neresidir?",
    optionA: "Ankara", optionB: "İstanbul", optionC: "Adana", optionD: "İzmir",
    correctAnswer: "C", difficultyLevel: 1
  },
  {
    questionText: "Bir gün kaç saattir?",
    optionA: "12", optionB: "24", optionC: "48", optionD: "60",
    correctAnswer: "B", difficultyLevel: 1
  },

  // Difficulty 2
  {
    questionText: "Hangi hayvan 'çöl gemisi' olarak bilinir?",
    optionA: "Aslan", optionB: "Kaplan", optionC: "Deve", optionD: "Fil",
    correctAnswer: "C", difficultyLevel: 2
  },
  {
    questionText: "Güneş sistemindeki en küçük gezegen hangisidir?",
    optionA: "Merkür", optionB: "Venüs", optionC: "Mars", optionD: "Plüton",
    correctAnswer: "A", difficultyLevel: 2
  },
  {
    questionText: "İstiklal Marşı'nın şairi kimdir?",
    optionA: "Namık Kemal", optionB: "Mehmet Akif Ersoy", optionC: "Yahya Kemal", optionD: "Necip Fazıl",
    correctAnswer: "B", difficultyLevel: 2
  },
  {
    questionText: "Hangi ay 28 veya 29 gün çeker?",
    optionA: "Ocak", optionB: "Şubat", optionC: "Mart", optionD: "Nisan",
    correctAnswer: "B", difficultyLevel: 2
  },
  {
    questionText: "Türkiye'nin en yüksek dağı hangisidir?",
    optionA: "Erciyes Dağı", optionB: "Ağrı Dağı", optionC: "Süphan Dağı", optionD: "Nemrut Dağı",
    correctAnswer: "B", difficultyLevel: 2
  },

  // Difficulty 3
  {
    questionText: "Fatih Sultan Mehmet İstanbul'u kaç yaşında fethetmiştir?",
    optionA: "19", optionB: "21", optionC: "23", optionD: "25",
    correctAnswer: "B", difficultyLevel: 3
  },
  {
    questionText: "Hangisi bir asal sayı değildir?",
    optionA: "2", optionB: "7", optionC: "9", optionD: "11",
    correctAnswer: "C", difficultyLevel: 3
  },
  {
    questionText: "Periyodik tabloda 'Fe' simgesi hangi elementi temsil eder?",
    optionA: "Flor", optionB: "Fosfor", optionC: "Kurşun", optionD: "Demir",
    correctAnswer: "D", difficultyLevel: 3
  },
  {
    questionText: "Hangi yazar 'Suç ve Ceza' adlı eseri kaleme almıştır?",
    optionA: "Lev Tolstoy", optionB: "Fyodor Dostoyevski", optionC: "Nikolay Gogol", optionD: "Aleksandr Puşkin",
    correctAnswer: "B", difficultyLevel: 3
  },
  {
    questionText: "Türk lirasının güncel simgesini kim tasarlamıştır?",
    optionA: "Tülay Lale", optionB: "Mimar Sinan", optionC: "Osman Hamdi Bey", optionD: "Barış Manço",
    correctAnswer: "A", difficultyLevel: 3
  },

  // Difficulty 4
  {
    questionText: "Nobel Ödülleri geleneksel olarak hangi ülkede/ülkelerde verilmektedir?",
    optionA: "Norveç ve İsveç", optionB: "İsviçre ve Fransa", optionC: "Almanya ve Danimarka", optionD: "ABD ve İngiltere",
    correctAnswer: "A", difficultyLevel: 4
  },
  {
    questionText: "Dünyanın en uzun nehri hangisidir?",
    optionA: "Amazon", optionB: "Nil", optionC: "Mississippi", optionD: "Yangtze",
    correctAnswer: "B", difficultyLevel: 4
  },
  {
    questionText: "Hangi gezegen kendi etrafında diğer gezegenlere göre ters yönde döner?",
    optionA: "Mars", optionB: "Jüpiter", optionC: "Venüs", optionD: "Satürn",
    correctAnswer: "C", difficultyLevel: 4
  },
  {
    questionText: "'Mona Lisa' tablosu günümüzde hangi müzede sergilenmektedir?",
    optionA: "British Museum", optionB: "Prado Müzesi", optionC: "Uffizi Galerisi", optionD: "Louvre Müzesi",
    correctAnswer: "D", difficultyLevel: 4
  },
  {
    questionText: "İstiklal Marşı ilk kez hangi anayasada yer almıştır?",
    optionA: "1921 Anayasası", optionB: "1924 Anayasası", optionC: "1961 Anayasası", optionD: "1982 Anayasası",
    correctAnswer: "D", difficultyLevel: 4
  },

  // Difficulty 5
  {
    questionText: "Aspirinin ham maddesi ağırlıklı olarak hangi ağacın kabuğundan elde edilir?",
    optionA: "Söğüt Ağacı", optionB: "Kavak Ağacı", optionC: "Meşe Ağacı", optionD: "Çam Ağacı",
    correctAnswer: "A", difficultyLevel: 5
  },
  {
    questionText: "'Guernica' adlı ünlü tablo hangi ressama aittir?",
    optionA: "Salvador Dali", optionB: "Pablo Picasso", optionC: "Vincent van Gogh", optionD: "Claude Monet",
    correctAnswer: "B", difficultyLevel: 5
  },
  {
    questionText: "İlk Nobel Kimya Ödülü'nü alan bilim insanı kimdir?",
    optionA: "Marie Curie", optionB: "Jacobus Henricus van 't Hoff", optionC: "Wilhelm Conrad Röntgen", optionD: "Albert Einstein",
    correctAnswer: "B", difficultyLevel: 5
  },
  {
    questionText: "Satrançta kullanılan 'Şah Mat' ifadesinin kökeni hangi dile dayanır?",
    optionA: "Arapça", optionB: "Farsça", optionC: "Latince", optionD: "İtalyanca",
    correctAnswer: "B", difficultyLevel: 5
  },
  {
    questionText: "Güneş Sistemi'nin ve Jüpiter'in en büyük uydusu hangisidir?",
    optionA: "Europa", optionB: "Io", optionC: "Callisto", optionD: "Ganymede",
    correctAnswer: "D", difficultyLevel: 5
  },

  // Difficulty 6
  {
    questionText: "Periyodik cetvelde Türkçede 'Z' harfi ile başlayan kaç element vardır?",
    optionA: "0", optionB: "1", optionC: "2", optionD: "3",
    correctAnswer: "C", difficultyLevel: 6 // Zirkonyum ve Zirkonyum mu? İngilizce Zinc (Çinko), Zirconium. Türkçe'de Zirkonyum (Zr) ve Zirkonyum mu var? Aslında Z harfiyle sadece Zirkonyum var. Ah wait, Xenon Türkçe Ksenon. Let's not use this question. I will modify the script below.
  },
  {
    questionText: "1969 yılında Apollo 11 göreviyle Ay'a ilk ayak basan astronotlardan Michael Collins yolculuk sırasında ne yapıyordu?",
    optionA: "Ay yüzeyinde yürüyordu", optionB: "Komuta modülünde yörüngede bekliyordu", optionC: "İniş modülünü kullanıyordu", optionD: "Dünya'dan telsizle destek veriyordu",
    correctAnswer: "B", difficultyLevel: 6
  },
  {
    questionText: "Osmanlı Devleti'nde İbrahim Müteferrika'nın kurduğu matbaada basılan ilk kitap hangisidir?",
    optionA: "Vankulu Lügatı", optionB: "Cihannüma", optionC: "Kitab-ı Bahriye", optionD: "Seyahatname",
    correctAnswer: "A", difficultyLevel: 6
  },
  {
    questionText: "Dünyanın en derin gölü olan Baykal Gölü hangi ülkededir?",
    optionA: "Kanada", optionB: "Rusya", optionC: "Çin", optionD: "ABD",
    correctAnswer: "B", difficultyLevel: 6
  },
  {
    questionText: "Hangi kıtada hiçbir doğal çöl bulunmaz?",
    optionA: "Avrupa", optionB: "Güney Amerika", optionC: "Avustralya", optionD: "Kuzey Amerika",
    correctAnswer: "A", difficultyLevel: 6
  },
  {
    questionText: "Antik Çağ'ın Yedi Harikası'ndan biri olan İskenderiye Feneri hangi doğal afet sonucu yıkılmıştır?",
    optionA: "Tsunami", optionB: "Deprem", optionC: "Yanardağ patlaması", optionD: "Kasırga",
    correctAnswer: "B", difficultyLevel: 6
  }
];

// Düzeltme
questions[25].questionText = "Birçok dilde 'Mona Lisa' olarak bilinen Da Vinci'nin tablosunun asıl adı/İtalyanca ismi nedir?";
questions[25].optionA = "La Gioconda";
questions[25].optionB = "La Donna";
questions[25].optionC = "La Prima";
questions[25].optionD = "La Vita";
questions[25].correctAnswer = "A";

const postQuestion = (q) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(q);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/questions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => resolve(responseData));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

(async () => {
  for (let q of questions) {
    try {
      await postQuestion(q);
      console.log('Eklendi:', q.questionText.substring(0, 30) + '...');
    } catch (e) {
      console.error('Hata:', e.message);
    }
  }
  console.log('Tüm sorular eklendi!');
})();
