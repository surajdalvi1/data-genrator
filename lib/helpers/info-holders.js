'use strict';

// Module Dependencies - builtin
const path = require('path');

// Module Dependencies - third party
const readYaml = require('read-yaml');
const writeYaml = require('write-yaml');

// Constant Declarations
const DETAILS_LOG = path.join(process.cwd(), '.details.yml');

class InfoHolders {
    constructor() {}
    write() {
        writeYaml.sync(DETAILS_LOG, global.uidHolder);
    }
    read() {
        let _data = {};
        try {
            _data = readYaml.sync(DETAILS_LOG);
        } catch (_err) {}
        return _data;
    }
}

module.exports = new InfoHolders;