import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { QueryEnterpriseDto } from './dto/query-enterprise.dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class EnterprisesService {
  constructor(private prisma: PrismaService) {}

  // Generar API Key único
  private generateApiKey(): string {
    const prefix = 'payme_';
    const randomPart = randomBytes(16).toString('hex');
    return `${prefix}${randomPart}`;
  }

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    try {
      const apiKey = this.generateApiKey();
      
      const enterprise = await this.prisma.enterprise.create({
        data: {
          ...createEnterpriseDto,
          businessName: createEnterpriseDto.business_name,
          contactEmail: createEnterpriseDto.contact_email,
          apiKey,
          status: 'ACTIVE',
        },
        select: {
          ruc: true,
          businessName: true,
          contactEmail: true,
          apiKey: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        status: 201,
        message: 'Enterprise created successfully',
        data: {
          ruc: enterprise.ruc,
          business_name: enterprise.businessName,
          contact_email: enterprise.contactEmail,
          api_key: enterprise.apiKey,
          status: enterprise.status,
          created_at: enterprise.createdAt.toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Enterprise with this RUC already exists');
        }
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryEnterpriseDto) {
    const page = parseInt(queryDto.page || '1');
    const size = parseInt(queryDto.size || '10');
    const skip = (page - 1) * size;

    // Construir filtros dinámicos
    const where: Prisma.EnterpriseWhereInput = {};

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    if (queryDto.search) {
      where.OR = [
        { ruc: { contains: queryDto.search } },
        { businessName: { contains: queryDto.search, mode: 'insensitive' } },
        { contactEmail: { contains: queryDto.search, mode: 'insensitive' } },
      ];
    }

    const [enterprises, total] = await Promise.all([
      this.prisma.enterprise.findMany({
        where,
        select: {
          ruc: true,
          businessName: true,
          contactEmail: true,
          status: true,
        },
        skip,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.enterprise.count({ where }),
    ]);

    return {
      status: 200,
      data: enterprises.map(enterprise => ({
        ruc: enterprise.ruc,
        business_name: enterprise.businessName,
        contact_email: enterprise.contactEmail,
        status: enterprise.status,
      })),
      pagination: {
        page,
        size,
        total,
      },
    };
  }

  async findOne(ruc: string) {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { ruc },
      select: {
        ruc: true,
        businessName: true,
        contactEmail: true,
        apiKey: true,
        status: true,
        createdAt: true,
      },
    });

    if (!enterprise) {
      throw new NotFoundException(`Enterprise with RUC ${ruc} not found`);
    }

    return {
      status: 200,
      data: {
        ruc: enterprise.ruc,
        business_name: enterprise.businessName,
        contact_email: enterprise.contactEmail,
        api_key: enterprise.apiKey,
        status: enterprise.status,
        created_at: enterprise.createdAt.toISOString(),
      },
    };
  }

  async update(ruc: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    try {
      // Primero verificar si la empresa existe
      const existingEnterprise = await this.prisma.enterprise.findUnique({
        where: { ruc },
      });

      if (!existingEnterprise) {
        throw new NotFoundException(`Enterprise with RUC ${ruc} not found`);
      }

      // Mapear campos del DTO al modelo de Prisma
      const updateData: any = {};
      if (updateEnterpriseDto.business_name) {
        updateData.businessName = updateEnterpriseDto.business_name;
      }
      if (updateEnterpriseDto.contact_email) {
        updateData.contactEmail = updateEnterpriseDto.contact_email;
      }
      if (updateEnterpriseDto.status) {
        updateData.status = updateEnterpriseDto.status;
      }

      const enterprise = await this.prisma.enterprise.update({
        where: { ruc },
        data: updateData,
        select: {
          ruc: true,
          businessName: true,
          contactEmail: true,
          apiKey: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        status: 200,
        message: 'Enterprise updated successfully',
        data: {
          ruc: enterprise.ruc,
          business_name: enterprise.businessName,
          contact_email: enterprise.contactEmail,
          api_key: enterprise.apiKey,
          status: enterprise.status,
          updated_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Enterprise with RUC ${ruc} not found`);
        }
      }
      throw error;
    }
  }

  async remove(ruc: string) {
    try {
      await this.prisma.enterprise.delete({
        where: { ruc },
      });

      return {
        status: 200,
        message: 'Enterprise deleted successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Enterprise with RUC ${ruc} not found`);
        }
      }
      throw error;
    }
  }

  // Regenerar API Key
  async regenerateApiKey(ruc: string) {
    try {
      const newApiKey = this.generateApiKey();
      
      const enterprise = await this.prisma.enterprise.update({
        where: { ruc },
        data: { apiKey: newApiKey },
        select: {
          ruc: true,
          businessName: true,
          apiKey: true,
        },
      });

      return {
        status: 200,
        message: 'API Key regenerated successfully',
        data: {
          ruc: enterprise.ruc,
          business_name: enterprise.businessName,
          api_key: enterprise.apiKey,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Enterprise with RUC ${ruc} not found`);
        }
      }
      throw error;
    }
  }

  // Método adicional para obtener estadísticas
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.enterprise.count(),
      this.prisma.enterprise.count({ where: { status: 'ACTIVE' } }),
      this.prisma.enterprise.count({ where: { status: 'INACTIVE' } }),
    ]);

    return {
      status: 200,
      data: {
        total,
        active,
        inactive,
        suspended: total - active - inactive,
      },
    };
  }
}