import useSound from 'use-sound';

export function useGameSounds() {
  const [playPlace] = useSound('/sounds/place.mp3');
  const [playError] = useSound('/sounds/error.mp3');
  const [playHazard] = useSound('/sounds/hazard.mp3');

  return {
    playPlace,
    playError,
    playHazard
  };
} 