import { useEffect, useRef, useState } from "react";
import classes from "./VideoUploader.module.css";
import VisualizeAudio from "./VisualizeAudio";

const VideoCanvasComponent = ({ videoFile, fileInfo }) => {
  const canvasRef = useRef(null);
  const canvasRefAudio = useRef(null);

  const audioRef = useRef(new AudioContext());
  const [metaData, setMetaData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoContainerRef = useRef({
    video: document.createElement("video"),
    ready: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasAudio = canvasRefAudio.current;

    const ctx = canvas.getContext("2d");
    const ctxAudio = canvasAudio.getContext("2d");

    const audioElement = document.createElement("audio");
    audioElement.src = videoFile;
    audioElement.crossOrigin = "anonymous";

    const source = audioRef.current.createMediaElementSource(audioElement);
    const analyser = audioRef.current.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioRef.current.destination);

    function draw() {
      analyser.getByteFrequencyData(dataArray);
      ctxAudio.clearRect(0, 0, canvasAudio.width, canvasAudio.height);

      const lineWidth = 2;
      ctxAudio.strokeStyle = "rgb(50, 50, 50)";
      ctxAudio.lineWidth = lineWidth;
      ctxAudio.beginPath();

      const sliceWidth = (canvasAudio.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize the value to [0, 1]
        const y = (v * canvasAudio.height) / 2;

        if (i === 0) {
          ctxAudio.moveTo(x, y);
        } else {
          ctxAudio.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctxAudio.stroke();
      requestAnimationFrame(draw);
    }

    audioElement.oncanplay = () => {
      draw();
    };

    const video = videoContainerRef.current.video;

    video.autoPlay = false;
    video.loop = true;
    video.src = videoFile;
    video.muted = true;

    const handleMetadataLoaded = (e) => {
      const duration = video.duration; // Retrieve the duration of the video in seconds
      const dimensions = { width: video.videoWidth, height: video.videoHeight }; // Retrieve the dimensions of the video
      const playbackRate = video.playbackRate; // Retrieve the current playback rate of the video
      const volume = video.volume; // Retrieve the current volume level of the video (ranging from 0.0 to 1.0)

      setMetaData({ duration, dimensions, playbackRate, volume });
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    video.onerror = (e) => {
      document.body.removeChild(canvas);
      document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
      document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
      document.body.innerHTML +=
        "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";
    };

    video.oncanplay = readyToPlayVideo;

    function readyToPlayVideo(event) {
      const { duration } = videoContainerRef.current.video;
      videoContainerRef.current.scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      videoContainerRef.current.ready = true;
      requestAnimationFrame(updateCanvas);
      document.getElementById("playPause").textContent = "";
    }

    function updateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (videoContainerRef.current !== undefined && videoContainerRef.current.ready) {
        var scale = videoContainerRef.current.scale;
        var vidH = videoContainerRef.current.video.videoHeight;
        var vidW = videoContainerRef.current.video.videoWidth;
        var top = canvas.height / 2 - (vidH / 2) * scale;
        var left = canvas.width / 2 - (vidW / 2) * scale;
        ctx.drawImage(videoContainerRef.current.video, left, top, vidW * scale, vidH * scale);
        if (videoContainerRef.current.video.paused) {
          drawPlayIcon();
        }
      }
      requestAnimationFrame(updateCanvas);
    }

    function drawPlayIcon() {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#DDD";
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      var size = (canvas.height / 2) * 0.5;
      ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function playPauseClick() {
      if (videoContainerRef.current !== undefined && videoContainerRef.current.ready) {
        if (videoContainerRef.current.video.paused) {
          videoContainerRef.current.video.play();
          const playbackPosition = video.currentTime;
          audioElement.play();
          audioElement.currentTime = playbackPosition;
          setIsPlaying(true);
        } else {
          videoContainerRef.current.video.pause();
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    }

    canvas.addEventListener("click", playPauseClick);
    return () => {
      canvas.removeEventListener("click", playPauseClick);
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
    };
  }, [videoFile]);

  function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedTime = [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":");

    return formattedTime;
  }

  return (
    <>
      <div className={classes["container-canvas"]}>
        <div>
          <canvas id="myCanvas" width="532" height="300" ref={canvasRef}></canvas>
          <br />
          <canvas
            id="myCanvas2"
            width="532"
            height="300"
            ref={canvasRefAudio}
            style={{ marginTop: "2rem", overflow: "hidden", border: "1px solid black" }}
          ></canvas>
        </div>
        {metaData && (
          <div className={classes["metaData"]}>
            <h5 style={{ textAlign: "center", marginBottom: 10 }}>Metadata</h5>
            <p>Name: {fileInfo.name}</p>
            <p>Size: {fileInfo.size}</p>
            <p>Type: {fileInfo.type}</p>
            <p>Last Modified Date: {fileInfo.lastModifiedDate}</p>
            <p>Duration: {formatDuration(metaData.duration)}</p>
            <p>Volume: {metaData.volume}</p>
          </div>
        )}
      </div>
      <h3>
        <div id="playPause">Loading content.</div>
      </h3>
      <VisualizeAudio audioSource={videoFile} isPlaying={isPlaying} />
    </>
  );
};

export default VideoCanvasComponent;
