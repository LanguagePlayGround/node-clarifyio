'use strict';

const request = require('request');

class Client {
  constructor(apiToken, opts) {
    if (!apiToken) throw new Error('API Token required');
    opts = opts || {};
    if (!(this instanceof Client)) {
      return new Client(apiToken, opts);
    }
    this.baseUrl = opts.baseUrl || 'https://api.clarify.io';
    this.apiVersion = opts.apiVersion || 1;

    this.headers = opts.headers || {};
    this.headers.Authorization = `Bearer ${apiToken}`;
  }

  _request(path, opts, callback) {
    const options = {
      baseUrl: this.baseUrl,
      url: `/v${this.apiVersion}/${path}`,
      json: true,
      method: opts.method || 'GET',
      headers: this.headers
    };
    if (opts.data) {
      options.body = opts.data;
    }

    request(options, (err, resp, body) => {
      if (!err && resp.statusCode >= 400) {
        err = new Error(body.status);
      }
      callback(err, body);
    });
  }

  get(path, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    this._request(path, opts, callback);
  }

  post(path, opts, callback) {
    opts.method = 'POST';
    opts.data = opts.data || opts;
    this._request(path, opts, callback);
  }

  put(path, opts, callback) {
    opts.method = 'PUT';
    opts.data = opts.data || opts;
    this._request(path, opts, callback);
  }

  delete(path, opts, callback) {
    opts.method = 'DELETE';
    opts.data = opts.data || opts;
    this._request(path, opts, callback);
  }


  /* Bundles */
  getBundles(opts, callback) {
    this.get('bundles', opts, callback);
  }

  createBundle(data, callback) {
    this.post('bundles', data, callback);
  }

  getBundle(id, opts, callback) {
    this.get(`bundles/${id}`, opts, callback);
  }

  removeBundle(id, callback) {
    this.delete(`bundles/${id}`, callback);
  }

  updateBundle(id, data, callback) {
    this.put(`bundles/${id}`, data, callback);
  }


  /* Metadata */
  getMetadata(bundleId, opts, callback) {
    this.get(`bundles/${bundleId}/metadata`, opts, callback);
  }

  updateMetadata(bundleId, data, callback) {
    this.put(`bundles/${bundleId}/metadata`, data, callback);
  }

  removeMetadata(bundleId, callback) {
    this.delete(`bundles/${bundleId}/metadata`, callback);
  }


  /* Tracks */
  getTracks(bundleId, opts, callback) {
    this.get(`bundles/${bundleId}/tracks`, opts, callback);
  }

  createTrack(bundleId, data, callback) {
    this.post(`bundles/${bundleId}/tracks`, data, callback);
  }

  updateTrack(bundleId, track, data, callback) {
    this.put(`bundles/${bundleId}/tracks`, data, callback);
  }

  removeTrack(bundleId, data, callback) {
    this.delete(`bundles/${bundleId}/tracks`, data, callback);
  }


  /* Search */
  search(opts, callback) {
    this.get('search', opts, callback);
  }
}


// aliases
Client.prototype.deleteBundle = Client.prototype.removeBundle;
Client.prototype.deleteMetadata = Client.prototype.removeMetadata;
Client.prototype.deleteTrack = Client.prototype.removeTrack;

module.exports = Client;
