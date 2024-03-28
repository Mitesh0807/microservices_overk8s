export interface TokenPayload {
  userId: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
