import React, { useState } from "react";
import { toggleMute, getMuteState } from "../utils/soundUtils";
import "./MuteButton.css";

function MuteButton() {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggleMute = () => {
    const newMuteState = toggleMute();
    setMuted(newMuteState);
  };

  return (
    <button className="mute-button" onClick={handleToggleMute} title={muted ? "Unmute sounds" : "Mute sounds"}>
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

export default MuteButton;
