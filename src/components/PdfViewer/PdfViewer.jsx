import { Document, Page, pdfjs } from 'react-pdf';
import PdfControls from './PdfControls';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ 
  pdfFile, 
  pageNumber, 
  numPages, 
  scale, 
  rotation,
  onDocumentLoadSuccess,
  onPageChange,
  onScaleChange,
  onRotationChange,
  children
}) => {

  return (
    <div className="flex-1">
      <PdfControls
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        rotation={rotation}
        onPageChange={onPageChange}
        onScaleChange={onScaleChange}
        onRotationChange={onRotationChange}
      />
      
      <div 
        className="border border-gray-300 rounded-md overflow-auto relative"
        style={{ minHeight: '600px' }}
      >
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-4 text-gray-600">Loading PDF...</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
        {children}
      </div>
    </div>
  );
};

export default PdfViewer;