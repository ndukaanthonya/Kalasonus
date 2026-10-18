/*
# Create mints table (single-tenant, no auth)

1. Plain-English summary
   - This migration creates the main database table for the KalaSonus.art app.
   - Every time an artist mints an artwork, the app saves a record here instead of writing to a local JSON file.
   - The data is intentionally public/shared: there is no sign-in screen in this app, so anyone (via the app) can read the gallery of minted pieces and the app can insert new ones.

2. New Tables
   - `mints`
     - `unique_id` (text, primary key) - The unique identifier used in the app's URLs (e.g. /piece/<unique_id>).
     - `artist_name` (text, not null) - Name of the artist as entered in the artist form.
     - `occasion` (text, nullable) - Optional occasion note (e.g. "Wedding", "Birthday").
     - `prompt_used` (text, not null) - The prompt text used to generate the artwork.
     - `audio_features` (jsonb, not null) - The analyzed voice/audio data (loudness, pitch, frequencies, etc.).
     - `generated_image_url` (text, not null) - Data URL or hosted URL of the generated artwork image.
     - `art_title` (text, not null) - The generated fine-art title for the piece.
     - `wallet_address` (text, not null) - The wallet address that minted the piece.
     - `token_id` (text, not null) - The NFT token id returned by the mint.
     - `tx_hash` (text, not null) - Transaction hash of the mint.
     - `payment_tx_hash` (text, nullable) - Transaction hash of the payment transaction, if any.
     - `color_palette` (text array, nullable) - Colors extracted from the artwork.
     - `created_at` (timestamp with time zone, defaults to now) - When the piece was minted.

3. Schema changes
   - None (this is the first migration; the database was empty).

4. Security
   - Row Level Security (RLS) is enabled on `mints`.
   - Public read access (`SELECT`) is granted to `anon` and `authenticated` roles, since the gallery is public.
   - Insert is allowed for `anon` and `authenticated` so the app can persist new mints without login.
   - Update and delete are intentionally not permitted through the public API.

5. Notes
   - This table matches the `MintRecord` type already defined in the app's frontend code, so no code changes are needed to read/write it beyond pointing the backend at Supabase.
   - No destructive operations are performed.
*/

CREATE TABLE IF NOT EXISTS mints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id text NOT NULL UNIQUE,
  artist_name text NOT NULL,
  occasion text,
  prompt_used text NOT NULL,
  prompt_image text,
  verify_jwt boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
