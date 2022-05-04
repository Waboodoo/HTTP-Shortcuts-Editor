import { v4 as uuidv4 } from 'uuid';

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
    DENSE_GRID = 'dense_grid',
    MEDIUM_GRID = 'medium_grid',
    WIDE_GRID = 'wide_grid',
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

export enum ParameterType {
    STRING = 'string',
    FILE = 'file',
    FILES = 'files',
}

export interface Parameter {
    id: string;
    key: string;
    value: string;
    type: ParameterType;
    fileName: string;
}

export interface Header {
    id: string;
    key: string;
    value: string;
}

export enum RequestBodyType {
    FORM_DATA = 'form_data',
    X_WWW_FORM_URLENCODE = 'x_www_form_urlencode',
    CUSTOM_TEXT = 'custom_text',
    FILE = 'file',
}

export interface Shortcut {
    id: string;
    name: string;
    iconName: string | null;
    executionType: ExecutionType;
    method: HttpMethod;
    url: string;
    authentication: AuthenticationMethod;
    username: string;
    password: string;
    authToken: string;
    contentType: string;
    bodyContent: string;
    requestBodyType: RequestBodyType;
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
    headers: Header[];
    wifiSsid: string;
}

export interface Category {
    id: string;
    name: string;
    shortcuts: Shortcut[];
    hidden: boolean;
    layoutType: CategoryLayoutType;
}

export enum VariableType {
    CONSTANT = 'constant',
    TEXT = 'text',
    NUMBER = 'number',
    PASSWORD = 'password',
    SELECT = 'select',
    TOGGLE = 'toggle',
    COLOR = 'color',
    DATE = 'date',
    TIME = 'time',
    SLIDER = 'slider',
}

export interface VariableOption {
    id: string;
    label: string;
    value: string;
}

export interface Variable {
    id: string;
    key: string;
    type: VariableType;
    value: string | null;
    options: VariableOption[] | null;
    rememberValue: boolean;
    urlEncode: boolean;
    jsonEncode: boolean;
    data: string | null;
    flags: number;
    title: string;
}

export interface Base {
    categories: Category[];
    version: number;
    variables: Variable[];
    title: string | null;
    globalCode: string | null;
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

export function createNewShortcut(type: ExecutionType): Shortcut {
    return {
        id: uuidv4(),
        name: '',
        iconName: 'flat_color_lightbulb',
        executionType: type,
        method: HttpMethod.GET,
        url: '',
        authentication: AuthenticationMethod.NONE,
        username: '',
        password: '',
        authToken: '',
        responseHandling: type === ExecutionType.APP ? {
            id: uuidv4(),
            uiType: ResponseHandlingType.TOAST,
            successOutput: ResponseHandlingSuccessOutputType.RESPONSE,
            failureOutput: ResponseHandlingFailureOutputType.DETAILED,
            successMessage: '',
            includeMetaInfo: false,
        } : null,
        contentType: '',
        bodyContent: '',
        requestBodyType: RequestBodyType.CUSTOM_TEXT,
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
        wifiSsid: '',
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

export function createNewHeader(): Header {
    return {
        id: uuidv4(),
        key: '',
        value: '',
    };
}

export function createNewParameter(parameterType: ParameterType): Parameter {
    return {
        id: uuidv4(),
        type: parameterType,
        key: '',
        value: '',
        fileName: '',
    };
}

export function createNewVariable(): Variable {
    return {
        id: uuidv4(),
        type: VariableType.CONSTANT,
        key: '',
        value: '',
        options: null,
        rememberValue: false,
        urlEncode: false,
        jsonEncode: false,
        data: null,
        flags: 0,
        title: '',
    };
}
