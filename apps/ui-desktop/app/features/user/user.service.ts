import type { IUserRepository } from '~/features/user/user.repository';
import type {
  CreateUserSettingsInput,
  UpdateUserSettingsInput,
} from '~/features/user/user.schema';
import { z } from 'zod';

export class UserService {
  constructor(private userRepository: IUserRepository,
              private readonly validator: {
               createUserSettingsPayload: z.ZodType<CreateUserSettingsInput>;
               updateUserSettingsPayload: z.ZodType<UpdateUserSettingsInput>;
              }

              ) {}

  async findUserSettingsByUserId(userId: number) {
    return this.userRepository.findUserSettingsByUserId(userId);
  }

  async createUserSettings(payload: CreateUserSettingsInput) {
    const parse = this.validator.createUserSettingsPayload.safeParse(payload);
    if (!parse.success) {
      return {
        kind: 'payload-parse',
        message: 'Failed to parse create user settings payload',
        issues: z.flattenError(parse.error).fieldErrors,
      };
    }

    return this.userRepository.createUserSettings(payload);
  }

  async updateUserSettings(payload:UpdateUserSettingsInput) {
    const parse = this.validator.updateUserSettingsPayload.safeParse(payload);
    if (!parse.success) {
      return {
        kind: 'payload-parse',
        message: 'Failed to parse update user settings payload',
        issues: z.flattenError(parse.error).fieldErrors,
      };
    }
  }
}
