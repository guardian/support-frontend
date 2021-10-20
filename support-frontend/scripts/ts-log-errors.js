const { exec } = require('child_process');
const fs = require('fs');

const tscCmd = 'yarn tsc';
const errorFileName = 'typescript-errors.json';

console.log(`Executing ${tscCmd}.`);

exec(tscCmd, (error, stdout) => {
  if (error && error.code && error.code > 2) {
    console.error(`exec error: ${error}`);
    return;
  }

  const lines = stdout.split(/(\r?\n)/g);

  const typescriptErrors = lines.reduce((accumulator, line) => {
    const capturedGroups = /^(?<errorPath>[^(]*(\.tsx|\.ts)).*?(?<errorCode>TS\d+):\s(?<errorMessage>.*)$/gm.exec(line);

    if (capturedGroups && capturedGroups.groups) {
      const { errorPath, errorCode, errorMessage } = capturedGroups.groups;

      const errorInstance = {
        path: errorPath,
        message: errorMessage,
      };

      const errorInstances = accumulator[errorCode]
        ? [...accumulator[errorCode], errorInstance]
        : [errorInstance];

      return {
        ...accumulator,
        [errorCode]: errorInstances,
      };
    }

    return accumulator;
  }, {});

  const byCode = Object.entries(typescriptErrors).reduce((counts, [errorCode, errorList]) => {
    // eslint-disable-next-line no-param-reassign
    counts[errorCode] = errorList.length;
    return counts;
  }, {});

  const byPath = Object.values(typescriptErrors).flat(1).reduce((counts, errorInstance) => {
    if (counts[errorInstance.path]) {
      // eslint-disable-next-line no-param-reassign
      counts[errorInstance.path] += 1;
    } else {
      // eslint-disable-next-line no-param-reassign
      counts[errorInstance.path] = 1;
    }
    return counts;
  }, {})

  const fileContents = {
    errorCounts: {
      byCode,
      byPath,
    },
    ...typescriptErrors,
  };

  fs.writeFileSync(errorFileName, JSON.stringify(fileContents, null, 4));

  const totalErrorCount = Object.keys(typescriptErrors).reduce(
    (accumulator, errorCode) => accumulator + typescriptErrors[errorCode].length,
    0,
  );

  console.log(`${totalErrorCount} Typescript errors have been logged and saved in ${errorFileName}.`);

  const topErrors = Object.keys(typescriptErrors)
    .filter(errorCode => typescriptErrors[errorCode].length >= 50)
    .map(errorCode => ({
      errorCode,
      count: typescriptErrors[errorCode].length,
    }))
    .sort((err1, err2) => {
      if (err1.count < err2.count) {
        return 1;
      }

      if (err1.count > err2.count) {
        return -1;
      }

      // count is equal
      return 0;
    });

  console.log('Errors with over 50 instances:');

  topErrors.forEach((err) => {
    console.log(`${err.errorCode} (count: ${err.count})`);
  });

  const filesWithErrors = Object.keys(typescriptErrors)
    .map(errorCode => typescriptErrors[errorCode].map(errorInstance => errorInstance.path))
    .flat()
    .map(filePath => `./${filePath}`);

  const filesWithErrorsMinusDuplicates = [...new Set(filesWithErrors)];

  filesWithErrorsMinusDuplicates.forEach((filePath) => {
    console.log(`"${filePath}",`);
  });
});
