const artwork = {
  visium: (
    <>
      <rect x="52" y="30" width="296" height="148" rx="3" className="art-panel" />
      <path d="M52 58h296M126 58v120" className="art-line" />
      <path d="M66 44h4m6 0h4m6 0h4" className="art-accent" />
      <path d="M68 78h40m-40 18h28m-28 18h34m-34 18h24" className="art-muted" />
      <circle cx="158" cy="88" r="10" className="art-accent" />
      <path d="M142 116v-5c0-15 32-15 32 0v5m15-32h65m-65 14h44" className="art-line" />
      <rect x="142" y="132" width="86" height="28" className="art-soft" />
      <path d="M153 146h62m26-10h82m-82 14h56" className="art-muted" />
      <g className="art-accent">
        <rect x="276" y="79" width="22" height="18" rx="6" />
        <rect x="306" y="79" width="22" height="18" rx="6" />
        <path d="M298 86h8m-34-8 4 8m52 0 4-8" />
      </g>
    </>
  ),
  downloader: (
    <>
      <path d="M72 34h94l26 26v112H72Z" className="art-panel" />
      <path d="M166 34v26h26" className="art-line" />
      <text x="91" y="92" className="art-label">F29</text>
      <path d="M92 113h78m-78 15h78m-78 15h48" className="art-muted" />
      <path d="M208 95h43m-10-10 10 10-10 10" className="art-accent" />
      <path d="M265 125h70v43h-70Z" className="art-panel" />
      <path d="M300 53v70m-18-18 18 18 18-18M279 143h42" className="art-accent" />
      <path d="M275 185h50" className="art-muted" />
    </>
  ),
  tarot: (
    <>
      <g transform="rotate(-14 140 110)">
        <rect x="91" y="47" width="76" height="122" rx="4" className="art-panel" />
        <path d="m129 81 18 28-18 28-18-28Z" className="art-muted" />
      </g>
      <g transform="rotate(14 260 110)">
        <rect x="233" y="47" width="76" height="122" rx="4" className="art-panel" />
        <circle cx="271" cy="108" r="17" className="art-muted" />
        <path d="M271 80v-8m0 72v-8m-28-28h-8m72 0h-8" className="art-muted" />
      </g>
      <rect x="155" y="31" width="90" height="146" rx="4" className="art-panel" />
      <rect x="163" y="39" width="74" height="130" rx="2" className="art-soft" />
      <path d="m200 67 9 22 24 2-19 15 6 23-20-12-20 12 6-23-19-15 24-2Z" className="art-accent" />
      <path d="M184 151h32M63 77v12m-6-6h12m264 35v12m-6-6h12" className="art-muted" />
    </>
  ),
  gps: (
    <>
      <rect x="51" y="29" width="298" height="150" rx="3" className="art-panel" />
      <path d="M51 68h298M51 115h298M51 152h298M103 29v150M163 29v150M229 29v150M296 29v150" className="art-map" />
      <path d="M64 169 135 87l59 44 66-96" className="art-map" />
      <path d="M87 147h76V90h113" className="art-accent art-route" />
      <circle cx="87" cy="147" r="7" className="art-accent" />
      <path d="M294 69c0 15-18 31-18 31s-18-16-18-31a18 18 0 1 1 36 0Z" className="art-pin" />
      <circle cx="276" cy="68" r="6" className="art-panel" />
      <rect x="258" y="135" width="73" height="27" rx="2" className="art-soft" />
      <path d="M271 148h47" className="art-muted" />
    </>
  ),
}

export default function ProjectArtwork({ kind }) {
  return (
    <div className={`project-artwork project-artwork--${kind}`}>
      <div className="project-artwork__bar" aria-hidden="true"><span /><span /><span /></div>
      <svg viewBox="0 0 400 210" aria-hidden="true" focusable="false">
        {artwork[kind]}
      </svg>
      <span className="project-artwork__caption">ILUSTRACIÓN DEL PROYECTO</span>
    </div>
  )
}
