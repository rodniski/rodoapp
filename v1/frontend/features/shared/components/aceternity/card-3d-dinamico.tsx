"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "./3d-card";

interface ThreeDCardProps {
  title: string;
  description: string;
  imageSrc: string;
  buttonLink?: string;
  buttonText?: string;
  tryLink?: string; // Link para outro destino
  tryText?: string; // Texto do "Try now"
}

export const ThreeDCard = ({
  title,
  description,
  imageSrc,
  buttonLink = "#",
  buttonText = "Sign up",
  tryLink = "#",
  tryText = "Try now →",
}: ThreeDCardProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[25rem] h-100 rounded-xl p-6 border">

        {/* Título */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>

        {/* Descrição */}
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>

        {/* Imagem */}
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={imageSrc}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="Card Image"
          />
        </CardItem>

        {/* Botões */}
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href={buttonLink}
            className="ml-auto px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            {buttonText}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};
