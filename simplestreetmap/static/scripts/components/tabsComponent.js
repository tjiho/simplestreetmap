import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';

export default function tabsComponent({tabs, name}) {
  const [selectedTab, setSelectedTab] = useState(0);

  return html`
    <div class="tabs-container">
      <div role="tablist" class="tabs-controller">
        ${tabs.map(({icon, label}, index) => html`
          <button
            role="tab"
            aria-selected="${index == selectedTab}"
            aria-control="tab-panel-${name}-${index}"
            id="tab-${name}-${index}"
            onclick="${() => setSelectedTab(index)}"
          >
            <img title=${label} alt=${label} src="/static/images/breeze/${icon}.svg"/>
          </button>
        `)}
      </div>
      <div class="tabs-content">
        ${tabs.map(({content, contentProps}, index) => html`
          <section role="tabpanel" id="tab-panel-${name}-${index}" aria-labelledby="tab-${name}-${index}" class="${index == selectedTab ? 'is-selected' : ''}">
            ${content({...contentProps})}
          </section>`)}
      </div>
    </div>`
}
