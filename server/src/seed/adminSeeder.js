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

    const hashedPassword = await bcrypt.hash('Arsu123@', 12);
    
    // Upsert the user to ensure the role is set correctly even if they already exist
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      {
        $set: {
          name: 'System Admin',
          passwordHash: hashedPassword,
          role: 'admin',
          isActive: true,
          isEmailVerified: true,
        }
      },
      { upsert: true, new: true }
    );

    console.log('🛠️ Admin user verified and updated successfully.');
  } catch (err) {
    console.error('❌ Error seeding admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

await seedAdmin();
