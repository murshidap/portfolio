export const DEFAULT_PROJECT_CARD_COLOR = "#0C0C0C";

export function isValidProjectCardColor(value: unknown): value is string {
  return typeof value === "string" && /^#?[0-9a-f]{6}$/i.test(value.trim());
}

export function normalizeProjectCardColor(value: unknown): string {
  if (!isValidProjectCardColor(value)) {
    return DEFAULT_PROJECT_CARD_COLOR;
  }

  const hex = value.trim().replace(/^#/, "");
  return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : DEFAULT_PROJECT_CARD_COLOR;
}

export function getProjectCardForeground(value: unknown): string {
  const color = normalizeProjectCardColor(value).slice(1);
  const red = Number.parseInt(color.slice(0, 2), 16);
  const green = Number.parseInt(color.slice(2, 4), 16);
  const blue = Number.parseInt(color.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > 0.55 ? "#0C0C0C" : "#D7E2EA";
}
