import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {
  @Prop({ required: true })
  film: string;
  @Prop({ required: true })
  session: string;
  @Prop({ required: true, type: Date })
  daytime: Date;
  @Prop({ required: true })
  row: number;
  @Prop({ required: true })
  seat: number;
  @Prop({ required: true })
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
