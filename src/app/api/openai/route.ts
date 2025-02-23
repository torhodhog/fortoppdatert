import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Ingen tekst mottatt" }, { status: 400 });
    }

    let prompt = "";

    if (type === "summary") {
      prompt = `
        Lag et kort sammendrag i 5 korte stikkord av denne nyhetsartikkelen:
        - Bruk enkle, men fulle setninger.
        - Maks 5 punkter, marker med bulletpoints.
        - Hold det kort og konkret.
        
        Artikkel: "${text}"
      `;
    } else if (type === "highlight") {
      prompt = `
        Marker de viktigste ordene i denne nyhetsartikkelen ved å omgi dem med <mark>-tags.
        Velg maks 3-4 ord som er essensielle for å forstå saken.
        Artikkel: "${text}"
      `;
    } else {
      return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error("Feil med OpenAI API:", error);
    return NextResponse.json({ error: "Kunne ikke generere tekst" }, { status: 500 });
  }
}
