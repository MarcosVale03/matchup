-- Add is_private column to tournament
ALTER TABLE tournaments
ADD COLUMN is_private boolean NOT NULL DEFAULT false;
