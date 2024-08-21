import enENDictionnary from "../locales/en-EN.js"
import frFRDictionnary from "../locales/fr-FR.js"

class Locale {
    constructor () {
        this.change_lang('en-EN')
    }

    change_lang(lang) {
        const { lisan } = window.lisanJS;
        switch (lang) {
            case "en-EN":
                lisan.setLocaleName('en-EN');
                lisan.add(enENDictionnary);
                break;
            case "fr-FR":
                lisan.setLocaleName('fr-FR');
                lisan.add(frFRDictionnary);
                break;
            default:
                break;
        }
    }
}

const locale = new Locale()
export default locale