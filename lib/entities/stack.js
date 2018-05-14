'use strict';

// Module Dependencies - third party
const async = require('async');

// Module Dependencies - local
const _schema = require('./../structures/stack/base');
const _dataHandler = require('./../data-handlers/stack');

class Stack {
    constructor() {

    }
    build(_callback) {
        return _dataHandler.create({
            entity: 'stack'
        }, _schema.build(), _callback);
    }
    destroy(_config, _callback) {
        return async.eachLimit(_config.stack, 100, (_apiKey, _cb) => {
            let _tempConfig = {
                apiKey: _apiKey,
            }
            return _dataHandler.destroy(_tempConfig, _cb);
        }, _callback);
    }
}

module.exports = new Stack;