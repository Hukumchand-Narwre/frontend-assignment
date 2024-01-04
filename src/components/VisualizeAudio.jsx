import { useState, useRef } from "react";
import ReactWaves from "@dschoon/react-waves";

const VisualizeAudio = ({ audioSource, isPlaying }) => {
  const audioRef = useRef(null);

  const initialTracks = {
    tracks: [{ source: audioSource, title: "Zimt" }],
  };

  return (
    <>
      <ReactWaves
        audioFile={initialTracks.tracks[0].source}
        className={"react-waves"}
        options={{
          backend: "MediaElement",
          normalize: true,
          cursorWidth: 0,
          mediaType: "audio",
          hideScrollbar: true,
          responsive: true,
        }}
        zoom={1}
        playing={isPlaying}
        volume={0} // You can add more props as needed
        ref={audioRef}
      />
    </>
  );
};

export default VisualizeAudio;
