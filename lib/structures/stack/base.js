/**
 * Base structure of Stack
 */
'use strict';

// Constant Declarations
const REQUEST_WRAPPER = 'stack';

// Variable Declarations
let _uidCounter = 0;

/*
   Builds the stack 
 */
class StackBuilder {
    constructor() {}
    build() {
        return {
            [REQUEST_WRAPPER]: {
                "name": `Stack ${++_uidCounter}`,
                "description": `Stack ${_uidCounter} description`,
                "master_locale": "en-us"
            }
        };
    }
}

module.exports = new StackBuilder;