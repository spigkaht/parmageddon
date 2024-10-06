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
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
}
