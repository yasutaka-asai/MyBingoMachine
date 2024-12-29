// ビンゴの数字を表示するコンポーネント
import React from "react";

interface DrawnNumberProps {
  number: number;
}

const DrawnNumber: React.FC<DrawnNumberProps> = ({ number }) => {
  const getBorderColorClass = (num: number) => {
    const range = Math.floor((num - 1) / 10);
    switch (range) {
      case 0:
        return "border-red-500"; // 1-10
      case 1:
        return "border-blue-500"; // 11-20
      case 2:
        return "border-green-500"; // 21-30
      case 3:
        return "border-yellow-500"; // 31-40
      case 4:
        return "border-purple-500"; // 41-50
      case 5:
        return "border-pink-500"; // 51-60
      case 6:
        return "border-orange-500"; // 61-70
      case 7:
        return "border-teal-500"; // 71-80
      default:
        return "border-gray-500"; // 81以上
    }
  };

  return (
    <div
      className={`
            bg-gray-100
            p-2
            text-center
            rounded-lg
            border-4
            ${getBorderColorClass(number)}
            text-4xl
            font-bold
            shadow-md
            hover:scale-105
            transition-transform
            duration-200
        `}
    >
      {number}
    </div>
  );
};

export default DrawnNumber;
