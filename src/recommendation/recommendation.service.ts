import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order,  } from '../order/schema/order.shema';
import { Review  } from '../review/schema/review.shema';
import { Product } from '../product/schema/product.shema';


@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
) {}

  // Step 1: Build user-product interaction matrix
  async buildUserProductMatrix() {
    const orders = await this.orderModel.find().lean();
    const reviews = await this.reviewModel.find().lean();
  
    const matrix: Record<string, Record<string, number>> = {};
  
    // B1: Ghi nhận các sản phẩm đã mua
    for (const order of orders) {
      const userId = order.userId.toString();
      if (!matrix[userId]) matrix[userId] = {};
  
      for (const item of order.products) {
        const productId = item.productId.toString();
        matrix[userId][productId] = 1; // chỉ mua thì điểm là 1
      }
    }
  
    // B2: Nếu user vừa mua vừa review => điểm là 1 + rate
    for (const review of reviews) {
      const userId = review.userId.toString();
      const productId = review.productId.toString();
      const rate = review.rate;
  
      // Chỉ xét review nếu user đã từng mua (bảo đảm đúng logic)
      if (matrix[userId] && matrix[userId][productId]) {
        matrix[userId][productId] += rate; // mua + review → điểm cao hơn
      }
    }
  
    return matrix;
  }
  

  // Step 2: Tính cosine similarity
  cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }

  // Step 3: Trả về danh sách productId được gợi ý
async getRecommendations(userId: string, topK = 3): Promise<Product[]> {
    const matrix = await this.buildUserProductMatrix();
    const allUsers = Object.keys(matrix);
    const currentUserVector = matrix[userId];
  
    if (!currentUserVector) return [];
  
    const currentProducts = Object.keys(currentUserVector);
    // Tính similarity giữa user hiện tại và các user khác
    const similarities: { userId: string; similarity: number }[] = [];
  
    for (const otherUserId of allUsers) {
      if (otherUserId === userId) continue;
  
      const otherVector = matrix[otherUserId];
      // Tạo vector với tất cả productIds chung
      const allProductIds = Array.from(
        new Set([...Object.keys(currentUserVector), ...Object.keys(otherVector)])
      );
  
      const vecA = allProductIds.map(pid => currentUserVector[pid] || 0);
      const vecB = allProductIds.map(pid => otherVector[pid] || 0);
      const similarity = this.cosineSimilarity(vecA, vecB);
  
      similarities.push({ userId: otherUserId, similarity });
    }
    // Chọn top K user tương đồng nhất
    const topUsers = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    // Tập hợp các sản phẩm mà user hiện tại chưa mua nhưng user tương tự đã có
    const productScores: Record<string, number> = {};
  
    for (const user of topUsers) {
      const otherProducts = matrix[user.userId];
      for (const productId in otherProducts) {
        if (!currentProducts.includes(productId)) {
          const score = otherProducts[productId] * user.similarity;
          productScores[productId] = (productScores[productId] || 0) + score;
        }
      }
    }
    // Sắp xếp theo điểm giảm dần
    const sortedProductIds = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .map(([productId]) => productId);
  
    // Lấy top K productId
    const topProductIds = sortedProductIds.slice(0, topK);// chỉ trả về top K sản phẩm
  
    const products = await this.productModel.find({ _id: { $in: topProductIds } }).lean();
  
    const productsOrdered = topProductIds
      .map(id => products.find(p => p._id.toString() === id))
      .filter(p => p !== undefined);
  
    return productsOrdered as Product[];
  }
  
}
