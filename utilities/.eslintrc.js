module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "serviceworker": true
    },
    "globals": {
        "self": "readonly"
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        // Customize your linting rules here
        "no-restricted-globals": ["error", "event", "fdescribe"]
    }
};