/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  "useTabs": true,
	"trailingComma": "all",
	"arrowParens": "always",
	"bracketSameLine": true
};

export default config;
