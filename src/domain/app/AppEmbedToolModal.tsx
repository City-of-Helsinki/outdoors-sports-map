import { IconLayers, SelectionGroup } from "hds-react";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "./_appEmbedToolModal.scss";
import CopyRow from "../embed/CopyRow";
import EmbedRadioGroup from "../embed/EmbedRadioGroup";
import EmbedSection from "../embed/EmbedSection";
import SizeInput from "../embed/SizeInput";
import VenueSearch from "../embed/VenueSearch";
import {
  CONTENT_ALL,
  CONTENT_OPTIONS,
  CONTENT_SPORT,
  CONTENT_UNIT,
  DEFAULT_ABSOLUTE_HEIGHT,
  DEFAULT_HEIGHT_MODE,
  DEFAULT_RELATIVE_HEIGHT,
  DEFAULT_WIDTH_MODE,
  DEFAULT_WIDTH_PX,
  HEIGHT_MODE_RELATIVE,
  HEIGHT_OPTIONS,
  LANGUAGES,
  MAX_PREVIEW_HEIGHT_PX,
  SPORT_OPTIONS,
  WIDTH_MODE_FIXED,
  WIDTH_OPTIONS,
  ContentType,
  HeightMode,
  WidthMode,
} from "../embed/embedConstants";
import { buildEmbedUrl, buildHtmlCode } from "../embed/embedUrlUtils";
import useLocale from "./hooks/useLocale";
import CloseButton from "../../common/components/CloseButton";
import { UnitFilters } from "../unit/unitConstants";

const FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const HEADER_ID          = "app-header";
const TITLE_ID           = "embed-tool-overlay-title";
const LANG_HEADING_ID    = "embed-lang-heading";
const CONTENT_HEADING_ID = "embed-content-heading";
const WIDTH_HEADING_ID   = "embed-width-heading";
const HEIGHT_HEADING_ID  = "embed-height-heading";

type Props = {
  focusAfterCloseRef?: RefObject<HTMLElement>;
  show: boolean;
  onClose: () => void;
};


function AppEmbedToolModal({ focusAfterCloseRef, show = false, onClose }: Readonly<Props>) {
  const { t } = useTranslation();
  const locale = useLocale();

  const [embedLang, setEmbedLang]       = useState<string>(locale);
  const [contentType, setContentType]   = useState<ContentType>(CONTENT_ALL);
  const [sport, setSport]               = useState<string>(UnitFilters.SKIING);
  const [unitId, setUnitId]             = useState<string>("");
  const [widthMode, setWidthMode]       = useState<WidthMode>(DEFAULT_WIDTH_MODE);
  const [widthPx, setWidthPx]           = useState<string>(DEFAULT_WIDTH_PX);
  const [heightMode, setHeightMode]     = useState<HeightMode>(DEFAULT_HEIGHT_MODE);
  const [heightValue, setHeightValue]   = useState<string>(DEFAULT_RELATIVE_HEIGHT);
  const [copiedUrl, setCopiedUrl]       = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml]     = useState<boolean>(false);
  const [headerTop, setHeaderTop]       = useState<number>(0);
  const overlayRef                      = useRef<HTMLDialogElement>(null);
  const embedUrl = useMemo(
    () => buildEmbedUrl(
      embedLang,
      contentType === CONTENT_SPORT ? sport : CONTENT_ALL,
      contentType === CONTENT_UNIT ? unitId : "",
    ),
    [embedLang, contentType, sport, unitId],
  );

  const htmlCode = useMemo(
    () => buildHtmlCode(embedUrl, widthMode, widthPx, heightMode, heightValue, t("APP.NAME")),
    [embedUrl, widthMode, widthPx, heightMode, heightValue, t],
  );

  const previewFrameStyle = useMemo((): React.CSSProperties => {
    const width        = Math.max(Number.parseFloat(widthPx) || Number.parseFloat(DEFAULT_WIDTH_PX), 1);
    const defaultHeight = heightMode === HEIGHT_MODE_RELATIVE ? DEFAULT_RELATIVE_HEIGHT : DEFAULT_ABSOLUTE_HEIGHT;
    const height       = Math.max(Number.parseFloat(heightValue) || Number.parseFloat(defaultHeight), 1);
    const style: React.CSSProperties = widthMode === WIDTH_MODE_FIXED
      ? { width: `${width}px`, maxWidth: "100%", flex: "0 0 auto" }
      : { width: "100%", flex: "0 0 auto" };

    if (heightMode === HEIGHT_MODE_RELATIVE) {
      style.aspectRatio = `100 / ${height}`;
    } else if (widthMode === WIDTH_MODE_FIXED) {
      style.aspectRatio = `${width} / ${height}`;
    } else {
      style.height = `${Math.min(height, MAX_PREVIEW_HEIGHT_PX)}px`;
    }
    return style;
  }, [widthMode, widthPx, heightMode, heightValue]);

  const copyToClipboard = useCallback(
    (text: string, setCopied: (v: boolean) => void) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
    [],
  );

  const handleContentChange = useCallback((type: ContentType) => {
    setContentType(type);
    setUnitId("");
  }, []);

  // Track app-header height so the overlay starts exactly below it
  useEffect(() => {
    const header = document.getElementById(HEADER_ID);
    if (!header) return;

    const measure = () => setHeaderTop(header.offsetHeight);
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);
    return () => resizeObserver.disconnect();
  }, []);

  // Move focus into overlay on open; return focus to trigger element on close
  useEffect(() => {
    if (show) {
      overlayRef.current?.focus();
    } else {
      focusAfterCloseRef?.current?.focus();
    }
  }, [show, focusAfterCloseRef]);

  // Keep keyboard focus cycling within overlay (ARIA dialog requirement); close on Escape
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      const focusable = Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable.at(-1)!;
      const atStart = document.activeElement === first || document.activeElement === overlay;
      const atEnd = document.activeElement === last;

      let wrapTo: HTMLElement | null = null;
      if (e.shiftKey && atStart) wrapTo = last;
      else if (!e.shiftKey && atEnd) wrapTo = first;
      if (wrapTo) {
        e.preventDefault();
        wrapTo.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <dialog
      ref={overlayRef}
      className="embed-tool-overlay"
      style={{ top: headerTop }}
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      tabIndex={-1}
      open
    >
      {/* ── Overlay header bar ── */}
      <div className="embed-tool-overlay__header">
        <h2 id={TITLE_ID} className="embed-tool-overlay__title">
          <IconLayers aria-hidden />
          {t("EMBED_TOOL.TITLE")}
        </h2>
        <CloseButton label={t("EMBED_TOOL.CLOSE")} onClick={onClose} />
      </div>

      {/* ── Scrollable content area ── */}
      <div className="embed-tool-overlay__content">
        <p className="embed-tool-modal__description">
          {t("EMBED_TOOL.DESCRIPTION")}
        </p>

        <div className="embed-tool-overlay__body">
          {/* ── Left column: controls ── */}
          <div className="embed-tool-modal__controls">

            <EmbedSection headingId={LANG_HEADING_ID} title={t("EMBED_TOOL.LANGUAGE_LABEL")}>
              <SelectionGroup aria-labelledby={LANG_HEADING_ID}>
                {EmbedRadioGroup({
                  name: "embed-language",
                  options: LANGUAGES.map((lng) => ({
                    value: lng.value,
                    label: t(`EMBED_TOOL.LANGUAGE.${lng.value.toUpperCase()}`),
                  })),
                  value: embedLang,
                  onChange: setEmbedLang,
                })}
              </SelectionGroup>
            </EmbedSection>

            <EmbedSection headingId={CONTENT_HEADING_ID} title={t("EMBED_TOOL.CONTENT_LABEL")}>
              <SelectionGroup aria-labelledby={CONTENT_HEADING_ID}>
                {EmbedRadioGroup({
                  name: "embed-content",
                  options: CONTENT_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
                  value: contentType,
                  onChange: handleContentChange,
                })}
              </SelectionGroup>
              {contentType === CONTENT_SPORT && (
                <select
                  className="embed-tool-modal__sport-select"
                  value={sport}
                  aria-label={t("EMBED_TOOL.SPORT_SELECT")}
                  onChange={(e) => setSport(e.target.value)}
                >
                  {SPORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              )}
              {contentType === CONTENT_UNIT && (
                <div className="embed-tool-modal__unit-search">
                  <VenueSearch onSelect={(id) => setUnitId(id)} />
                </div>
              )}
            </EmbedSection>

            <EmbedSection headingId={WIDTH_HEADING_ID} title={t("EMBED_TOOL.WIDTH_LABEL")}>
              <SelectionGroup aria-labelledby={WIDTH_HEADING_ID}>
                {EmbedRadioGroup({
                  name: "embed-width",
                  options: WIDTH_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
                  value: widthMode,
                  onChange: setWidthMode,
                })}
              </SelectionGroup>
              {widthMode === WIDTH_MODE_FIXED && (
                <div className="embed-tool-modal__size-input">
                  <SizeInput
                    id="embed-width-value"
                    label={t("EMBED_TOOL.WIDTH")}
                    value={widthPx}
                    unit="px"
                    onChange={(e) => setWidthPx(e.target.value)}
                  />
                </div>
              )}
            </EmbedSection>

            <EmbedSection headingId={HEIGHT_HEADING_ID} title={t("EMBED_TOOL.HEIGHT_LABEL")}>
              <SelectionGroup aria-labelledby={HEIGHT_HEADING_ID}>
                {EmbedRadioGroup({
                  name: "embed-height",
                  options: HEIGHT_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
                  value: heightMode,
                  onChange: (mode) => {
                    setHeightMode(mode);
                    setHeightValue(mode === HEIGHT_MODE_RELATIVE ? DEFAULT_RELATIVE_HEIGHT : DEFAULT_ABSOLUTE_HEIGHT);
                  },
                })}
              </SelectionGroup>
              <div className="embed-tool-modal__size-input">
                <SizeInput
                  id="embed-height-value"
                  label={t("EMBED_TOOL.HEIGHT")}
                  value={heightValue}
                  unit={heightMode === HEIGHT_MODE_RELATIVE ? "%" : "px"}
                  onChange={(e) => setHeightValue(e.target.value)}
                />
              </div>
            </EmbedSection>
          </div>

          {/* ── Right column: preview + copy rows ── */}
          <div className="embed-tool-overlay__preview">
            <h3 className="embed-tool-modal__section-title">
              {t("EMBED_TOOL.PREVIEW_LABEL")}
            </h3>
            <div className="embed-tool-modal__preview-frame" style={previewFrameStyle}>
              <iframe
                src={embedUrl}
                title={t("EMBED_TOOL.PREVIEW_LABEL")}
                className="embed-tool-modal__iframe"
                tabIndex={-1}
              />
            </div>
            <div className="embed-tool-modal__copy-rows">
              <CopyRow
                id="embed-url"
                label={t("EMBED_TOOL.URL_LABEL")}
                value={embedUrl}
                copyLabel={t("EMBED_TOOL.COPY_URL")}
                copiedLabel={t("EMBED_TOOL.COPIED")}
                copied={copiedUrl}
                onCopy={() => copyToClipboard(embedUrl, setCopiedUrl)}
              />
              <CopyRow
                id="embed-html"
                label={t("EMBED_TOOL.HTML_LABEL")}
                value={htmlCode}
                copyLabel={t("EMBED_TOOL.COPY_HTML")}
                copiedLabel={t("EMBED_TOOL.COPIED")}
                copied={copiedHtml}
                onCopy={() => copyToClipboard(htmlCode, setCopiedHtml)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="embed-tool-overlay__footer">
        <CloseButton label={t("EMBED_TOOL.CLOSE")} onClick={onClose} />
      </div>
    </dialog>
  );
}

export default AppEmbedToolModal;
