import HeroCarousel from "@/components/home/HeroCarousel";

const INTRO_TEXT =
  "The Language Understanding and Representation (LUNAR) Lab studies how AI models represent knowledge, learn, and reason – and how these processes relate to human cognition. We combine a range of behavioral experiments and interpretability methods to investigate how models represent and compose information, make inferences, execute tasks, and manage complex and multimodal information in memory. We aim to identify the representations and computational mechanisms that enable advanced cognitive systems (whether human or machine) to learn concepts, use knowledge in new contexts, and reason robustly, and to understand how these mechanisms compare with those underlying human cognition.";

const BODY: React.CSSProperties = {
  fontWeight: 400,
  fontSize: 19,
  lineHeight: "30px",
  color: "var(--foreground)",
  margin: 0,
};

export default function HomePage() {
  return (
    <main className="box-border w-full overflow-hidden px-5 pt-8 pb-24 md:px-[60px] md:pb-28 lg:px-[125px] lg:pt-[46px]">
      <section className="w-full max-w-[1243px]">
        <p style={BODY}>{INTRO_TEXT}</p>
        <p style={{ ...BODY, marginTop: 16 }}>
          LUNAR Lab is part of the{" "}
          <a
            href="https://aria.brown.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            NSF AI Research Institute for Interaction with AI Assistants (ARIA)
          </a>
          .
        </p>
      </section>

      <HeroCarousel />
    </main>
  );
}
