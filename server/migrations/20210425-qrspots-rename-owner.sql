ALTER TABLE qrspots
RENAME COLUMN assigner_id TO owner_id;

ALTER TABLE qrspots
RENAME CONSTRAINT qrspots_assigner_id_fkey TO qrspots_owner_id_fkey;