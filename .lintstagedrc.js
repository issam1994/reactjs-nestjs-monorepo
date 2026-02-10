module.exports = {
  // Lint TypeScript/JavaScript files
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `turbo run lint --filter=[HEAD] -- ${filenames.join(" ")}`,
  ],

  // Format with Prettier
  "**/*.{js,jsx,ts,tsx,json,md,yml,yaml}": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
  ],
};
