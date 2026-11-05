export type ThemePaletteId =
  | 'default'
  | 'arctic'
  | 'nothing'
  | 'amber-walnut'
  | 'urban-nocturne'
  | 'urban-slate'
  | 'ink-wash';

export interface ThemePaletteDefinition {
  id: ThemePaletteId;
  name: string;
  tagline: string;
  description: string;
  previewColors: string[]; // 5 representative swatches from source palette
  isDefault?: boolean;
}

export const THEME_PALETTES: ThemePaletteDefinition[] = [
  {
    id: 'default',
    name: 'FinSight Original',
    tagline: 'Signature Blue, Onyx & White',
    description: 'The signature FinSight high-contrast executive theme with rich obsidian cards and vibrant blue accents.',
    previewColors: ['#000000', '#1A1A1A', '#3B82F6', '#9CA3AF', '#FFFFFF'],
    isDefault: true,
  },
  {
    id: 'arctic',
    name: 'Arctic Reflection',
    tagline: 'Glacial Navy, Frost & Cobalt',
    description: 'Nordic glacial atmosphere with deep oceanic abyssal navy, ice-frost typography, and vivid cobalt action points.',
    previewColors: ['#243C4C', '#698696', '#5289AD', '#ACBCBF', '#F4FCFB'],
  },
  {
    id: 'nothing',
    name: 'Nothing UI',
    tagline: 'Minimalist Charcoal & Safety Orange',
    description: 'Inspired by brutalist industrial design with warm bone canvas, deep charcoal cards, and iconic safety orange triggers.',
    previewColors: ['#252422', '#403D39', '#EB5E28', '#CCC5B9', '#FFFCF2'],
  },
  {
    id: 'amber-walnut',
    name: 'Amber Walnut Morning',
    tagline: 'Dark Espresso & Cinnamon Amber',
    description: 'Warm organic aesthetic with rich roasted walnut surfaces, warm terracotta structures, and cinnamon focal accents.',
    previewColors: ['#4A413C', '#C8906D', '#BB6C43', '#CCB499', '#EBEFEE'],
  },
  {
    id: 'urban-nocturne',
    name: 'Urban Nocturne',
    tagline: 'Pitch Noir & Cyber Neon Yellow',
    description: 'High-contrast nocturnal metropolis with pitch black surfaces, concrete grays, and electric cyber lime-yellow highlights.',
    previewColors: ['#141414', '#444444', '#E2E800', '#979797', '#D6D6D6'],
  },
  {
    id: 'urban-slate',
    name: 'Urban Slate',
    tagline: 'Nordic Denim, Granite & Taupe',
    description: 'Balanced architectural palette with Scandinavian denim slate, granite bronze, and earthen clay accents.',
    previewColors: ['#5E5653', '#7B7F8A', '#6B7C98', '#AB978C', '#E9E6E7'],
  },
  {
    id: 'ink-wash',
    name: 'Ink Wash',
    tagline: 'Traditional Sumi Ink & Silver Wash',
    description: 'Eastern calligraphy aesthetics with dense sumi ink black, charcoal gradients, and layered parchment washes.',
    previewColors: ['#252525', '#545454', '#7D7D7D', '#CFCFCF', '#FFFFFF'],
  },
];

