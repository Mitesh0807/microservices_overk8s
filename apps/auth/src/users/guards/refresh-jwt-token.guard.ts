import { AuthGuard } from '@nestjs/passport';

export class RefreshJwtTokenGuard extends AuthGuard('jwt-refresh') {}
