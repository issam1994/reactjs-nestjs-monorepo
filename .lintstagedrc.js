module.exports = {
  "*.{js,jsx,ts,tsx}": (filenames) => {
    const apps = filenames
      .filter((f) => f.includes("/apps/"))
      .map((f) => f.split("/apps/")[1].split("/")[0]);
    const packages = filenames
      .filter((f) => f.includes("/packages/"))
      .map((f) => f.split("/packages/")[1].split("/")[0]);

    const uniqueWorkspaces = [...new Set([...apps, ...packages])];

    if (uniqueWorkspaces.length === 0) return [];

    return [
      `turbo run lint --filter=...{${filenames.join(",")}}`,
      "prettier --write " + filenames.join(" "),
    ];
  },
};
