const white = '#ffffff';
const darkBlue2 = '#2a3942';
const darkBlue1 = '#111b21';
const darkBlue = '#202c33';
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
    colorIcon: '#2a3942',
  },
  dark: {
    statusbar: 'light',
    theme: 'dark',
    background: darkBlue1,
    accent: darkBlue,
    text: white,
    primary: green,
    danger: red,
    colorIcon: '#8696a0',
  },
  colors: {
    white,
    darkBlue,
    green,
    red,
  },
};
