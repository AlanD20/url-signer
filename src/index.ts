import { hash, verify } from './hmac';
import type { HashObj, Payload } from './hmac';
// @ts-ignore
import TTLCache from '@isaacs/ttlcache';


export interface UrlSignerParams extends HashObj {
  ttl: number;
}

export type SignUrl = { hmac: string; url: string; };


export default class UrlSigner {

  public cache: any;
  public secret: string;
  public payload: Payload;

  constructor({ ttl, secret, payload }: UrlSignerParams) {

    this.secret = secret;
    this.payload = payload;

    this.cache = new TTLCache({
      ttl: ttl * 1000,
      max: 1
    });
  }

  signUrl(url: string, payload?: Payload): SignUrl {

    if (this.cache.get(url) || this.cache.size === 1) {
      throw new Error('URL is already signed.');
    }

    if (payload) this.payload = payload

    const hmac = hash({
      secret: this.secret,
      payload: this.payload
    });
    const u = new URL(url);
    u.searchParams.append('signature', hmac);
    const safeUrl = u.href;

    const data = { hmac, url: safeUrl };
    this.cache.set(hmac, data);

    return data;
  }

  verifyUrl(signatureUrl: string): boolean {

    let signature = signatureUrl;

    if (!this.cache.get(signature)) {
      return false;
    }

    const storedPayload: SignUrl = this.cache.get(signature);

    if (signature !== storedPayload?.hmac) {
      return false;
    }

    return verify(
      signature, {
      secret: this.secret,
      payload: this.payload
    }
    );
  }

}
