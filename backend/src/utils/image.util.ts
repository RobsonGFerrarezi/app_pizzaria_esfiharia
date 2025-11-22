import * as fs from 'fs';

export function convertBase64ToBytes(base64: string): Buffer { // <-- Mude o retorno para Buffer
  const cleaned = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(cleaned, "base64");

  return buffer; // <-- Retorne o buffer diretamente
}

// Se quiser converter de arquivo do disco para bytes
export function convertFileToBytes(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}