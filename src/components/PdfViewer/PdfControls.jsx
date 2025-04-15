const PdfControls = ({
  pageNumber,
  numPages,
  scale,
  rotation,
  onPageChange,
  onScaleChange,
  onRotationChange,
}) => {
  const SCALE_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const pageControls = [
    { label: '«', action: () => onPageChange(1), disabled: pageNumber <= 1, title: 'First Page' },
    { label: '‹', action: () => onPageChange(Math.max(1, pageNumber - 1)), disabled: pageNumber <= 1, title: 'Previous Page' },
    { label: '›', action: () => onPageChange(Math.min(numPages, pageNumber + 1)), disabled: pageNumber >= numPages, title: 'Next Page' },
    { label: '»', action: () => onPageChange(numPages), disabled: pageNumber >= numPages, title: 'Last Page' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-3 px-4 bg-white/80 rounded-t-xl border-b border-gray-200 shadow-sm mb-2 gap-2">
      {/* Page Controls */}
      <div className="flex items-center gap-2">
        {pageControls.map((ctrl, idx) => (
          <button
            key={idx}
            onClick={ctrl.action}
            disabled={ctrl.disabled}
            className={`px-3 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 text-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${ctrl.disabled ? '' : 'hover:scale-105'}`}
            title={ctrl.title}
            tabIndex={0}
          >
            {ctrl.label}
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600 font-medium bg-gray-50 px-2 py-1 rounded shadow-inner">
          Page <span className="text-blue-600 font-bold">{pageNumber}</span> / {numPages}
        </span>
      </div>

      {/* Scale Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Zoom:</span>
        <select
          value={scale}
          onChange={e => onScaleChange(Number(e.target.value))}
          className="px-2 py-1 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
        >
          {SCALE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt * 100}%</option>
          ))}
        </select>
      </div>

      {/* Rotation Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRotationChange((rotation - 90 + 360) % 360)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 text-lg transition shadow-sm"
          title="Rotate Left"
        >
          ↺
        </button>
        <button
          onClick={() => onRotationChange((rotation + 90) % 360)}
          className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 text-lg transition shadow-sm"
          title="Rotate Right"
        >
          ↻
        </button>
      </div>
    </div>
  );
};

export default PdfControls;
