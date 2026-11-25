import { UserRepository } from '@modules/app/user/user.repository.ts';
import db from '@infrastructure/db/index.ts';
import {
  CreateUserSettingsPayload,
  UpdateUserSettingsPayload,
} from '@modules/app/user/user.schema.ts';

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async findUserSettingsByUserId(userId: number) {
    return await this.repository.findUserSettingsByUserId(userId);
  }

  async createUserSettings(payload: CreateUserSettingsPayload) {
    return this.repository.createUserSettings(payload);
  }

  async updateUserSettings(payload: UpdateUserSettingsPayload) {
    return this.repository.updateUserSettings(payload);
  }
}

export type IUserService = UserService;
export const userService = new UserService(new UserRepository(db));
