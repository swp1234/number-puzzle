class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        // 1. Check localStorage
        const saved = localStorage.getItem('language');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        // 2. Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // 3. Default to English
        return 'en';
    }

    async loadTranslations(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.warn(`Failed to load language ${lang}:`, error);
            if (lang !== 'en') {
                return this.loadTranslations('en');
            }
            return {};
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang] || {};

        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }

        return value;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('language', lang);
        await this.loadTranslations(lang);
        this.updateUI();

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        });

        // Update meta tags
        document.querySelectorAll('[data-i18n-meta]').forEach(element => {
            const key = element.getAttribute('data-i18n-meta');
            const content = this.t(key);
            element.setAttribute('content', content);
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            ko: '한국어',
            en: 'English',
            zh: '中文',
            hi: 'हिन्दी',
            ru: 'Русский',
            ja: '日本語',
            es: 'Español',
            pt: 'Português',
            id: 'Bahasa Indonesia',
            tr: 'Türkçe',
            de: 'Deutsch',
            fr: 'Français'
        };
        return names[lang] || lang;
    }
}

// Global instance
const i18n = new I18n();

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.loadTranslations(i18n.currentLang);
    i18n.updateUI();
    document.documentElement.lang = i18n.currentLang;
});
