// eslint-disable-next-line import/prefer-default-export
export enum ExecutionType {
    APP = 'app',
    BROWSER = 'browser',
    SCRIPTING = 'scripting',
    TRIGGER = 'trigger',
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
}

export enum CategoryLayoutType {
    GRID = 'grid',
    LINEAR_LIST = 'linear_list',
}

export interface Shortcut {
    name: string;
    executionType: ExecutionType;
    method: HttpMethod;
    url: string;
    codeOnPrepare: string;
    codeOnSuccess: string;
    codeOnFailure: string;
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
