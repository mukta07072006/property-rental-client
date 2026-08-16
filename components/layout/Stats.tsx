const stats = [
  {
    value: "10K+",
    label: ["Happy", "Customers"],
  },
  {
    value: "500+",
    label: ["Products", "Available"],
  },
  {
    value: "24/7",
    label: ["Customer", "Support"],
  },
  {
    value: "99%",
    label: ["Positive", "Reviews"],
  },
];


const Stats = () => {
  return (
    <section className="grid grid-cols-2 gap-8 border-y border-black/5 bg-[#FBFAF8] px-6 py-10 md:grid-cols-4 md:px-12">
      {stats.map((stat, index) => (
        <div
          key={`${stat.value}-${index}`}
          className="flex items-center justify-center gap-3"
        >
          <span className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            {stat.value}
          </span>

          <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.15em] text-neutral-400">
            {stat.label?.map((line, i) => (
              <span key={i}>
                {line}
                {i < stat.label.length - 1 && <br />}
              </span>
            ))}
          </span>
        </div>
      ))}
    </section>
  );
}

export const StatsGrid = Stats
export default Stats;