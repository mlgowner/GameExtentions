// Импорт Firebase v10
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAEELkMIx4fu9qjPWCID5-LiBqRSaGKpwU",
    authDomain: "game-extensions.firebaseapp.com",
    projectId: "game-extensions",
    storageBucket: "game-extensions.firebasestorage.app",
    messagingSenderId: "68965248738",
    appId: "1:68965248738:web:725083c3b89069a177b8bb",
    measurementId: "G-GHBGWQELT8"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let userData = { name: 'RobloxPlayer', bio: 'Любитель модов и плейсов!', downloads: 0, places: 0, scripts: 0, avatars: 0 };

const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });

let confirmationResult; // Для phone confirmation

onAuthStateChanged(auth, user => {
    const profileContent = document.getElementById('profile-content');
    const authModal = document.getElementById('auth-modal');
    if (user) {
        authModal.style.display = 'none';
        profileContent.style.display = 'block';
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            userData = snapshot.val() || userData;
            document.getElementById('profile-name').textContent = userData.name;
            document.getElementById('profile-bio').textContent = userData.bio;
            document.getElementById('new-name').value = userData.name;
            document.getElementById('new-bio').value = userData.bio;
            updateUserProgress();
            if (!user.emailVerified && user.email) {
                document.getElementById('auth-message').textContent = 'Email не подтверждён. Проверьте почту.';
            } else {
                document.getElementById('auth-message').textContent = '';
            }
        });
    } else {
        authModal.style.display = 'flex'; // Показ модала сразу
        profileContent.style.display = 'none';
    }
});

// Переключение полей по методу auth
document.getElementById('auth-method').addEventListener('change', (e) => {
    const method = e.target.value;
    document.getElementById('email').style.display = method === 'email' ? 'block' : 'none';
    document.getElementById('phone').style.display = method === 'phone' ? 'block' : 'none';
    document.getElementById('password').style.display = method === 'email' ? 'block' : 'none';
    document.getElementById('verification-code').style.display = 'none';
    document.getElementById('verify-code-btn').style.display = 'none';
    document.getElementById('send-code-btn').style.display = method === 'phone' ? 'block' : 'none';
    document.getElementById('sign-up-btn').style.display = method === 'email' ? 'block' : 'none';
    document.getElementById('sign-in-btn').style.display = method === 'email' ? 'block' : 'none';
});

// Отправка кода для phone
document.getElementById('send-code-btn').addEventListener('click', () => {
    const phone = document.getElementById('phone').value;
    signInWithPhoneNumber(auth, phone, recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            showToast('Код отправлен на телефон');
            document.getElementById('verification-code').style.display = 'block';
            document.getElementById('verify-code-btn').style.display = 'block';
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = 'Ошибка: ' + error.message;
        });
});

// Подтверждение кода для phone
document.getElementById('verify-code-btn').addEventListener('click', () => {
    const code = document.getElementById('verification-code').value;
    confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;
            set(ref(db, 'users/' + user.uid), userData);
            showToast('Вход/Регистрация успешна!');
            document.getElementById('auth-modal').style.display = 'none';
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = 'Неверный код: ' + error.message;
        });
});

function signUp() {
    const method = document.getElementById('auth-method').value;
    if (method !== 'email') return;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(db, 'users/' + user.uid), userData);
            sendEmailVerification(user)
                .then(() => {
                    showToast('Код выслан на почту');
                });
            document.getElementById('auth-modal').style.display = 'none';
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

function signIn() {
    const method = document.getElementById('auth-method').value;
    if (method !== 'email') return;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showToast('Вход успешный!');
            document.getElementById('auth-modal').style.display = 'none';
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

function signOutUser() {
    signOut(auth).then(() => {
        document.getElementById('auth-message').textContent = 'Вы вышли!';
        setTimeout(() => document.getElementById('auth-message').textContent = '', 3000);
    }).catch((error) => {
        console.error('Ошибка выхода:', error);
    });
}

function resendVerification() {
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                showToast('Код выслан на указанный адрес почты');
            })
            .catch((error) => {
                document.getElementById('auth-message').textContent = 'Ошибка: ' + error.message;
            });
    }
}

function saveProfile() {
    if (auth.currentUser) {
        const newName = document.getElementById('new-name').value || userData.name;
        const newBio = document.getElementById('new-bio').value || userData.bio;
        set(ref(db, 'users/' + auth.currentUser.uid), {
            ...userData,
            name: newName,
            bio: newBio
        });
        showToast('Профиль обновлён!');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы.", rating: "★★★★★", genre: "adventure", img: "./images/adopt-me.png", link: "https://www.roblox.com/games/920587237/Adopt-Me" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город.", rating: "★★★★☆", genre: "rpg", img: "./images/brookhaven.png", link: "https://www.roblox.com/games/4924922222/Brookhaven-RP" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", img: "./images/jailbreak.png", link: "https://www.roblox.com/games/606849621/Jailbreak" },
    { id: 4, title: "Blox Fruits", desc: "Пиратские приключения.", rating: "★★★★★", genre: "rpg", img: "./images/blox-fruits.png", link: "https://www.roblox.com/games/2753915549/Blox-Fruits" },
    { id: 5, title: "Doors", desc: "Хоррор с дверями.", rating: "★★★★☆", genre: "adventure", img: "./images/doors.png", link: "https://www.roblox.com/games/6516141723/Doors" },
    { id: 6, title: "Arsenal", desc: "Шутер с оружием.", rating: "★★★★★", genre: "obby", img: "./images/arsenal.png", link: "https://www.roblox.com/games/286090429/Arsenal" }
];

const allScripts = [
    { id: 1, title: "Auto Farm Script", desc: "Автоматизация для плейсов.", img: "./images/auto-farm.png" },
    { id: 2, title: "Jailbreak Exploit", desc: "Скрипт для Jailbreak.", img: "./images/jailbreak-exploit.png" },
    { id: 3, title: "Blox Fruits ESP", desc: "Видеть врагов и предметы.", img: "./images/blox-fruits-esp.png" },
    { id: 4, title: "Doors Speed Hack", desc: "Увеличение скорости в Doors.", img: "./images/doors-speed.png" }
];

const allAvatars = [
    { id: 1, title: "Cool Roblox Avatar", desc: "Скачай и используй в игре.", img: "./images/cool-avatar.png" },
    { id: 2, title: "Epic Avatar", desc: "Уникальный стиль.", img: "./images/epic-avatar.png" },
    { id: 3, title: "Neon Avatar", desc: "Светящийся дизайн.", img: "./images/neon-avatar.png" },
    { id: 4, title: "Futuristic Avatar", desc: "Футуристический вид.", img: "./images/futuristic-avatar.png" }
];

const placesPerPage = 4;
let currentPage = 1;
const currentFilter = { search: '', genre: 'all' };

function renderPlaces() {
    const grid = document.getElementById('places-grid');
    grid.innerHTML = '';
    const filtered = allPlaces.filter(p => 
        (currentFilter.genre === 'all' || p.genre === currentFilter.genre) &&
        p.title.toLowerCase().includes(currentFilter.search.toLowerCase())
    );
    const start = (currentPage - 1) * placesPerPage;
    const end = start + placesPerPage;
    filtered.slice(start, end).forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${place.img}" alt="${place.title}">
            <h3>${place.title}</h3>
            <p>${place.desc}</p>
            <p>${place.rating}</p>
            <button class="download-btn" data-id="${place.id}" data-type="place">Скачать</button>
            <button class="details-btn">Подробнее</button>
            <div class="place-details" style="display: none;">
                <img src="${place.img}" alt="${place.title}">
                <a href="${place.link}" target="_blank" class="cta-btn">Играть на Roblox</a>
            </div>
        `;
        grid.appendChild(card);
        card.querySelector('.details-btn').addEventListener('click', () => {
            const details = card.querySelector('.place-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
    updatePaginationPlaces(filtered.length);
}

function renderScripts() {
    const grid = document.getElementById('scripts-grid');
    grid.innerHTML = '';
    allScripts.forEach(script => {
        const card = document.createElement('div');
        card.className = 'script-card';
        card.innerHTML = `
            <img src="${script.img}" alt="${script.title}">
            <h3>${script.title}</h3>
            <p>${script.desc}</p>
            <button class="download-btn" data-id="${script.id}" data-type="script">Скачать</button>
        `;
        grid.appendChild(card);
    });
}

function renderAvatars() {
    const grid = document.getElementById('avatars-grid');
    grid.innerHTML = '';
    allAvatars.forEach(avatar => {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        card.innerHTML = `
            <img src="${avatar.img}" alt="${avatar.title}">
            <h3>${avatar.title}</h3>
            <p>${avatar.desc}</p>
            <button class="download-btn" data-id="${avatar.id}" data-type="avatar">Скачать</button>
        `;
        grid.appendChild(card);
    });
}

function updatePaginationPlaces(total) {
    const pag = document.getElementById('pagination-places');
    pag.innerHTML = '';
    const pages = Math.ceil(total / placesPerPage);
    if (currentPage > 1) {
        const prev = document.createElement('button');
        prev.textContent = '←';
        prev.addEventListener('click', () => { currentPage--; renderPlaces(); });
        pag.appendChild(prev);
    }
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = currentPage === i ? 'active' : '';
        btn.addEventListener('click', () => { currentPage = i; renderPlaces(); });
        pag.appendChild(btn);
    }
    if (currentPage < pages) {
        const next = document.createElement('button');
        next.textContent = '→';
        next.addEventListener('click', () => { currentPage++; renderPlaces(); });
        pag.appendChild(next);
    }
}

function filterPlaces() {
    currentFilter.search = document.getElementById('search-places').value;
    currentFilter.genre = document.getElementById('genre-filter').value;
    currentPage = 1;
    renderPlaces();
}

function downloadPlace(id) {
    if (auth.currentUser) {
        userData.places++;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        showToast('Скачивание начато!');
    } else {
        alert('Войдите для скачивания!');
    }
    window.open('https://www.mediafire.com/file/u8iubmwld78op99/Game_Extensions.zip/file', '_blank');
}

function downloadScript(id) {
    if (auth.currentUser) {
        userData.scripts++;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        showToast('Скачивание начато!');
    } else {
        alert('Войдите для скачивания!');
    }
    window.open('https://www.mediafire.com/file/u8iubmwld78op99/Game_Extensions.zip/file', '_blank');
}

function downloadAvatar(id) {
    if (auth.currentUser) {
        userData.avatars++;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        showToast('Скачивание начато!');
    } else {
        alert('Войдите для скачивания!');
    }
    window.open('https://www.mediafire.com/file/u8iubmwld78op99/Game_Extensions.zip/file', '_blank');
}

function updateUserProgress() {
    document.getElementById('user-downloads').textContent = userData.downloads;
    const totalPlaces = allPlaces.length;
    document.getElementById('user-places').textContent = `${userData.places}/${totalPlaces}`;
    document.getElementById('user-scripts').textContent = userData.scripts;
    const percent = (userData.places / totalPlaces * 100).toFixed(1);
    document.querySelector('.progress-fill').style.width = percent + '%';
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${percent}%`;
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 210}, 100%, 50%)`
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function updateProfileTime() {
    const now = new Date();
    now.setHours(19, 13, 0, 0); // Установка времени на 07:13 PM CEST
    const timeString = now.toLocaleString('ru-RU', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }).replace('г.', ' ').replace(' в ', ', ');
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-time-profile').textContent = timeString;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    switchSection('home');
    renderPlaces();
    renderScripts();
    renderAvatars();
    updateUserProgress();
    updateProfileTime();
    setInterval(updateProfileTime, 60000);
    initParticles();

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    document.querySelector('.dark-toggle').addEventListener('click', toggleDarkMode);

    document.getElementById('sign-up-btn').addEventListener('click', signUp);
    document.getElementById('sign-in-btn').addEventListener('click', signIn);
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('resend-verification-btn').addEventListener('click', resendVerification);

    document.querySelector('.filter-btn').addEventListener('click', filterPlaces);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn')) {
            const id = parseInt(e.target.dataset.id);
            const type = e.target.dataset.type;
            if (type === 'place') downloadPlace(id);
            if (type === 'script') downloadScript(id);
            if (type === 'avatar') downloadAvatar(id);
        }
    });
});
