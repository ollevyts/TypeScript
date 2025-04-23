enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    UNPAID_VACATION = 'unpaid_vacation',
}

type PaymentInformation = {
    bankAccount: string,
    paymentMethod: "internal" | "external",
}

interface Human {
    id: number,
    name: string,
    surname: string,
    salary: number,
}

interface PreHiredEmployee extends Human {
    bankAccount: string,
}

interface Employee extends Human {
    paymentInformation: PaymentInformation,
    status: EmployeeStatus,
    departmentName: string,
}

interface Budget {
    debit: number,
    credit: number,
}

interface Department {
    id: string,
    name: string,
    domain: string,
    employees: Employee[],
    budget: Budget,

    currentBalance(): void,
    addEmployee(employee: Employee | PreHiredEmployee): void,
    removeEmployee(employee: Employee): string,
}

interface Accounting extends Department {
    balance: number,

    addToBalance(entity: Employee | Department): void;
    removeFromBalance(entity: Employee | Department): void;
    payAllSalaries(): void;
}

interface Company {
    name: string,
    departmentList: Department[],
    preHiredEmployees: PreHiredEmployee[];
    allPersonal: (Employee | PreHiredEmployee)[];
}


function isEmployee(person: Human): person is Employee {
    return (person as Employee).paymentInformation !== undefined;
}

function isPreHired(person: Human): person is PreHiredEmployee {
    return (person as PreHiredEmployee).bankAccount !== undefined &&
        (person as Employee).paymentInformation === undefined;
}

function isAccounting(department: Department): department is Accounting {
    return (department as Accounting).balance !== undefined;
}

class CompanyCreate implements Company {
    name: string;
    departmentList: Department[];
    preHiredEmployees: PreHiredEmployee[];
    allPersonal: (Employee | PreHiredEmployee)[];

    constructor(name: string) {
        this.name = name;
        this.departmentList = [];
        this.preHiredEmployees = [];
        this.allPersonal = [];
    }

    addPreHiredEmployees(employee: PreHiredEmployee) {
        this.preHiredEmployees.push(employee);
        this.allPersonal.push(employee)
    }

    private isPersonalAlreadyInDepartment(employee: Employee): boolean {
        return this.allPersonal.some((item: PreHiredEmployee | Employee) => isEmployee(item) && item.id === employee.id);
    }

    addDepartment(department: Department): void {
        this.departmentList.push(department);

        department.employees.forEach((employee: Employee) => {
            if (!this.isPersonalAlreadyInDepartment(employee)) {
                this.allPersonal.push(employee)
            }
        });
    }
}