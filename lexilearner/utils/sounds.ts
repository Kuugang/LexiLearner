import Sound from "react-native-sound";
import correctSoundFile from "~/assets/sounds/correct-choice.mp3";

Sound.setCategory("Playback");

export const CorrectSound = new Sound(
  correctSoundFile,
  Sound.MAIN_BUNDLE,
  (error) => {
    if (error) {
      console.log("Failed to load correct sound:", error);
      return;
    }
    CorrectSound?.play((success) => {
      if (!success) {
        console.log("Playback failed for correct sound");
      }
    });
  }
);
