import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const existingProject = await this.prisma.project.findUnique({
      where: { slug: createProjectDto.slug },
    });

    if (existingProject) {
      throw new ConflictException("Project slug already exists");
    }

    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        slug: createProjectDto.slug,
        description: createProjectDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return project;
  }

  async getOnboarding(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        apiKeys: {
          orderBy: { createdAt: "desc" },
          select: {
            name: true,
            prefix: true,
            createdAt: true,
            revokedAt: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const tracesEndpoint = 
    process.env.SPANSCOUT_PUBLIC_TRACES_ENDPOINT ||
    "http://localhost:3002/v1/traces";

    return {
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
      },
      ingestion: {
        tracesEndpoint,
        headerName: "x-spanscout-api-key",
      },
      apiKeys: project.apiKeys.map((apiKey) => ({
        name: apiKey.name,
        prefix: apiKey.prefix,
        createdAt: apiKey.createdAt,
        revokedAt: apiKey.revokedAt,
      })),
      examples: {
        env: {
          OTEL_SERVICE_NAME: "your-service-name",
          SPANSCOUT_API_KEY: "your_api_key_here",
          SPANSCOUT_TRACES_ENDPOINT: tracesEndpoint,
        },
        code: {
          imports: [
            'import "dotenv/config";',
            'import "@spanscout/node/register";',
          ],
        },
      },
    };
  }
}