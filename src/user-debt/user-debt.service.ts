import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtStatusDto } from './dto/update-debt-status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserDebtService {
  constructor(private prisma: PrismaService) {}

  async getUserDebts(userDocument: string) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { document: userDocument },
    });

    if (!user) {
      throw new NotFoundException(`User with document ${userDocument} not found`);
    }

    const debts = await this.prisma.userDebt.findMany({
      where: { userDocument },
      include: {
        enterprise: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular deuda total
    const totalDebt = debts.reduce((sum, debt) => {
      return sum + Number(debt.debtAmount);
    }, 0);

    return {
      status: 200,
      data: debts.map(debt => ({
        user_document: debt.userDocument,
        enterprise_ruc: debt.enterpriseRuc,
        enterprise_name: debt.enterprise.businessName,
        debt_amount: Number(debt.debtAmount),
        due_date: debt.dueDate ? debt.dueDate.toISOString().split('T')[0] : null,
        status: debt.status,
        created_at: debt.createdAt.toISOString(),
      })),
      total_debt: Number(totalDebt.toFixed(2)),
    };
  }

  async createDebt(userDocument: string, createDebtDto: CreateDebtDto) {
    try {
      // Verificar que el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { document: userDocument },
      });

      if (!user) {
        throw new NotFoundException(`User with document ${userDocument} not found`);
      }

      // Verificar que la empresa existe
      const enterprise = await this.prisma.enterprise.findUnique({
        where: { ruc: createDebtDto.enterprise_ruc },
      });

      if (!enterprise) {
        throw new NotFoundException(`Enterprise with RUC ${createDebtDto.enterprise_ruc} not found`);
      }

      // Verificar si ya existe una deuda entre este usuario y empresa
      const existingDebt = await this.prisma.userDebt.findFirst({
        where: {
          userDocument,
          enterpriseRuc: createDebtDto.enterprise_ruc,
          status: {
            not: 'COMPLETED',
          },
        },
      });

      if (existingDebt) {
        throw new ConflictException('User already has an active debt with this enterprise');
      }

      // Crear la nueva deuda
      await this.prisma.userDebt.create({
        data: {
          userDocument,
          enterpriseRuc: createDebtDto.enterprise_ruc,
          debtAmount: createDebtDto.debt_amount,
          dueDate: createDebtDto.due_date ? new Date(createDebtDto.due_date) : null,
          status: createDebtDto.status || 'PENDING',
        },
      });

      // Retornar la lista actualizada de deudas
      return this.getUserDebts(userDocument);

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Debt already exists between this user and enterprise');
        }
      }
      throw error;
    }
  }

  async updateDebtStatus(
    userDocument: string, 
    enterpriseRuc: string, 
    updateDebtStatusDto: UpdateDebtStatusDto
  ) {
    try {
      // Verificar que la deuda existe
      const existingDebt = await this.prisma.userDebt.findFirst({
        where: {
          userDocument,
          enterpriseRuc,
        },
      });

      if (!existingDebt) {
        throw new NotFoundException(
          `Debt not found between user ${userDocument} and enterprise ${enterpriseRuc}`
        );
      }

      // Actualizar el status de la deuda
      await this.prisma.userDebt.updateMany({
        where: {
          userDocument,
          enterpriseRuc,
        },
        data: {
          status: updateDebtStatusDto.status,
        },
      });

      // Retornar la lista actualizada de deudas
      return this.getUserDebts(userDocument);

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Debt not found between user ${userDocument} and enterprise ${enterpriseRuc}`
          );
        }
      }
      throw error;
    }
  }

  async markDebtAsPaid(userDocument: string, enterpriseRuc: string) {
    return this.updateDebtStatus(userDocument, enterpriseRuc, { status: 'COMPLETED' });
  }

  async getAllDebts() {
    const debts = await this.prisma.userDebt.findMany({
      include: {
        user: {
          select: {
            document: true,
            type: true,
            email: true,
            phone: true,
          },
        },
        enterprise: {
          select: {
            ruc: true,
            businessName: true,
            contactEmail: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 200,
      data: debts.map(debt => ({
        id: debt.id,
        user_document: debt.userDocument,
        user_email: debt.user.email,
        user_phone: debt.user.phone,
        enterprise_ruc: debt.enterpriseRuc,
        enterprise_name: debt.enterprise.businessName,
        enterprise_contact: debt.enterprise.contactEmail,
        debt_amount: Number(debt.debtAmount),
        due_date: debt.dueDate ? debt.dueDate.toISOString().split('T')[0] : null,
        status: debt.status,
        created_at: debt.createdAt.toISOString(),
      })),
    };
  }

  async getDebtStatistics() {
    const [
      totalDebts,
      pendingDebts,
      completedDebts,
      overdueDebts,
      totalAmount,
      pendingAmount,
    ] = await Promise.all([
      this.prisma.userDebt.count(),
      this.prisma.userDebt.count({ where: { status: 'PENDING' } }),
      this.prisma.userDebt.count({ where: { status: 'COMPLETED' } }),
      this.prisma.userDebt.count({ where: { status: 'OVERDUE' } }),
      this.prisma.userDebt.aggregate({
        _sum: { debtAmount: true },
      }),
      this.prisma.userDebt.aggregate({
        where: { status: 'PENDING' },
        _sum: { debtAmount: true },
      }),
    ]);

    return {
      status: 200,
      data: {
        total_debts: totalDebts,
        pending_debts: pendingDebts,
        completed_debts: completedDebts,
        overdue_debts: overdueDebts,
        cancelled_debts: totalDebts - pendingDebts - completedDebts - overdueDebts,
        total_amount: Number(totalAmount._sum.debtAmount || 0),
        pending_amount: Number(pendingAmount._sum.debtAmount || 0),
        collection_rate: totalDebts > 0 ? ((completedDebts / totalDebts) * 100).toFixed(2) : 0,
      },
    };
  }
}