import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { OrderRepository } from '../repository/order.repository';
import { ObjectId } from 'mongodb';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { CartService } from './../../cart/service/cart.service';
import { PaymentService } from './../../payment/payment.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/schema/product.shema';
@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private orderRepository: OrderRepository,
    private cartService: CartService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async getAllOrders() {
    return await this.orderRepository.getAll();
  }

  async getOrderUser(userId) {
    const userIdObjectId = new ObjectId(userId);
    const orderUser = await this.orderRepository.findOrderUser(userIdObjectId);
    return orderUser;
  }

//   async createOrder(createOrderDto: CreateOrderDto) {
//     let totalAmount = 0;
//     let productIds: ObjectId[] = [];

//     createOrderDto.products.forEach((product) => {
//       totalAmount += product.quantity * product.price;
//       // productIds.push(product.productId);
//       productIds.push(new ObjectId(product.productId));


//     });
//     const userIdObject = new Types.ObjectId(createOrderDto.userId);
//     const newOrder = { ...createOrderDto, userId: userIdObject, totalAmount };
//     const productIdStrings: string[] = productIds.map(id => id.toString());
//     try {
//       if (createOrderDto.isInCart) {
//         // await this.cartService.deleteCartByProductIdsAndUserId(
//         //     createOrderDto.userId,
//         //     productIdStrings,
//         //     "",  
//         //     ""
// // );

//       }

//       const orderExist = await this.orderRepository.create(newOrder);
//       return {
//         mesage: 'create order successfully',
//         orderExist,
//       };
//     } catch (err) {
//       throw new HttpException('Create order error', HttpStatus.BAD_REQUEST);
//     }
//   }
async createOrder(createOrderDto: CreateOrderDto) {
  let totalAmount = 0;
  let productIds: ObjectId[] = [];

  // Bước 1: Kiểm tra tồn kho trước khi tạo đơn
  for (const product of createOrderDto.products) {
    const productDoc = await this.productModel.findById(product.productId);

    if (!productDoc) {
      throw new HttpException(`Sản phẩm ${product.productId} không tồn tại`, HttpStatus.NOT_FOUND);
    }

    if (product.quantity > productDoc.quantity) {
      throw new HttpException(
        `Sản phẩm "${productDoc.name}" chỉ còn ${productDoc.quantity} cái trong kho`,
        HttpStatus.BAD_REQUEST,
      );
    }

    totalAmount += product.quantity * product.price;
    productIds.push(new ObjectId(product.productId));
  }

  // Bước 2: Tạo đơn hàng
  const userIdObject = new Types.ObjectId(createOrderDto.userId);
  const newOrder = { ...createOrderDto, userId: userIdObject, totalAmount };
  const productIdStrings: string[] = productIds.map(id => id.toString());

  try {
    if (createOrderDto.isInCart) {
      // gọi hàm xoá cart nếu có
    }

    // Bước 3: Trừ tồn kho sau khi tạo đơn
    for (const product of createOrderDto.products) {
      await this.productModel.findByIdAndUpdate(
        product.productId,
        { $inc: { quantity: -product.quantity } },
      );
    }

    const orderExist = await this.orderRepository.create(newOrder);

    return {
      message: 'Tạo đơn hàng thành công',
      orderExist,
    };
  } catch (err) {
    throw new HttpException('Lỗi khi tạo đơn hàng', HttpStatus.BAD_REQUEST);
  }
}


  async getOrderById(orderId: string) {
    return this.orderRepository.findById(orderId);
  }

  async getUrlPaymentOrder(orderId: string) {
    try {
      const orderExist = await this.orderRepository.findById(orderId);
      if (!orderExist) {
        throw new Error('Order not found');
      }

      const paymentInf = await this.paymentService.createZaloPayment(
        orderExist.totalAmount,
        orderId,
      );

      if (paymentInf) {
        return { success: true, paymentInf };
      } else {
        throw new Error('Failed to create payment URL');
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateShippingInfo(orderId: string, data: any) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderRepository.updateShippingInfo(orderId, data.shippingInfo);
    } catch (error) {
      console.log(error);
    }
    return {
      mesage: 'update Shipping information successfully',
    };
  }

  async updatePaymentStatus(orderId: string, paymentMethod: string) {
    if (paymentMethod === 'payment') {
      const paymentUrl = await this.getUrlPaymentOrder(orderId);
      return {
        message: paymentUrl.success,
        paymentUrl,
      };
    }

    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    const paymentStatus = 'Success';
    await this.orderRepository.updatePaymentStatus(orderId, paymentStatus);
    return {
      mesage: 'Update status success',
    };
  }

  async updateStatus(orderId: string) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderRepository.updateStatus(orderId);
      return {
        mesage: 'Update status success',
      };
    } catch (err) {
      throw new HttpException(
        'Update status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateShippingStatus(orderId: string, shippingStatus: string) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  
    try {
      await this.orderRepository.updateShippingStatus(orderId, shippingStatus);
  
      if (shippingStatus === 'delivered') {
        await this.updateStatus(orderId); // nếu bạn có hàm xử lý thêm trạng thái khác
      }
  
      return {
        message: 'Update shipping status success',
      };
    } catch (err) {
      throw new HttpException(
        'Update shipping status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async hasUserBoughtProduct(userId: ObjectId, productId: string) {
    const data = { userId, productId, status: 'success' };
    const orderExist = await this.orderRepository.findOrderSuccess(data);
    return orderExist;
  }
  async getRevenueStatistics() {
    const orders = await this.orderRepository.getAll();
  
    let totalRevenue = 0;
    let successRevenue = 0;
    let pendingRevenue = 0;
  
    let totalOrders = orders.length;
    let successOrders = 0;
    let pendingOrders = 0;
  
    for (const order of orders) {
      const amount = order.totalAmount || 0;
      totalRevenue += amount;
  
      if (order.status === 'success') {
        successRevenue += amount;
        successOrders += 1;
      } else if (order.status === 'pending') {
        pendingRevenue += amount;
        pendingOrders += 1;
      }
    }
  
    return {
      totalRevenue,
      successRevenue,
      pendingRevenue,
      totalOrders,
      successOrders,
      pendingOrders,
    };
  }
  
}
