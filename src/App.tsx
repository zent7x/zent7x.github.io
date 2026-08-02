import { companies, profile, projects, social, stack } from "./data/site";

export default function App() {
  return (
    <div className="site">
      <header className="top">
        <a href="#" className="mark">
          {profile.alias}
        </a>
        <nav className="top__links" aria-label="Social">
          {social.map((s, i) => (
            <span key={s.label}>
              {i > 0 && <span className="sep" aria-hidden="true"> · </span>}
              <a
                href={s.href}
                target={s.label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
              >
                {s.label}
              </a>
            </span>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" aria-label="Introduction">
          <div className="hero__copy">
            <h1>
              Hi, I'm {profile.name}.
              <br />
              <em>Also known as {profile.alias}.</em>
            </h1>
            <p className="hero__tagline">{profile.tagline}</p>
          </div>
          <figure className="hero__photo">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              width={208}
              height={208}
              decoding="async"
            />
          </figure>
        </section>

        <p className="intro">
          {profile.role} based in {profile.location}. I ship LLM routing, autonomous
          coding loops, and open-source tools from the mountains. When I'm not building,
          I'm in bug bounty programs, auditing smart contracts, and writing offensive
          tooling.
        </p>

        <section className="section" aria-labelledby="ventures-title">
          <h2 id="ventures-title" className="section__title">
            Ventures
          </h2>
          <ul className="ventures">
            {companies.map((company) => (
              <li key={company.name}>
                <a
                  href={company.url}
                  className="venture"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="venture__logo"
                    src={company.logo}
                    alt=""
                    width={44}
                    height={44}
                    decoding="async"
                  />
                  <div className="venture__body">
                    <div className="venture__head">
                      <span className="venture__name">{company.name}</span>
                      <span className="venture__meta">
                        {company.year} · {company.status}
                      </span>
                    </div>
                    <p className="venture__desc">{company.blurb}</p>
                  </div>
                  <span className="venture__go" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="projects-title">
          <h2 id="projects-title" className="section__title">
            Projects
          </h2>
          <ul className="catalog">
            {projects.map((project) => (
              <li key={project.name} className="catalog__row">
                <a
                  href={project.url}
                  className="catalog__name"
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
                <span className="catalog__desc">{project.desc}</span>
              </li>
            ))}
          </ul>
          <p className="catalog__more">
            More on{" "}
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="section" aria-labelledby="now-title">
          <h2 id="now-title" className="section__title">
            Stack
          </h2>
          <p className="stack-line">{stack.join(" · ")}</p>
        </section>

        <blockquote className="motto">
          <p>The less you know is the better.</p>
        </blockquote>

        <p className="contact">
          Open to consulting, security work, and interesting builds.{" "}
          <a href={profile.links.email}>{profile.email}</a>
        </p>
      </main>

      <footer className="foot">
        <span>
          © {new Date().getFullYear()} {profile.fullName}
        </span>
      </footer>
    </div>
  );
}
