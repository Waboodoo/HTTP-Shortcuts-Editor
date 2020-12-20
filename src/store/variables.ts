import {
    Base,
    Variable,
    VariableType,
} from '@/model';

const VARIABLE_ID_PLACEHOLDER_REGEX = RegExp('{{([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}|[0-9]+)}}', 'g');
const VARIABLE_KEY_PLACEHOLDER_REGEX = RegExp('{{{([A-Za-z0-9_]{1,30})}}}', 'g');
const VARIABLE_ID_JS_PLACEHOLDER_REGEX = RegExp('(getVariable|setVariable)\\(/\\*\\[variable]\\*/"([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}|[0-9]+)"/\\*\\[/variable]\\*/', 'g');
const VARIABLE_KEY_JS_PLACEHOLDER_REGEX = RegExp('(getVariable|setVariable)\\(["\']([A-Za-z0-9_]{1,30})["\']', 'g');

function transformVariables(
    data: Base,
    regularTransformation: ((input: string) => string),
    codeTransformation: ((input: string) => string),
): Base {
    return {
        ...data,
        categories: data.categories.map((c) => ({
            ...c,
            shortcuts: c.shortcuts.map((s) => ({
                ...s,
                url: regularTransformation((s.url)),
                username: regularTransformation((s.username)),
                password: regularTransformation((s.password)),
                authToken: regularTransformation((s.authToken)),
                bodyContent: regularTransformation((s.bodyContent)),
                proxyHost: s.proxyHost ? regularTransformation((s.proxyHost)) : null,
                parameters: s.parameters.map((p) => ({
                    ...p,
                    key: regularTransformation(p.key),
                    value: regularTransformation(p.value),
                })),
                headers: s.headers.map((h) => ({
                    ...h,
                    key: regularTransformation(h.key),
                    value: regularTransformation(h.value),
                })),
                responseHandling: s.responseHandling ? {
                    ...s.responseHandling,
                    successMessage: regularTransformation(s.responseHandling.successMessage),
                } : null,
                codeOnPrepare: codeTransformation(s.codeOnPrepare),
                codeOnSuccess: codeTransformation(s.codeOnSuccess),
                codeOnFailure: codeTransformation(s.codeOnFailure),
            })),
        })),
        variables: data.variables.map((v) => ({
            ...v,
            value: v.value && v.type === VariableType.CONSTANT
                ? regularTransformation(v.value)
                : v.value,
        })),
    };
}

function getVariableById(variableId: string, data: Base): Variable | null {
    return data.variables.find((v) => v.id === variableId) || null;
}

function getVariableByKey(variableKey: string, data: Base): Variable | null {
    return data.variables.find((v) => v.key === variableKey) || null;
}

export function replaceVariablePlaceholdersWithKeys(data: Base): Base {
    return transformVariables(
        data,
        (input: string) => input.replaceAll(
            VARIABLE_ID_PLACEHOLDER_REGEX,
            (match, variableId) => {
                const variable = getVariableById(variableId, data);
                return variable ? `{{{${variable.key}}}}` : match;
            },
        ),
        (input: string) => input.replaceAll(
            VARIABLE_ID_JS_PLACEHOLDER_REGEX,
            (match, functionName, variableId) => {
                const variable = getVariableById(variableId, data);
                return variable ? `${functionName}("${variable.key}"` : match;
            },
        ),
    );
}

export function replaceVariableKeysWithPlaceholders(data: Base): Base {
    return transformVariables(
        data,
        (input: string) => input.replaceAll(
            VARIABLE_KEY_PLACEHOLDER_REGEX,
            (match, variableKey) => {
                const variable = getVariableByKey(variableKey, data);
                return variable ? `{{${variable.id}}}` : match;
            },
        ),
        (input: string) => input.replaceAll(
            VARIABLE_KEY_JS_PLACEHOLDER_REGEX,
            (match, functionName, variableKey) => {
                const variable = getVariableByKey(variableKey, data);
                return variable ? `${functionName}(/*[variable]*/"${variable.id}"/*[/variable]*/` : match;
            },
        ),
    );
}
