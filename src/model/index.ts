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
    uiType: ResponseHandlingType;
    successOutput: ResponseHandlingSuccessOutputType;
    failureOutput: ResponseHandlingFailureOutputType;
    successMessage: string;
    includeMetaInfo: boolean;
}

export interface Shortcut {
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
