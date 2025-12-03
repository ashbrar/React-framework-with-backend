import React, { useState } from "react";

function App() {
  // --- STATE VARIABLES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  // --- SECTION 1: SEARCH FUNCTION ---
  const handleSearch = async () => {
    try {
      // Connect to the backend on Port 3000
      const response = await fetch(`http://localhost:3000/api/getImage?name=${searchQuery}`);
      const data = await response.json();
      
      // We add a timestamp (?t=...) to the URL.
      // This forces the browser to re-download the image instead of using the old cached version.
      setImgUrl(`${data.url}?t=${new Date().getTime()}`); 
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // --- SECTION 2: UPLOAD FUNCTION ---
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!uploadName || !selectedFile) {
      alert("Please provide both a name and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      // Send the file to the backend using the POST route we created
      const res = await fetch(`http://localhost:3000/api/upload?name=${uploadName}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Upload successful! Search again to see the new image.");
        setUploadName(""); // Clear input
        setSelectedFile(null);
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Image Management System</h1>

      {/* --- SECTION 1: SEARCH --- */}
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2>1. Search Image</h2>
        <input
          type="text"
          placeholder="Enter name (e.g., tom)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "60%" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 15px", marginLeft: "10px", cursor: "pointer" }}>
          Search
        </button>
        <br /><br />
        
        {imgUrl ? (
          <div style={{ textAlign: "center" }}>
            <img 
              src={imgUrl} 
              alt="Search Result" 
              style={{ maxWidth: "100%", maxHeight: "300px", border: "1px solid #000" }} 
            />
          </div>
        ) : (
          <p style={{ fontStyle: "italic", color: "#888" }}>Image will appear here...</p>
        )}
      </div>

      {/* --- SECTION 2: UPLOAD --- */}
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h2>2. Upload / Replace Image</h2>
        <p>Type a name (e.g. "tom") and upload a new picture to overwrite the old one.</p>
        
        <input
          type="text"
          placeholder="Character Name (e.g., tom)"
          value={uploadName}
          onChange={(e) => setUploadName(e.target.value)}
          style={{ padding: "8px", width: "60%", marginBottom: "10px" }}
        />
        <br />
        <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
        <br />
        <button onClick={handleUpload} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px" }}>
          Upload New Image
        </button>
        
        {message && <p style={{ color: "blue", fontWeight: "bold", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
}

export default App;