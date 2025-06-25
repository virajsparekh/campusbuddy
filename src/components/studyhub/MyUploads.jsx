import { useState } from 'react'

const mockUploads = [
  { id: 1, title: 'Big Data Notes', subject: 'CS101', uploader: 'You', tags: ['Big Data', 'Lecture'] },
  { id: 2, title: 'Math Formulas', subject: 'MATH203', uploader: 'You', tags: ['Math', 'Exam'] },
]

export default function MyUploads() {
  const [uploads, setUploads] = useState(mockUploads)

  const handleRemove = (id) => {
    // Mock removal: filter out the upload with the given id
    setUploads(uploads.filter(upload => upload.id !== id))
  }

  const handleEdit = (id) => {
    // Mock edit: alert for now
    alert(`Edit functionality for upload id ${id} is not implemented yet.`)
  }

  return (
    <div className="my-uploads-container">
      <h2 className="my-uploads-heading">📤 My Uploads</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <ul className="uploads-list">
          {uploads.map(upload => (
            <li key={upload.id} className="upload-item">
              <div className="upload-info">
                <h4>{upload.title}</h4>
                <p><strong>Subject:</strong> {upload.subject}</p>
                <p><strong>Tags:</strong> {upload.tags.join(', ')}</p>
              </div>
              <div className="upload-actions">
                <button onClick={() => handleEdit(upload.id)} className="edit-button">Edit</button>
                <button onClick={() => handleRemove(upload.id)} className="remove-button">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
