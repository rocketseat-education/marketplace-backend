import { pipeline } from "stream";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  IUploadUserAvatarUseCase,
  UploadUserAvatarRequest,
  UploadUserAvatarResponse,
} from "../repositoryInterface/upload-user-avatar.interface";
import { UserAvatarRepository } from "../../../infra/database/typeorm/market-place/repositories/user-avatar.repository";

const pump = promisify(pipeline);

export class UploadUserAvatarUseCase implements IUploadUserAvatarUseCase {
  private userAvatarRepository: UserAvatarRepository;

  constructor() {
    this.userAvatarRepository = new UserAvatarRepository();
  }

  async execute(
    request: UploadUserAvatarRequest
  ): Promise<UploadUserAvatarResponse> {
    const { userId, file } = request;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        "Formato de arquivo não suportado. Use JPEG, PNG, GIF ou WebP"
      );
    }

    try {
      const fileExtension = path.extname(file.filename || "");
      const fileName = `${randomUUID()}${fileExtension}`;

      const uploadDir = path.join(process.cwd(), "src/assets/images/avatars");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/assets/images/avatars/${fileName}`;

      await pump(file.file, fs.createWriteStream(filePath));

      const existingAvatar = await this.userAvatarRepository.findByUserId(
        userId
      );

      let savedAvatar;
      if (existingAvatar) {
        await this.removeOldAvatarFile(existingAvatar.url);

        savedAvatar = await this.userAvatarRepository.update({
          id: existingAvatar.id,
          url: fileUrl,
          userId,
        });
      } else {
        savedAvatar = await this.userAvatarRepository.create({
          url: fileUrl,
          userId,
        });
      }

      return {
        filename: fileName,
        url: savedAvatar.url,
        message: "Avatar atualizado com sucesso",
      };
    } catch (error) {
      const fileName = `${randomUUID()}${path.extname(file.filename || "")}`;
      const filePath = path.join(
        process.cwd(),
        "src/assets/images/avatars",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      throw new Error(
        `Falha ao fazer upload do avatar: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  private async removeOldAvatarFile(oldUrl: string): Promise<void> {
    try {
      const fileName = path.basename(oldUrl);
      const filePath = path.join(
        process.cwd(),
        "src/assets/images/avatars",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn("Não foi possível remover o arquivo antigo:", error);
    }
  }
}
