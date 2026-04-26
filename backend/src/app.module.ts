import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContractorsModule } from './modules/contractors/contractors.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
      validate: validateEnv
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    ProjectsModule,
    ContractorsModule,
    BrokersModule,
    MilestonesModule,
    MaintenanceModule,
    DocumentsModule,
    DashboardModule,
    ReportsModule,
    AuditLogsModule
  ]
})
export class AppModule {}
