-- CreateTable
CREATE TABLE "images_in_order" (
    "id" UUID NOT NULL,
    "imageId" UUID NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "images_in_order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images_in_order" ADD CONSTRAINT "images_in_order_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_in_order" ADD CONSTRAINT "images_in_order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
