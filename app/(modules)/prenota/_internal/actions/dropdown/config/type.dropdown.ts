/* ──────────────────────────  actions.types.ts  ─────────────────────────
 * Tipos exclusivos dos **componentes de ação / menu** da lista de Pré-notas
 ** ────────────────────────────────────────────────────────────────────*/

import React from "react";
import { PrenotaRow } from "@prenota/tabela";

/* ╔══════════════════════════════════════╗
   ║ 1 ▸ PROPS DE COMPONENTES DE AÇÃO     ║
   ╚══════════════════════════════════════╝ */

/**
 * Botões e dropdown que executam operações (“Revisar”, “Anexos”, “Excluir”…)
 * para uma pré-nota específica na tabela.
 */
export interface ActionsProps {
  /** Registro completo da linha atualmente selecionada */
  preNota: PrenotaRow;

  /** Callback disparado após exclusão bem-sucedida */
  onDeleteSuccess?: () => void;
}

/* ╔══════════════════════════════════╗
   ║ 2 ▸ ITEM INDIVIDUAL DE MENU      ║
   ╚══════════════════════════════════╝ */

/**
 * Entrada básica do dropdown / contexto de ações.
 */
export interface MenuItemProps {
  label: string; // texto visível
  icon: React.ReactNode; // ícone (React-icon, Lucide, etc.)
  onClick?: () => void; // handler principal
  disabled?: boolean; // se true, item fica desabilitado
  className?: string; // classes extras de utilidade ou tailwind
}
