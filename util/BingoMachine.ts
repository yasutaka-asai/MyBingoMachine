class BingoMachine {
    private numbers: number[];
    
    constructor(maxNumber: number = 75) {
        // 1 から maxNumber までの番号を生成する
        this.numbers = Array.from({length: maxNumber}, (_, i) => i + 1);
    }

    drawNumber(drawnNumbers: number[]): number | null {
        // すべての番号が抽選済みの場合は null を返す
        if (this.numbers.length === drawnNumbers.length) return null;
        // 未抽選の番号からランダムに番号を選ぶ
        while (true) {
            const number = Math.floor(Math.random() * this.numbers.length);
            if (!drawnNumbers.includes(number)) {
                return number;
            }
        }
    }

    getRemaining(): number[] {
        return [...this.numbers];
    }
}

export default BingoMachine;
