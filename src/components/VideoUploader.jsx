import { useEffect, useRef } from "react";

const VideoCanvasComponent = ({ videoFile }) => {
  const canvasRef = useRef(null);
  const videoContainerRef = useRef({
    video: document.createElement("video"),
    ready: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const video = videoContainerRef.current.video;
    video.autoPlay = false;
    video.loop = true;
    video.src = videoFile;
    // if (videoFile) {
    //   const objectURL = URL.createObjectURL(videoFile);
    //   video.src = objectURL;
    // }

    video.onerror = (e) => {
      document.body.removeChild(canvas);
      document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
      document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
      document.body.innerHTML +=
        "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";
    };

    video.oncanplay = readyToPlayVideo;

    function readyToPlayVideo(event) {
      videoContainerRef.current.scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      videoContainerRef.current.ready = true;
      requestAnimationFrame(updateCanvas);
      document.getElementById("playPause").textContent = "Click video to play/pause.";
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
          drawPayIcon();
        }
      }
      requestAnimationFrame(updateCanvas);
    }

    function drawPayIcon() {
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
        } else {
          videoContainerRef.current.video.pause();
        }
      }
    }

    canvas.addEventListener("click", playPauseClick);

    return () => {
      canvas.removeEventListener("click", playPauseClick);
    };
  }, []);

  return (
    <>
      <canvas id="myCanvas" width="532" height="300" ref={canvasRef}></canvas>
      <br />
      <h3>
        <div id="playPause">Loading content.</div>
      </h3>
    </>
  );
};

export default VideoCanvasComponent;
