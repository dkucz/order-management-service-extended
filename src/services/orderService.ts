import Order, { IOrder } from '../models/Order';
import { eventPublisher } from '../events/publisher';
import { logger } from '../utils/logger';

export class OrderService {
  static async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    // FIX: Using Math.round to avoid JS floating point math errors (e.g., 0.1 + 0.2 = 0.30000000000000004)
    // All prices should be calculated in cents.
    const rawTotal = data.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const totalAmount = Math.round(rawTotal * 100) / 100;
    
    const order = new Order({
      ...data,
      totalAmount,
      status: 'PENDING'
    });
    
    const savedOrder = await order.save();
    
    eventPublisher.publish('order.created', {
      orderId: savedOrder._id,
      customerId: savedOrder.customerId,
      items: savedOrder.items,
      totalAmount: savedOrder.totalAmount
    }).catch(err => logger.error('Failed to publish order.created event', { err }));

    return savedOrder;
  }

  static async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }
}
