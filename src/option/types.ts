
export type Option<T> = T | null | undefined;

export type Inner<T> = T extends Option<infer O> ? O : never;
