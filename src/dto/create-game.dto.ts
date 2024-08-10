import { IsInt, Min } from 'class-validator';

export class CreateGameDto {
  @IsInt()
  @Min(1, { message: 'Rows must be a positive integer.' })
  rows: number;

  @IsInt()
  @Min(1, { message: 'Columns must be a positive integer.' })
  columns: number;
}
