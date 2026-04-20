/**
 * Form Manager - Handles contact form validation and WhatsApp submission
 */
export const FormManager = {
    WHATSAPP_NUMBER: '50660585704',
    contactForm: null,

    rules: {
        name: {
            required: true,
            minLength: 2,
            message: 'Please enter your full name'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 3,
            message: 'Please enter a subject'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Message must be at least 10 characters'
        }
    },

    init(formElement) {
        this.contactForm = formElement;
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.createWhatsAppButton();
        this.bindRealTimeValidation();
    },

    bindRealTimeValidation() {
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },

    createWhatsAppButton() {
        const submitBtn = this.contactForm.querySelector('.form-submit');
        if (!submitBtn) return;

        const waBtn = document.createElement('button');
        waBtn.type = 'button';
        waBtn.className = 'form-submit wa-btn';
        waBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Send via WhatsApp</span>
        `;
        waBtn.style.cssText = 'margin-top: 0.75rem; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);';
        waBtn.addEventListener('click', () => this.sendToWhatsApp());
        submitBtn.parentNode.insertBefore(waBtn, submitBtn.nextSibling);
    },

    sendToWhatsApp() {
        const name = this.contactForm.querySelector('[name="name"]')?.value.trim();
        const email = this.contactForm.querySelector('[name="email"]')?.value.trim();
        const subject = this.contactForm.querySelector('[name="subject"]')?.value.trim();
        const message = this.contactForm.querySelector('[name="message"]')?.value.trim();

        // Validate fields first
        let isValid = true;
        ['name', 'email', 'subject', 'message'].forEach(fieldName => {
            const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) isValid = false;
        });

        if (!isValid) return;

        // Format message
        const waMessage = `*New Contact Message*\n\n` +
            `*Name:* ${name}\n` +
            `*Email:* ${email}\n` +
            `*Subject:* ${subject}\n\n` +
            `*Message:*\n${message}`;

        const encodedMessage = encodeURIComponent(waMessage);
        const directUrl = `https://web.whatsapp.com/send?phone=${this.WHATSAPP_NUMBER}&text=${encodedMessage}`;

        window.open(directUrl, '_blank', 'noopener,noreferrer');
    },

    handleSubmit(e) {
        e.preventDefault();

        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];

        fields.forEach(fieldName => {
            const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.sendEmail();
        }
    },

    async sendEmail() {
        const name = this.contactForm.querySelector('[name="name"]')?.value;
        const email = this.contactForm.querySelector('[name="email"]')?.value;
        const subject = this.contactForm.querySelector('[name="subject"]')?.value;
        const message = this.contactForm.querySelector('[name="message"]')?.value;

        // Check if EmailJS is loaded
        if (typeof emailjs !== 'undefined') {
            try {
                const submitBtn = this.contactForm.querySelector('.form-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';

                await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                    to_name: 'Kinguxx',
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message
                });

                this.showSuccess();
                this.contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('Failed to send email. Please try again or use WhatsApp.');
            }
        } else {
            console.log('EmailJS not configured. Demo mode - form data:');
            console.log({ name, email, subject, message });
            this.showSuccess();
            this.contactForm.reset();
        }
    },

    validateField(field) {
        const name = field.name;
        const rule = this.rules[name];
        if (!rule) return true;

        const value = field.value.trim();
        let error = '';

        if (rule.required && !value) {
            error = rule.message;
        } else if (rule.minLength && value.length < rule.minLength) {
            error = rule.message;
        } else if (rule.pattern && !rule.pattern.test(value)) {
            error = rule.message;
        }

        this.showError(field, error);
        return !error;
    },

    showError(field, message) {
        const errorEl = document.getElementById(`${field.name}Error`);
        if (!errorEl) return;

        if (message) {
            field.classList.add('error');
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        } else {
            field.classList.remove('error');
            errorEl.classList.remove('visible');
        }
    },

    showSuccess() {
        const successEl = document.getElementById('formSuccess');
        if (successEl) {
            successEl.classList.add('visible');
            setTimeout(() => {
                successEl.classList.remove('visible');
            }, 5000);
        }
    }
};
