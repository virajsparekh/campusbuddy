import { useState } from 'react'
import '../App.css'

const initialDemoQuestions = [
  {
    id: 1,
    question: "What is React used for?",
    tags: ["React", "JavaScript"],
    upvotes: 4,
    downvotes: 1,
  },
  {
    id: 2,
    question: "How to center a div in CSS?",
    tags: ["CSS", "Frontend"],
    upvotes: 10,
    downvotes: 0,
  }
]

export default function BrowseQuestions() {
  const [questions, setQuestions] = useState(initialDemoQuestions)

  function handleUpvote(id) {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
    ))
  }

  function handleDownvote(id) {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, downvotes: q.downvotes + 1 } : q
    ))
  }

  return (
    <div>
      <h3>Browse Questions</h3>
      {questions.map((q) => (
        <div key={q.id} className="question-card">
          <p><strong>{q.question}</strong></p>
          <p>Tags: {q.tags.join(', ')}</p>
          <p>
            <button
              onClick={() => handleUpvote(q.id)}
              className="vote-button"
              aria-label="Upvote"
            >
              👍
            </button> {q.upvotes} &nbsp;&nbsp;

            <button
              onClick={() => handleDownvote(q.id)}
              className="vote-button"
              aria-label="Downvote"
            >
              👎
            </button> {q.downvotes}
          </p>
        </div>
      ))}
    </div>
  )
}
