import Link from "next/link";

const features = [
  {
    icon: "💬",
    title: "Ask Questions",
    description:
      "Ask academic questions without fear and get meaningful answers from students, faculty, researchers, and mentors.",
  },
  {
    icon: "🤝",
    title: "Collaborate",
    description:
      "Connect with people who share your interests and collaborate on projects, ideas, research, and learning.",
  },
  {
    icon: "🏆",
    title: "Build Reputation",
    description:
      "Get recognized for the knowledge, ideas, and contributions you share with the academic community.",
  },
];

const steps = [
  {
    number: "01",
    title: "Ask",
    description:
      "Have a question? Ask the community and get useful answers from people with relevant knowledge.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Discover students, faculty, researchers, and mentors who share your interests and goals.",
  },
  {
    number: "03",
    title: "Contribute",
    description:
      "Share your knowledge, help others, collaborate on ideas, and build your reputation.",
  },
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-black text-white">
      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur">
            <span>🚀</span>
            <span>India&apos;s Academic Collaboration Platform</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Ask without fear.
            <br />
            <span className="text-gray-400">
              Get known for what you give.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Connext connects students, faculty, researchers, and mentors to
            ask questions, share knowledge, collaborate on projects, and grow
            together.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-200"
            >
              Get Started →
            </Link>

            <Link
              href="/communities"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Connext
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Built for students • Faculty • Researchers • Mentors
          </p>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        id="explore"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Why Connext?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn. Connect. Contribute.
            </h2>

            <p className="mt-4 text-gray-400">
              Everything you need to become part of a collaborative academic
              community.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {feature.description}
                </p>

                <div className="mt-6 text-sm font-medium text-gray-300 transition group-hover:text-white">
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              How It Works
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From question to contribution.
            </h2>

            <p className="mt-4 text-gray-400">
              A simple way to learn from others and share what you know.
            </p>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="absolute left-[16.5%] right-[16.5%] top-8 hidden h-px bg-white/10 md:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative z-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black text-lg font-bold">
                  {step.number}
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-sm leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        id="get-started"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center sm:px-12">
            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Join Connext
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Ready to be part of the community?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                Ask questions. Share knowledge. Connect with people.
                Contribute to something bigger.
              </p>

              <Link
                href="/login"
                className="rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-200"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}