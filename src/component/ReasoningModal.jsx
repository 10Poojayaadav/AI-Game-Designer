const ReasoningModal = ({ isOpen, onClose, node }) => {
  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2 text-indigo-600">{node.title}</h2>
        <p className="text-sm text-gray-700 mb-4">{node.description}</p>
        <div className="mt-2">
          <div className="text-sm text-gray-500">
            Confidence: <strong>{node.confidence}%</strong>
          </div>
          {node.tool && (
            <div className="mt-2 text-sm text-gray-500">
              Tool Used: <strong>{node.tool}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReasoningModal;
