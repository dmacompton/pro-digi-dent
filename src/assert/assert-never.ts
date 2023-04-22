export function assertInvalidValue(type: never): never;
export function assertInvalidValue<T extends string>(value: { readonly type: T }): never {
    throw new Error(`Unknown type - ${value.type}`);
}
