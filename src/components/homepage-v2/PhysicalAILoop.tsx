export default function PhysicalAILoop() {
  return (
    <div className="hpv2-physical-loop" aria-hidden="true">
      <svg viewBox="0 0 620 340" role="presentation">
        <text x="28" y="40" className="hpv2-svg-kicker">HYPOTHESIS LOOP / 01</text>
        <text x="484" y="40" className="hpv2-svg-note">HUMAN IN CONTROL</text>

        <path d="M87 177H194C217 177 217 133 240 133H280" className="hpv2-flowline hpv2-flowline--primary" pathLength="1" />
        <path d="M366 133H408C436 133 436 177 464 177H533" className="hpv2-flowline hpv2-flowline--primary hpv2-flowline--delay" pathLength="1" />
        <path d="M533 232C533 288 87 288 87 232" className="hpv2-flowline hpv2-flowline--feedback" pathLength="1" />

        <g className="hpv2-physical-loop__sensor">
          <circle cx="87" cy="177" r="54" />
          <circle cx="87" cy="177" r="31" />
          <path d="M65 177H109M87 155V199" />
          <text x="48" y="250">01 / CAPTURE</text>
          <text x="39" y="267">КАМЕРА / СИГНАЛ</text>
        </g>

        <g className="hpv2-physical-loop__model">
          <rect x="280" y="89" width="86" height="88" rx="2" />
          <path d="M298 113H348M298 133H337M298 153H326" />
          <text x="264" y="213">02 / INTERPRET</text>
          <text x="278" y="230">MODEL / RULES</text>
        </g>

        <g className="hpv2-physical-loop__operator">
          <rect x="464" y="123" width="138" height="108" rx="2" />
          <circle cx="498" cy="164" r="13" />
          <path d="M480 207C483 185 513 185 516 207M538 158H583M538 180H570M538 202H560" />
          <text x="477" y="250">03 / DECIDE</text>
          <text x="477" y="267">ОПЕРАТОР</text>
        </g>

        <text x="241" y="311" className="hpv2-svg-note">FEEDBACK / CORRECTION / STOP</text>
      </svg>
      <div className="hpv2-physical-loop__caption">
        <span>Сигнал</span><span>Интерпретация</span><span>Решение человека</span><span>Обратная связь</span>
      </div>
    </div>
  );
}
