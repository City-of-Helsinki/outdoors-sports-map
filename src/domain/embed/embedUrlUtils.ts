import { CONTENT_ALL, DEFAULT_ABSOLUTE_HEIGHT, DEFAULT_RELATIVE_HEIGHT, DEFAULT_WIDTH_PX, HeightMode, WidthMode } from "./embedConstants";

export function buildEmbedUrl(lang: string, sport: string, unitId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = `${origin}/${lang}/embed`;
  const id = String(unitId).trim();
  if (id) return `${base}?unit=${encodeURIComponent(id)}`;
  if (sport !== CONTENT_ALL) return `${base}?sport=${encodeURIComponent(sport)}`;
  return base;
}

export function buildHtmlCode(
  embedUrl: string,
  widthMode: WidthMode,
  widthPx: string,
  heightMode: HeightMode,
  heightValue: string,
  title: string,
): string {
  const w = widthMode === "auto" ? "100%" : `${widthPx.trim() || DEFAULT_WIDTH_PX}px`;
  const h = heightValue.trim() || (heightMode === "relative" ? DEFAULT_RELATIVE_HEIGHT : DEFAULT_ABSOLUTE_HEIGHT);

  if (heightMode === "relative") {
    const parsedHeight = Number.parseFloat(h);
    const pb = Number.isNaN(parsedHeight)
      ? DEFAULT_RELATIVE_HEIGHT
      : parsedHeight.toFixed(1);
    return (
      `<div style="position:relative;width:${w};padding-bottom:${pb}%;">` +
      `<iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ` +
      `title="${title}" allowfullscreen></iframe></div>`
    );
  }

  const hPx = `${h}px`;
  if (widthMode === "auto") {
    return (
      `<div style="position:relative;width:100%;height:${hPx};">` +
      `<iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ` +
      `title="${title}" allowfullscreen></iframe></div>`
    );
  }
  return (
    `<iframe src="${embedUrl}" width="${w}" height="${hPx}" ` +
    `style="border:none;" title="${title}" allowfullscreen></iframe>`
  );
}
