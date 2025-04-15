const StampTool = ({ onAddStamp }) => {
    const stampOptions = [
      { text: 'APPROVED', color: '#00aa00' },
      { text: 'REJECTED', color: '#ff0000' },
      { text: 'CONFIDENTIAL', color: '#0000ff' },
      { text: 'DRAFT', color: '#888888' },
      { text: 'URGENT', color: '#ff9900' },
      { text: 'VERIFIED', color: '#009900' },
    ];
  
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Stamp</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {stampOptions.map((stamp) => (
            <button
              key={stamp.text}
              onClick={() => onAddStamp(stamp.text, stamp.color)}
              className="px-3 py-2 rounded-md border"
              style={{
                backgroundColor: `${stamp.color}20`,
                color: stamp.color,
                borderColor: stamp.color
              }}
            >
              {stamp.text}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Custom stamp text"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                onAddStamp(e.target.value, '#000000');
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousElementSibling;
              if (input.value) {
                onAddStamp(input.value, '#000000');
                input.value = '';
              }
            }}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>
    );
  };
  
  export default StampTool;