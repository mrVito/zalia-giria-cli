export interface Column<T> {
    header: string;
    value: (row: T) => string;
}
