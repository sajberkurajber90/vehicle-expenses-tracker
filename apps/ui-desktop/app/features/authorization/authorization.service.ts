import type { IAuthorizationRepostory } from '~/features/authorization/authorization.repository';


export class AuthorizationService {
  constructor(private repository: IAuthorizationRepostory) {}

     async findRoleByUserId(userId: number) {
       return  await this.repository.findRoleByUserId(userId);
    }
}