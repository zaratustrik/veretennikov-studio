export default function PgmFallbackPlate() {
  return (
    <div className="hpv2-pgm-plate" aria-hidden="true">
      <svg viewBox="0 0 520 330" role="presentation">
        <text x="24" y="35" className="hpv2-svg-kicker">TECHNICAL CUTAWAY / PGM-15</text>
        <text x="405" y="35" className="hpv2-svg-note">NOT TO SCALE</text>
        <g className="hpv2-pgm-plate__vessel">
          <path d="M191 86C191 67 206 52 225 52H295C314 52 329 67 329 86V253C329 270 315 284 298 284H222C205 284 191 270 191 253Z" />
          <path d="M212 94H308M212 122H308M212 150H308M212 178H308M212 206H308M212 234H308" />
          <path d="M233 78V258M247 78V258M273 78V258M287 78V258" />
          <circle cx="260" cy="168" r="104" />
          <circle cx="260" cy="168" r="128" />
        </g>
        <path d="M24 110H142L175 132" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M345 203L382 224H496" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay" pathLength="1" />
        <path d="M148 245H64V286H215" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />
        <g className="hpv2-pgm-plate__labels">
          <text x="24" y="94">PRIMARY LOOP</text>
          <text x="387" y="212">STEAM OUTPUT</text>
          <text x="24" y="234">HEAT EXCHANGE</text>
          <text x="225" y="315">VESSEL / TUBE FIELD / FLOW</text>
        </g>
      </svg>
    </div>
  );
}
