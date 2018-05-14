'use strict';

// Module Dependencies - third party
const _ = require('lodash');
const async = require('async');
const config = require('config');

// Module Dependencies - local
const _stack = require('./../entities/stack');
const _contentType = require('./../entities/content_type');
const _entry = require('./../entities/entry');
const _asset = require('./../entities/asset');
const _infoHolder = require('./../helpers/info-holders');
const _destroyer = require('./destroyer');

// Constant Declarations
const DATA_CONFIG = {
    stack: 0,
    content_type: 0,
    entry: 0,
    asset: 0
};
const NODE_ENV = process.env.NODE_ENV;

// Variable Declarations - global
global.uidHolder = {
    entry: {},
    content_type: {},
    asset: {},
    asset_folder: {},
    file: {}
};

class Processor {
    constructor() {
            this._dataConfig = _.merge(DATA_CONFIG, config.get('data'));
            this._apiKeyConfig = config.get('credentials').api_key;
            // Checks whether any api key is requested in the configurations
            if (_.isString(this._apiKeyConfig)) {
                this._dataConfig.stack = 1;
            }
        }
        // Creates the Stack
    _stack(_stackCreationCb) {
            // Checks whether any api key is requested in the configurations
            if (_.isString(this._apiKeyConfig) && NODE_ENV !== "localdev") {
                global.uidHolder.entry[this._apiKeyConfig] = {};
                global.uidHolder.content_type[this._apiKeyConfig] = [];
                global.uidHolder.file[this._apiKeyConfig] = [];
                global.uidHolder.asset[this._apiKeyConfig] = [];
                global.uidHolder.asset_folder[this._apiKeyConfig] = [];
                return _stackCreationCb(null, this._apiKeyConfig);
            }
            // Creates the stack
            return _stack.build((_stackErr, _stackApiKey) => {
                if (_stackErr) {
                    return _stackCreationCb(_stackErr);
                }
                global.uidHolder.entry[_stackApiKey] = {};
                global.uidHolder.content_type[_stackApiKey] = [];
                global.uidHolder.file[_stackApiKey] = [];
                global.uidHolder.asset[_stackApiKey] = [];
                global.uidHolder.asset_folder[_stackApiKey] = [];
                return _stackCreationCb(null, _stackApiKey);
            });
        }
        // Creates the assets
    _asset(_stackApiKey, _stackCreationCompletionCb) {
            let _fileFieldCountInContentType = parseInt(config.get('content_type.schema').file);
            let _fileFieldLoopCount = isNaN(_fileFieldCountInContentType) ? 0 : _fileFieldCountInContentType;
            let _assetLoopCount = this._dataConfig.asset;
            return async.series([
                _callback => {
                    // Loops through the number of assets requested
                    return async.timesLimit(_assetLoopCount, 50, (_aN, _aDone) => {
                        // Creates the asset
                        return _asset.build({
                            apiKey: _stackApiKey,
                            type: 'asset'
                        }, _aDone)
                    }, _callback);
                },
                _callback => {
                    // Loops through the number of file fields requested
                    return async.timesLimit(_fileFieldLoopCount, 50, (_aN, _aDone) => {
                        // Creates the asset
                        return _asset.build({
                            apiKey: _stackApiKey,
                            type: 'file'
                        }, _aDone)
                    }, _callback);
                }
            ], (_err, _data) => {
                if (_err) {
                    return _stackCreationCompletionCb(_err);
                }
                return _stackCreationCompletionCb(null, _stackApiKey);
            });
        }
        // Creates Content Types and Entries
    _contentTypeEntry(_stackApiKey, _stackCreationCompletionCb) {
            // Loops through the number of content types requested
            return async.timesSeries(this._dataConfig.content_type, (_cN, _cDone) => {
                // Creates the content type
                return _contentType.build({
                    apiKey: _stackApiKey
                }, (_contentTypeErr, _contentTypeData) => {
                    if (_contentTypeErr) {
                        // In case of title not unique error, the entry creation will be skipped
                        if ((_.has(_contentTypeErr, 'errors.title') && /not\s+unique/i.test(_contentTypeErr.errors.title[0])) ||
                            (_.has(_contentTypeErr, 'errors.uid') && /not\s+unique/i.test(_contentTypeErr.errors.uid[0]))) {
                            return _cDone(null, {});
                        }
                        return _cDone(_contentTypeErr);
                    }
                    let _contentTypeUid = _contentTypeData.content_type.uid;
                    global.uidHolder.entry[_stackApiKey][_contentTypeUid] = [];
                    global.uidHolder.content_type[_stackApiKey].push(_contentTypeUid);
                    // If the content type is single, then only one entry will be created
                    let _entryNumbers = _contentTypeData.content_type.options.singleton ? 1 : this._dataConfig.entry;
                    let _entryEntity = _entry(_contentTypeData);
                    // Loops through the number of entries requested
                    return async.timesLimit(_entryNumbers, 100, (_eN, _eDone) => {
                        // Creates the entry
                        return _entryEntity.build({
                            apiKey: _stackApiKey,
                            _entryIteration: _eN
                        }, (_entryErr, _entryData) => {
                            if (_entryErr) {
                                return _eDone(_entryErr);
                            }
                            global.uidHolder.entry[_stackApiKey][_contentTypeData.content_type.uid].push(_entryData.entry.uid);
                            return _eDone(null, _entryData);
                        })
                    }, _cDone)
                })
            }, _stackCreationCompletionCb)
        }
        // Acts as the entry point of the process
    _start(_startCb) {
            console.log('Process Started!!!!!!!!!!!!!!!!!!!!!!');
            return _startCb(null);
        }
        // Acts as the core of the process
    _core(_coreCb) {
            return async.waterfall([
                _destroyer.destory.bind(_destroyer),
                (_continueProcess, _cb) => {
                    // Checks whether the process is started for destruction
                    if (!_continueProcess) {
                        return _cb(null, {});
                    }
                    // Loops through the number of stack requested
                    return async.timesLimit(this._dataConfig.stack, 2, (_sN, _stackDone) => {
                        return async.waterfall([
                            this._stack.bind(this),
                            this._asset.bind(this),
                            this._contentTypeEntry.bind(this)
                        ], _stackDone);
                    }, _cb);
                }
            ], _coreCb);
        }
        // Acts as the end point of the process
    _end(_endCb) {
            console.log('Process Finished!!!!!!!!!!!!');
            return _endCb(null);
        }
        // Acts as the starter of the process
    starter() {
        return async.series([
            this._start.bind(this),
            this._core.bind(this),
            this._end.bind(this)
        ], function(_err, _res) {
            if (_err) {
                console.log('Here comes the Errorrrrr!!!!!!!!!!!!!!!!!\n');
                console.log(_err);
            }
            // Ends the information holder process
            _infoHolder.write();
        })
    }
}

module.exports = new Processor;