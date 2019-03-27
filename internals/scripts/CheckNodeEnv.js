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
  let pythonPath = path.join(__dirname, '../..', 'app/constants') + '/pythonPath.json';
  fs.readFile(pythonPath, (err, data) =>{

    let pythonFile = JSON.parse(data);

    if(pythonFile.PYTHON_SERVER_PATH === ''){

      pythonFile.PYTHON_SERVER_PATH = path.join(__dirname, '..', 'python');

      fs.writeFile(pythonPath, JSON.stringify(pythonFile), (error) => {
        if(error) throw error;
      })
    }
  });
  
}
