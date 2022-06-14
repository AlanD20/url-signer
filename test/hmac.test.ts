import { hash, verify } from '../src/hmac';


describe('Test hmac Hashing & Verifying...', () => {

  const secret = 'aland20';
  const payload = {
    name: 'aland',
    pass: 'aland20',
    email: 'aland20@pm.me'
  };
  const hmac = hash({ secret, payload });


  it('Verifies hmac successfully.', () => {

    expect(verify(hmac, { secret, payload })).toBe(true);
  });


  it('Fails to verify hmac with different hmac.', () => {
    const newHmac = hash({
      secret: '123',
      payload: {
        name: 'john'
      }
    });

    expect(verify(newHmac, {
      secret,
      payload
    })).toBe(false);
  });

  it('Fails to verify hmac with modified hmac.', () => {

    let modifiedHmac: string | string[] = hmac.split('');
    modifiedHmac[2] = '' + Math.round(Math.random() * 10);
    modifiedHmac = modifiedHmac.join('');

    expect(verify(modifiedHmac, {
      secret,
      payload
    })).toBe(false);
  });


  it('Fails to verify hmac for mismatch casing.', () => {

    expect(verify(hmac, {
      secret,
      payload: {
        name: 'AlanD',
        pass: 'aland20',
        email: 'aland20@pm.me'
      }
    })).toBe(false);
  });


  it('Fails to verify hmac for missing property.', () => {

    expect(verify(hmac, {
      secret,
      payload: {
        pass: 'aland20',
        email: 'aland20@pm.me'
      }
    })).toBe(false);
  });


  it('Fails to verify hmac for modified payload.', () => {

    expect(verify(hmac, {
      secret,
      payload: {
        name: 'john',
        pass: '123',
        email: 'john@example.com'
      }
    })).toBe(false);
  });


  it('Fails to verify hmac for empty payload.', () => {

    expect(verify(hmac, {
      secret,
      payload: {}
    })).toBe(false);
  });


});
