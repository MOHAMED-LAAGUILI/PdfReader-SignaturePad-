const stampOptions = [
  { label: 'APPROVED', src: 'https://tse3.mm.bing.net/th?id=OIP.YzgyhBauwDFBhCsQWIdM5gHaGp&pid=Api&P=0&h=180' },
  { label: 'REJECTED', src: 'http://pluspng.com/img-png/rejected-stamp-png-1024.jpg' },
  { label: 'VERIFIED', src: 'https://img.freepik.com/premium-vector/verified-stamp-vector-seal-design_116137-6262.jpg?w=2000' },
];

const StampTool = ({ onAddStamp }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">Stamps</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stampOptions.map((stamp) => (
          <button
            key={stamp.label}
            onClick={() => onAddStamp(stamp.src)}
            className="border-2 border-gray-200 rounded-xl p-2 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 transition flex flex-col items-center shadow-sm group"
            title={stamp.label}
            tabIndex={0}
          >
            <img src={stamp.src} alt={stamp.label} className="h-12 w-auto mx-auto rounded mb-1 group-hover:scale-110 transition-transform duration-150" />
            <span className="text-xs text-gray-600 mt-1 group-hover:text-blue-700">{stamp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StampTool;
