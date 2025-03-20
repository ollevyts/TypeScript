type Lecturer = {
    name: string,
    surname: string,
    position: string,
    company: string,
    experience: string,
    courses: string,
    contacts: string,
};

type Grade = {
    [key: string]: number,
}

type Visit = {
    [key: string]: boolean,
}

class School {
    // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

    private _areas: Array<Area> = [];
    private _lecturers: Array<Lecturer> = []; // Name, surname, position, company, experience, courses, contacts

    get areas(): Array<Area> {
        return this._areas;
    }

    get lecturers(): Array<Lecturer> {
        return this._lecturers;
    }

    addArea(area: Area): void {
        this._areas.push(area);
    }

    removeArea(area: Area): void {
        this._areas = this._areas.filter((item: Area) => item.name !== area.name)
    }

    addLecturer(lecturer: Lecturer): void {
        this._lecturers.push(lecturer);
    }

    removeLecturer(lecturer: Lecturer): void {
        this._lecturers = this._lecturers.filter((item: Lecturer) => item !== lecturer);
    }
}

class Area {
    // implement getters for fields and 'add/remove level' methods
    private _levels: Level[] = [];
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get levels(): Level[] {
        return this._levels;
    }

    addLevel(level: Level): void {
        this._levels.push(level);
    }

    removeLevel(level: Level): void {
        this._levels = this._levels.filter((item: Level) => item !== level);
    }
}

class Level {
    // implement getters for fields and 'add/remove group' methods

    private _groups: Array<Group> = [];

    private _name: string;
    private _description: string;

    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    get groups(): Array<Group> {
        return this._groups;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    addGroup(group: Group): void {
        this._groups.push(group);
    }

    removeGroup(group: Group): void {
        this._groups = this._groups.filter((item: Group) => item !== group);
    }
}

class Group {
    // implement getters for fields and 'add/remove student' and 'set status' methods

    private _area: string;
    private _status: string;
    private _students: Array<Student> = []; // Modify the array so that it has a valid toSorted method*

    directionName: string;
    levelName: string;

    constructor(directionName: string, levelName: string, area: string, status: string) {
        this.directionName = directionName;
        this.levelName = levelName;
        this._area = area;
        this._status = status;
    }

    get direction(): string {
        return this.directionName;
    }

    get level(): string {
        return this.levelName;
    }

    get area(): string {
        return this._area;
    }

    get status(): string {
        return this._status
    }

    get students(): Array<Student> {
        return this._students;
    }

    addStudent(student: Student): void {
        this._students.push(student);
    }

    removeStudent(student: Student): void {
        this._students = this._students.filter((item: Student) => item !== student);
    }

    setStatus(status: string): void {
        this._status = status;
    }

    showPerformance(): Array<Student> {
        const sortedStudents: Array<Student> = this._students.toSorted((a: Student, b: Student) => b.getPerformanceRating() - a.getPerformanceRating());
        return sortedStudents;
    }
}

class Student {
    // implement 'set grade' and 'set visit' methods

    private _firstName: string;
    private _lastName: string;
    private _birthYear: number;

    private _grades: Grade = {};
    private _visits: Visit = {};

    constructor(firstName: string, lastName: string, birthYear: number) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._birthYear = birthYear;
    }

    set fullName(value: string) {
        [this._lastName, this._firstName] = value.split(' ');
    }

    get fullName(): string {
        return `${this._lastName} ${this._firstName}`;
    }

    get age(): number {
        return new Date().getFullYear() - this._birthYear;
    }

    set grade({ lesson, grade }: { lesson: string; grade: number }) {
        this._grades[lesson] = grade;
    }

    set visit({ lesson, present }: { lesson: string; present: boolean }) {
        this._visits[lesson] = present;
    }

    getPerformanceRating(): number {
        const gradeValues: Array<number> = Object.values(this._grades);
        const visitValues: Array<boolean> = Object.values(this._visits);

        if (!gradeValues.length) return 0;

        const averageGrade: number = gradeValues.reduce((sum: number, grade: number) => sum + grade, 0) / gradeValues.length;
        const attendancePercentage: number = (visitValues.filter((present: boolean) => present).length / visitValues.length) * 100;

        return (averageGrade + attendancePercentage) / 2;
    }
}
