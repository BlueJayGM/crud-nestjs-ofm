import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteUserDTO {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}