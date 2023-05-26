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
        This accessibility statement applies to the website ulkoliikunta.fi of
        the City of Helsinki.
      </p>
      <h3>Statutory provisions applicable to the website</h3>
      <p>
        This website was published prior to 23 September 2018. The website must
        fulfil the statutory accessibility requirements after the transitional
        period ending on 23 September 2020.
      </p>
      <h3>The objective of the city</h3>
      <p>
        As regards the accessibility of digital services, Helsinki aims to reach
        at least Level AA or above as set forth in the WCAG guidelines in so far
        as is reasonably practical.
      </p>
      <h3>Compliance status</h3>
      <p>
        This website meets the statutory critical accessibility requirements in
        accordance with Level AA of the WCAG v2.1.
      </p>
      <h3>Preparing an accessibility statement</h3>
      <p>This statement was prepared on 1.10.2021.</p>
      <h3>Assessment of accessibility</h3>
      <p>
        The working instruction and procedures of the City of Helsinki were
        followed when evaluating the accessibility of the site, with the aim of
        ensuring that websites are accessible in all stages of the work process.
      </p>
      <p>
        Accessibility was evaluated by means of an audit by a third-party expert
        as well as self-evaluation.
      </p>
      <p>
        The level of accessibility has been assessed through an audit conducted
        by a third party expert and through a self-assessment. The expert
        assessment was conducted by the City of Helsinki Service Centre.
      </p>
      <p>
        The level of accessibility has been assessed by applying programmatic
        accessibility assessment methods and manual assessment of the website.
        The functional observations generated during the assessment are valid
        for both the desktop and mobile environments.
      </p>
      <p>
        The manual testing utilised Chrome and Firefox browsers, their 200% zoom
        functions, and their teleinformatic tools, such as screenreader
        software, controls and specialised keyboards. Mobile testing was
        performed on iOS and Android operating systems and the screenreaders
        optimised for them.
      </p>
      <p>
        Defects reported by the evaluation tools and by the audit were reviewed
        and, if necessary, corrected.{" "}
      </p>
      <h3>Updating the accessibility statement</h3>
      <p>
        When website technology or content changes, its accessibility must be
        ensured through constant monitoring and periodic checks at least once a
        year. This statement will be updated in conjunction with website changes
        and accessibility evaluations.
      </p>
      <h3>Feedback and contact information</h3>
      <p>
        The party responsible for the accessibility of the website is the
        Communications and Marketing Service of the City of Helsinki’s Culture
        and Leisure Division, telephone exchange{" "}
        <PhoneNumber>09 310 1060</PhoneNumber>.
      </p>
      <h3>Reporting non-accessible content</h3>
      <p>
        If a user feels that accessibility requirements have not been met, they
        can report the issue through the feedback form at{" "}
        <LinkWithoutLabel>
          palautteet.hel.fi
        </LinkWithoutLabel>
        .
      </p>
      <h3>Requesting information in an accessible format</h3>
      <p>
        If a user feels that content on a website is not available in an
        accessible format, they can request for this information through the 
        feedback form at{" "}
        <LinkWithoutLabel>
          palautteet.hel.fi
        </LinkWithoutLabel>
        . The aim is to reply to the enquiry within a reasonable time frame.
      </p>
      <h3>Legal protection of accessibility, Enforcement procedure</h3>
      <p>
        If a user feels that their report or enquiry has not received a response
        or that the response is unsatisfactory, they can report the issue to the
        Regional State Administrative Agency of Southern Finland. The website of
        the Regional State Administrative Agency of Southern Finland explains in
        detail how the matter will be processed.
      </p>
      <p>Regional State Administrative Agency of Southern Finland</p>
      <p>Accessibility monitoring unit</p>
      <p>
        <LinkWithoutLabel>www.saavutettavuusvaatimukset.fi</LinkWithoutLabel>
      </p>
      <p>
        <Email>saavutettavuus@avi.fi</Email>
      </p>
      <p>
        Telephone exchange <PhoneNumber>+358 295 016 000</PhoneNumber>
      </p>
      <p>Open: Mon-Fri at 8:00–16:15</p> 
      <h3>The City of Helsinki and accessibility</h3>
      <p>
        The objective of the city of Helsinki is to be an accessible city to
        all. Helsinki aims to ensure that all residents are able to move about
        and act as effortlessly as possible and that all content and services
        are accessible to all.
      </p>
      <p>
        The city promotes accessibility of digital services by streamlining
        publishing work and organising accessibility-related training for its
        staff.
      </p>
      <p>
        The accessibility level of websites is monitored constantly during their
        maintenance. Immediate action will be taken if deficiencies are found.
        The aim is to carry out the necessary amendments as quickly as possible.
      </p>
      <h3>The disabled and users of assistive technologies</h3>
      <p>
        The city provides counselling and support for the disabled and users of
        assistive technologies. Support is available on guidance sites announced
        on the city’s website and through telephone counselling.
      </p>
      <p>
        <Link href="https://www.hel.fi/helsinki/en/administration/administration/communication">
          Go to the City's guidance site
        </Link>
      </p>
      <h3>Approval of the accessibility statement</h3>
      <p>
        This statement was approved by 1/10/2021
        <br />
        City of Helsinki
        <br />
        Culture and Leisure
        <br />
      </p>
    </>
  );
}
