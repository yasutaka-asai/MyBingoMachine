import { useCallback } from 'react';

export const useSound = () => {
    const playSound = useCallback(async (soundIndex: number) => {
      const sounds = [
        { src: 'drumroll_and_rollend.mp3'},
        { src: 'drumroll.mp3'},
        { src: 'rollend.mp3'},
      ];
      // 演出時間の調整 → page.tsxのtimerのdurationを変更する
      // アニメーションの長さ → globals.cssのanimationのdurationを変更する
      const sound = sounds[soundIndex];
      if (!sound) {
        console.error('選択された音声ファイルが見つかりません');
        return;
      }
      const audio = new Audio(sound.src);
      audio.play();
    }, []);
  
    return { playSound };
  };
