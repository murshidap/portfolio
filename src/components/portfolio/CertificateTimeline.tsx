import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { CertificateItem } from "@/types/content";

function getTargetScale(index: number, crestIndex: number) {
  const distance = index - crestIndex;
  return 1 + 1.8 * Math.exp(-(distance * distance) / (2 * 1.35 * 1.35));
}

function CertificateImage({ item }: { item: CertificateItem }) {
  return item.asset_url ? (
    <img alt={`${item.title} certificate`} className="certificate-timeline-image" src={item.asset_url} />
  ) : (
    <div aria-label="Certificate image unavailable" className="certificate-timeline-image certificate-timeline-placeholder">
      <span>{item.title || "Certificate image unavailable"}</span>
    </div>
  );
}

export default function CertificateTimeline({ items }: { items: CertificateItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [magnifications, setMagnifications] = useState<number[]>(() => items.map(() => 1));
  const animationRef = useRef(0);
  const magnificationsRef = useRef(magnifications);
  const activeIndex = hoveredIndex ?? selectedIndex;
  const activeItem = items[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    window.cancelAnimationFrame(animationRef.current);
    const targets = items.map((_, index) => getTargetScale(index, activeIndex));

    if (reducedMotion) {
      magnificationsRef.current = targets;
      setMagnifications(targets);
      return;
    }

    const animate = () => {
      const next = magnificationsRef.current.map((value, index) => {
        const difference = targets[index] - value;
        return value + difference * 0.2;
      });
      const isSettled = next.every((value, index) => Math.abs(targets[index] - value) <= 0.008);
      magnificationsRef.current = next;
      setMagnifications(next);

      if (!isSettled) {
        animationRef.current = window.requestAnimationFrame(animate);
      }
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationRef.current);
  }, [activeIndex, items, reducedMotion]);

  const moveSelection = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = event.key === "ArrowUp" || event.key === "ArrowLeft"
      ? -1
      : event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : 0;

    if (direction === 0) {
      return;
    }

    event.preventDefault();
    setSelectedIndex((current) => Math.max(0, Math.min(items.length - 1, current + direction)));
    setHoveredIndex(null);
  };

  if (items.length === 0) {
    return (
      <section className="certificate-timeline-section">
        <p className="certificate-timeline-empty">No certificates to display yet.</p>
      </section>
    );
  }

  const progress = items.length > 1 ? activeIndex / (items.length - 1) : 1;

  return (
    <section className="certificate-timeline-section">
      <div
        aria-label="Certificates"
        className={`certificate-timeline-layout${reducedMotion ? " is-reduced-motion" : ""}`}
        onKeyDown={moveSelection}
      >
        <nav aria-label="Choose a certificate" className="certificate-timeline-rail">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const number = String(index + 1).padStart(2, "0");

            return (
              <button
                aria-current={isSelected ? "step" : undefined}
                aria-label={`Certificate ${number}: ${item.title}`}
                className={`certificate-timeline-tick${isSelected ? " is-selected" : ""}`}
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ transform: `scale(${magnifications[index] ?? 1})` }}
                type="button"
              >
                <span aria-hidden="true" className="certificate-timeline-tick-mark" />
                <span className="certificate-timeline-tick-label">{number}</span>
              </button>
            );
          })}
        </nav>

        <div className="certificate-timeline-preview-column">
          <article aria-live="polite" className="certificate-timeline-preview">
            <div className="certificate-timeline-preview-image">
              <CertificateImage item={activeItem} />
            </div>
          </article>
          <div className="certificate-timeline-preview-content">
            <div className="certificate-timeline-preview-heading">
              <div>
                <h2>{activeItem.title}</h2>
                <p className="certificate-timeline-issuer">{activeItem.issuer}</p>
              </div>
              {activeItem.asset_url ? (
                <a className="certificate-timeline-open" href={activeItem.asset_url} rel="noreferrer" target="_blank">
                  View image
                </a>
              ) : null}
            </div>
            <div aria-label={`${selectedIndex + 1} of ${items.length}`} className="certificate-timeline-progress">
              <div className="certificate-timeline-progress-track">
                <div className="certificate-timeline-progress-fill" style={{ transform: `scaleX(${progress})` }} />
              </div>
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {reducedMotion ? (
          <ol aria-label="All certificates" className="certificate-timeline-static-list">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  aria-current={index === selectedIndex ? "step" : undefined}
                  className="certificate-timeline-static-item"
                  onClick={() => setSelectedIndex(index)}
                  type="button"
                >
                  {item.asset_url ? <img alt="" src={item.asset_url} /> : null}
                  <span className="certificate-timeline-static-item-text">
                    <span>{item.title}</span>
                    <span>{item.issuer}{item.year ? ` · ${item.year}` : ""}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
