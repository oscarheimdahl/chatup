// @ts-ignore
export const host = import.meta.env.PROD ? '' : import.meta.env.VITE_DEV_SERVER_DOMAIN;

console.log('host:', host);
