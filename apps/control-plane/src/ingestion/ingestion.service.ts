import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { hashApiKey } from "../api-keys/api-key.util";

@Injectable()
export class IngestionService {
  constructor(private readonly prisma: PrismaService) {}

  async validateApiKey(apiKey: string) {
    const keyHash = hashApiKey(apiKey);

    const apiKeyRecord = await this.prisma.apiKey.findFirst({
      where: {
        keyHash,
      },
      include: {
        project: true,
      },
    });

    if (!apiKeyRecord) {
      return { valid: false };
    }

    return {
      valid: true,
      project: {
        id: apiKeyRecord.project.id,
        name: apiKeyRecord.project.name,
        slug: apiKeyRecord.project.slug,
      },
      apiKey: {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        prefix: apiKeyRecord.prefix,
        revokedAt: apiKeyRecord.revokedAt,
      },
    };
  }
}