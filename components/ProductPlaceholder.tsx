type Tone = "denim" | "indigo" | "cream" | "paper" | "rust" | "sage" | "coral" | "marigold" | "bone";

const tones: Record<Tone, { a: string; b: string; text: string }> = {
  denim:    { a: "#5b7a99", b: "#4a6886", text: "#fff" },
  indigo:   { a: "#2e3a5c", b: "#1f2745", text: "#fff" },
  cream:    { a: "#e8dfcd", b: "#dccdb0", text: "#5a4a32" },
  paper:    { a: "#efe8d8", b: "#e3d9c2", text: "#6b5a3a" },
  rust:     { a: "#c47655", b: "#a85d3e", text: "#fff" },
  sage:     { a: "#8a9b7a", b: "#71866a", text: "#fff" },
  coral:    { a: "#e89a7c", b: "#d77a5a", text: "#fff" },
  marigold: { a: "#e6a93d", b: "#c98a23", text: "#3a2a0a" },
  bone:     { a: "#f4ecdf", b: "#e7dcc8", text: "#5b4a2e" },
};

interface ProductPlaceholderProps {
  label?: string;
  tone?: Tone;
  aspect?: string;
  radius?: number;
  className?: string;
}

export function ProductPlaceholder({ label = "product shot", tone = "denim", aspect = "4 / 5", radius = 0, className = "" }: ProductPlaceholderProps) {
  const t = tones[tone] || tones.denim;
  return (
    <div
      className={className}
      style={{
        aspectRatio: aspect,
        width: "100%",
        borderRadius: radius,
        background: `repeating-linear-gradient(135deg, ${t.a} 0 14px, ${t.b} 14px 28px)`,
        color: t.text,
        display: "flex",
        alignItems: "flex-end",
        padding: "14px",
        fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, monospace",
        fontSize: 11,
        letterSpacing: 0.4,
      }}
    >
      <span style={{ background: "rgba(0,0,0,.18)", padding: "3px 8px", borderRadius: 3 }}>{label}</span>
    </div>
  );
}
