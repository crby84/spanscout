import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { ApiKeysModule } from "./api-keys/api-keys.module";
import { IngestionModule } from "./ingestion/ingestion.module";

@Module({
  imports: [PrismaModule, ProjectsModule, ApiKeysModule, IngestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}