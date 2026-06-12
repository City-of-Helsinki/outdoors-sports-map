import React from "react";

import {
  Email,
  LinkWithoutLabel,
  Link,
  PhoneNumber,
} from "./utilityComponents";

export default function AccessibilityStatementFi() {
  return (
    <>
      <p>
        Tämä saavutettavuusseloste koskee Ulkoliikuntakartta-verkkosivustoa
        osoitteessa <LinkWithoutLabel openInNewTab>https://ulkoliikunta.fi/fi/</LinkWithoutLabel>.
        Verkkosivustosta vastaa Helsingin kaupunki. Tässä selosteessa kerrotaan,
        kuinka saavutettava verkkosivusto on ja miten voit antaa meille
        palautetta saavutettavuudesta.
      </p>
      <h3>Kuinka saavutettava tämä verkkosivusto on?</h3>
      <p>
        Digitaalisten palveluiden tarjoamista koskevan lain mukaan julkisten
        verkkosivustojen on oltava saavutettavia, eli kaikilla tulee olla
        tasavertaiset mahdollisuudet käyttää niitä.
      </p>
      <p>
        Tämä verkkosivusto täyttää kaikilta osin lain vaatimat
        saavutettavuuskriteerit (WCAG-kriteeristö 2.1, A- ja AA-taso).
      </p>
      <h3>Saavutettavuuden arviointi</h3>
      <p>
        Saavutettavuuden arvioinnissa on noudatettu Helsingin kaupungin
        työohjetta ja menetelmiä, jotka pyrkivät varmistamaan palvelun
        saavutettavuuden kaikissa työvaiheissa.
      </p>
      <p>
        Saavutettavuus on tarkistettu ulkopuolisen asiantuntijan suorittamana
        arviointina. Saavutettavuus on tarkistettu käyttäen ohjelmallista
        saavutettavuustarkistusta sekä verkkosivuston ja sisällön manuaalista
        tarkistusta.
      </p>
      <h3>Huomasitko puutteita saavutettavuudessa?</h3>
      <p>
        Pyrimme jatkuvasti parantamaan verkkosivuston saavutettavuutta. Ota
        meihin yhteyttä, jos löydät saavutettavuuspuutteita, joita ei ole
        kuvattu tällä sivulla, tai tarvitsemasi aineisto ei ole saavutettavaa.
        <Link external openInNewTab href="https://palautteet.hel.fi/fi">Anna palautetta palautelomakkeella</Link>
      </p>
      <h3>Saavutettavuuden valvonta</h3>
      <p>
        Liikenne- ja viestintävirasto Traficom valvoo
        saavutettavuusvaatimusten toteutumista. Jos et ole tyytyväinen saamaasi
        vastaukseen tai et saa vastausta lainkaan kahden viikon aikana, voit
        tehdä ilmoituksen Traficomille. Traficomin sivulla kerrotaan tarkasti,
        miten ilmoituksen voi tehdä ja miten asia käsitellään.
      </p>
      <p>Liikenne- ja viestintävirasto Traficom</p>
      <p>Digitaalisen esteettömyyden ja saavutettavuuden valvontayksikkö</p>
      <p>
        <LinkWithoutLabel external openInNewTab>www.saavutettavuusvaatimukset.fi</LinkWithoutLabel>
      </p>
      <p>
        Sähköposti: <Email>saavutettavuus@traficom.fi</Email>
      </p>
      <p>
        Puhelinnumero vaihde: <PhoneNumber>029 534 5000</PhoneNumber>
      </p>
      <h3>Saavutettavuusselosteen tiedot</h3>
      <p>Verkkosivusto on julkaistu 15.12.2016.</p>
      <p>Seloste on laadittu 24.03.2023.</p>
      <p>Seloste on viimeksi päivitetty 10.06.2026.</p>
      <p>
        <Link external openInNewTab href="https://www.finlex.fi/fi/laki/alkup/2019/20190306">
          Laki digitaalisten palvelujen tarjoamisesta (306/2019)
        </Link>
      </p>
    </>
  );
}
