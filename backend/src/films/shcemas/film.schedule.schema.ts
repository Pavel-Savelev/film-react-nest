import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Schedule {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true, type: Date })
  daytime: Date;
  @Prop({ required: true })
  hall: number;
  @Prop({ required: true })
  rows: number;
  @Prop({ required: true })
  seats: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: [String] })
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
