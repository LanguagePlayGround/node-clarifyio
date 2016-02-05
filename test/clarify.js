'use strict';

const clarify = require('..');
const async = require('async');

const should = require('should');

const client = new clarify.Client('docs-api-key');

let bundleId = 'cbc77abbc54e4cc686d65156fe1d29a3';

describe('Clarify API tests', function() {
  describe('baseline tests', function() {
    it('should be valid client', function() {
      should.exist(client);
    });
  });

  describe('Bundle tests', function() {
    it('should support CRUD operations', function(done) {
      const data = {
        name: `Test bundle ${Math.random()}`,
        media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-1.wav'
      };

      let total = 0;
      async.waterfall([
        (cb) => client.createBundle(data, cb),
        (bundle, cb) => {
          should.exist(bundle.id);
          bundleId = bundle.id;
          client.getBundle(bundleId, cb);
        },
        (bundle, cb) => {
          bundle.id.should.equal(bundleId);
          bundle.name.should.equal(data.name);
          client.updateBundle(bundleId, {
            name: 'another name'
          }, cb);
        },
        (bundle, cb) => {
          bundle.id.should.equal(bundleId);
          client.getBundle(bundleId, cb);
        },
        (bundle, cb) => {
          bundle.id.should.equal(bundleId);
          bundle.name.should.equal('another name');
          client.getBundles(cb);
        },
        (list, cb) => {
          total = list.total;
          list._links.items.length.should.be.above(0);
          total.should.be.above(0);
          client.removeBundle(bundleId, cb);
        },
        (bundle, cb) => client.getBundles(cb), (list, cb) => {
          total.should.equal(list.total + 1);
          cb();
        }
      ], done);
    });
  });

  describe('Metadata tests', function() {
    it('should support CRUD operations', function(done) {
      const data = {
        name: `Test bundle ${Math.random()}`,
        media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-1.wav'
      };

      async.waterfall([
        (cb) => client.createBundle(data, cb),
        (res, cb) => {
          should.exist(res.id);
          bundleId = res.id;
          client.getMetadata(bundleId, cb);
        },
        (res, cb) => {
          res.bundle_id.should.equal(bundleId);
          Object.keys(res.data).length.should.equal(0);
          client.updateMetadata(bundleId, {
            test: 'test'
          }, cb);
        },
        (res, cb) => client.getMetadata(bundleId, cb),
        (res, cb) => {
          res.data.test.should.equal('test');
          client.removeMetadata(bundleId, cb);
        },
        (res, cb) => client.getMetadata(bundleId, cb),
        (res, cb) => {
          res.bundle_id.should.equal(bundleId);
          Object.keys(data.data).length.should.equal(0);
          client.removeBundle(bundleId, cb);
        }
      ], done);
    });
  });

  describe('Tracks tests', function() {
    it('should support CRUD operations', function(done) {
      const data = {
        name: `Test bundle ${Math.random()}`,
        media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-1.wav'
      };

      async.waterfall([
        (cb) => client.createBundle(data, cb),
        (res, cb) => {
          bundleId = res.id;
          client.createTrack(bundleId, {
            label: 'track1',
            media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-2.wav'
          }, cb);
        },
        (tracks, cb) => client.getTracks(bundleId, cb),
        (tracks, cb) => {
          tracks.tracks.length.should.equal(2);
          tracks.tracks[0].media_url.should.equal('https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-1.wav');
          tracks.tracks[1].media_url.should.equal('https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-2.wav');
          tracks.tracks[1].label.should.equal('track1');
          client.updateTrack(bundleId, 1, {
            label: 'new track'
          }, cb);
        },
        (res, cb) => client.getTracks(bundleId, cb),
        (tracks, cb) => {
          tracks.tracks[1].label.should.equal('new track');
          client.createTrack(bundleId, {
            label: 'track2',
            media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-2.wav'
          }, cb);
        },
        (res, cb) => client.getTracks(bundleId, cb),
        (tracks, cb) => {
          tracks.tracks.length.should.equal(3);
          client.removeTrack(bundleId, 1, cb);
        },
        (res, cb) => client.getTracks(bundleId, cb),
        (tracks, cb) => {
          tracks.tracks.length.should.equal(2);
          client.removeTrack(bundleId, cb);
        },
        (res, cb) => client.getTracks(bundleId, cb),
        (tracks, cb) => {
          tracks.tracks.length.should.equal(0);
          client.removeBundle(bundleId, cb);
        }
      ], done);
    });
  });

  describe('Search tests', function() {
    it('should search bundles by query text', function(done) {
      let bundleId1 = '';
      let bundleId2 = '';
      let data = {
        name: `qwerty bundle ${Math.random()}`,
        media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-1.wav'
      };

      async.waterfall([
        (cb) => client.createBundle(data, cb),
        (res, cb) => {
          bundleId1 = res.id;
          data = {
            name: `sssss bundle ${Math.random()}`,
            media_url: 'https://s3-us-west-2.amazonaws.com/op3nvoice/harconstd-sentences-2.wav'
          };
          client.createBundle(data, cb);
        },
        (res, cb) => {
          bundleId2 = res.id;
          client.search({
            query: 'qwerty',
            query_fields: 'bundle.name'
          }, cb);
        },
        (res, cb) => {
          res.total.should.equal(1);
          res.item_results.length.should.equal(1);
          res._links.items.length.should.equal(1);
          res._links.items[0].href.indexOf(`/${bundleId1}`).should.eql(0);
          cb();
        },
        (cb) => client.removeBundle(bundleId1, cb),
        (res, cb) => client.removeBundle(bundleId2, cb)
      ], done);
    });
  });
});
