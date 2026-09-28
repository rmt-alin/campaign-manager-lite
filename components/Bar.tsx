export function Bar({ ratio, label }: { ratio: number; label: string }) {
  const width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;

  return (
    <div className="bar-cell">
      <div className="bar-track">
        <span className="bar" style={{ width }} />
      </div>
      <span className="bar-label">{label}</span>
    </div>
  );
}
