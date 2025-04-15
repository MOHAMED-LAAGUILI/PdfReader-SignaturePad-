import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../ConfirmModal';

const ActionsTool = ({ 
  onGeneratePdf, 
  onExportJson, 
  onClearAll,
  onSaveToServer,
  isLoading,
  layout = 'flex',
  isExportJsonDisabled = false,
  isSaveDisabled = false,
  isClearDisabled = false,
  isGeneratePdfDisabled = false  
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClear = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClear = () => {
    onClearAll();
    toast.success('All annotations cleared');
  };

  const buttonBaseClasses =
    "w-full px-4 py-2 text-white rounded-lg shadow-md disabled:opacity-50 transition focus:ring-2 whitespace-nowrap";

  const containerClasses =
    layout === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'
      : 'flex flex-wrap justify-center md:justify-start gap-4 w-full mt-4';

  return (
    <>
      <div className={containerClasses}>
        {!isGeneratePdfDisabled && (
          <button
            onClick={onGeneratePdf}
            disabled={isLoading}
            className={`${buttonBaseClasses} bg-green-600 hover:bg-green-700 focus:ring-green-400`}
          >
            {isLoading ? 'Generating...' : 'Download PDF'}
          </button>
        )}
        {!isExportJsonDisabled && (
          <button
            onClick={onExportJson}
            disabled={isLoading}
            className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700 focus:ring-blue-400`}
          >
            Export JSON
          </button>
        )}
        {!isSaveDisabled && (
          <button
            onClick={onSaveToServer}
            disabled={isLoading}
            className={`${buttonBaseClasses} bg-purple-600 hover:bg-purple-700 focus:ring-purple-400`}
          >
            Save
          </button>
        )}
        {!isClearDisabled && (
          <button
            onClick={handleClear}
            className={`${buttonBaseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400`}
          >
            Clear
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Annotations"
        message="Are you sure you want to clear all annotations? This action cannot be undone."
      />
    </>
  );
};

export default ActionsTool;
