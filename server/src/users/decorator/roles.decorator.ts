import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../constant/roles.constant';

export const ROELS_KEY = 'user_roles';

export const Roles = (role: RolesEnum) => SetMetadata(ROELS_KEY, role);
