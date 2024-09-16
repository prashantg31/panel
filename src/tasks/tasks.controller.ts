import { Controller, Post, Get, Body, Param, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/role.enum';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = req['user'] as User;  // Authenticated user will be available in request
    return this.tasksService.createTask(createTaskDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasksForUser(@Req() req: Request) {
    const user = req['user'] as User;
    return this.tasksService.getTasksForUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTaskById(@Param('id') id: string, @Req() req: any) {
    const user: User = req.user;
    return this.tasksService.getTaskById(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any
  ) {
    const user: User = req.user;
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Req() req: any) {
    const user: User = req.user;
    return this.tasksService.deleteTask(id, user);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)  // Only users with ADMIN role can access
  // @Get('admin/all')
  // async getAllTasks() {
  //   return this.tasksService.getAllTasks();
  // }

  // @Delete('admin/:id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  // async deleteAnyTask(@Param('id') id: string) {
  //   return this.tasksService.deleteAnyTask(id);
  // }
}
