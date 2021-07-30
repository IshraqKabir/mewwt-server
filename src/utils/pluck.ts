
export const pluck = (array: any[], key: string) => {
    return array.map(obj => {
        return obj[ key ];
    });
};