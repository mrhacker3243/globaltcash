const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkDatabase() {
  console.log('🔍 Checking Railway Database Connection...\n');
  
  try {
    // Test connection with timeout
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Connected successfully!\n');
    
    // Check if database is accessible
    console.log('2️⃣ Checking database accessibility...');
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('   ✅ Database is accessible!');
    console.log('   Server time:', result[0].now, '\n');
    
    // Count users
    console.log('3️⃣ Checking users table...');
    const userCount = await prisma.user.count();
    console.log(`   ✅ Found ${userCount} user(s) in database\n`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found! You need to run: npx prisma db seed\n');
    } else {
      // List all users
      console.log('4️⃣ Listing all users:');
      const users = await prisma.user.findMany({
        select: {
          email: true,
          role: true,
          name: true,
          createdAt: true
        }
      });
      
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role})`);
        console.log(`      Name: ${user.name || 'Not set'}`);
        console.log(`      Created: ${user.createdAt.toLocaleDateString()}\n`);
      });
    }
    
    console.log('✅ All checks passed! Database is working correctly.\n');
    console.log('📝 You can login with:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin\n');
    
  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    console.error('\n🔧 Possible solutions:');
    console.error('   1. Check if Railway database is running');
    console.error('   2. Verify DATABASE_URL in .env file');
    console.error('   3. Check if your IP is whitelisted in Railway');
    console.error('   4. Try running: npx prisma db push');
    console.error('   5. Then run: npx prisma db seed\n');
    
    if (error.code === 'P1001') {
      console.error('⚠️  Connection timeout - Railway database might be sleeping or unreachable\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
