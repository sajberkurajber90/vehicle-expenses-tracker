import { userRepository } from '@modules/app/admin/user.repository.ts';

export const getUserById = userRepository.getUserById.bind(userRepository);
export type IGetUserById = typeof getUserById;
