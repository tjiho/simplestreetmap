import { html, useRef, useEffect } from "../libs/preact.mjs";
import useSearch from "../hooks/useSearch.js";

const SNAP_COLLAPSED = 0;
const SNAP_EXPANDED = 1;

export default function MobileSearchComponent() {
  const sheetRef = useRef(null);
  const inputRef = useRef(null);
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    selectResult,
    clear,
    handleKeyDown,
  } = useSearch();

  function expand() {
    sheetRef.current?.snapToPoint(SNAP_EXPANDED, { behavior: "smooth" });
  }

  function collapse() {
    sheetRef.current?.snapToPoint(SNAP_COLLAPSED, { behavior: "smooth" });
    inputRef.current?.blur();
  }

  function handleResultClick(result) {
    selectResult(result);
    collapse();
  }

  function handleClose() {
    clear();
    collapse();
  }

  // Swipe-down jusqu'à collapsed → s'assurer que le clavier mobile se ferme.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const onSnap = (e) => {
      // snapIndex: 2 = only header, 1: open, 3: fully open
      if (e.detail?.snapIndex === 2) {
        inputRef.current?.blur();
      } else {
        inputRef.current?.focus();
      }
    };
    sheet.addEventListener("snap-position-change", onSnap);
    return () => sheet.removeEventListener("snap-position-change", onSnap);
  }, []);

  const hasContent = query.length > 0 || results.length > 0;

  return html`
    <bottom-sheet ref=${sheetRef} tabindex="0">
      <div slot="snap" style="--snap: 90px" class="initial"></div>
      <div slot="snap" style="--snap: 95%"></div>
      <div slot="header" class="mobile-search-header">
        <input
          ref=${inputRef}
          type="search"
          class="mobile-search-input"
          placeholder="Rechercher..."
          value=${query}
          onInput=${(e) => setQuery(e.target.value)}
          onFocus=${expand}
          onKeyDown=${handleKeyDown}
        />
        ${hasContent &&
        html`
          <button
            class="mobile-search-close"
            onClick=${handleClose}
            aria-label="Fermer"
          >
            ×
          </button>
        `}
      </div>
      <div class="mobile-search-results">
        ${results.map(
          (result, index) => html`
            <div
              class="mobile-search-result"
              selected=${index === selectedIndex ? "true" : undefined}
              onClick=${() => handleResultClick(result)}
            >
              ${result.properties.label}
            </div>
          `,
        )}
      </div>
    </bottom-sheet>
  `;
}
