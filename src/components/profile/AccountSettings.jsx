import { useState } from 'react'

export default function AccountSettings() {
  const [email, setEmail] = useState('john.doe@example.com')
  const [password, setPassword] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  const handleToggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled)
  }

  const handleSave = (e) => {
    e.preventDefault()
    // Mock save action
    alert('Account settings saved (mock)')
    setPassword('')
  }

  return (
    <div className="accountsettings-container">
      <h2 className="accountsettings-heading">⚙️ Account Settings</h2>
      <form onSubmit={handleSave} className="accountsettings-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group toggle-group">
          <label htmlFor="notifications-toggle">Enable Notifications:</label>
          <input
            id="notifications-toggle"
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
        </div>

        <div className="form-group toggle-group">
          <label htmlFor="darkmode-toggle">Enable Dark Mode:</label>
          <input
            id="darkmode-toggle"
            type="checkbox"
            checked={darkModeEnabled}
            onChange={handleToggleDarkMode}
          />
        </div>

        <button type="submit" className="save-button">Save Settings</button>
      </form>
    </div>
  )
}
