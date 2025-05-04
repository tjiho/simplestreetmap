import enENDictionnary from "../locales/en-EN.js"
import frFRDictionnary from "../locales/fr-FR.js"
import getCookie from "../tools/getCookie.js";
class Locale {
    constructor () {
        const lang_from_cookie = getCookie('lang');
        if (lang_from_cookie) {
            this.change_lang(lang_from_cookie);
        } else {
            this.change_lang('en-EN');
        }
    }

    change_lang(lang) {
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
    }
}

const locale = new Locale()
export default locale