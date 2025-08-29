import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      order: { event_date: 'DESC' },
    });
  }

  async findAllForResponse(): Promise<Project[]> {
    return await this.projectRepository.find({
      order: { event_date: 'DESC' },
      select: [
        'id',
        'title',
        'description',
        'event_date',
        'created_date_time',
        'updated_date_time',
      ],
    });
  }

  async findById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`ID ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  async findByIdForResponse(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      select: [
        'id',
        'title',
        'description',
        'event_date',
        'created_date_time',
        'updated_date_time',
      ],
    });
    if (!project) {
      throw new NotFoundException(`ID ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findById(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findById(id);
    await this.projectRepository.remove(project);
  }
}
