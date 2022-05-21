import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

import * as pdf from 'html-pdf';

import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class CatsService {

  constructor(@InjectRepository(Cat) private catRepository: Repository<Cat>) {}

  create(createCatDto: CreateCatDto) {
    return this.catRepository.save(createCatDto);
  }

  async findAll() {
    return await this.catRepository.find();
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

  async catsToPdf() {

    const cats = await this.findAll();

    let page = `
      <h1>Hello World</h1>
    `;
    
    cats.forEach((cat) => {
      page += `Cat: ${cat.name}`
    });

    let options = {
      format: 'A4',
      orientation: "landscape",
      border: {
        top: "0.1in",
      },
      timeout: "120000"
    }

    let data = null;

    pdf.create(page, { format: 'A4', border: '0.1in', timeout: 120000}).toFile('pdfs/test.pdf', (err, result) => {
      if (err) console.log(err);

      data = fs.readFileSync('pdfs/test');

    });
    return data;
  }
}
