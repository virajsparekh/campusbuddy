import { useState } from 'react'
import StudyHub from './components/studyhub/StudyHub'
import UserProfile from './components/profile/UserProfile'
import './App.css'
import './styles/StudyHub.css'
import './styles/UserProfile.css'

function App() {
  const [page, setPage] = useState(null)

  return (
    <div className="app-container">
      <h1 className="app-title">Campus Buddy</h1>

      {!page && (
        <div className="button-wrapper" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setPage('studyhub')} className="main-button">
            Study Hub
          </button>
          <button onClick={() => setPage('userprofile')} className="main-button">
            User Profile
          </button>
        </div>
      )}

      {page === 'studyhub' && <StudyHub onBack={() => setPage(null)} />}
      {page === 'userprofile' && <UserProfile onBack={() => setPage(null)} />}
    </div>
  )
}

export default App
