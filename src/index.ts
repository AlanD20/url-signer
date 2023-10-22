import { hash, verify } from "./hmac";
import type { HashObj, Payload } from "./hmac";
// @ts-ignore
import TTLCache from "@isaacs/ttlcache";

export interface UrlSignerParams extends HashObj {
  ttl: number;
  keyPrefix?: string;
}

export type SignUrl = { hmac: string; url: string };

export type UrlSignature = string | {
  url: string;
  keyPrefix: string;
};

export default class UrlSigner {
  private keyPrefix: string;
  private cache: any;
  private secret: string;
  public payload: Payload;

  constructor({ ttl, secret, payload, keyPrefix }: UrlSignerParams) {
    this.secret = secret;
    this.payload = payload;

    this.keyPrefix = keyPrefix ? `${keyPrefix}_signature` : "signature";

    this.cache = new TTLCache({
      ttl: ttl * 1000,
      max: 1,
    });
  }

  public signUrl(url: string, payload?: Payload): SignUrl {
    if (this.cache.get(url) || this.cache.size === 1) {
      throw new Error("URL is already signed.");
    }

    if (payload) this.payload = payload;

    const hmac = hash({
      secret: this.secret,
      payload: this.payload,
    });

    const u = new URL(url);
    u.searchParams.append(this.keyPrefix, hmac);
    const safeUrl = u.href;

    const data = { hmac, url: safeUrl };
    this.cache.set(hmac, data);

    return data;
  }

  public verifyUrl(uri: UrlSignature, hashObject?: HashObj): boolean {
    let signature = this.getSignatureFromUrl(uri);

    let originalHash = { secret: this.secret, payload: this.payload };

    if (hashObject) {
      originalHash = hashObject;
    }

    return verify(signature, originalHash);
  }

  private getSignatureFromUrl(url: UrlSignature): string {
    let signature: string | null = typeof url === "string" ? url : url.url;

    if (typeof url === "object") {
      this.setPrefix(url.keyPrefix);
    }

    if (signature.startsWith("http")) {
      const u = new URL(signature);
      signature = u.searchParams.get(this.keyPrefix);
    }

    return signature ? signature : "";
  }

  private setPrefix(prefix?: string): void {
    this.keyPrefix = prefix ? `${prefix}_signature` : "signature";
  }
}

module.exports = UrlSigner;
