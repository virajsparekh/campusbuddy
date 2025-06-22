import { useState } from 'react'
import CommunityQnA from './pages/CommunityQnA'
import './App.css'

export default function App() {
  const [showCommunityQA, setShowCommunityQA] = useState(false)

  if (!showCommunityQA) {
    return (
      <div className="app-container">
        <h1 className="main-title">Campus Buddy</h1>
        <div className="button-section">
          <button className="primary-btn" onClick={() => setShowCommunityQA(true)}>
            Community Q&A
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <CommunityQnA onBack={() => setShowCommunityQA(false)} />
    </div>
  )
}
