import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { NotifyEmailDto } from './dto/mailing.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailingController {
  constructor(private readonly mailingService: MailingService) { }
  @UsePipes(new ValidationPipe())
  @EventPattern('mail_notify')
  async notify(@Payload() data: { email: string; subject: string; html: string }) {
    await this.mailingService.sendEmail(data);
  }
}
