'use strict';

// Module Dependencies - third party
const _ = require('lodash');
const config = require('config');
const request = require('request');

class NetworkRequesterHelper {
    constructor() {}
    _urlGenerator(_config) {
        let _url = `${this._url}${_config.urlSuffix}`;
        let _query = _config.query;
        if (!_.isEmpty(_query) && _.isObject(_query)) {
            _url += "?";
            for (let _value in _query) {
                _url += `${_value}=${_query[_value]}&`;
            }
            // Removes the last ampersand
            _url = _url.substr(0, _url.length - 1);
        }
        return _url;
    }
}

class NetworkRequester extends NetworkRequesterHelper {
    constructor() {
        super();
        this._url = config.get('endpoints.v3.cma');
        this._authtoken = config.get('credentials.authtoken');
        this._orgUid = config.get('credentials.organization_uid');
    }
    create(_config, _callback) {
        let _requestDetails = {
            url: this._urlGenerator(_config),
            method: 'POST',
            headers: _config.headers
        };
        // Checks whether the request body is of form or json
        if (_.has(_config, 'details.body_type') && _config.details.body_type === "form") {
            _requestDetails.formData = _config.data;
        } else {
            _requestDetails.json = _config.data;
        }

        return request(_requestDetails, (_err, _res, _body) => {
            let _statusCode;
            if (_.isObject(_res) && 'statusCode' in _res) {
                // Gets the status code
                _statusCode = parseInt(_res.statusCode);
            }
            _body = _.isString(_body) ? JSON.parse(_body) : _body;
            // Checks whether the response went into an error or not
            if (_err || _.isUndefined(_statusCode) || _statusCode >= 400 || 'error_message' in _body) {
                // Logs the output
                console.log(`${_config.details.entity} creation error: ------- ${JSON.stringify(_err || _body, null, 4)} ---- ${JSON.stringify(_requestDetails, null, 4)}`);
                return _callback(_err || _body, null);
            }
            let _entity = _config.details.entity === "asset_folder" ? "asset" : _config.details.entity;
            // Logs the output
            console.log(`${_config.details.entity} creation success: ------- ${_body[_entity].api_key || _body[_entity].uid}`);
            return _callback(null, _body);
        })
    }
    read(_config, _callback) {
        return request({
            url: this._urlGenerator(_config),
            method: 'GET',
            headers: _config.headers
        }, (_err, _res, _body) => {
            // Gets the status code
            let _statusCode;
            if (_.isObject(_res) && 'statusCode' in _res) {
                _statusCode = parseInt(_res.statusCode);
            }
            // Checks whether the response went into an error or not
            if (_err || _.isUndefined(_statusCode) || _statusCode >= 400 || 'error_message' in _body) {
                return _callback(_err || _body, null);
            }
            return _callback(null, _body);
        })
    }
    delete(_config, _callback) {
        return request({
            url: this._urlGenerator(_config),
            json: _config.data || {},
            method: 'DELETE',
            headers: _config.headers
        }, (_err, _res, _body) => {
            // Gets the status code
            let _statusCode;
            if (_.isObject(_res) && 'statusCode' in _res) {
                _statusCode = parseInt(_res.statusCode);
            }
            _body = _.isString(_body) ? JSON.parse(_body) : _body;
            // Checks whether the response went into an error or not
            if (_err || _.isUndefined(_statusCode) || _statusCode >= 400 || 'error_message' in _body) {
                // Logs the output
                console.log(`${_config.details.entity} destruction error: ------- ${JSON.stringify(_err || _body, null, 4)} ---- ${JSON.stringify(_config, null, 4)}`);
                if (_config.ignoreNotFound) {
                    if (_statusCode === 404 || /not\s+found/i.test(_body.error_message)) {
                        return _callback(null, {});
                    }
                }
                return _callback(_err || _body, null);
            }
            // Logs the output
            console.log(`${_config.details.entity} destruction success: ------- ${_config.urlSuffix} ----- ${JSON.stringify(_config.headers, null, 4)}`);
            return _callback(null, _body);
        })
    }
}

module.exports = new NetworkRequester;