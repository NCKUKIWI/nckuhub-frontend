module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/**/*.{html,ts}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: '#4A4A4A',
        dark: '#9B9B9B',
        pink: '#FF6097',
        gray: '#CBCBCB',
        light: {
          '0': '#F5F5F5',
          '1': '#FAFAFA',
          '2': '#EEEEEE',
        },
        white: '#FFFFFF',
        red: {
          DEFAULT: '#F35A5A',
          warning: '#c62828'
        },
        blue: {
          DEFAULT: '#18ABD6',
          darken: '#19A3CB',
          deep: '#1A6CBD'
        },
        green: '#17CF94'
      },
      transitionTimingFunction: {
        'material-trans': 'cubic-bezier(0.0, 0.0, 0.2, 1)'
      },
      boxShadow: {
        '1': '0 0 14px 0 rgba(0,0,0,0.06)',
        '2': '0 0 14px 0 rgba(0,0,0,0.10)',
        '3': '0 0 24px 0 rgba(0,0,0,0.28)',
        '4': '0 5px 14px 5px rgba(0,0,0,0.10)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}