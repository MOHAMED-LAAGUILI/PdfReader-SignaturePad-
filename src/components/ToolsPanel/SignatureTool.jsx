import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureTool = ({ onAddSignature }) => {
  const sigCanvas = useRef(null);

  return (
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
          onClick={() => {
            const signatureData = sigCanvas.current.toDataURL();
            if (signatureData) {
              onAddSignature(signatureData);
              sigCanvas.current.clear();
            }
          }}
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
  );
};

export default SignatureTool;