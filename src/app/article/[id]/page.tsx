
/**
 * Nyhetsartikkel.tsx - Side for visning av en enkelt nyhetsartikkel.
 * -------------------------------------------------------------------
 * Denne komponenten henter og viser en spesifikk nyhetsartikkel basert på ID-en i URL-en.
 * 
 * Hovedfunksjoner:
 * - Henter nyhetsartikkelen fra API-et basert på ID.
 * - Viser tittel, tekstinnhold og eventuelle bilder tilknyttet artikkelen.
 * - Brukeren kan navigere tilbake til forrige side ved å klikke på "Tilbake".
 * - Viser en feilmelding dersom artikkelen ikke kan lastes inn.
 *
 * Viktige avhengigheter:
 * - next/navigation: Henter nyhets-ID fra URL-en og håndterer navigasjon.
 * - fetchSingleNews fra api.ts: Henter artikkelen fra API-et.
 * - Image fra next/image: Håndterer optimalisert visning av bilder.
 * - Tailwind CSS: Brukes for styling.
 *
 * Bruk:
 * - Brukeren klikker på en nyhetsmelding i nyhetsoversikten.
 * - Denne siden lastes med artikkelens tittel, innhold og bilder.
 * - Brukeren kan navigere tilbake ved å klikke på "Tilbake".

 */

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSingleNews } from "@/app/lib/api";
import Image from "next/image";
import FixedBottomWrapper from "@/components/FixedBottomWrapper";
import InfoButton from "@/components/InfoButton";

interface Nyhet {
  id: string;
  title: string;
  content: Array<{
    type: string;
    files?: Array<{ url?: string; caption?: string }>;
    data?: string;
  }>;
}

export default function Nyhetsartikkel() {
  const { id } = useParams();
  const router = useRouter();
  const [nyhet, setNyhet] = useState<Nyhet | null>(null);
  const [feil, setFeil] = useState<string | null>(null);

  useEffect(() => {
    async function hentNyhet() {
      try {
        const data = await fetchSingleNews(id as string);
        setNyhet(data);
      } catch (error) {
        console.error("Feil ved henting av nyheten:", error);
        setFeil("Kunne ikke laste inn nyheten.");
      }
    }
    if (id) hentNyhet();
  }, [id]);

  if (feil) return <p className="text-red-500">{feil}</p>;
  if (!nyhet) return <p className="text-white text-center p-6">Laster nyheten...</p>;

  return (
    <div className="min-h-screen bg-[#100118] text-white p-6 flex flex-col items-center">
      <div className="max-w-2xl">
        <button onClick={() => router.back()} className="mb-4 text-[#b2aeff] underline">
          ← Tilbake
        </button>

        <h1 className="text-3xl font-bold mb-4">{nyhet.title}</h1>

        {nyhet.content?.map((item, index) => (
          <div key={index}>
            {item.type === "PICTURES" &&
              item.files?.map((file, fileIndex) => (
                file.url && (
                  <Image 
                    key={fileIndex} 
                    src={file.url} 
                    alt={file.caption || "Bilde"} 
                    width={800} 
                    height={500} 
                    className="rounded-lg my-4"
                  />
                )
              ))
            }
            {item.type === "MARKUP" && (
              <div 
                dangerouslySetInnerHTML={{ __html: item.data ?? "" }} 
                className="prose max-w-none text-lg leading-relaxed first:font-semibold space-y-4 pt-4" 
              />
            )}
          </div>
        ))}
      </div>
      <FixedBottomWrapper>
              <InfoButton page="article" />
            </FixedBottomWrapper>
    </div>
  );
}