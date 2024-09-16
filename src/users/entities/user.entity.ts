import { Task } from 'src/tasks/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
    role: string;

    // This is the reverse relationship (One User can have many Tasks)
    @OneToMany(() => Task, task => task.user)
    tasks: Task[];  // <-- Define the tasks property here
}
