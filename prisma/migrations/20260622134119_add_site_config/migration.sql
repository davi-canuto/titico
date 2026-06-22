-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "pixEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- Seed singleton
INSERT INTO "SiteConfig" ("id", "pixEnabled") VALUES ('global', true) ON CONFLICT DO NOTHING;
