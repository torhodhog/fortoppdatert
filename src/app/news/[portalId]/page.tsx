"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchNews } from "@/app/lib/api";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";
import PopUp from "../../../components/Popup"; // 🆕 Import PopUp-komponenten
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

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
  const [sammendrag, setSammendrag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visSammendrag, setVisSammendrag] = useState<boolean>(false);

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

  if (nyheter.length === 0) return null;

  const nyhet = nyheter[currentIndex];
  const bildeObj = nyhet.content.find((item) => item.type === "PICTURES");
  const bilde = bildeObj?.files?.[0];

  const hentSammendrag = async () => {
    if (!nyhet) return;

    setLoading(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: nyhet.content.find((item) => item.type === "MARKUP")?.data || "",
          type: "summary",
        }),
      });

      const data = await response.json();
      setSammendrag(data.result);
      setVisSammendrag(true);
    } catch (error) {
      console.error("Feil ved generering av sammendrag:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#100118] text-white px-4" {...swipeHandlers}>
      
      <Breadcrumb className="mb-4 self-start">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Hjem</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Nyheter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">{nyhet.title}</h1>

      {bilde?.url && (
        <Image src={bilde.url} alt={bilde.caption || "Nyhetsbilde"} width={500} height={300} className="rounded-lg mb-4" />
      )}

      <p 
        className="text-lg text-gray-300 mb-6 line-clamp-4"
        dangerouslySetInnerHTML={{ __html: nyhet.content.find((item) => item.type === "MARKUP")?.data || "" }}
      />

      <div className="flex gap-4">
        <Link key={nyhet.id} href={`/article/${nyhet.id}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Les saken →
        </Link>

        <button
          onClick={hentSammendrag}
          className="px-4 py-2 bg-[#b2aeff] text-[#1f1031] rounded-lg font-semibold hover:bg-[#fcdd8c] transition"
          disabled={loading}
        >
          {loading ? "Henter..." : "📌 Rask oppsummering"}
        </button>
      </div>

      {/* 🆕 Bruk PopUp-komponenten */}
      {visSammendrag && <PopUp content={sammendrag} onClose={() => setVisSammendrag(false)} />}

      <div className="mt-6 flex gap-4">
        <div className="flex justify-between w-full mt-4">
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

          <p className="xl:hidden text-gray-400 text-center w-full">⇦ Swipe ⇨</p>
        </div>
      </div>
    </div>
  );
}