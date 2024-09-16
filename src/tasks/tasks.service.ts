import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/entities/user.entity';
import { Task } from './entities/task.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) { }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    // Check if a task with the same title and description already exists for the user
    const existingTask = await this.tasksRepository.findOne({
      where: {
        title,
        description,
        user: { id: user.id }, // Check based on the user's id
      },
    });

    // If the task already exists, return it
    if (existingTask) {
      return existingTask;
    }

    // Otherwise, create a new task
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user, // Assign the entire user object
    });

    return this.tasksRepository.save(task);
  }


  async getTasksForUser(user: User): Promise<Task[]> {

    if (user.role === 'ADMIN') {
      const tasks = await this.tasksRepository.find();  // Ensure you await the query
      return tasks;  // Return all tasks for the admin
    }


    return this.tasksRepository.find({
      where: {
        user: { id: user.id },  // Query using the user object
      },
    });
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        user: { id: user.id },  // Query using the user object
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  // Update task method
  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // Check if the user is the creator of the task or an admin
    if (task.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to update this task');
    }

    // If authorized, update the task
    //Object.assign(task, updateTaskDto);
    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
    }

    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<{ message: string }> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // Check if the user is the creator of the task or an admin
    if (task.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to delete this task');
    }
    await this.tasksRepository.remove(task);
    // Return a success message and task ID after deletion
    return { message: `Task with ID "${id}" has been successfully deleted` };
  }

  // Admin-only methods
  // async getAllTasks(): Promise<Task[]> {
  //   return this.tasksRepository.find();  // Admins can see all tasks
  // }

  // async deleteAnyTask(id: string): Promise<void> {
  //   const task = await this.tasksRepository.findOneBy({ id });
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }
  //   await this.tasksRepository.remove(task);
  // }
}
