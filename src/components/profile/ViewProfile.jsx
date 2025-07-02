export default function ViewProfile() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'A passionate learner at Campus Buddy.',
    location: 'San Diego, CA',
  }

  return (
    <div className="viewprofile-container">
      <h2 className="viewprofile-heading">👤 View Profile</h2>
      <div className="profile-image-section">
        <img src={user.profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
        <p><strong>Location:</strong> {user.location}</p>
      </div>
    </div>
  )
}
