import { useState } from 'react'
import EditProfile from './EditProfile'
import ViewProfile from './ViewProfile'
import AccountSettings from './AccountSettings'

export default function UserProfile({ onBack }) {
  const [tab, setTab] = useState(null)

  if (!tab) {
    return (
      <div className="userprofile-container">
        <button onClick={onBack} className="back-button">← Back</button>
        <h2 className="userprofile-heading">👤 User Profile</h2>
        <div className="tab-button-container">
          <button onClick={() => setTab('view')} className="tab-button">View Profile</button>
          <button onClick={() => setTab('edit')} className="tab-button">Edit Profile</button>
          <button onClick={() => setTab('account')} className="tab-button">Account Settings</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => setTab(null)} className="back-button">← Back to User Profile</button>
      {tab === 'view' && <ViewProfile />}
      {tab === 'edit' && <EditProfile />}
      {tab === 'account' && <AccountSettings />}
    </div>
  )
}
