let currentPage = 1;
let modsPerPage = 6;
let currentFilter = { version: 'all', theme: 'all', loader: 'all', sort: 'popular' };
let allMods = [
    { id: 1, title: "Villager Cleric House", desc: "Дом священника с лутом.", versions: "1.21.8,1.21.4,1.21.1,1.20.1,1.16.5", rating: "★★★★★", theme: "adventure", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6e6e6e6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/villager-houses" },
    { id: 2, title: "A Man With Plushies", desc: "Плюшики из других игр.", versions: "1.21.8,1.21.1,1.20.6,1.19.4,1.18.2", rating: "★★★★☆", theme: "decor", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/1a8/1a8a1a8a1a8a1a8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/plushies" },
    { id: 3, title: "Incapacitated", desc: "Система воскрешения.", versions: "1.21.8,1.21.1,1.20.4,1.19.4", rating: "★★★★★", theme: "adventure", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9f9f9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/incapacitated" },
    { id: 4, title: "Apple Crates", desc: "Ящики для хранения.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "furniture", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/apple-crates" },
    { id: 5, title: "Nature's Delight", desc: "Совместимость с Nature's Spirit.", versions: "1.21.1,1.20.1", rating: "★★★★★", theme: "decor", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/natures-delight" },
    { id: 6, title: "Simple Conveyor Belts", desc: "Гибкие конвейерные ленты.", versions: "1.21.1", rating: "★★★★☆", theme: "tech", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/conveyor-belts" },
    { id: 7, title: "Dive in", desc: "Анимация прыжка в воду.", versions: "1.21.1", rating: "★★★★★", theme: "adventure", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/dive-in" },
    { id: 8, title: "Hexerei", desc: "Магия и ведьмовство.", versions: "1.21.1,1.20.1,1.19.2", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/hexerei" },
    { id: 9, title: "Create", desc: "Машины и автоматизация.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/create" },
    { id: 10, title: "BetterEnd", desc: "Улучшенный Энд.", versions: "1.21.1,1.20.1,1.19.2", rating: "★★★★☆", theme: "dimension", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/betterend" },
    { id: 11, title: "BetterNether", desc: "Улучшенный Нижний мир.", versions: "1.21.1,1.20.1,1.19.2", rating: "★★★★★", theme: "dimension", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/betternether" },
    { id: 12, title: "Origins", desc: "Выбор происхождения с способностями.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "rpg", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/origins" },
    { id: 13, title: "Farmer's Delight", desc: "Новые блюда и фермерство.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "food", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/farmers-delight" },
    { id: 14, title: "Alex's Mobs", desc: "Новые мобы.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "mobs", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/alexs-mobs" },
    { id: 15, title: "TerraFirmaCraft", desc: "Реалистичное выживание.", versions: "1.20.1,1.18.2", rating: "★★★★★", theme: "overhaul", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/terrafirmacraft" },
    { id: 16, title: "Immersive Engineering", desc: "Инженерия в стиле ретро.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/immersive-engineering" },
    { id: 17, title: "Pam's HarvestCraft 2", desc: "Расширенное фермерство и еда.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "food", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/pams-harvestcraft-2" },
    { id: 18, title: "Biomes O' Plenty", desc: "Новые биомы.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "worldgen", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/biomes-o-plenty" },
    { id: 19, title: "Tinkers' Construct", desc: "Кастомные инструменты.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "tools", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/tinkers-construct" },
    { id: 20, title: "Ars Nouveau", desc: "Магическая система.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/ars-nouveau" },
    { id: 21, title: "Mekanism", desc: "Продвинутая техника.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/mekanism" },
    { id: 22, title: "Botania", desc: "Магические растения.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/botania" },
    { id: 23, title: "Twilight Forest", desc: "Новое измерение.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "dimension", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/the-twilight-forest" },
    { id: 24, title: "Astral Sorcery", desc: "Астрономия и магия.", versions: "1.16.5", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/astral-sorcery" },
    { id: 25, title: "Mystical Agriculture", desc: "Фермерство ресурсов.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "farming", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/mystical-agriculture" },
    { id: 26, title: "Applied Energistics 2", desc: "Хранение и автоматизация.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/applied-energistics-2" },
    { id: 27, title: "Ender IO", desc: "Машины и трубы.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/ender-io" },
    { id: 28, title: "RFTools", desc: "Утилиты для RF.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/rftools" },
    { id: 29, title: "EvilCraft", desc: "Темная магия.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/evilcraft" },
    { id: 30, title: "Blood Magic", desc: "Магия крови.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/blood-magic" },
    { id: 31, title: "Thaumcraft", desc: "Тауматургия.", versions: "1.12.2", rating: "★★★★★", theme: "magic", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/thaumcraft" },
    { id: 32, title: "Industrial Foregoing", desc: "Индустриальные машины.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/industrial-foregoing" },
    { id: 33, title: "Refined Storage", desc: "Хранение предметов.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/refined-storage" },
    { id: 34, title: "Pam's HarvestCraft", desc: "Еда и фермерство.", versions: "1.12.2", rating: "★★★★★", theme: "food", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/pams-harvestcraft" },
    { id: 35, title: "Thermal Expansion", desc: "Тепловая техника.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "tech", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/thermal-expansion" },
    { id: 36, title: "Draconic Evolution", desc: "Драконья эволюция.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "endgame", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/draconic-evolution" },
    { id: 37, title: "Aether", desc: "Новое небесное измерение.", versions: "1.20.1,1.19.2", rating: "★★★★★", theme: "dimension", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/aether" },
    { id: 38, title: "Tectonic", desc: "Улучшенная генерация мира.", versions: "1.21.1,1.20.1", rating: "★★★★☆", theme: "worldgen", loader: "fabric", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/tectonic" },
    { id: 39, title: "Cyclic", desc: "Много полезных блоков.", versions: "1.21.1,1.20.1,1.19.2", rating: "★★★★★", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/cyclic" },
    { id: 40, title: "Chisel", desc: "Декоративные блоки.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "decor", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/chisel" },
    { id: 41, title: "Chisels & Bits", desc: "Микроблоки.", versions: "1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "decor", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/chisels-bits" },
    { id: 42, title: "Iron Chests", desc: "Улучшенные сундуки.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "storage", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/iron-chests" },
    { id: 43, title: "Storage Drawers", desc: "Ящики для хранения.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "storage", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/storage-drawers" },
    { id: 44, title: "Quark", desc: "Множество улучшений.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/quark" },
    { id: 45, title: "Nature's Compass", desc: "Компас биомов.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/natures-compass" },
    { id: 46, title: "Waystones", desc: "Телепортация с вейстоунами.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/waystones" },
    { id: 47, title: "Clumps", desc: "Группировка опыта.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "performance", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/clumps" },
    { id: 48, title: "Mouse Tweaks", desc: "Улучшенное перетаскивание.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/9f9/9f9ф9ф9ф9ф9/minecraft-1-20-4-snapshot-23w40а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/mouse-tweaks" },
    { id: 49, title: "JourneyMap", desc: "Карта мира.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★★", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/6b1/6b1b5e6b8e25b7e0d0e6f8e8e6е6е6е6/minecraft-1-20-5-snapshot-23w45а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/journeymap" },
    { id: 50, title: "Just Enough Items", desc: "Просмотр рецептов.", versions: "1.21.1,1.20.1,1.19.2,1.18.2", rating: "★★★★☆", theme: "utility", loader: "forge", img: "https://vgtimes.ru/upload/iblock/1a8/1a8а1а8а1а8а1а8/minecraft-1-21-2-snapshot-24w18а-1.jpg", link: "https://www.curseforge.com/minecraft/mc-mods/jei" },
];

let topModsList = allMods.slice(0, 9); // Топ 9 модов

function renderMods() {
    const modGrid = document.getElementById('mod-grid');
    modGrid.innerHTML = '';

    let filteredMods = allMods.filter(mod => {
        if (currentFilter.version !== 'all' && !mod.versions.includes(currentFilter.version)) return false;
        if (currentFilter.theme !== 'all' && mod.theme !== currentFilter.theme) return false;
        if (currentFilter.loader !== 'all' && mod.loader !== currentFilter.loader) return false;
        if (currentFilter.search && !mod.title.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
        return true;
    });

    if (currentFilter.sort === 'new') {
        filteredMods.sort((a, b) => b.id - a.id);
    } else {
        filteredMods.sort((a, b) => allMods.indexOf(a) - allMods.indexOf(b));
    }

    const start = (currentPage - 1) * modsPerPage;
    const end = start + modsPerPage;
    filteredMods.slice(start, end).forEach(mod => {
        const modCard = document.createElement('div');
        modCard.className = 'mod-card';
        modCard.innerHTML = `
            <img src="${mod.img}" alt="${mod.title}" loading="lazy" onerror="this.src='https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6b/Plains_Water.png';">
            <p class="mod-title">${mod.title}</p>
            <p class="mod-desc">${mod.desc}</p>
            <p class="rating">${mod.rating}</p>
            <div class="action-buttons">
                <button class="action-btn" onclick="window.open('${mod.link}', '_blank')">Скачать</button>
                <button class="action-btn" onclick="showDetails(${JSON.stringify(mod)})">Детали</button>
            </div>
        `;
        modGrid.appendChild(modCard);
    });

    updatePagination(filteredMods.length);
}

function updatePagination(totalMods) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalMods / modsPerPage);
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Предыдущая';
        prevBtn.onclick = () => {
            currentPage--;
            renderMods();
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
            renderMods();
        };
        pagination.appendChild(nextBtn);
    }
}

function filterByVersion(version) {
    currentFilter.version = version;
    currentPage = 1;
    document.querySelectorAll('.version-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.version-filters .filter-btn[onclick="filterByVersion('${version}')"]`).classList.add('active');
    renderMods();
}

function filterByLoader(loader) {
    currentFilter.loader = loader;
    currentPage = 1;
    document.querySelectorAll('.loader-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.loader-filters .filter-btn[onclick="filterByLoader('${loader}')"]`).classList.add('active');
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

// Добавленные функции

// Функция для переключения секций (используется в showDetails)
function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Функция для обработки клика на "Скачать" (имитация загрузки)
function handleDownload(link) {
    window.open(link, '_blank');
    console.log(`Загрузка по ссылке: ${link}`);
}

// Функция для обновления времени в профиле
function updateProfileTime() {
    const now = new Date();
    const timeElement = document.querySelector('#profile-section .stats .stat:last-child p');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Paris' });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    switchSection('home');
    renderMods();
    updateProfileTime();
    setInterval(updateProfileTime, 60000); // Обновление времени каждую минуту

    // Привязка событий к кнопкам "Скачать" и "Детали"
    document.querySelectorAll('.mod-card').forEach(card => {
        card.querySelector('.action-btn:first-child').addEventListener('click', (e) => {
            e.stopPropagation();
            const link = card.dataset.link; // Предполагая, что link хранится в data-link
            handleDownload(link);
        });
    });
});
