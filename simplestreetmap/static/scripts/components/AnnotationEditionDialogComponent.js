import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'
import translate from '../tools/translate.js'
import locale from '../singletons/locale.js'

export default function AnnotationEditionDialogComponent({}) {

    const t = translate('AnnotationEditionDialogComponent')    

    return html`
        <dialog open>
            <form method="dialog">
                <div class="form-field">
                    <label for="annotation-edition-name">${t('annotation_name')}</label>
                    <input type="text" id="annotation-edition-name"/>
                </div>
                <button class="standard-button small-margin-top">${t('apply')}</button>
            </form>
        </dialog>
    `
}