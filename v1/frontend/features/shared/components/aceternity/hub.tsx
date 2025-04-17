"use client";
import React from "react";
import { CanvasRevealEffect } from "components/aceternity";

interface CardData {
  text: string;
  description: string;
  link: string;
  colors: number[][];
  containerClassName: string;
}

export function HubNotas({ cards }: { cards: CardData[] }) {
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4 mx-auto px-8">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.text}
          description={card.description}
          link={card.link}
          icon={<AceternityIcon />}
          colors={card.colors}
          containerClassName={card.containerClassName}
        />
      ))}
    </div>
  );
}

const Card = ({
  title,
  description,
  link,
  icon,
  colors,
  containerClassName,
}: {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  colors: number[][];
  containerClassName: string;
}) => {
  return (
    <a
      href={link}
      className="group/canvas-card border border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem] flex items-center justify-center"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />


      <div className="absolute inset-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName={containerClassName}
          colors={colors}
          dotSize={2} // Pontos sempre visíveis
        />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-5 justify-center items-center text-center opacity-100 group-hover/canvas-card:opacity-0 relative z-10 mt-4 group-hover/canvas-card:-translate-y-2 transition duration-200 text-white">
          <h3 className="text-3xl">{title}</h3>
          <span className="font-mono leading-tight text-white/60">
            {description}
          </span>
        </div>
        <div className="text-center group-hover/canvas-card:-translate-y-4 opacity-0 group-hover/canvas-card:opacity-100 transition duration-200 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
      </div>
    </a>
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};