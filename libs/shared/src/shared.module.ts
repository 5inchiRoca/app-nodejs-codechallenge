import { Module, DynamicModule } from '@nestjs/common';
import { SharedService } from './shared.service';
import { KafkaService } from './kafka/kafka.service';
import { Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

interface SharedModuleOptions {
  clientId: string;
  groupId: string;
}

@Module({})
export class SharedModule {
  static register(options: SharedModuleOptions): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        ConfigModule.forRoot(),
        ClientsModule.registerAsync([
          {
            name: 'KAFKA_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: options.clientId,
                  brokers: [configService.get('KAFKA_BROKER') as string],
                },
                consumer: {
                  groupId: options.groupId,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [SharedService, KafkaService],
      exports: [SharedService, KafkaService, ClientsModule],
    };
  }
}
