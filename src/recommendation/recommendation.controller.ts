import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  async getUserRecommendations(@Param('userId') userId: string) {
    const productIds = await this.recommendationService.getRecommendations(userId);
    return productIds;
  }
}
