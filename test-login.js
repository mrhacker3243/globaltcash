const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log('\n📊 Users in database:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.name || 'No name'}`);
    });
    
    // Test login with a specific user
    if (users.length > 0) {
      const testEmail = users[0].email;
      console.log(`\n🔐 Testing login for: ${testEmail}`);
      
      const user = await prisma.user.findUnique({
        where: { email: testEmail }
      });
      
      if (user) {
        console.log('✅ User found in database');
        console.log('   User ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Role:', user.role);
        console.log('   Has password:', user.password ? 'Yes' : 'No');
        console.log('   Password hash length:', user.password?.length || 0);
        
        // Test password comparison (you'll need to provide the actual password)
        console.log('\n💡 To test password, you need to know the actual password');
        console.log('   Password hash starts with:', user.password?.substring(0, 10));
      }
    } else {
      console.log('\n⚠️  No users found in database!');
      console.log('   You need to create a user first.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
