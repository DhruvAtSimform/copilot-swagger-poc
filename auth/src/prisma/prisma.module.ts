import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// here we have provided the prismaService into providers array
// But it is not accessible for other modules and their services.
// To do so we have to export the service in exports array. Our prismaModule is a connection to the
// database. It's gonna be used in most of module. So instead of importing it manually, lets make it
// globally availabe using @Global decorator.

// @Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
