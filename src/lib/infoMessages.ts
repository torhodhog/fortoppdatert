export interface InfoMessage {
  title: string;
  message: string;
}

export const infoMessages: Record<string, InfoMessage> = {
  home: {
    title: "Velkommen til Fort Oppdatert",
    message: "🔥 Fort Oppdatert er laget for deg på farten. Swipe deg gjennom nyhetene og bli oppdatert på 5 minutter!"
  },
  news: {
    title: "Hvordan fungerer nyhetsvisningen?",
    message: "Swipe til høyre eller venstre for å bla gjennom nyheter. Trykk på 'Les mer' for å lese hele artikkelen."
  },
  article: {
    title: "Les mer om saken",
    message: "Du kan lese hele artikkelen her. Trykk tilbake-knappen for å gå tilbake til nyhetsvisningen."
  }
};