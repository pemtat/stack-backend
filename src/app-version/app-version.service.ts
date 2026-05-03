import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CheckVersionDto } from './dto/check-version.dto';
import { UpsertVersionDto } from './dto/upsert-version.dto';

@Injectable()
export class AppVersionService {
  constructor(private readonly prisma: PrismaService) {}

  async checkVersion(query: CheckVersionDto) {
    const latestVersion = await this.prisma.appVersion.findUnique({
      where: { platform: query.platform },
    });

    if (!latestVersion) {
      throw new NotFoundException(`Platform ${query.platform} not found in version records`);
    }

    const updateAvailable = query.buildNumber < latestVersion.buildNumber;
    
    return {
      updateAvailable,
      forceUpdate: updateAvailable && latestVersion.forceUpdate,
      latestVersion: latestVersion.version,
      latestBuildNumber: latestVersion.buildNumber,
      releaseNotes: latestVersion.releaseNotes,
    };
  }

  async upsertVersion(dto: UpsertVersionDto) {
    return this.prisma.appVersion.upsert({
      where: { platform: dto.platform },
      update: {
        version: dto.version,
        buildNumber: dto.buildNumber,
        forceUpdate: dto.forceUpdate,
        releaseNotes: dto.releaseNotes,
      },
      create: {
        platform: dto.platform,
        version: dto.version,
        buildNumber: dto.buildNumber,
        forceUpdate: dto.forceUpdate,
        releaseNotes: dto.releaseNotes,
      },
    });
  }

  async getLatestVersion(platform: string) {
    const version = await this.prisma.appVersion.findUnique({
      where: { platform },
    });
    if (!version) {
      throw new NotFoundException(`Platform ${platform} not found in version records`);
    }
    return version;
  }
}
