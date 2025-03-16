// Sound utility functions
const sounds = {
  new: new Audio("/sounds/new.wav"),
  failed: new Audio("/sounds/failed.wav"),
  congratulations: new Audio("/sounds/congratulations.wav"),
  clear: new Audio("/sounds/clear.wav"),
  clickButton: new Audio("/sounds/clickButton.wav"),
  clickCell: new Audio("/sounds/clickCell.wav"),
  hint: new Audio("/sounds/hint.wav"),
};

Object.entries(sounds).forEach(([soundName, sound]) => {
  sound.volume = soundName === "congratulations" ? 0.15 : 0.3;
});

let isMuted = false;

// Play a sound if not muted
const playSound = (soundName) => {
  if (!isMuted && sounds[soundName]) {
    // Create a new Audio object each time to allow overlapping sounds
    const sound = new Audio(sounds[soundName].src);
    sound.volume = soundName === "congratulations" ? 0.15 : 0.3;
    sound.play().catch((error) => {
      console.log("Sound play error:", error);
    });
  }
};

const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

const getMuteState = () => {
  return isMuted;
};

export { playSound, toggleMute, getMuteState };
