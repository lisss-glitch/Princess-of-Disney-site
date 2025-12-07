document.addEventListener("DOMContentLoaded", function() {
    // ========== Меню бургер ==========
    const burger = document.getElementById("burgerMenu");
    const mobileMenu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("menuOverlay");
    const body = document.body;
    const menuClose = document.getElementById("menuClose");

    function toggleMenu() {
        burger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        overlay.classList.toggle("active");
        body.classList.toggle("no-scroll");
    }

    if (burger) burger.addEventListener("click", toggleMenu);
    if (overlay) overlay.addEventListener("click", toggleMenu);
    if (menuClose) menuClose.addEventListener("click", toggleMenu);

    document.querySelectorAll("#mobileMenu a").forEach(link => {
        link.addEventListener("click", toggleMenu);
    });

    // ========== Уведомления ==========
    const notificationIcon = document.getElementById('notificationIcon');
    const desktopNotificationDropdown = document.getElementById('notificationDropdown');
    const mobileNotificationDropdown = document.getElementById('mobileNotificationDropdown');
    const mobileNotificationClose = document.getElementById('mobileNotificationClose');
    const viewAllButton = document.getElementById('viewAllNotifications');
    const mobileViewAllButton = document.getElementById('mobileViewAllNotifications');

    // Проверяем, мобильное ли устройство
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Переключение уведомлений при клике на иконку
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isMobile()) {
                // На мобильных - открываем мобильные уведомления снизу
                mobileNotificationDropdown.classList.toggle('active');
                body.classList.toggle('no-scroll');
                
                // Закрываем десктопные уведомления если открыты
                if (desktopNotificationDropdown) {
                    desktopNotificationDropdown.classList.remove('active');
                }
            } else {
                // На десктопе - открываем десктопные уведомления
                if (desktopNotificationDropdown) {
                    desktopNotificationDropdown.classList.toggle('active');
                }
                
                // Закрываем мобильные уведомления если открыты
                mobileNotificationDropdown.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // Закрытие мобильных уведомлений по кнопке закрытия
    if (mobileNotificationClose) {
        mobileNotificationClose.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNotificationDropdown.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    }

    // Закрытие при клике вне уведомлений
    document.addEventListener('click', function(e) {
        // Закрываем десктопные уведомления
        if (desktopNotificationDropdown && desktopNotificationDropdown.classList.contains('active')) {
            if (notificationIcon && !notificationIcon.contains(e.target) && 
                !desktopNotificationDropdown.contains(e.target)) {
                desktopNotificationDropdown.classList.remove('active');
            }
        }
        
        // Закрываем мобильные уведомления
        if (mobileNotificationDropdown && mobileNotificationDropdown.classList.contains('active')) {
            if (notificationIcon && !notificationIcon.contains(e.target) && 
                !mobileNotificationDropdown.contains(e.target)) {
                mobileNotificationDropdown.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        }
    });

    // Обработчик для кнопки "Посмотреть все" в десктопных уведомлениях
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (desktopNotificationDropdown) {
                desktopNotificationDropdown.classList.remove('active');
            }
            
            // Отмечаем все уведомления как прочитанные
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Обновляем бейдж
            updateNotificationBadge();
        });
    }

    // Обработчик для кнопки "Посмотреть все" в мобильных уведомлениях
    if (mobileViewAllButton) {
        mobileViewAllButton.addEventListener('click', function(e) {
            e.preventDefault();
            mobileNotificationDropdown.classList.remove('active');
            body.classList.remove('no-scroll');
            
            // Отмечаем все уведомления как прочитанные
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Обновляем бейдж
            updateNotificationBadge();
        });
    }

    // Отметка прочитанных уведомлений
    const notificationItems = document.querySelectorAll('.notification-item.unread');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            updateNotificationBadge();
        });
    });

    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badges = document.querySelectorAll('.notification-badge');
        const notificationCounts = document.querySelectorAll('.notification-count');
        
        // Обновляем бейджи
        badges.forEach(badge => {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
        
        // Обновляем счетчики в заголовках уведомлений
        notificationCounts.forEach(count => {
            if (unreadCount > 0) {
                count.textContent = unreadCount + ' новых';
                count.style.display = 'block';
            } else {
                count.style.display = 'none';
            }
        });
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        // При изменении размера окна закрываем все уведомления
        if (desktopNotificationDropdown) {
            desktopNotificationDropdown.classList.remove('active');
        }
        mobileNotificationDropdown.classList.remove('active');
        body.classList.remove('no-scroll');
        
        // Скрываем мобильное меню если открыто
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            burger.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Закрываем меню и уведомления на мобильных
                    if (isMobile()) {
                        burger.classList.remove("active");
                        mobileMenu.classList.remove("active");
                        overlay.classList.remove("active");
                        mobileNotificationDropdown.classList.remove("active");
                        body.classList.remove("no-scroll");
                    }
                }
            }
        });
    });

    // Подсветка активного раздела при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = document.querySelectorAll('#mainNav a[href^="#"]');

    function highlightActiveSection() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // Обработка отправки формы
    const form = document.querySelector('.disney-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо! Ваша форма отправлена. Мы свяжемся с вами в ближайшее время!');
            form.reset();
        });
    }

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за секциями для анимации
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Анимация счетчиков статистики
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(function() {
                        current += step;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        statNumber.textContent = Math.floor(current);
                    }, 16);
                    
                    statsObserver.unobserve(statNumber);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // Добавление падающих звезд
    function createFallingStar() {
        const star = document.createElement('div');
        star.className = 'falling-star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.querySelector('.welcome').appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 5000);
    }
    
    // Создаем несколько звезд при загрузке
    for (let i = 0; i < 5; i++) {
        setTimeout(createFallingStar, i * 1000);
    }
    
    // Продолжаем создавать звезды каждые 3 секунды
    setInterval(createFallingStar, 3000);

    // Показ и скрытие кнопки прокрутки вверх
    window.addEventListener("scroll", () => {
        const btn = document.getElementById("scrollTopBtn");
        if (window.scrollY > 400) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });

    // Прокрутка вверх
    document.getElementById("scrollTopBtn").onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
});