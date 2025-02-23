"use client";
import { useState, useEffect } from "react";
import { infoMessages } from "../lib/infoMessages"; // ✅ Henter meldinger fra lib

interface InfoButtonProps {
  page: string; // Bestemmer hvilken melding som vises
}

export default function InfoButton({ page }: InfoButtonProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [message, setMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (infoMessages[page]) {
      setMessage(infoMessages[page]);
    }
  }, [page]);

  return (
    <>
      {/* ❔ Info-knapp */}
      <button
        onClick={() => setShowInfo(true)}
        className="fixed bottom-4 right-4 bg-[#fcdd8c] text-black p-3 px-5 rounded-full shadow-md transition-colors duration-300 hover:bg-[#b2aeff] hover:text-white"
      >
        ?
      </button>

      {/* Popup-boks */}
      {showInfo && message && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-[#1f1031] p-6 rounded-lg shadow-lg text-white max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">{message.title}</h2>
            <p className="text-lg">{message.message}</p>
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </>
  );
}
