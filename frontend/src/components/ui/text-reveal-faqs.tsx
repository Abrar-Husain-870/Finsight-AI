'use client'

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils.js';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQs({ className }: { className?: string }) {
  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      question: 'What is FinSight?',
      answer: 'FinSight is a personal finance manager that helps you track, understand, and plan your finances from one calm, organized place.',
    },
    {
      id: 'item-2',
      question: 'What can I manage with FinSight?',
      answer: 'Track income, expenses, budgets, goals, financial health, and analyse your spending patterns in one workspace.',
    },
    {
      id: 'item-3',
      question: 'How is FinSight different from a regular finance app?',
      answer: 'Instead of stopping at expense tracking, FinSight brings your financial data together to provide personalised insights, planning, and guidance.',
    },
    {
      id: 'item-4',
      question: 'How does the AI Coach help me?',
      answer: 'The AI Coach uses your financial context to help you understand your spending, answer questions, and make more informed financial decisions.',
    },
    {
      id: 'item-5',
      question: 'Is my financial data secure?',
      answer: 'FinSight is designed with privacy and secure handling of financial data in mind. Your financial information is used exclusively to power your personal experience.',
    },
  ];

  return (
    <section className={cn("py-16 md:py-24 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-t border-[var(--color-border-primary)] w-full", className)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          {/* Header Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Help & Support</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">FAQs</h2>
            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed">
              Everything you need to know about FinSight
            </p>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed pt-2 hidden md:block">
              Have questions about managing your finances with FinSight? Find the answers to the most common questions below.
            </p>
          </div>

          {/* Accordion Column */}
          <div className="md:col-span-3">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-[var(--color-border-primary)]"
                >
                  <AccordionTrigger className="cursor-pointer text-base font-semibold text-[var(--color-text-primary)] hover:no-underline py-4 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--color-text-secondary)] pb-4">
                    <BlurredStagger text={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

export const BlurredStagger = ({
  text = "",
}: {
  text: string;
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  const wordAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(6px)",
      y: 2,
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="show"
      className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] font-normal flex flex-wrap"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordAnimation}
          transition={{ duration: 0.2 }}
          className="inline-block mr-1.5 whitespace-nowrap"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default FAQs;
