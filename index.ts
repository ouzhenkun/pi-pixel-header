/**
 * pi-hero
 *
 * Custom TUI header with pixel Pi logo and Catppuccin Mocha accents.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Catppuccin Mocha palette (ANSI 256 approximations)
const c = {
  subtext: 245, // #a6adc8
  overlay: 240, // #6c7086
};

// Logo color pool — Catppuccin Mocha accents
const LOGO_COLORS = [
  111, // blue
  114, // green
  141, // mauve
  209, // peach
  183, // lavender
  116, // teal
  221, // yellow
  210, // flamingo
];

function pickLogoColor(): number {
  return LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)]!;
}

function ansi(code: number, text: string): string {
  return `\x1b[38;5;${code}m${text}\x1b[0m`;
}

// Pi logo — pixel "P" from pi.dev SVG, mapped to 4x4 grid
// ■ ■ ■ ·
// ■ · ■ ·
// ■ ■ · ■
// ■ · · ■
const B = "██";
const S = "  ";
const LOGO = [
  `${B}${B}${B}${S}`,
  `${B}${S}${B}${S}`,
  `${B}${B}${S}${B}`,
  `${B}${S}${S}${B}`,
];

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    ctx.ui.setHeader((_tui, _theme) => {
      const logoColor = pickLogoColor();
      return {
        render(_width: number): string[] {
          const lines: string[] = [];

          for (const line of LOGO) {
            lines.push(`${ansi(logoColor, line)}`);
          }

          lines.push("");
          lines.push(`${ansi(c.subtext, "There are many agent harnesses,")}`);
          lines.push(`${ansi(c.subtext, "but this one is yours.")}`);

          return lines;
        },
        invalidate() {},
      };
    });
  });

  pi.registerCommand("default-header", {
    description: "Restore built-in header",
    handler: async (_args, ctx) => {
      ctx.ui.setHeader(undefined);
      ctx.ui.notify("Built-in header restored", "info");
    },
  });
}
