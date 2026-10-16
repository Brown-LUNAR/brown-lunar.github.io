import { getAllPapers } from "@/lib/data/papers";
import PublicationList from "@/components/publications/PublicationList";

export default function PublicationsPage() {
  const papers = getAllPapers();

  return (
    <main className="page">
      <PublicationList papers={papers} />
    </main>
  );
}
