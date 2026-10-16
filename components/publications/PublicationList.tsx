import type { Paper } from "@/lib/schemas/paperSchema";

interface PublicationListProps {
  papers: Paper[];
}

/** Papers arrive newest-first, so a single pass keeps the years in order. */
function groupByYear(papers: Paper[]): [number, Paper[]][] {
  const groups: [number, Paper[]][] = [];

  for (const paper of papers) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup[0] === paper.year) {
      lastGroup[1].push(paper);
    } else {
      groups.push([paper.year, [paper]]);
    }
  }

  return groups;
}

export default function PublicationList({ papers }: PublicationListProps) {
  const groups = groupByYear(papers);

  return (
    <div style={{ color: "var(--foreground)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      {groups.length === 0 ? (
        <p style={{
          fontSize: 19,
          color: "var(--foreground)",
          padding: "40px 0",
        }}>
          No publications found.
        </p>
      ) : (
        groups.map(([year, yearPapers]) => (
          <section key={year} className="paper-year-group">
            <h2 className="paper-year">{year}</h2>

            {yearPapers.map((paper) => (
              <article key={paper.id} className="paper-row">
                <h3 className="paper-title">
                  <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer">
                    {paper.title}
                  </a>
                </h3>

                <div className="paper-authors">{paper.authors.join(", ")}</div>

                {/* The year lives in the group heading above. */}
                <div className="paper-meta">{paper.venue}</div>
              </article>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
