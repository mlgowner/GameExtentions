let currentPage = 1;
let placesPerPage = 6;
let currentFilter = { genre: 'all', search: '' };
let userData = JSON.parse(localStorage.getItem('gameExtensionsUser')) || { name: 'RobloxPlayer', downloads: 0, places: 0, modes: {} };

const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=920587237&width=420&height=420&format=png", link: "https://www.roblox.com/games/920587237/Adopt-Me", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город.", rating: "★★★★☆", genre: "rpg", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=4924922222&width=420&height=420&format=png", link: "https://www.roblox.com/games/4924922222/Brookhaven-RP", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=606849621&width=420&height=420&format=png", link: "https://www.roblox.com/games/606849621/Jailbreak", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

let topPlaces = allPlaces.slice(0, 6);

function renderPlaces() {
    const grid = document.getElementById('places-grid');
    grid.innerHTML = '';

    let filtered = allPlaces.filter(place => {
        if (currentFilter.genre !== 'all' && place.genre !== currentFilter.genre) return false;
        if (currentFilter.search && !place.title.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
        return true;
    });

    const start = (currentPage - 1) * placesPerPage;
    const end = start + placesPerPage;
    filtered.slice(start, end).forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.onclick = () => showPlaceDetails(place);
        card.innerHTML = `
            <img src="${place.img}" alt="${place.title}" onerror="this.src='https://via.placeholder.com/420x420/00A2FF/FFF?text=Roblox';">
            <p class="place-title">${place.title}</p>
            <p class="place-desc">${place.desc}</p>
            <p class="rating">${place.rating}</p>
            <div class="action-buttons">
                <a href="${place.link}" class="action-btn" target="_blank">Играть</a>
                <button class="action-btn" onclick="event.stopPropagation(); downloadPlace(${place.id})">Скачать мод</button>
            </div>
        `;
        grid.appendChild(card);
    });

    updatePaginationPlaces(filtered.length);
    updateUserProgress();
}

function updatePaginationPlaces(total) {
    const pag = document.getElementById('pagination-places');
    pag.innerHTML = '';
    const pages = Math.ceil(total / placesPerPage);
    if (currentPage > 1) {
        const prev = document.createElement('button');
        prev.textContent = '←';
        prev.onclick = () => { currentPage--; renderPlaces(); };
        pag.appendChild(prev);
    }
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = currentPage === i ? 'active' : '';
        btn.onclick = () => { currentPage = i; renderPlaces(); };
        pag.appendChild(btn);
    }
    if (currentPage < pages) {
        const next = document.createElement('button');
        next.textContent = '→';
        next.onclick = () => { currentPage++; renderPlaces(); };
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
    userData.downloads++;
    userData.places++;
    localStorage.setItem('gameExtensionsUser', JSON.stringify(userData));
    alert(`Скачан мод для плейса ${allPlaces.find(p => p.id === id).title}!`);
    updateUserProgress();
}

function showPlaceDetails(place) {
    document.getElementById('place-title').textContent = place.title;
    document.getElementById('place-desc').textContent = place.desc;
    document.getElementById('place-rating').innerHTML = `Рейтинг: ${place.rating}`;
    document.getElementById('place-img').src = place.img;
    document.getElementById('place-video').src = place.video;
    document.getElementById('download-btn').onclick = () => downloadPlace(place.id);
    showModal('details-modal');
}

function updateUserProgress() {
    document.getElementById('user-downloads').textContent = userData.downloads;
    const totalPlaces = allPlaces.length;
    const percent = (userData.places / totalPlaces * 100).toFixed(1);
    document.getElementById('user-places').textContent = `${userData.places}/${totalPlaces}`;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${percent}%`;
}

function addPost() {
    const content = document.getElementById('post-content').value;
    if (content) {
        const posts = document.getElementById('forum-posts');
        const post = document.createElement('div');
        post.className = 'forum-post';
        post.innerHTML = `
            <img src="https://www.roblox.com/headshot-thumbnail/image?userId=1&width=50&height=50&format=png" alt="User">
            <div>
                <h4>${userData.name}</h4>
                <p>${content}</p>
            </div>
        `;
        posts.insertBefore(post, posts.firstChild);
        document.getElementById('post-content').value = '';
        closeModal('new-post-modal');
    }
}

function saveProfile() {
    userData.name = document.getElementById('new-name').value || userData.name;
    userData.bio = document.getElementById('new-bio').value || userData.bio;
    localStorage.setItem('gameExtensionsUser', JSON.stringify(userData));
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-bio').textContent = userData.bio;
    closeModal('profile-modal');
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[onclick="switchSection('${sectionId}')"]`).classList.add('active');
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
    const timeElement = document.getElementById('current-time');
    const timeProfile = document.getElementById('current-time-profile');
    if (timeElement) timeElement.textContent = now.toLocaleString('ru-RU', { timeZone: 'Europe/Paris' });
    if (timeProfile) timeProfile.textContent = now.toLocaleString('ru-RU', { timeZone: 'Europe/Paris' });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    switchSection('home');
    renderPlaces();
    updateUserProgress();
    updateProfileTime();
    setInterval(updateProfileTime, 60000);
    initParticles();
});
