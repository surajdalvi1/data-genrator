'use strict';

// Module Dependencies - third party
const _ = require('lodash');
const faker = require('faker');

// Module Dependencies - local
const _dataHandler = require('./../data-handlers/entry');

// Constant Declarations
const REQUEST_WRAPPER = 'entry';

// Variable Declarations
let _uidCounter = 0;

class EntryHelper {
    constructor(_contentType) {
        this._contentType = _contentType;
        this._entryData = {};
    }
    singletext(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = faker.lorem.sentence();
    }
    multitext(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = faker.lorem.paragraph();
    }
    rte(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = faker.lorem.paragraphs();
    }
    markdown(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = faker.lorem.paragraphs();
    }
    select(_fieldSchema) {
        let _selectData = _.chain(_fieldSchema.enum.choices)
            .map('value')
            .compact()
            .value();
        this._entryData[_fieldSchema.uid] = _selectData;
    }
    number(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = Math.floor(Math.random() * 1000000000 + 1);
    }
    boolean(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = !!Math.round(Math.random() * 1);
    }
    date(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = (new Date).toISOString();
    }
    file(_fieldSchema, _config) {
        // Chooses a random asset uid
        let _currStackAssetsList = global.uidHolder.file[_config.apiKey];
        let _assetUidHolderLength = _currStackAssetsList.length;
        let _randomChoice = Math.floor(Math.random() * _assetUidHolderLength);
        let _currAssetUidChoice = _randomChoice >= _assetUidHolderLength ? 0 : _randomChoice;
        this._entryData[_fieldSchema.uid] = _currStackAssetsList[_currAssetUidChoice];
    }
    link(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = {
            title: faker.lorem.sentence(),
            href: faker.internet.url()
        };
    }
    reference(_fieldSchema, _config) {
        // Chooses a random entry from the given content type
        let _refContentType = _fieldSchema.reference_to;
        let _refEntriesList = global.uidHolder.entry[_config.apiKey][_refContentType];
        let _refEntriesListLength = _refEntriesList.length;
        // let _randomChoice = Math.floor(Math.random() * _refEntriesListLength);
        let _randomChoice = _config._entryIteration;
        let _refEntryChoice = _randomChoice >= _refEntriesListLength ? 0 : _randomChoice;
        this._entryData[_fieldSchema.uid] = [_refEntriesList[_refEntryChoice]];
    }
    group(_fieldSchema) {
        // Creates the content type for the given group schema
        let _tempContentType = {
            content_type: {
                schema: _fieldSchema.schema
            }
        }
        // Creates the entry type based on the created content type
        let _tempEntry = new Entry(_tempContentType);
        // Parses the content type and creates entry data
        _tempEntry.parse();
        // Assigns the group data
        this._entryData[_fieldSchema.uid] = _tempEntry._entryData;
        // Destroys the data
        _tempContentType = null;
        _tempEntry = null;
    }
    title(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = `${faker.lorem.sentence()} ${_uidCounter}`;
    }
    url(_fieldSchema) {
        this._entryData[_fieldSchema.uid] = `/${faker.lorem.slug()}_${_uidCounter}`;
    }
    parse(_config) {
        _uidCounter++;
        this._contentType.content_type.schema.forEach(_fieldSchema => {
            let _fieldUidPrefix = (_fieldSchema.uid.split("_"))[0]
            this[_fieldUidPrefix](_fieldSchema, _config);
        });
    }
}

class Entry extends EntryHelper {
    constructor(_contentType) {
        super(_contentType);
    }
    build(_config, _callback) {
        this.parse(_config);
        let _entryData = {
            [REQUEST_WRAPPER]: {
                ...this._entryData,
                tags: []
            }
        };
        this._entryData = {};
        return _dataHandler.create({
            entity: 'entry',
            apiKey: _config.apiKey,
            contentTypeUid: this._contentType.content_type.uid
        }, _entryData, _callback);
    }
}

module.exports = function (_contentType) {
    return new Entry(_contentType);
}