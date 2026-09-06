import { profile } from "../data/site";
import { href } from "../lib/url";
import { Reveal } from "./Reveal";

export function Privacy() {
  return (
    <main id="main" className="mt-16 pb-8">
      <Reveal>
        <p className="font-mono text-xs text-muted">Privacy</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
          How this site treats your data
        </h1>
        <div className="mt-8 space-y-6 text-base text-muted text-pretty">
          <p>This is a personal site for {profile.fullName}. It is not a product with user accounts.</p>
          <p>Email links open your own mail app. Nothing you write is stored on a server owned by this site.</p>
          <p>There is no analytics pixel, no ad network, and no cookie banner because there are no tracking cookies.</p>
          <p>
            Questions: <a className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg" href={profile.links.email}>{profile.email}</a>
          </p>
        </div>
      </Reveal>
    </main>
  );
}

export function Terms() {
  return (
    <main id="main" className="mt-16 pb-8">
      <Reveal>
        <p className="font-mono text-xs text-muted">Terms</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
          A short note, not a novel
        </h1>
        <div className="mt-8 space-y-6 text-base text-muted text-pretty">
          <p>The writing and layout on zent7x.com belong to {profile.fullName} unless a license on a linked repo says otherwise.</p>
          <p>Open source projects linked from this site keep their own licenses. Read those before you use the code.</p>
          <p>Consulting starts only after a written yes. An email is not a contract. A quote in writing is the start of a scope.</p>
          <p>Security work is authorized work only. Do not treat this page as an invitation to test my systems, or anyone else's, without a scope.</p>
          <p>
            Contact: <a className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg" href={profile.links.email}>{profile.email}</a>
          </p>
        </div>
      </Reveal>
    </main>
  );
}

export function NotFound() {
  return (
    <main id="main" className="mt-24 pb-8">
      <p className="font-mono text-xs text-muted">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
        This path does not exist
      </h1>
      <p className="mt-6 text-muted text-pretty">The page you want is not on this site. Head home, or email the hard problem anyway.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a className="inline-flex items-center rounded-lg bg-fg px-3 py-2 text-base font-semibold text-bg hover:opacity-80 active:scale-[0.98]" href={href("/")}>
          Back home
        </a>
        <a className="inline-flex items-center rounded-lg bg-chip px-3 py-2 text-base font-semibold hover:bg-line active:scale-[0.98]" href={profile.links.email}>
          Email me
        </a>
      </div>
    </main>
  );
}
