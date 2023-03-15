const white = '#ffffff';
const darkBlue = '#4a5567';
const darkBlue1 = '#252d3b';

const green = '#47a67f';
const red = '#d94818';

export const Theme = {
  light: {
    statusbar: 'dark',
    theme: 'light',
    accent: white,
    background: '#f5f5f5',
    text: darkBlue,
    primary: green,
    danger: red,
  },
  dark: {
    statusbar: 'light',
    theme: 'dark',
    background: darkBlue1,
    accent: darkBlue,
    text: white,
    primary: green,
    danger: red,
  },
  colors: {
    white,
    darkBlue,
    green,
    red,
  },
};
