import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  console.log(import.meta.env.API_KEY)

  return (
    <>
      {/*
        Intentional a11y violations, left in on purpose so pa11y / Lighthouse
        have something real to catch on first run. Fix these one at a time
        to watch the accessibility-audit job go from fail -> pass.

        1. <img> with no alt attribute
        2. Icon-only <button> with no aria-label
        3. Text/background combo that fails WCAG contrast (2.5:1, needs 4.5:1)
        4. <input> with no associated <label>
      */}
      <img src="/vite.svg" />

      <h1>CI Test App</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <button>x</button>

        <p style={{ color: '#aaaaaa', background: '#ffffff' }}>
          This text intentionally fails WCAG contrast requirements.
        </p>

        <input type="text" placeholder="no associated label" />
      </div>
    </>
  )
}

export default App
