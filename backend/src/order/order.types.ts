import { Document } from 'mongoose';
import { Order } from './schemas/order.schema';

export type OrderDocument = Order & Document;
