'use strict';

// Module Dependencies - third party
const _ = require('lodash');
const async = require('async');
const config = require('config');

// Module Dependencies - local
const _infoHolder = require('./../helpers/info-holders');
const _stack = require('./../entities/stack');
const _asset = require('./../entities/asset');
const _contentType = require('./../entities/content_type');

// Variable Declarations
let _config = config.get('config');
let _credentials = config.get('credentials');

class Destroyer {
    constructor() {
        this._data = _infoHolder.read();
        this._enabled = _config.freshen;
        this._continueProcess = true;
        // Checks whether the process is called as destructor
        if (process.argv[2] === "destroy") {
            this._enabled = true;
            this._continueProcess = false;
        }
    }
    destory(_destroyCb) {
        if (this._enabled && !_.isEmpty(this._data)) {
            // Checks whether any api key is given
            let _apiKey = _credentials.api_key;

            // Checks whether the stack is already given or
            // Created based on config
            if (_apiKey) {
                // Removes the asset, content type for the given stack
                return async.parallel([
                    _contentType.destroy.bind(_contentType, {
                        apiKey: _apiKey,
                        content_type: this._data.content_type[_apiKey]
                    }),
                    _asset.destroy.bind(_asset, {
                        apiKey: _apiKey,
                        asset: _.merge(this._data.asset[_apiKey] || [], this._data.file[_apiKey] || []),
                        asset_folder: this._data.asset_folder[_apiKey],
                    })
                ], (_err) => {
                    return _destroyCb(_err, this._continueProcess);
                });
            } else {
                // Gets all the stack's api key
                let _apiKeys = Object.keys(this._data.content_type);
                // Destroys all the stacks
                return _stack.destroy({
                    stack: _apiKeys
                }, (_err) => {
                    return _destroyCb(_err, this._continueProcess);
                });
            }
        } else {
            return _destroyCb(null, this._continueProcess);
        }
    }
}

module.exports = new Destroyer;