import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;
  @Prop()
  rating: number;
  @Prop({ required: true })
  director: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  cover: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  about: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
