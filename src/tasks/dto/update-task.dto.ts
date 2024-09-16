import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class UpdateTaskDto {
    @IsEnum(TaskStatus, {
        message: `Status must be one of the following: ${Object.values(TaskStatus).join(', ')}`,
    })
    status: TaskStatus;
}
