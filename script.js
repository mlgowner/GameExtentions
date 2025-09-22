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

// Регистрация
document.getElementById('sign-up-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(db, 'users/' + user.uid), userData);
            sendEmailVerification(user).then(() => {
                showToast('Регистрация успешна! Проверьте email для верификации.');
            });
            document.getElementById('auth-modal').style.display = 'none';
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
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
document.querySelector('.installation-btn').addEventListener('click', showInstallationGuide);

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

// Массивы данных
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
    { id: 6, title: "God Mode Hack", desc: "Неуязвимость в играх.", img: "/GameExtentions/images/god-mode.jpg", compatibility: "PC" },
    { id: 7, title: "Arsenal Aimbot", desc: "Автоматическая наводка.", img: "/GameExtentions/images/arsenal-aimbot.jpg", compatibility: "PC" },
    { id: 8, title: "Tower of Hell Fly", desc: "Полет для обби.", img: "/GameExtentions/images/tower-fly.jpg", compatibility: "PC" }
];

const allAvatars = [
    { id: 1, title: "Cyber Ninja", desc: "Кибер-ниндзя стиль.", img: "/GameExtentions/images/cyber-ninja.jpg", compatibility: "PC/Mobile" },
    { id: 2, title: "Space Explorer", desc: "Космический исследователь.", img: "/GameExtentions/images/space-explorer.jpg", compatibility: "PC/Mobile" },
    { id: 3, title: "Dark Knight", desc: "Темный рыцарь.", img: "/GameExtentions/images/dark-knight.jpg", compatibility: "PC/Mobile" },
    { id: 4, title: "Anime Hero", desc: "Герой в стиле аниме.", img: "/GameExtentions/images/anime-hero.jpg", compatibility: "PC/Mobile" },
    { id: 5, title: "Steampunk Pilot", desc: "Стимпанк пилот.", img: "/GameExtentions/images/steampunk-pilot.jpg", compatibility: "PC/Mobile" }
];

// Функции для отображения контента
function renderItems(items, containerId, itemsPerPage = 6) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = containerId.includes('places') ? 'place-card' : (containerId.includes('scripts') ? 'script-card' : 'avatar-card');
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            ${item.rating ? `<p>Рейтинг: ${item.rating}</p>` : ''}
            ${item.genre ? `<p>Жанр: ${item.genre}</p>` : ''}
            <p>Совместимость: ${item.compatibility}</p>
            ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="cta-btn">Перейти</a>` : ''}
        `;
        container.appendChild(card);
    });
    setupPagination(items, containerId, itemsPerPage);
}

function setupPagination(items, containerId, itemsPerPage) {
    const pagination = document.getElementById(`pagination-${containerId.split('-')[0]}`);
    pagination.innerHTML = '';
    const pageCount = Math.ceil(items.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => paginate(items, containerId, itemsPerPage, i));
        pagination.appendChild(button);
    }
    paginate(items, containerId, itemsPerPage, 1);
}

function paginate(items, containerId, itemsPerPage, page) {
    const container = document.getElementById(containerId);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = items.slice(start, end);
    renderItems(paginatedItems, containerId, itemsPerPage);
    document.querySelectorAll(`#pagination-${containerId.split('-')[0]} button`).forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#pagination-${containerId.split('-')[0]} button:nth-child(${page})`).classList.add('active');
}

// Фильтрация плейсов
document.querySelector('.filter-btn').addEventListener('click', () => {
    const search = document.getElementById('search-places').value.toLowerCase();
    const genre = document.getElementById('genre-filter').value;
    const filteredPlaces = allPlaces.filter(place => 
        place.title.toLowerCase().includes(search) && 
        (genre === '' || place.genre === genre)
    );
    renderItems(filteredPlaces, 'places-grid', 6);
});

// Навигация
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('section').forEach(section => section.style.display = 'none');
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const sectionId = button.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'block';
        button.classList.add('active');
        if (sectionId === 'places') {
            renderItems(allPlaces, 'places-grid', 6);
        } else if (sectionId === 'scripts') {
            renderItems(allScripts, 'scripts-grid', 6);
        } else if (sectionId === 'avatars') {
            renderItems(allAvatars, 'avatars-grid', 6);
        }
    });
});

// Темный режим
document.querySelector('.dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Сохранение профиля
document.getElementById('save-profile-btn').addEventListener('click', () => {
    if (auth.currentUser) {
        const newName = document.getElementById('new-name').value;
        const newBio = document.getElementById('new-bio').value;
        const userRef = ref(db, 'users/' + auth.currentUser.uid);
        update(userRef, { name: newName, bio: newBio }).then(() => {
            showToast('Профиль обновлён!');
            userData.name = newName;
            userData.bio = newBio;
            document.getElementById('profile-name').textContent = newName;
            document.getElementById('profile-bio').textContent = newBio;
        });
    }
});

// Обновление прогресса
function updateUserProgress() {
    const total = 9; // Максимум плейсов для примера
    const progress = (userData.places / total) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${Math.round(progress)}%`;
    document.getElementById('downloads-stat').textContent = userData.downloads;
    document.getElementById('places-user-stat').textContent = `${userData.places}/${total}`;
    document.getElementById('scripts-user-stat').textContent = userData.scripts;
}

// Уведомления
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-section="home"]').style.display = 'block';
    document.querySelector('[data-section="home"]').classList.add('active');
});
