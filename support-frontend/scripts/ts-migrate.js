const path = require('path');
const glob = require('glob');
const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { argv } = yargs(hideBin(process.argv));
const assetPath = path.resolve(__dirname, `../${argv.dir}`);

glob(`${assetPath}/**/*.{js,jsx}`, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`There are ${files.length} files to migrate in ${assetPath}.`);

    const failures = [];
    let successCounter = 0;

    const result = files.reduce((accumulatorPromise, filePath) => accumulatorPromise.then(() =>
      new Promise((resolve) => {
        exec(`npx flow-to-ts --delete-source --write ${filePath}`, (error) => {
          if (error) {
            failures.push(`Failed to migrate ${filePath}: ${error.message}`);
          } else {
            console.log(`Successfully migrated ${filePath}`);
            successCounter += 1;
          }

          resolve();
        });
      })), Promise.resolve());

    result.then(() => {
      console.log(`Successfully migrated ${successCounter} modules :)`);

      if (failures.length) {
        console.log(`Failed to migrate ${failures.length} :(`);
        failures.forEach((failure) => {
          console.log(failure);
        });
      }
    });
  }
});
