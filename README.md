# URL Signer

Simple, light-weight package to sign URL using HMAC hash function and in-memory caching using [@isaacs/ttlcache](https://www.npmjs.com/package/@isaacs/ttlcache) package.
- `HMAC` is an authentication hash function which can be used to check the validity and correctness of the encrypted data.

> This package is useful when it's paired with database. Or, if you have access to the same UrlSigner instance throughout your project.


## Usage

### Import
First Import the class.
```javascript
// CommonJs
const UrlSigner = require('@aland20/url-signer')
// ES Modules
import UrlSigner from '@aland20/url-signer'
```

### Create an Instance
After importing, you can create an instance of the class by passiing the following:
- `ttl`: Amount of seconds to expire.
- `secret`: Secret key from server-side. Client-side must not have access to the secret key.
- `payload`: Data to be encrypted.

```js
const signer = new UrlSigner({
  ttl: 120, // 2 minutes
  secret: 'SUPER_SECRET_KEY',
  payload: {
    name: 'aland',
    email: 'aland20@pm.me'
  }
});
```

### Sign Your Url
To sign url, simply pass the url to the `signUrl` function which takes:
 - `url`: (string): Your desired url to sign.
 - `payload`: (optional): Update the payload if needed.

`signUrl` function returns an object that has the following properties:
 - `hmac`: (string): hmac hash.
 - `url`: (string): signed url.
```js
const url = 'https://api.example.com/users/confirmation?email=test@example.com';
const { url, hmac } = signer.signUrl(url); // signer is the class instance
```

### Verify Signed Url
To verify a signed url, you have to access the same instance of UrlSigner that signed the url, and use `verifyUrl` function. 
- **Notice**: Without having access to the same instance causes the verification to fail.

```js
const url = new URL(currentUrl); // Creating URL instance
const signature = url.searchParams.get('signature'); // Get signature param from url
const isValidSignature = signer.verifyUrl(signature); // true
```

### Expired Signed Url
If you verify the url after the ttl passed when you create the instance, it returns false.
```js
...{
    ttl: 120, // 2 minutes
...}

// after 2 minutes and 1 second
const isValidSignature = signer.verifyUrl(signature); // false
```


## License

[MIT](LICENSE)
