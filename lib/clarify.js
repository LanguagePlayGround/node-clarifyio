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

  _request(method, path, opts, callback) {
    const options = {
      baseUrl: this.baseUrl,
      url: `/v${this.apiVersion}/${path}`,
      json: true,
      method,
      headers: this.headers
    };
    if (method !== 'GET') {
      options.body = opts.data || opts;
    }
    if (opts.qs) {
      options.qs = opts.qs;
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

    this._request('GET', path, opts, callback);
  }

  post(path, opts, callback) {
    this._request('POST', path, opts, callback);
  }

  put(path, opts, callback) {
    this._request('PUT', path, opts, callback);
  }

  delete(path, opts, callback) {
    this._request('DELETE', path, opts, callback);
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

  updateBundle(id, data, callback) {
    this.put(`bundles/${id}`, data, callback);
  }

  removeBundle(id, callback) {
    this.delete(`bundles/${id}`, callback);
  }


  /* Insights */
  getInsights(bundleId, opts, callback) {
    this.get(`bundles/${bundleId}/insights`, opts, callback);
  }

  createInsight(bundleId, data, callback) {
    this.post(`bundles/${bundleId}/insights`, data, callback);
  }

  getInsight(bundleId, insightId, callback) {
    this.get(`bundles/${bundleId}/insights/${insightId}`, callback);
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
    this.put(`bundles/${bundleId}/tracks/${track}`, data, callback);
  }

  removeTrack(bundleId, track, callback) {
    this.delete(`bundles/${bundleId}/tracks/${track}`, callback);
  }


  /* Search */
  search(opts, callback) {
    opts = {
      qs: opts
    };
    this.get('search', opts, callback);
  }
}


// aliases
Client.prototype.deleteBundle = Client.prototype.removeBundle;
Client.prototype.deleteMetadata = Client.prototype.removeMetadata;
Client.prototype.deleteTrack = Client.prototype.removeTrack;

module.exports = Client;
