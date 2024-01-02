import { useState } from "react";
import "./App.css";

import VideoCanvasComponent from "./components/VideoUploader";

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

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
      {selectedVideo && <VideoCanvasComponent videoFile={selectedVideo} />}
    </div>
  );
}

export default App;
