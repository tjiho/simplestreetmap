import enENDictionnary from "../locales/en-EN.js"
import frFRDictionnary from "../locales/fr-FR.js"
import getCookie from "../tools/getCookie.js";
import setCookie from "../tools/setCookie.js";

class Locale {
    constructor () {
        this.lang = 'en-EN';
        const lang_from_cookie = getCookie('lang');
        if (lang_from_cookie) {
            this.changeLang(lang_from_cookie);
        } else {
            this.changeLang('en-EN');
        }
    }

    changeLang(lang) {
        const { lisan } = window.lisanJS;
        switch (lang) {
            case "fr-FR":
                lisan.setLocaleName('fr-FR');
                lisan.add(frFRDictionnary);
                break;
            default:
                lisan.setLocaleName('en-EN');
                lisan.add(enENDictionnary);
                break;
        }
        this.lang = lang;
        setCookie('lang', lang, 365);
    }
}

const locale = new Locale()
export default locale