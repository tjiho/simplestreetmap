import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import map from '../singletons/map.js'

export default function ListAnnotationsComponent () {
  const [annotations, setAnnotations] = useState([])

  useEffect(() => {
    map.onAnnotationsChange((newElement, newAnnotations) => {
      setAnnotations([...newAnnotations])
    })
  }, [])

  return html`
    <h2>Annotations</h2>
    <ul>
      ${annotations.map(AnnotationLineComponent)}
    </ul>
  `
}

function AnnotationLineComponent ({ name }) {
  return html`
    <li>
        ${name}
    </li>
  `
}
