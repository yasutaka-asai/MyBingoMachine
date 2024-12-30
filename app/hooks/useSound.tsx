import { useCallback } from 'react';

export const useSound = () => {
    const playSound = useCallback(async () => {
      // 演出時間の調整 → page.tsxのtimerのdurationを変更する
      // アニメーションの長さ → globals.cssのanimationのdurationを変更する
      const audio = new Audio('drumroll_and_rollend.mp3');
      audio.play();
    }, []);
  
    return { playSound };
  };
