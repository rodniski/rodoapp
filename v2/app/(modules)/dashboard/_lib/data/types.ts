export interface SubLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: any;
  requiresGroup?: string[];
}

export interface Card {
  mainUrl?: string;
  id: string;
  title: string;
  description: string;
  icon?: any;
  url?: string;
  external?: boolean;
  subLinks?: SubLink[];
}

export interface Category {
  id: string;
  title: string;
  cards: Card[];
}

export interface CarouselProps {
  cards: Card[];
  className?: string;
  category?: string;
}
