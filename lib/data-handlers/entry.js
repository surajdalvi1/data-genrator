'use strict';

// Module Dependencies - third party
const config = require('config');

// Module Dependencies - local
const transporter = require('./../transporter');

class Entry {
    constructor() {
        this._authtoken = config.get('credentials.authtoken');
    }
    create(_config, _data, _callback) {
        return transporter.create({
            urlSuffix: `/content_types/${_config.contentTypeUid}/entries?locale=en-us`,
            data: _data,
            headers: {
                authtoken: this._authtoken,
                api_key: _config.apiKey
            },
            details: {
                contentTypeUid: _config.contentTypeUid,
                apiKey: _config.apiKey,
                entity: 'entry'
            }
        }, (_err, _res) => {
            if (_err) {
                return _callback(_err, null);
            }
            return _callback(null, _res);
        })
    }
}

module.exports = new Entry;