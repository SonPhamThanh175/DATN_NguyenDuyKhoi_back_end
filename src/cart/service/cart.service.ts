import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from '../repository/cart.repository';
import { CreateCartDto } from '../dto/CreateCart.dto';
import { ObjectId } from 'mongodb';
import { Cart } from './../schema/cart.shema';
import { log } from 'console';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  // async createCart(createCartDto: CreateCartDto) {
  //   const userIdObject = new Types.ObjectId(createCartDto.userId);
  //   const productIdObject = new Types.ObjectId(createCartDto.productId);

  //   try {
  //     const existingCart =
  //       await this.cartRepository.getCartByProductIdAndUserId(
  //         productIdObject,
  //         userIdObject,
  //       );

  //     if (existingCart) {
  //       const updatedCart = await this.cartRepository.updateCartQuantity(
  //         productIdObject,
  //         userIdObject,
  //         createCartDto.quantity,
  //       );
  //       return {
  //         message: 'Cart quantity updated successfully',
  //         cart: updatedCart,
  //       };
  //     } else {
  //       const data = {
  //         userId: userIdObject,
  //         productId: productIdObject,
  //         quantity: createCartDto.quantity,
  //         size: createCartDto.size,
  //         color: createCartDto.color,
  //       };
  //       const newCart = await this.cartRepository.create(data);
  //       return {
  //         message: 'Create cart success',
  //         cart: newCart,
  //       };
  //     }
  //   } catch (err) {
  //     throw new HttpException('Create cart error', HttpStatus.BAD_REQUEST);
  //   }
  // }
  async createCart(createCartDto: CreateCartDto) {
    const userIdObject = new Types.ObjectId(createCartDto.userId);
    const productIdObject = new Types.ObjectId(createCartDto.productId);
  
    try {
      const existingCart = await this.cartRepository.getCartByProductIdAndUserId(
        productIdObject,
        userIdObject,
        createCartDto.size, 
        createCartDto.color 
      );
  
      if (existingCart) {
        // Cập nhật số lượng, đồng thời giữ nguyên size và color
        const updatedCart = await this.cartRepository.updateCartQuantity(
          productIdObject,
          userIdObject,
          createCartDto.quantity,
          createCartDto.size,  // Thêm size vào update
          createCartDto.color, // Thêm color vào update
        );
  
        return {
          message: 'Cart quantity updated successfully',
          cart: updatedCart,
        };
      } else {
        // Tạo mới giỏ hàng với size và color
        const data = {
          userId: userIdObject,
          productId: productIdObject,
          quantity: createCartDto.quantity,
          size: createCartDto.size,
          color: createCartDto.color,
        };
  
        const newCart = await this.cartRepository.create(data);
        return {
          message: 'Create cart success',
          cart: newCart,
        };
      }
    } catch (err) {
      throw new HttpException('Create cart error', HttpStatus.BAD_REQUEST);
    }
  }
  

  async getCartByUserId(userId: string) {
    const userIdObject = new Types.ObjectId(userId);
    return this.cartRepository.getByUserId(userIdObject);
  }

  async getCartByProductIdAndUserId(productId: ObjectId, userId: ObjectId, size: string, color: string) {
    return await this.cartRepository.getCartByProductIdAndUserId(
      productId,
      userId,
      size,  
      color
    );
  }

  async getAllCarts() {
    return this.cartRepository.getAll();
  }
  async deleteCartById(CartId: string) {
    const cartIdObjectId = new Types.ObjectId(CartId);
    const cartExists = await this.cartRepository.getById(cartIdObjectId);
    if (!cartExists) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return await this.cartRepository.deleteCartById(cartIdObjectId);
  }
  async deleteCartByProductIdAndUserId(productId: ObjectId, userId: ObjectId, size: string, color: string) {
    const cartExists = await this.cartRepository.getCartByProductIdAndUserId(
      productId,
      userId,
      size,
      color,
    );

    if (!cartExists) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }

    return await this.cartRepository.deleteCartByProductIdAndUserId(
      productId,
      userId,
      size,
      color,
    );
  }
  // async deleteCartByProductIdsAndUserId(userId: string, productId: string[], size: string, color: string) {
  //   const userIdObjectId = new ObjectId(userId);

  //   const productIdsObjectId = productId.map(
  //     (productId) => new ObjectId(productId),
  //   );

  //   try {
  //     const deletePromises = productIdsObjectId.map(async (productId) => {
  //       try {
  //         await this.deleteCartByProductIdAndUserId(productId, userIdObjectId,size,color);
  //       } catch (err) {
  //         throw new Error(
  //           `Error deleting cart for productId ${productId}: ${err.message}`,
  //         );
  //       }
  //     });

  //     await Promise.all(deletePromises);
  //     return {
  //       message: 'Delete carts successfully',
  //     };
  //   } catch (err) {
  //     throw new HttpException('Delete carts error', HttpStatus.BAD_REQUEST);
  //   }
  // }
  async deleteCartByProductIdsAndUserId(
    userId: string,
    productId: string,
    size: string,
    color: string
  ) {
    console.log('Received userId:', userId);
    console.log('Received productId:', productId);
  
    if (!ObjectId.isValid(userId)) {
      throw new Error(`Invalid userId: ${userId}`);
    }
  
    if (!ObjectId.isValid(productId)) {
      throw new Error(`Invalid productId: ${productId}`);
    }
  
    const userIdObjectId = new ObjectId(userId);
    const productIdObjectId = new ObjectId(productId);
  
    try {
      await this.cartRepository.deleteCartByProductIdAndUserId(
        productIdObjectId, userIdObjectId, size, color
      );
      return { message: 'Deleted cart successfully' };
    } catch (err) {
      throw new HttpException(`Error deleting cart: ${err.message}`, HttpStatus.BAD_REQUEST);
    }
  }
  
}
