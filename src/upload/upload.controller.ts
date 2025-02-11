import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageOptions } from 'helpers/config';
import { ProductService } from 'src/product/service/product.service';

@Controller('uploads')
export class UploadController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: storageOptions('products') }),
  )
  async uploadPostFiles(
    @Body('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const urlFiles = files.map((file) => {
      const url = `http://localhost:5000/api/uploads/products/${file.filename}`;
      return url;
    });

    return await this.productService.updateImagesOfProduct(productId, urlFiles);
  }

  @Post('avatar')
  @UseInterceptors(
    FilesInterceptor('files', 1, { storage: storageOptions('avatars') }),
  )
  uploadAvatarFile(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = files.map((file) => ({
      url: `http://localhost:5000/api/uploads/avatars/${file.filename}`,
      name: file.filename,
      status: 'done',
    }));
    return uploadedFiles;
  }

}
