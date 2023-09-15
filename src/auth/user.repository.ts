import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const existingUser = await this.findOne({ where: { username } });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = this.create({
      username,
      password,
    });

    await this.save(user);
  }
}
