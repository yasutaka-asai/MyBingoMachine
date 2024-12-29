import { useCallback } from 'react';

interface SoundConfig {
  src: string;
  duration: number;
}

export const useSound = () => {
    const playSound = useCallback(async () => {
      const sounds: SoundConfig[] = [
        { src: 'drumroll.mp3', duration: 1300 },
        { src: 'rollend.mp3', duration: 2000 }
      ];
  
      for (const sound of sounds) {
        const audio = new Audio(sound.src);
        try {
          await new Promise<void>((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
              audio.play();
              setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                resolve();
              }, sound.duration);
            });
          });
        } catch (error) {
          console.error('音声再生エラー:', error);
        }
      }
    }, []);
  
    return { playSound };
  };