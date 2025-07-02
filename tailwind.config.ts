import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
      colors: {
        base: '#ffffff',
        brand: '#164387',
        'brand-accent': '#00B7FF',
        'brand-primary': '#181833',
        'brand-secondary': '#5C5C71',
        'brand-gray-100': '#a4a6aa',
        'brand-gray-200': '#DEE1E8',
        'brand-gray-300': '#F5F8FA',
        'brand-gray-400': '#A6ACBA',
        'brand-success': '#49C481',
        'brand-soft-green': '#86D086',
        'brand-warning': '#F4C755',
        'brand-error': '#F1416C',
        'brand-error-dark': '#c23458',
        'brand-tomato': '#E1685D',
        'brand-green-100': '#E8FAEB',
        transparent: 'transparent',

        'status-new-text': '#2A3985',
        'status-new': '#0D2CC6',
        'status-complete-text': '#08552B',
        'status-complete': '#41AA70',
        'status-waiting-text': '#6F4515',
        'status-waiting': '#F39529',
        'status-progress-text': '#1B4E7F',
        'status-progress': '#2487E4',
        'status-scheduled-text': '#5120A4',
        'status-scheduled': '#844BE5',
        'status-escalate-text': '#811D1D',
        'status-escalate': '#E94040',
        'status-approved-text': '#08552B',
        'status-approved': '#41AA70',
        'status-denied-text': '#811D1D',
        'status-denied': '#E94040',
        'status-general-text': '#084948',
        'status-general': '#27BFBD',
        'status-demo-text': '#631C72',
        'status-demo': '#C740E3',

        'priority-critical': '#F1414169',
        'priority-high': '#F17C4159',
        'priority-medium': '#FFEBC1',
        'priority-low': '#CDF2DE',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '40px',
      },
      backgroundImage: {
        // 'disabled-hour': "url('assets/images/backgrounds/disabled.png')",
        // 'extended-hour': "url('assets/images/backgrounds/extended.png')",
        // 'diagonal-stripes': 'repeating-linear-gradient(125deg, #DEE1E8 0px, #DEE1E8 1px, white 1px, white 10px)'
      },
    },
  },
};
