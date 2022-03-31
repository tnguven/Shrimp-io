export type CollectionType = typeof Collections[keyof typeof Collections];

export const Collections = {
  ShortUrls: 'shortUrls',
} as const;
