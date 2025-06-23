import { useState } from 'react'
import StudyHub from './components/studyhub/StudyHub'
import './App.css'

function App() {
  const [page, setPage] = useState(null)

  return (
    <div className="app-container">
      <h1 className="app-title">Campus Buddy</h1>

      {!page && (
        <div className="button-wrapper">
          <button onClick={() => setPage('studyhub')} className="main-button">
            Study Hub
          </button>
        </div>
      )}

      {page === 'studyhub' && <StudyHub onBack={() => setPage(null)} />}
    </div>
  )
}

export default App
