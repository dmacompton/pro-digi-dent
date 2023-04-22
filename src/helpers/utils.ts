export function sortNumber(a: number, b: number): number {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export function sortString(a: string, b: string): number {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

export const merge = <T extends {}>(objFrom: T, objTo: T): T =>
    // @ts-ignore
    Object.keys(objFrom).reduce(
        // @ts-ignore
        (merged: T, key: keyof T) => {
            const value =
                objFrom[key] instanceof Object && !Array.isArray(objFrom[key])
                    ? merge(objFrom[key], merged[key] ?? {})
                    : objFrom[key];

            return {
                ...merged,
                [key]: value
            };
        },
        { ...objTo }
    );
