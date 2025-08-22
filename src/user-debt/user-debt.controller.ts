import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UserDebtService } from './user-debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtStatusDto } from './dto/update-debt-status.dto';

@Controller()
export class UserDebtController {
  constructor(private readonly userDebtService: UserDebtService) {}

  // GET /users/{document}/debts -> lista de deudas del usuario
  @Get('users/:document/debts')
  @HttpCode(HttpStatus.OK)
  getUserDebts(@Param('document') document: string) {
    return this.userDebtService.getUserDebts(document);
  }

  // POST /users/{document}/debts -> registrar nueva deuda
  @Post('users/:document/debts')
  @HttpCode(HttpStatus.OK)
  createDebt(
    @Param('document') document: string,
    @Body() createDebtDto: CreateDebtDto,
  ) {
    return this.userDebtService.createDebt(document, createDebtDto);
  }

  // POST /users/{document}/debts/{ruc_enterprise} -> marcar una deuda como pagada
  @Post('users/:document/debts/:ruc_enterprise')
  @HttpCode(HttpStatus.OK)
  markDebtAsPaid(
    @Param('document') document: string,
    @Param('ruc_enterprise') rucEnterprise: string,
  ) {
    return this.userDebtService.markDebtAsPaid(document, rucEnterprise);
  }

  // PATCH /users/{document}/debts/{ruc_enterprise} -> actualizar status de deuda
  @Patch('users/:document/debts/:ruc_enterprise')
  @HttpCode(HttpStatus.OK)
  updateDebtStatus(
    @Param('document') document: string,
    @Param('ruc_enterprise') rucEnterprise: string,
    @Body() updateDebtStatusDto: UpdateDebtStatusDto,
  ) {
    return this.userDebtService.updateDebtStatus(
      document,
      rucEnterprise,
      updateDebtStatusDto,
    );
  }

  // GET /debts -> todas las deudas (para administración del call center)
  @Get('debts')
  @HttpCode(HttpStatus.OK)
  getAllDebts() {
    return this.userDebtService.getAllDebts();
  }

  // GET /debts/stats -> estadísticas de deudas
  @Get('debts/stats')
  @HttpCode(HttpStatus.OK)
  getDebtStatistics() {
    return this.userDebtService.getDebtStatistics();
  }
}