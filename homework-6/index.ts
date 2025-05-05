interface Movie {
    name: string;
    releaseYear: number;
    rating: number;
    awards: string[];
}

interface Category {
    name: string;
    movies: Movie[];
}

interface BaseFilter<T> {
    fieldName: keyof T;
}

interface MatchFilter<T> extends BaseFilter<T> {
    filter: any;
}

interface RangeFilter<T> extends BaseFilter<T> {
    filter: any;
    filterTo: any;
}

interface ValuesFilter<T> extends BaseFilter<T> {
    values: any[];
}

type Filter<T> = MatchFilter<T> | RangeFilter<T> | ValuesFilter<T>;

interface FilterState<T> {
    filters: Filter<T>[];
    applyFiltersValue(filters: Filter<T>[]): void;
    applySearchValue(fieldName: keyof T, value: any): void;
}

type MovieNameFilter = MatchFilter<Movie>;
type MovieYearFilter = RangeFilter<Movie>;
type MovieRatingFilter = RangeFilter<Movie>;
type MovieAwardsFilter = ValuesFilter<Movie>;
type CategoryNameFilter = MatchFilter<Category>;

class MovieList {
    private movies: Movie[] = [];
    private filterState: MovieFilterState;

    constructor(movies: Movie[] = []) {
        this.movies = movies;
        this.filterState = new MovieFilterState();
    }

    getAll(): Movie[] {
        return this.applyFilters(this.movies);
    }

    applyFilters(movies: Movie[]): Movie[] {
        return movies.filter(movie => {
            return this.filterState.filters.every(filter => {
                const fieldName = filter.fieldName;
                const fieldValue = movie[fieldName];

                if ('values' in filter) {
                    // ValuesFilter
                    return filter.values.some(value => {
                        if (Array.isArray(fieldValue)) {
                            return (fieldValue as any[]).includes(value);
                        }
                        return fieldValue === value;
                    });
                } else if ('filterTo' in filter) {
                    // RangeFilter
                    return fieldValue >= filter.filter && fieldValue <= filter.filterTo;
                } else {
                    // MatchFilter
                    if (typeof fieldValue === 'string' && typeof filter.filter === 'string') {
                        return fieldValue.toLowerCase().includes(filter.filter.toLowerCase());
                    }
                    return fieldValue === filter.filter;
                }
            });
        });
    }

    get filterManager(): MovieFilterState {
        return this.filterState;
    }
}

class CategoryList {
    private categories: Category[] = [];
    private filterState: CategoryFilterState;

    constructor(categories: Category[] = []) {
        this.categories = categories;
        this.filterState = new CategoryFilterState();
    }

    getAll(): Category[] {
        return this.applyFilters(this.categories);
    }

    applyFilters(categories: Category[]): Category[] {
        return categories.filter(category => {
            return this.filterState.filters.every(filter => {
                const fieldName = filter.fieldName;
                const fieldValue = category[fieldName];

                if ('filter' in filter && !('filterTo' in filter)) {
                    if (typeof fieldValue === 'string' && typeof filter.filter === 'string') {
                        return fieldValue.toLowerCase().includes(filter.filter.toLowerCase());
                    }
                    return fieldValue === filter.filter;
                }
                return true;
            });
        });
    }

    get filterManager(): CategoryFilterState {
        return this.filterState;
    }
}

class MovieFilterState implements FilterState<Movie> {
    filters: Filter<Movie>[] = [];

    applyFiltersValue(filters: Filter<Movie>[]): void {
        this.filters = filters;
    }

    applySearchValue(fieldName: keyof Movie, value: any): void {
        this.filters = this.filters.filter(filter => filter.fieldName !== fieldName);

        if (fieldName === 'name') {
            this.filters.push({
                fieldName,
                filter: value
            } as MovieNameFilter);
        } else if (fieldName === 'releaseYear') {
            this.filters.push({
                fieldName,
                filter: value,
                filterTo: value
            } as MovieYearFilter);
        } else if (fieldName === 'rating') {
            this.filters.push({
                fieldName,
                filter: value,
                filterTo: value
            } as MovieRatingFilter);
        } else if (fieldName === 'awards') {
            this.filters.push({
                fieldName,
                values: [value]
            } as MovieAwardsFilter);
        }
    }

    setYearRange(from: number, to: number): void {
        this.filters = this.filters.filter(filter => filter.fieldName !== 'releaseYear');
        this.filters.push({
            fieldName: 'releaseYear',
            filter: from,
            filterTo: to
        } as MovieYearFilter);
    }

    setRatingRange(from: number, to: number): void {
        this.filters = this.filters.filter(filter => filter.fieldName !== 'rating');
        this.filters.push({
            fieldName: 'rating',
            filter: from,
            filterTo: to
        } as MovieRatingFilter);
    }

    setAwardsFilter(awards: string[]): void {
        this.filters = this.filters.filter(filter => filter.fieldName !== 'awards');
        this.filters.push({
            fieldName: 'awards',
            values: awards
        } as MovieAwardsFilter);
    }
}

class CategoryFilterState implements FilterState<Category> {
    filters: Filter<Category>[] = [];

    applyFiltersValue(filters: Filter<Category>[]): void {
        this.filters = filters;
    }

    applySearchValue(fieldName: keyof Category, value: any): void {
        this.filters = this.filters.filter(filter => filter.fieldName !== fieldName);

        // Додаємо новий фільтр
        if (fieldName === 'name') {
            this.filters.push({
                fieldName,
                filter: value
            } as CategoryNameFilter);
        }
    }
}

// Приклад використання
function demoUsage() {
    // Створення фільмів
    const movies: Movie[] = [
        { name: "Inception", releaseYear: 2010, rating: 8.8, awards: ["Oscar", "Golden Globe"] },
        { name: "The Dark Knight", releaseYear: 2008, rating: 9.0, awards: ["Oscar", "BAFTA"] },
        { name: "Interstellar", releaseYear: 2014, rating: 8.6, awards: ["Oscar"] }
    ];

    // Створення категорій
    const categories: Category[] = [
        { name: "Sci-Fi", movies: [movies[0], movies[2]] },
        { name: "Action", movies: [movies[1]] },
        { name: "Drama", movies: [movies[2]] }
    ];

    // Створення списків
    const movieList = new MovieList(movies);
    const categoryList = new CategoryList(categories);

    // Приклад фільтрації фільмів за назвою
    movieList.filterManager.applySearchValue('name', 'Inter');
    console.log("Фільми з 'Inter' в назві:", movieList.getAll());

    // Приклад фільтрації фільмів за діапазоном років
    movieList.filterManager.setYearRange(2009, 2015);
    console.log("Фільми з 2009 по 2015:", movieList.getAll());

    // Приклад фільтрації категорій за назвою
    categoryList.filterManager.applySearchValue('name', 'Sci');
    console.log("Категорії з 'Sci' в назві:", categoryList.getAll());
}