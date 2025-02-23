"use client";

interface PopUpProps {
  content: string | null;
  onClose: () => void;
}

export default function PopUp({ content, onClose }: PopUpProps) {
  if (!content) return null; // Ikke vis popup hvis det ikke er noe innhold

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-[#1f1031] p-12 rounded-lg shadow-lg text-white max-w-md">
        <h2 className="text-xl font-bold mb-2">🔍 Sammendrag:</h2>
        <div className="text-lg space-y-2">
          {content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          ❌ Lukk
        </button>
      </div>
    </div>
  );
}