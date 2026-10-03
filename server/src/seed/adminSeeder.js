// adminSeeder.mjs – Seed script to create a super admin user (ES module)
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../modules/auth/auth.model.js'; // adjust if path changes

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔗 Connected to MongoDB');

    // Check if a super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log('✅ Super admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Arsu123@', 12);
    const adminUser = new User({
      name: 'Super Admin',
      email: '0349ansari@gmail.com',
      passwordHash: hashedPassword,
      role: 'super_admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('🛠️ Super admin created successfully.');
  } catch (err) {
    console.error('❌ Error seeding admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

await seedAdmin();
