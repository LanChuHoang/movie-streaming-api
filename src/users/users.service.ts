import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'username1',
      email: 'email@email.com',
      password: 'password',
    },
    {
      userId: 2,
      username: 'username2',
      email: 'email@email.com',
      password: 'password',
    },
  ];

  async findOne(username: string) {
    return this.users.find((u) => u.username === username);
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number) {
    return this.users.find((u) => u.userId === id);
  }
}
