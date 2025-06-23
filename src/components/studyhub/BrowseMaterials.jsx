import { useState } from 'react'

const demoMaterials = [
  { id: 1, title: 'Big Data Notes', subject: 'CS101', uploader: 'Alice', tags: ['Big Data', 'Lecture'] },
  { id: 2, title: 'Math Formulas', subject: 'MATH203', uploader: 'Bob', tags: ['Math', 'Exam'] },
  { id: 3, title: 'DBMS Cheatsheet', subject: 'CS210', uploader: 'Charlie', tags: ['DBMS', 'Reference'] },
  { id: 4, title: 'AI Project Outline', subject: 'CS450', uploader: 'Dana', tags: ['AI', 'Project'] },
]

const allTags = ['All', 'Big Data', 'Math', 'DBMS', 'AI', 'Lecture', 'Exam', 'Project', 'Reference']

export default function BrowseMaterials() {
  const [selectedTag, setSelectedTag] = useState('All')

  const filteredMaterials = selectedTag === 'All'
    ? demoMaterials
    : demoMaterials.filter(item => item.tags.includes(selectedTag))

  return (
    <div className="browse-materials-container">
      <h2 className="browse-materials-heading">📚 Browse Materials</h2>

      {/* Filter Buttons */}
      <div className="tag-filter-container">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`tag-button ${selectedTag === tag ? 'tag-button-active' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="materials-grid">
        {filteredMaterials.map((item) => (
          <div key={item.id} className="material-card">
            <h4 className="material-title">{item.title}</h4>
            <p className="material-subject"><strong>Subject:</strong> {item.subject}</p>
            <p className="material-uploader"><strong>Uploader:</strong> {item.uploader}</p>
            <p className="material-tags"><strong>Tags:</strong> {item.tags.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
