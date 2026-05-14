$questions = @(
    @{ questionText = "Hangi gezegen Güneş Sistemi'nin en büyüğüdür?"; optionA = "Dünya"; optionB = "Mars"; optionC = "Jüpiter"; optionD = "Satürn"; correctAnswer = "C"; difficultyLevel = 1 },
    @{ questionText = "Türkiye'nin başkenti neresidir?"; optionA = "İstanbul"; optionB = "Ankara"; optionC = "İzmir"; optionD = "Bursa"; correctAnswer = "B"; difficultyLevel = 1 },
    @{ questionText = "İnsan vücudundaki en sert madde hangisidir?"; optionA = "Kemik"; optionB = "Tırnak"; optionC = "Diş minesi"; optionD = "Kıkırdak"; correctAnswer = "C"; difficultyLevel = 2 },
    @{ questionText = "Leonardo da Vinci'nin ünlü tablosunun adı nedir?"; optionA = "Yıldızlı Gece"; optionB = "Son Akşam Yemeği"; optionC = "Mona Lisa"; optionD = "Çığlık"; correctAnswer = "C"; difficultyLevel = 2 },
    @{ questionText = "Hangi elementin simgesi 'Au'dur?"; optionA = "Gümüş"; optionB = "Altın"; optionC = "Alüminyum"; optionD = "Bakır"; correctAnswer = "B"; difficultyLevel = 3 },
    @{ questionText = "İlk çağlarda yazıyı bulan uygarlık hangisidir?"; optionA = "Sümerler"; optionB = "Mısırlılar"; optionC = "Romalılar"; optionD = "Hititler"; correctAnswer = "A"; difficultyLevel = 3 },
    @{ questionText = "Modern bilgisayarın babası olarak kabul edilen kişi kimdir?"; optionA = "Bill Gates"; optionB = "Steve Jobs"; optionC = "Alan Turing"; optionD = "Charles Babbage"; correctAnswer = "D"; difficultyLevel = 4 },
    @{ questionText = "Hangi okyanus en büyüğüdür?"; optionA = "Atlantik"; optionB = "Hint"; optionC = "Pasifik"; optionD = "Arktik"; correctAnswer = "C"; difficultyLevel = 4 },
    @{ questionText = "DNA'nın yapısını keşfeden bilim insanları kimlerdir?"; optionA = "Watson ve Crick"; optionB = "Newton ve Einstein"; optionC = "Marie ve Pierre Curie"; optionD = "Bohr ve Planck"; correctAnswer = "A"; difficultyLevel = 5 },
    @{ questionText = "Görelilik Teorisini (E=mc²) kim formüle etmiştir?"; optionA = "Isaac Newton"; optionB = "Albert Einstein"; optionC = "Galileo Galilei"; optionD = "Nikola Tesla"; correctAnswer = "B"; difficultyLevel = 5 },
    @{ questionText = "Periyodik tablodaki ilk element hangisidir?"; optionA = "Oksijen"; optionB = "Helyum"; optionC = "Hidrojen"; optionD = "Karbon"; correctAnswer = "C"; difficultyLevel = 6 },
    @{ questionText = "Türkiye Cumhuriyeti'nin kurucusu kimdir?"; optionA = "İsmet İnönü"; optionB = "Fevzi Çakmak"; optionC = "Kazım Karabekir"; optionD = "Mustafa Kemal Atatürk"; correctAnswer = "D"; difficultyLevel = 6 }
)

foreach ($q in $questions) {
    $body = $q | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/questions" -Method Post -ContentType "application/json" -Body $body
    Write-Host "Soru Eklendi: $($q.questionText)"
}
