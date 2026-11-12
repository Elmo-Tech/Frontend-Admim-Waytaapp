
export const data = async <T>(promise: Promise<{ data: T }>): Promise<T> => (await promise).data;
