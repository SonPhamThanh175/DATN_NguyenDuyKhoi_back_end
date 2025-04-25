import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop()
  name: string;

  @Prop({ default: [''] })
  images: string[];

  @Prop()
  description: string;

  @Prop()
  descriptionFull: string;

  @Prop()
  originalPrice: number;

  @Prop()
  salePrice: number;

  // @Prop()
  // dialSize: number;

  // @Prop()
  // thickness: number;

  @Prop({ default: [''] })
  Color: string[];

  @Prop({ default: ['36','37','38','39','40','41','42']})
  size: string[];

  // @Prop()
  // strapSize: number;

  // @Prop()
  // waterResistance: string;

  // @Prop()
  // glassMaterial: string;

  // @Prop()
  // strapMaterial: string;

  @Prop({ required: true, default: 1000 })
  quantity: number;

  @Prop({ type: Types.ObjectId })
  typeId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
