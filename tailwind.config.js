/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // Added from second config
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lightwhite: '#F7F7FF',
        primary: {
          DEFAULT: '#12183b', // from first config
          foreground: 'hsl(var(--primary-foreground))',
        },
        green: '#34CECE',
        cblock: '#333951',
        OnButtonNormal: '#989BA7',
        onBackWarring: '#FA4B5E',
        secondLightPrimary: '#F4EBFF',
        'text-primary': '#1B2559',
        'light-primary': '#8ABDF8',
        'text-secondary': '#707EAE',
        'dark-black': '#2B3674',
        'light-black': '#969BB3',
        secondary: {
          DEFAULT: '#3D4854', // from first config
          foreground: 'hsl(var(--secondary-foreground))',
        },
        danger: '#FF4747',
        lightGray: '#8386A8',
        black: '#3D4854',
        success: '#4cb585',
        Average: '#4cb585',
        Warning: '#FAB515',
        Critical: '#FF5959',
        white: '#fff',
        'sidebar-bg':
          'linear-gradient(90deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.00) 104.88%)',
        'alert-rgb':
          'linear-gradient(316.85deg, #FF9696 1.46%, #EC2C2C 98.44%),linear-gradient(0deg, #FFFFFF, #FFFFFF)',
        'Warning-rgb':
          'linear-gradient(315deg, #FFC960 -0.89%, #EF9D00 99.11%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
        'problem-rgb':
          'linear-gradient(135deg, #6C83FF 0.6%, #889BFF 100.6%),linear-gradient(0deg, #FFFFFF, #FFFFFF)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      screens: {
        sm: '320px',
        md: '768px',
        md2: '900px',
        lg: '974px',
        lg2: '1280px',
        lg3: '1380px',
        xl: '1440px',
        xl2: '2000px',
      },
      boxShadow: {
        shadowOne: '11px 16px 42px 0px rgba(85, 52, 221, 0.15)',
        shadowTwo: '0px 4px 15px 0px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        scaleUpDown: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' },
        },
      },
      animation: {
        scaleUpDown1: 'scaleUpDown 0.3s ease-in-out infinite',
        scaleUpDown2: 'scaleUpDown 0.5s ease-in-out infinite',
      },
      fontFamily: {
        baloo: ['"Baloo2"'], // from first config
        poppins: ['Poppins', 'sans-serif'], // from second config
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};
