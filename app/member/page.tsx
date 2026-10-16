import { getAllMembers } from "@/lib/data/members";
import { getAllAlumni } from "@/lib/data/alumni";
import type { Member } from "@/lib/schemas/memberSchema";
import type { Alumnus } from "@/lib/schemas/alumnusSchema";
import { withBasePath } from "@/lib/basePath";

const DIVIDER: React.CSSProperties = {
  width: "100%",
  height: 0,
  outline: "1px solid var(--foreground)",
  outlineOffset: -0.5,
};

const SECTION_TITLE: React.CSSProperties = {
  fontWeight: 400,
  fontSize: "clamp(26px, 4vw, 42px)",
  lineHeight: 1.25,
  color: "var(--foreground)",
  margin: 0,
};

/** Circular portrait, or a plain circle when the person has no photo yet. */
function Portrait({ member }: { member: Member }) {
  if (!member.image) {
    return (
      <div className="person-photo person-photo-placeholder" aria-hidden="true" />
    );
  }

  return (
    <img
      src={withBasePath(member.image)}
      alt={member.name}
      className="person-photo"
      width={600}
      height={600}
    />
  );
}

function PersonCard({ member }: { member: Member }) {
  const card = (
    <>
      <Portrait member={member} />
      <div className="person-name">{member.name}</div>
      {member.role && <div className="person-role">{member.role}</div>}
      {member.description && (
        <div className="person-description">{member.description}</div>
      )}
    </>
  );

  if (!member.url) {
    return <div className="person">{card}</div>;
  }

  return (
    <a
      href={member.url}
      target="_blank"
      rel="noopener noreferrer"
      className="person person-link"
    >
      {card}
    </a>
  );
}

function AlumnusEntry({ person }: { person: Alumnus }) {
  const nameNode = person.url ? (
    <a
      href={person.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit", fontSize: "inherit", textDecoration: "none" }}
    >
      {person.name}
    </a>
  ) : (
    person.name
  );

  return (
    <div className="alumnus">
      <div className="alumnus-name">{nameNode}</div>
      {person.dissertation && (
        <div className="alumnus-dissertation">{person.dissertation}</div>
      )}
      <div className="alumnus-meta">
        <span>{person.role}</span>
        {person.nextPosition && (
          <>
            <span className="alumnus-arrow">→</span>
            <span>{person.nextPosition}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function MembersPage() {
  const members = getAllMembers();
  const alumni = getAllAlumni();

  // The professor gets a centred row of her own; everyone else fills the grid.
  const [lead, ...rest] = members;

  return (
    <main className="page">
      <section>
        {lead && (
          <div className="people-lead">
            <PersonCard member={lead} />
          </div>
        )}

        <div className="people-grid">
          {rest.map((member) => (
            <PersonCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 80 }}>
        <div style={SECTION_TITLE}>Alumni</div>
        <div style={DIVIDER} />

        <div className="alumni-grid">
          {alumni.map((person) => (
            <AlumnusEntry key={person.id} person={person} />
          ))}
        </div>

        <p className="alumni-note">
          <strong>
            Are you an alum of LUNAR who isn’t listed here? Email Ellie and tell us what you are
            up to! We love to stay in touch!
          </strong>
        </p>
      </section>
    </main>
  );
}
