'use strict';

// Module Dependencies - third party
const _ = require('lodash');
const async = require('async');
const config = require('config');

// Module Dependencies - local
const _dataHandler = require('./../data-handlers/asset');
const _schema = require('./../structures/asset/base');

// Constant Declaration
const _assetFolderConfig = config.get('asset_folder');

class Asset {
    constructor() {}
    _asset(_config, _callback) {
        let _assetFolderCount = _.isNumber(_assetFolderConfig.count) ?
            _assetFolderConfig.count : 0;
        // Branches between folder and asset creation
        if (_assetFolderCount !== 0) {
            return this._assetFolder(_config, _callback);
        } else {
            _config.entity = "asset";
            return this._creator(_config, (_err, _res) => {
                if (_err) {
                    return _callback(_err);
                }
                // Holds the uid for future use
                global.uidHolder.asset[_config.apiKey].push(_res.asset.uid);
                return _callback(null);
            });
        }
    }
    _assetFolder(_config, _assetFolderCb) {
        let _assetFolderCount = _assetFolderConfig.count + 1;
        let _assetFolderAssetPresence = _assetFolderConfig.asset_presence;
        let _parentUid = "";

        // Loops through the folder creation in a synchronous way
        return async.timesSeries(_assetFolderCount, (_iteration, _next) => {
            return async.parallel([
                // Creates the folder
                _cb => {
                    // We dont need to create folder at the last iteration
                    if ((_iteration + 1) === _assetFolderCount) {
                        return _cb(null);
                    }
                    _config.entity = "asset_folder";
                    // Adds the parent
                    if (!_.isEmpty(_parentUid)) {
                        _config.parentUid = _parentUid;
                    }
                    return this._creator(_config, (_err, _res) => {
                        if (_err) {
                            return _cb(_err);
                        }
                        // Holds the uid of the first level
                        if (_iteration === 0) {
                            // Holds the uid for future use
                            global.uidHolder.asset_folder[_config.apiKey].push(_res.asset.uid);
                        }
                        _parentUid = _res.asset.uid;
                        return _cb(null);
                    });
                },
                // Creates the asset
                _cb => {
                    // Checks whether the parent uid available.
                    // In case of asset presence is expected in the last level, all the iterations
                    // other than last will be ignored
                    // Options for Asset presence - last, each
                    if ((_.isEmpty(_parentUid)) ||
                        (_assetFolderAssetPresence === "last" && (_iteration + 1) !== _assetFolderCount)) {
                        return _cb(null);
                    }
                    _config.entity = "asset";
                    _config.parentUid = _parentUid;
                    return this._creator(_config, _cb);
                }
            ], _next);
        }, _assetFolderCb);
    }
    _creator(_config, _callback) {
        let _assetCreationConfig = {
            entity: _config.entity,
            apiKey: _config.apiKey
        };
        // Adds the asset parent
        if (_config.parentUid) {
            _assetCreationConfig.parentUid = _config.parentUid
        }
        return _dataHandler.create(_assetCreationConfig,
            _schema.build(_assetCreationConfig),
            _callback);
    }
    _file(_config, _callback) {
        let _assetCreationConfig = {
            entity: 'asset',
            apiKey: _config.apiKey
        };
        return _dataHandler.create(_assetCreationConfig,
            _schema.build(_assetCreationConfig),
            (_err, _res) => {
                if (_err) {
                    return _callback(_err);
                }
                // Holds the uid for future use
                global.uidHolder.file[_config.apiKey].push(_res.asset.uid);
                return _callback(null, _res);
            });
    }
    build(_config, _callback) {
        return this[`_${_config.type}`](_config, _callback);
    }
    destroy(_config, _callback) {
        let _handler = (_entity, _handlerConfig, _handlerCb) => {
            return async.eachLimit(_handlerConfig[_entity], 50, (_uid, _cb) => {
                let _tempConfig = {
                    apiKey: _handlerConfig.apiKey,
                    entity: _entity,
                    uid: _uid
                }
                return _dataHandler.destroy(_tempConfig, _cb);
            }, _handlerCb);
        }
        return async.parallel([
            _assetCb => {
                return _handler('asset', _config, _assetCb);
            },
            _folderCb => {
                return _handler('asset_folder', _config, _folderCb);
            }
        ], _callback);
    }
}

module.exports = new Asset;