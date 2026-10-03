// deleteAdmin.js – removes the seeded super admin and then recreates it
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../modules/auth/auth.model.js';

dotenv.config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔗 Connected to MongoDB');

    // Delete any existing super admin (by role or email)
    const deleteResult = await User.deleteMany({ role: 'super_admin' });
    console.log('🗑️ Deleted super admin(s):', deleteResult.deletedCount);

    // Re‑create the admin with the same credentials as in the seed script
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash('Arsu123@', 12);
    const adminUser = new User({
      name: 'Super Admin',
      email: '0349ansari@gmail.com',
      passwordHash: hashedPassword,
      role: 'super_admin',
      isActive: true,
    });
    await adminUser.save();
    console.log('🛠️ Super admin recreated successfully');
  } catch (err) {
    console.error('❌ Error resetting admin:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

await resetAdmin();
