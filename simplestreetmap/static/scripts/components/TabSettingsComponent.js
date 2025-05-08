import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'
import locale from '../singletons/locale.js'
import translate from '../tools/translate.js'

const t = translate('TabSettingsComponent')
export default function TabSettingsComponent({}) {
    // add a lang selector
    const [lang, setLang] = useState(locale.lang);

    function _setLang(lang) {
        setLang(lang);
        locale.changeLang(lang)
    }

    return html`
        <div>
           <h2>${t('title')}</h2>
            <div class="form-field">
                <label for="lang_selector">${t('lang')}</label>
                <select onChange=${(e) => _setLang(e.target.value)} value=${lang} id="lang_selector">
                    <option value="en-EN">English</option>
                    <option value="fr-FR">Français</option>
                </select>
            </div>
        </div>
    `;
}