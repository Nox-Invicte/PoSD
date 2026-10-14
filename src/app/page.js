"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const beats = [
  { label: "Make", kicker: "Design + production", title: "A cheaper format starts the journey." },
  { label: "Move", kicker: "Use + collection", title: "The package travels through a real system." },
  { label: "Sort", kicker: "Municipal treatment", title: "A material meets the capability it was designed for." },
  { label: "Recover", kicker: "System outcome", title: "The gap becomes visible in the final flow." },
];

const materials = {
  glass: {
    label: "Glass packaging", short: "Glass", color: "#9fd4bc", description: "Rigid, familiar, and often easier to recognize in established recovery systems.", production: "Higher", transport: "Higher", existing: 78, added: 84, rejected: 22,
  },
  flex: {
    label: "Multilayer flexible plastic", short: "Flexible plastic", color: "#f2a064", description: "Lightweight and high-barrier, but bonded layers can be difficult to separate or sort.", production: "Lower", transport: "Lower", existing: 9, added: 68, rejected: 91,
  },
};

const facilities = {
  existing: { label: "Existing line", description: "Today’s sorting and treatment capability" },
  added: { label: "Suitable capability", description: "An illustrative investment in compatible treatment" },
};

function JourneyScene({ material, facility, beat, playing, seek, onBeatChange }) {
  const compatible = material === "glass" || facility === "added";
  const packageRef = useRef(null);
  const positionRef = useRef(seek);

  useEffect(() => {
    positionRef.current = seek;
    if (!playing && packageRef.current) {
      packageRef.current.style.offsetDistance = `${seek * 100}%`;
      packageRef.current.style.opacity = "1";
    }
  }, [playing, seek]);

  useEffect(() => {
    if (!playing || !packageRef.current) return undefined;
    const duration = 17200;
    const startProgress = positionRef.current;
    const startedAt = performance.now();
    let animationFrame;
    let previousBeat = Math.min(beats.length - 1, Math.floor(startProgress * beats.length));

    function animate(now) {
      const journeyProgress = (startProgress + (now - startedAt) / duration) % 1;
      positionRef.current = journeyProgress;
      const packageElement = packageRef.current;
      if (!packageElement) return;
      packageElement.style.offsetDistance = `${journeyProgress * 100}%`;
      packageElement.style.opacity = journeyProgress < 0.04 ? journeyProgress / 0.04 : journeyProgress > 0.96 ? (1 - journeyProgress) / 0.04 : "1";
      const nextBeat = Math.min(beats.length - 1, Math.floor(journeyProgress * beats.length));
      if (nextBeat !== previousBeat) {
        previousBeat = nextBeat;
        onBeatChange(nextBeat);
      }
      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onBeatChange, playing, seek]);

  return (
    <div className={`journey-scene ${playing ? "is-playing" : "is-paused"}`}>
      <svg viewBox="0 0 1000 500" role="img" aria-label="Material journey from factory to municipal treatment">
        <defs>
          <linearGradient id="sceneGlow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#233d31" /><stop offset="1" stopColor="#121b16" /></linearGradient>
          <linearGradient id="roadGlow" x1="0" x2="1"><stop stopColor="#617d6b" /><stop offset="1" stopColor="#34513f" /></linearGradient>
          <filter id="softGlow"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <rect width="1000" height="500" fill="url(#sceneGlow)" />
        <path className="scene-grid" d="M0 100H1000M0 200H1000M0 300H1000M0 400H1000M100 0V500M200 0V500M300 0V500M400 0V500M500 0V500M600 0V500M700 0V500M800 0V500M900 0V500" />
        <path className="flow-glow" d="M117 351C262 351 300 351 405 351S570 351 663 351s118-56 199-56" />
        <path className="flow-line" d="M117 351C262 351 300 351 405 351S570 351 663 351s118-56 199-56" />
        <g className="flow-nodes" aria-hidden="true">
          <circle className="node node-green" cx="117" cy="351" r="14" /><circle className="node node-orange" cx="405" cy="351" r="14" /><circle className={`node ${compatible ? "node-green" : "node-red"}`} cx="862" cy="295" r="14" />
          <text x="117" y="355">01</text><text x="405" y="355">02</text><text x="862" y="299">03</text>
        </g>
        <g className="diagram-cards" aria-hidden="true">
          <g transform="translate(55 76)"><rect width="148" height="35" rx="4" /><circle cx="15" cy="17" r="5" /><text x="29" y="21">material choice</text></g>
          <g transform="translate(390 160)"><rect width="142" height="35" rx="4" /><circle cx="15" cy="17" r="5" /><text x="29" y="21">consumer life</text></g>
          <g transform="translate(742 76)"><rect width="174" height="35" rx="4" /><circle className={compatible ? "card-good" : "card-warn"} cx="15" cy="17" r="5" /><text x="29" y="21">{compatible ? "compatible line" : "sorting mismatch"}</text></g>
        </g>

        <g className="factory-detail">
          <path className="building" d="M49 351V171h54V126h93v45h50v-70h79v250z" />
          <path className="roof-line" d="M49 171h54v-45h93v45h50V101h79" />
          <path className="factory-window" d="M75 195h31v29H75zm51 0h31v29h-31zm51 0h31v29h-31zm51 0h31v29h-31zm51-61h33v29h-33z" />
          <path className="factory-door" d="M250 270h45v81h-45z" />
          <path className="chimney" d="M267 101V49h29v52" />
          <path className="smoke-cloud" d="M281 39c-28-26 32-28 0-54M303 42c-23-25 31-29 2-55" />
          <text className="scene-label" x="55" y="389">FACTORY</text>
          <text className="scene-small" x="55" y="407">material choice</text>
        </g>

        <g className="home-detail">
          <path className="home" d="M411 351V274l57-46 57 46v77z" /><path className="home-roof" d="M395 279l73-59 73 59" /><path className="home-door" d="M449 351v-41h37v41" /><path className="home-window" d="M423 292h22v20h-22zm58 0h22v20h-22z" />
          <text className="scene-label" x="427" y="389">USE</text><text className="scene-small" x="427" y="407">purchase + discard</text>
        </g>

        <g className="truck-detail">
          <path className="truck" d="M315 326h102v45H315zM417 341h32l28 30h-60z" /><path className="truck-window" d="M423 347h21l14 17h-35z" /><circle className="wheel" cx="346" cy="377" r="13" /><circle className="wheel" cx="432" cy="377" r="13" /><path className="truck-stripe" d="M327 342h71" />
        </g>

        <g className="bin-detail">
          <path className="bin" d="M578 292h57l-5 59h-47zM570 286h73M588 275h37" /><path className="bin-lines" d="M586 305h40m-41 14h40m-41 14h39" />
          <text className="scene-label" x="568" y="389">COLLECTION</text><text className="scene-small" x="568" y="407">municipal stream</text>
        </g>

        <g className="facility-detail">
          <path className="building facility-building" d="M728 351V170h73v-36h105v36h52v181z" /><path className="roof-line" d="M728 170h73v-36h105v36h52" /><path className="facility-window" d="M752 195h30v27h-30zm48 0h30v27h-30zm48 0h30v27h-30zm48 0h30v27h-30z" /><path className="facility-door" d="M850 284h43v67h-43z" /><path className="belt-line" d="M747 327h192" /><path className="sorting-beam" d="M837 223v105" />
          <text className="scene-label" x="740" y="389">TREATMENT</text><text className="scene-small" x="740" y="407">{compatible ? "compatible stream" : "mismatch detected"}</text>
        </g>

        <g ref={packageRef} className={`animated-package package-${material}`}>
          <rect x="0" y="0" width="42" height="34" rx="5" /><path d={material === "glass" ? "M10 7h22v20H10z" : "M7 8h28l-5 18H11z"} /><circle cx="9" cy="9" r="3" />
        </g>
      </svg>
      <div className="scene-status"><span className={`status-light ${compatible ? "good" : "warn"}`} /> {compatible ? "material can enter this line" : "material is likely to be rejected here"}</div>
    </div>
  );
}

function Metric({ label, value, tone = "green" }) {
  return <div className="metric"><span>{label}</span><strong className={tone}>{value}</strong></div>;
}

function ScenarioChart({ selected, recovery }) {
  const rejectionRisk = 100 - recovery;
  const values = [
    { label: "Production", value: selected.production === "Lower" ? 34 : 72, color: "chart-orange" },
    { label: "Transport", value: selected.transport === "Lower" ? 28 : 76, color: "chart-blue" },
    { label: "Recovered", value: recovery, color: "chart-green" },
    { label: "Rejected", value: rejectionRisk, color: "chart-red" },
  ];
  return <div className="chart-panel"><div className="chart-heading"><span>Scenario profile</span><small>hypothetical index</small></div><div className="chart-bars">{values.map((item) => <div className="chart-bar" key={item.label}><div className="chart-bar-value">{item.value}</div><div className={`chart-bar-fill ${item.color}`} style={{ height: `${item.value}%` }} /><span>{item.label}</span></div>)}</div><div className="chart-axis"><span>0</span><span>50</span><span>100</span></div></div>;
}

export default function Home() {
  const [material, setMaterial] = useState("flex");
  const [facility, setFacility] = useState("existing");
  const [beat, setBeat] = useState(0);
  const [seek, setSeek] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [captured, setCaptured] = useState(null);
  const materialKey = materials[material] ? material : "flex";
  const facilityKey = facilities[facility] ? facility : "existing";
  const selected = materials[materialKey];
  const selectedFacility = facilities[facilityKey];
  const recovery = facilityKey === "existing" ? selected.existing : selected.added;
  const rejectionRisk = 100 - recovery;
  const compatible = materialKey === "glass" || facilityKey === "added";
  const capturedMaterial = captured ? materials[captured.material] ?? materials.flex : null;
  const capturedFacility = captured ? facilities[captured.facility] ?? facilities.existing : null;

  function reset() {
    setMaterial("flex"); setFacility("existing"); setBeat(0); setSeek(0); setPlaying(true); setCaptured(null);
  }

  function capture() {
    setCaptured({ material, facility });
  }

  function selectBeat(index) {
    setBeat(index);
    setSeek(index / beats.length);
  }

  const handleBeatChange = useCallback((index) => {
    setBeat(index);
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">M</span><span>Material <em>Matters</em></span></div><span className="topbar-tag"><i /> live systems study</span><button className="reset-button" onClick={reset}>↺ Reset</button></header>

      <section className="hero"><div className="eyebrow">The economics / infrastructure gap</div><h1>Every package has<br /><span>a second story.</span></h1><p>Choose a material. Watch it move through the system. See where design decisions meet municipal reality.</p></section>

      <section className="workbench">
        <div className="scenario-bar"><div className="scenario-title"><span className="eyebrow">Your scenario</span><strong>{selected.label}</strong></div><div className="segmented" role="group" aria-label="Choose material"><span className="segment-label">Material</span>{Object.entries(materials).map(([key, item]) => <button key={key} type="button" aria-pressed={materialKey === key} className={materialKey === key ? "selected" : ""} onClick={() => setMaterial(key)}><i className={`material-swatch material-${key}`} style={{ "--material-color": item.color }} />{item.short}</button>)}</div><div className="segmented" role="group" aria-label="Choose facility capability"><span className="segment-label">Facility</span>{Object.entries(facilities).map(([key, item]) => <button key={key} type="button" aria-pressed={facilityKey === key} className={facilityKey === key ? "selected" : ""} onClick={() => setFacility(key)}><i className={`facility-swatch facility-${key}`} />{key === "existing" ? "Existing" : "Invest"}</button>)}</div></div>

        <div className="journey-header"><div><span className="eyebrow">Live material journey</span><h2 key={beats[beat].label}>{beats[beat].title}</h2></div><button className={`play-button ${playing ? "active" : ""}`} onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause animation" : "Play animation"}>{playing ? "Ⅱ" : "▶"}<span>{playing ? "Pause" : "Play"}</span></button></div>
        <div className="progress-track" aria-label="Journey stages">{beats.map((item, index) => <button type="button" key={item.label} aria-current={index === beat ? "step" : undefined} className={index === beat ? "active" : index < beat ? "complete" : ""} onClick={() => selectBeat(index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}</div>
        <JourneyScene material={materialKey} facility={facilityKey} beat={beat} playing={playing} seek={seek} onBeatChange={handleBeatChange} />

        <div className="readout"><div className="readout-intro"><span className="eyebrow">What is happening</span><p>{beat === 0 ? selected.description : beat === 1 ? "Lower production or transport burden can make a format attractive before it ever reaches a bin." : beat === 2 ? `${selectedFacility.label} receives the package. Compatibility depends on collection, sorting, separation, and operating choices.` : compatible ? "This illustrative pathway shows a stronger chance of material recovery when the facility matches the material." : "This illustrative pathway shows rejection and landfill dependency when the existing line cannot process the material."}</p></div><div className="readout-data"><ScenarioChart selected={selected} recovery={recovery} /><div className="metric-grid"><Metric label="Production cost" value={selected.production} tone={selected.production === "Lower" ? "green" : "orange"} /><Metric label="Transport burden" value={selected.transport} tone={selected.transport === "Lower" ? "green" : "orange"} /><Metric label="Recovered" value={`${recovery}%`} /><Metric label="Rejected risk" value={`${rejectionRisk}%`} tone="orange" /></div></div></div>
      </section>

      <section className="comparison"><div className="comparison-copy"><span className="eyebrow">Make the gap visible</span><h2>Same package.<br /><span>Different system.</span></h2><p>Capture the current case, then switch the facility to see how suitable capability changes the hypothetical outcome.</p><button className="capture-button" onClick={capture}>{captured ? "Scenario captured" : "Capture this scenario"}<span>↗</span></button></div><div className="comparison-card"><div className="comparison-card-head"><span>Hypothetical pathway</span><span>Original / improved</span></div><div className="comparison-row"><span>Material</span><strong>{capturedMaterial ? capturedMaterial.short : "Choose + capture"}</strong><strong>{capturedMaterial ? capturedMaterial.short : "—"}</strong></div><div className="comparison-row"><span>Facility</span><strong>{capturedFacility ? capturedFacility.label : "—"}</strong><strong>{captured ? facilities.added.label : "—"}</strong></div><div className="comparison-row highlight"><span>Recovery</span><strong>{capturedMaterial && capturedFacility ? `${capturedFacility === facilities.existing ? capturedMaterial.existing : capturedMaterial.added}%` : "—"}</strong><strong>{capturedMaterial ? `${capturedMaterial.added}%` : "—"}</strong></div>{captured && <small>Improvement is illustrative. Actual results depend on local collection, technology, costs, and composition.</small>}</div></section>

      <section className="closing"><div><span className="eyebrow">The system view</span><h2>Innovation must go<br /><span>hand in hand with infrastructure.</span></h2></div><div className="discipline-list">{["Economics", "Material science", "Industrial design", "Municipal infrastructure", "Public policy", "Environmental sustainability"].map((item) => <span key={item}>{item}</span>)}</div></section>
      <footer><div className="brand"><span className="brand-mark">M</span><span>Material <em>Matters</em></span></div><span>Educational simulation · hypothetical values</span></footer>
    </main>
  );
}
