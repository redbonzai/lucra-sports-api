import { IsUUID } from 'class-validator';

export class FindOneGameParams {
  @IsUUID()
  id: string;
}
