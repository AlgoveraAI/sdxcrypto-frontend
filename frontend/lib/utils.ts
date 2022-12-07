const { execSync } = require("child_process");

export function getCurrentGitBranch() {
  const branch = execSync("git branch --show-current").toString().trim();
  return branch;
}
