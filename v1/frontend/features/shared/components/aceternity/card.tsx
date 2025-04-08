"use client";
import React from "react";
import { cn } from "lib";
import Image from "next/image";

// Interface para as props do Card
interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export function Card({ imageSrc, title, description }: CardProps) {
  return (
    <div className="max-w-xs w-full group">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl max-w-sm mx-auto transform transition-transform duration-300 scale-100 group-hover:scale-105"
        )}
      >
        {/* Imagem */}
        <Image
          src={imageSrc}
          alt="card image"
          width={300}
          height={400}
          className="w-full h-full absolute object-cover"
        />

        {/* Efeito de escurecimento */}
        <div
          className="absolute w-full h-full top-0 left-0 bg-black opacity-50 group-hover:opacity-80 transition-all duration-300 z-10"
        ></div>

        {/* Conteúdo do Card */}
        <div className="flex flex-col justify-end w-full h-full p-4 relative z-20">
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 mb-2">
              {title}
            </h1>
            {/* Garantir altura fixa para descrição */}
            <p
              className="font-normal text-sm text-gray-50 line-clamp-3"
              style={{ minHeight: "3.5rem" }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
