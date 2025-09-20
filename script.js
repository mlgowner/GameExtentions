let currentPage = 1;
let gamesPerPage = 6;
let currentFilter = { genre: 'all', platform: 'all', sort: 'popular' };
let allGames = [
    { id: 1, title: "Adopt Me!", desc: "Виртуальные питомцы и торговля.", versions: "PC, Mobile", rating: "★★★★★", genre: "adventure", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=920587237", link: "https://www.roblox.com/games/920587237/Adopt-Me" },
    { id: 2, title: "Brookhaven", desc: "Ролевой город с друзьями.", versions: "PC, Mobile", rating: "★★★★☆", genre: "rpg", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=3127079818", link: "https://www.roblox.com/games/3127079818/Brookhaven" },
    { id: 3, title: "Tower of Hell", desc: "Сложный обби-курс.", versions: "PC, Mobile", rating: "★★★★★", genre: "obby", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=1358018854", link: "https://www.roblox.com/games/1358018854/Tower-of-Hell" },
    { id: 4, title: "Jailbreak", desc: "Побег из тюрьмы.", versions: "PC, Mobile", rating: "★★★★☆", genre: "adventure", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=606849621", link: "https://www.roblox.com/games/606849621/Jailbreak" },
    { id: 5, title: "MeepCity", desc: "Социальная игра с питомцами.", versions: "PC, Mobile", rating: "★★★★★", genre: "rpg", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=1406241958", link: "https://www.roblox.com/games/1406241958/MeepCity" },
    { id: 6, title: "Arsenal", desc: "Соревновательный шутер.", versions: "PC, Mobile", rating: "★★★★☆", genre: "action", platform: "pc,mobile", img: "https://www.roblox.com/asset/?id=3466388603", link: "https://www.roblox.com/games/3466388603/Arsenal" },
    // Добавьте больше игр по необходимости
];

let topGamesList = allGames.slice(0, 6); // Топ 6 игр

function renderGames() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';

    let filteredGames = allGames.filter(game => {
        if (currentFilter.genre !== 'all' && game.genre !== currentFilter.genre) return false;
        if (currentFilter.platform !== 'all' && !game.platform.includes(currentFilter.platform)) return false;
        if (currentFilter.search && !game.title.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
        return true;
    });

    if (currentFilter.sort === 'new') {
        filteredGames.sort((a, b) => b.id - a.id);
    } else {
        filteredGames.sort((a, b) => allGames.indexOf(a) - allGames.indexOf(b));
    }

    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    filteredGames.slice(start, end).forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.title}" loading="lazy" onerror="this.src='https://www.roblox.com/asset/?id=123456789';">
            <p class="game-title">${game.title}</p>
            <p class="game-desc">${game.desc}</p>
            <p class="rating">${game.rating}</p>
            <div class="action-buttons">
                <button class="action-btn" onclick="window.open('${game.link}', '_blank')">Играть</button>
                <button class="action-btn" onclick="showDetails(${JSON.stringify(game)})">Детали</button>
            </div>
        `;
        gameGrid.appendChild(gameCard);
    });

    updatePagination(filteredGames.length);
}

function updatePagination(totalGames) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalGames / gamesPerPage);
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Предыдущая';
        prevBtn.onclick = () => {
            currentPage--;
            renderGames();
        };
        pagination.appendChild(prevBtn);
    }

    const pageSpan = document.createElement('span');
    pageSpan.textContent = `Страница ${currentPage}`;
    pagination.appendChild(pageSpan);

    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Следующая';
        nextBtn.onclick = () => {
            currentPage++;
            renderGames();
        };
        pagination.appendChild(nextBtn);
    }
}

function filterByGenre(genre) {
    currentFilter.genre = genre;
    currentPage = 1;
    document.querySelectorAll('.version-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.version-filters .filter-btn[onclick="filterByGenre('${genre}')"]`).classList.add('active');
    renderGames();
}

function filterByPlatform(platform) {
    currentFilter.platform = platform;
    currentPage = 1;
    document.querySelectorAll('.loader-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.loader-filters .filter-btn[onclick="filterByPlatform('${platform}')"]`).classList.add('active');
    renderGames();
}

function sortGames(sort) {
    currentFilter.sort = sort;
    currentPage = 1;
    document.querySelectorAll('.sort-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.sort-filters .filter-btn[onclick="sortGames('${sort}')"]`).classList.add('active');
    renderGames();
}

function filterGames() {
    currentFilter.search = document.getElementById('search').value;
    currentPage = 1;
    renderGames();
}

function showDetails(game) {
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-img').src = game.img;
    document.getElementById('game-desc').textContent = game.desc;
    document.getElementById('game-versions').textContent = `Платформы: ${game.versions}`;
    document.getElementById('game-rating').innerHTML = `Рейтинг: ${game.rating}`;
    switchSection('details');
}

function backToList() {
    switchSection('games');
}

function showInstallGuide() {
    document.getElementById('install-modal').style.display = 'block';
}

function closeInstallGuide() {
    document.getElementById('install-modal').style.display = 'none';
}

function showTopGames() {
    const topModal = document.getElementById('top-modal');
    const topGamesListDiv = document.getElementById('top-games-list');
    topGamesListDiv.innerHTML = '';
    topGamesList.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'top-game-item';
        gameItem.innerHTML = `
            <img src="${game.img}" alt="${game.title}" loading="lazy" onerror="this.src='https://www.roblox.com/asset/?id=123456789';">
            <p>${game.title}</p>
        `;
        gameItem.onclick = () => window.open(game.link, '_blank');
        topGamesListDiv.appendChild(gameItem);
    });
    topModal.style.display = 'block';
}

function closeTopModal() {
    document.getElementById('top-modal').style.display = 'none';
}

function editProfile() {
    document.getElementById('profile-modal').style.display = 'block';
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

function copyIP(ip) {
    navigator.clipboard.writeText(ip).then(() => alert(`IP ${ip} скопирован!`));
}

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('header button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`header button[onclick="switchSection('${sectionId}')"]`).classList.add('active');
}

function updateProfileTime() {
    const now = new Date();
    const timeElement = document.queryId('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Paris' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    switchSection('home');
    renderGames();
    updateProfileTime();
    setInterval(updateProfileTime, 60000); // Обновление времени каждую минуту
});
