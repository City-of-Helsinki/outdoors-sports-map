import { SUPPORTED_LANGUAGES } from "../i18n/i18nConstants";
import { SportFilter } from "../unit/types";
import { UnitFilters, SportFilters } from "../unit/unitConstants";

export const CONTENT_ALL   = "all"   as const;
export const CONTENT_SPORT = "sport" as const;
export const CONTENT_UNIT  = "unit"  as const;
export type ContentType = typeof CONTENT_ALL | typeof CONTENT_SPORT | typeof CONTENT_UNIT;

export const CONTENT_OPTIONS: { value: ContentType; labelKey: string }[] = [
  { value: CONTENT_ALL,   labelKey: "EMBED_TOOL.CONTENT.ALL" },
  { value: CONTENT_SPORT, labelKey: "EMBED_TOOL.CONTENT.SPORT" },
  { value: CONTENT_UNIT,  labelKey: "EMBED_TOOL.CONTENT.UNIT" },
];

export const WIDTH_MODE_AUTO  = "auto"  as const;
export const WIDTH_MODE_FIXED = "fixed" as const;
export type WidthMode = typeof WIDTH_MODE_AUTO | typeof WIDTH_MODE_FIXED;

export const WIDTH_OPTIONS: { value: WidthMode; labelKey: string }[] = [
  { value: WIDTH_MODE_AUTO,  labelKey: "EMBED_TOOL.WIDTH_AUTO" },
  { value: WIDTH_MODE_FIXED, labelKey: "EMBED_TOOL.WIDTH_FIXED" },
];

export const HEIGHT_MODE_RELATIVE = "relative" as const;
export const HEIGHT_MODE_ABSOLUTE = "absolute" as const;
export type HeightMode = typeof HEIGHT_MODE_RELATIVE | typeof HEIGHT_MODE_ABSOLUTE;

export const HEIGHT_OPTIONS: { value: HeightMode; labelKey: string }[] = [
  { value: HEIGHT_MODE_RELATIVE, labelKey: "EMBED_TOOL.HEIGHT_RELATIVE" },
  { value: HEIGHT_MODE_ABSOLUTE, labelKey: "EMBED_TOOL.HEIGHT_ABSOLUTE" },
];

export const DEFAULT_WIDTH_MODE  = WIDTH_MODE_AUTO;
export const DEFAULT_HEIGHT_MODE = HEIGHT_MODE_RELATIVE;
export const DEFAULT_RELATIVE_HEIGHT = String(Math.round((1 / 3) * 100));
export const DEFAULT_ABSOLUTE_HEIGHT = "600";
export const DEFAULT_WIDTH_PX = "800";
export const MAX_PREVIEW_HEIGHT_PX = 350;

// Reverse map of UnitFilters value → property name, used to build i18n label keys
const unitFilterKey = Object.fromEntries(
  Object.entries(UnitFilters).map(([k, v]) => [v, k]),
) as Record<string, string>;

export const SPORT_OPTIONS: { value: SportFilter; labelKey: string }[] = SportFilters.map(
  (filter) => ({ value: filter, labelKey: `UNIT_DETAILS.FILTER.${unitFilterKey[filter]}` }),
);

export const LANGUAGES = Object.values(SUPPORTED_LANGUAGES).map((v) => ({ value: v, label: v }));
