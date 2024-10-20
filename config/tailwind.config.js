const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      colors: {
        'akaroa': {
          '50': '#f9f7f3',
          '100': '#f0ede4',
          '200': '#e1d9c7',
          '300': '#d3c6ae',
          '400': '#b9a17e',
          '500': '#aa8b65',
          '600': '#9d7959',
          '700': '#83634b',
          '800': '#6b5241',
          '900': '#574337',
          '950': '#2e221c',
        },
        'lavender-gray': {
          '50': '#f4f5f9',
          '100': '#ececf3',
          '200': '#dcdee9',
          '300': '#c6c8db',
          '400': '#b8b8d1',
          '500': '#9b99bb',
          '600': '#8883a8',
          '700': '#757092',
          '800': '#5f5c77',
          '900': '#504e61',
          '950': '#2f2d39',
        },
        'scampi': {
          '50': '#f4f6fa',
          '100': '#e7eaf2',
          '200': '#d4d9e9',
          '300': '#b7c0d9',
          '400': '#94a0c6',
          '500': '#7a85b7',
          '600': '#686fa8',
          '700': '#5b5f97',
          '800': '#4f517e',
          '900': '#424566',
          '950': '#2c2c3f',
        },
        'saffron-mango': {
          '20': '#faf8f2',
          '50': '#fff9eb',
          '100': '#ffeec6',
          '200': '#ffdb88',
          '300': '#ffc145',
          '400': '#ffab20',
          '500': '#f98707',
          '600': '#dd6102',
          '700': '#b74106',
          '800': '#94320c',
          '900': '#7a2a0d',
          '950': '#461302',
        },
        'carnation': {
          '50': '#fff1f1',
          '100': '#ffe1e1',
          '200': '#ffc7c7',
          '300': '#ffa0a1',
          '400': '#ff6b6c',
          '500': '#f83b3c',
          '600': '#e51d1e',
          '700': '#c11415',
          '800': '#a01415',
          '900': '#841819',
          '950': '#480707',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        league: ['League Spartan', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
}
