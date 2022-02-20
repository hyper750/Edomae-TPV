import Vue from 'vue';
import VueI18n from "vue-i18n";
import EnglishTranslations from "./translations/en.json";
import SpanishTranslations from "./translations/es.json";

Vue.use(VueI18n);

export const languagesAvailable = [
    {
        // Locale
        code: 'es',
        // Text to translate
        text: 'Spanish',
        // File of translations
        file: SpanishTranslations
    },
    {
        // Locale
        code: 'en',
        // Text to translate
        text: 'English',
        // File of translations
        file: EnglishTranslations
    }
];

const i18n = new VueI18n({
    // Default locale
    locale: localStorage.getItem('language') || 'es',

    // Available languages
    availableLocales: languagesAvailable.map(({ code }) => code),

    // Load translations from different files for each locale
    messages: languagesAvailable.reduce((messages, translation) => {
        return {
            ...messages,
            [translation.code]: translation.file
        };
    }, {})
});

export default i18n;
