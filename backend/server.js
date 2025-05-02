const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const imageUpload = multer({ dest: 'uploads/' });
const { processPdf } = require('./pdfOCR'); // Make sure the path is correct
const { unlockPdf } = require('./pdfUnlock'); // Import the unlockPdf function from pdfUnlock.js
const { protectPdf } = require('./pdfOperations'); // Importing protectPdf from pdfOperations
const { repairPdf } = require('./pdfUtils');  // Import the repairPdf function
const { PDFDocument , rgb } = require('pdf-lib');
const puppeteer = require('puppeteer');
const pdf = require('pdf-poppler');
const pdfParse = require('pdf-parse');  // To parse PDF files
const { Document, Packer, Paragraph, TextRun } = require('docx'); // For creating Word docx files
const ExcelJS = require('exceljs');
const mammoth = require('mammoth');
const { fromPath } = require('pdf2pic');
const Tesseract = require('tesseract.js');
const { exec } = require('child_process');
const pptx2pdf = require('pptx2pdf');  // Import PowerPoint to PDF converter
const imageToPdf = require('image-to-pdf');
const cors = require('cors');
const archiver = require('archiver');

const app = express();                
const port = 5000;


// Middleware to parse JSON request bodies
app.use(express.json());  // This will parse JSON bodies


// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


// Middleware
app.use(cors());
app.use(express.static('public'));



// Multer configuration for PDF file upload
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});



// Multer configuration for DOCX file upload
const docxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Multer configuration for JPG file upload
const jpgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


// Multer configuration for Excel file upload
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// File filter for PDF files
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDFs are allowed!'), false); // Reject the file
  }
};
// File filter for JPG files
const jpgFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG files are allowed!'), false); // Reject the file
  }
};


// Multer setup for file uploads (store files in memory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


// File filter for DOCX files
const docxFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only DOCX files are allowed!'), false); // Reject the file
  }
};

// File filter for Excel files
const excelFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only Excel files are allowed!'), false); // Reject the file
  }
};

// Helper function for cleanup
function cleanup(paths) {
  paths.forEach(p => {
    try { fs.existsSync(p) && fs.unlinkSync(p); }
    catch (e) { console.error('Cleanup error:', e); }
  });
}

// Helper function for cleanup (removes temporary files)
function cleanup(paths) {
  paths.forEach(p => {
    try {
      fs.existsSync(p) && fs.unlinkSync(p);
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  });
}
// Multer configurations for PDF and DOCX uploads
const uploadPDF = multer({ storage: pdfStorage, fileFilter: pdfFileFilter });
const uploadDOCX = multer({ storage: docxStorage, fileFilter: docxFileFilter });
const uploadExcel = multer({ storage: excelStorage, fileFilter: excelFileFilter });
const uploadJPG = multer({ storage: jpgStorage, fileFilter: jpgFileFilter });
const upload = multer({ storage });
const fileUpload = multer({ dest: 'uploads/' });



// Endpoint to handle PDF and image upload for editing
// Endpoint to handle PDF editing
app.post('/edit-pdf', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const pdfPath = req.files['pdf'][0].path;  // Path to the uploaded PDF
  const outputPdfPath = path.join('output', `edited_${req.files['pdf'][0].filename}.pdf`);  // Output path for the modified PDF

  console.log(`Uploaded PDF Path: ${pdfPath}`);

  try {
    // Load the uploaded PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the first page
    const page = pdfDoc.getPages()[0];

    // Add text annotation on the first page
    page.drawText('Edited PDF with Annotations!', {
      x: 50,
      y: 500,
      size: 30,
      color: rgb(0, 0, 0),  // Black text
    });

    // If an image is uploaded, embed it into the PDF
    if (req.files['image']) {
      const imagePath = req.files['image'][0].path;  // Get the image path from the upload
      const imageBytes = fs.readFileSync(imagePath); // Read the image file as a buffer
      const image = await pdfDoc.embedJpg(imageBytes); // Embed the image into the PDF

      // Draw the image on the first page of the PDF
      page.drawImage(image, { x: 50, y: 450, width: 200, height: 100 });
    }

    // Save the edited PDF
    const editedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, editedPdfBytes);

    // Send the edited PDF back to the user
    res.download(outputPdfPath, 'edited_pdf.pdf', () => {
      // Clean up the uploaded PDF and image files after use
      fs.unlinkSync(pdfPath);
      if (req.files['image']) {
        fs.unlinkSync(req.files['image'][0].path);
      }
    });

  } catch (error) {
    console.error('Error editing PDF:', error);
    res.status(500).send('Error editing PDF');
  }
});


//-------------- Function to SCAN PDF--------//

// Endpoint to handle the image upload and convert it to a PDF
app.post('/scan-pdf', imageUpload.single('image'), (req, res) => {
  const imagePath = req.file.path; // Path to the uploaded image
  const outputPdfPath = path.join('output', `${req.file.filename}.pdf`); // Output path for the PDF

  // Log image file path to verify
  console.log(`Uploaded Image Path: ${imagePath}`);

  // Read the image as base64
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.log("Error reading the image file", err);
      return res.status(500).send("Error processing the image.");
    } else {
      // Convert the image data to base64
      const imageBase64 = data.toString('base64');
      const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add the image to the PDF
      doc.addImage(imageDataUrl, 'JPEG', 10, 10, 180, 160); // Adjust width and height as needed

      // Ensure the output directory exists
      const outputDir = path.dirname(outputPdfPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });  // Create directory if it doesn't exist
      }

      // Save the generated PDF
      doc.save(outputPdfPath);

      // Send the generated PDF back to the user
      res.download(outputPdfPath, 'scanned_document.pdf', () => {
        // Clean up the uploaded image after the PDF is generated
        fs.unlinkSync(imagePath);  // Delete the image file after use
      });
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// Function to perform OCR on PDF
app.post('/ocr-pdf', upload.single('pdf'), async (req, res) => {
  const inputPdfPath = req.file.path;
  const outputTextPath = path.join('output', `${req.file.filename}.txt`); // Save OCR text

  try {
    await processPdf(inputPdfPath, outputTextPath); // Try extracting text or OCR
    res.download(outputTextPath); // Send the OCR text file to the user
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Error processing PDF');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

//-------------- UNLOCK PDF------------// 
app.post('/unlock-pdf', upload.single('pdf'), async (req, res) => {
  const { password } = req.body; // Get password from the frontend
  const inputPdfPath = req.file.path;
  const outputPdfPath = path.join('unlocked', req.file.filename); // Set output path for unlocked PDF

  try {
    const unlockedPdf = await unlockPdf(inputPdfPath, outputPdfPath, password); // Call the unlockPdf function
    res.download(unlockedPdf); // Send the unlocked PDF to the user
  } catch (error) {
    console.error('Error unlocking PDF:', error);
    res.status(500).send('Error unlocking PDF');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

//-------------- PROTECT PDF------------// 
app.post('/protect-pdf', upload.single('pdf'), async (req, res) => {
  const { password } = req.body; // Extract password from the frontend
  const inputPdfPath = req.file.path;
  const outputPdfPath = path.join('protected', req.file.filename); // Set destination for protected PDF

  try {
    const protectedPdf = await protectPdf(inputPdfPath, outputPdfPath, password); // Call protectPdf function
    res.download(protectedPdf); // Send the protected PDF to the user
  } catch (error) {
    console.error('Error protecting PDF:', error);
    res.status(500).send('Error protecting PDF');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

  //-------------- REPAIR PDF------------// 
  // Function to repair PDF
  app.post('/repair-pdf', fileUpload.single('file'), async (req, res) => {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const inputPdfPath = path.join(__dirname, 'uploads', file.filename);
      const outputPdfPath = path.join(__dirname, 'uploads', 'repaired_output.pdf');
  
      console.log('Input PDF Path:', inputPdfPath);
      console.log('Output PDF Path:', outputPdfPath);
  
      // Call repairPdf function to repair the uploaded PDF
      await repairPdf(inputPdfPath, outputPdfPath);
  
      // Send the repaired PDF back to the user
      res.download(outputPdfPath, 'repaired_output.pdf', (err) => {
        // Clean up uploaded and output files
        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPdfPath);
        if (err) console.error('Error sending file:', err);
      });
    } catch (err) {
      console.error('Error during PDF repair:', err);
      res.status(500).send('Error repairing the PDF.');
    }
  });



// Convert PDF to Word
app.post('/convert-pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfData = await pdfParse(pdfBytes);

    // Extract text from PDF using pdf-parse
    const extractedText = pdfData.text;

    // Create Word document using docx
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(extractedText), // Adding extracted text from PDF
              ],
            }),
          ],
        },
      ],
    });

    const docxPath = path.join(__dirname, 'uploads', 'converted.docx');
    
    // Save the Word document
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxPath, buffer);

    // Send the converted Word document to the user
    res.download(docxPath, 'converted.docx', () => {
      cleanup([file.path, docxPath]); // Cleanup uploaded file and converted file
    });
  } catch (err) {
    console.error('Error converting PDF to Word:', err);
    res.status(500).send('Something went wrong while converting the PDF to Word.');
  }
});


// Crop PDF endpoint
app.post('/crop-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Define the crop area (for example, cropping the center 500x500 area)
    const cropX = 50;   // x-coordinate to start cropping
    const cropY = 50;   // y-coordinate to start cropping
    const cropWidth = 500; // Width of the crop area
    const cropHeight = 500; // Height of the crop area

    // Crop each page of the PDF
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();

      // Apply crop to the page: Setting the crop box
      page.setCropBox(cropX, cropY, cropWidth, cropHeight);

      // Optionally, you can resize the page to fit the cropped area
      page.setSize(cropWidth, cropHeight);
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'uploads', 'cropped.pdf');
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    // Send the cropped PDF back as a response
    res.download(outputPath, 'cropped.pdf', () => {
      cleanup([file.path, outputPath]);
    });
  } catch (err) {
    console.error('Error cropping PDF:', err);
    res.status(500).send('Something went wrong while cropping the PDF.');
  }
});


// Redact PDF endpoint
app.post('/redact-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    
    // Define the area to redact (for example, by coordinates or specific text)
    const redactArea = { x: 100, y: 100, width: 200, height: 30 }; // Sample coordinates
    const redactionColor = rgb(0, 0, 0); // Black for redaction

    pages.forEach(page => {
      // Draw a rectangle over the area to redact
      page.drawRectangle({
        x: redactArea.x,
        y: redactArea.y,
        width: redactArea.width,
        height: redactArea.height,
        color: redactionColor,
        opacity: 1,
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'uploads', 'redacted.pdf');
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    // Send the redacted PDF back as a response
    res.download(outputPath, 'redacted.pdf', () => {
      cleanup([file.path, outputPath]);
    });
  } catch (err) {
    console.error('Error redacting PDF:', err);
    res.status(500).send('Error redacting the PDF.');
  }
});

// Compare PDFs endpoint
app.post('/compare-pdfs', upload.array('pdfs', 2), async (req, res) => {
  try {
    const { files } = req;

    if (!files || files.length !== 2) {
      return res.status(400).send('Please upload exactly two PDF files.');
    }

    const pdf1Path = files[0].path;
    const pdf2Path = files[1].path;

    // Extract text from both PDFs
    const pdf1Data = fs.readFileSync(pdf1Path);
    const pdf2Data = fs.readFileSync(pdf2Path);

    const pdf1Text = await pdfParse(pdf1Data);
    const pdf2Text = await pdfParse(pdf2Data);

    // Compare the extracted text from both PDFs
    const differences = compareText(pdf1Text.text, pdf2Text.text);

    // Send back the differences as a response
    res.json({ differences });

    cleanup([pdf1Path, pdf2Path]);  // Cleanup the uploaded PDFs after processing
  } catch (err) {
    console.error('Error comparing PDFs:', err);
    res.status(500).send('Something went wrong while comparing the PDFs.');
  }
});

// Function to compare text from two PDFs
function compareText(text1, text2) {
  let differences = [];

  // Simple line-by-line comparison
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');

  const maxLength = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLength; i++) {
    if (lines1[i] !== lines2[i]) {
      differences.push({ line: i + 1, pdf1: lines1[i], pdf2: lines2[i] });
    }
  }

  return differences;
}

// OCR PDF endpoint
app.post('/ocr-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfPath = file.path;
    const outputDir = path.dirname(pdfPath);
    const outputImagePath = path.join(outputDir, 'page_image.png'); // Output image path

    // Convert the first page of PDF to an image using pdf2pic
    const convertPDF = fromPath(pdfPath, {
      width: 1200,
      height: 1600,
    });

    // Convert the first page (index 0)
    const image = await convertPDF(1);
    fs.writeFileSync(outputImagePath, image);

    // Run OCR on the image using Tesseract.js
    Tesseract.recognize(
      outputImagePath,
      'eng',
      {
        logger: (m) => console.log(m), // Optional logger to monitor OCR process
      }
    ).then(({ data: { text } }) => {
      console.log('OCR Text: ', text);

      // Send the OCR text back as the response
      res.json({ text });
    });

  } catch (err) {
    console.error('Error during OCR on PDF:', err);
    res.status(500).send('Something went wrong while processing the PDF.');
  }
});


// Scan to PDF endpoint
app.post('/scan-to-pdf', upload.array('images'), async (req, res) => {
  try {
    const { files } = req;
    if (files.length === 0) {
      return res.status(400).send('No images uploaded.');
    }

    const imagePaths = files.map(file => file.path); // Get file paths
    const outputPdfPath = path.join(__dirname, 'uploads', 'scanned_document.pdf');

    // Use imageToPdf to create the PDF from images
    imageToPdf(imagePaths)
      .pipe(fs.createWriteStream(outputPdfPath))
      .on('finish', () => {
        // Send the generated PDF to the user
        res.download(outputPdfPath, 'scanned_document.pdf', () => {
          // Cleanup files after sending the PDF
          cleanup(imagePaths);
          cleanup([outputPdfPath]);
        });
      });
  } catch (error) {
    console.error('Error scanning images to PDF:', error);
    res.status(500).send('Error scanning images to PDF.');
  }
});

/// ---------------------------- ADD PAGE NUMBERS ---------------------------
app.post('/add-page-numbers', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const totalPages = pdfDoc.getPageCount();
    const fontSize = 12;

    // Create a new PDF document
    const newPdf = await PDFDocument.create();

    // Copy pages from the original PDF to the new PDF
    const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

    // Add each copied page and add page numbers
    pages.forEach((page, index) => {
      const newPage = newPdf.addPage(page);

      // Add page number at the bottom center
      const text = `${index + 1} / ${totalPages}`;
      newPage.drawText(text, {
        x: newPage.getWidth() / 2 - fontSize * text.length / 2, // Adjust page number to be center-aligned
        y: 30, // Position the text at the bottom
        size: fontSize,
      });
    });

    const modifiedPdfBytes = await newPdf.save();
    const outputPath = path.join(__dirname, 'uploads', 'pdf_with_page_numbers.pdf');
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    // Send the modified PDF to the user
    res.download(outputPath, 'pdf_with_page_numbers.pdf', () => {
      cleanup([file.path, outputPath]);
    });
  } catch (err) {
    console.error('Error adding page numbers to PDF:', err);
    res.status(500).send('Error adding page numbers to PDF.');
  }
});

// ---------------------------- REARRANGE PDF ---------------------------
// ---------------------------- REARRANGE PDF ---------------------------
app.post('/rearrange-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { order } = req.body;  // Rearrangement order input (comma-separated)

    if (!file || !order) {
      return res.status(400).send('Please upload a PDF file and provide the rearrange order.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pageCount = pdfDoc.getPageCount();
    const rearrangedPages = order.split(',').map(Number);  // Convert order to an array of page indices

    if (rearrangedPages.some(page => page >= pageCount)) {
      return res.status(400).send('Invalid page order specified.');
    }

    const newPdf = await PDFDocument.create();

    // Copy pages in the specified order
    for (let pageIndex of rearrangedPages) {
      const page = pdfDoc.getPage(pageIndex);
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
      newPdf.addPage(copiedPage);
    }

    const rearrangedPdfBytes = await newPdf.save();
    const outputPath = path.join(__dirname, 'uploads', 'rearranged.pdf');
    fs.writeFileSync(outputPath, rearrangedPdfBytes);

    res.download(outputPath, 'rearranged.pdf', () => {
      cleanup([file.path, outputPath]);
    });
  } catch (err) {
    console.error('Error rearranging PDF:', err);
    res.status(500).send('Error rearranging PDF.');
  }
});


// ---------------------------- REMOVE PAGES ---------------------------
app.post('/remove-pages', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { pagesToRemove } = req.body;  // Pages to remove (comma-separated)

    if (!file || !pagesToRemove) {
      return res.status(400).send('Please upload a PDF file and provide pages to remove.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Convert pagesToRemove to an array of page numbers
    const pagesToRemoveArr = pagesToRemove.split(',').map(Number);
    const pages = pdfDoc.getPages();

    // Create a new PDF document
    const newPdf = await PDFDocument.create();

    // Copy the pages that are not removed into the new PDF document
    for (let i = 0; i < pages.length; i++) {
      if (!pagesToRemoveArr.includes(i)) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
      }
    }

    // Save the modified PDF
    const modifiedPdfBytes = await newPdf.save();
    const outputPath = path.join(__dirname, 'uploads', 'modified.pdf');
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    // Send the modified PDF to the user
    res.download(outputPath, 'modified.pdf', () => {
      cleanup([file.path, outputPath]);
    });
  } catch (err) {
    console.error('Error removing pages from PDF:', err);
    res.status(500).send('Error removing pages from PDF.');
  }
});

// Route to convert HTML to PDF
app.post('/convert-html-to-pdf', async (req, res) => {
  const { html } = req.body;  // This will now properly destructure the 'html' property from the request body

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Set the HTML content to the page
    await page.setContent(html);
  
    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({ format: 'A4' });
  
    await browser.close();
  
    // Send the generated PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error during HTML to PDF conversion:', error);
    res.status(500).send('Failed to convert HTML to PDF');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



// Function to rotate PDF (handling different rotation angles)

const { degrees } = require('pdf-lib');

async function rotatePdf(pdfPath, outputPdfPath, rotationAngle) {
  try {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Normalize to nearest 90-degree increment
    const normalizedAngle = Math.round(rotationAngle / 90) * 90;
    
    // Convert to pdf-lib's Rotation object
    const rotation = degrees(normalizedAngle);

    // Rotate each page
    pages.forEach((page) => {
      page.setRotation(rotation);
    });

    const pdfBytesOutput = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytesOutput);

    console.log('PDF rotated and saved:', outputPdfPath);
  } catch (err) {
    console.error('Error rotating the PDF:', err);
    throw err;
  }
}
// API Route to handle PDF rotation
app.post('/rotate-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    if (![0, 90, 180, 270].includes(normalizedAngle)) {
      throw new Error('Rotation must be 0, 90, 180, or 270 degrees');
    }

    const pdfPath = file.path; // Path to the uploaded PDF file
    const outputPdfPath = path.join(__dirname, 'uploads', 'rotated_output.pdf'); // Path to save the rotated PDF
    const rotationAngle = parseInt(req.body.angle) || 90; // Get the rotation angle from the request body (defaults to 90 degrees)

    await rotatePdf(pdfPath, outputPdfPath, rotationAngle); // Call the function to rotate the PDF

    // Check if the file exists before sending
    if (fs.existsSync(outputPdfPath)) {
      res.download(outputPdfPath, 'rotated_output.pdf', (err) => {
        fs.unlinkSync(file.path);  // Cleanup the uploaded PDF after sending it
        fs.unlinkSync(outputPdfPath);  // Cleanup the rotated PDF after sending it
      });
    } else {
      res.status(500).send('Error: Rotated PDF file not found.');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(err.message || 'Failed to rotate PDF');
  }
});

// Route to handle adding watermark
app.post('/add-watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    const watermarkText = req.body.watermark || 'Watermark';  // Default watermark text

    // Loop through all pages and add watermark
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      
      // Set the font size and color
      const fontSize = 50;
      const color = rgb(0, 0, 0);  // Black color for the watermark

      // Draw watermark text at the center of the page
      page.drawText(watermarkText, {
        x: width / 4, // Position the watermark on the page (centered)
        y: height / 2,
        size: fontSize,
        color: color,
      });
    });

    // Save the modified PDF
    const watermarkedPdfBytes = await pdfDoc.save();
    
    // Save the watermarked PDF to a new file
    const outputPath = path.join(__dirname, 'uploads', 'watermarked_pdf.pdf');
    fs.writeFileSync(outputPath, watermarkedPdfBytes);

    // Send the watermarked PDF to the user
    res.download(outputPath, 'watermarked_pdf.pdf', () => {
      cleanup([req.file.path, outputPath]);
    });

  } catch (err) {
    console.error('Error adding watermark:', err);
    res.status(500).send('Something went wrong while adding the watermark.');
  }
});


// POST route to handle PDF signing
app.post('/sign-pdf', upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'signatureImage', maxCount: 1 }]), async (req, res) => {
  try {
    // Get the uploaded files
    const pdfFile = req.files['pdfFile'][0];
    const signatureImage = req.files['signatureImage'][0];

    if (!pdfFile || !signatureImage) {
      return res.status(400).send('Please upload both PDF and signature image.');
    }

    // Load the PDF and the signature image
    const pdfBuffer = fs.readFileSync(pdfFile.path);
    const signatureImageBuffer = fs.readFileSync(signatureImage.path);

    // Load the PDF document using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPages()[0];  // Use the first page for the signature

    // Embed the signature image
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBuffer);

    // Get the page's dimensions to position the signature
    const { width, height } = page.getSize();

    // Draw the signature on the page (adjust coordinates as needed)
    page.drawImage(signatureImageEmbed, {
      x: width - 200,  // Position the signature on the bottom-right corner
      y: 50,
      width: 150,  // Width of the signature
      height: 50,  // Height of the signature
    });

    // Save the modified PDF
    const signedPdfBytes = await pdfDoc.save();

    // Save the signed PDF to a new file
    const outputPath = path.join(__dirname, 'uploads', 'signed_pdf.pdf');
    fs.writeFileSync(outputPath, signedPdfBytes);

    // Send the signed PDF to the user
    res.download(outputPath, 'signed_pdf.pdf', () => {
      // Clean up uploaded files
      cleanup([pdfFile.path, signatureImage.path, outputPath]);
    });

  } catch (err) {
    console.error('Error signing the PDF:', err);
    res.status(500).send('Something went wrong while signing the PDF.');
  }
});


// ---------------------------- JPG TO PDF ---------------------------//
async function convertJpgToPdf(jpgPath, outputPdfPath) {
  try {
    const jpgBytes = fs.readFileSync(jpgPath);  // Read the JPG file

    const pdfDoc = await PDFDocument.create();  // Create a new PDF document
    const jpgImage = await pdfDoc.embedJpg(jpgBytes);  // Embed the JPG image into the PDF

    const { width, height } = jpgImage.scale(1);  // Get the image dimensions

    const page = pdfDoc.addPage([width, height]);  // Add a new page with the image dimensions
    page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    const pdfBytesOutput = await pdfDoc.save();  // Save the PDF
    fs.writeFileSync(outputPdfPath, pdfBytesOutput);  // Write the PDF to the output path
    console.log(`PDF created at: ${outputPdfPath}`);
  } catch (err) {
    console.error('Error converting JPG to PDF:', err);
  }
}

// API Route to handle JPG to PDF conversion
app.post('/convert-jpg-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const jpgPath = file.path;  // Path to the uploaded JPG file
    const outputPdfPath = path.join(__dirname, 'uploads', 'output.pdf');  // Path to save the converted PDF

    await convertJpgToPdf(jpgPath, outputPdfPath);  // Call the function to convert JPG to PDF

    res.download(outputPdfPath, 'output.pdf', () => {
      fs.unlinkSync(file.path);  // Cleanup the uploaded JPG file after serving the PDF
      fs.unlinkSync(outputPdfPath);  // Cleanup the generated PDF after sending it
    });
  } catch (err) {
    console.error('Error processing the file:', err);
    res.status(500).send('Error converting JPG to PDF.');
  }
});


// ---------------------------- PDF TO JPG ---------------------------
// Example code to send the JPG file as a blob to the client
app.post('/convert-pdf-to-jpg', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfPath = file.path;
    const outputDir = path.dirname(pdfPath);
    const outputPrefix = path.basename(pdfPath, path.extname(pdfPath));

    const options = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: outputPrefix,
      page: null,
    };

    await pdf.convert(pdfPath, options);

    const jpgFilePath = path.join(outputDir, `${outputPrefix}-1.jpg`);

    // Ensure that the file exists before sending it
    if (fs.existsSync(jpgFilePath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="converted_image.jpg"');
      const fileStream = fs.createReadStream(jpgFilePath);
      fileStream.pipe(res);

      // Cleanup the generated file after sending it
      fileStream.on('end', () => {
        cleanup([file.path, jpgFilePath]);
      });
    } else {
      res.status(500).send('Error: JPG file not generated.');
    }
  } catch (err) {
    console.error('Error converting PDF to JPG:', err);
    res.status(500).send('Something went wrong while converting the PDF to JPG.');
  }
});

// ---------------------------- EXCEL TO PDF ---------------------------
app.post('/convert-excel-to-pdf', uploadExcel.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send('No Excel file uploaded');

    const excelPath = file.path;  // Get the uploaded Excel file path
    const outputDir = path.dirname(excelPath);
    const outputPdfPath = path.join(outputDir, 'converted.pdf'); // Path for saving PDF

    // Step 1: Read the Excel file using exceljs
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.getWorksheet(1); // Read first sheet

    // Step 2: Convert Excel data to HTML
    let htmlContent = '<table border="1"><thead><tr>';

    worksheet.columns.forEach((column) => {
      htmlContent += `<th>${column.header}</th>`;
    });

    htmlContent += '</tr></thead><tbody>';

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      htmlContent += '<tr>';
      row.eachCell({ includeEmpty: true }, (cell) => {
        htmlContent += `<td>${cell.text}</td>`;
      });
      htmlContent += '</tr>';
    });

    htmlContent += '</tbody></table>';

    // Step 3: Use puppeteer to convert HTML content to PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content to be rendered in Puppeteer
    await page.setContent(htmlContent);

    // Generate PDF from the HTML content
    await page.pdf({ path: outputPdfPath, format: 'A4' });

    await browser.close();

    // Send the generated PDF to the client
    res.download(outputPdfPath, 'converted.pdf', () => {
      cleanup([file.path, outputPdfPath]);
    });
  } catch (err) {
    console.error('Error during Excel to PDF conversion:', err);
    res.status(500).send('Something went wrong while converting the Excel to PDF.');
  }
});


// ---------------------------- PDF MERGE ---------------------------
app.post('/merge', uploadPDF.array('files', 2), async (req, res) => {
  try {
    const { files } = req;
    if (files.length !== 2) {
      return res.status(400).send('Please upload exactly two PDF files.');
    }

    const pdfDoc = await PDFDocument.create();

    const firstPdfBytes = fs.readFileSync(files[0].path);
    const firstPdf = await PDFDocument.load(firstPdfBytes);
    const firstPdfPages = await pdfDoc.copyPages(firstPdf, firstPdf.getPageIndices());
    firstPdfPages.forEach((page) => {
      pdfDoc.addPage(page);
    });

    const secondPdfBytes = fs.readFileSync(files[1].path);
    const secondPdf = await PDFDocument.load(secondPdfBytes);
    const secondPdfPages = await pdfDoc.copyPages(secondPdf, secondPdf.getPageIndices());
    secondPdfPages.forEach((page) => {
      pdfDoc.addPage(page);
    });

    const mergedPdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'uploads', 'merged.pdf');
    fs.writeFileSync(outputPath, mergedPdfBytes);

    res.download(outputPath, 'merged.pdf', () => {
      cleanup([files[0].path, files[1].path, outputPath]);
    });
  } catch (err) {
    console.error("Error during PDF merging:", err);
    res.status(500).send('Something went wrong while merging PDFs.');
  }
});

// ---------------------------- WORD TO PDF ---------------------------
app.post('/convert-word-to-pdf', uploadDOCX.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send('No file uploaded');

    const docxPath = file.path;  // Get the uploaded DOCX file path
    const outputDir = path.dirname(docxPath);
    const outputPdfPath = path.join(outputDir, 'converted.pdf'); // Path for saving PDF

    // Step 1: Extract text from DOCX using mammoth
    const docxBuffer = fs.readFileSync(docxPath);
    const { value: htmlContent } = await mammoth.convertToHtml({ buffer: docxBuffer });

    // Step 2: Use puppeteer to convert the HTML content to a PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content to be rendered in Puppeteer
    await page.setContent(htmlContent);

    // Generate PDF from the HTML content
    await page.pdf({ path: outputPdfPath, format: 'A4' });

    await browser.close();

    // Send the generated PDF to the client
    res.download(outputPdfPath, 'converted.pdf', () => {
      cleanup([file.path, outputPdfPath]);
    });
  } catch (err) {
    console.error('Error during Word to PDF conversion:', err);
    res.status(500).send('Something went wrong while converting the Word to PDF.');
  }
});

// ---------------------------- POWERPOINT TO PDF ---------------------------
app.post('/convert-powerpoint-to-pdf', uploadPDF.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send('No PowerPoint file uploaded');

    const pptxPath = file.path;  // Get the uploaded PowerPoint file path
    const outputDir = path.dirname(pptxPath);
    const outputPdfPath = path.join(outputDir, 'converted.pdf'); // Path for saving PDF

    // Convert PowerPoint to PDF using pptx2pdf
    pptx2pdf(pptxPath, outputPdfPath)
      .then(() => {
        res.download(outputPdfPath, 'converted.pdf', () => {
          cleanup([file.path, outputPdfPath]);
        });
      })
      .catch((err) => {
        console.error('Error during PowerPoint to PDF conversion:', err);
        res.status(500).send('Something went wrong while converting the PowerPoint to PDF.');
      });
  } catch (err) {
    console.error('Error during PowerPoint to PDF conversion:', err);
    res.status(500).send('Something went wrong while converting the PowerPoint to PDF.');
  }
});

// ---------------------------- COMPRESS PDF ---------------------------
app.post('/compress', uploadPDF.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const compressedPdfPath = path.join(__dirname, 'uploads', 'compressed.pdf');
    fs.copyFileSync(file.path, compressedPdfPath);

    res.download(compressedPdfPath, 'compressed.pdf', () => {
      cleanup([file.path, compressedPdfPath]);
    });
  } catch (err) {
    console.error("Error during PDF compression:", err);
    res.status(500).send('Something went wrong while compressing the PDF.');
  }
});

// ---------------------------- SPLIT PDF ---------------------------
app.post('/split', uploadPDF.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).send('Please upload a PDF file.');
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pageCount = pdfDoc.getPageCount();
    const outputPaths = [];

    for (let i = 0; i < pageCount; i++) {
      const singlePagePdf = await PDFDocument.create();
      const [page] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(page);

      const splitPdfPath = path.join(__dirname, 'uploads', `split_page_${i + 1}.pdf`);
      const splitPdfBytes = await singlePagePdf.save();
      fs.writeFileSync(splitPdfPath, splitPdfBytes);

      outputPaths.push(splitPdfPath);
    }

    const zipPath = path.join(__dirname, 'uploads', 'split_pages.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipPath, 'split_pages.zip', () => {
        cleanup([file.path, ...outputPaths, zipPath]);
      });
    });

    archive.pipe(output);

    outputPaths.forEach((filePath) => {
      archive.append(fs.createReadStream(filePath), { name: path.basename(filePath) });
    });

    archive.finalize();
  } catch (err) {
    console.error("Error during PDF splitting:", err);
    res.status(500).send('Something went wrong while splitting the PDF.');
  }
});

// ---------------------------- PDF TO EXCEL ---------------------------
app.post('/convert-pdf-to-excel', uploadPDF.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send('No file uploaded');

    const pdfPath = file.path; // Get the uploaded PDF file path
    const outputDir = path.dirname(pdfPath);
    const outputExcelPath = path.join(outputDir, 'converted.xlsx'); // Path for saving Excel file

    // Read the PDF file buffer
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Parse the PDF to extract text
    const data = await pdfParse(pdfBuffer);

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Split the PDF text by lines and add each line as a new row in Excel
    const lines = data.text.split('\n');

    lines.forEach((line) => {
      worksheet.addRow([line]); // Add each line from the PDF as a row in Excel
    });

    // Save the Excel file
    await workbook.xlsx.writeFile(outputExcelPath);
    console.log('Excel file created:', outputExcelPath);

    // Send the Excel file as a response
    res.download(outputExcelPath, 'converted.xlsx', () => {
      cleanup([file.path, outputExcelPath]);
    });
  } catch (err) {
    console.error('Error during PDF to Excel conversion:', err);
    res.status(500).send('Something went wrong while converting the PDF.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
