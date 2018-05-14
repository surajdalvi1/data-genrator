'use strict';

// Module Dependencies - third party
const config = require('config');

// Module Dependencies - local
const transporter = require('./../transporter');

class ContentType {
    constructor() {
        this._authtoken = config.get('credentials.authtoken');
    }
    create(_config, _data, _callback) {
        return transporter.create({
            urlSuffix: `/content_types`,
            data: _data,
            headers: {
                authtoken: this._authtoken,
                api_key: _config.apiKey
            },
            details: {
                apiKey: _config.apiKey,
                entity: 'content_type'
            }
        }, (_err, _res) => {
            if (_err) {
                return _callback(_err, null);
            }
            return _callback(null, _res);
        })
    }
    destroy(_config, _callback) {
        return transporter.delete({
            urlSuffix: `/content_types/${_config.uid}`,
            headers: {
                authtoken: this._authtoken,
                api_key: _config.apiKey
            },
            query: {
                force: true
            },
            details: {
                apiKey: _config.apiKey,
                entity: 'content_type'
            },
            ignoreNotFound: true
        }, _callback)
    }
}

module.exports = new ContentType;