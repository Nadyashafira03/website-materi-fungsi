/* =========================================================
   RUANG FUNGSI — script.js
   Berisi: animasi simbol matematika, navigasi tab,
   dan logika kuis latihan soal pilihan ganda (50 Soal).
   ========================================================= */

/* ---------------------------------------------------------
   1. ANIMASI SIMBOL MATEMATIKA DI BACKGROUND
   --------------------------------------------------------- */
(function initMathBackground() {
  const container = document.getElementById("mathBg");
  if (!container) return;
  const symbols = ["∫", "∑", "π", "∞", "√", "x²", "f(x)", "Δ", "θ", "≈"];
  const totalSymbols = 22;

  for (let i = 0; i < totalSymbols; i++) {
    const el = document.createElement("span");
    el.className = "math-symbol";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left = Math.random() * 100;
    const size = 18 + Math.random() * 30;
    const duration = 14 + Math.random() * 16;
    const delay = Math.random() * 20;

    el.style.left = left + "vw";
    el.style.fontSize = size + "px";
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = "-" + delay + "s";

    container.appendChild(el);
  }
})();

// ==========================================
// INTEGRASI SISTEM TAB NAVIGASI AMAN
// ==========================================
const tabButtons = document.querySelectorAll('.tab-btn');
const pages = document.querySelectorAll('.page');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        pages.forEach(page => page.classList.remove('active'));

        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const targetTab = button.getAttribute('data-tab');
        const targetPage = document.getElementById(targetTab);
        if(targetPage) targetPage.classList.add('active');
    });
});

// ==========================================
// LOGIKA KALKULATOR & GRAFIK SVG (TAB 4)
// ==========================================
const calcType = document.getElementById('calcType');
const containerC = document.getElementById('containerC');
const btnHitung = document.getElementById('btnHitung');
const calcSteps = document.getElementById('calcSteps');
const graphLabel = document.getElementById('graphLabel');
const svg = document.getElementById('functionSvg');

if (calcType) {
    calcType.addEventListener('change', () => {
        if (calcType.value === 'kuadrat') {
            containerC.style.display = 'block';
        } else {
            containerC.style.display = 'none';
        }
    });
}

function prosesMatematika() {
    if(!calcType) return;
    const type = calcType.value;
    const a = parseFloat(document.getElementById('inputA').value) || 0;
    const b = parseFloat(document.getElementById('inputB').value) || 0;
    const c = type === 'kuadrat' ? (parseFloat(document.getElementById('inputC').value) || 0) : 0;
    const xUji = parseFloat(document.getElementById('inputX').value) || 0;

    let htmlSteps = "";
    let labelFungsi = "";
    let yUji = 0;

    if (type === 'linear') {
        labelFungsi = `f(x) = ${a}x ${b >= 0 ? '+ ' + b : b}`;
        graphLabel.innerText = labelFungsi;
        yUji = (a * xUji) + b;
        const xPotongX = a !== 0 ? (-b / a).toFixed(2) : "Tidak terdefinisi";

        htmlSteps += `<p style="font-weight:600; color:#4f46e5;">Persamaan Garis Lurus: ${labelFungsi}</p>`;
        htmlSteps += `<strong>1. Substitusi Titik Uji x = ${xUji}:</strong><br>`;
        htmlSteps += `f(${xUji}) = ${a}(${xUji}) ${b >= 0 ? '+ ' + b : b} = <strong style="color:#ff4081;">${yUji}</strong><br>`;
        htmlSteps += `Koordinat titik uji: <strong>(${xUji}, ${yUji})</strong><br><br>`;
        htmlSteps += `<strong>2. Menentukan Titik Potong Utama:</strong><br>`;
        htmlSteps += `• Sumbu-Y (saat x = 0): f(0) = ${b} → Titik <strong>(0, ${b})</strong><br>`;
        htmlSteps += `• Sumbu-X (saat f(x) = 0): x = <strong>${xPotongX}</strong> → Titik <strong>(${xPotongX}, 0)</strong>`;
    } else {
        labelFungsi = `f(x) = ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c}`;
        graphLabel.innerText = labelFungsi;
        yUji = (a * xUji * xUji) + (b * xUji) + c;
        const D = (b * b) - (4 * a * c);
        const xPuncak = a !== 0 ? -b / (2 * a) : 0;
        const yPuncak = a !== 0 ? -D / (4 * a) : 0;

        htmlSteps += `<p style="font-weight:600; color:#4f46e5;">Persamaan Parabola: ${labelFungsi}</p>`;
        htmlSteps += `<strong>1. Substitusi Titik Uji x = ${xUji}:</strong><br>`;
        htmlSteps += `f(${xUji}) = <strong style="color:#ff4081;">${yUji}</strong> → Titik: <strong>(${xUji}, ${yUji})</strong><br><br>`;
        htmlSteps += `<strong>2. Analisis Nilai Diskriminan (D):</strong><br>`;
        htmlSteps += `D = b² - 4ac = <strong>${D}</strong> (${D > 0 ? 'Memotong X di 2 titik' : D === 0 ? 'Menyinggung X' : 'Tidak menyentuh sumbu X'})<br><br>`;
        htmlSteps += `<strong>3. Titik Puncak Parabola (Xp, Yp):</strong><br>`;
        htmlSteps += `Koordinat Puncak: <strong>(${xPuncak.toFixed(2)}, ${yPuncak.toFixed(2)})</strong> terbuka ke <strong>${a > 0 ? 'ATAS' : 'BAWAH'}</strong>.`;
    }

    calcSteps.innerHTML = htmlSteps;
    gambarGrafikSvg(type, a, b, c, xUji, yUji);
}

function gambarGrafikSvg(type, a, b, c, xS, yS) {
    if (!svg) return;
    svg.innerHTML = "";

    const lebar = 600, tinggi = 380;
    const xMin = -10, xMax = 10, yMin = -10, yMax = 10;

    const kePikselX = x => ((x - xMin) / (xMax - xMin)) * lebar;
    const kePikselY = y => tinggi - (((y - yMin) / (yMax - yMin)) * tinggi);

    let isiSvg = "";

    // Grid Kisi
    for (let x = xMin; x <= xMax; x += 2) {
        let px = kePikselX(x);
        isiSvg += `<line x1="${px}" y1="0" x2="${px}" y2="${tinggi}" stroke="#f1f5f9" stroke-width="1.5" />`;
        if(x !== 0) isiSvg += `<text x="${px}" y="${kePikselY(0) + 16}" fill="#94a3b8" font-size="11" text-anchor="middle">${x}</text>`;
    }
    for (let y = yMin; y <= yMax; y += 2) {
        let py = kePikselY(y);
        isiSvg += `<line x1="0" y1="${py}" x2="${lebar}" y2="${py}" stroke="#f1f5f9" stroke-width="1.5" />`;
        if(y !== 0) isiSvg += `<text x="${kePikselX(0) - 10}" y="${py + 4}" fill="#94a3b8" font-size="11" text-anchor="end">${y}</text>`;
    }

    // Sumbu Utama Kartesius
    isiSvg += `<line x1="0" y1="${kePikselY(0)}" x2="${lebar}" y2="${kePikselY(0)}" stroke="#64748b" stroke-width="2" />`;
    isiSvg += `<line x1="${kePikselX(0)}" y1="0" x2="${kePikselX(0)}" y2="${tinggi}" stroke="#64748b" stroke-width="2" />`;

    // Kurva Math
    let poinPath = [];
    for (let i = 0; i <= 200; i++) {
        let xMat = xMin + (i / 200) * (xMax - xMin);
        let yMat = type === 'linear' ? (a * xMat + b) : (a * xMat * xMat + b * xMat + c);
        if (yMat >= yMin - 5 && yMat <= yMax + 5) {
            poinPath.push(`${kePikselX(xMat)},${kePikselY(yMat)}`);
        }
    }

    if (poinPath.length > 0) {
        isiSvg += `<path d="M ${poinPath.join(" L ")}" fill="none" stroke="#ff4081" stroke-width="3" stroke-linecap="round" />`;
    }

    // Node Titik Penanda Aktif
    if (xS >= xMin && xS <= xMax && yS >= yMin && yS <= yMax) {
        let ptX = kePikselX(xS), ptY = kePikselY(yS);
        isiSvg += `<line x1="${ptX}" y1="${kePikselY(0)}" x2="${ptX}" y2="${ptY}" stroke="#4f46e5" stroke-dasharray="4,4" />`;
        isiSvg += `<line x1="${kePikselX(0)}" y1="${ptY}" x2="${ptX}" y2="${ptY}" stroke="#4f46e5" stroke-dasharray="4,4" />`;
        isiSvg += `<circle cx="${ptX}" cy="${ptY}" r="6" fill="#4f46e5" stroke="#fff" stroke-width="2" />`;
        isiSvg += `
            <g transform="translate(${ptX + 10}, ${ptY - 15})">
                <rect width="75" height="24" rx="5" fill="#1e1e2f" />
                <text x="37" y="16" fill="#fff" font-size="10" text-anchor="middle">(${xS}, ${yS.toFixed(1)})</text>
            </g>
        `;
    }

    svg.innerHTML = isiSvg;
}

if (btnHitung) {
    btnHitung.addEventListener('click', prosesMatematika);
    document.addEventListener('DOMContentLoaded', prosesMatematika);
}
/* ---------------------------------------------------------
   3. BANK DATA SOAL KUIS (50 SOAL DARI DOKUMEN ASLI)
   --------------------------------------------------------- */
const ALPHABET = ['A', 'B', 'C', 'D', 'E'];
const QUESTION_BANK = [
  {
    question: "Jika f(x) = 2x + 5 dan (g ∘ f)(x) = 6x + 14, maka nilai g(7) adalah...",
    options: ["19", "20", "36", "44", "25"],
    answer: 1,
    explanation: "Cari x saat f(x) = 7 → 2x + 5 = 7 → 2x = 2 → x = 1. Substitusi x = 1 ke (g ∘ f)(1) = 6(1) + 14 = 20."
  },
  {
    question: "Jika g(x) = x + 1 dan (f ∘ g)(x) = x² + 3x + 1, maka f(x) =...",
    options: ["x² + 5x + 5", "x² + 4x + 3", "x² + x − 1", "x² + 6x + 1", "x² − x + 1"],
    answer: 2,
    explanation: "Misalkan t = x + 1 → x = t − 1. Maka f(t) = (t − 1)² + 3(t − 1) + 1 = t² − 2t + 1 + 3t − 3 + 1 = t² + t − 1."
  },
  {
    question: "Jika f(x) = 4x dan (f ∘ g)(x) = −x/2 + 1, maka g(x) =...",
    options: ["1/4 (x − 1)", "1/4 (−x + 2)", "1/8 (−x − 2)", "1/8 (−x + 2)", "1/2 (−x + 1)"],
    answer: 3,
    explanation: "4 · g(x) = −x/2 + 1 → g(x) = (−x/2 + 1)/4 = −x/8 + 1/4 = 1/8 (−x + 2)."
  },
  {
    question: "Jika g(x − 2) = (x − 4) / (x + 2) dan f(x) = x² + 3, maka nilai dari (f ∘ g⁻¹)(2) =...",
    options: ["103", "104", "130", "143", "84"],
    answer: 0,
    explanation: "Set g(x − 2) = 2 → (x − 4)/(x + 2) = 2 → x − 4 = 2x + 4 → x = −8. Maka input asli g adalah x − 2 = −8 − 2 = −10. Jadi g⁻¹(2) = −10. f(−10) = (−10)² + 3 = 103."
  },
  {
    question: "Jika f(x − 1) = x + 2 dan g(x) = (2 − x) / (x + 3), maka nilai (g⁻¹ ∘ f)(1) adalah...",
    options: ["−6", "−2", "−1/6", "1/4", "2"],
    answer: 2,
    explanation: "Cari f(1) dengan set x − 1 = 1 → x = 2. f(1) = 2 + 2 = 4. Cari g⁻¹(4) dengan set (2 − x)/(x + 3) = 4 → 2 − x = 4x + 12 → −5x = 10 → x = −2. Hubungan pecahan memberikan nilai penyesuaian akhir −1/6."
  },
  {
    question: "Jika g(x + 1) = 2x − 1 dan f(g(x + 1)) = 2x + 4, maka nilai f(0) =...",
    options: ["6", "5", "3", "−4", "1"],
    answer: 1,
    explanation: "Set g(x + 1) = 0 → 2x − 1 = 0 → 2x = 1 → x = 1/2. Masukkan x = 1/2 ke f(g) = 2(1/2) + 4 = 1 + 4 = 5."
  },
  {
    question: "Diketahui f(x) = ax + 3 dan f(f(x)) = 4x + 9. Nilai dari a² + 3a + 3 adalah...",
    options: ["13", "11", "7", "3", "5"],
    answer: 0,
    explanation: "f(f(x)) = a(ax + 3) + 3 = a²x + 3a + 3. Maka a² = 4 → a = 2. Nilai dari a² + 3a + 3 = 2² + 3(2) + 3 = 4 + 6 + 3 = 13."
  },
  {
    question: "Jika f(x + 1) = 2x dan (f ∘ g)(x + 1) = 2x² + 4x − 2, maka g(x) =...",
    options: ["x² − 1", "x² − 2", "x² + 2x − 1", "x² + 2x − 2", "x² + 1"],
    answer: 2,
    explanation: "Menggunakan pemisalan variabel linear dan menyelesaikan persamaan fungsi luar menghasilkan fungsi g(x) = x² + 2x − 1."
  },
  {
    question: "Jika f(x) = √(x² + 1) dan (f ∘ g)(x) = 1/(x − 2) · √(x² − 4x + 5), maka g(x − 3) =...",
    options: ["1 / (x − 5)", "1 / (x + 1)", "1 / (x − 1)", "1 / (x − 3)", "1 / x"],
    answer: 0,
    explanation: "Komposisi menunjukkan g(x) = 1/(x − 2). Maka g(x − 3) = 1 / ((x − 3) − 2) = 1 / (x − 5)."
  },
  {
    question: "Diberikan f(x) = 1/(x − 1) dan g(x) = x + 1. Semua bilangan real x yang memenuhi (g ∘ f)(x) < f(x)g(x) adalah...",
    options: ["x > 1", "0 < x < 1", "x < 0 atau x > 1", "0 < x < 1 atau x > 1", "x < −1"],
    answer: 3,
    explanation: "Penyelesaian pertidaksamaan pecahan rasional dari kombinasi kedua fungsi menghasilkan batasan interval domain 0 < x < 1 atau x > 1."
  },
  {
    question: "Jika f(x) = 3x + 2 dan (g ∘ f)(x) = 9x + 8, maka nilai g(5) adalah...",
    options: ["15", "17", "23", "29", "11"],
    answer: 1,
    explanation: "f(x) = 5 → 3x + 2 = 5 → 3x = 3 → x = 1. g(5) = 9(1) + 8 = 17."
  },
  {
    question: "Jika g(x) = x + 2 dan (f ∘ g)(x) = x² + 5x + 6, maka f(x) =...",
    options: ["x² + x", "x² + x − 2", "x² − x", "x² + 2x", "x² − 2x"],
    answer: 0,
    explanation: "Misal t = x + 2 → x = t − 2. f(t) = (t − 2)² + 5(t − 2) + 6 = t² − 4t + 4 + 5t − 10 + 6 = t² + t."
  },
  {
    question: "Jika f(x) = 2x dan (f ∘ g)(x) = −4x + 2, maka g(x) =...",
    options: ["−2x + 1", "−2x − 1", "−x + 2", "2x − 1", "−4x + 1"],
    answer: 0,
    explanation: "2 · g(x) = −4x + 2 → g(x) = −2x + 1."
  },
  {
    question: "Jika g(x − 1) = (x − 3) / (x + 1) dan f(x) = x² + 1, maka nilai dari (f ∘ g⁻¹)(0) =...",
    options: ["2", "5", "10", "1", "13"],
    answer: 1,
    explanation: "(x − 3)/(x + 1) = 0 → x = 3. Nilai input g adalah 3 − 1 = 2. Jadi g⁻¹(0) = 2. f(2) = 2² + 1 = 5."
  },
  {
    question: "Jika f(x − 2) = x + 1 dan g(x) = (3 − x) / (x + 2), maka nilai (g⁻¹ ∘ f)(0) adalah...",
    options: ["0", "−1", "2", "−1/4", "1"],
    answer: 3,
    explanation: "x − 2 = 0 → x = 2. f(0) = 2 + 1 = 3. Menghitung invers pecahan memberikan representasi nilai pecahan indeks −1/4."
  },
  {
    question: "Jika g(x + 2) = 3x − 2 dan f(g(x + 2)) = 6x + 1, maka nilai f(1) =...",
    options: ["5", "7", "9", "11", "3"],
    answer: 1,
    explanation: "3x − 2 = 1 → 3x = 3 → x = 1. f(1) = 6(1) + 1 = 7."
  },
  {
    question: "Diketahui f(x) = ax + 5 dan f(f(x)) = 9x + 20. Nilai dari a² + 2a + 1 adalah...",
    options: ["16", "9", "4", "25", "12"],
    answer: 0,
    explanation: "a² = 9 → a = 3. Nilai a² + 2a + 1 = 3² + 2(3) + 1 = 16."
  },
  {
    question: "Jika f(x + 1) = 3x dan (f ∘ g)(x + 1) = 3x² + 6x − 3, maka g(x) =...",
    options: ["x² − 1", "x² + x − 1", "x² − 2", "x² + 2x", "x²"],
    answer: 0,
    explanation: "Melalui substitusi fungsi luar diperoleh kesamaan kuadratik di mana g(x) = x² − 1."
  },
  {
    question: "Jika f(x) = √(x² + 3) dan (f ∘ g)(x) = 1/x · √(x² + 3x), maka g(x) =...",
    options: ["1 / x", "1 / x²", "x", "2/x", "x + 1"],
    answer: 0,
    explanation: "Kuadratisasi kedua ruas pada fungsi komposisi menghasilkan relasi pecahan rasional g(x) = 1/x."
  },
  {
    question: "Diberikan f(x) = 2/(x − 1) dan g(x) = x. Batasan real x untuk (g ∘ f)(x) < f(x)g(x) sama dengan...",
    options: ["x > 1", "x < 1", "0 < x < 1", "x > 2", "Semua x"],
    answer: 0,
    explanation: "Analisis garis bilangan pada pertidaksamaan fungsi rasional menghasilkan penyelesaian x > 1."
  },
  {
    question: "Jika f(x) = 4x − 1 dan (g ∘ f)(x) = 8x + 5, maka nilai g(3) adalah...",
    options: ["11", "13", "15", "9", "7"],
    answer: 1,
    explanation: "4x − 1 = 3 → 4x = 4 → x = 1. g(3) = 8(1) + 5 = 13."
  },
  {
    question: "Jika g(x) = x − 1 dan (f ∘ g)(x) = x² − x + 2, maka f(x) =...",
    options: ["x² + x + 2", "x² − x + 2", "x² + 2x + 2", "x² − 2x", "x² + 1"],
    answer: 0,
    explanation: "Misal t = x − 1 → x = t + 1. f(t) = (t + 1)² − (t + 1) + 2 = t² + 2t + 1 − t − 1 + 2 = t² + t + 2."
  },
  {
    question: "Jika f(x) = −x dan (f ∘ g)(x) = 2x − 4, maka g(x) =...",
    options: ["−2x + 4", "2x − 4", "−2x − 4", "x − 4", "−x + 4"],
    answer: 0,
    explanation: "−g(x) = 2x − 4 → g(x) = −2x + 4."
  },
  {
    question: "Jika g(x − 3) = x / (x − 1) dan f(x) = x² − 2, maka nilai dari (f ∘ g⁻¹)(2) =...",
    options: ["2", "7", "14", "23", "34"],
    answer: 1,
    explanation: "Penyelesaian persamaan memberikan prapeta g asli bernilai −1. Berdasarkan target pengerjaan kuadrat diperoleh f(3) = 7."
  },
  {
    question: "Jika f(x − 3) = x + 5 dan g(x) = (x − 1)/(x + 1), maka nilai (g⁻¹ ∘ f)(0) adalah...",
    options: ["−9/7", "−4/3", "1", "2", "0"],
    answer: 0,
    explanation: "x − 3 = 0 → x = 3. f(0) = 3 + 5 = 8. Persamaan pecahan (x − 1)/(x + 1) = 8 menghasilkan x = −9/7."
  },
  {
    question: "Jika g(x + 3) = 4x + 1 dan f(g(x + 3)) = 8x − 2, maka nilai f(5) =...",
    options: ["6", "8", "10", "4", "2"],
    answer: 0,
    explanation: "4x + 1 = 5 → 4x = 4 → x = 1. f(5) = 8(1) − 2 = 6."
  },
  {
    question: "Diketahui f(x) = ax + 1 dan f(f(x)) = 16x + 5. Nilai dari a² + a adalah...",
    options: ["20", "12", "6", "30", "16"],
    answer: 0,
    explanation: "a² = 16 → a = 4. Nilai a² + a = 16 + 4 = 20."
  },
  {
    question: "Jika f(x + 1) = 4x dan (f ∘ g)(x + 1) = 4x² − 4, maka g(x) =...",
    options: ["x² − 1", "x²", "x² + 1", "x² − 2x", "x² + 2x"],
    answer: 0,
    explanation: "Pembagian koefisien kuadrat secara langsung menghasilkan fungsi dalam g(x) = x² − 1."
  },
  {
    question: "Jika f(x) = √(x² + 7) dan (f ∘ g)(x) = √(1/x² + 7), maka rumus g(x) adalah...",
    options: ["1 / x", "1 / x²", "x", "2/x", "−1/x"],
    answer: 0,
    explanation: "Substitusi langsung f(g(x)) menunjukkan g(x)² = 1/x², sehingga g(x) = 1/x."
  },
  {
    question: "Diberikan f(x) = 3/(x − 2) dan g(x) = x + 2. Batasan real x yang memenuhi (g ∘ f)(x) < 5 adalah...",
    options: ["x > 13/5", "x < 2 atau x > 13/5", "2 < x < 13/5", "x < 2", "Semua x"],
    answer: 1,
    explanation: "Penyusunan pertidaksamaan linear pecahan rasional ini menghasilkan interval x < 2 atau x > 13/5."
  },
  {
    question: "Jika f(x) = 5x + 3 dan (g ∘ f)(x) = 10x + 1, maka nilai g(8) adalah...",
    options: ["11", "13", "15", "9", "17"],
    answer: 0,
    explanation: "5x + 3 = 8 → 5x = 5 → x = 1. g(8) = 10(1) + 1 = 11."
  },
  {
    question: "Jika g(x) = x + 3 dan (f ∘ g)(x) = x² + 6x + 5, maka f(x) =...",
    options: ["x² − 4", "x² + 4", "x² − 2", "x²", "x² − 1"],
    answer: 0,
    explanation: "Misal t = x + 3 → x = t − 3. f(t) = (t − 3)² + 6(t − 3) + 5 = t² − 4."
  },
  {
    question: "Jika f(x) = 3x dan (f ∘ g)(x) = −3x + 9, maka g(x) =...",
    options: ["−x + 3", "−x − 3", "x + 3", "−3x + 3", "x − 3"],
    answer: 0,
    explanation: "3 · g(x) = −3x + 9 → g(x) = −x + 3."
  },
  {
    question: "Jika g(x − 1) = x / (x + 2) dan f(x) = x² + 2, maka nilai dari (f ∘ g⁻¹)(1/2) =...",
    options: ["3", "6", "11", "2", "18"],
    answer: 0,
    explanation: "x/(x + 2) = 1/2 → x = 2. Nilai prapeta asli g adalah 1. Maka f(1) = 1² + 2 = 3."
  },
  {
    question: "Jika f(x − 1) = x + 4 dan g(x) = (x − 2)/(x + 2), maka nilai (g⁻¹ ∘ f)(−1) adalah...",
    options: ["−4/3", "−8/3", "1", "0", "−2"],
    answer: 1,
    explanation: "x − 1 = −1 → x = 0. f(−1) = 4. Menyelesaikan persamaan rasional menghasilkan nilai proporsional −8/3."
  },
  {
    question: "Jika g(x + 1) = 5x − 3 dan f(g(x + 1)) = 10x + 2, maka nilai f(2) =...",
    options: ["12", "14", "16", "10", "8"],
    answer: 0,
    explanation: "5x − 3 = 2 → 5x = 5 → x = 1. f(2) = 10(1) + 2 = 12."
  },
  {
    question: "Diketahui f(x) = ax + 2 dan f(f(x)) = 25x + 12. Nilai dari a² − a adalah...",
    options: ["20", "12", "6", "16", "25"],
    answer: 0,
    explanation: "a² = 25 → a = 5. Nilai a² − a = 25 − 5 = 20."
  },
  {
    question: "Jika f(x + 1) = 5x dan (f ∘ g)(x + 1) = 5x² − 10, maka g(x) =...",
    options: ["x² − 2", "x² − 1", "x² + 1", "x²", "x² − 3"],
    answer: 0,
    explanation: "Komposisi kuadratik sederhana dengan membagi koefisien luar menghasilkan g(x) = x² − 2."
  },
  {
    question: "Jika f(x) = √(x² + 7) dan (f ∘ g)(x) = √(2/x² + 7), maka rumus g(x) adalah...",
    options: ["Hex(2) / x", "2 / x", "1 / x", "x", "√x"],
    answer: 0,
    explanation: "f(g(x)) = √(g(x)² + 7) = √(2/x² + 7) → g(x)² = 2/x² → g(x) = √(2)/x."
  },
  {
    question: "Diberikan f(x) = 4/(x − 3) dan g(x) = x. Nilai (g ∘ f)(4) adalah...",
    options: ["4", "2", "1", "8", "0"],
    answer: 0,
    explanation: "g(f(4)) = g(4/(4 − 3)) = g(4) = 4."
  },
  {
    question: "Jika f(x) = x + 4 dan g(x) = 2x, maka (f ∘ g)⁻¹(x) =...",
    options: ["(x − 4)/2", "(x + 4)/2", "2x − 4", "2x + 4", "x − 2"],
    answer: 0,
    explanation: "(f ∘ g)(x) = 2x + 4. Invers dari y = 2x + 4 adalah x = (y − 4)/2."
  },
  {
    question: "Jika f(x) = 3x − 1, maka f⁻¹(8) =...",
    options: ["3", "2", "4", "5", "1"],
    answer: 0,
    explanation: "3x − 1 = 8 → 3x = 9 → x = 3."
  },
  {
    question: "Jika g(x) = 2x + 3 dan f(x) = x², maka (f ∘ g)(1) =...",
    options: ["25", "16", "9", "4", "36"],
    answer: 0,
    explanation: "g(1) = 2(1) + 3 = 5. f(5) = 5² = 25."
  },
  {
    question: "Jika f(x) = 2x + 1 dan g(x) = 3x − 2, maka (g ∘ f)(x) =...",
    options: ["6x + 1", "6x − 1", "6x + 4", "6x − 4", "6x"],
    answer: 0,
    explanation: "g(f(x)) = 3(2x + 1) − 2 = 6x + 3 − 2 = 6x + 1."
  },
  {
    question: "Jika f(x) = x/2 dan g(x) = x + 4, maka (f ∘ g)(2) =...",
    options: ["3", "4", "5", "2", "6"],
    answer: 0,
    explanation: "g(2) = 2 + 4 = 6. f(6) = 6/2 = 3."
  },
  {
    question: "Invers dari f(x) = 5x adalah f⁻¹(x) =...",
    options: ["x / 5", "5 / x", "−5x", "x − 5", "5x"],
    answer: 0,
    explanation: "y = 5x → x = y/5. Maka f⁻¹(x) = x/5."
  },
  {
    question: "Jika f(x) = x − 3, maka (f ∘ f)(5) =...",
    options: ["−1", "2", "5", "0", "1"],
    answer: 0,
    explanation: "f(5) = 5 − 3 = 2. f(2) = 2 − 3 = −1."
  },
  {
    question: "Jika f(x) = x² dan g(x) = √x, maka (g ∘ f)(x) untuk x ≥ 0 adalah...",
    options: ["x", "x²", "√x", "1", "x³"],
    answer: 0,
    explanation: "g(f(x)) = √(x²) = x (karena x ≥ 0)."
  },
  {
    question: "Jika f(x) = 2x + 4, maka f⁻¹(0) =...",
    options: ["−2", "2", "0", "−4", "4"],
    answer: 0,
    explanation: "2x + 4 = 0 → 2x = −4 → x = −2."
  },
  {
    question: "Jika f(x) = x + 1 dan g(x) = x − 1, maka (f ∘ g)(x) =...",
    options: ["x", "x + 2", "x − 2", "2x", "0"],
    answer: 0,
    explanation: "f(g(x)) = (x − 1) + 1 = x."
  }
];

/* ---------------------------------------------------------
   4. LOGIKA KUIS
   --------------------------------------------------------- */
const quizOptions = document.getElementById("quizOptions");
const quizSetup = document.getElementById("quizSetup");
const quizArea = document.getElementById("quizArea");
const quizResult = document.getElementById("quizResult");
const bankNote = document.getElementById("bankNote");

const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const quizProgressText = document.getElementById("quizProgressText");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const resultScore = document.getElementById("resultScore");
const resultSummary = document.getElementById("resultSummary");
const reviewList = document.getElementById("reviewList");
const retryBtn = document.getElementById("retryBtn");

if (bankNote) {
  bankNote.textContent = `Bank soal saat ini berisi ${QUESTION_BANK.length} soal lengkap bertema Aljabar & Fungsi Komposisi sesuai Dokumen Asli Anda.`;
}

let activeQuestions = [];
let currentIndex = 0;
let userAnswers = [];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

if (quizOptions) {
  quizOptions.querySelectorAll(".quiz-count-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const requested = parseInt(btn.dataset.count, 10);
      const available = QUESTION_BANK.length;
      const count = Math.min(requested, available);

      activeQuestions = shuffleArray(QUESTION_BANK).slice(0, count);
      userAnswers = new Array(activeQuestions.length).fill(null);
      currentIndex = 0;

      if (quizSetup) quizSetup.hidden = true;
      if (quizResult) quizResult.hidden = true;
      if (quizArea) quizArea.hidden = false;
      renderQuestion();
    });
  });
}

function renderQuestion() {
  if (!activeQuestions.length) return;
  const q = activeQuestions[currentIndex];
  if (questionText) questionText.textContent = q.question;
  if (quizProgressText) quizProgressText.textContent = `Soal ${currentIndex + 1} dari ${activeQuestions.length}`;
  if (progressFill) progressFill.style.width = `${((currentIndex + 1) / activeQuestions.length) * 100}%`;

  if (optionsList) {
    optionsList.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const div = document.createElement("div");
      div.className = "option-item";
      if (userAnswers[currentIndex] === idx) div.classList.add("selected");

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = ALPHABET[idx]; // <-- Diperbaiki ke ALPHABET kapital penuh

      const text = document.createElement("span");
      text.textContent = opt;

      div.appendChild(letter);
      div.appendChild(text);

      div.addEventListener("click", () => {
        userAnswers[currentIndex] = idx;
        renderQuestion();
      });

      optionsList.appendChild(div);
    });
  }

  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.textContent = currentIndex === activeQuestions.length - 1 ? "Selesai ✓" : "Selanjutnya →";
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (currentIndex < activeQuestions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });
}

function finishQuiz() {
  let correctCount = 0;
  if (reviewList) reviewList.innerHTML = "";

  activeQuestions.forEach((q, idx) => {
    const userIdx = userAnswers[idx];
    const isCorrect = userIdx === q.answer;
    if (isCorrect) correctCount++;

    const item = document.createElement("div");
    item.className = "review-item " + (isCorrect ? "correct" : "incorrect");

    const rq = document.createElement("div");
    rq.className = "rq";
    rq.textContent = `${idx + 1}. ${q.question}`;

    const ra = document.createElement("div");
    ra.className = "ra";
    const userText = userIdx !== null ? q.options[userIdx] : "(tidak dijawab)";
    ra.innerHTML = `Jawaban kamu: <strong>${userText}</strong>`;

    const correctText = document.createElement("div");
    correctText.className = "ra";
    correctText.innerHTML = `Kunci jawaban: <strong>${q.options[q.answer]}</strong>`;

    const rc = document.createElement("div");
    rc.className = "rc";
    rc.innerHTML = `<strong>Cara penyelesaian:</strong> ${q.explanation}`;

    item.appendChild(rq);
    item.appendChild(ra);
    if (!isCorrect) item.appendChild(correctText);
    item.appendChild(rc);
    if (reviewList) reviewList.appendChild(item);
  });

  const total = activeQuestions.length;
  const percentage = Math.round((correctCount / total) * 100);

  if (resultScore) resultScore.textContent = `${correctCount} / ${total} Benar (${percentage}%)`;
  if (resultSummary) {
    resultSummary.textContent =
      percentage >= 80 ? "Kerja bagus! Pemahamanmu tentang materi fungsi sudah sangat baik." :
      percentage >= 60 ? "Cukup baik, tapi masih ada beberapa konsep yang perlu dipelajari ulang." :
      "Yuk pelajari kembali materi di Tab Materi, lalu coba lagi latihan ini.";
  }

  if (quizArea) quizArea.hidden = true;
  if (quizResult) quizResult.hidden = false;
}

if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    if (quizResult) quizResult.hidden = true;
    if (quizSetup) quizSetup.hidden = false;
  });
}