import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

const USERNAME_REGEX = /^[a-zA-Z0-9]{6,14}$/;
const PASSWORD_REGEX = /^[^\s]{8,}$/;

export class CreateUserDto {
  @Matches(USERNAME_REGEX, {
    message:
      'username must be 6-14 characters long and can only contain letters and numbers',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(PASSWORD_REGEX, {
    message:
      'password must have at least 8 characters and cannot contain spaces',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
