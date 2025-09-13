const sections = [
    { name: 'أذكار الصباح', color: 'green', icon: '☀️', id: 'azkar-sabah', hasCounter: true },
    { name: 'أذكار المساء', color: 'blue', icon: '🌙', id: 'azkar-masaa', hasCounter: true },
    { name: 'أذكار النوم', color: 'yellow', icon: '😴', id: 'azkar-noom', hasCounter: true },
    { name: 'أذكار الاستيقاظ', color: 'purple', icon: '🌅', id: 'azkar-estikaaz', hasCounter: true },
    { name: 'أذكار الهم والحزن', color: 'brown', icon: '😔', id: 'azkar-ham', hasCounter: true },
    { name: 'أذكار التوبة', color: 'grey', icon: '🤲', id: 'azkar-tawba', hasCounter: true },
    { name: 'مواقيت الصلاة', color: 'orange', icon: '🕌', id: 'prayer-times', hasCounter: false }
];

function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainApp = document.getElementById('main-app');
    setTimeout(() => {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            mainApp.style.display = 'block';
        }, 1000);
    }, 2000);
}

function renderSections() {
    const sectionsContainer = document.querySelector('.sections-container');
    sections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.id = section.id;
        const iconDiv = document.createElement('div');
        iconDiv.className = `icon ${section.color}`;
        iconDiv.textContent = section.icon;
        const title = document.createElement('h3');
        title.textContent = section.name;
        card.appendChild(iconDiv);
        card.appendChild(title);
        sectionsContainer.appendChild(card);
    });
}

function createAzkarPage(section) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '';
    const backButton = document.createElement('button');
    backButton.textContent = 'رجوع';
    backButton.className = 'back-button';
    backButton.onclick = () => window.location.reload();
    const title = document.createElement('h2');
    title.textContent = section.name;
    title.style.textAlign = 'center';
    title.style.color = `var(--${section.color}-color)`;
    let count = 0;
    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'counter-display';
    counterDisplay.textContent = count;
    const counterButton = document.createElement('button');
    counterButton.id = 'counter-button';
    counterButton.textContent = 'تسبيح';
    counterButton.onclick = () => {
        count++;
        counterDisplay.textContent = count;
    };
    const container = document.createElement('div');
    container.className = 'section-page-content';
    container.appendChild(backButton);
    container.appendChild(title);
    container.appendChild(counterDisplay);
    container.appendChild(counterButton);
    contentContainer.appendChild(container);
}

function fetchPrayerTimes() {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '<p style="text-align: center;">يتم الآن جلب مواقيت الصلاة...</p>';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const today = new Date();
            const url = `https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    createPrayerTimesPage(data.data.timings);
                })
                .catch(error => {
                    contentContainer.innerHTML = `<p style="text-align: center;">حدث خطأ أثناء جلب المواقيت.</p>`;
                });
        }, error => {
            contentContainer.innerHTML = `<p style="text-align: center;">لم يتمكن التطبيق من الوصول إلى موقعك.</p>`;
        });
    } else {
        contentContainer.innerHTML = `<p style="text-align: center;">المتصفح لا يدعم تحديد الموقع الجغرافي.</p>`;
    }
}

function createPrayerTimesPage(timings) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '';
    const backButton = document.createElement('button');
    backButton.textContent = 'رجوع';
    backButton.className = 'back-button';
    backButton.onclick = () => window.location.reload();
    const title = document.createElement('h2');
    title.textContent = 'مواقيت الصلاة';
    title.style.textAlign = 'center';
    const timingsList = document.createElement('ul');
    timingsList.className = 'prayer-time-list';
    for (const prayer in timings) {
        if (typeof timings[prayer] === 'string' && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${prayer}: ${timings[prayer]}`;
            timingsList.appendChild(listItem);
        }
    }
    const container = document.createElement('div');
    container.className = 'section-page-content';
    container.appendChild(backButton);
    container.appendChild(title);
    container.appendChild(timingsList);
    contentContainer.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
    hideWelcomeScreen();
    renderSections();
    document.addEventListener('click', (event) => {
        const card = event.target.closest('.section-card');
        if (card) {
            const section = sections.find(s => s.id === card.id);
            if (section) {
                if (section.hasCounter) {
                    createAzkarPage(section);
                } else if (section.id === 'prayer-times') {
                    fetchPrayerTimes();
                }
            }
        }
    });
});
