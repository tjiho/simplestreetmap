export default function translate(component) {
    const { t: lisanT } = window.lisanJS;

    function t(str) {
        return lisanT(`${component}.${str}`)
    }

    return t
}