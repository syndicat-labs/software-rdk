export type PaletteSection = 'recents' | 'navigation' | 'create' | 'actions';

export interface CommandEntry {
  readonly id: string;
  readonly section: PaletteSection;
  readonly label: string;
  readonly hint?: string;
  readonly keywords: string[];
  readonly icon?: string;
  readonly routerLink?: string;
  readonly run?: () => void;
}

export interface RecentRoute {
  readonly label: string;
  readonly url: string;
  readonly at: number;
}