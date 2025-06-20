import { FastifyReply, FastifyRequest } from "fastify";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { CreateUserParams } from "../../../../domain/user/repositoryInterface/user-repository.interface";
import { RegisterUseCase } from "../../../../domain/user/use-cases/register";

interface RegisterBody extends CreateUserParams {
  avatarUrl?: string;
}

export class RegisterController {
  private authLogic: RegisterUseCase;
  private uploadsDir: string;

  constructor() {
    this.authLogic = new RegisterUseCase();
    this.uploadsDir = path.resolve(process.cwd(), "src/assets/usersAvatar");
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      console.error("Erro ao criar diretório de uploads:", error);
    }
  }

  private getFileExtension(mimetype: string): string {
    const mimeToExt: { [key: string]: string } = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };
    return mimeToExt[mimetype] || ".jpg";
  }

  private isValidImageType(mimetype: string): boolean {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validTypes.includes(mimetype);
  }

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: "Nenhum arquivo enviado" });
      }

      // Extrair campos do formulário
      const fields = data.fields;
      const userData: RegisterBody = {
        email: (fields.email as any)?.value?.toLowerCase() || "",
        name: (fields.name as any)?.value || "",
        password: (fields.password as any)?.value || "",
      };

      // Validar campos obrigatórios
      if (!userData.email || !userData.name || !userData.password) {
        return reply.code(422).send({
          error: "Email, nome e senha são obrigatórios",
        });
      }

      // Processar arquivo de imagem se existir
      if (data.file) {
        // Validar tipo de arquivo
        if (!this.isValidImageType(data.mimetype)) {
          return reply.code(422).send({
            error:
              "Tipo de arquivo inválido. Apenas imagens JPEG, PNG, GIF e WebP são permitidas.",
          });
        }

        // Gerar nome único para o arquivo
        const fileExtension = this.getFileExtension(data.mimetype);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(this.uploadsDir, fileName);

        // Salvar arquivo
        await pipeline(data.file, createWriteStream(filePath));

        // Adicionar URL do avatar aos dados do usuário
        userData.avatarUrl = `/assets/usersAvatar/${fileName}`;
      }

      const user = await this.authLogic.execute(userData);

      reply.send(user);
    } catch (error) {
      console.error("Erro no upload:", error);
      reply.code(500).send({ error: "Erro interno do servidor" });
    }
  };
}
