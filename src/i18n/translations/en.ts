export default {
    mainNav: {
        documentationLink: 'Documentation',
    },
    common: {
        dialogButtons: {
            delete: 'Delete',
        },
    },
    categories: {
        add: {
            buttonLabel: 'Add New Category',
        },
        hidden: {
            nameSuffix: '(hidden)',
            checkboxLabel: 'Hidden',
        },
        delete: {
            buttonLabel: 'Delete Category',
            prompt: 'Delete this category and all its shortcuts?',
        },
        name: {
            label: 'Category Name',
            placeholder: 'Enter a name for this category',
        },
        layoutType: {
            label: 'Layout Type',
            options: {
                list: 'List',
                denseGrid: 'Dense Grid',
                mediumGrid: 'Medium Grid',
                wideGrid: 'Wide Grid',
            },
        },
        shortcuts: {
            label: 'Shortcuts',
        },
    },
    shortcuts: {
        advancedSettings: {
            wifiSsid: {
                label: 'Required Wifi SSID',
                placeholder: 'Enter the name (SSID) of a wifi network to restrict this shortcut to only be executable while connected to that network.',
            },
        },
    },
    base: {
        title: {
            label: 'Main Toolbar Title',
            placeholder: 'Enter a custom title for the main toolbar',
        },
        globalCode: {
            label: 'Global Scripting',
            placeholder: 'Add JavaScript code here to run before the execution of every shortcut, e.g., to initialize variables or define functions that can be used by all shortcuts.',
        },
    },
    validation: {
        allCategoriesHidden: 'There must be at least one category which isn\'t hidden.',
        unnamedCategories: 'One or more categories don\'t have a name. Please name them.',
        unnamedShortcuts: 'One or more shortcuts don\'t have a name. Please name them.',
        unnamedVariables: 'One or more variables don\'t have a name. Please name them.',
        unnamedHeaders: 'One or more headers don\'t have a name. Please name them.',
        unnamedParameters: 'One or more request parameters don\'t have a name. Please name them.',
        duplicateVariables: 'Two or more variables have the same name. Please rename them.',
        invalidParameters: 'One or more request parameters are invalid. Please remove any file/files parameters from shortcuts that use (x-www-form-urlencoded) as the Request Body Type.',
        incompatibleVersion: 'The version of the HTTP Shortcuts app is incompatible with this version of the editor. Please make sure you have the latest version of the app installed.',
    },
};
