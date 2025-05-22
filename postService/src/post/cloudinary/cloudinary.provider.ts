import { v2, ConfigOptions } from 'cloudinary';

// think this as a factory - yep just like that.
// it's build an instance of your config and return to service
// for use.

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: process.env.CLD_CLOUD_NAME,
      api_key: process.env.CLD_API_KEY,
      api_secret: process.env.CLD_API_SECRET,
    });
  },
};
