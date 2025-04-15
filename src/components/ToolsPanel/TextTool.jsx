const TextTool = ({ onAddText }) => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Text Annotation</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="annotationText"
            placeholder="Enter text"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                onAddText(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              if (input.value) {
                onAddText(input.value);
                input.value = '';
              }
            }}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Name', 'Date', 'Signature', 'Initials', 'Approved by'].map((text) => (
            <button
              key={text}
              onClick={() => onAddText(text)}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default TextTool;