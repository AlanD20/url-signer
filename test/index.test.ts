import UrlSigner from '../src/index';
import { hash } from '../src/hmac';


describe('Test Signing & Verifying URL...', () => {

  const exampleUrl = 'https://api.example.com/users/confirmation?email=test@example.com';
  const secret = 'aland20';
  const payload = {
    name: 'aland',
    pass: 'aland20',
    email: 'aland20@pm.me'
  };

  const signer = new UrlSigner({
    ttl: 60,
    secret,
    payload
  });
  const signed = signer.signUrl(exampleUrl)!;

  it('Returns signed url.', () => {

    // Manually create hashed signature
    const manualHmac = hash({ secret, payload });
    const expectedUrl = new URL(exampleUrl)
    expectedUrl.searchParams.set('signature', manualHmac);


    // creating signed url with the function
    const signer2 = new UrlSigner({
      ttl: 60,
      secret,
      payload
    });
    const signed = signer2.signUrl(exampleUrl)!;

    expect(signed.url).toEqual(expectedUrl.href);
    expect(signed.hmac).toEqual(manualHmac);
  });

  it('Can verify signed url.', () => {

    // verifying
    const isValidUrl = signer.verifyUrl(signed.hmac);

    expect(isValidUrl).toEqual(true);
  });


  it('Fails to verify modified signed url.', () => {

    const u = new URL(signed.url);
    const sign = u.searchParams.get('signature')!.split('');
    sign[2] = '000';

    // verifying
    const isValidUrl = signer.verifyUrl(sign.join(''));

    expect(isValidUrl).toEqual(false);
  });


});

