"use client";
import { useEffect, useState } from "react";
import { useSound } from "./hooks/useSound";
import BingoMachine from "../util/BingoMachine";
import DrawnNumber from "./components/DrawnNumber";

// ローカルストレージに保存するためのキー
const STORAGE_KEY = "bingoDrawnNumbers";

const defaultMaxNumber = 75;

export default function Home() {
  const { playSound } = useSound();
  const [maxNumber, setMaxNumber] = useState(defaultMaxNumber); // 数値の最大値
  const [bingoMachine, setBingoMachine] = useState(new BingoMachine(maxNumber)); // ビンゴマシン
  const [currentNumber, setCurrentNumber] = useState<number | null>(null); // 現在の番号
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]); // 既に抽選された番号
  const [visibleNumbers, setVisibleNumbers] = useState<number[]>([]); // 表示される番号
  const [isInitialRender, setIsInitialRender] = useState(true); // 初回レンダリングかどうか
  const [isDrumRoll, setIsDrumRoll] = useState(false); // ドラムロール中かどうか
  const [soundIndex, setSoundIndex] = useState(0); // 音声のインデックス

  // ページ読み込み時にローカルストレージから既に抽選された番号を取得する
  // コンポーネントの初期化(useState)ははレンダリング前に実施される
  // SSR時にはローカルストレージは存在しないため、初期化時には空配列を返す
  // レンダリング後にローカルストレージから取得するため、useEffectを使用する
  useEffect(() => {
    // ローカルストレージから既に抽選された番号を取得する
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedNumbers = JSON.parse(stored);
      // 最後の番号を現在の番号として設定
      setCurrentNumber(storedNumbers[storedNumbers.length - 1]);
      // 既に抽選された番号を設定
      setDrawnNumbers(storedNumbers);
      // ページ読み込み時には即座にすべての番号を表示する
      setVisibleNumbers(storedNumbers);
    }

    // 初回実行時に初回レンダリングフラグを下ろす
    setIsInitialRender(false);
  }, []);

  // drawnNumbers が変更されたら、ローカルストレージに保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawnNumbers));
  }, [drawnNumbers]);

  // useEffectで遅延処理を追加
  useEffect(() => {
    if (drawnNumbers.length > visibleNumbers.length) {
      // ドラムロール中のフラグを立てる
      setIsDrumRoll(true);

      // 初回レンダリング以外では、演出に合わせて表示を遅延させる
      const timer = setTimeout(() => {
        setVisibleNumbers(drawnNumbers.slice(0, visibleNumbers.length + 1));
        // ドラムロール中のフラグを下ろす
        setIsDrumRoll(false);
      }, 3000); // 抽選演出と同程度の遅延を含ませる
      // 音声の長さ → useSoundのdurationを変更する
      // アニメーションの長さ → globals.cssのanimationのdurationを変更する

      // タイマーをクリアする
      return () => clearTimeout(timer);
    }
  }, [drawnNumbers, visibleNumbers, isInitialRender]);

  // 最大値の変更処理
  const handleMaxNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 入力が空の場合はそのまま空文字を返す
    if (event.target.value === "") {
      setMaxNumber(0);
      return;
    }

    // 数値の場合は、1-999の範囲で設定する
    const newMax = Math.max(
      1,
      Math.min(999, parseInt(event.target.value) || 75)
    );
    setMaxNumber(newMax);
    setBingoMachine(new BingoMachine(newMax));
  };

  // 再生する音声を変更する
  const handleSoundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSoundIndex(parseInt(event.target.value));
  };

  const drawNumber = () => {
    // 番号を抽選する
    const number = bingoMachine.drawNumber(drawnNumbers);

    // 番号があれば、現在の番号として設定し、既に抽選された番号に追加する
    if (number) {
      playSound(soundIndex);
      setCurrentNumber(number);
      setDrawnNumbers((prev) => [...prev, number]);
    }
  };

  // ビンゴマシンを初期化する処理
  const resetDrawnNumbers = () => {
    setMaxNumber(defaultMaxNumber);
    setBingoMachine(new BingoMachine(defaultMaxNumber));
    setCurrentNumber(null);
    setDrawnNumbers([]);
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-brush mb-8 text-center text-red-700 py-4 bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 relative z-10 shadow-lg border-2 border-red-300 rounded-md">
        <div className="relative z-20 mb-4">
          🎍お正月🎍
        </div>
        <div className="relative z-20">
          ビンゴ大会
        </div>
        <span className="absolute inset-0 bg-white opacity-20 rounded-lg blur-md"></span>
      </h1>

      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div
            className={"text-[12rem] mb-4 animate-number-change text-shadow-lg font-brush"}
            key={currentNumber}
          >
            {currentNumber || "-"}
          </div>
        </div>
        <br />
        <button
          onClick={drawNumber}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-12 py-6 rounded-lg font-bold text-4xl hover:from-blue-600 hover:to-blue-800 duration-200 shadow-md"
          disabled={isDrumRoll || !bingoMachine.getRemaining().length}
        >
          抽選する
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-4">
        <div className="text-center mr-4">
          <label className="block text-sm font-medium text-gray-700">
            ビンゴの最大値設定：
            <input
              type="number"
              min="1"
              max="999"
              value={maxNumber || ""}
              onChange={handleMaxNumberChange}
              className="ml-2 p-1 border rounded text-black"
              disabled={drawnNumbers.length !== 0}
            />
          </label>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center">
            <label className="mr-4 text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="sound"
                value={0}
                checked={soundIndex === 0}
                onChange={handleSoundChange}
                className="mr-1"
              />
              ランダム
            </label>
            <label className="mr-4 text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="sound"
                value={1}
                checked={soundIndex === 1}
                onChange={handleSoundChange}
                className="mr-1"
              />
              サウンド1
            </label>
            <label className="mr-4 text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="sound"
                value={2}
                checked={soundIndex === 2}
                onChange={handleSoundChange}
                className="mr-1"
              />
              サウンド2
            </label>
            <label className="text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="sound"
                value={3}
                checked={soundIndex === 3}
                onChange={handleSoundChange}
                className="mr-1"
              />
              サウンド3
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 auto-rows-auto gap-4 mx-auto max-w-7xl">
        {drawnNumbers.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-xl py-8">
            抽選された番号がここに表示されます
          </div>
        ) : (
          visibleNumbers.map((num, index) => (
            <div key={index} className="w-full justify-center">
              <DrawnNumber number={num}/>
            </div>
          ))
        )}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={resetDrawnNumbers}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-800 duration-200 shadow-md"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
