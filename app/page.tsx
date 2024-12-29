"use client";
import { useEffect, useState } from "react";
import BingoMachine from "../util/BingoMachine";

// ローカルストレージに保存するためのキー
const STORAGE_KEY = "bingoDrawnNumbers";

const defaultMaxNumber = 75;

export default function Home() {
  const [maxNumber, setMaxNumber] = useState(defaultMaxNumber); // 数値の最大値
  const [bingoMachine, setBingoMachine] = useState(new BingoMachine(maxNumber)); // ビンゴマシン
  const [currentNumber, setCurrentNumber] = useState<number | null>(null); // 現在の番号
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]); // 既に抽選された番号

  // ページ読み込み時にローカルストレージから既に抽選された番号を取得する
  // コンポーネントの初期化(useState)ははレンダリング前に実施される
  // SSR時にはローカルストレージは存在しないため、初期化時には空配列を返す
  // レンダリング後にローカルストレージから取得するため、useEffectを使用する
  useEffect(() => {
    // ローカルストレージから既に抽選された番号を取得する
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDrawnNumbers(JSON.parse(stored));
    }
  }, []);

  // drawnNumbers が変更されたら、ローカルストレージに保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawnNumbers));
  }, [drawnNumbers]);

  // 最大値の変更処理
  const handleMaxNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMax = Math.max(
      1,
      Math.min(999, parseInt(event.target.value) || 75)
    );
    setMaxNumber(newMax);
    setBingoMachine(new BingoMachine(newMax));
  };

  const drawNumber = () => {
    // 番号を抽選する
    const number = bingoMachine.drawNumber();

    // 番号があれば、現在の番号として設定し、既に抽選された番号に追加する
    if (number) {
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
      <h1 className="text-4xl font-bold mb-8">ビンゴマシン</h1>
      <div className="text-center mb-4">
        <label className="block text-sm font-medium text-gray-700">
          最大値設定
          <input
            type="number"
            min="1"
            max="999"
            value={maxNumber}
            onChange={handleMaxNumberChange}
            className="ml-2 p-1 border rounded"
            disabled={drawnNumbers.length !== 0}
          />
        </label>
      </div>

      <div className="text-center mb-8">
        <div className="text-8xl font-bold mb-4">{currentNumber || "-"}</div>
        <button
          onClick={drawNumber}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          disabled={!bingoMachine.getRemaining().length}
        >
          抽選する
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {drawnNumbers.map((num, index) => (
          <div key={index} className="bg-gray-100 p-2 text-center rounded">
            {num}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={resetDrawnNumbers}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
