export default function AmbientBackground() {
  return <div className="ambient-background" aria-hidden="true">
    <div className="ambient-wash"/>
    <svg className="neural-layer neural-layer-far" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <g className="neural-lines">
        <path d="M-80 170 C180 90 315 275 535 215 S875 30 1095 150 S1415 330 1680 175"/>
        <path d="M-40 590 C210 470 315 675 565 555 S930 430 1160 585 S1440 740 1650 630"/>
        <path d="M120 930 C310 760 500 915 690 785 S1040 650 1225 805 S1470 970 1640 825"/>
      </g>
      <g className="neural-nodes">
        <circle cx="183" cy="131" r="4"/><circle cx="405" cy="239" r="2.5"/><circle cx="650" cy="153" r="3.5"/>
        <circle cx="915" cy="93" r="2.5"/><circle cx="1160" cy="190" r="4"/><circle cx="1435" cy="284" r="2.5"/>
        <circle cx="155" cy="521" r="2.5"/><circle cx="397" cy="613" r="4"/><circle cx="972" cy="493" r="3"/>
        <circle cx="1240" cy="638" r="4"/><circle cx="264" cy="826" r="3.5"/><circle cx="895" cy="721" r="4"/>
      </g>
    </svg>
    <div className="ambient-particles"/>
    <div className="ambient-noise"/>
  </div>;
}
