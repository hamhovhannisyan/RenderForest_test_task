ALTER DATABASE postgres
SET timezone TO 'ASIA/YEREVAN';
CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TABLE IF NOT EXISTS products (
    "productId" SERIAL PRIMARY KEY,
    "productName" VARCHAR(150) NOT NULL,
    "productType" VARCHAR(150) NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()::TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ
);
CREATE TRIGGER set_timestamp BEFORE
UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();