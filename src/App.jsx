// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

// Tool Pages
import MergePdfPage from './pages/MergePdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import CompressPdfPage from './pages/CompressPdfPage';
import PdfToWordPage from './pages/PdfToWordPage';
import EditPdfPage from './pages/EditPdfPage';
import PdfToPowerpointPage from './pages/PdfToPowerpointPage';
import PdfToExcelPage from './pages/PdfToExcelPage';
import WordToPdfPage from './pages/WordToPdfPage';
import PowerpointToPdfPage from './pages/PowerpointToPdfPage';
import ExcelToPdfPage from './pages/ExcelToPdfPage';
import PdfToJpgPage from './pages/PdfToJpgPage';
import JpgToPdfPage from './pages/JpgToPdfPage';
import SignPdfPage from './pages/SignPdfPage';
import WatermarkPdfPage from './pages/WatermarkPdfPage';
import RotatePdfPage from './pages/RotatePdfPage';
import HtmlToPdfPage from './pages/HtmlToPdfPage';
import UnlockPdfPage from './pages/UnlockPdfPage';
import ProtectPdfPage from './pages/ProtectPdfPage';
import OrganizePdfPage from './pages/OrganizePdfPage';
import PdfToPdfAPage from './pages/PdfToPdfAPage';
import RepairPdfPage from './pages/RepairPdfPage';
import AddPageNumbersPage from './pages/AddPageNumbersPage';
import ScanToPdfPage from './pages/ScanToPdfPage';
import OcrPdfPage from './pages/OcrPdfPage';
import ComparePdfPage from './pages/ComparePdfPage';
import RedactPdfPage from './pages/RedactPdfPage';
import CropPdfPage from './pages/CropPdfPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/merge_pdf" element={<MergePdfPage />} />
        <Route path="/split_pdf" element={<SplitPdfPage />} />
        <Route path="/compress_pdf" element={<CompressPdfPage />} />
        <Route path="/pdf_to_word" element={<PdfToWordPage />} />
        <Route path="/edit_pdf" element={<EditPdfPage />} />
        <Route path="/pdf_to_powerpoint" element={<PdfToPowerpointPage />} />
        <Route path="/pdf_to_excel" element={<PdfToExcelPage />} />
        <Route path="/word_to_pdf" element={<WordToPdfPage />} />
        <Route path="/powerpoint_to_pdf" element={<PowerpointToPdfPage />} />
        <Route path="/excel_to_pdf" element={<ExcelToPdfPage />} />
        <Route path="/pdf_to_jpg" element={<PdfToJpgPage />} />
        <Route path="/jpg_to_pdf" element={<JpgToPdfPage />} />
        <Route path="/sign_pdf" element={<SignPdfPage />} />
        <Route path="/watermark_pdf" element={<WatermarkPdfPage />} />
        <Route path="/rotate_pdf" element={<RotatePdfPage />} />
        <Route path="/html_to_pdf" element={<HtmlToPdfPage />} />
        <Route path="/unlock_pdf" element={<UnlockPdfPage />} />
        <Route path="/protect_pdf" element={<ProtectPdfPage />} />
        <Route path="/organize_pdf" element={<OrganizePdfPage />} />
        <Route path="/pdf_to_pdfa" element={<PdfToPdfAPage />} />
        <Route path="/repair_pdf" element={<RepairPdfPage />} />
        <Route path="/add_page_numbers" element={<AddPageNumbersPage />} />
        <Route path="/scan_to_pdf" element={<ScanToPdfPage />} />
        <Route path="/ocr_pdf" element={<OcrPdfPage />} />
        <Route path="/compare_pdf" element={<ComparePdfPage />} />
        <Route path="/redact_pdf" element={<RedactPdfPage />} />
        <Route path="/crop_pdf" element={<CropPdfPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
