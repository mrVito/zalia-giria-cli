import { select } from '@inquirer/prompts';
import type { Column } from '@/ui/table/models/Column.ts';

export async function selectTable<T>(message: string, columns: Column<T>[], rows: T[]): Promise<T> {
    const widths = columns.map(column => Math.max(column.header.length, ...rows.map(row => column.value(row).length)));

    const formatRow = (cells: string[]) => cells.map((cell, i) => cell.padEnd(widths[i] ?? 0)).join('  ');

    return select({
        message: message,
        choices: rows.map(row => ({
            name: formatRow(columns.map(column => column.value(row))),
            value: row,
        })),
    });
}
