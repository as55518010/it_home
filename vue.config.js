module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz',
        ws: false,
        changeOrigin: true
      }
    }
  }
}
