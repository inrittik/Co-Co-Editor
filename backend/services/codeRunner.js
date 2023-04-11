const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { stdout, stderr } = require("process");

const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const cCodeRunner = (filePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputDir, `${fileId}.out`);
  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filePath} -o ${outputPath} && cd ${outputDir} && ${fileId}.out`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const cppCodeRunner = (filePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  const outputPath = path.join(outputDir, `${fileId}.out`);
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outputPath} && cd ${outputDir} && ${fileId}.out`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const javaCodeRunner = (filePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  return new Promise((resolve, reject) => {
    exec(
      `javac -d ${outputDir} ${
        filePath + fileId
      }.java && java -cp ${outputDir} ${fileId}`,
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        if (stderr) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const pythonCodeRunner = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filePath}`, (error, stdout, stderr) => {
      if (error) reject({ error, stdout, stderr });
      if (stderr) reject(stderr);
      resolve(stdout);
    });
  });
};

const jsCodeRunner = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      if (error) reject({ error, stdout, stderr });
      if (stderr) reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  cCodeRunner,
  cppCodeRunner,
  javaCodeRunner,
  pythonCodeRunner,
  jsCodeRunner,
};
