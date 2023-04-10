export interface TokenPayload {
  sub: string;
  username: string;
  isAdmin: boolean;
}

export interface FullTokenPayload extends TokenPayload {
  iat: number;
  exp: number;
}
