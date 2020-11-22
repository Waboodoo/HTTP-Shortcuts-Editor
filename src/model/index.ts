import { v4 as uuidv4 } from 'uuid';

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

export enum AuthenticationMethod {
    NONE = 'none',
    BASIC = 'basic',
    DIGEST = 'digest',
    BEARER = 'bearer',
}

export enum CategoryLayoutType {
    GRID = 'grid',
    LINEAR_LIST = 'linear_list',
}

export enum ResponseHandlingType {
    TOAST = 'toast',
    DIALOG = 'dialog',
    WINDOW = 'window',
}

export enum ResponseHandlingSuccessOutputType {
    RESPONSE = 'response',
    MESSAGE = 'message',
    NONE = 'none',
}

export enum ResponseHandlingFailureOutputType {
    DETAILED = 'detailed',
    SIMPLE = 'simple',
    NONE = 'none',
}

export enum RetryPolicy {
    NONE = 'none',
    WAIT_FOR_INTERNET = 'wait_for_internet',
}

export interface ResponseHandling {
    id: string;
    uiType: ResponseHandlingType;
    successOutput: ResponseHandlingSuccessOutputType;
    failureOutput: ResponseHandlingFailureOutputType;
    successMessage: string;
    includeMetaInfo: boolean;
}

export interface Parameter {
    id: string;
}

export enum HeaderType {
    STRING = 'string',
    FILE = 'file',
    FILES = 'files',
}

export interface Header {
    id: string;
    key: string;
    value: string;
    type: HeaderType;
    fileName: string;
}

export interface Shortcut {
    id: string;
    name: string;
    executionType: ExecutionType;
    method: HttpMethod;
    url: string;
    authentication: AuthenticationMethod;
    username: string;
    password: string;
    authToken: string;
    responseHandling: ResponseHandling | null;
    codeOnPrepare: string;
    codeOnSuccess: string;
    codeOnFailure: string;
    launcherShortcut: boolean;
    quickSettingsTileShortcut: boolean;
    requireConfirmation: boolean;
    retryPolicy: RetryPolicy;
    followRedirects: boolean;
    acceptCookies: boolean;
    acceptAllCertificates: boolean;
    proxyHost: string | null;
    proxyPort: number | null;
    parameters: Parameter[];
    headers: Headers[];
}

export interface Category {
    id: string;
    name: string;
    shortcuts: Shortcut[];
    hidden: boolean;
    layoutType: CategoryLayoutType;
}

export interface Base {
    categories: Category[];
    version: number;
    // TODO: Variables
}

export function cloneShortcut(shortcut: Shortcut): Shortcut {
    return {
        ...shortcut,
        id: uuidv4(),
        responseHandling: shortcut.responseHandling ? {
            ...shortcut.responseHandling,
            id: uuidv4(),
        } : null,
        headers: shortcut.headers.map((h) => ({
            ...h,
            id: uuidv4(),
        })),
        parameters: shortcut.parameters.map((h) => ({
            ...h,
            id: uuidv4(),
        })),
    };
}

export function createNewShortcut(): Shortcut {
    return {
        id: uuidv4(),
        name: '',
        executionType: ExecutionType.APP,
        method: HttpMethod.GET,
        url: '',
        authentication: AuthenticationMethod.NONE,
        username: '',
        password: '',
        authToken: '',
        responseHandling: {
            id: uuidv4(),
            uiType: ResponseHandlingType.TOAST,
            successOutput: ResponseHandlingSuccessOutputType.RESPONSE,
            failureOutput: ResponseHandlingFailureOutputType.DETAILED,
            successMessage: '',
            includeMetaInfo: false,
        },
        codeOnPrepare: '',
        codeOnSuccess: '',
        codeOnFailure: '',
        launcherShortcut: false,
        quickSettingsTileShortcut: false,
        requireConfirmation: false,
        retryPolicy: RetryPolicy.NONE,
        followRedirects: true,
        acceptCookies: true,
        acceptAllCertificates: false,
        proxyHost: null,
        proxyPort: null,
        parameters: [],
        headers: [],
    };
}

export function createNewCategory(): Category {
    return {
        id: uuidv4(),
        name: '',
        shortcuts: [],
        hidden: false,
        layoutType: CategoryLayoutType.LINEAR_LIST,
    };
}
