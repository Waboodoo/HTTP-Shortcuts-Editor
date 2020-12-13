import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import EnglishTranslation from '@/i18n/translations/en';

export default function initI18n(): VueI18Next {
    Vue.use(VueI18Next);

    i18next.init({
        fallbackLng: 'en',
        whitelist: ['en'],
        resources: {
            en: { translation: EnglishTranslation },
        },
    });

    return new VueI18Next(i18next);
}
