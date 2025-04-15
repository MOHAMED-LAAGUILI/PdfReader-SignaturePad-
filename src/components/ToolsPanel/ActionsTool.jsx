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
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400 shadow-md disabled:opacity-50 transition"
      >
        {isLoading ? 'Generating...' : 'Download Signed PDF'}
      </button>
      <button
        onClick={onExportJson}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 shadow-md disabled:opacity-50 transition"
      >
        Export Metadata (JSON)
      </button>
      <button
        onClick={onSaveToServer}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 shadow-md disabled:opacity-50 transition"
      >
        Save to Server
      </button>
      <button
        onClick={onClearAll}
        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 shadow-md transition"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActionsTool;