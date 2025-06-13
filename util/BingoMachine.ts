class BingoMachine {
    private numbers: number[];
    
    constructor(maxNumber: number = 75) {
        // 1 から maxNumber までの番号を生成する
        this.numbers = Array.from({length: maxNumber}, (_, i) => i + 1);
    }

    drawNumber(drawnNumbers: number[]): number | null {
        // すべての番号が抽選済みの場合は null を返す
        if (this.numbers.length === drawnNumbers.length) return null;
        
        const drawnSet = new Set(drawnNumbers);
        const remaining = this.numbers.filter(num => !drawnSet.has(num));
        
        const randomIndex = Math.floor(Math.random() * remaining.length);
        return remaining[randomIndex];
    }

    getRemaining(): number[] {
        return [...this.numbers];
    }
}

export default BingoMachine;
