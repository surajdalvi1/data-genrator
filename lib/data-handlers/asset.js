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
        let _transportDetails = {
            urlSuffix: `/assets`,
            data: _data,
            headers: {
                authtoken: this._authtoken,
                api_key: _config.apiKey
            },
            details: {
                apiKey: _config.apiKey,
                entity: _config.entity,
                body_type: 'form'
            }
        };
        if (_config.entity === "asset_folder") {
            _transportDetails.urlSuffix = '/assets/folders';
            delete _transportDetails.details.body_type;
        }
        return transporter.create(_transportDetails, (_err, _res) => {
            if (_err) {
                return _callback(_err, null);
            }
            return _callback(null, _res);
        })
    }
    destroy(_config, _callback) {
        let _transportDetails = {
            urlSuffix: `/assets/${_config.uid}`,
            headers: {
                authtoken: this._authtoken,
                api_key: _config.apiKey
            },
            details: {
                apiKey: _config.apiKey,
                entity: _config.entity,
            },
            ignoreNotFound: true
        };
        if (_config.entity === "asset_folder") {
            _transportDetails.urlSuffix = `/assets/folders/${_config.uid}`;
        }
        return transporter.delete(_transportDetails, _callback)
    }
}

module.exports = new ContentType;