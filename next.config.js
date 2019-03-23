const optimizedImages = require('next-optimized-images');

module.exports = optimizedImages({
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      target: 'serverless',
    }
  }
})
