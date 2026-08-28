import { ReactNode } from "react";

type Props = {
  headingId: string;
  title: string;
  children: ReactNode;
};

function EmbedSection({ headingId, title, children }: Readonly<Props>) {
  return (
    <section className="embed-tool-modal__section">
      <h3 id={headingId} className="embed-tool-modal__section-title">{title}</h3>
      {children}
    </section>
  );
}

export default EmbedSection;
