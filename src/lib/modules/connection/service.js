'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const errors = require('lib/errors');
const connectionRepository = require('./repository');

const ALLOWED_UPDATES = [
  'name',
  'host',
  'port'
];

const DEFAULT_CONNECTIONS = require('./defaults');

/**
 * @class ConnectionService
 */
class ConnectionService {
  get defaultConnections() {
    return JSON.stringify(DEFAULT_CONNECTIONS);
  }

  /**
   * @constructor ConnectionService
   */
  constructor() {}

  /**
   * @method findById
   */
  findById(id) {
    return connectionRepository.findById(id);
  }

  /**
   * @method create
   */
  create(options) {
    return new Promise((resolve, reject) => {
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));
      if (!options.name) return reject(new errors.InvalidArugmentError('options.name is required'));
      if (!options.host) return reject(new errors.InvalidArugmentError('options.host is required'));
      if (!options.port) return reject(new errors.InvalidArugmentError('options.port is required'));

      if (options.port < 0 || options.port > 65535) return reject(new errors.InvalidArugmentError('port number must be between 0 and 65535'));

      return connectionRepository.existsByName(options.name)
        .then(function(exists) {
          return new Promise((resolve, reject) => {
            if (exists) return reject(new errors.InvalidArugmentError('Sorry, connection names must be unique.'));
            return resolve(null);
          });
        })
        .then(() => {
          return connectionRepository.create(options);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * @method list
   */
  list() {
    return connectionRepository.list();
  }

  /**
   * @method update
   * @param {String} id - id of the connection to update
   */
  update(id, options) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));

      options = _.pick(options, ALLOWED_UPDATES);

      connectionRepository.update(id, options)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * @method delete
   * @param {String} id - id of the connection to delete
   */
  delete(id) {
    return connectionRepository.delete(id);
  }
}

/**
 * @exports
 */
module.exports = new ConnectionService();
