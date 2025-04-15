import { PDFDocument, rgb } from 'pdf-lib';

export const generateSignedPdf = async (pdfFile, fileName, signatures, stamps, textAnnotations) => {
  try {
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
        color: hexToRgb(stamp.color),
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
        color: hexToRgb(text.color),
      });
    }
    
    // Save the modified PDF
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error generating signed PDF:', error);
    throw error;
  }
};

export const exportToJson = (fileName, pdfUrl, signatures, stamps, textAnnotations, numPages) => {
  const metadata = {
    documentInfo: {
      fileName,
      source: pdfUrl || 'uploaded_file',
      totalPages: numPages,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    annotations: {
      signatures: signatures.map(sig => ({
        id: sig.id,
        type: sig.type,
        page: sig.page,
        position: { x: sig.x, y: sig.y },
        dimensions: { width: sig.width, height: sig.height },
        createdAt: sig.createdAt || new Date().toISOString()
      })),
      stamps: stamps.map(stamp => ({
        id: stamp.id,
        type: stamp.type,
        text: stamp.text,
        page: stamp.page,
        position: { x: stamp.x, y: stamp.y },
        style: {
          color: stamp.color,
          fontSize: stamp.fontSize,
          width: stamp.width || 150,
          height: stamp.height || 50
        },
        createdAt: stamp.createdAt || new Date().toISOString()
      })),
      textAnnotations: textAnnotations.map(text => ({
        id: text.id,
        type: text.type,
        content: text.content,
        page: text.page,
        position: { x: text.x, y: text.y },
        style: {
          color: text.color,
          fontSize: text.fontSize,
          width: text.width || 200,
          height: text.height || 50
        },
        createdAt: text.createdAt || new Date().toISOString()
      }))
    },
    documentStats: {
      totalSignatures: signatures.length,
      totalStamps: stamps.length,
      totalTextAnnotations: textAnnotations.length
    }
  };
  
  return JSON.stringify(metadata, null, 2);
};

export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};