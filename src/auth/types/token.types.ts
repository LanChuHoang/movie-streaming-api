export interface ExtractedUser {
  username: string;
  id: string;
}

export type AccessTokenPayload = {
  username: string;
  sub: string;
};

export type RefreshTokenPayload = {
  username: string;
  sub: string;
};
