// Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання.
// Наприклад, тип значення для кожного ключа може бути число | рядок.
interface IUnion {
    [key: string]: number | string;
}

// Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями.
// Ключами можуть бути рядки, а значеннями — функції, які приймають будь-які аргументи.
interface IFunction {
    [key: string]: (...args: any[]) => any;
}

// Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта,
// подібного до масиву. Ключі повинні бути числами, а значення - певного типу.
interface IArray<T> {
    [index: number]: T;
}

// Створіть інтерфейс з певними властивостями та індексною сигнатурою.
// априклад, ви можете мати властивості типу name: string та індексну
// сигнатуру для додаткових динамічних властивостей.
interface IShapeWithExtras {
    name: string;
    color: string;
    [key: string]: string | number | boolean;
}

// Створіть два інтерфейси, один з індексною сигнатурою, а інший розширює перший, додаючи специфічні властивості.
interface IBase {
    [key: string]: number;
}

interface IExtended extends IBase {
    id: number;
    priority: number;
}

// Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє,
// чи відповідають значення певних ключів певним критеріям (наприклад, чи всі значення є числами).
interface INumber {
    [key: string]: number;
}

function checkAllNumbers(obj: INumber): boolean {
    return Object.values(obj).every((value: INumber) => typeof value === "number" && !isNaN(value));
}