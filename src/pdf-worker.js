import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import worker from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = worker;
