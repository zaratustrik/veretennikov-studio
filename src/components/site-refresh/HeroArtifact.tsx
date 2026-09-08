import type { CSSProperties } from "react";

const slices = Array.from({ length: 12 }, (_, index) => index);

export default function HeroArtifact() {
  return (
    <figure
      className="sr-artifact"
      aria-label="Абстрактный кинетический объект — образ сложной идеи, превращённой в работающую форму"
    >
      <figcaption>
        <span>Studio object / 001</span>
        <span>Generative form</span>
      </figcaption>

      <div className="sr-artifact-stage" aria-hidden="true">
        <div className="sr-artifact-grid" />
        <div className="sr-artifact-glow" />
        <span className="sr-artifact-orbit sr-artifact-orbit-a" />
        <span className="sr-artifact-orbit sr-artifact-orbit-b" />

        <div className="sr-artifact-object">
          {slices.map((index) => (
            <span
              className="sr-artifact-slice"
              key={index}
              style={
                {
                  "--slice-inset": `${index * 7}px`,
                  "--slice-depth": `${(index - 5.5) * 14}px`,
                  "--slice-rotate": `${index * 8}deg`,
                  "--slice-radius": `${18 + index * 1.5}%`,
                  "--slice-opacity": 1 - index * 0.045,
                } as CSSProperties
              }
            />
          ))}
          <span className="sr-artifact-core" />
        </div>

        <span className="sr-artifact-point sr-artifact-point-a" />
        <span className="sr-artifact-point sr-artifact-point-b" />
        <span className="sr-artifact-coordinate sr-artifact-coordinate-a">42° 51′</span>
        <span className="sr-artifact-coordinate sr-artifact-coordinate-b">FORM / MOTION</span>
      </div>

      <div className="sr-artifact-footer">
        <span>Strategy × systems × image</span>
        <span>2026</span>
      </div>
    </figure>
  );
}
