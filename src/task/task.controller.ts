import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('task')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiBody({type: CreateTaskDto})
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    console.log('req: ', req.user);
    return this.taskService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.taskService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
