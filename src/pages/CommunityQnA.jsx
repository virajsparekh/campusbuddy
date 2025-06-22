import { useState } from 'react'
import BrowseQuestions from './BrowseQuestions'
import MyQuestions from './MyQuestions'
import MyAnswers from './MyAnswers'
import '../App.css'

export default function CommunityQnA({ onBack }) {
  const [tab, setTab] = useState('') // No tab selected initially

  return (
    <div className="community-container">
      <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
      <h2 className="section-title">💬 Community Q&A</h2>

      <div className="tabs">
        <button onClick={() => setTab('browse')}>Browse Questions</button>
        <button onClick={() => setTab('my')}>My Questions</button>
        <button onClick={() => setTab('answers')}>My Answers</button>
      </div>

      {/* Render only selected tab */}
      {tab === 'browse' && <BrowseQuestions />}
      {tab === 'my' && <MyQuestions />}
      {tab === 'answers' && <MyAnswers />}
    </div>
  )
}
