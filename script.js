const feedContainer = document.getElementById('feed-container');
const fetchBtn = document.getElementById('fetch-btn');
const breedSelect = document.getElementById('breed-select');

// 1. Автоматическая загрузка списка всех пород в сайдбар при старте
fetch('https://api.thecatapi.com/v1/breeds')
    .then(response => response.json())
    .then(breeds => {
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    })
    .catch(err => console.error('Fout bij laden van rassen:', err));

// 2. Функция генерации карточки кота в ленту
async function getRandomCat() { 
    try { 
        let url = 'https://api.thecatapi.com/v1/images/search';
        
        // Если в сайдбаре выбрали конкретную породу, запрашиваем её
        if (breedSelect.value) {
            url += `?breed_ids=${breedSelect.value}`;
        }

        const response = await fetch(url); 
        const data = await response.json(); 
        const catUrl = data[0].url; 

        // Создаем контейнер-карточку
        const card = document.createElement('div');
        card.className = 'cat-card';

        // Наполняем картинкой и кнопками
        card.innerHTML = `
            <img src="${catUrl}" id="cat-image" alt="Kat">
            <div class="actions">
                <button class="action-btn" onclick="this.innerText = '❤️ Like (1)'">❤️ Like</button>
                <button class="action-btn" onclick="this.style.backgroundColor = '#ffb6c1'; this.style.color = 'white'">⭐ Favorite</button>
            </div>
        `;

        // Кидаем карточку в ленту
        feedContainer.appendChild(card);

    } catch (error) {
        console.error('Fout bij het ophalen van de kat:', error);
    }
}

// Вешаем события на клик и на выбор породы
fetchBtn.addEventListener('click', getRandomCat); 
breedSelect.addEventListener('change', getRandomCat);

// Запускаем первого котика при загрузке
getRandomCat();

// 1. Функция, которая сохраняет картинку и сразу рисует её в папке
function saveToFavorites(url) {
    let cats = JSON.parse(localStorage.getItem('myCats')) || [];
    if (!cats.includes(url)) cats.push(url); // чтобы не дублировались
    localStorage.setItem('myCats', JSON.stringify(cats));
    showFavorites();
}

// 2. Функция, которая берёт фотки из памяти и выводит как в Инсте (плиткой)
function showFavorites() {
    const folder = document.getElementById('fav-folder');
    if (!folder) return;
    
    let cats = JSON.parse(localStorage.getItem('myCats')) || [];
    folder.innerHTML = '<h4>📁 Mijn Favorieten</h4>';
    
    if (cats.length === 0) {
        folder.innerHTML += '<p style="font-size: 12px; color: #666;">Je hebt nog geen katten opgeslagen... 🐾</p>';
    } else {
        cats.forEach(url => {
            folder.innerHTML += `<img src="${url}" style="width:80px; height:80px; object-fit:cover; margin:5px; border-radius:4px;">`;
        });
    }
}

// 3. Перехватываем клик по кнопке Favorite без изменения твоего старого кода
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('action-btn') && e.target.textContent.includes('Favorite')) {
        const card = e.target.closest('.cat-card');
        const img = card.querySelector('img');
        if (img) saveToFavorites(img.src);
    }
});

// 4. Показываем сохранённое сразу при загрузке страницы
showFavorites();

