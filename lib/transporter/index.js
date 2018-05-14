/**
 * Wrapper which choose different strategy based on the environment
 * Eg: In case of local development environment, its written into file system
 */
'use strict';

// Module Dependencies - third party
const _ = require('lodash');

// Constant Declarations
const _nodeEnv = process.env.NODE_ENV;

module.exports = _.isEmpty(_nodeEnv) || _nodeEnv === 'localdev' ?
    require('./file-logger') : require('./network-requester');