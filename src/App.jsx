import { useState } from "react";

import VideoCanvasComponent from "./components/VideoCanvasComponent";
import "./App.css";

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fileInformation, setFileInformation] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    console.log(file);
    setFileInformation({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModifiedDate: new Date(file.lastModifiedDate).toLocaleDateString("en-GB"),
    });
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const videoBlob = new Blob([reader.result], { type: file.type });
        const videoUrl = URL.createObjectURL(videoBlob);
        setSelectedVideo(videoUrl);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="container">
      <input type="file" id="fileInput" className="custom-file-input" accept="video/*" onChange={handleFileUpload} />
      {selectedVideo && <VideoCanvasComponent videoFile={selectedVideo} fileInfo={fileInformation} />}
    </div>
  );
}

export default App;
