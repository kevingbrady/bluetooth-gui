// @flow
import chalk from 'chalk';
import path from 'path';
var fs = require('fs');

export default function CheckNodeEnv(expectedEnv: string) {
  if (!expectedEnv) {
    throw new Error('"expectedEnv" not set');
  }

  if (process.env.NODE_ENV !== expectedEnv) {
    console.log(
      chalk.whiteBright.bgRed.bold(
        `"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`
      )
    );
    process.exit(2);
  }

  // Update path to python server if it does not exist
  let pythonInfo = path.join(__dirname, '../..', 'app/constants') + '/pythonPath.json';
  fs.readFile(pythonInfo, 'utf8', (err, pythonFile) => {

    if(pythonFile !== ""){

      let pythonOptions = JSON.parse(pythonFile);

      if(pythonOptions.PYTHON_SERVER_PATH === ""){

        pythonOptions.PYTHON_SERVER_PATH = path.join(__dirname, '..', 'python')

        fs.writeFile(pythonInfo, JSON.stringify(pythonOptions), (error) => {
          if(error) throw error;
        });
      }
    } else {
        let pythonPath = path.join(__dirname, '..', 'python');
        fs.writeFile(pythonInfo, JSON.stringify({"PYTHON_SERVER_PATH": pythonPath}), (error) => {
          if(error) throw error;
        });

    }
  });
}
