'use strict';

// Module Dependecies - builtin
const fs = require('fs');
const path = require('path');

// Module Dependencies - third party
const faker = require('faker');

// Constant Declarations
const ASSETS_PATH = path.join(process.cwd(), 'assets');
const ASSETS_LIST = fs.readdirSync(ASSETS_PATH);
const ASSETS_LIST_LENGTH = ASSETS_LIST.length;

// Variable Declaration
let _uidCounter = 0;

class Asset {
    asset(_config) {
        let _randomChoice = Math.floor(Math.random() * ASSETS_LIST_LENGTH);
        let _currAssetChoice = _randomChoice >= ASSETS_LIST_LENGTH ? 0 : _randomChoice;
        let _currAssetPath = path.join(ASSETS_PATH, ASSETS_LIST[_currAssetChoice]);
        let _currAssetBody = {
            'asset[title]': `${faker.lorem.slug()}${_uidCounter++}`,
            'asset[description]': `${faker.lorem.sentence()}`,
            'asset[upload]': fs.createReadStream(_currAssetPath),
        }
        if ('parentUid' in _config) {
            _currAssetBody['asset[parent_uid]'] = _config.parentUid;
        }
        return _currAssetBody;
    }
    asset_folder(_config) {
        let _assetBody = {
            "asset": {
                "name": `assetfolder_${_uidCounter++}`
            }
        };
        // Adds the parent
        if (_config.parentUid) {
            _assetBody.asset.parent_uid = _config.parentUid;
        }
        return _assetBody;
    }
    build(_config) {
        return this[_config.entity](_config);
    }
}

module.exports = new Asset;