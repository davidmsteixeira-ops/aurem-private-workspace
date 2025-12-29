export type BrandVaultEntries = {
  id: number;
  client_id: number;
  section_id: number;
  version: number;
  status: string;
  content: string;
  created_at: string;
  updated_at: string;
  updated_by: number;
};


export type BrandVaultEntry = {
  id: number;
  client_id: number;
  section_id: number;
  version: number;
  status: string;
  content: {
    title?: string;
    blocks: BrandBlock[];
  };
  created_at: string;
  updated_at: string;
};

export type BrandBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'heading';
      level: 2 | 3 | 4;
      text: string;
    }
  | {
      type: 'list';
      style: 'bullet' | 'numbered';
      items: string[];
    }
  | {
      type: 'callout';
      tone?: 'neutral' | 'positive' | 'warning';
      text: string;
    };
