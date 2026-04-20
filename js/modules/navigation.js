/**
 * Navigation Manager - Handles section navigation and mobile menu
 */
export const NavigationManager = {
    sidebar: null,
    menuToggle: null,
    menuOverlay: null,
    navLinks: null,
    sections: null,

    init(sidebarEl, menuToggleEl, menuOverlayEl, navLinksEl, sectionsEl) {
        this.sidebar = sidebarEl;
        this.menuToggle = menuToggleEl;
        this.menuOverlay = menuOverlayEl;
        this.navLinks = navLinksEl;
        this.sections = sectionsEl;

        this.bindEvents();

        // Initial navigation based on hash
        const initialSection = window.location.hash.slice(1) || 'dashboard';
        this.navigateTo(initialSection, false);
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking overlay
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e, link));
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const sectionId = window.location.hash.slice(1) || 'dashboard';
            this.navigateTo(sectionId, false);
        });
    },

    handleNavigation(e, link) {
        e.preventDefault();
        const sectionId = link.dataset.section;
        this.navigateTo(sectionId);

        // Close mobile menu after navigation
        if (window.innerWidth <= 768) {
            this.closeMobileMenu();
        }
    },

    toggleMobileMenu() {
        if (!this.sidebar || !this.menuToggle) return;

        const isOpen = this.sidebar.classList.contains('open');
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        if (!this.sidebar || !this.menuToggle || !this.menuOverlay) return;

        this.sidebar.classList.add('open');
        this.menuToggle.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeMobileMenu() {
        if (!this.sidebar || !this.menuToggle || !this.menuOverlay) return;

        this.sidebar.classList.remove('open');
        this.menuToggle.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    navigateTo(sectionId, updateHistory = true) {
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // Update sections
        this.sections.forEach(section => {
            if (section.id === sectionId) {
                section.removeAttribute('hidden');
                section.classList.add('active-section');
                this.triggerAnimations(section);
            } else {
                section.setAttribute('hidden', '');
                section.classList.remove('active-section');
            }
        });

        // Update URL
        if (updateHistory) {
            history.pushState(null, '', `#${sectionId}`);
        }

        // Update document title
        const titles = {
            dashboard: 'Dashboard',
            projects: 'Projects',
            skills: 'Skills',
            about: 'About',
            contact: 'Contact'
        };
        document.title = `Kinguxx | ${titles[sectionId] || 'Portfolio'}`;
    },

    triggerAnimations(section) {
        // Reset and trigger fade-in animations
        const fadeElements = section.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = '';
        });

        // Trigger skill bar animations
        if (section.id === 'skills') {
            this.animateSkillBars(section);
        }

        // Trigger stat count animations
        if (section.id === 'dashboard' || section.id === 'about') {
            this.animateStats(section);
        }
    },

    animateSkillBars(section) {
        const bars = section.querySelectorAll('.skill-progress');
        bars.forEach((bar, index) => {
            bar.style.animationDelay = `${index * 0.1}s`;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = getComputedStyle(bar).getPropertyValue('--progress');
            }, index * 100);
        });
    },

    animateStats(section) {
        const counters = section.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            this.countUp(counter, target);
        });
    },

    countUp(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
};
