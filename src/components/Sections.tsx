import { projects, stack, ventures } from "../data/site";
import { useReveal } from "../hooks/useReveal";

export function Ventures() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="block" id="ventures" ref={ref} data-reveal>
      <div className="section-head">
        <div>
          <p className="section-kicker">Companies I am building</p>
          <h2>Ventures</h2>
        </div>
        <span className="section-no">01 / 04</span>
      </div>
      <ul className="cards">
        {ventures.map((v) => (
          <li key={v.name}>
            <a className="card" href={v.url} target="_blank" rel="noopener noreferrer">
              <span className="brand-logo">
                <img src={v.logo} alt="" width={50} height={50} />
              </span>
              <div>
                <div className="card__top">
                  <strong>{v.name}</strong>
                  <span>{v.status}</span>
                </div>
                <p>{v.desc}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Projects() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="block" id="projects" ref={ref} data-reveal>
      <div className="section-head">
        <div>
          <p className="section-kicker">Selected open source</p>
          <h2>Projects</h2>
        </div>
        <span className="section-no">02 / 04</span>
      </div>
      <ul className="project-grid">
        {projects.map((p) => (
          <li key={p.name}>
            <a
              className={`project-card${p.featured ? " project-card--feature" : ""}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="project-logo">
                <img src={p.logo} alt="" width={42} height={42} />
              </span>
              <div className="project-card__content">
                <div className="project-card__head">
                  <strong>{p.name}</strong>
                  <span className="project-card__arrow">↗</span>
                </div>
                <p>{p.desc}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="projects-more">
        More on{" "}
        <a href="https://github.com/zent7x" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </section>
  );
}

export function Stack() {
  const ref = useReveal<HTMLElement>();

  function copy(name: string, el: HTMLButtonElement) {
    void navigator.clipboard?.writeText(name);
    el.classList.add("is-flash");
    window.setTimeout(() => el.classList.remove("is-flash"), 400);
  }

  return (
    <section className="block" id="stack" ref={ref} data-reveal>
      <div className="section-head">
        <div>
          <p className="section-kicker">What I reach for</p>
          <h2>Stack</h2>
        </div>
        <span className="section-no">03 / 04</span>
      </div>
      <p className="block-sub">Click a tool to copy. The short list I actually reach for.</p>
      <ul className="tech-stack" aria-label="Technology stack">
        {stack.map((t) => (
          <li key={t.name} data-tech={t.name}>
            <button type="button" title={t.name} onClick={(e) => copy(t.name, e.currentTarget)}>
              <img
                src={t.icon}
                alt={t.name}
                width={26}
                height={26}
                className={"invert" in t && t.invert ? "tech-invert" : undefined}
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
