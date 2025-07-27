import { Repository } from "typeorm";
import {
  CreateUserAvatarParams,
  IUserAvatarRepository,
  UpdateUserAvatarParams,
} from "./interfaces/user-avatar.interface";
import { UserAvatar } from "../entities/UserAvatar";
import { MarketPlaceDataSource } from "../data-source";

export class UserAvatarRepository implements IUserAvatarRepository {
  private repository: Repository<UserAvatar>;

  constructor() {
    this.repository = MarketPlaceDataSource.getRepository(UserAvatar);
  }

  async findByUserId(userId: number): Promise<UserAvatar | null> {
    return await this.repository.findOne({
      where: { userId },
    });
  }

  async create(data: CreateUserAvatarParams): Promise<UserAvatar> {
    const avatar = this.repository.create(data);
    return await this.repository.save(avatar);
  }

  async update(data: UpdateUserAvatarParams): Promise<UserAvatar> {
    await this.repository.update(data.id, {
      url: data.url,
      userId: data.userId,
    });

    const updatedAvatar = await this.repository.findOne({
      where: { id: data.id },
    });

    if (!updatedAvatar) {
      throw new Error("Avatar não encontrado após atualização");
    }

    return updatedAvatar;
  }

  async save(avatar: UserAvatar): Promise<UserAvatar> {
    return await this.repository.save(avatar);
  }
}
