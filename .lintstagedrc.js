const path = require("path");

const getAffectedWorkspaces = (files) => {
  const workspaces = new Set();

  files.forEach((file) => {
    const segments = file.split(path.sep);

    // Extract workspace (e.g., apps/web, packages/ui)
    if (segments[0] === "apps" || segments[0] === "packages") {
      workspaces.add(`${segments[0]}/${segments[1]}`);
    }
  });

  return Array.from(workspaces);
};

module.exports = {
  "**/*.{js,jsx,ts,tsx}": (filenames) => {
    const workspaces = getAffectedWorkspaces(filenames);
    const commands = [];

    // Run lint in each affected workspace using its own config
    workspaces.forEach((workspace) => {
      commands.push(
        `turbo run lint --filter=./${workspace} --continue`,
        `turbo run type-check --filter=./${workspace} --continue`,
      );
    });

    // Format files with their workspace's config
    workspaces.forEach((workspace) => {
      const workspaceFiles = filenames.filter((f) => f.startsWith(workspace));
      if (workspaceFiles.length > 0) {
        commands.push(
          `cd ${workspace} && prettier --write ${workspaceFiles
            .map((f) => path.relative(workspace, f))
            .join(" ")}`,
        );
      }
    });

    return commands;
  },
};
