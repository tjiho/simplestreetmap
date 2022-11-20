import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import searchComponent from './searchComponent.js';

export default function tabExploreComponent() {
  return html`
    <label for="search-input">Explore the world! What are you looking for?</label>
    <${searchComponent} id="search-input" onResultSelected="${(e) => console.log(e)}"/>
  `
}
