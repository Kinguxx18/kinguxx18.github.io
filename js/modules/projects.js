/**
 * Projects Manager - Handles project cards and interactions
 */
export const ProjectsManager = {
    init() {
        this.bindCardActions();
        this.bindRippleEffect();
    },

    bindCardActions() {
        // Add click handlers to card action buttons
        document.querySelectorAll('.card-action').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.card');
                const title = card?.querySelector('h3')?.textContent;

                // Navigate to about section
                this.navigateTo('about');
            });
        });
    },

    bindRippleEffect() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn, .form-submit').forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple keyframes if not exists
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    navigateTo(sectionId) {
        // Dispatch custom event for navigation
        window.dispatchEvent(new CustomEvent('navigate-to', { detail: { sectionId } }));
    }
};
