export const sub = (a: number, b: number): number[] => {
    let res = a - b;
    if (res < 0) {
        return [a, b-a];
    }

    return [res, 0];
}
