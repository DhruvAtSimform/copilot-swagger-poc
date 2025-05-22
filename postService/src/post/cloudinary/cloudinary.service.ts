import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'fs';

// well this is a bit awkward, but for good reason.
// we are here using upload_stream not regular upload function to keep our application
// performant. by using stream we can support large profile pic without any Memory trouble to our
// server.

@Injectable()
export class CloudinaryService {
  async uploadImage(
    filePath: string,
    uid: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'posts',
          public_id: `${uid}-post`,
          transformation: [
            { height: 540, width: 960, crop: 'limit' },
            { fetch_format: 'png' },
            { quality: 'auto:best' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      const rStream = createReadStream(filePath);
      rStream.pipe(upload);
    });
  }

  async deleteImage(uid: string): Promise<{ result: string }> {
    console.log(`${uid}-post`);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        `posts/${uid}-post`,
        { resource_type: 'image' },
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        },
      );
    });
  }
}
