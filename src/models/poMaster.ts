export interface PoMaster {
  id: number;
  order_no?: string | null;
  line?: number | null;
  sequence?: number | null;
  buy_from_partner_code?: string | null;
  site_code?: string | null;
  item_code?: string | null;
  item_description?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  project?: string | null;
  ordered_quantity?: number | null;
  received_quantity?: number | null;
  price?: number | null;
}
