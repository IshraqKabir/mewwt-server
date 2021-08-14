
export const getOffset = (pageNumber: number): number => {
    return !pageNumber ? 0 : pageNumber < 1 ? 0 : (pageNumber - 1) * 20;
};