const soundPaths = {
  new: "/sounds/new.wav",
  failed: "/sounds/failed.wav",
  congratulations: "/sounds/congratulations.wav",
  clear: "/sounds/clear.wav",
  clickButton: "/sounds/clickButton.wav",
  clickCell: "/sounds/clickCell.wav",
  hint: "/sounds/hint.wav",
};

// Function to get correct path with PUBLIC_URL
const getAudioPath = (path) => {
  return `${process.env.PUBLIC_URL}${path}`;
};

// Initialize audio objects with correct paths
const sounds = {};
Object.entries(soundPaths).forEach(([soundName, path]) => {
  sounds[soundName] = new Audio(getAudioPath(path));
  sounds[soundName].volume = soundName === "congratulations" ? 0.15 : 0.3;
});

let isMuted = false;

// Play a sound if not muted
const playSound = (soundName) => {
  if (!isMuted && sounds[soundName]) {
    // Create a new Audio object each time to allow overlapping sounds
    const sound = new Audio(getAudioPath(soundPaths[soundName]));
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
