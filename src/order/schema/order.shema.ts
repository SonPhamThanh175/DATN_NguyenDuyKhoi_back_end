import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductOrder } from 'src/interface/product-order.interface';

export class ShippingInfo {
  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  addressDetail: string;
}

@Schema()
export class Order {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  products: ProductOrder[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  orderDate: Date;

  @Prop()
  shippingInfo: ShippingInfo;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: 'pending' })
  paymentStatus: string;

  // @Prop({ default: 'chờ xử lý' })
  // shippingStatus: string;
  @Prop({ type: String, enum: ['pending', 'shipping', 'delivered', 'cancelled'], default: 'pending' })
  shippingStatus: string;

  @Prop({ type: String }) // VD: Giao hàng nhanh, Shopee Express, v.v
  shippingProvider: string;

  @Prop({ type: Date }) // Ngày dự kiến giao
  estimatedDelivery: Date;

  @Prop({ type: Date }) // Ngày giao thành công
  deliveryDate: Date;

  @Prop()
  paymentMethod: string;

  @Prop()
  isInCart: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;