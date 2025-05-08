import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'
import translate from '../tools/translate.js'
import locale from '../singletons/locale.js'
import annotationStore from '../singletons/annotationsStore.js'

export default function AnnotationEditionDialogComponent({annotation, onClose}) {

    const t = translate('AnnotationEditionDialogComponent')
   
    function onSubmit(e) {
        e.stopPropagation()
        e.preventDefault()
        annotationStore.updateAnnotation(annotation, {name: document.getElementById('annotation-edition-name').value})
        document.getElementById('annotation-edition-dialog').close()
    }

    function _onClose() {
        onClose()
    }

    useEffect(() => {
        const dialog = document.getElementById('annotation-edition-dialog')
        dialog.addEventListener('close', _onClose)
    }, [])

    useEffect(() => {
        if (!annotation) {
            document.getElementById('annotation-edition-dialog').close()
            return
        }
        document.getElementById('annotation-edition-dialog').showModal()
        const nameInput = document.getElementById('annotation-edition-name')
        nameInput.value = annotation.name
    }, [annotation])

   

    return html`
        <dialog id="annotation-edition-dialog">
            <form method="dialog" onSubmit=${onSubmit}>
                <div class="form-field">
                    <label for="annotation-edition-name">${t('annotation_name')}</label>
                    <input type="text" id="annotation-edition-name"/>
                </div>
                <button class="standard-button small-margin-top" type="submit">${t('apply')}</button>
            </form>
        </dialog>
    `
}