type Tone = "dark" | "light";

function LaurelBranch({ flipped = false, tone }: { flipped?: boolean; tone: Tone }) {
  return (
    <svg
      viewBox="0 0 28 64"
      className={`h-12 w-6 ${tone === "light" ? "text-gold-soft" : "text-maroon"} ${flipped ? "-scale-x-100" : ""}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M22 62c-8-4-14-12-15-24C6 26 10 12 20 2c-6 12-8 24-6 34 2 11 5 19 8 26z" opacity="0.9" />
      {[
        [10, 8, -40],
        [7, 18, -30],
        [5, 28, -18],
        [5, 38, -6],
        [7, 48, 8],
        [11, 56, 20],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="4.5" ry="2" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </svg>
  );
}

export default function LaurelStat({
  value,
  label,
  tone = "dark",
}: {
  value: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <div className="flex items-center gap-1">
      <LaurelBranch tone={tone} />
      <div className="text-center">
        <p className={`font-display text-2xl font-bold ${tone === "light" ? "text-cream" : "text-maroon"}`}>
          {value}
        </p>
        <p
          className={`mt-0.5 max-w-24 text-[11px] font-semibold uppercase leading-tight tracking-wide ${
            tone === "light" ? "text-cream/70" : "text-ink-soft"
          }`}
        >
          {label}
        </p>
      </div>
      <LaurelBranch flipped tone={tone} />
    </div>
  );
}
