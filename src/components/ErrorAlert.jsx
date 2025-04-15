const ErrorAlert = ({ error, onClose }) => {
    if (!error) return null;
  
    return (
      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
        <button 
          onClick={onClose} 
          className="float-right font-bold"
        >
          &times;
        </button>
      </div>
    );
  };
  
  export default ErrorAlert;