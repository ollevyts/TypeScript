enum TodoStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}

enum SortBy {
    STATUS = "status",
    CREATION_DATE = "creationDate"
}

enum SortDirection {
    ASC = "asc",
    DESC = "desc"
}

interface TodoItem {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    status: TodoStatus;
}

abstract class TodoNote implements TodoItem {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    status: TodoStatus;

    constructor(title: string, content: string) {
        if (!title.trim() || !content.trim()) {
            throw new Error("Заголовок та зміст не можуть бути порожніми");
        }

        this.id = this.generateId();
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = TodoStatus.PENDING;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }

    markAsCompleted(): void {
        this.status = TodoStatus.COMPLETED;
        this.updatedAt = new Date();
    }

    abstract update(title: string, content: string): void;
}

class DefaultTodoNote extends TodoNote {
    update(title: string, content: string): void {
        if (!title.trim() || !content.trim()) {
            throw new Error("Заголовок та зміст не можуть бути порожніми");
        }

        this.title = title;
        this.content = content;
        this.updatedAt = new Date();
    }
}

class ConfirmationRequiredTodoNote extends TodoNote {
    update(title: string, content: string): void {
        if (!title.trim() || !content.trim()) {
            throw new Error("Заголовок та зміст не можуть бути порожніми");
        }

        const confirmed = confirm(`Ви впевнені, що хочете редагувати нотаток "${this.title}"?`);
        if (confirmed) {
            this.title = title;
            this.content = content;
            this.updatedAt = new Date();
        } else {
            throw new Error("Редагування відхилено користувачем");
        }
    }
}

class TodoList {
    private notes: TodoNote[] = [];

    addNote(note: TodoNote): void {
        this.notes.push(note);
    }

    deleteNote(id: string): boolean {
        const initialLength = this.notes.length;
        this.notes = this.notes.filter(note => note.id !== id);
        return initialLength !== this.notes.length;
    }

    getNoteById(id: string): TodoNote | undefined {
        return this.notes.find(note => note.id === id);
    }

    getAllNotes(): TodoNote[] {
        return [...this.notes];
    }

    markNoteAsCompleted(id: string): boolean {
        const note = this.getNoteById(id);
        if (note) {
            note.markAsCompleted();
            return true;
        }
        return false;
    }

    updateNote(id: string, title: string, content: string): boolean {
        const note = this.getNoteById(id);
        if (note) {
            try {
                note.update(title, content);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
        return false;
    }

    getTotalCount(): number {
        return this.notes.length;
    }

    getPendingCount(): number {
        return this.notes.filter(note => note.status === TodoStatus.PENDING).length;
    }

    searchNotes(query: string): TodoNote[] {
        const lowercaseQuery = query.toLowerCase();
        return this.notes.filter(note =>
            note.title.toLowerCase().includes(lowercaseQuery) ||
            note.content.toLowerCase().includes(lowercaseQuery)
        );
    }

    sortNotes(by: SortBy, direction: SortDirection = SortDirection.ASC): TodoNote[] {
        const sortedNotes = [...this.notes];

        sortedNotes.sort((a, b) => {
            if (by === SortBy.STATUS) {
                if (direction === SortDirection.ASC) {
                    return a.status.localeCompare(b.status);
                } else {
                    return b.status.localeCompare(a.status);
                }
            } else {
                if (direction === SortDirection.ASC) {
                    return a.createdAt.getTime() - b.createdAt.getTime();
                } else {
                    return b.createdAt.getTime() - a.createdAt.getTime();
                }
            }
        });

        return sortedNotes;
    }
}
