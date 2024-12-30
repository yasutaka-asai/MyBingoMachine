import { useCallback } from 'react';

export const useSound = () => {
    const playSound = useCallback(async (soundIndex: number) => {
      const sounds = [
        { src: 'drumroll_and_rollend.mp3'},
        { src: 'tinpani_and_don.mp3'},
        { src: 'papa.mp3'},
      ];
      // 演出時間の調整 → page.tsxのtimerのdurationを変更する
      // アニメーションの長さ → globals.cssのanimationのdurationを変更する

      if (soundIndex === 0) {
        // ランダムに再生する
        const randomIndex = Math.floor(Math.random() * sounds.length);
        const sound = sounds[randomIndex];
        if (!sound) {
          console.error('選択された音声ファイルが見つかりません');
          return;
        }
        const audio = new Audio(sound.src);
        audio.play();
      } else {
        // 選択された音声を再生する
        const sound = sounds[soundIndex-1];
        if (!sound) {
          console.error('選択された音声ファイルが見つかりません');
          return;
        }
        const audio = new Audio(sound.src);
        audio.play();
      }
    }, []);
  
    return { playSound };
  };
