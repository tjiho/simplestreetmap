export default function translate(component) {
    const { t: lisanT } = window.lisanJS;

    function t(str, params = {}) {
        return lisanT(`${component}.${str}`, params)
    }

    return t
}