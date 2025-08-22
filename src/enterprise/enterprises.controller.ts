import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
// Update the import path if your DTOs are in a different folder, for example:
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { QueryEnterpriseDto } from './dto/query-enterprise.dto';
// Or ensure that './dto/index.ts' exists and exports all DTOs

@Controller('enterprises')
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  // GET /enterprises -> lista de empresas
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryDto: QueryEnterpriseDto) {
    return this.enterprisesService.findAll(queryDto);
  }

  // GET /enterprises/{ruc} -> detalle de la empresa
  @Get(':ruc')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('ruc') ruc: string) {
    return this.enterprisesService.findOne(ruc);
  }

  // POST /enterprises -> crear empresa
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterprisesService.create(createEnterpriseDto);
  }

  // PUT /enterprises/{ruc} -> actualizar empresa
  @Put(':ruc')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('ruc') ruc: string,
    @Body() updateEnterpriseDto: UpdateEnterpriseDto,
  ) {
    return this.enterprisesService.update(ruc, updateEnterpriseDto);
  }

  // DELETE /enterprises/{ruc} -> eliminar empresa
  @Delete(':ruc')
  @HttpCode(HttpStatus.OK)
  remove(@Param('ruc') ruc: string) {
    return this.enterprisesService.remove(ruc);
  }

  // PATCH /enterprises/{ruc}/regenerate-api-key -> regenerar API key
  @Patch(':ruc/regenerate-api-key')
  @HttpCode(HttpStatus.OK)
  regenerateApiKey(@Param('ruc') ruc: string) {
    return this.enterprisesService.regenerateApiKey(ruc);
  }

  // GET /enterprises/stats/summary -> estadísticas
  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  getStats() {
    return this.enterprisesService.getStats();
  }
}