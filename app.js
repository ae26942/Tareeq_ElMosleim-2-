// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker registration failed', err));
    });
}

// قائمة ببيانات الأقسام مع الألوان والأيقونات
const sections = [
    {
        name: 'أذكار الصباح',
        color: 'green',
        icon: '☀️', // أيقونة شمس
        id: 'azkar-sabah',
        hasCounter: true // هذا القسم لديه عداد
    },
    {
        name: 'أذكار المساء',
        color: 'blue',
        icon: '🌙', // أيقونة قمر
        id: 'azkar-masaa',
        hasCounter: true
    },
    {
        name: 'أذكار النوم',
        color: 'yellow',
        icon: '😴', // أيقونة نوم
        id: 'azkar-noom',
        hasCounter: true
    },
    {
        name: 'أذكار الاستيقاظ',
        color: 'purple',
        icon: '🌅', // أيقونة شروق
        id: 'azkar-estikaaz',
        hasCounter: true
    },
    {
        name: 'أذكار الهم والحزن',
        color: 'brown',
        icon: '😔', // أيقونة حزن
        id: 'azkar-ham',
        hasCounter: true
    },
    {
        name: 'أذكار التوبة',
        color: 'grey',
        icon: '🤲', // أيقونة دعاء
        id: 'azkar-tawba',
        hasCounter: true
    },
    {
        name: 'مواقيت الصلاة',
        color: 'orange',
        icon: '🕌', // أيقونة مسجد
        id: 'prayer-times',
        hasCounter: false // هذا القسم ليس لديه عداد
    }
];

// دالة لإخفاء شاشة الترحيب وعرض التطبيق
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

// دالة لإنشاء بطاقات الأقسام ديناميكيا وإضافتها للصفحة
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

// دالة لإنشاء صفحة قسم الأذكار بالعداد
function createAzkarPage(sectionName, sectionColor) {
    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = ''; // مسح المحتوى القديم

    const backButton = document.createElement('button');
    backButton.textContent = 'رجوع';
    backButton.style.padding = '10px';
    backButton.style.margin = '10px';
    backButton.style.cursor = 'pointer';
    backButton.onclick = () => window.location.reload(); // طريقة بسيطة للعودة للصفحة الرئيسية

    const title = document.createElement('h2');
    title.textContent = sectionName;
    title.style.textAlign = 'center';
    title.style.color = sectionColor;

    const counterDisplay = document.createElement('div');
    counterDisplay.id = 'counter-display';
    counterDisplay.textContent = '0';
    counterDisplay.style.fontSize = '4em';
    counterDisplay.style.textAlign = 'center';
    counterDisplay.style.marginTop = '50px';

    const counterButton = document.createElement('button');
    counterButton.id = 'counter-button';
    counterButton.textContent = 'تسبيح';
    counterButton.style.width = '150px';
    counterButton.style.height = '150px';
    counterButton.style.borderRadius = '50%';
    counterButton.style.fontSize = '1.5em';
    counterButton.style.backgroundColor = sectionColor;
    counterButton.style.color = 'white';
    counterButton.style.border = 'none';
    counterButton.style.cursor = 'pointer';
    counterButton.style.marginTop = '20px';

    let count = 0;
    counterButton.onclick = () => {
        count++;
        counterDisplay.textContent = count;
    };

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    container.appendChild(backButton);
    container.appendChild(title);
    container.appendChild(counterDisplay);
    container.appendChild(counterButton);
    mainApp.appendChild(container);
}

// دالة لجلب مواقيت الصلاة
function fetchPrayerTimes(latitude, longitude) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const date = `${day}-${month}-${year}`;

    const url = `https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt`; // API call is simplified for this example
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const prayerTimes = data.data.timings;
            createPrayerTimesPage(prayerTimes);
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
            const mainApp = document.getElementById('main-app');
            mainApp.innerHTML = `<p>حدث خطأ أثناء جلب مواقيت الصلاة. برجاء المحاولة لاحقاً.</p>`;
        });
}

// دالة لإنشاء صفحة مواقيت الصلاة
function createPrayerTimesPage(timings) {
    const mainApp = document.getElementById('main-app');
    mainApp.innerHTML = ''; // مسح المحتوى القديم

    const backButton = document.createElement('button');
    backButton.textContent = 'رجوع';
    backButton.style.padding = '10px';
    backButton.style.margin = '10px';
    backButton.style.cursor = 'pointer';
    backButton.onclick = () => window.location.reload();

    const title = document.createElement('h2');
    title.textContent = 'مواقيت الصلاة';
    title.style.textAlign = 'center';
    title.style.color = '#FF9800';

    const timingsList = document.createElement('ul');
    timingsList.style.listStyle = 'none';
    timingsList.style.padding = '0';
    timingsList.style.textAlign = 'center';

    for (const prayer in timings) {
        if (typeof timings[prayer] === 'string') {
            const listItem = document.createElement('li');
            listItem.textContent = `${prayer}: ${timings[prayer]}`;
            listItem.style.padding = '8px';
            timingsList.appendChild(listItem);
        }
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    container.appendChild(backButton);
    container.appendChild(title);
    container.appendChild(timingsList);
    mainApp.appendChild(container);
}

// إضافة وظيفة النقر على البطاقات
function setupCardClicks() {
    document.addEventListener('click', (event) => {
        const card = event.target.closest('.section-card');
        if (card) {
            const section = sections.find(s => s.id === card.id);
            if (section && section.hasCounter) {
                createAzkarPage(section.name, `var(--${section.color}-color)`);
            } else if (section && section.id === 'prayer-times') {
                if (navigator.geolocation) {
                    const mainApp = document.getElementById('main-app');
                    mainApp.innerHTML = `<p style="text-align: center; margin-top: 50px;">يتم الآن جلب مواقيت الصلاة...</p>`;
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        fetchPrayerTimes(latitude, longitude);
                    }, error => {
                        console.error('Geolocation Error:', error);
                        const mainApp = document.getElementById('main-app');
                        mainApp.innerHTML = `<p style="text-align: center; margin-top: 50px;">لم يتمكن التطبيق من الوصول إلى موقعك. تأكد من تفعيل خدمة الموقع.</p>`;
                    });
                } else {
                    alert('المتصفح لا يدعم تحديد الموقع الجغرافي.');
                }
            }
        }
    });
}

// عند تحميل الصفحة بالكامل، شغل الدوال
document.addEventListener('DOMContentLoaded', () => {
    hideWelcomeScreen();
    renderSections();
    setupCardClicks();
});
