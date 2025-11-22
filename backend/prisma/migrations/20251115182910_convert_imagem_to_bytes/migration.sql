-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoria" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "imagem_produto" BLOB
);
INSERT INTO "new_Product" ("categoria", "id", "imagem_produto", "preco", "produto") SELECT "categoria", "id", "imagem_produto", "preco", "produto" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_produto_key" ON "Product"("produto");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
