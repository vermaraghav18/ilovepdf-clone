const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Unlock PDF function
const unlockPdf = async (inputPdfPath, outputPdfPath, password) => {
  return new Promise((resolve, reject) => {
    // Ensure the output directory exists
    const outputDir = path.dirname(outputPdfPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });  // Create directory if it doesn't exist
    }

    // Quote the file paths to handle spaces correctly
    const command = `qpdf "${inputPdfPath}" --password=${password} --decrypt -- "${outputPdfPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(new Error('Failed to unlock PDF'));
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error('Failed to unlock PDF'));
      }
      console.log(`stdout: ${stdout}`);
      resolve(outputPdfPath); // Return the unlocked PDF path
    });
  });
};

module.exports = { unlockPdf };
