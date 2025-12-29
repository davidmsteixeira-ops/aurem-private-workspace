export type BrandVaultSection = {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type BrandVaultSections = {
  sections: BrandVaultSection[];
};