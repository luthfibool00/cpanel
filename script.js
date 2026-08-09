// ===============================
// NAVIGASI
// ===============================

function showSection(id, el) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(id);
    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (el) {
        el.classList.add("active");
    }

    const titleMap = {
        dashboard: "Dashboard Overview",
        "ai-tools": "Koleksi AI Tools",
        games: "Game Center"
    };

    const headerTitle = document.getElementById("header-title");

    if (headerTitle) {
        headerTitle.innerText = titleMap[id] || "Dashboard";
    }

    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById("sidebar");

        if (sidebar) {
            sidebar.classList.remove("show");
        }
    }
}


// ===============================
// SIDEBAR
// ===============================

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("show");
    }
}


// ===============================
// DARK MODE
// ===============================

function toggleTheme() {
    const html = document.documentElement;

    if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
    } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }

    updateThemeButton();
}

function updateThemeButton() {
    const button = document.getElementById("themeBtn");

    if (!button) return;

    if (document.documentElement.getAttribute("data-theme") === "dark") {
        button.innerText = "☀️ Mode Terang";
    } else {
        button.innerText = "🌙 Mode Gelap";
    }
}

function loadTheme() {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }

    updateThemeButton();
}


// ===============================
// LOGIN / REGISTER
// ===============================

let isLoginMode = true;

function openModal() {
    const modal = document.getElementById("authModal");

    if (modal) {
        modal.classList.add("active");
    }
}

function forceCloseModal() {
    const modal = document.getElementById("authModal");

    if (modal) {
        modal.classList.remove("active");
    }

    updateUI();
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;

    const title = document.getElementById("authTitle");
    const submit = document.getElementById("authSubmitBtn");
    const switchText = document.getElementById("switchAuthText");
    const alert = document.getElementById("alertMsg");

    if (title) {
        title.innerText = isLoginMode
            ? "Login Akun"
            : "Daftar Akun Baru";
    }

    if (submit) {
        submit.innerText = isLoginMode
            ? "Masuk"
            : "Daftar Sekarang";
    }

    if (switchText) {
        switchText.innerText = isLoginMode
            ? "Belum punya akun? Daftar di sini"
            : "Sudah punya akun? Login di sini";
    }

    if (alert) {
        alert.style.display = "none";
        alert.innerText = "";
    }
}


// ===============================
// AUTH
// ===============================

function handleAuth(event) {
    event.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const alertMsg = document.getElementById("alertMsg");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
        showAlert("Email dan password wajib diisi.");
        return;
    }

    if (password.length < 6) {
        showAlert("Password minimal 6 karakter.");
        return;
    }

    /*
     * REGISTER
     */
    if (!isLoginMode) {
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            showAlert("Email sudah terdaftar.");
            return;
        }

        users.push({
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", email);

        closeAuthModal();
        updateUI();

        alert("Pendaftaran berhasil!");

        return;
    }


    /*
     * LOGIN
     */

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    /*
     * Akun admin bawaan
     */
    const adminEmail = "luthfi@admin.com";
    const adminPassword = "admin123";

    if (
        email === adminEmail &&
        password === adminPassword
    ) {
        localStorage.setItem("currentUser", email);

        closeAuthModal();
        updateUI();

        return;
    }


    /*
     * Login user terdaftar
     */
    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    if (!user) {
        showAlert("Email atau password salah.");
        return;
    }

    localStorage.setItem("currentUser", user.email);

    closeAuthModal();
    updateUI();
}


// ===============================
// ALERT
// ===============================

function showAlert(message) {
    const alertMsg = document.getElementById("alertMsg");

    if (!alertMsg) return;

    alertMsg.innerText = message;
    alertMsg.style.display = "block";
}


// ===============================
// CLOSE MODAL
// ===============================

function closeAuthModal() {
    const modal = document.getElementById("authModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// ===============================
// LOGOUT
// ===============================

function handleLogout() {
    localStorage.removeItem("currentUser");

    updateUI();

    openModal();
}


// ===============================
// UPDATE UI
// ===============================

function updateUI() {
    const currentUser = localStorage.getItem("currentUser");

    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    const welcomeMessage =
        document.getElementById("welcomeMessage");

    const statusTeks =
        document.getElementById("statusTeks");

    const userAvatar =
        document.getElementById("userAvatar");

    const userEmailText =
        document.getElementById("userEmailText");

    const btnDashboardLogin =
        document.getElementById("btnDashboardLogin");


    if (currentUser) {

        // Login button
        if (btnLogin) {
            btnLogin.style.display = "none";
        }

        // Logout button
        if (btnLogout) {
            btnLogout.style.display = "block";
        }

        // Avatar
        if (userAvatar) {
            userAvatar.style.display = "flex";
            userAvatar.innerText =
                currentUser.charAt(0).toUpperCase();
        }

        // Email
        if (userEmailText) {
            userEmailText.style.display = "block";
            userEmailText.innerText = currentUser;
        }

        // Welcome
        if (welcomeMessage) {
            welcomeMessage.innerText =
                `Halo, ${currentUser}! Selamat datang kembali di Dashboard.`;
        }

        // Status
        if (statusTeks) {
            statusTeks.innerText = "Member VIP";
        }

        // Dashboard login button
        if (btnDashboardLogin) {
            btnDashboardLogin.style.display = "none";
        }

    } else {

        if (btnLogin) {
            btnLogin.style.display = "block";
        }

        if (btnLogout) {
            btnLogout.style.display = "none";
        }

        if (userAvatar) {
            userAvatar.style.display = "none";
        }

        if (userEmailText) {
            userEmailText.style.display = "none";
        }

        if (welcomeMessage) {
            welcomeMessage.innerText =
                "Silakan login untuk mengakses fitur penuh.";
        }

        if (statusTeks) {
            statusTeks.innerText = "Tamu";
        }

        if (btnDashboardLogin) {
            btnDashboardLogin.style.display = "inline-block";
        }
    }
}


// ===============================
// AI SIMULASI
// ===============================

function generateAI() {
    const inputElement =
        document.getElementById("aiInput");

    const output =
        document.getElementById("aiOutput");

    if (!inputElement || !output) return;

    const input = inputElement.value.trim();

    if (!input) {
        alert("Mohon ketik sesuatu terlebih dahulu!");
        return;
    }

    output.style.display = "block";

    output.innerHTML =
        '<span style="color: var(--text-muted);">Sedang berpikir... ⏳</span>';

    setTimeout(() => {

        /*
         * Escape HTML agar input user tidak
         * dianggap sebagai HTML.
         */
        const safeInput =
            input.replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;");

        output.innerHTML =
            `<strong>Jawaban AI:</strong><br><br>
             Simulasi jawaban untuk:
             <em>"${safeInput}"</em>.`;

    }, 1000);
}


// ===============================
// TIC TAC TOE
// ===============================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


function makeMove(cell, index) {

    if (!gameActive) return;

    if (board[index] !== "") return;

    board[index] = currentPlayer;

    cell.innerText = currentPlayer;

    cell.classList.add(
        currentPlayer.toLowerCase()
    );

    checkWinner();
}


function checkWinner() {

    let roundWon = false;

    for (
        let i = 0;
        i < winningConditions.length;
        i++
    ) {

        const [a, b, c] =
            winningConditions[i];

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            roundWon = true;
            break;
        }
    }


    const gameStatus =
        document.getElementById("gameStatus");


    if (roundWon) {

        if (gameStatus) {
            gameStatus.innerHTML =
                `🎉 Pemain <strong>${currentPlayer}</strong> Menang!`;
        }

        gameActive = false;

        return;
    }


    if (!board.includes("")) {

        if (gameStatus) {
            gameStatus.innerHTML =
                "🤝 Permainan Seri!";
        }

        gameActive = false;

        return;
    }


    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    if (gameStatus) {
        gameStatus.innerHTML =
            `Giliran pemain: <strong>${currentPlayer}</strong>`;
    }
}


function resetGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;


    const gameStatus =
        document.getElementById("gameStatus");

    if (gameStatus) {
        gameStatus.innerHTML =
            `Giliran pemain: <strong>${currentPlayer}</strong>`;
    }


    document.querySelectorAll(".cell")
        .forEach(cell => {

            cell.innerText = "";

            cell.classList.remove(
                "x",
                "o"
            );
        });
}


// ===============================
// SAAT HALAMAN DIBUKA
// ===============================

window.addEventListener("load", () => {

    loadTheme();

    updateUI();

    /*
     * Kalau belum login,
     * tampilkan modal login.
     */
    if (!localStorage.getItem("currentUser")) {
        openModal();
    }

});
