import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string | null;
  image?: string | null;
};

function PageMeta({ title, description, image }: Props) {
  return (
    <Helmet>
      {/* HTML page level meta */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}

      {/* OpenGraph page level meta */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}

export default PageMeta;
