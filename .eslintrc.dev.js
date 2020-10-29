"use strict";

module.exports = {
  "extends": 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [2, {
      extensions: ['.js', '.jsx']
    }]
  }
};