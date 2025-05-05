import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Order } from '../schema/order.shema';
import { ShippingInfo } from './../schema/order.shema';
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
  ) {}

  async getAll() {
    return await this.orderModel.find();
  }

  async findOrderUser(userId: ObjectId) {
    return await this.orderModel.find({ userId });
  }
  async create(newOrder: any) {
    return this.orderModel.create(newOrder);
  }

  // async findOrderSuccess(data: any) {
  //   console.log('data in repo:', data);
  //   return await this.orderModel.find({
  //     userId: data.userId,
  //     status: 'success',
  //     products: {
  //       $elemMatch: { productId: data.productId },
  //     },
  //   });
  // }
  async findOrderSuccess(data: any) {
    console.log('data in repo:', data);
    return await this.orderModel.find({
      userId: new Types.ObjectId(data.userId),
      status: 'success',
      products: {
        $elemMatch: { productId: new Types.ObjectId(data.productId) },
      },
    });
  }

  async findById(id: string) {
    return await this.orderModel.findById(id);
  }

  async updateShippingInfo(orderId: string, shippingInfo: any) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { shippingInfo },
      { new: true },
    );
  }
  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true },
    );
  }

  async updateStatus(orderId: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'success' },
      { new: true },
    );
  }
  // async updateShippingStatus(orderId: string, shippingStatus: string) {
  //   return await this.orderModel.findByIdAndUpdate(
  //     orderId,
  //     { shippingStatus },
  //     { new: true },
  //   );
  // }
  async updateShippingStatus(orderId: string, shippingStatus: string) {
    const updateData: any = { shippingStatus };
  
    if (shippingStatus === 'delivered') {
      updateData.deliveryDate = new Date(); // ✅ Cập nhật ngày giao
    }
  
    return this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
  }
  
}
