class BingoMachine {
    private numbers: number[];
    
    constructor(maxNumber: number = 75) {
        this.numbers = Array.from({length: maxNumber}, (_, i) => i + 1);
    }

    drawNumber(): number | null {
        if (this.numbers.length === 0) return null;
        const index = Math.floor(Math.random() * this.numbers.length);
        const number = this.numbers[index];
        this.numbers.splice(index, 1);
        return number;
    }

    getRemaining(): number[] {
        return [...this.numbers];
    }
}

export default BingoMachine;
