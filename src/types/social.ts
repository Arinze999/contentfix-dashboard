export type RichText = { plain: string; markdown?: string };
export type PostItem = {
  id?: string; // let server fill if omitted (your trigger)
  linkedin?: { header?: string; body: RichText; hashtags?: string[] };
  twitter?: { text: RichText; chars?: number };
  threads?: { text: RichText };
  official?: { subject?: string; body: RichText };
};
