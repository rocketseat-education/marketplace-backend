import { UserAvatar } from "../../entities/UserAvatar";

export interface CreateUserAvatarParams {
  url: string;
  userId: number;
}

export interface UpdateUserAvatarParams extends CreateUserAvatarParams {
  id: number;
}

export interface IUserAvatarRepository {
  findByUserId(userId: number): Promise<UserAvatar | null>;
  create(data: CreateUserAvatarParams): Promise<UserAvatar>;
  update(data: UpdateUserAvatarParams): Promise<UserAvatar>;
  save(avatar: UserAvatar): Promise<UserAvatar>;
}
