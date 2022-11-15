export const lastRowIndex = (arr: unknown[]) => arr.length - 1;

export const lastRowOf = <T>(arr: T[]): T => arr[arr.length - 1];

export const isEmpty = (arr: unknown[]) => arr.length === 0;
