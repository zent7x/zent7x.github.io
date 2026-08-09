import { profile } from "../data/site";
import { useReveal } from "../hooks/useReveal";

export function Quote() {
  const ref = useReveal<HTMLQuoteElement>();
  return (
    <blockquote className="quote" ref={ref} data-reveal>
      <p>{profile.motto}</p>
    </blockquote>
  );
}

export function Contact() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="contact" id="contact" ref={ref} data-reveal>
      <div>
        <p className="contact__eyebrow">Consulting · security · interesting builds</p>
        <h2>Have something difficult?</h2>
      </div>
      <a className="contact__link" href={profile.links.email}>
        {profile.email} ↗
      </a>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} {profile.alias}</span>
      <span>Kashmir · {profile.coords.split(" · ")[0]}</span>
    </footer>
  );
}
