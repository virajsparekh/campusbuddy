import { useState } from 'react'

export default function UploadMaterials() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, just log the file info
    if (file) {
      console.log('Uploading file:', file.name)
      alert(`File "${file.name}" ready to be uploaded (mock)`)
    } else {
      alert('Please select a file to upload')
    }
  }

  return (
    <div className="upload-materials-container">
      <h2 className="upload-materials-heading">⬆️ Upload Material</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="fileInput" className="file-picker-label">
          Choose file to upload
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />
        {preview && (
          <div className="file-preview">
            <p>File Preview:</p>
            <img src={preview} alt="File preview" className="preview-image" />
          </div>
        )}
        <button type="submit" className="upload-button">Upload</button>
      </form>
    </div>
  )
}
