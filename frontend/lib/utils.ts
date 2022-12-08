const { execSync } = require("child_process");

export function getCurrentGitBranch() {
  // NB this only works running on the server (e.g. an API route)
  // does not work in the browser!
  const branch = execSync("git branch --show-current").toString().trim();
  return branch;
}
