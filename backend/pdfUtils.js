const fs = require('fs');
const pdfLib = require('pdf-lib');

async function repairPdf(inputPdfPath, outputPdfPath) {
  try {
    const pdfBytes = fs.readFileSync(inputPdfPath);
    console.log('PDF loaded successfully');

    const pdfDoc = await pdfLib.PDFDocument.load(pdfBytes);
    const repairedPdfBytes = await pdfDoc.save();

    fs.writeFileSync(outputPdfPath, repairedPdfBytes);
    console.log('PDF repaired successfully:', outputPdfPath);
  } catch (err) {
    console.error('Error during PDF repair:', err);
    throw new Error('Failed to repair the PDF');
  }
}

module.exports = { repairPdf };
