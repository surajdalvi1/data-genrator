/**
 * Base structure of Content Type
 */
'use strict';

// Constant Declarations
const REQUEST_WRAPPER = 'content_type';

// Module Dependencies - Local
const Schema = require('./schema');

// Module Dependencies - third party
const config = require('config');
const _ = require('lodash');

// Constant Declaration
const _contentTypeConfig = config.get('content_type');

// Variable Declarations
let _uidCounter = 0;

/*
   Builds the Content Type 
 */
class ContentTypeBuilder {
    constructor(_config) {
        this._config = _config;
        // Creates a extract schema for group field
        if ('group' in _config.fields && _.isEmpty(global._groupSchema)) {
            let _groupConfigSchema = _contentTypeConfig.group.schema;
            let _groupConfigInternalLevel = _contentTypeConfig.group.config.internal_level;
            let _groupSchema = _.clone(_groupConfigSchema);
            let _groupSchemaCurrRef = _groupSchema;
            // Creates the internal levels of the group
            while (_groupConfigInternalLevel > 0) {
                _groupSchemaCurrRef.group = _.clone(_groupConfigSchema);
                _groupSchemaCurrRef = _groupSchemaCurrRef.group;
                _groupConfigInternalLevel--;
            }
            global._groupSchema = _groupSchema;
        }
    }

    build() {
        let _config = this._config;
        let _isPage = _config.config.type === 'page' ? true : false;
        let _isSingleton = _config.config.singleton ? true : false;
        let _schema = Schema(_isPage)
        let _contentTypeObj;

        // Checks for whether the configurations are given for the content type
        if (!_.isEmpty(_config)) {
            for (let _fieldName in _config.fields) {
                try {
                    let _fieldCount = _config.fields[_fieldName];
                    let _fieldLoopNum = 0;
                    while (_fieldCount > _fieldLoopNum) {
                        if (_fieldName === 'group') {
                            _schema[_fieldName](global._groupSchema);
                        } else if (_fieldName === 'reference') {
                            // Gets the last content type created in the stack
                            let _currStackContentTypeList = global.uidHolder.content_type[_config.config.apiKey];
                            if (_currStackContentTypeList.length !== 0) {
                                _schema.reference(_currStackContentTypeList[_currStackContentTypeList.length - 1]);
                            }
                        } else {
                            _schema[_fieldName]();
                        }
                        _fieldLoopNum++;
                    }
                } catch (_err) {}
            }
        }

        _contentTypeObj = {
            [REQUEST_WRAPPER]: {
                "options": {
                    "title": "title",
                    "publishable": true,
                    "is_page": _isPage,
                    "singleton": _isSingleton,
                    "sub_title": _isPage ? ["url"] : []
                },
                "title": `Content Type ${++_uidCounter}`,
                "uid": `content_type_${_uidCounter}`,
                "schema": _schema.build()
            }
        };

        // Checks whether the content type is a page
        if (_isPage) {
            _contentTypeObj[REQUEST_WRAPPER].options.url_pattern = "/:title";
            _contentTypeObj[REQUEST_WRAPPER].options.url_prefix = "/";
        }

        return _contentTypeObj;
    }
}

module.exports = function (_config = {}) {
    return new ContentTypeBuilder(_config);
}