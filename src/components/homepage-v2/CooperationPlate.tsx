export default function CooperationPlate() {
  return (
    <div className="hpv2-system-plate" aria-hidden="true">
      <svg viewBox="0 0 760 430" role="presentation">
        <defs>
          <pattern id="hpv2-coop-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" className="hpv2-system-plate__grid" />
          </pattern>
        </defs>

        <rect width="760" height="430" fill="url(#hpv2-coop-grid)" />
        <text x="34" y="72" className="hpv2-svg-kicker">01 / REQUEST CORPUS</text>
        <g className="hpv2-system-plate__input">
          <rect x="34" y="94" width="158" height="52" rx="2" />
          <rect x="34" y="157" width="132" height="40" rx="2" />
          <rect x="34" y="208" width="174" height="40" rx="2" />
          <text x="51" y="125">ЗАПРОС / ТЕКСТ</text>
          <text x="51" y="182">ОГРАНИЧЕНИЯ</text>
          <text x="51" y="233">КРИТЕРИИ ПОДБОРА</text>
        </g>

        <path d="M208 171H278C300 171 300 209 322 209H342" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M208 228H274C304 228 305 209 338 209" className="hpv2-flowline hpv2-flowline--secondary" pathLength="1" />

        <g className="hpv2-system-plate__engine">
          <rect x="342" y="133" width="172" height="152" rx="2" />
          <rect x="357" y="148" width="142" height="122" rx="1" />
          <circle cx="428" cy="202" r="34" />
          <path d="M405 202H451M428 179V225" />
          <text x="366" y="164">02 / MATCH ENGINE</text>
          <text x="377" y="258">ПОИСК СООТВЕТСТВИЙ</text>
        </g>

        <path d="M514 177H575" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M514 209H575" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay" pathLength="1" />
        <path d="M514 241H575" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay-2" pathLength="1" />

        <g className="hpv2-system-plate__evidence">
          <rect x="575" y="139" width="151" height="45" rx="2" />
          <rect x="575" y="193" width="151" height="45" rx="2" />
          <rect x="575" y="247" width="151" height="45" rx="2" />
          <text x="592" y="166">ПАРТНЁР / 01</text>
          <text x="592" y="220">ПАРТНЁР / 02</text>
          <text x="592" y="274">ПАРТНЁР / 03</text>
        </g>

        <path d="M650 292V342H483" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />
        <g className="hpv2-system-plate__gate">
          <rect x="286" y="321" width="197" height="62" rx="2" />
          <circle cx="315" cy="352" r="8" />
          <text x="339" y="346">03 / OPERATOR GATE</text>
          <text x="339" y="365">ПРОВЕРКА И РЕШЕНИЕ</text>
        </g>

        <text x="34" y="388" className="hpv2-svg-note">СВОБОДНЫЙ ВВОД</text>
        <text x="603" y="321" className="hpv2-svg-note">EVIDENCE SET</text>
      </svg>
      <div className="hpv2-system-plate__legend">
        <span><i />Контекст</span>
        <span><i />Подбор</span>
        <span><i />Человек подтверждает</span>
      </div>
    </div>
  );
}
