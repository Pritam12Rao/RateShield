-- CreateTable
CREATE TABLE "rate_policies" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'sliding',
    "limit_count" INTEGER NOT NULL,
    "window_seconds" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rate_policies_client_id_endpoint_key" ON "rate_policies"("client_id", "endpoint");
