// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: ['selector', 'html[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ls-primary-background-color)',
        secondary: 'var(--ls-secondary-background-color)',
        tertiary: 'var(--ls-tertiary-background-color)',
        quaternary: 'var(--ls-quaternary-background-color)',
        'text-primary': 'var(--ls-primary-text-color)',
        'text-secondary': 'var(--ls-secondary-text-color)',
        border: 'var(--ls-border-color)',
        'border-secondary': 'var(--ls-secondary-border-color)',
        link: 'var(--ls-link-text-color)',
        'link-hover': 'var(--ls-link-text-hover-color)',
        active: 'var(--ls-active-primary-color)',
        'active-secondary': 'var(--ls-active-secondary-color)',
        shadow: 'var(--shadow-large)',
        'neutral-emphasis': 'var(--neutral-emphasis)',
        'neutral-muted': 'var(--neutral-muted)',
        'on-emphasis': 'var(--fg-on-emphasis)',
        accent: 'var(--lx-accent-11,var(--ls-link-text-color,hsl(var(--primary)/.8)))',
      },
      backgroundColor: {
        primary: 'var(--ls-primary-background-color)',
        secondary: 'var(--ls-secondary-background-color)',
        tertiary: 'var(--ls-tertiary-background-color)',
        quaternary: 'var(--ls-quaternary-background-color)',
      },
      textColor: {
        primary: 'var(--ls-primary-text-color)',
        secondary: 'var(--ls-secondary-text-color)',
        link: 'var(--ls-link-text-color)',
        'link-hover': 'var(--ls-link-text-hover-color)',
      },
      borderColor: {
        DEFAULT: 'var(--ls-border-color)',
        secondary: 'var(--ls-secondary-border-color)',
      }
    },
  },
  plugins: [],
}
