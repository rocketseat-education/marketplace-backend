export interface UploadUserAvatarRequest {
  userId: number;
  file: {
    filename: string;
    mimetype: string;
    file: NodeJS.ReadableStream;
  };
}

export interface UploadUserAvatarResponse {
  filename: string;
  url: string;
  message: string;
}

export interface IUploadUserAvatarUseCase {
  execute(request: UploadUserAvatarRequest): Promise<UploadUserAvatarResponse>;
}
