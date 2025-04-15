import { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function App0() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [signatures, setSignatures] = useState([]);
  const [stamps, setStamps] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const pdfContainerRef = useRef(null);
  const sigCanvas = useRef(null);
  const fileInputRef = useRef(null);

  // Dropzone for file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    }
  });

  const handleFileUpload = (file) => {
    setFileName(file.name);
    const fileUrl = URL.createObjectURL(file);
    setPdfFile(fileUrl);
    setPdfUrl('');
  };

  const loadPdfFromUrl = async () => {
    if (!pdfUrl) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(pdfUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      setPdfFile(fileUrl);
      setFileName(pdfUrl.split('/').pop() || 'document.pdf');
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setIsLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const addSignature = () => {
    if (!sigCanvas.current || !pdfFile) return;
    
    const signatureData = sigCanvas.current.toDataURL();
    if (!signatureData) return;
    
    setSignatures([...signatures, {
      id: Date.now(),
      type: 'signature',
      data: signatureData,
      page: pageNumber,
      x: 100, // Default position
      y: 100, // Default position
      width: 200,
      height: 100
    }]);
    
    sigCanvas.current.clear();
    setActiveTool(null);
  };

  const addStamp = () => {
    setStamps([...stamps, {
      id: Date.now(),
      type: 'stamp',
      text: 'APPROVED',
      page: pageNumber,
      x: 100,
      y: 100,
      color: '#ff0000',
      fontSize: 24
    }]);
    setActiveTool(null);
  };

  const addTextAnnotation = (text) => {
    if (!text) return;
    
    setTextAnnotations([...textAnnotations, {
      id: Date.now(),
      type: 'text',
      content: text,
      page: pageNumber,
      x: 100,
      y: 100,
      color: '#000000',
      fontSize: 14
    }]);
    setActiveTool(null);
  };

  const handlePageClick = (e) => {
    if (!activeTool || !pdfContainerRef.current) return;
    
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    switch (activeTool) {
      case 'signature':
        setSignatures(signatures.map(sig => 
          sig.id === signatures[signatures.length - 1].id 
            ? { ...sig, x, y } 
            : sig
        ));
        break;
      case 'stamp':
        setStamps(stamps.map(stamp => 
          stamp.id === stamps[stamps.length - 1].id 
            ? { ...stamp, x, y } 
            : stamp
        ));
        break;
      case 'text':
        setTextAnnotations(textAnnotations.map(annotation => 
          annotation.id === textAnnotations[textAnnotations.length - 1].id 
            ? { ...annotation, x, y } 
            : annotation
        ));
        break;
      default:
        break;
    }
  };

  const exportToJson = () => {
    if (!pdfFile) return;
    
    const metadata = {
      fileName,
      pdfSource: pdfUrl || 'uploaded_file',
      signatures,
      stamps,
      textAnnotations,
      createdAt: new Date().toISOString()
    };
    
    const jsonStr = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.pdf', '')}_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSignatures([]);
    setStamps([]);
    setTextAnnotations([]);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const generateSignedPdf = async () => {
    if (!pdfFile) return;
    
    try {
      setIsLoading(true);
      
      // Fetch the original PDF
      const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      const pages = pdfDoc.getPages();
      
      // Add signatures
      for (const signature of signatures) {
        if (signature.page > pages.length) continue;
        
        const page = pages[signature.page - 1];
        const pngImage = await pdfDoc.embedPng(signature.data);
        page.drawImage(pngImage, {
          x: signature.x,
          y: page.getHeight() - signature.y - signature.height,
          width: signature.width,
          height: signature.height
        });
      }
      
      // Add stamps
      for (const stamp of stamps) {
        if (stamp.page > pages.length) continue;
        
        const page = pages[stamp.page - 1];
        page.drawText(stamp.text, {
          x: stamp.x,
          y: page.getHeight() - stamp.y,
          size: stamp.fontSize,
          color: rgb(
            parseInt(stamp.color.slice(1, 3), 16) / 255,
            parseInt(stamp.color.slice(3, 5), 16) / 255,
            parseInt(stamp.color.slice(5, 7), 16) / 255
          ),
        });
      }
      
      // Add text annotations
      for (const text of textAnnotations) {
        if (text.page > pages.length) continue;
        
        const page = pages[text.page - 1];
        page.drawText(text.content, {
          x: text.x,
          y: page.getHeight() - text.y,
          size: text.fontSize,
          color: rgb(
            parseInt(text.color.slice(1, 3), 16) / 255,
            parseInt(text.color.slice(3, 5), 16) / 255,
            parseInt(text.color.slice(5, 7), 16) / 255
          ),
        });
      }
      
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download the modified PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace('.pdf', '')}_signed.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating signed PDF:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">PDF Signature App</h1>
        
        {/* PDF Source Selection */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
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
                  {isLoading ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or Upload PDF</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500"
              >
                <input {...getInputProps()} />
                <p className="text-gray-600">Drag & drop a PDF file here, or click to select</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* PDF Viewer and Tools */}
        {pdfFile && (
          <div className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* PDF Viewer */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber <= 1}
                      className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                      disabled={pageNumber >= numPages}
                      className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      className="px-3 py-1 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
                    <button
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                      className="px-3 py-1 bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div
                  ref={pdfContainerRef}
                  className="border border-gray-300 rounded-md overflow-auto relative"
                  style={{ minHeight: '600px' }}
                  onClick={handlePageClick}
                >
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="p-4 text-gray-600">Loading PDF...</div>}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </Document>
                  
                  {/* Render signatures, stamps, and text annotations */}
                  {signatures
                    .filter(sig => sig.page === pageNumber)
                    .map(signature => (
                      <div
                        key={signature.id}
                        className="absolute"
                        style={{
                          left: `${signature.x}px`,
                          top: `${signature.y}px`,
                          width: `${signature.width}px`,
                          height: `${signature.height}px`,
                        }}
                      >
                        <img
                          src={signature.data}
                          alt="Signature"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  
                  {stamps
                    .filter(stamp => stamp.page === pageNumber)
                    .map(stamp => (
                      <div
                        key={stamp.id}
                        className="absolute"
                        style={{
                          left: `${stamp.x}px`,
                          top: `${stamp.y}px`,
                          color: stamp.color,
                          fontSize: `${stamp.fontSize}px`,
                          fontWeight: 'bold',
                        }}
                      >
                        {stamp.text}
                      </div>
                    ))}
                  
                  {textAnnotations
                    .filter(text => text.page === pageNumber)
                    .map(text => (
                      <div
                        key={text.id}
                        className="absolute"
                        style={{
                          left: `${text.x}px`,
                          top: `${text.y}px`,
                          color: text.color,
                          fontSize: `${text.fontSize}px`,
                        }}
                      >
                        {text.content}
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Tools Panel */}
              <div className="w-full lg:w-80 bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tools</h2>
                
                {/* Signature Tool */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Signature</h3>
                  <div className="border border-gray-300 rounded-md p-2 mb-2">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 300,
                        height: 150,
                        className: 'w-full bg-white border border-gray-200',
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addSignature}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add Signature
                    </button>
                    <button
                      onClick={() => sigCanvas.current?.clear()}
                      className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                {/* Stamp Tool */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Stamp</h3>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => {
                        setActiveTool('stamp');
                        addStamp();
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md hover:bg-red-200"
                    >
                      APPROVED
                    </button>
                    <button
                      onClick={() => {
                        setActiveTool('stamp');
                        addStamp('REJECTED');
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      REJECTED
                    </button>
                  </div>
                </div>
                
                {/* Text Annotation Tool */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Text Annotation</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="annotationText"
                      placeholder="Enter text"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTextAnnotation(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const text = document.getElementById('annotationText').value;
                        addTextAnnotation(text);
                        document.getElementById('annotationText').value = '';
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={generateSignedPdf}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Generating...' : 'Download Signed PDF'}
                  </button>
                  <button
                    onClick={exportToJson}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Export Metadata (JSON)
                  </button>
                  <button
                    onClick={clearAll}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

