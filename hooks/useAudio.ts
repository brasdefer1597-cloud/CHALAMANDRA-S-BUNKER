import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioStartedRef = useRef(false);

  const playSound = useCallback((id: string, options: { volume?: number } = {}) => {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      if (options.volume) {
        audio.volume = options.volume;
      }
      audio.currentTime = 0;
      audio.play().catch(e => console.error(`Audio playback failed for ${id}:`, e));
    }
  }, []);

  const handleFirstInteraction = useCallback(() => {
    if (!audioStartedRef.current) {
      playSound('audio-ambient', { volume: 0.1 });
      audioStartedRef.current = true;
    }
  }, [playSound]);

  const playHoverSound = useCallback(() => playSound('audio-hover'), [playSound]);

  const playClickSound = useCallback(() => {
    handleFirstInteraction();
    playSound('audio-click');
  }, [handleFirstInteraction, playSound]);

  const playSuccessSound = useCallback(() => {
    handleFirstInteraction();
    playSound('audio-success');
  }, [handleFirstInteraction, playSound]);

  return { playHoverSound, playClickSound, playSuccessSound };
};
