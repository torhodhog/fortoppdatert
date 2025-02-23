"use client";
import { useEffect, useState } from "react";
import { fetchPortals } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import InfoButton from "@/components/InfoButton"; // Importer InfoButton-komponenten
import FixedBottomWrapper from "@/components/FixedBottomWrapper";

interface Portal {
  _id: string;
  name: string;
}

export default function Home() {
  const [portaler, setPortaler] = useState<Portal[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function hentPortaler() {
      try {
        const data = await fetchPortals();
        setPortaler(data);
      } catch (error) {
        console.error("Feil ved henting av portaler:", error);
      }
    }
    hentPortaler();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#100118] text-white px-4 pb-12">
      <h1 className="text-5xl font-bold mb-8 text-center pt-4">🔥 Fort oppdatert</h1>
      <p className="text-lg font-semibold mb-6 text-gray-300">Hva vil du få med deg?</p>
      
      <div className="flex flex-wrap gap-4 justify-center px-2 w-full max-w-md">
        {portaler.map((portal) => (
          <button
            key={portal._id}
            className="px-6 py-3 bg-[#b2aeff] text-[#1f1031] rounded-lg font-semibold 
            hover:bg-[#fcdd8c] transition transform hover:scale-105 active:scale-95 w-full md:w-auto"
            onClick={() => router.push(`/news/${portal._id}`)}
          >
            {portal.name}
          </button>
        ))}
      </div>
        <FixedBottomWrapper>
      <InfoButton page="home" /> 
    </FixedBottomWrapper>
    </div>
  );
}