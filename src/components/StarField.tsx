const rand = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: rand(i + 1) * 100,
  top: rand(i + 41.3) * 100,
  size: 1 + rand(i + 91.7) * 1.6,
  delay: rand(i + 7.9) * 6,
}));

/** Pontinhos discretos tipo estrelas, visíveis apenas no tema escuro. */
export function StarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
