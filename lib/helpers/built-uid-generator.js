'use strict';

// Module Dependencies - builtin
const crypto = require('crypto');

class BuiltUidGenerator {
    generate() {
        return `blt${crypto.randomBytes(8).toString('hex')}`;
    }
}

module.exports = new BuiltUidGenerator;