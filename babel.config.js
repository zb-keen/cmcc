module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    ['@babel/plugin-proposal-optional-chaining']
  ],
  presets: [
    '@vue/cli-plugin-babel/preset',
    // ["@babel/preset-env", {
    //   "useBuiltIns": "usage",
    //   "corejs": "3"
    // }]
  ],
};
