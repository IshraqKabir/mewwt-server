export const pluck = <T>(array: any[], key: keyof T): any[] => {
    return array.map((obj) => {
        return obj[key];
    });
};
