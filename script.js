// Импорт Firebase v10
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, push } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js';

// Firebase Config (твои ключи)
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

onAuthStateChanged(auth, user => {
    const authForm = document.getElementById('auth-form');
    const profileContent = document.getElementById('profile-content');
    if (user) {
        authForm.style.display = 'none';
        profileContent.style.display = 'block';
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            userData = snapshot.val() || userData;
            document.getElementById('profile-name').textContent = userData.name;
            document.getElementById('profile-bio').textContent = userData.bio;
            updateUserProgress();
        }, (error) => {
            console.error('Ошибка загрузки данных пользователя:', error);
        });
        loadPosts();
    } else {
        authForm.style.display = 'block';
        profileContent.style.display = 'none';
    }
});

function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(db, 'users/' + user.uid), userData);
            document.getElementById('auth-message').textContent = 'Регистрация успешна!';
            setTimeout(() => document.getElementById('auth-message').textContent = '', 3000);
        })
        .catch((error) => {
            document.getElementById('auth-message').textContent = error.message;
        });
}

function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById('auth-message').textContent = 'Вход успешный!';
            setTimeout(() => document.getElementById('auth-message').textContent = '', 3000);
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

function loadPosts() {
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const posts = document.getElementById('forum-posts');
        posts.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const postData = childSnapshot.val();
            const post = document.createElement('div');
            post.className = 'forum-post';
            post.innerHTML = `
                <img src="https://www.roblox.com/headshot-thumbnail/image?userId=1&width=50&height=50&format=png" alt="User">
                <div>
                    <h4>${postData.name}</h4>
                    <p>${postData.content}</p>
                </div>
            `;
            posts.appendChild(post);
        });
    }, (error) => {
        console.error('Ошибка загрузки постов:', error);
    });
}

function addPost() {
    const content = document.getElementById('post-content').value;
    if (content && auth.currentUser) {
        const postsRef = ref(db, 'posts');
        push(postsRef, {
            name: userData.name,
            content: content,
            timestamp: Date.now()
        });
        document.getElementById('post-content').value = '';
        closeModal('new-post-modal');
    } else {
        alert('Войдите, чтобы добавить пост!');
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
        closeModal('profile-modal');
    }
}

// Данные для плейсов
const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=920587237&width=420&height=420&format=png", link: "https://www.roblox.com/games/920587237/Adopt-Me", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город.", rating: "★★★★☆", genre: "rpg", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=4924922222&width=420&height=420&format=png", link: "https://www.roblox.com/games/4924922222/Brookhaven-RP", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=606849621&width=420&height=420&format=png", link: "https://www.roblox.com/games/606849621/Jailbreak", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    // Добавь больше плейсов по аналогии, если нужно
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
        card.innerHTML = `
            <img src="${place.img}" alt="${place.title}">
            <h4>${place.title}</h4>
            <p>${place.desc}</p>
            <p>${place.rating}</p>
            <button class="cta-btn details-btn" data-id="${place.id}">Подробнее</button>
        `;
        grid.appendChild(card);
    });
    updatePaginationPlaces(filtered.length);
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
        alert(`Скачан мод для плейса ${allPlaces.find(p => p.id === id).title}!`);
    } else {
        alert('Войдите для скачивания!');
    }
}

function downloadScript(id) {
    if (auth.currentUser) {
        userData.scripts++;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        alert(`Скачан скрипт #${id}!`);
    } else {
        alert('Войдите для скачивания!');
    }
}

function downloadAvatar(id) {
    if (auth.currentUser) {
        userData.avatars++;
        userData.downloads++;
        set(ref(db, 'users/' + auth.currentUser.uid), userData);
        alert(`Скачан аватар #${id}!`);
    } else {
        alert('Войдите для скачивания!');
    }
}

function showPlaceDetails(place) {
    document.getElementById('place-title').textContent = place.title;
    document.getElementById('place-desc').textContent = place.desc;
    document.getElementById('place-rating').innerHTML = `Рейтинг: ${place.rating}`;
    document.getElementById('place-img').src = place.img;
    document.getElementById('place-video').src = place.video;
    document.getElementById('download-btn').dataset.id = place.id;
    showModal('details-modal');
}

function updateUserProgress() {
    document.getElementById('user-downloads').textContent = userData.downloads;
    const totalPlaces = allPlaces.length;
    const percent = (userData.places / totalPlaces * 100).toFixed(1);
    document.getElementById('user-places').textContent = `${userData.places}/${totalPlaces}`;
    document.querySelector('.progress-fill').style.width = percent + '%';
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${percent}%`;
}

function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        alert(`Скопирован ID: ${ip}`);
    });
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
    const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: 'long', year: 'numeric' };
    const timeString = now.toLocaleString('ru-RU', options);
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-time-profile').textContent = timeString;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    switchSection('home');
    renderPlaces();
    updateUserProgress();
    updateProfileTime();
    setInterval(updateProfileTime, 60000);
    initParticles();

    // Event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    document.querySelector('.dark-toggle').addEventListener('click', toggleDarkMode);

    document.getElementById('sign-up-btn').addEventListener('click', signUp);
    document.getElementById('sign-in-btn').addEventListener('click', signIn);
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
    document.getElementById('edit-profile-btn').addEventListener('click', () => showModal('profile-modal'));
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);

    document.getElementById('new-post-btn').addEventListener('click', () => showModal('new-post-modal'));
    document.getElementById('add-post-btn').addEventListener('click', addPost);

    document.querySelector('.filter-btn').addEventListener('click', filterPlaces);

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const place = allPlaces.find(p => p.id === parseInt(btn.dataset.id));
            showPlaceDetails(place);
        });
    });

    document.getElementById('download-btn').addEventListener('click', () => {
        const id = parseInt(document.getElementById('download-btn').dataset.id);
        downloadPlace(id);
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (btn.dataset.type === 'script') downloadScript(id);
            if (btn.dataset.type === 'avatar') downloadAvatar(id);
        });
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => copyIP(btn.dataset.ip));
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal.id);
        });
    });
});
