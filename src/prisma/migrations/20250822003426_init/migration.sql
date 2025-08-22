-- CreateTable
CREATE TABLE "public"."user" (
    "document" VARCHAR(20) NOT NULL,
    "type" VARCHAR(3) NOT NULL,
    "phone" VARCHAR(15),
    "email" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "not_debtor" TIMESTAMP(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("document")
);

-- CreateTable
CREATE TABLE "public"."enterprise" (
    "ruc" VARCHAR(20) NOT NULL,
    "business_name" VARCHAR(255) NOT NULL,
    "contact_email" VARCHAR(255),
    "api_key" VARCHAR(64),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_pkey" PRIMARY KEY ("ruc")
);

-- CreateTable
CREATE TABLE "public"."user_debt" (
    "id" SERIAL NOT NULL,
    "user_document" VARCHAR(20) NOT NULL,
    "enterprise_ruc" VARCHAR(20) NOT NULL,
    "debt_amount" DECIMAL(10,2) NOT NULL,
    "due_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_debt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_api_key_key" ON "public"."enterprise"("api_key");

-- CreateIndex
CREATE INDEX "user_debt_user_document_idx" ON "public"."user_debt"("user_document");

-- CreateIndex
CREATE INDEX "user_debt_enterprise_ruc_idx" ON "public"."user_debt"("enterprise_ruc");

-- CreateIndex
CREATE INDEX "user_debt_status_idx" ON "public"."user_debt"("status");

-- CreateIndex
CREATE INDEX "user_debt_due_date_idx" ON "public"."user_debt"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "user_debt_user_document_enterprise_ruc_key" ON "public"."user_debt"("user_document", "enterprise_ruc");

-- AddForeignKey
ALTER TABLE "public"."user_debt" ADD CONSTRAINT "user_debt_user_document_fkey" FOREIGN KEY ("user_document") REFERENCES "public"."user"("document") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_debt" ADD CONSTRAINT "user_debt_enterprise_ruc_fkey" FOREIGN KEY ("enterprise_ruc") REFERENCES "public"."enterprise"("ruc") ON DELETE RESTRICT ON UPDATE CASCADE;
