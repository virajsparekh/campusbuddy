import { useState } from 'react'
import BrowseMaterials from './BrowseMaterials'
// import UploadMaterials from './UploadMaterials'
// import MyUploads from './MyUploads'

export default function StudyHub({ onBack }) {
  const [tab, setTab] = useState(null)

  if (!tab) {
    return (
      <div className="studyhub-container">
        <button onClick={onBack} className="back-button">← Back</button>
        <h2 className="studyhub-heading">📘 Study Hub</h2>
        <div className="tab-button-container">
          <button onClick={() => setTab('browse')} className="tab-button">Browse Materials</button>
          {/* <button onClick={() => setTab('upload')} className="tab-button">Upload Materials</button>
          <button onClick={() => setTab('myuploads')} className="tab-button">My Uploads</button> */}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => setTab(null)} className="back-button">← Back to Study Hub</button>
      {tab === 'browse' && <BrowseMaterials />}
      {/* {tab === 'upload' && <UploadMaterials />}
      {tab === 'myuploads' && <MyUploads />} */}
    </div>
  )
}
