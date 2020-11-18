// eslint-disable-next-line import/prefer-default-export
export enum ExecutionType {
    APP = 'app',
    BROWSER = 'browser',
    SCRIPTING = 'scripting',
    TRIGGER = 'trigger',
}

export enum CategoryLayoutType {
    GRID = 'grid',
    LINEAR_LIST = 'linear_list',
}

export interface Shortcut {
    name: string;
    executionType: ExecutionType;
}

export interface Category {
    name: string;
    shortcuts: Shortcut[];
    hidden: boolean;
    layoutType: CategoryLayoutType;
}

export interface Base {
    categories: Category[];
    version: number;
}
