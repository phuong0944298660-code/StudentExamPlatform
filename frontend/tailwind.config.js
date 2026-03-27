/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-dark': '#2563EB',
        accent: '#6366F1',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        'app-bg': '#F8FAFC',
        'card-bg': '#FFFFFF',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        number: ['"Nunito"', '"Roboto"', 'sans-serif'],
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'base': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'btn': '8px',
        'card': '12px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
}
