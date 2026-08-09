import { pills, profile } from "../data/site";

export function Hero({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <section className="hero">
      <div className="hero__copy hero-enter">
        <h1>
          Hi, I&apos;m <span className="brand">{profile.alias}</span>.
          <em>Also known as {profile.name}.</em>
        </h1>
        <p className="tagline">{profile.tagline}</p>
        <p className="bio">{profile.bio}</p>
        <div className="bio-ventures" aria-label="Ventures">
          {pills.map((p) => (
            <a key={p.name} className="venture-pill" href={p.href} target="_blank" rel="noopener noreferrer">
              <span className={`brand-logo brand-logo--sm brand-logo--${p.className}`}>
                <img src={p.logo} alt="" width={20} height={20} />
              </span>
              {p.name}
            </a>
          ))}
        </div>
        <div className="hints">
          <button type="button" className="hint-chip" id="hint-palette">
            <kbd>⌘K</kbd> jump anywhere
          </button>
        </div>
      </div>
      <figure className="portrait">
        <img
          className="hero__photo"
          src={profile.avatar}
          alt={profile.alias}
          width={248}
          height={248}
          decoding="async"
          title="Switch theme"
          onClick={onToggleTheme}
        />
        <figcaption className="portrait__caption">
          <span className="portrait__signal" />
          Kashmir · online
        </figcaption>
      </figure>
    </section>
  );
}
