import React, { useState } from "react"

import "../style.css"

const IndexPopUp: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append("resume", selectedFile)
      const api_url = "https://australia-southeast1-help2seek.cloudfunctions.net/pdf2txt"
      console.log(`api_url ${api_url}`)
      try {
        const response = await fetch(api_url, {
          method: "POST",
          body: formData
        })
        if (response.ok) {
          console.log("File uploaded successfully!")
          const data = await response.json()
          console.log(data['resume_txt'])
          chrome.storage.local.set({'resume_txt': data['resume_txt']}, function() {
            console.log('Value "resume_txt" is set');
          });
        }
      } catch (error) {
        console.error("Upload failed:", error)
      }
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}

export default IndexPopUp
