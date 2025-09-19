let currentPage = 1;
let modsPerPage = 6;
let currentFilter = { version: 'all', theme: 'all', loader: 'all', sort: 'popular' };
let allMods = [
    { id: 1, title: "Villager Cleric House", desc: "Дом священника с лутом.", versions: "1.21.8,1.21.4,1.21.1,1.20.1,1.16.5", rating: "★★★★★", theme: "adventure", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6e6e6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/villager-houses" },
    { id: 2, title: "A Man With Plushies", desc: "Плюшики из других игр.", versions: "1.21.8,1.21.1,1.20.6,1.19.4,1.18.2", rating: "★★★★☆", theme: "decor", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/plushies" },
    { id: 3, title: "Incapacitated", desc: "Система воскрешения.", versions: "1.21.8,1.21.1,1.20.4,1.19.4", rating: "★★★★★", theme: "adventure", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/incapacitated" },
    { id: 4, title: "Apple Crates", desc: "Ящики для хранения.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "furniture", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/apple-crates" },
    { id: 5, title: "Nature's Delight", desc: "Совместимость с Nature's Spirit.", versions: "1.21.1,1.20.1", rating: "★★★★★", theme: "decor", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/natures-delight" },
    { id: 6, title: "Simple Conveyor Belts", desc: "Гибкие конвейерные ленты.", versions: "1.21.1", rating: "★★★★☆", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/conveyor-belts" },
    { id: 7, title: "Dive in", desc: "Анимация прыжка в воду.", versions: "1.21.1", rating: "★★★★★", theme: "adventure", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/dive-in" },
    { id: 8, title: "Country Road Creature", desc: "Криповый гуманоид.", versions: "1.20.1,1.19.4,1.19.2", rating: "★★★★☆", theme: "mobs", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/country-road" },
    { id: 9, title: "Villager Pagoda House", desc: "Пагода в черешневом биоме.", versions: "1.21.8,1.21.4,1.21.1,1.20.1", rating: "★★★★★", theme: "adventure", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/pagoda-houses" },
    { id: 10, title: "Brightness Plus", desc: "Настраиваемая яркость.", versions: "1.21.4,1.21.3,1.21.2,1.21.1,1.21", rating: "★★★★☆", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/brightness-plus" },
    { id: 11, title: "OptiFine", desc: "Улучшение графики.", versions: "1.21.1", rating: "★★★★★", theme: "tech", loader: "optifine", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://optifine.net" },
    { id: 12, title: "JourneyMap", desc: "Карта мира.", versions: "1.20.1", rating: "★★★★★", theme: "maps", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/journeymap" },
    { id: 13, title: "Sodium", desc: "Повышение FPS.", versions: "1.21.1,1.20.1", rating: "★★★★★", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/sodium" },
    { id: 14, title: "Iris Shaders", desc: "Поддержка шейдеров.", versions: "1.21.1", rating: "★★★★☆", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/iris-shaders" },
    { id: 15, title: "Fabric API", desc: "Библиотека для модов.", versions: "1.21.1,1.20.1", rating: "★★★★★", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/fabric-api" }
];

const topModsList = [
    { title: "1. OptiFine - Улучшение FPS", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://optifine.net" },
    { title: "2. JourneyMap - Карта мира", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/journeymap" },
    { title: "3. Sodium - Производительность", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/sodium" },
    { title: "4. Iris - Шейдеры", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7е0d0е6f8е8е6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/iris-shaders" },
    { title: "5. Fabric API - Библиотека", img: "https://vgtimes.ru/upload/iblock/1а8/1а8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/fabric-api" },
    { title: "6. Villager Cleric House - Дом священника", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/villager-houses" }
];

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId + '-section').classList.add('active');
    if (sectionId === 'mods') {
        renderMods();
    } else if (sectionId === 'home') {
        document.querySelector('header button').classList.add('active');
    }
    document.querySelectorAll('header button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`header button[onclick="switchSection('${sectionId}')"]`).classList.add('active');
}

function renderMods() {
    const modGrid = document.getElementById('mod-grid');
    modGrid.innerHTML = '';
    let filteredMods = allMods.filter(mod => {
        const versionMatch = currentFilter.version === 'all' || mod.versions.includes(currentFilter.version);
        const themeMatch = currentFilter.theme === 'all' || mod.theme === currentFilter.theme;
        const loaderMatch = currentFilter.loader === 'all' || mod.loader === currentFilter.loader;
        const searchMatch = currentFilter.search ? mod.title.toLowerCase().includes(currentFilter.search.toLowerCase()) : true;
        return versionMatch && themeMatch && loaderMatch && searchMatch;
    });

    if (currentFilter.sort === 'new') {
        filteredMods.sort((a, b) => {
            const versionsA = a.versions.split(',').map(v => v.trim());
            const versionsB = b.versions.split(',').map(v => v.trim());
            return versionsB[0].localeCompare(versionsA[0]);
        });
    } else {
        filteredMods.sort((a, b) => {
            const ratingA = a.rating.split('★').length - 1;
            const ratingB = b.rating.split('★').length - 1;
            return ratingB - ratingA;
        });
    }

    const start = (currentPage - 1) * modsPerPage;
    const end = start + modsPerPage;
    const paginatedMods = filteredMods.slice(start, end);

    paginatedMods.forEach(mod => {
        const modCard = document.createElement('div');
        modCard.className = 'mod-card';
        modCard.innerHTML = `
            <img src="${mod.img}" alt="${mod.title}" loading="lazy" onerror="this.src='https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6b/Plains_Water.png';">
            <div class="mod-title">${mod.title}</div>
            <div class="mod-desc">${mod.desc}</div>
            <div class="rating">${mod.rating}</div>
        `;
        modCard.onclick = () => showDetails(mod);
        modGrid.appendChild(modCard);
    });

    document.getElementById('page-info').textContent = `Страница ${currentPage}`;
    document.querySelector('.pagination button:first-child').disabled = currentPage === 1;
    document.querySelector('.pagination button:last-child').disabled = end >= filteredMods.length;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMods();
    }
}

function nextPage() {
    const totalPages = Math.ceil(allMods.length / modsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderMods();
    }
}

function filterVersions(version) {
    currentFilter.version = version;
    currentPage = 1;
    document.querySelectorAll('.version-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.version-filters .filter-btn[onclick="filterVersions('${version}')"]`).classList.add('active');
    renderMods();
}

function filterThemes(theme) {
    currentFilter.theme = theme;
    currentPage = 1;
    document.querySelectorAll('.theme-filters .theme-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.theme-filters .theme-btn[onclick="filterThemes('${theme}')"]`).classList.add('active');
    renderMods();
}

function filterLoaders(loader) {
    currentFilter.loader = loader;
    currentPage = 1;
    document.querySelectorAll('.loader-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.loader-filters .filter-btn[onclick="filterLoaders('${loader}')"]`).classList.add('active');
    renderMods();
}

function sortMods(sort) {
    currentFilter.sort = sort;
    currentPage = 1;
    document.querySelectorAll('.sort-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.sort-filters .filter-btn[onclick="sortMods('${sort}')"]`).classList.add('active');
    renderMods();
}

function filterMods() {
    currentFilter.search = document.getElementById('search').value;
    currentPage = 1;
    renderMods();
}

function showDetails(mod) {
    document.getElementById('mod-title').textContent = mod.title;
    document.getElementById('mod-img').src = mod.img;
    document.getElementById('mod-desc').textContent = mod.desc;
    document.getElementById('mod-versions').textContent = `Версии: ${mod.versions}`;
    document.getElementById('mod-rating').innerHTML = `Рейтинг: ${mod.rating}`;
    switchSection('details');
}

function backToList() {
    switchSection('mods');
}

function showInstallGuide() {
    document.getElementById('install-modal').style.display = 'block';
}

function closeInstallGuide() {
    document.getElementById('install-modal').style.display = 'none';
}

function showTopMods() {
    const topModal = document.getElementById('top-modal');
    const topModsListDiv = document.getElementById('top-mods-list');
    topModsListDiv.innerHTML = '';
    topModsList.forEach(mod => {
        const modItem = document.createElement('div');
        modItem.className = 'top-mod-item';
        modItem.innerHTML = `
            <img src="${mod.img}" alt="${mod.title}" loading="lazy" onerror="this.src='https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6b/Plains_Water.png';">
            <p>${mod.title}</p>
        `;
        modItem.onclick = () => window.open(mod.link, '_blank');
        topModsListDiv.appendChild(modItem);
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

document.addEventListener('DOMContentLoaded', () => {
    switchSection('home');
    renderMods();
});
