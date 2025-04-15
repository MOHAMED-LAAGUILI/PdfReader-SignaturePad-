import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import usePdfAnnotations from "./hooks/usePdfAnnotations";
import {
  generateSignedPdf,
  exportToJson,
  downloadBlob,
} from "./utils/pdfUtils";
import { pdfjs } from 'react-pdf';
import ErrorAlert from "./components/ErrorAlert";
import { PdfViewer, PdfControls } from "./components/PdfViewer";
import {AnnotationWrapper} from "./components/Annotation";
import {
  SignatureTool,
  StampTool,
  TextTool,
  ActionsTool,
} from "./components/ToolsPanel";
import { Toaster } from "react-hot-toast";
import SuccessAlert from "./components/SuccessAlert";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function App1() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.02);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    signatures,
    stamps,
    textAnnotations,
    addSignature,
    addStamp,
    addTextAnnotation,
    updateAnnotationPosition,
    updateAnnotationSize,
    updateAnnotationRotation,
    deleteAnnotation,
    clearAll,
  } = usePdfAnnotations();

  // Dropzone for file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    onDropRejected: (files) => {
      setError(`Only PDF files are allowed`);
    },
    onDropAccepted: () => {
      setSuccess("PDF uploaded");
    },
  });

  const handleFileUpload = (file) => {
    setFileName(file.name);
    const fileUrl = URL.createObjectURL(file);
    setPdfFile(fileUrl);
    setPdfUrl("");
    setError(null);
    setSuccess("PDF uploaded");
  };

  const loadPdfFromUrl = async () => {
    if (!pdfUrl) {
      setError("Please enter a PDF URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(pdfUrl, { responseType: "blob" });

      if (!response.headers["content-type"].includes("application/pdf")) {
        throw new Error("URL does not point to a PDF file");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(blob);
      setPdfFile(fileUrl);
      setFileName(pdfUrl.split("/").pop() || "document.pdf");
      setSuccess("PDF loaded");

    } catch (err) {
      setError(`Failed to load PDF: ${err.message}`);
      console.error("Error loading PDF:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleGeneratePdf = async () => {
    if (!pdfFile) return;

    try {
      setIsLoading(true);
      const pdfBytes = await generateSignedPdf(
        pdfFile,
        fileName,
        signatures,
        stamps,
        textAnnotations
      );

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      downloadBlob(blob, `${fileName.replace(".pdf", "")}_signed.pdf`);
    } catch (error) {
      setError(`Error generating PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!pdfFile) {
      setError("No PDF document loaded");
      return;
    }
    setSuccess("Exporting JSON...");

    try {
      const jsonStr = exportToJson(
        fileName,
        pdfUrl,
        signatures,
        stamps,
        textAnnotations
      );
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadBlob(blob, `${fileName.replace(".pdf", "")}_annotations.json`);
      setSuccess("JSON exported");
    } catch (err) {
      setError(`Failed to export JSON: ${err.message}`);
    }
  };

  const handleSaveToServer = async () => {
    if (!pdfFile) {
      setError("No PDF document loaded");
      return;
    }

    try {
      setIsLoading(true);
      const jsonData = exportToJson(
        fileName,
        pdfUrl,
        signatures,
        stamps,
        textAnnotations
      );
      setSuccess("Saving annotations...");
      // Example API call to Laravel backend
      const response = await axios.post("/api/save-annotations", {
        pdfName: fileName,
        pdfSource: pdfUrl || "uploaded",
        annotations: JSON.parse(jsonData),
        documentStats: {
          totalPages: numPages,
          lastModified: new Date().toISOString(),
        },
      });

      setSuccess("Annotations saved successfully!");
    } catch (err) {
      setError(`Failed to save to server: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Toaster position="top-center" reverseOrder={false} />

        <ErrorAlert error={error} onClose={() => setError(null)} />
        <SuccessAlert success={success} onClose={() => setSuccess(null)} />

        {/* PDF Source Selection */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="Enter PDF URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={loadPdfFromUrl}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load"}
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload PDF
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500"
              >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                  Drag & drop a PDF file here, or click to select
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer and Tools */}
        {pdfFile && (
          <div className="flex flex-col gap-4">
            {/* PDF Viewer */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-6">
              <PdfViewer
                pdfFile={pdfFile}
                pageNumber={pageNumber}
                numPages={numPages}
                scale={scale}
                rotation={rotation}
                onDocumentLoadSuccess={onDocumentLoadSuccess}
                onPageChange={setPageNumber}
                onScaleChange={setScale}
                onRotationChange={setRotation}
              >
                {/* Render signatures for current page */}
                {signatures
                  .filter((sig) => sig.page === pageNumber)
                  .map((signature) => (
                    <AnnotationWrapper
                      key={signature.id}
                      id={signature.id}
                      x={signature.x}
                      y={signature.y}
                      width={signature.width}
                      height={signature.height}
                      rotation={signature.rotation || 0}
                      onDrag={updateAnnotationPosition}
                      onResize={updateAnnotationSize}
                      onRotate={updateAnnotationRotation}
                      onDelete={deleteAnnotation}
                    >
                      <img
                        src={signature.data}
                        alt="Signature"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </AnnotationWrapper>
                  ))}

                {/* Render stamps for current page */}
                {stamps
                  .filter((stamp) => stamp.page === pageNumber)
                  .map((stamp) => (
                    <AnnotationWrapper
                      key={stamp.id}
                      id={stamp.id}
                      x={stamp.x}
                      y={stamp.y}
                      width={stamp.width || 150}
                      height={stamp.height || 50}
                      rotation={stamp.rotation || 0}
                      onDrag={updateAnnotationPosition}
                      onResize={updateAnnotationSize}
                      onRotate={updateAnnotationRotation}
                      onDelete={deleteAnnotation}
                    >
                      <img
                        src={stamp.text}
                        alt="Stamp"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </AnnotationWrapper>
                  ))}

                {/* Render text annotations for current page */}
                {textAnnotations
                  .filter((text) => text.page === pageNumber)
                  .map((text) => (
                    <AnnotationWrapper
                      key={text.id}
                      id={text.id}
                      x={text.x}
                      y={text.y}
                      width={text.width || 200}
                      height={text.height || 50}
                      rotation={text.rotation || 0}
                      onDrag={updateAnnotationPosition}
                      onResize={updateAnnotationSize}
                      onRotate={updateAnnotationRotation}
                      onDelete={deleteAnnotation}
                    >
                      <div
                        style={{
                          color: text.color,
                          fontSize: `${text.fontSize}px`,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 5px",
                          pointerEvents: "none",
                        }}
                      >
                        {text.content}
                      </div>
                    </AnnotationWrapper>
                  ))}
              </PdfViewer>
            </div>

            {/* Tools Panel - Now at the bottom with reorganized layout */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
              {/* Two-column layout for signature pad and annotations */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Left column - Signature pad */}
                <div className="flex-1 max-w-md">
                  <SignatureTool
                    onAddSignature={(signatureData) =>
                      addSignature(signatureData, pageNumber)
                    }
                  />
                </div>

                {/* Right column - Stamps and Text annotations */}
                <div className="flex-1 space-y-4">
                  <StampTool
                    onAddStamp={(text, color) =>
                      addStamp(text, color, pageNumber)
                    }
                  />
                  <TextTool
                    onAddText={(text) => addTextAnnotation(text, pageNumber)}
                  />
                </div>
              </div>

              {/* Action buttons in grid at the bottom */}
              <div className="flex justify-center">
                <div className="max-w-2xl w-full">
                  <ActionsTool
                    onGeneratePdf={handleGeneratePdf}
                    onExportJson={handleExportJson}
                    onSaveToServer={handleSaveToServer}
                    onClearAll={clearAll}
                    isLoading={isLoading}
                    layout="flex"
                    isExportJsonDisabled={false}
                    isSaveDisabled={false}
                    isClearDisabled={false}
                    isGeneratePdfDisabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
