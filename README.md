# Clarify API for Node

## Install

```
npm install clarifyio
```

## Usage

Read [here](https://api.clarify.io/docs) for more detailed description.

`apiKey` is required as the first parameter for Clarify Client instantiation. `options` are...optional.

```
const clarify = require('clarifyio');
const client = new clarify.Client(apiKey, options);

client.getBundles(opts, callback);
client.createBundle(data, callback);
client.getBundlefunction(bundleId, opts, callback);
client.updateBundle(bundleId, data, callback);
client.removeBundle(bundleId, callback);

client.getInsights(bundleId, opts, callback);
client.createInsight(bundleId, data, callback);
client.getInsight(bundleId, insightId, callback);

client.getMetadata(bundleId, opts, callback);
client.updateMetadata(bundleId, data, callback);
client.removeMetadata(bundleId, callback);

client.getTracks(bundleId, opts, callback);
client.createTrack(bundleId, data, callback);
client.updateTrack(bundleId, track, data, callback);
client.removeTrack(bundleId, track, callback);

client.search(opts, callback);

```

### Client Options

- `baseUrl`: string - defaults to  https://api.clarify.io
- `apiVersion`: number - defaults to 1;
- `headers`: object - extra header fields

_note: "Authorization" header is automatically set based on apiKey_
