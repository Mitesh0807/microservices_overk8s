export enum UserRolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
  SUPER_ADMIN = 'SUPER_ADMIN',
  PREMIUM_USER = 'PREMIUM_USER',
}

export enum AvailableSocialLogins {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  APPLE = 'APPLE',
}

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
