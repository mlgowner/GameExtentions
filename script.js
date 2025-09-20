// Данные режимов FNAF (30+ вымышленных, на основе типичных max-модов)
const allModes = [
    { id: 1, title: "FNAF 1 Max Mode", desc: "Выживи 20/20/20/20 в первой ночи.", points: 100, difficulty: "max", img: "https://via.placeholder.com/300x150/ff0000/000?text=FNAF1", status: false, video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "FNAF 2 Max Mode", desc: "Все аниматроники на максимуме.", points: 150, difficulty: "max", img: "https://via.placeholder.com/300x150/ff6600/000?text=FNAF2", status: false, video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    // Добавьте остальные 28 режимов аналогично, с разными очками (10-1000), сложностями (easy-hard-max)
    // Для примера, сокращу до 5; в реале расширьте
    { id: 3, title: "FNAF 3 Max Mode", desc: "Хэллоуин-аниматроники.", points: 200, difficulty: "hard", img: "https://via.placeholder.com/300x150/00ff00/000?text=FNAF3", status: false, video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, title: "FNAF 4 Max Mode", desc: "Ночные кошмары на 5+.", points: 250, difficulty: "max", img: "https://via.placeholder.com/300x150/0000ff/000?text=FNAF4", status: false, video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 5, title: "Sister Location Max Mode", desc: "Кукла-аниматроник.", points: 300, difficulty: "hard", img: "https://via.placeholder.com/300x150/ff00ff/000?text=SL", status: false, video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    // ... (добавьте полный список до 50)
];

let currentPage = 1;
let modesPerPage = 6;
let currentFilter = { difficulty: 'all', search: '' };
let userData = JSON.parse(localStorage.getItem('fnafUser')) || { name: 'Player', points: 0, completions: 0, modes: {} };

function renderModes() {
    const grid = document.getElementById('modes-grid');
    grid.innerHTML = '';

    let filtered = allModes.filter(mode => {
        if (currentFilter.difficulty !== 'all' && mode.difficulty !== currentFilter.difficulty) return false;
        if (currentFilter.search && !mode.title.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
        return true;
    });

    const start = (currentPage - 1) * modesPerPage;
    const end = start + modesPerPage;
    filtered.slice(start, end).forEach(mode => {
        const card = document.createElement('div');
        card.className = 'mode-card';
        card.onclick = () => showModeDetails(mode);
        card.innerHTML = `
            <img src="${mode.img}" alt="${mode.title}">
            <h4>${mode.title}</h4>
            <p>${mode.desc}</p>
            <div class="points">${mode.points} очков</div>
            <button class="complete-btn ${userData.modes[mode.id] ? 'completed' : ''}" onclick="event.stopPropagation(); completeMode(${mode.id})">
                ${userData.modes[mode.id] ? 'Пройдено!' : 'Пройти'}
            </button>
        `;
        grid.appendChild(card);
    });

    updatePagination(filtered.length);
    updateUserProgress();
}

function updatePagination(total) {
    const pag = document.getElementById('pagination');
    pag.innerHTML = '';
    const pages = Math.ceil(total / modesPerPage);
    if (currentPage > 1) {
        const prev = document.createElement('button');
        prev.textContent = '←';
        prev.onclick = () => { currentPage--; renderModes(); };
        pag.appendChild(prev);
    }
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = currentPage === i ? 'active' : '';
        btn.onclick = () => { currentPage = i; renderModes(); };
        pag.appendChild(btn);
    }
    if (currentPage < pages) {
        const next = document.createElement('button');
        next.textContent = '→';
        next.onclick = () => { currentPage++; renderModes(); };
        pag.appendChild(next);
    }
}

function filterModes() {
    currentFilter.search = document.getElementById('search').value;
    currentFilter.difficulty = document.getElementById('difficulty-filter').value;
    currentPage = 1;
    renderModes();
}

function completeMode(id) {
    if (!userData.modes[id]) {
        userData.modes[id] = true;
        userData.points += allModes.find(m => m.id === id).points;
        userData.completions++;
        localStorage.setItem('fnafUser', JSON.stringify(userData));
        renderModes();
        updateLeaderboard();
        alert('Режим пройден! +Очки добавлены.');
    }
}

function showModeDetails(mode) {
    document.getElementById('mode-title').textContent = mode.title;
    document.getElementById('mode-desc').textContent = mode.desc;
    document.getElementById('mode-points').textContent = `Очки: ${mode.points}`;
    document.getElementById('mode-img').src = mode.img;
    document.getElementById('mode-video').src = mode.video;
    document.getElementById('complete-btn').onclick = () => completeMode(mode.id);
    document.getElementById('complete-btn').className = `action-btn ${userData.modes[mode.id] ? 'completed' : ''}`;
    document.getElementById('complete-btn').textContent = userData.modes[mode.id] ? 'Пройдено!' : 'Пройти режим';
    showModal('details-modal');
}

function updateUserProgress() {
    document.getElementById('user-points').textContent = userData.points;
    const totalModes = allModes.length;
    const percent = (userData.completions / totalModes * 100).toFixed(1);
    document.getElementById('user-completions').textContent = `${userData.completions}/${totalModes}`;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.querySelector('.progress-bar span').textContent = `Прогресс: ${percent}%`;
}

function updateLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    // Симуляция лидерборда (в реале — API)
    const fakeUsers = [
        { name: 'ProFreddy', points: 4500, percent: 95 },
        { name: 'MaxChica', points: 4200, percent: 90 },
        { name: 'user', points: userData.points, percent: (userData.completions / allModes.length * 100).toFixed(1) }
    ];
    fakeUsers.sort((a, b) => b.points - a.points);
    fakeUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${user.name}</td><td>${user.points}</td><td>${user.percent}%</td>`;
        tbody.appendChild(row);
    });
}

function addPost() {
    const content = document.getElementById('post-content').value;
    if (content) {
        const posts = document.getElementById('forum-posts');
        const post = document.createElement('div');
        post.className = 'forum-post';
        post.innerHTML = `
            <img src="https://via.placeholder.com/50/ff0000/fff?text=U" alt="User">
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
    localStorage.setItem('fnafUser', JSON.stringify(userData));
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

// Particle system для фона (удивление!)
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
            color: `hsl(${Math.random() * 60 + 0}, 100%, 50%)` // Красные оттенки FNAF
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

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
    switchSection('home');
    renderModes();
    updateLeaderboard();
    updateUserProgress();
    updateProfileTime();
    setInterval(updateProfileTime, 60000);
    initParticles();
});
