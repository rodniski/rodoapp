import React from 'react'
import { inicialCards } from './_internal/logic/inicial'

export default function Page() {
  return (
    <div className='flex flex-col space-y-8 lg:px-10 fhd:px-20 lg:pt-10 fhd:pt-10'>
      <div>
        <h1 className='text-4xl font-bold mb-2'>Introdução à Documentação</h1>
        <p className='text-lg'>
          Esta página tem o objetivo de centralizar as documentações do Grupo Rodoparaná, envolvendo TI, Protheus e Power BI. 
          Pela barra lateral é possível navegar e visualizar os conteúdos disponíveis.
        </p>
      </div>

      {inicialCards.map((card) => (
        <section key={card.title} className="bg-muted/30 p-5 rounded-xl shadow">
          <h2 className='text-2xl font-semibold flex items-center mb-2'>
            <span className='text-primary mr-2'>
              {card.icon}
            </span>
            {card.title}
          </h2>
          <p>{card.description}</p>
        </section>
      ))}
    </div>
  )
}
