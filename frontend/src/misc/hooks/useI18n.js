import { useState, useEffect } from 'react';
import { getTranslation } from '../../intl';

export const useI18n = () => {
    const [lang, setLang] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');

        if (urlLang && ['en', 'ua'].includes(urlLang)) {
            localStorage.setItem('lang', urlLang);
            return urlLang;
        }

        const savedLang = localStorage.getItem('lang');
        if (savedLang) return savedLang;

        return 'en';
    });

    const changeLang = (newLang) => {
        if (['en', 'ua'].includes(newLang)) {
            setLang(newLang);
            localStorage.setItem('lang', newLang);

            const url = new URL(window.location);
            url.searchParams.set('lang', newLang);
            window.history.replaceState({}, '', url);
        }
    };

    const t = (key) => {
        return getTranslation(key, lang);
    };

    return { lang, changeLang, t };
};
