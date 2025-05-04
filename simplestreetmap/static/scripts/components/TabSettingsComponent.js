import { html, useState } from '../../../static/vendor/preact/standalone.module.js'

export default function TabSettingsComponent({}) {
    // add a lang selector
    const [lang, setLang] = useState('en-EN');
    return html`
        <div>
            <div>
                <select>
                    <option value="en-EN">English</option>
                    <option value="fr-FR">Français</option>
                </select>
            </div>
        </div>
    `;
}