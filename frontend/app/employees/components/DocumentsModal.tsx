"use client";

interface DocumentAsset {
  _key: string;
  asset: {
    url: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentAsset[];
}

export default function DocumentsModal({
  isOpen,
  onClose,
  documents,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 h-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Employee Documents</h2>
        {documents.length ? (
          <ul className="space-y-2">
            {documents.map((doc, index) => (
              <li key={doc._key}>
                <a
                  href={doc.asset?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents found.</p>
        )}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
