module.exports = {
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    staticFolder: '/static',
  },
  experimental: {
    outputStandalone: true,
  },
};
