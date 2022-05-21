import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create (createUserDto: CreateUserDto) {

    const user = await this.findOne(createUserDto.username);
    if (user) throw new ForbiddenException('User already exists!');

    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, salt);

    createUserDto.password = hash;

    const newUser = await this.usersRepository.save(createUserDto);

    delete newUser.password;

    return newUser;
  }

  async findAll(): Promise<User[] | undefined> {
    return await this.usersRepository.find({ select: ["firstName", "lastName", "username", "isActive"] });
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({id});
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({username});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) throw new BadRequestException('User ID not found');

    return await this.usersRepository.update(user.id, updateUserDto);

  }

  async delete(id: number) {
    const user = await this.findById(id);

    if (!user) throw new BadRequestException('User ID not found');

    return await this.usersRepository.remove(user);
  }

}
