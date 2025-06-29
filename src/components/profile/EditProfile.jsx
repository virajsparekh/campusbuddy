import { useState } from 'react'

export default function EditProfile() {
  // Initial mock user data
  const initialUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'A passionate learner at Campus Buddy.',
    location: 'San Diego, CA',
  }

  const [user, setUser] = useState(initialUser)
  const [previewUser, setPreviewUser] = useState(null)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!user.name.trim()) newErrors.name = 'Name is required'
    if (!user.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid'
    }
    return newErrors
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handlePreview = () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length === 0) {
      setPreviewUser(user)
      setErrors({})
    } else {
      setErrors(validationErrors)
      setPreviewUser(null)
    }
  }

  const handleSave = () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length === 0) {
      alert('Profile saved successfully (mock)')
      setErrors({})
      setPreviewUser(null)
    } else {
      setErrors(validationErrors)
      setPreviewUser(null)
    }
  }

  return (
    <div className="editprofile-container">
      <h2 className="editprofile-heading">✏️ Edit Profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
        className="editprofile-form"
      >
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            name="location"
            value={user.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="button" onClick={handlePreview} className="preview-button">
            Preview Changes
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </form>

      {previewUser && (
        <div className="preview-section">
          <h3>Preview</h3>
          <p><strong>Name:</strong> {previewUser.name}</p>
          <p><strong>Email:</strong> {previewUser.email}</p>
          <p><strong>Bio:</strong> {previewUser.bio}</p>
          <p><strong>Location:</strong> {previewUser.location}</p>
        </div>
      )}
    </div>
  )
}
