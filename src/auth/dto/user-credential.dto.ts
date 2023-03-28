import { IsNotEmpty, IsString } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
