import {
  ApiError,
  ApiResponse,
  CreateReleaseDto,
  UpdateReleaseDto,
  QAStatus,
} from '@repo/types';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Get,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { ReleaseService } from './release.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { Release } from 'src/schemas/release.schema';
import type { RequestWithUser } from 'src/interfaces/request-user.interface';

@Controller('releases')
@UseGuards(AuthGuard)
export class ReleaseController {
  constructor(private readonly releasesService: ReleaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRelease(
    @Body() createReleaseDto: CreateReleaseDto,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Release, ApiError>> {
    return await this.releasesService.create(createReleaseDto, req.userId);
  }

  @Get('workspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async getReleasesByWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.releasesService.findByWorkspace(workspaceId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getReleaseById(@Param('id') id: string) {
    return await this.releasesService.findById(id);
  }
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateRelease(
    @Param('id') id: string,
    @Body() updateReleaseDto: UpdateReleaseDto,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Release, ApiError>> {
    return await this.releasesService.update(id, updateReleaseDto, req.userId);
  }
  @Put(':id/deploy')
  @HttpCode(HttpStatus.OK)
  async deployRelease(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Release, ApiError>> {
    return await this.releasesService.deploy(id, req.userId);
  }
  @Put(':id/qa')
  @HttpCode(HttpStatus.OK)
  async updateQAStatus(
    @Param('id') id: string,
    @Body('qaStatus') qaStatus: QAStatus,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Release, ApiError>> {
    return await this.releasesService.updateQAStatus(id, qaStatus, req.userId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRelease(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<null, ApiError>> {
    return await this.releasesService.delete(id, req.userId);
  }
}
