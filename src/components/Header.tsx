import { nav, profile } from "../data/site";

export function Header() {
  return (
    <header className="top">
      <a className="mark" href="#" aria-label="zentex — home">
        <img className="mark__emblem" src="/icons/mark.png" alt="" width={32} height={32} />
        <span>{profile.alias}</span>
      </a>
      <nav className="nav" aria-label="Links">
        {nav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label === "Email" ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            <img className="nav__icon" src={item.icon} alt="" width={15} height={15} />
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
