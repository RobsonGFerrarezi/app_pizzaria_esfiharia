-- CreateTable
CREATE TABLE "Carrinho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Carrinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarrinhoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carrinhoId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CarrinhoItem_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "Carrinho" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarrinhoItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
