/**
 * Theme Manager - Handles dark/light mode toggle
 */
export const ThemeManager = {
    KEY: 'kinguxx-theme',
    themeIcon: null,

    init(themeIconElement) {
        this.themeIcon = themeIconElement;
        const savedTheme = localStorage.getItem(this.KEY) || 'dark';
        this.setTheme(savedTheme);
        this.bindEvents();
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.KEY, theme);
        this.updateIcon(theme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    },

    updateIcon(theme) {
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF13';
        }
    },

    bindEvents() {
        // Event listener se agrega desde main.js
    }
};
