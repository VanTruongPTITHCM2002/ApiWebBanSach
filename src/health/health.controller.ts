import { Controller } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('/api/v1/health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    // private readonly configService: CustomConfigService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}
}
