import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {

  constructor(@InjectRepository(Cat) private catRepository: Repository<Cat>) {}

  create(createCatDto: CreateCatDto) {
    return this.catRepository.save(createCatDto);
  }

  findAll() {
    return this.catRepository.find();
  }

  findOne(id: number) {
    return this.catRepository.findOne({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.findOne(id);

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    return this.catRepository.update({ id }, updateCatDto);
  }

  remove(id: number) {
    return this.catRepository.delete({ id });
  }
}
