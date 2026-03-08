import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@Controller("projects/:projectId/api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(
    @Param("projectId") projectId: string,
    @Body() createApiKeyDto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(projectId, createApiKeyDto);
  }

  @Get()
  findAll(@Param("projectId") projectId: string) {
    return this.apiKeysService.findAllByProject(projectId);
  }
}