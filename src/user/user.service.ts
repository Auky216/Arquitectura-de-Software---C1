import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          status: 'ACTIVE',
        },
        select: {
          document: true,
          type: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        status: 201,
        message: 'User created successfully',
        data: {
          ...user,
          created_at: user.createdAt.toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this document already exists');
        }
      }
      throw error;
    }
  }

  async findAll(queryDto: QueryUserDto) {
    const page = parseInt(queryDto.page || '1');
    const size = parseInt(queryDto.size || '10');
    const skip = (page - 1) * size;

    // Construir filtros dinámicos
    const where: Prisma.UserWhereInput = {};

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    if (queryDto.type) {
      where.type = queryDto.type;
    }

    if (queryDto.search) {
      where.OR = [
        { document: { contains: queryDto.search } },
        { email: { contains: queryDto.search, mode: 'insensitive' } },
        { phone: { contains: queryDto.search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          document: true,
          type: true,
          phone: true,
          email: true,
          status: true,
        },
        skip,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      status: 200,
      data: users,
      pagination: {
        page,
        size,
        total,
      },
    };
  }

  async findOne(document: string) {
    const user = await this.prisma.user.findUnique({
      where: { document },
      select: {
        document: true,
        type: true,
        phone: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with document ${document} not found`);
    }

    return {
      status: 200,
      data: user,
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { document, ...updateData } = updateUserDto;

    try {
      // Primero verificar si el usuario existe
      const existingUser = await this.prisma.user.findUnique({
        where: { document },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with document ${document} not found`);
      }

      // Actualizar el usuario
      const user = await this.prisma.user.update({
        where: { document },
        data: updateData,
        select: {
          document: true,
          type: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        status: 200,
        message: 'User updated successfully',
        data: {
          ...user,
          updated_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with document ${document} not found`);
        }
      }
      throw error;
    }
  }

  async remove(document: string) {
    try {
      await this.prisma.user.delete({
        where: { document },
      });

      return {
        status: 200,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with document ${document} not found`);
        }
      }
      throw error;
    }
  }

  // Método adicional para obtener estadísticas
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { status: 'INACTIVE' } }),
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