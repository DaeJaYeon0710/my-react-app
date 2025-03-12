module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gong: ['GongGothicMedium', 'sans-serif'], // ✅ Tailwind에서 `font-gong`으로 사용 가능
      },
      width: {
        "128": "32rem",
        "160": "40rem",
        "192": "48rem",
        "256": "64rem", // ✅ 더 넓은 width 옵션 추가
      },
      maxWidth: {
        "none": "none", // ✅ `max-w-none`이 제한되지 않도록 설정
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        expand: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-out",
        fadeOut: "fadeOut 0.7s ease-out",
        expand: "expand 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
