-- CreateTable
CREATE TABLE "environment_share" (
    "id" SERIAL NOT NULL,
    "created_at" TEXT NOT NULL,
    "accepted" BOOLEAN,
    "user_owner" TEXT NOT NULL,
    "user_partner" TEXT NOT NULL,
    "environment" INTEGER NOT NULL,

    CONSTRAINT "environment_share_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "environment_share" ADD CONSTRAINT "environment_share_user_owner_fkey" FOREIGN KEY ("user_owner") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_share" ADD CONSTRAINT "environment_share_user_partner_fkey" FOREIGN KEY ("user_partner") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_share" ADD CONSTRAINT "environment_share_environment_fkey" FOREIGN KEY ("environment") REFERENCES "environments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
