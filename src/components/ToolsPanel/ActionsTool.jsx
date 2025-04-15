const ActionsTool = ({ 
  onGeneratePdf, 
  onExportJson, 
  onClearAll,
  onSaveToServer,
  isLoading 
}) => {
  return (
    <div className="mt-6 space-y-2">
      <button
        onClick={onGeneratePdf}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Download Signed PDF'}
      </button>
      <button
        onClick={onExportJson}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Export Metadata (JSON)
      </button>
      <button
        onClick={onSaveToServer}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        Save to Server
      </button>
      <button
        onClick={onClearAll}
        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActionsTool;