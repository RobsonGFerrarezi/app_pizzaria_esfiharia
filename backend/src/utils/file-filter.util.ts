import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) {
    return callback(new BadRequestException('Nenhum arquivo enviado.'), false);
  }

  // Aceita apenas os formatos jpg, jpeg, png
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true); // Aceita o arquivo
  } else {
    callback(
      new BadRequestException('Tipo de arquivo inválido. Apenas JPG, JPEG e PNG são permitidos.'),
      false, // Rejeita o arquivo
    );
  }
};