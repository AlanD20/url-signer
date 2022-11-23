import { createHmac, timingSafeEqual } from 'crypto';

export type Payload = string | number | object;

export interface HashObj {
  secret: string;
  payload: Payload;
}

export function hash({ secret, payload }: HashObj): string {
  let data = payload;

  if (typeof data === 'object') {
    data = JSON.stringify(data);
  } else if (typeof data === 'number') {
    data = data.toString();
  }

  return createHmac('sha256', secret)
    .update(data)
    .digest('base64');
}


export function verify(
  signature: string,
  { secret, payload }: HashObj
): boolean {
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hash({ secret, payload }))
    );
  } catch (err) {
    return false;
  }
}
