const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const cCodeRunner = (filePath) => {
    const fileId = path.basename(filePath).split(".")[0];
    const outputPath = path.join(outputDir, `${fileId}.out`);
    return new Promise((resolve, reject) => { 
        exec(`gcc ${filePath} -o ${outputPath} && cd ${outputDir} && ${fileId}.out`,
            (error, stdout, stderr) => {
                if (error) reject(error);
                if (stderr) reject(stderr);
                resolve(stdout);
        })
    })
}

module.exports = {
    cCodeRunner
}