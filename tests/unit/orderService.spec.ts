import { OrderService } from '../../src/services/orderService';
import Order from '../../src/models/Order';

jest.mock('../../src/models/Order');
jest.mock('../../src/events/publisher');

describe('OrderService', () => {
  it('should accurately calculate total amount avoiding floating point errors', async () => {
    // 1.09 * 3 usually yields 3.2699999999999996 in standard JS
    const mockOrderData = {
      customerId: 'cust_123',
      items: [{ productId: 'prod_1', price: 1.09, quantity: 3 }]
    };

    Order.prototype.save = jest.fn().mockResolvedValue({ ...mockOrderData, totalAmount: 3.27, _id: '123' });
    
    await OrderService.createOrder(mockOrderData as any);
    
    expect(Order).toHaveBeenCalledWith(expect.objectContaining({
      totalAmount: 3.27 // Rounded properly
    }));
  });
});
