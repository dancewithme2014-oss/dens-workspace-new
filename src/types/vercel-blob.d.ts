declare module "@vercel/blob" {
  export type PutBlobResult = {
    url: string;
    downloadUrl: string;
    pathname: string;
    contentType: string;
    contentDisposition: string;
  };

  export function put(
    pathname: string,
    body: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Buffer | string,
    options: {
      access: "public";
      addRandomSuffix?: boolean;
      contentType?: string;
    },
  ): Promise<PutBlobResult>;
}
