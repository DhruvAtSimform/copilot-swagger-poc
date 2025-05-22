import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { LoggerService } from './logger/logger.service';

enum ValidOptions {
  Welcome = 'WELCOME_MAIL',
  Delete = 'DELETE_MAIL',
}

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    try {
      SendGrid.setApiKey(this.config.get('SENDGRID_API_KEY'));
    } catch (error) {
      console.error({ error });
      loggerService.sendLog('error', error.message, 'Mailer');
    }
  }
  async sendMail({ type, payload }) {
    console.log({ type, payload });
    switch (type) {
      case ValidOptions.Welcome:
        // call this function when user create account
        return this.sendWelcomeMessage(payload.email, payload.userName);
      // break;

      case ValidOptions.Delete:
        //call the function when user delete account
        return this.sendDeleteMessage(payload.email, payload.userName);

      default:
        console.log('Got some unmatched type ' + type);
        break;
    }
  }

  async sendWelcomeMessage(email: string, userName: string) {
    console.log({ email });
    const mail = {
      to: email,
      Subject: 'Welcome to CosmoGeeks',
      from: this.config.get('MY_EMAIL'),
      text: `Welcome ${userName} to CosmoGeeks. We hope you will like the cosmogeeks community and contribute with your valuable thoughts and knowledge.`,
      html: `<h2>Welcome ${userName}!</h2><br/><h6>We hope you will like the cosmogeeks community and contribute with your valuable thoughts and knowledge.</h6>`,
    };
    try {
      const transport = await SendGrid.send(mail);
      console.log({ transport });
      return transport;
    } catch (error) {
      console.error(error);
      this.loggerService.sendLog(
        'error',
        error.message,
        'Mailer',
        `SendWelcomeMail fucntion failed.`,
      );
    }
  }

  async sendDeleteMessage(email: string, userName: string) {
    const mail = {
      to: email,
      Subject: 'Delete CosmoGeeks Account',
      from: this.config.get('MY_EMAIL'),
      text: `Goodbye ${userName}!. You currently deleted your cosmogeeks account. I hope the reason is not user experinece. Feel free to share a feedback.`,
      html: `<h2>Goodbye ${userName}!</h2><br/><h6>I hope the reason is not user experinece. Feel free to share a feedback.</h6>`,
    };
    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.error({ error });
      this.loggerService.sendLog(
        'error',
        error.message,
        'Mailer',
        `SendDeleteMail fucntion failed.`,
      );
    }
  }
}
