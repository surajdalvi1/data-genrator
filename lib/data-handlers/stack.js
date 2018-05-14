'use strict';

// Module Dependencies - third party
const config = require('config');

// Module Dependencies - local
const transporter = require('./../transporter');

class Stack {
    constructor() {
        this._authtoken = config.get('credentials.authtoken');
        this._orgUid = config.get('credentials.organization_uid');
    }
    create(_config, _data, _callback) {
        return transporter.create({
            urlSuffix: `/stacks`,
            data: _data,
            headers: {
                authtoken: this._authtoken,
                organization_uid: this._orgUid,
            },
            details: {
                entity: 'stack'
            }
        }, (_err, _res) => {
            if (_err) {
                return _callback(_err, null);
            }
            // Holds the api key
            let _apiKey = _res.stack.api_key;
            return _callback(null, _apiKey);
        })
    }
    destroy(_config, _callback) {
        return transporter.delete({
            urlSuffix: `/stacks`,
            headers: {
                authtoken: this._authtoken,
                organization_uid: this._orgUid,
                api_key: _config.apiKey
            },
            details: {
                entity: 'stack'
            },
            ignoreNotFound: true
        }, _callback)
    }
}

module.exports = new Stack;