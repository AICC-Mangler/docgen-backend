import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectListResponseDto,
  ProjectSingleResponseDto,
} from '../dto/project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('count/:id')
  async getProjectTotalByMemberId(@Param('id') memberId: number): Promise<any> {
    try {
      const result = await this.projectService.findByMemberIdTotal(memberId);
      return {
        success: true,
        data: result,
        message: `멤버 ${memberId} 의 총 프로젝트 개수를 조회`,
      };
    } catch (error) {
      console.error('컨트롤러 오류', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 개수 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getProjectByProjectId(
    @Param('id') projectId: number,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const project = await this.projectService.findByIdWithHashtags(projectId);
      return {
        success: true,
        data: this.projectService.toResponseDto(project),
        message: `프로젝트 ID ${projectId}의 프로젝트를 성공적으로 조회했습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('')
  async getProjectById(
    @Query('id') memberId: number,
  ): Promise<ProjectListResponseDto> {
    try {
      if (isNaN(memberId)) {
        throw new HttpException(
          '유효하지 않은 멤버 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== 멤버 ID ${memberId} 조회 요청 ===`);
      const projects =
        await this.projectService.findProjectsWithHashtagsByMemberIdRaw(
          memberId,
        );

      return {
        success: true,
        data: projects.map((project) =>
          this.projectService.toResponseDto(project),
        ),
        message: `멤버 ID ${memberId}의 프로젝트 리스트를 성공적으로 조회했습니다.`,
        total: projects.length,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 조회 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectSingleResponseDto> {
    try {
      console.log('=== 새 프로젝트 생성 요청 ===');
      console.log('입력 데이터:', createProjectDto);
      const newProject =
        await this.projectService.createProjectRaw(createProjectDto);
      const responseProject =
        await this.projectService.findProjectByIdWithHashtagsRaw(newProject.id);

      return {
        success: true,
        data: this.projectService.toResponseDto(responseProject),
        message: '새 프로젝트가 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 생성 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProject(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const projectId = id;
      if (isNaN(projectId)) {
        throw new HttpException(
          '유효하지 않은 프로젝트 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== 프로젝트 ID ${projectId} 수정 요청 ===`);
      const updatedProject = await this.projectService.update(
        projectId,
        updateProjectDto,
      );
      const responseProject =
        await this.projectService.findByIdWithTimelinesAndHashtags(
          updatedProject.id,
        );

      return {
        success: true,
        data: this.projectService.toResponseDto(responseProject),
        message: `ID ${projectId}인 프로젝트가 성공적으로 수정되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 수정 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteProject(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const projectId = parseInt(id, 10);
      if (isNaN(projectId)) {
        throw new HttpException(
          '유효하지 않은 프로젝트 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== 프로젝트 ID ${projectId} 삭제 요청 ===`);
      await this.projectService.remove(projectId);

      return {
        success: true,
        message: `ID ${projectId}인 프로젝트가 성공적으로 삭제되었습니다.`,
      };
    } catch (error) {
      console.error('컨트롤러 오류:', error);
      throw new HttpException(
        {
          success: false,
          message: `프로젝트 삭제 실패: ${error.message}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
