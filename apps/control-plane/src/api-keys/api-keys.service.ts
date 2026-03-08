import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { generatePlainApiKey, getApiKeyPrefix, hashApiKey } from "./api-key.util";

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, createApiKeyDto: CreateApiKeyDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const plainKey = generatePlainApiKey();
    const keyHash = hashApiKey(plainKey);
    const prefix = getApiKeyPrefix(plainKey);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: createApiKeyDto.name,
        keyHash,
        prefix,
        projectId,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      key: plainKey,
      createdAt: apiKey.createdAt,
    };
  }

  async findAllByProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return this.prisma.apiKey.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
        revokedAt: true,
      },
    });
  }
}