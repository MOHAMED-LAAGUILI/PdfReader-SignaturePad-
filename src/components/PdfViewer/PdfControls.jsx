const PdfControls = ({
    pageNumber,
    numPages,
    scale,
    rotation,
    onPageChange,
    onScaleChange,
    onRotationChange
  }) => {
    return (
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            title="First Page"
          >
            «
          </button>
          <button
            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            title="Previous Page"
          >
            ‹
          </button>
          <span className="text-sm text-gray-600">
            Page{' '}
            <select
              value={pageNumber}
              onChange={(e) => onPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>{' '}
            of {numPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            title="Next Page"
          >
            ›
          </button>
          <button
            onClick={() => onPageChange(numPages)}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            title="Last Page"
          >
            »
          </button>
        </div>
  
        <div className="flex items-center gap-2">
          <button
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            -
          </button>
          <select
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(scaleOption => (
              <option key={scaleOption} value={scaleOption}>
                {scaleOption * 100}%
              </option>
            ))}
          </select>
          <button
            onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            +
          </button>
        </div>
  
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRotationChange((rotation - 90) % 360)}
            className="px-3 py-1 bg-gray-200 rounded-md"
            title="Rotate Left"
          >
            ↺
          </button>
          <button
            onClick={() => onRotationChange((rotation + 90) % 360)}
            className="px-3 py-1 bg-gray-200 rounded-md"
            title="Rotate Right"
          >
            ↻
          </button>
        </div>
      </div>
    );
  };
  
  export default PdfControls;