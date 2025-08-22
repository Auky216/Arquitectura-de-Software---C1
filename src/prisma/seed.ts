import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Función para generar API Key
function generateApiKey(): string {
  const prefix = 'payme_';
  const randomPart = randomBytes(16).toString('hex');
  return `${prefix}${randomPart}`;
}

async function main() {
  console.log('🌱 Starting PayMe database seed...');

  try {
    // 1. Limpiar datos existentes (opcional - comentar si no quieres limpiar)
    console.log('🧹 Cleaning existing data...');
    await prisma.userDebt.deleteMany();
    await prisma.user.deleteMany();
    await prisma.enterprise.deleteMany();

    // 2. Crear Empresas (Entidades que cobran)
    console.log('🏢 Creating enterprises...');
    const enterprises = await Promise.all([
      prisma.enterprise.create({
        data: {
          ruc: '20123456789',
          businessName: 'Banco Nacional SAC',
          contactEmail: 'admin@banconacional.com.pe',
          apiKey: generateApiKey(),
          status: 'ACTIVE',
        },
      }),
      prisma.enterprise.create({
        data: {
          ruc: '20987654321',
          businessName: 'Financiera Lima SA',
          contactEmail: 'contacto@financieralima.com.pe',
          apiKey: generateApiKey(),
          status: 'ACTIVE',
        },
      }),
      prisma.enterprise.create({
        data: {
          ruc: '20555666777',
          businessName: 'Creditech Perú EIRL',
          contactEmail: 'cobranzas@creditech.pe',
          apiKey: generateApiKey(),
          status: 'ACTIVE',
        },
      }),
      prisma.enterprise.create({
        data: {
          ruc: '20111222333',
          businessName: 'MicroFin Solutions SAC',
          contactEmail: 'recovery@microfin.com.pe',
          apiKey: generateApiKey(),
          status: 'ACTIVE',
        },
      }),
      prisma.enterprise.create({
        data: {
          ruc: '20444555666',
          businessName: 'Prestamos Express EIRL',
          contactEmail: 'info@prestamosexp.pe',
          apiKey: generateApiKey(),
          status: 'INACTIVE',
        },
      }),
    ]);

    console.log(`✅ Created ${enterprises.length} enterprises`);

    // 3. Crear Usuarios (Deudores)
    console.log('👥 Creating users...');
    const users = await Promise.all([
      // Usuarios con múltiples deudas
      prisma.user.create({
        data: {
          document: '47654321',
          type: 'DNI',
          phone: '+51987654321',
          email: 'carlos.ramirez@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '70894512',
          type: 'DNI',
          phone: '+51987650001',
          email: 'maria.lopez@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '12345678',
          type: 'DNI',
          phone: '+51987650002',
          email: 'ana.garcia@example.com',
          status: 'ACTIVE',
        },
      }),
      // Usuarios adicionales para testing
      prisma.user.create({
        data: {
          document: '88776655',
          type: 'DNI',
          phone: '+51987650003',
          email: 'jose.martinez@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '11223344',
          type: 'DNI',
          phone: '+51987650004',
          email: 'lucia.torres@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '99887766',
          type: 'CE',
          phone: '+51987650005',
          email: 'roberto.silva@example.com',
          status: 'INACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '55443322',
          type: 'DNI',
          phone: '+51987650006',
          email: 'patricia.mendez@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '66554433',
          type: 'DNI',
          phone: '+51987650007',
          email: 'fernando.castro@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '77665544',
          type: 'CE',
          phone: '+51987650008',
          email: 'monica.vargas@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.user.create({
        data: {
          document: '33221100',
          type: 'DNI',
          phone: '+51987650009',
          email: 'diego.morales@example.com',
          status: 'ACTIVE',
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users`);

    // 4. Crear Deudas (Casos de prueba variados)
    console.log('💳 Creating debts...');
    
    // Deudas para testing de endpoints específicos
    const debts = await Promise.all([
      // Carlos Ramirez - Usuario con múltiples deudas (para testing principal)
      prisma.userDebt.create({
        data: {
          userDocument: '47654321',
          enterpriseRuc: '20123456789',
          debtAmount: 1500.50,
          dueDate: new Date('2024-12-31'),
          status: 'PENDING',
        },
      }),
      prisma.userDebt.create({
        data: {
          userDocument: '47654321',
          enterpriseRuc: '20987654321',
          debtAmount: 850.00,
          dueDate: new Date('2024-11-15'),
          status: 'PENDING',
        },
      }),

      // Maria Lopez - Deudas con diferentes estados
      prisma.userDebt.create({
        data: {
          userDocument: '70894512',
          enterpriseRuc: '20123456789',
          debtAmount: 2300.75,
          dueDate: new Date('2024-10-30'),
          status: 'PENDING',
        },
      }),
      prisma.userDebt.create({
        data: {
          userDocument: '70894512',
          enterpriseRuc: '20555666777',
          debtAmount: 1200.00,
          dueDate: new Date('2024-09-15'),
          status: 'COMPLETED',
        },
      }),

      // Ana Garcia - Deuda vencida
      prisma.userDebt.create({
        data: {
          userDocument: '12345678',
          enterpriseRuc: '20987654321',
          debtAmount: 750.25,
          dueDate: new Date('2024-08-01'),
          status: 'OVERDUE',
        },
      }),

      // Jose Martinez - Deuda cancelada
      prisma.userDebt.create({
        data: {
          userDocument: '88776655',
          enterpriseRuc: '20111222333',
          debtAmount: 500.00,
          dueDate: new Date('2024-12-01'),
          status: 'CANCELLED',
        },
      }),

      // Lucia Torres - Múltiples deudas pendientes
      prisma.userDebt.create({
        data: {
          userDocument: '11223344',
          enterpriseRuc: '20123456789',
          debtAmount: 3200.00,
          dueDate: new Date('2025-01-15'),
          status: 'PENDING',
        },
      }),
      prisma.userDebt.create({
        data: {
          userDocument: '11223344',
          enterpriseRuc: '20987654321',
          debtAmount: 1800.50,
          dueDate: new Date('2024-12-20'),
          status: 'PENDING',
        },
      }),
      prisma.userDebt.create({
        data: {
          userDocument: '11223344',
          enterpriseRuc: '20555666777',
          debtAmount: 950.75,
          dueDate: new Date('2024-11-30'),
          status: 'PENDING',
        },
      }),

      // Patricia Mendez - Sin fecha de vencimiento
      prisma.userDebt.create({
        data: {
          userDocument: '55443322',
          enterpriseRuc: '20111222333',
          debtAmount: 600.00,
          dueDate: null,
          status: 'PENDING',
        },
      }),

      // Fernando Castro - Deuda completada recientemente
      prisma.userDebt.create({
        data: {
          userDocument: '66554433',
          enterpriseRuc: '20123456789',
          debtAmount: 2800.00,
          dueDate: new Date('2024-10-15'),
          status: 'COMPLETED',
        },
      }),

      // Monica Vargas - Deuda vencida alta
      prisma.userDebt.create({
        data: {
          userDocument: '77665544',
          enterpriseRuc: '20987654321',
          debtAmount: 5500.00,
          dueDate: new Date('2024-07-01'),
          status: 'OVERDUE',
        },
      }),

      // Diego Morales - Deuda pequeña pendiente
      prisma.userDebt.create({
        data: {
          userDocument: '33221100',
          enterpriseRuc: '20555666777',
          debtAmount: 150.50,
          dueDate: new Date('2024-12-05'),
          status: 'PENDING',
        },
      }),
    ]);

    console.log(`✅ Created ${debts.length} debts`);

    // 5. Mostrar resumen de datos creados
    console.log('\n📊 DATABASE SEED SUMMARY:');
    console.log('========================');
    
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.enterprise.count(),
      prisma.userDebt.count(),
      prisma.userDebt.count({ where: { status: 'PENDING' } }),
      prisma.userDebt.count({ where: { status: 'COMPLETED' } }),
      prisma.userDebt.count({ where: { status: 'OVERDUE' } }),
      prisma.userDebt.count({ where: { status: 'CANCELLED' } }),
    ]);

    console.log(`👥 Users: ${stats[0]}`);
    console.log(`🏢 Enterprises: ${stats[1]}`);
    console.log(`💳 Total Debts: ${stats[2]}`);
    console.log(`⏳ Pending: ${stats[3]}`);
    console.log(`✅ Completed: ${stats[4]}`);
    console.log(`⚠️ Overdue: ${stats[5]}`);
    console.log(`❌ Cancelled: ${stats[6]}`);

    console.log('\n🧪 TEST CASES READY:');
    console.log('===================');
    console.log('• Carlos Ramirez (47654321) - 2 pending debts');
    console.log('• Maria Lopez (70894512) - 1 pending, 1 completed');
    console.log('• Lucia Torres (11223344) - 3 pending debts');
    console.log('• Ana Garcia (12345678) - 1 overdue debt');
    console.log('\n🎯 API TEST ENDPOINTS:');
    console.log('GET /api/v1/users/47654321/debts');
    console.log('POST /api/v1/users/47654321/debts');
    console.log('POST /api/v1/users/47654321/debts/20123456789');
    console.log('GET /api/v1/users?page=1&size=5');
    console.log('GET /api/v1/enterprises');
    console.log('GET /api/v1/debts/stats');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n🎉 PayMe database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('💥 Seed failed:', e);
    process.exit(1);
  });