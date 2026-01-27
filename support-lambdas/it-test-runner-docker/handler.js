const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const workDir = path.join('/tmp', `run-${Date.now()}`);
  fs.mkdirSync(workDir);
  process.chdir(workDir);

  const branch = event.branch || 'main';
  const repoUrl = 'https://github.com/guardian/support-frontend.git';

  try {
    console.log(`Cloning repo (${branch})...`);
    execSync(`git clone --depth 1 --branch ${branch} ${repoUrl} .`, { stdio: 'inherit' });

    console.log("Installing...");
    execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });

    console.log("Running tests...");
    const result = execSync('pnpm --filter support-workers run it-test', {
        stdio: 'pipe',
        env: { ...process.env, CI: 'true' }
    }).toString();

    return { success: true, output: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message, output: error.stdout?.toString() };
  } finally {
    // Clean up to keep /tmp from filling up on warm starts
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};
