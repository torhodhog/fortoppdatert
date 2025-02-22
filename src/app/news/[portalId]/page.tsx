"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchNews } from "@/app/lib/api";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";

interface Nyhet {
  id: string;
  title?: string;
  content: Array<{
    type: string;
    files?: Array<{ url?: string; caption?: string }>;
    data?: string;
  }>;
}

export default function NewsPage() {
  const { portalId } = useParams();

  const [nyheter, setNyheter] = useState<Nyhet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hent nyheter fra API
  useEffect(() => {
    async function hentNyheter() {
      try {
        const data = await fetchNews(portalId as string);
        setNyheter(data);
      } catch (error) {
        console.error("Feil ved henting av nyheter:", error);
      }
    }
    hentNyheter();
  }, [portalId]);

  // Swipe-funksjonalitet
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < nyheter.length - 1) setCurrentIndex((prev) => prev + 1);
    },
    onSwipedRight: () => {
      if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Hvis ingen nyheter er lastet inn
  if (nyheter.length === 0) return null;

  const nyhet = nyheter[currentIndex];
  const bildeObj = nyhet.content.find((item) => item.type === "PICTURES");
  const bilde = bildeObj?.files?.[0];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#100118] text-white px-4" {...swipeHandlers}>
      
      <h1 className="text-3xl font-bold mb-6">{nyhet.title}</h1>

      {bilde?.url && (
        <Image src={bilde.url} alt={bilde.caption || "Nyhetsbilde"} width={500} height={300} className="rounded-lg mb-4" />
      )}

      <p 
        className="text-lg text-gray-300 mb-6 line-clamp-4"
        dangerouslySetInnerHTML={{ __html: nyhet.content.find((item) => item.type === "MARKUP")?.data || "" }}
      />

      <Link key={nyhet.id} href={`/article/${nyhet.id}`} className="text-blue-500 underline">
        Les mer
      </Link>

      <div className="mt-6 flex gap-4">
      <div className="flex justify-between w-full mt-4">
  {/* For desktop (kun fra 1280px og opp) */}
  <div className="hidden xl:flex w-full justify-between">
    <button
      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
      disabled={currentIndex === 0}
      className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 mr-4"
    >
      ⇦ Forrige
    </button>
    <button
      onClick={() => setCurrentIndex((prev) => Math.min(nyheter.length - 1, prev + 1))}
      disabled={currentIndex === nyheter.length - 1}
      className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
    >
      Neste ⇨
    </button>
  </div>

  {/* For mobil og iPad (opptil 1279px) */}
  <p className="xl:hidden text-gray-400 text-center w-full">⇦ Swipe ⇨</p>
</div>

      </div>
    </div>
  );
}