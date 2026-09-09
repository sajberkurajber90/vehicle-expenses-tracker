import { userRepository } from '@modules/app/admin/user.repository.ts';
import { userSchema, type IUser } from '@modules/app/admin/user.schema.ts';

export const getUserById = userRepository.getUserById.bind(userRepository);
export { userSchema };
export type IGetUserById = typeof getUserById;
export type { IUser };
