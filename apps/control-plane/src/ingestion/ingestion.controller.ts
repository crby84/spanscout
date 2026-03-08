import { Body, Controller, Post } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";
import { ValidateApiKeyDto } from "./dto/validate-api-key.dto";

@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post("validate-key")
  validateKey(@Body() validateApiKeyDto: ValidateApiKeyDto) {
    return this.ingestionService.validateApiKey(validateApiKeyDto.apiKey);
  }
}