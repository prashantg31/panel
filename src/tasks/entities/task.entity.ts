import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: ['pending', 'in_progress', 'completed'], default: 'pending' })
    status: string;

    // Many tasks can belong to one user
    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    user: User;
}
