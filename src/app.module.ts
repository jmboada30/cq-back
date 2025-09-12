import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CommonModule } from './modules/common/common.module';
import { SharedModule } from './modules/shared/shared.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';
import { DropDownsModule } from './modules/drop-downs/drop-downs.module';
import { ProfilesModule } from './modules/profiles/profiles.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    SharedModule,
    PrismaModule,
    AuthModule,
    CaslModule,
    MenuItemsModule,
    DropDownsModule,
    ProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
