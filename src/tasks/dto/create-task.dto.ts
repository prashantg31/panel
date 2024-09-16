import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum'; // Make sure this enum is correctly defined.

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatus)
    status: TaskStatus;  // You can default it to `pending` in your service if needed.
}
