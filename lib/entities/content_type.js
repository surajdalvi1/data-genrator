'use strict';

// Module Dependencies - third party
const async = require('async');
const config = require('config');

// Module Dependencies - local
const _schema = require('./../structures/content-type/base');
const _dataHandler = require('./../data-handlers/content_type');

// Constant Declaration
const _contentTypeConfig = config.get('content_type');

class ContentType {
    constructor() {
        this._contentTypeSchema = {
            fields: _contentTypeConfig.schema,
            config: _contentTypeConfig.config
        }
    }
    build(_config, _callback) {
        let _tempConfig = this._contentTypeSchema;
        _tempConfig.config.apiKey = _config.apiKey;
        return _dataHandler.create({
            entity: 'content_type',
            apiKey: _config.apiKey
        }, _schema(_tempConfig).build(), _callback);
    }
    destroy(_config, _callback) {
        return async.eachLimit(_config.content_type, 50, (_uid, _cb) => {
            let _tempConfig = {
                apiKey: _config.apiKey,
                uid: _uid
            };
            return _dataHandler.destroy(_tempConfig, _cb);
        }, _callback);
    }
}

module.exports = new ContentType;