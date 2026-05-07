export const APP_CONSTANTS = {
  BCRYPT_SALT_ROUNDS: 10,
  JWT: {
    ACCESS_EXPIRES_IN: '15m',
    REFRESH_EXPIRES_IN: '7d',
  },
} as const;

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
}
