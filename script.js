let currentPage = 1;
let placesPerPage = 6;
let currentFilter = { genre: 'all', search: '' };
let userData = JSON.parse(localStorage.getItem('gameExtensionsUser')) || { name: 'RobloxPlayer', downloads: 0, places: 0, scripts: 0, avatars: 0, modes: {} };

const allPlaces = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=920587237&width=420&height=420&format=png", link: "https://www.roblox.com/games/920587237/Adopt-Me", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город.", rating: "★★★★☆", genre: "rpg", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=4924922222&width=420&height=420&format=png", link: "https://www.roblox.com/games/4924922222/Brookhaven-RP", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Jailbreak", desc: "Побег из тюрьмы.", rating: "★★★★★", genre: "adventure", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=606849621&width=420&height=420&format=png", link: "https://www.roblox.com/games/606849621/Jailbreak", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, title: "Tower of Hell", desc: "Сложный обби.", rating: "★★★★☆", genre: "obby", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=1054533950&width=420&height=420&format=png", link: "https://www.roblox.com/games/1054533950/Tower-of-Hell", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 5, title: "MeepCity", desc: "Социальная игра.", rating: "★★★★★", genre: "rpg", img: "https://tr.rbxcdn.com/asset-thumbnail/image?assetId=690091570&width=420&height=420&format=png", link: "https://www.roblox.com/games/690091570/MeepCity", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

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

function downloadScript(id) {
    userData.downloads++;
    userData.scripts++;
    localStorage.setItem('gameExtensionsUser', JSON.stringify(userData));
    alert(`Скачан скрипт #${id}!`);
    updateUserProgress();
}

function downloadAvatar(id) {
    userData.downloads++;
    userData.avatars++;
    localStorage.setItem('gameExtensionsUser', JSON.stringify(userData));
    alert(`Скачан аватар #${id}!`);
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

function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => {
        alert(`Скопирован ID: ${ip}`);
    });
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section
