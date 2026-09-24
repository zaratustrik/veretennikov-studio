export default function VisualEngineeringFallback() {
  return (
    <div className="hpv2-visual-fallback" aria-hidden="true">
      <svg viewBox="0 0 760 430" role="presentation">
        <text x="28" y="38" className="hpv2-svg-kicker">INDUSTRIAL SYSTEM / SECTION 04</text>
        <text x="634" y="38" className="hpv2-svg-note">3D / VFX</text>

        <g className="hpv2-visual-fallback__structure">
          <path d="M56 339V132H216V339M216 339V88H394V339M394 339V154H548V339M548 339V113H706V339" />
          <path d="M56 339H706M56 282H706M56 224H706M56 166H706" />
          <path d="M87 282V201H157V282M251 224V121H355V224M428 282V195H511V282M584 224V148H675V224" />
        </g>

        <g className="hpv2-visual-fallback__equipment">
          <rect x="81" y="200" width="82" height="84" rx="2" />
          <rect x="248" y="116" width="110" height="111" rx="2" />
          <rect x="425" y="191" width="89" height="94" rx="2" />
          <circle cx="303" cy="172" r="29" />
          <circle cx="470" cy="238" r="24" />
          <path d="M101 221H143M101 242H143M101 263H132M278 172H328M303 147V197M450 238H490M470 218V258" />
        </g>

        <path d="M28 113H181C205 113 205 172 229 172H274" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M332 172H418C442 172 442 238 466 238H520C544 238 544 178 568 178H730" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay" pathLength="1" />
        <path d="M117 314H618" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />

        <g className="hpv2-visual-fallback__labels">
          <text x="28" y="98">INPUT / FLOW</text>
          <text x="253" y="74">CORE UNIT</text>
          <text x="567" y="164">OUTPUT / CONTROL</text>
          <text x="28" y="378">REAL PROJECT FRAME UNAVAILABLE / DESIGNED FALLBACK</text>
        </g>
      </svg>
    </div>
  );
}
