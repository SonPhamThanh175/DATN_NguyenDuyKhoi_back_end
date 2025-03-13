import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Cart } from '../schema/cart.shema';
@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<Cart>,
  ) {}

  async getAll() {
    return await this.cartModel.find();
  }

  async create(data: any) {
    return this.cartModel.create(data);
  }

  async getById(id: ObjectId) {
    return await this.cartModel.findById(id);
  }
  async getByProductIdAndUserId(userId: ObjectId, productId: ObjectId) {
    return this.cartModel.find({ userId: userId, productId: productId });
  }
  async getByUserId(userId: ObjectId) {
    return this.cartModel.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
    ]);
  }

  async getCartByProductIdAndUserId(productId: ObjectId, userId: ObjectId,size?: string, color?: string) {
    return await this.cartModel.findOne({ productId, userId,size,color });
  }

  async deleteCartByProductIdAndUserId(productId: ObjectId, userId: ObjectId,size: string, color: string) {
    return await this.cartModel.deleteOne({ productId, userId ,size, color });
  }

  async deleteCartById(cartId: ObjectId) {
    return await this.cartModel.findByIdAndDelete(cartId);
  }

  async updateCartQuantity(
    productId: ObjectId,
    userId: ObjectId,
    quantity: number,
    size?: string,
    color?: string
  ) {
    return await this.cartModel.findOneAndUpdate(
      { productId, userId, size, color }, // Thêm size và color vào điều kiện tìm kiếm
      { $inc: { quantity } }, // Sử dụng $inc để tăng quantity thay vì set cứng
      { new: true }
    );
  }
  
  
}
