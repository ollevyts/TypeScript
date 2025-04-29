abstract class Shape {
    public readonly name: string;
    public readonly color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    public abstract calculateArea(): number;
}

interface IPrint {
    print(): void;
}

class Circle extends Shape {
    private radius: number;

    constructor(name: string, color: string, radius: number) {
        super(name, color);
        this.radius = radius;
    }

    public calculateArea(): number {
        return Math.PI * Math.pow(this.radius, 2);
    }
}

class Rectangle extends Shape implements IPrint {
    private width: number;
    private height: number;

    constructor(name: string, color: string, width: number, height: number) {
        super(name, color);
        this.width = width;
        this.height = height;
    }

    public calculateArea(): number {
        return this.width * this.height;
    }

    public print(): void {
        console.log(`Area of ${this.name} = width * height`);
    }
}

class Square extends Shape implements IPrint {
    private side: number;

    constructor(name: string, color: string, side: number) {
        super(name, color);
        this.side = side;
    }

    public calculateArea(): number {
        return Math.pow(this.side, 2);
    }

    public print(): void {
        console.log(`Area of ${this.name} = side * 2`);
    }
}

class Triangle extends Shape {
    private base: number;
    private height: number;

    constructor(name: string, color: string, base: number, height: number) {
        super(name, color);
        this.base = base;
        this.height = height
    }

    public calculateArea(): number {
        return 0.5 * this.base * this.height;
    }
}