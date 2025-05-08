export interface SubItem {
  id: string;
  title: string;
  icon?: any;
  url?: string;
}

export interface Category {
  id: string;
  title: string;
  icon?: any;
  subItem: SubItem[];
}