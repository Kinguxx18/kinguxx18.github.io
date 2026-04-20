/**
 * Kinguxx Portfolio - Main JavaScript
 * Modular architecture with ES6 modules
 */

import { ThemeManager } from './modules/theme.js';
import { NavigationManager } from './modules/navigation.js';
import { FormManager } from './modules/form.js';
import { ProjectsManager } from './modules/projects.js';
import { ScrollManager } from './modules/scroll.js';

(function() {
    'use strict';

    // =========================================
    // DOM ELEMENTS
    // =========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const contactForm = document.getElementById('contactForm');

    // =========================================
    // LISTEN FOR NAVIGATION EVENTS
    // =========================================
    // Handle navigation from other modules
    window.addEventListener('navigate-to', (e) => {
        NavigationManager.navigateTo(e.detail.sectionId);
    });

    // =========================================
    // INITIALIZATION
    // =========================================
    function init() {
        ThemeManager.init(themeIcon);
        NavigationManager.init(sidebar, menuToggle, menuOverlay, navLinks, sections);
        FormManager.init(contactForm);
        ProjectsManager.init();
        ScrollManager.init();

        console.log('%cKinguxx Portfolio Loaded', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
