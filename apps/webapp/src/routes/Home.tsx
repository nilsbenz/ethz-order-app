import { Page, SubPage } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import { UserLevel } from "@order-app/types";
import { Navigate } from "react-router-dom";

export default function Home() {
  const userData = useAuthStore((state) => state.userData);
  const event = useEventStore((state) => state.event);

  if (userData?.level === UserLevel.Waiter && event) {
    return (
      <Navigate
        replace
        to={`${Page.Companies}/${event?.companyId}/${SubPage.Events}/${event.id}/${SubPage.Order}`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="h1">Willkommen</h1>
      <p> bstell.online ist eine interaktive Web-App, die Dir das aufnehmen von Bestellungen und Abrechnen erleichtert.</p>
      <h2 className="h2">Erste Schritte</h2>
      <p> Falls du noch keinen Account hast, <a href="https://ethz-order-app.web.app/anmelden">erstelle Dir zuerst einen Account.</a> Scanne dann mit deinem Handy den Beitrittscode des Event-Organistators. Sobald Deine Anfrage akzeptiert wurde, kanns losgehen!</p>
      <h2 className="h2">Bestellungen Aufnehmen</h2>
      <p> Wähle zuerst den Tisch aus, welchen Du als nächstes bedienst.</p> 
      <img src="/home/tischwahl.jpg" alt="Tisch" />
      <p> Danach kannst Du die gewünschten Artikel einfach zur Bestellung hinzufügen</p> 
      <img src="/home/bestellen.jpg" alt="Bestellung" /> 
      <p>Wenn Du fertig bist, kannst Du auf "Weiter" klicken. Nun erhälst Du eine Übersicht über die Bestellung und kannst sie absenden. </p>
      <img src="/home/bestelluebersicht.jpg" alt="Übersicht" />
      <h2 className="h2">Abrechnen</h2>
      <p> Zum Schluss muss noch einkassiert werden. Möchten die Kunden getrennt bezahlen, kannst Du die zu bezahlenden Artikel auswählen und der zu bezahlende Betrag wird für dich berechnet. Du kannst danach auf "Weiter" klicken um den nächsten Teilbetrag einzukassieren.</p>
      <img src="/home/abrechnen.jpg" alt="Einkassieren" />
    </div>
    
  );
}
