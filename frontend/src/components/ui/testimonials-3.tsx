import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar.js";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "FinSight gives you more than a monthly spending total. It helps you understand where your money is going and what it means for your financial goals.",
    image: "https://unavatar.io/x/tim_cook",
    name: "Tim Cook",
    role: "CEO",
    company: "Apple",
    rating: 5.0,
  },
  {
    quote:
      "Having your income, expenses, goals and financial health in one place makes financial planning much easier to understand and act on.",
    image: "https://unavatar.io/x/JeffBezos",
    name: "Jeff Bezos",
    role: "Founder",
    company: "Amazon",
    rating: 4.8,
  },
  {
    quote:
      "The value of FinSight is the context. Instead of simply showing financial data, it helps turn that data into something you can actually use.",
    image: "https://unavatar.io/x/sama",
    name: "Sam Altman",
    role: "CEO",
    company: "OpenAI",
    rating: 4.9,
  },
];

function DecorIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-10 size-3.5 shrink-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)] stroke-1 stroke-[var(--color-text-secondary)]",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function QuoteIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const isFractional = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1.5 mb-1">
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          const isPartial = i === fullStars && isFractional;

          return (
            <div key={i} className="relative size-3.5 flex items-center justify-center">
              {isFilled ? (
                <Star className="size-3.5 fill-amber-400 stroke-amber-400 dark:fill-amber-300 dark:stroke-amber-300" />
              ) : isPartial ? (
                <div className="relative size-3.5">
                  <Star className="absolute inset-0 size-3.5 stroke-amber-400/40 text-transparent dark:stroke-amber-300/40" />
                  <div className="absolute inset-0 w-[80%] overflow-hidden">
                    <Star className="size-3.5 fill-amber-400 stroke-amber-400 dark:fill-amber-300 dark:stroke-amber-300" />
                  </div>
                </div>
              ) : (
                <Star className="size-3.5 stroke-[var(--color-border-primary)] text-transparent opacity-50" />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] tracking-tight">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full pt-16 pb-24 sm:pt-24 sm:pb-36 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-t border-[var(--color-border-primary)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 sm:mb-20 max-w-xl text-center space-y-3">
          <p className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">
            WHAT PEOPLE ARE SAYING
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            A smarter way to manage your money
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            A clearer view of your finances, from the people who use it.
          </p>
        </div>

        {/* Cards Grid with Staggered Offset */}
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-3 md:gap-6 pt-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              index={index}
              key={testimonial.name}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
  index: number;
}) {
  const { quote, name, role, company, image, rating } = testimonial;

  return (
    <figure
      className={cn(
        "group relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs bg-[var(--color-bg-secondary)]/40 md:translate-y-[calc(3rem*var(--t-card-index))]",
        className,
      )}
      style={
        {
          "--t-card-index": index,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Extended Border Lines matching original layout */}
      <div className="absolute -inset-y-4 -left-px w-px bg-[var(--color-border-primary)] pointer-events-none" />
      <div className="absolute -inset-y-4 -right-px w-px bg-[var(--color-border-primary)] pointer-events-none" />
      <div className="absolute -inset-x-4 -top-px h-px bg-[var(--color-border-primary)] pointer-events-none" />
      <div className="absolute -right-4 -bottom-px -left-4 h-px bg-[var(--color-border-primary)] pointer-events-none" />
      <DecorIcon />

      <div className="flex flex-col gap-3">
        <StarRating rating={rating} />
        
        <blockquote className="flex gap-3.5">
          <QuoteIcon
            aria-hidden="true"
            className="size-5 shrink-0 stroke-1 text-[var(--color-text-secondary)] opacity-70 mt-0.5"
          />

          <p className="flex-1 font-normal text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {quote}
          </p>
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3 pt-2">
        <Avatar className="size-10 rounded-full ring-2 ring-[var(--color-border-primary)] ring-offset-2 ring-offset-[var(--color-bg-primary)] transition-shadow group-hover:ring-[var(--color-text-primary)]/30">
          <AvatarImage alt={`${name}'s profile picture`} src={image} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="font-medium text-[var(--color-text-primary)] text-sm not-italic">
            {name}
          </cite>
          <p className="text-[var(--color-text-secondary)] text-xs">
            {role}, <span className="text-[var(--color-text-primary)]/80 font-semibold">{company}</span>
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export default TestimonialsSection;
