import { ConfigService } from '@nestjs/config';
import { v2, ConfigOptions } from 'cloudinary';

// think this as a factory - yep just like that.
// it's build an instance of your config and return to service
// for use.

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: configService.get('CLD_CLOUD_NAME'),
      api_key: configService.get('CLD_API_KEY'),
      api_secret: configService.get('CLD_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
