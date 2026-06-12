import React from "react";

import {
  Email,
  LinkWithoutLabel,
  Link,
  PhoneNumber,
} from "./utilityComponents";

export default function AccessibilityStatementEn() {
  return (
    <>
      <p>
        This accessibility statement applies to the Outdoor Exercise Map
        website at <LinkWithoutLabel openInNewTab>https://ulkoliikunta.fi/en/</LinkWithoutLabel>.
        The City of Helsinki is responsible for the website. This statement
        explains how accessible the website is and how you can give us feedback
        on accessibility.
      </p>
      <h3>How accessible is this website?</h3>
      <p>
        According to the Act on the Provision of Digital Services, public
        websites must be accessible, i.e. everyone must have equal access to
        them.
      </p>
      <p>
        This website fully meets the accessibility criteria required by law
        (WCAG 2.1 criteria, conformance levels A and AA).
      </p>
      <h3>Accessibility assessment</h3>
      <p>
        The accessibility assessment was carried out in accordance with the
        guidelines of the City of Helsinki and using methods that aim to ensure
        the accessibility of the service at all stages.
      </p>
      <p>
        Accessibility was verified through an audit performed by an external
        specialist. Accessibility was verified using a programmatic
        accessibility verification and manual inspection of the website and
        content.
      </p>
      <h3>Did you notice shortcomings in accessibility?</h3>
      <p>
        We are constantly working to improve the accessibility of the website.
        Please contact us if you find accessibility shortcomings not described
        on this page, or if the material you need is not accessible.
      </p>
      <p>
        <Link external openInNewTab href="https://palautteet.hel.fi/en">
          Please provide feedback using the feedback form
        </Link>
      </p>
      <h3>Accessibility monitoring</h3>
      <p>
        The Finnish Transport and Communications Agency (Traficom) monitors the
        implementation of accessibility requirements. If you are dissatisfied
        with a response or do not receive one within two weeks, you can submit
        a notification to Traficom. The Traficom website explains exactly how
        to submit a notification and how the notification is processed.
      </p>
      <p>Finnish Transport and Communications Agency Traficom</p>
      <p>Digital Accessibility Supervision</p>
      <p>
        <LinkWithoutLabel external openInNewTab>www.saavutettavuusvaatimukset.fi/en</LinkWithoutLabel>
      </p>
      <p>
        Email: <Email>saavutettavuus@traficom.fi</Email>
      </p>
      <p>
        Phone number of the switchboard: <PhoneNumber>+358 29 534 5000</PhoneNumber>
      </p>
      <h3>Information in the accessibility statement</h3>
      <p>The website was published on 15 December 2016.</p>
      <p>This statement was prepared on 24 March 2023.</p>
      <p>This statement was last updated on 10 June 2026.</p>
      <p>
        <Link external openInNewTab href="https://www.finlex.fi/fi/laki/alkup/2019/20190306">
          Act on the Provision of Digital Services (in Finnish) (306/2019)
        </Link>
      </p>
    </>
  );
}
