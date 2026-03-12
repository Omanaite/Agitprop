type PriceCard = {
  title: string;
  description: string;
  price: string;
};

const PRICES: PriceCard[] = [
  {
    title: "Session Deposit",
    description: "Secures your booking slot. Non-refundable.",
    price: "€120",
  },
  {
    title: "Custom Design",
    description: "Standalone design package with two revisions.",
    price: "€220",
  },
  {
    title: "Full Day",
    description: "Large scale pieces, 6-7 hours of work.",
    price: "€650",
  },
];

// Pricing cards used to communicate service tiers and deposit logic.
export function PriceCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PRICES.map((card) => (
        <article
          key={card.title}
          className="hard-border flex flex-col gap-3 bg-[var(--bg)] p-4"
        >
          <h3 className="font-[var(--font-heading)] text-xl uppercase">
            {card.title}
          </h3>
          <p className="text-sm">{card.description}</p>
          <p className="text-lg uppercase tracking-[0.2em]">{card.price}</p>
        </article>
      ))}
    </div>
  );
}
