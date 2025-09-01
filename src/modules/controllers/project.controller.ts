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

  @Get(':id')
  async getProjectByProjectId(
    @Param('id') projectId: number,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const project = await this.projectService.findByIdForResponse(projectId);
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
        await this.projectService.findAllForResponseByMemberId(memberId);

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

  @Get('raw/:memberId')
  async getProjectsByMemberIdRaw(
    @Param('memberId') memberId: number,
  ): Promise<ProjectListResponseDto> {
    try {
      if (isNaN(memberId)) {
        throw new HttpException(
          '유효하지 않은 멤버 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== Raw SQL: 멤버 ID ${memberId} 조회 요청 ===`);
      const projects =
        await this.projectService.findProjectsWithHashtagsByMemberIdRaw(
          memberId,
        );

      return {
        success: true,
        data: projects,
        message: `Raw SQL로 멤버 ID ${memberId}의 프로젝트 리스트를 성공적으로 조회했습니다.`,
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

  @Get('raw/project/:id')
  async getProjectByIdRaw(
    @Param('id') projectId: number,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const project =
        await this.projectService.findProjectByIdWithHashtagsRaw(projectId);
      if (!project) {
        throw new HttpException(
          `프로젝트 ID ${projectId}를 찾을 수 없습니다.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: project,
        message: `Raw SQL로 프로젝트 ID ${projectId}의 프로젝트를 성공적으로 조회했습니다.`,
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

  @Post('raw')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProjectRaw(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectSingleResponseDto> {
    try {
      console.log('=== Raw SQL: 새 프로젝트 생성 요청 ===');
      console.log('입력 데이터:', createProjectDto);

      const newProject =
        await this.projectService.createProjectRaw(createProjectDto);

      return {
        success: true,
        data: newProject,
        message: 'Raw SQL로 새 프로젝트가 성공적으로 생성되었습니다.',
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
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const projectId = parseInt(id, 10);
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
      const responseProject = await this.projectService.findByIdForResponse(
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

  @Put('raw/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProjectRaw(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectSingleResponseDto> {
    try {
      const projectId = parseInt(id, 10);
      if (isNaN(projectId)) {
        throw new HttpException(
          '유효하지 않은 프로젝트 ID입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`=== Raw SQL: 프로젝트 ID ${projectId} 수정 요청 ===`);
      const updatedProject = await this.projectService.updateProjectRaw(
        projectId,
        updateProjectDto,
      );

      return {
        success: true,
        data: updatedProject,
        message: `Raw SQL로 ID ${projectId}인 프로젝트가 성공적으로 수정되었습니다.`,
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

  @Delete('raw/:id')
  async deleteProjectRaw(
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

      console.log(`=== Raw SQL: 프로젝트 ID ${projectId} 삭제 요청 ===`);
      await this.projectService.deleteProjectRaw(projectId);

      return {
        success: true,
        message: `Raw SQL로 ID ${projectId}인 프로젝트가 성공적으로 삭제되었습니다.`,
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
