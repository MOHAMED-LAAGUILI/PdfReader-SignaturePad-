import { Document, Page } from 'react-pdf';
import PdfControls from './PdfControls';

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
  children,
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
        className="pdf-viewer-container border border-gray-300 rounded-xl relative bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl transition-all duration-200 flex justify-center items-center w-full max-w-full overflow-x-auto"
        style={{ minHeight: '980px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}
      >
        <div className="relative flex justify-center items-center w-full" style={{ maxWidth: 900, width: '100%' }}>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full w-full min-h-[980px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="rounded-lg shadow-md mx-auto transition-all duration-200"
              width={900}
            />
          </Document>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
