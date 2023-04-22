export type TableMeta = {
    current_page: number;
    from: number;
    last_page: number;
    per_page: string;
    to: number;
    total: number;
};

export const INITIAL_TABLE_META: TableMeta = {
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: "10",
    to: 0,
    total: 0
};
