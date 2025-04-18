import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.Dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Put(':userId/shipping-infor')
  updateShippingInfo(@Param('userId') userId: string, @Body() data: any) {
    return this.userService.updateShippingInfo(userId, data);
  }
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
