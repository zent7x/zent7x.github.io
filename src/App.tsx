import { focus, profile, social, stack, work } from "./data/site";
import { RouterPanel } from "./components/RouterPanel";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="page">
      <div className="grid-bg" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="header">
        <div className="inner header__row">
          <a href="#" className="brand">
            <span className="brand__handle">zent7x</span>
            <span className="brand__sep">/</span>
            <span className="brand__alias">{profile.alias}</span>
          </a>
          <div className="header__meta">
            <span>est. {profile.est}</span>
            <span className="header__dot" aria-hidden="true">
              ·
            </span>
            <span>{profile.city} · localhost</span>
          </div>
          <button
            type="button"
            className="theme-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          />
        </div>
      </header>

      <main className="inner">
        <section className="hero">
          <div className="hero__copy">
            <h1 className="hero__title">
              building <em>intelligent</em> systems that ship
              <span className="hero__cursor" aria-hidden="true" />
            </h1>
            <p className="hero__sub">
              {profile.role.toLowerCase()} · AI infrastructure · security research · open
              source. doing &gt; advising. from the mountains.
            </p>
          </div>
          <RouterPanel />
        </section>

        <section className="block" id="now">
          <h2 className="block__label">
            <span className="block__chev">&gt;</span> Now
          </h2>
          <div className="now">
            <p className="now__text">
              Building{" "}
              <a href={profile.links.keelcode} target="_blank" rel="noreferrer">
                Keelcode
              </a>{" "}
              — loop engineering with guardrails and review-ready PRs.{" "}
              <a href={profile.links.routing} target="_blank" rel="noreferrer">
                routing.run
              </a>{" "}
              is live: one OpenAI-compatible surface over every model, zero prompt logs.
            </p>
            <aside className="now__aside">
              <p className="now__aside-label">Focus</p>
              <ul>
                {focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="block" id="work">
          <h2 className="block__label">
            <span className="block__chev">&gt;</span> Work
          </h2>
          <ul className="work-list">
            {work.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  className="work-card"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="work-card__id">{item.id}</span>
                  <div className="work-card__body">
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <span className={`work-card__tag${item.live ? " work-card__tag--live" : ""}`}>
                    {item.status}
                  </span>
                  <span className="work-card__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="block" id="stack">
          <h2 className="block__label">
            <span className="block__chev">&gt;</span> Stack
          </h2>
          <p className="stack-note">tools, not religion.</p>
          <ul className="chips">
            {stack.map((tool) => (
              <li key={tool}>
                <span className="chip">{tool}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="block" id="contact">
          <h2 className="block__label">
            <span className="block__chev">&gt;</span> Elsewhere
          </h2>
          <div className="contact-grid">
            {social.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="contact-tile"
                target={link.label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
              >
                <span className="contact-tile__label">{link.label}</span>
                <span className="contact-tile__line">{link.line}</span>
              </a>
            ))}
          </div>
        </section>

        <blockquote className="motto">
          <p>{profile.motto}</p>
        </blockquote>
      </main>

      <footer className="footer inner">
        <span>
          {profile.coords} // {profile.city.toLowerCase()}
        </span>
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
      </footer>
    </div>
  );
}
