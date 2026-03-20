type PriceCard = {
  title: string;
  description: string;
  price: string;
};

type PriceCardsProps = {
  cards: PriceCard[];
};

// Pricing cards used to communicate service tiers and deposit logic.
export function PriceCards({ cards }: PriceCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
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
