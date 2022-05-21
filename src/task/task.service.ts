import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {

  constructor( @InjectRepository(Task) private taskRepository: Repository<Task>) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {

    const user = await getRepository(User).findOne({id: userId});

    const task = this.taskRepository.create();
    task.completed = createTaskDto.completed;
    task.description = createTaskDto.description;
    task.name = createTaskDto.name;
    task.user = user;

    return await this.taskRepository.save(task);
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    return await this.taskRepository.findOne({id});
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    console.log(id);

    const user = await getRepository(User).findOne({id: userId});

    if (!user) throw new BadRequestException('User not found.');

    const task = await this.taskRepository.findOne( {where: {id: id}, relations: ['user'] });

    if (task.user.id == user.id) {
      return this.taskRepository.update({id}, updateTaskDto);
    } else {
      throw new BadRequestException('Owner invalidate');
    }
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
