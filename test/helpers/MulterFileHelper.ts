type MulterHelperFilePayload = {
  fieldname: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  buffer: Buffer;
  size?: number;
};

export const MulterHelperFile = {
  toMulter(payload: MulterHelperFilePayload): Express.Multer.File {
    const file = {
      ...payload,
    } as Express.Multer.File;

    return file;
  },
};
