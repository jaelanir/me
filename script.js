// 1. Matriks Latar Belakang (Mưa Chữ / Hujan Bintang-Kata)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Huruf-huruf matriks romantis atau simpel
const letters = "HAPPYBIRTHDAYCINTAKU💖✨".split("");

const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

// Inisialisasi posisi hujan di atas (titik Y=1)
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    // Memberi jejak buram pada latar belakang agar ada ekornya
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Kotak hitam pudar timpaan

    // Warna pink pastel manis untuk huruf
    ctx.fillStyle = "#ff69b4";
    ctx.font = fontSize + "px 'Courier New', monospace";

    for (let i = 0; i < drops.length; i++) {
        // Ambil huruf acak
        const text = letters[Math.floor(Math.random() * letters.length)];

        // Render
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Ulang ke atas jika melewati batas bawah secara acak
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 40);

// Menyesuaikan ulang kanvas ketika layar dire-size/dirotasi pada mobile
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// 2. Logika Utama Mengklik Kado & Muncul Teks
const giftContainer = document.getElementById('giftContainer');
const bgMusic = document.getElementById('bgMusic');
const contentDisplay = document.getElementById('contentDisplay');
const contentText = document.getElementById('contentText');

// Menyimpan kata-kata yang akan muncul per kalimat
const kalimatUcapan = [
    "Halo kesayanganku, Nafi'ah Maulidiya... 💕",
    "Ada kejutan kecil nih buat kamu 🎁",
    "Selamat ulang tahun ya, bidadari tercantikku! 🎂",
    "Semoga hari-harimu ke depan selalu dipenuhi dengan tawa dan senyuman manis ✨",
    "Tetaplah jadi penyejuk hatiku,",
    "dan semoga semua mimpi indahmu satu per satu Tuhan wujudkan 🙏",
    "Terima kasih ya sudah selalu ada dan melengkapi hidupku.",
    "I love you more than words can say, Nafi'ah... ❤️"
];

let indexKalimat = 0;

// Daftar Foto Polaroid
const fotoKenangan = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.mp4"
];
let indexFoto = 0;
const photoBook = document.getElementById('photoBook');
const photoImg = document.getElementById('photoImg');
const photoVid = document.getElementById('photoVid');

giftContainer.addEventListener('click', () => {
    // 1. Putar Musik Latar
    bgMusic.volume = 0.6;
    bgMusic.play().catch(e => console.log('Audio otomatis diblokir:', e));

    // 2. Tembakkan Confetti (Kembang Api Simple Kertas)
    // Library canvas-confetti dipanggil dari HTML
    if (typeof confetti === 'function') {
        const durasi = 3000;
        const akhirConfetti = Date.now() + durasi;

        (function tembak() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffc0cb', '#ff69b4', '#fff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffc0cb', '#ff69b4', '#fff']
            });

            if (Date.now() < akhirConfetti) {
                requestAnimationFrame(tembak);
            }
        }());
    }

    // 3. Sembunyikan Kado dengan CSS Opacity dahulu, lalu display:none
    giftContainer.style.opacity = '0';
    setTimeout(() => {
        giftContainer.classList.add('hidden');

        // Mulai tampilkan layar konten
        contentDisplay.classList.remove('hidden');

        // Jalankan siklus kalimat
        tampilkanKalimatBerikutnya();

    }, 600); // Sinkron dengan transition CSS di gift-container
});


// Fungsi untuk menjalankan teks kalimat-demi-kalimat berurutan
function tampilkanKalimatBerikutnya() {
    if (indexKalimat >= kalimatUcapan.length) {
        // Selesai: Biarkan kalimat terakhir menetap
        return;
    }

    // Ganti isi teks menjadi kalimat sekarang
    contentText.innerText = kalimatUcapan[indexKalimat];

    // Mulai animasi transisi Muncul
    requestAnimationFrame(() => {
        contentText.classList.remove('hidden-text');
        contentText.classList.add('visible-text');
    });

    // Menunggu beberapa detik (cukup untuk membaca), lalu pudarkan
    // Jika kalimat terakhir, jangan dipudarkan
    const bacaDelay = 3500;

    if (indexKalimat < kalimatUcapan.length - 1) {
        setTimeout(() => {
            // Animasi Pudar
            contentText.classList.remove('visible-text');
            contentText.classList.add('hidden-text');

            // Tunggu Pudarnya Selesai (1000ms dari CSS), Baru ganti teks
            setTimeout(() => {
                indexKalimat++;
                tampilkanKalimatBerikutnya();
            }, 1000);

        }, bacaDelay);
    } else {
        // Jika kalimat terakhir, berhenti (text menetap).
        // Tampilkan Album Foto di bawah teks
        contentDisplay.classList.add('move-up');

        tampilkanMedia();
        photoBook.classList.remove('hidden');

        // Timeout agar CSS transition opacity berjalan
        setTimeout(() => {
            photoBook.style.opacity = '1';
        }, 100);
    }
}

// Fungsi Helper untuk mengatur media gambar/video
function tampilkanMedia() {
    const src = fotoKenangan[indexFoto];
    if (src.endsWith('.mp4')) {
        photoImg.classList.add('hidden');
        photoVid.classList.remove('hidden');
        photoVid.src = src;
        photoVid.play().catch(e => console.log(e));
        // Reset animasi manual karena video bisa instant onload
        setTimeout(() => {
            photoVid.style.opacity = '1';
            photoBook.style.transform = 'translate(-50%, -50%) scale(1) rotate(-3deg)';
        }, 50);
    } else {
        photoVid.pause();
        photoVid.classList.add('hidden');
        photoImg.classList.remove('hidden');
        photoImg.src = src;
        photoImg.onload = () => {
            photoImg.style.opacity = '1';
            photoBook.style.transform = 'translate(-50%, -50%) scale(1) rotate(-3deg)';
        }
    }
}

// Logika Mengganti Foto Saat Polaroid Diklik
photoBook.addEventListener('click', () => {
    // Animasi putar/mengecil dan pudarkan gambar sebentar
    photoBook.style.transform = 'translate(-50%, -50%) scale(0.9) rotate(5deg)';
    photoImg.style.opacity = '0';
    photoVid.style.opacity = '0';

    // Ganti source setelah gambar pudar
    setTimeout(() => {
        indexFoto = (indexFoto + 1) % fotoKenangan.length;
        tampilkanMedia();
    }, 400);
});
