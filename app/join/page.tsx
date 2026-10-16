"use client";

const SOLAR_HOURS_URL =
  "https://docs.google.com/document/d/1Rhdc95_paaW6ldKcbB0xIYPAyO19E5MtocAnqdGVAqg/edit?usp=sharing";
const CS_PHD_URL = "https://cs.brown.edu/degrees/doctoral/applications/";

export default function JoinPage() {
  return (
    <main className="mx-[20px] lg:mx-[90px] mt-[20px] mb-[50px]">
      <header className="mb-[30px]">
        <h1 className="text-[42px] mb-[20px]">Join the Lab</h1>
        <div className="text-[19px] mb-[30px] space-y-4">
          <p>
            If you are a Brown undergraduate or masters student, please join us during{" "}
            <a href={SOLAR_HOURS_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
              SOLAR Lab hours
            </a>
            !
          </p>
          <p>
            If you are interested in applying for a PhD, apply via the{" "}
            <a href={CS_PHD_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
              Brown CS PhD link
            </a>
            . Please do not email Ellie directly – as a matter of policy, and to maintain equal access
            to all applicants, she does not meet or discuss with students prior to reviewing their
            application.
          </p>
          <p>Please sign up for the NLU mailing list for announcements about lab meetings and project openings:</p>
        </div>
        <button
          className="text-[19px] text-[#F9E4C8] w-[270px] h-[47px] bg-[#323C50] rounded-2xl cursor-pointer [html[data-theme=dark]_&]:bg-[#F9E4C8] [html[data-theme=dark]_&]:text-[#323C50]"
          onClick={() => window.open("https://lists.cs.brown.edu/wws/info/nlu", "_blank", "noopener,noreferrer")}
        >
          Sign up for mailing list
        </button>
      </header>
    </main>
  );
}
