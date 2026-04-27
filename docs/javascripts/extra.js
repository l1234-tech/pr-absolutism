/* Кастомный JavaScript для улучшения переходов и интерактивности */

document.addEventListener('DOMContentLoaded', function() {
    // Плавные переходы между страницами
    enhancePageTransitions();
    
    // Инициализация кликабельных блоков
    initClickableCards();
    
    // Улучшение навигации
    enhanceNavigation();
    
    // Добавление интерактивных эффектов
    addInteractiveEffects();
    
    // Обработка загрузки контента
    handleContentLoading();
});

/**
 * Улучшение переходов между страницами
 */
function enhancePageTransitions() {
    // Плавный переход при клике на ссылки
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.hash && !link.target && link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            
            // Добавляем анимацию перехода
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });
    
    // Восстанавливаем opacity после загрузки страницы
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
}

/**
 * Инициализация кликабельных блоков
 */
function initClickableCards() {
    const cards = document.querySelectorAll('.home-card');
    
    cards.forEach(card => {
        // Добавляем эффект при наведении
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Добавляем эффект при клике
        card.addEventListener('click', function(e) {
            if (!this.href) return;
            
            // Создаем эффект ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Улучшение навигации
 */
function enhanceNavigation() {
    // Подсветка активного раздела в навигации
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.md-nav__link, .md-tabs__link');
    
    navLinks.forEach(link => {
        if (link.href && link.href.includes(currentPath) && currentPath !== '/') {
            link.classList.add('active-nav-item');
        }
    });
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Добавляем индикатор прогресса чтения
    addReadingProgress();
}

/**
 * Добавление индикатора прогресса чтения
 */
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--md-primary-fg-color), var(--md-accent-fg-color));
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const winScroll = window.scrollY;
        const progress = (winScroll / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

/**
 * Добавление интерактивных эффектов
 */
function addInteractiveEffects() {
    // Эффект параллакса для заголовков
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с классом .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    // Добавляем tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

/**
 * Показать tooltip
 */
function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = tooltipText;
    
    const rect = this.getBoundingClientRect();
    tooltip.style.cssText = `
        position: fixed;
        background: var(--md-default-fg-color);
        color: var(--md-default-bg-color);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        top: ${rect.top - 40}px;
        left: ${rect.left + rect.width / 2}px;
        transform: translateX(-50%);
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    this.tooltipElement = tooltip;
}

/**
 * Скрыть tooltip
 */
function hideTooltip() {
    if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
    }
}

/**
 * Обработка загрузки контента
 */
function handleContentLoading() {
    // Показываем индикатор загрузки для медленных ресурсов
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.3s ease';
            });
        }
    });
    
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Утилита для debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .active-nav-item {
        position: relative;
    }
    
    .active-nav-item::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, var(--md-primary-fg-color), var(--md-accent-fg-color));
    }
    
    .custom-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--md-default-fg-color) transparent transparent transparent;
    }
`;

document.head.appendChild(style);

// Экспортируем функции для использования в консоли
window.SourceCraftEnhancements = {
    enhancePageTransitions,
    initClickableCards,
    enhanceNavigation,
    addInteractiveEffects,
    handleContentLoading
};