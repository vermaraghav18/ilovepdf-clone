const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

function pptx2pdf(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Check OS (only works on Windows PowerPoint for now)
    if (process.platform !== 'win32') {
      return reject(new Error('PowerPoint to PDF conversion is only supported on Windows.'));
    }

    const vbsScript = `
      Set objPPT = CreateObject("PowerPoint.Application")
      objPPT.Visible = True
      Set objPresentation = objPPT.Presentations.Open("${inputPath.replace(/\\/g, '\\\\')}", -1, -1, 0)
      objPresentation.SaveAs "${outputPath.replace(/\\/g, '\\\\')}", 32
      objPresentation.Close
      objPPT.Quit
    `;

    const scriptPath = path.join(__dirname, 'ppt_convert_temp.vbs');
    fs.writeFileSync(scriptPath, vbsScript);

    exec(`cscript //nologo "${scriptPath}"`, (err, stdout, stderr) => {
      fs.unlinkSync(scriptPath); // clean up script file
      if (err) {
        console.error(stderr);
        reject(new Error('PowerPoint conversion failed.'));
      } else {
        resolve();
      }
    });
  });
}

module.exports = { pptx2pdf };
