/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 1. Blackletter / Old English ("Stay")
        blackletter: [
          '"Old English Text MT"',
          '"UnifrakturCook"',
          '"UnifrakturMaguntia"',
          "serif",
        ],
        oldenglish: [
          '"Old English Text MT"',
          '"UnifrakturCook"',
          '"UnifrakturMaguntia"',
          "serif",
        ],
        stay: [
          '"Old English Text MT"',
          '"UnifrakturCook"',
          '"UnifrakturMaguntia"',
          "serif",
        ],

        // 2. Didone Serif ("FOCUSED" - Bodoni Poster / Bodoni Moda / Didot)
        didone: [
          '"Bodoni Poster"',
          '"Bodoni Moda"',
          '"Bodoni Moda SC"',
          '"Didot"',
          '"Bodoni MT"',
          "serif",
        ],
        bodoni: [
          '"Bodoni Poster"',
          '"Bodoni Moda"',
          '"Bodoni Moda SC"',
          '"Didot"',
          '"Bodoni MT"',
          "serif",
        ],
        focused: [
          '"Bodoni Poster"',
          '"Bodoni Moda"',
          '"Bodoni Moda SC"',
          '"Didot"',
          '"Bodoni MT"',
          "serif",
        ],

        // 3. Geometric Sans-Serif ("BELIEVE / DREAM" - Montserrat Bold)
        geometric: [
          '"Montserrat"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        montserrat: [
          '"Montserrat"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: [
          '"Montserrat"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],

        // Monospace technical labels
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],

        // Display font mappings
        display: [
          '"Archivo Black"',
          '"Anton"',
          '"Bebas Neue"',
          "sans-serif",
        ],
        bebas: [
          '"Bebas Neue"',
          '"Bodoni Moda"',
          '"Montserrat"',
          "serif",
        ],
        anton: [
          '"Anton"',
          '"Bodoni Moda"',
          '"Montserrat"',
          "serif",
        ],
        syne: [
          '"Bodoni Moda"',
          '"Montserrat"',
          "serif",
        ],
      },
      colors: {
        // Official Brand Color Palette (Black, Red, Swirl, Off White)
        brand: {
          black: "#000000",
          red: "#EF0606",
          swirl: "#D3CCC7",
          offwhite: "#EFEEE8",
        },
        brandBlack: "#000000",
        brandRed: "#EF0606",
        brandSwirl: "#D3CCC7",
        brandOffWhite: "#EFEEE8",
        bone: "#D3CCC7",
        goldBanner: "#EF0606",
        crimson: "#EF0606",
      },
    },
  },
  plugins: [],
};
