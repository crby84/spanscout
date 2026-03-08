import { IsString, MinLength } from "class-validator";

export class ValidateApiKeyDto {
  @IsString()
  @MinLength(10)
  apiKey!: string;
}