import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema()
export class Cart {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  productId: Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop()
  size: string;

  @Prop()
  color: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
