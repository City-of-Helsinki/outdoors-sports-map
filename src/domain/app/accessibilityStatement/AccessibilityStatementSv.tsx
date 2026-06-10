import React from "react";

import {
  Email,
  LinkWithoutLabel,
  Link,
  PhoneNumber,
} from "./utilityComponents";

export default function AccessibilityStatementSv() {
  return (
    <>
      <p>
        Detta tillgänglighetsutlåtande gäller webbplatsen Utemotionskarta på{" "}
        <LinkWithoutLabel>https://ulkoliikunta.fi/sv/</LinkWithoutLabel>.
        Helsingfors stad ansvarar för webbplatsen. Detta utlåtande beskriver
        hur tillgänglig webbplatsen är och hur du kan ge oss respons om dess
        tillgänglighet.
      </p>
      <h3>Hur tillgänglig är denna webbplats?</h3>
      <p>
        Enligt lagen om tillhandahållande av digitala tjänster ska offentliga
        webbplatser vara tillgängliga, vilket betyder att alla ska ha lika
        möjligheter att använda dem.
      </p>
      <p>
        Webbplatsen uppfyller till alla delar de tillgänglighetskriterier som
        lagen förutsätter (WCAG-kriterierna 2.1, nivå A och AA).
      </p>
      <h3>Utvärdering av tillgängligheten</h3>
      <p>
        I utvärderingen av tillgängligheten har man följt Helsingfors stads
        arbetsinstruktion och metoder för att säkra webbplatsens tillgänglighet
        i alla arbetsskeden.
      </p>
      <p>
        Tillgängligheten har kontrollerats genom revision av en extern expert.
        Tillgängligheten har kontrollerats med hjälp av automatisk
        tillgänglighetskontroll samt manuell kontroll av webbplatsen och dess
        innehåll.
      </p>
      <h3>Har du upptäckt brister i tillgängligheten?</h3>
      <p>
        Vi försöker hela tiden förbättra webbplatsens tillgänglighet. Ta
        kontakt med oss om du upptäcker brister i tillgängligheten som inte har
        beskrivits på den här sidan eller om innehållet du behöver inte är
        tillgängligt.
      </p>
      <p>
        <Link href="https://palautteet.hel.fi/sv">Ge respons med responsblanketten</Link>
      </p>
      <h3>Tillgänglighetstillsyn</h3>
      <p>
        Transport- och kommunikationsverket Traficom övervakar att
        tillgänglighetskraven följs. Om du är missnöjd med svaret eller om du
        inte fått något svar inom två veckor, kan du göra en anmälan till
        Traficom. Traficom meddelar detaljerat på sin webbplats hur man går
        till väga för att lämna in en anmälan och hur den handläggs.
      </p>
      <p>Transport- och kommunikationsverket Traficom</p>
      <p>Enheten för tillsyn över digital tillgänglighet</p>
      <p>
        <LinkWithoutLabel>www.tillganglighetskrav.fi</LinkWithoutLabel>
      </p>
      <p>E-post: <Email>saavutettavuus@traficom.fi</Email></p>
      <p>
        Telefonnummer till växeln: <PhoneNumber>029 534 50 00</PhoneNumber>
      </p>
      <h3>Uppgifter om tillgänglighetsutlåtandet</h3>
      <p>Webbplatsen publicerades den 15 december 2016.</p>
      <p>Utlåtandet har upprättats den 24 mars 2023.</p>
      <p>Utlåtandet har uppdaterats senast den 10 juni 2026.</p>
      <p>
        <Link href="https://www.finlex.fi/sv/laki/alkup/2019/20190306">
          Lagen om tillhandahållande av digitala tjänster (306/2019)
        </Link>
      </p>
    </>
  );
}
