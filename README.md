# URL Signer

Simple, light-weight package to sign URL using HMAC hash function and in-memory
caching using [@isaacs/ttlcache](https://www.npmjs.com/package/@isaacs/ttlcache)
package.

- `HMAC` is an authentication hash function which can be used to check the
  validity and correctness of the encrypted data.

> This package is useful when it's paired with database. Or, if you have access
> to the same UrlSigner instance throughout your project. The new version
> provides additional optional arguments to verify incoming url without having
> access to the previous instance.

## Usage

### Install

Install the package.

```bash
npm install @aland20/url-signer
pnpm install @aland20/url-signer
yarn add @aland20/url-signer
```

### Import

First Import the class.

```js
// CommonJs
const UrlSigner = require('@aland20/url-signer');

// ES Modules
import UrlSigner from '@aland20/url-signer';
```

### Create an Instance

You can create an instance of the class by passing the following:

- `ttl` (required): Expiration Time in seconds.
- `secret` (required): Secret key from server-side. Client-side must not have
  access to the secret key.
- `payload` (required): Data to be encrypted can be a Javascript object or
  primitive data types.
- `keyPrefix` (optional): adds prefix to the `signature` query key. For example,
  if we set `keyPrefix` to `mx`, the signed url will be
  `example.com/?mx_signature=<random-hmac>`.

```js
const signer = new UrlSigner({
  ttl: 120, // 2 minutes
  secret: 'SUPER_SECRET_KEY',
  payload: {
    name: 'aland',
    email: 'aland20@pm.me',
  },
  keyPrefix: 'ad', // Optional
});
```

### Sign Your Url

To sign url, simply pass the url to the `signUrl` function which takes:

- `url` (string): Your desired url to sign.
- `payload` (optional): Update the previous payload if needed.

`signUrl` function returns an object that has the following properties:

- `hmac` (string): hmac hash.
- `url` (string): signed url.

```js
const exampleUrl = 'https://api.example.com/users/confirmation?email=test@example.com';

const { url, hmac } = signer.signUrl(exampleUrl); // signer is the class instance

// The object contains following values:
{
  hmac: 'jE7zP9qE+VHs9Zt4Gqwc8/svJ23z92h3w2P+8Tou8YE=',
  url: 'https://api.example.com/users/confirmation?email=test%40example.com&ad_signature=jE7zP9qE%2BVHs9Zt4Gqwc8%2FsvJ23z92h3w2P%2B8Tou8YE%3D'
}
```

### Verify Signed Url

To verify a signed url, you have to access the same instance of UrlSigner that
signed the url, and use `verifyUrl` function.

~~- **Notice**: Without having access to the same instance causes the
verification to fail.~~

Since version `0.2.3`, the package provides additional argument that you may pass the exact same
`payload` and `secret` to get the desired result.

Another feature is that you can pass the signature value or full url. If you
pass the full url, don't forget to also pass the `keyPrefix` if set during the
url signing.

Example to verify your incoming signature with three different methods.

```js
// First Method:
const signature = 'jE7zP9qE+VHs9Zt4Gqwc8/svJ23z92h3w2P+8Tou8YE=';

signer.verifyUrl(signature); // true

// Second Method:
const fullUrl =
  'https://api.example.com/users/confirmation?email=test%40example.com&ad_signature=jE7zP9qE%2BVHs9Zt4Gqwc8%2FsvJ23z92h3w2P%2B8Tou8YE%3D';

signer.verifyUrl({ url: fullUrl, keyPrefix: 'ad' }); // true

// Third Method:
const mySecureObject = {
  secret: 'SUPER_SECRET_KEY',
  payload: {
    name: 'aland',
    email: 'aland20@pm.me',
  },
};

signer.verifyUrl(signature, mySecureObject); // true
```

### Expired Signed Url

> This feature works only when you have access to the same instance. Otherwise,
> there is no way to find out the exact timing.

If you verify the url after the `ttl` has passed during the instance creation,
it returns false.

```js
...{
    ttl: 120, // 2 minutes
...}

// after 2 minutes and 1 second
signer.verifyUrl(signature); // false
```

## License

[MIT](LICENSE)
