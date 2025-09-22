// Импорт Firebase v10
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, update, push } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';

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
const storage = getStorage(app);

let userData = { name: 'RobloxPlayer', bio: 'Любитель модов и плейсов!', downloads: 0, places: 0, scripts: 0, avatars: 0, avatarUrl: 'https://www.roblox.com/headshot-thumbnail/image?userId=1&width=150&height=150&format=png' };

const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });

let confirmationResult;

// Показ модала только при первом заходе
let isFirstLoad = true;
onAuthStateChanged(auth, user => {
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const profileContent = document.getElementById('profile-content');
    if (user) {
        authModal.style.display = 'none';
        authForm.style.display = 'none';
        profileContent.style.display = 'block';
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            userData = snapshot.val() || userData;
            document.getElementById('profile-name').textContent = userData.name;
            document.getElementById('profile-bio').textContent = userData.bio;
            document.getElementById('new-name').value = userData.name;
            document.getElementById('new-bio').value = userData.bio;
            document.getElementById('profile-avatar').src = userData.avatarUrl;
            updateUserProgress();
            if (!user.emailVerified && user.email) {
                document.getElementById('auth-message').textContent = 'Email не подтверждён. Проверьте почту.';
            } else {
                document.getElementById('auth-message').textContent = '';
            }
        });
    } else if (isFirstLoad) {
        authModal.style.display = 'flex';
        authForm.style.display = 'block';
        profileContent.style.display = 'none';
        isFirstLoad = false;
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
    document.getElementById('send-code-btn').style.display = 'block';
    document.getElementById('sign-up-btn').style.display = 'none';
    document.getElementById('sign-in-btn').style.display = 'none';
});

// Отправка кода
document.getElementById('send-code-btn').addEventListener('click', () => {
    const method = document.getElementById('auth-method').value;
    if (method === 'phone') {
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
    } else if (method === 'email') {
        document.getElementById('auth-message').textContent = 'Функция отправки кода по email отключена (EmailJS удалён).';
    }
});

// Подтверждение кода
document.getElementById('verify-code-btn').addEventListener('click', () => {
    const method = document.getElementById('auth-method').value;
    const code = document.getElementById('verification-code').value;
    if (method === 'phone') {
        confirmationResult.confirm(code)
            .then((result) => {
                const user = result.user;
                set(ref(db, 'users/' + user.uid), userData);
                showToast('Регистрация успешна!');
                document.getElementById('auth-modal').style.display = 'none';
            })
            .catch((error) => {
                document.getElementById('auth-message').textContent = 'Неверный код: ' + error.message;
            });
    } else if (method === 'email') {
        document.getElementById('auth-message').textContent = 'Регистрация по email отключена (EmailJS удалён).';
    }
});

// Вход
document.getElementById('sign-in-btn').addEventListener('click', () => {
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
});

// Выход
document.getElementById('sign-out-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        showToast('Вы вышли!');
        location.reload();
    }).catch((error) => {
        console.error('Ошибка выхода:', error);
    });
});

// Показ гайда по установке
function showInstallationGuide() {
    document.getElementById('installation-modal').style.display = 'flex';
}

// Закрытие модала гайда
document.getElementById('close-installation-btn').addEventListener('click', () => {
    document.getElementById('installation-modal').style.display = 'none';
});

// Отправка отзыва
document.getElementById('submit-review-btn').addEventListener('click', () => {
    const reviewText = document.getElementById('review-text').value;
    if (auth.currentUser && reviewText) {
        const reviewsRef = ref(db, 'reviews');
        push(reviewsRef, {
            userId: auth.currentUser.uid,
            text: reviewText,
            timestamp: Date.now()
        }).then(() => {
            showToast('Отзыв отправлен!');
            document.getElementById('review-text').value = '';
        });
    } else {
        showToast('Войдите или заполните отзыв');
    }
});

// Массивы данных (полные)
const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Усынови питомцев.", rating: "★★★★★", genre: "rpg", img: "/GameExtentions/images/adopt-me.jpg", link: "https://www.roblox.com/games/920587237/Adopt-Me", compatibility: "PC/Mobile" },
    { id: 2, title: "Brookhaven", desc: "Ролевая игра в городе.", rating: "★★★★☆", genre: "rpg", img: "/GameExtentions/images/brookhaven.jpg", link: "https://www.roblox.com/games/6238705697/Brookhaven", compatibility: "PC/Mobile" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", img: "/GameExtentions/images/jailbreak.jpg", link: "https://www.roblox.com/games/606849621/Jailbreak", compatibility: "PC" },
    { id: 4, title: "Blox Fruits", desc: "Пиратские приключения.", rating: "★★★★★", genre: "rpg", img: "/GameExtentions/images/blox-fruits.jpg", link: "https://www.roblox.com/games/2753915549/Blox-Fruits", compatibility: "PC/Mobile" },
    { id: 5, title: "Doors", desc: "Хоррор с дверями.", rating: "★★★★☆", genre: "adventure", img: "/GameExtentions/images/doors.jpg", link: "https://www.roblox.com/games/6516141723/Doors", compatibility: "PC" },
    { id: 6, title: "Arsenal", desc: "Шутер с оружием.", rating: "★★★★★", genre: "obby", img: "/GameExtentions/images/arsenal.jpg", link: "https://www.roblox.com/games/286090429/Arsenal", compatibility: "PC/Mobile" },
    { id: 7, title: "Tower of Hell", desc: "Обби с башней.", rating: "★★★★", genre: "obby", img: "/GameExtentions/images/tower-of-hell.jpg", link: "https://www.roblox.com/games/1962086868/Tower-of-Hell", compatibility: "PC/Mobile" },
    { id: 8, title: "MeepCity", desc: "Социальная ролевая игра.", rating: "★★★☆", genre: "rpg", img: "/GameExtentions/images/meepcity.jpg", link: "https://www.roblox.com/games/370731277/MeepCity", compatibility: "PC/Mobile" },
    { id: 9, title: "Phantom Forces", desc: "Тактический шутер.", rating: "★★★★★", genre: "adventure", img: "/GameExtentions/images/phantom-forces.jpg", link: "https://www.roblox.com/games/292439477/Phantom-Forces", compatibility: "PC" }
];

const allScripts = [
    { id: 1, title: "Auto Farm Script", desc: "Автоматизация для плейсов.", img: "/GameExtentions/images/auto-farm.jpg", compatibility: "PC" },
    { id: 2, title: "Jailbreak Exploit", desc: "Скрипт для Jailbreak.", img: "/GameExtentions/images/jailbreak-exploit.jpg", compatibility: "PC" },
    { id: 3, title: "Blox Fruits ESP", desc: "Видеть врагов и предметы.", img: "/GameExtentions/images/blox-fruits-esp.jpg", compatibility: "PC/Mobile" },
    { id: 4, title: "Doors Speed Hack", desc: "Увеличение скорости в Doors.", img: "/GameExtentions/images/doors-speed.jpg", compatibility: "PC" },
    { id: 5, title: "Infinite Jump Script", desc: "Бесконечные прыжки.", img: "/GameExtentions/images/infinite-jump.jpg", compatibility: "PC/Mobile" },
    { id: 6, title: "God Mode Hack", desc: "Неуязвимость в играх.", img: "/GameExtentions/images/god-mode.jpg", compatibility: "PC" }
];

const allAvatars = [
    { id: 1, title: "Cool Roblox Avatar", desc: "Скачай и используй в игре.", img: "/GameExtentions/images/cool-avatar.jpg", compatibility: "All" },
    { id: 2, title: "Epic Avatar", desc: "Уникальный стиль.", img: "/GameExtentions/images/epic-avatar.jpg", compatibility: "All" },
    { id: 3, title: "Neon Avatar", desc: "Светящийся дизайн.", img: "/GameExtentions/images/neon-avatar.jpg", compatibility: "All" },
    { id: 4, title: "Futuristic Avatar", desc: "Футуристический вид.", img: "/GameExtentions/images/futuristic-avatar.jpg", compatibility: "All" },
    { id: 5, title: "Warrior Avatar", desc: "Воинственный стиль.", img: "/GameExtentions/images/warrior-avatar.jpg", compatibility: "All" },
    { id: 6, title: "Mystic Avatar", desc: "Мистический дизайн.", img: "/GameExtentions/images/mystic-avatar.jpg", compatibility: "All" }
];

const itemsPerPage = 4;
let currentPage = { places: 1, scripts: 1, avatars: 1 };
const currentFilter = { search: '', genre: '' };

// Функция переключения секций
function switchSection(section) {
    const sections = ['home', 'places', 'scripts', 'avatars', 'account', 'recommendations', 'chatbot'];
    sections.forEach(s => {
        document.getElementById(s).style.display = s === section ? 'block' : 'none';
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
    if (section === 'places') renderItems('places', allPlaces, 'places-grid', 'pagination-places');
    if (section === 'scripts') renderItems('scripts', allScripts, 'scripts-grid', 'pagination-scripts');
    if (section === 'avatars') renderItems('avatars', allAvatars, 'avatars-grid', 'pagination-avatars');
    if (section === 'recommendations') loadRecommendations();
    if (section === 'chatbot') setupChatbot();
}

// Унифицированная функция рендера
function renderItems(type, items, gridId, pagId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    const filtered = items.filter(item => 
        (currentFilter.genre === '' || item.genre === currentFilter.genre) &&
        item.title.toLowerCase().includes(currentFilter.search.toLowerCase())
    );
    const start = (currentPage[type] - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    filtered.slice(start, end).forEach(item => {
        const card = document.createElement('div');
        card.className = `${type.slice(0, -1)}-card`;
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/420';">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            ${item.rating ? `<p>${item.rating}</p>` : ''}
            <p>Совместимость: ${item.compatibility}</p>
            <button class="cta-btn download-btn" data-id="${item.id}" data-type="${type.slice(0, -1)}">Скачать</button>
        `;
        grid.appendChild(card);
    });
    updatePagination(type, filtered.length, pagId);
}

function updatePagination(type, total, pagId) {
    const pag = document.getElementById(pagId);
    pag.innerHTML = '';
    const pages = Math.ceil(total / itemsPerPage);
    if (currentPage[type] > 1) {
        const prev = document.createElement('button');
        prev.textContent = '←';
        prev.addEventListener('click', () => { currentPage[type]--; renderItems(type, getItems(type), `${type}-grid`, pagId); });
        pag.appendChild(prev);
    }
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle('active', currentPage[type] === i);
        btn.addEventListener('click', () => { currentPage[type] = i; renderItems(type, getItems(type), `${type}-grid`, pagId); });
        pag.appendChild(btn);
    }
    if (currentPage[type] < pages) {
        const next = document.createElement('button');
        next.textContent = '→';
        next.addEventListener('click', () => { currentPage[type]++; renderItems(type, getItems(type), `${type}-grid`, pagId); });
        pag.appendChild(next);
    }
}

function getItems(type) {
    if (type === 'places') return allPlaces;
    if (type === 'scripts') return allScripts;
    if (type === 'avatars') return allAvatars;
}

function filterItems() {
    currentFilter.search = document.getElementById('search-places').value;
    currentFilter.genre = document.getElementById('genre-filter').value;
    currentPage.places = 1;
    renderItems('places', allPlaces, 'places-grid', 'pagination-places');
    // Можно расширить для других, если добавить фильтры
}

function downloadItem(type, id) {
    if (auth.currentUser) {
        userData[type] = (userData[type] || 0) + 1;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        showToast('Скачивание начато!');
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            showToast('Предупреждение: Некоторые моды лучше работают на PC!');
        }
        window.open('https://www.mediafire.com/file/u8iubmwld78op99/Game_Extensions.zip/file', '_blank');
    } else {
        showToast('Войдите для скачивания!');
    }
}

// Обновление прогресса
function updateUserProgress() {
    const progress = (userData.places / 9) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${Math.round(progress)}%`;
    document.getElementById('downloads-stat').textContent = userData.downloads;
    document.getElementById('places-user-stat').textContent = `${userData.places}/9`;
    document.getElementById('scripts-user-stat').textContent = userData.scripts;
}

// Темный режим
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Тост
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Сохранение профиля
function saveProfile() {
    if (auth.currentUser) {
        userData.name = document.getElementById('new-name').value;
        userData.bio = document.getElementById('new-bio').value;
        update(ref(db, 'users/' + auth.currentUser.uid), userData);
        showToast('Профиль сохранен!');
    }
}

// Повторная отправка верификации
function resendVerification() {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
        sendEmailVerification(auth.currentUser).then(() => {
            showToast('Код отправлен повторно!');
        });
    }
}

// Частицы (простая реализация на canvas)
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 162, 255, 0.5)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
        });
        requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    switchSection('home');
    initParticles();

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    document.querySelector('.dark-toggle').addEventListener('click', toggleDarkMode);

    document.getElementById('sign-up-btn').addEventListener('click', () => {
        document.getElementById('auth-method').dispatchEvent(new Event('change'));
        document.getElementById('send-code-btn').click();
    });

    document.querySelector('.filter-btn').addEventListener('click', filterItems);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn')) {
            const id = parseInt(e.target.dataset.id);
            const type = e.target.dataset.type;
            downloadItem(type, id);
        }
        if (e.target.classList.contains('installation-btn')) {
            showInstallationGuide();
        }
    });

    // Debounce для поиска
    document.getElementById('search-places').addEventListener('input', debounce(filterItems, 300));
});

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Новые инновации: Рекомендации популярных игр Roblox
function loadRecommendations() {
    const grid = document.getElementById('recommendations-grid');
    grid.innerHTML = '';
    const recommendations = [
        { title: "Recommended Place 1", desc: "Popular Roblox game.", img: "https://thumbnails.roblox.com/v1/games/icons?universeIds=1&returnPolicy=PlaceHolder&size=150x150&format=Png", compatibility: "All" },
        { title: "Recommended Place 2", desc: "Another popular game.", img: "https://thumbnails.roblox.com/v1/games/icons?universeIds=2&returnPolicy=PlaceHolder&size=150x150&format=Png", compatibility: "All" }
    ];
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${rec.img}" alt="${rec.title}">
            <h4>${rec.title}</h4>
            <p>${rec.desc}</p>
            <p>Совместимость: ${rec.compatibility}</p>
        `;
        grid.appendChild(card);
    });
}

// Новые инновации: Чат-бот для вопросов по Roblox
function setupChatbot() {
    document.getElementById('chatbot-submit').addEventListener('click', () => {
        const input = document.getElementById('chatbot-input').value;
        const response = document.getElementById('chatbot-response');
        response.innerHTML = `<p>Ваш вопрос: ${input}</p><p>Ответ: Это пример ответа на вопрос по Roblox. Для реального чата используйте API.</p>`;
    });
}
