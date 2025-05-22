import { IsNotEmpty, IsNotEmptyObject, IsNotIn } from 'class-validator';

export class sendMailDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmptyObject()
  payload: { [keys: string]: string };
}
