'use strict';

// Module Dependencies - builtin
const path = require('path');
const fs = require('fs');

// Module Dependencies - third party
const _ = require('lodash');
const rimraf = require('rimraf');

// Module Dependencies - local
const builtUid = require('./../helpers/built-uid-generator');

// Constant Declarations
const logPath = path.join(process.cwd(), 'logs');
const assetsPath = path.join(logPath, 'assets');

// Checks for the availability of the logs directory
if (fs.existsSync(logPath)) {
    rimraf.sync(logPath);
    fs.mkdirSync(logPath);
} else {
    fs.mkdirSync(logPath);
}

// Checks for the availability of the assets logs directory
if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath);
}

class FileLoggerHelper {
    constructor() {}
    _writer(_config, _callback) {
        return fs.writeFile(_config.filePath, JSON.stringify(_config.data), _err => {
            if (_err) {
                return _callback(_err);
            }
            return _callback(null, _config.data);
        });
    }
}

class FileLogger extends FileLoggerHelper {
    constructor() {
        super();
        this._uidCounter = 0;
    }
    create(_config, _callback) {
        let _writeConfig = {};
        let _baseName;
        switch (_config.details.entity) {
            case "stack":
                {
                    let _uid = `${builtUid.generate()}${this._uidCounter++}`;
                    let _stackLogPath = path.join(logPath, `stack_${_uid}`);
                    _baseName = `stack_${_uid}.json`;
                    _config.data.stack.api_key = _uid;
                    // Checks for the availability of the stack logs directory
                    if (!fs.existsSync(_stackLogPath)) {
                        fs.mkdirSync(_stackLogPath);
                    }
                    break;
                }
            case "content_type":
                {
                    let _contentTypeUid = _config.data.content_type.uid;
                    let _contentTypeLogPath = path.join(logPath, `stack_${_config.details.apiKey}`, `${_contentTypeUid}`);
                    _baseName = path.join(`stack_${_config.details.apiKey}`, `${_contentTypeUid}.json`);
                    // Checks for the availability of the content type logs directory
                    if (!fs.existsSync(_contentTypeLogPath)) {
                        fs.mkdirSync(_contentTypeLogPath);
                    }
                    break;
                }
            case "entry":
                {
                    let _uid = `${builtUid.generate()}${this._uidCounter++}`;
                    _config.data.entry.uid = _uid;
                    _baseName = path.join(`stack_${_config.details.apiKey}`, `${_config.details.contentTypeUid}`, `${_uid}.json`);
                    break;
                }
            case "asset":
                {
                    let _uid = `${builtUid.generate()}${this._uidCounter++}`;
                    _writeConfig.data = {
                        asset: {
                            uid: _uid,
                            title: _config.data['asset[title]'],
                            description: _config.data['asset[description]'],
                            parent_uid: _config.data['asset[parent_uid]'],
                            is_dir: false
                        }
                    };
                    _config = null;
                    _writeConfig.filePath = path.join(`${assetsPath}`, `${_uid}.json`);
                    break;
                }
            case "asset_folder":
                {
                    let _uid = `${builtUid.generate()}${this._uidCounter++}`;
                    _config.data.asset.uid = _uid;
                    _config.data.asset.is_dir = true;
                    _config.data.asset.parent_uid = _config.data.asset.parent_uid || null;
                    _writeConfig.data = _config.data;
                    _writeConfig.filePath = path.join(`${assetsPath}`, `${_uid}.json`);
                    break;
                }
            default:
                {
                    return _callback(new Error('Entity not available'));
                }
        }
        if (_.isEmpty(_writeConfig)) {
            _writeConfig.data = _config.data;
            _writeConfig.filePath = path.join(logPath, _baseName);
        }
        return this._writer(_writeConfig, _callback);
    }
    delete(_config, _callback) {
        // Checks for the availability of the logs directory
        if (fs.existsSync(logPath)) {
            rimraf.sync(logPath);
        }
        return _callback(null, {});
    }
}

module.exports = new FileLogger;