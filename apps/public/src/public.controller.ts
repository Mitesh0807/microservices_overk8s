import { Controller } from '@nestjs/common';
import { PublicService } from './public.service';
@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}
}
