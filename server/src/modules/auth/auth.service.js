import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from './auth.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateTokens.js';
import { sendEmail } from '../../config/mailer.js';
import { formatUserDTO } from './auth.dto.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export class AuthService {
  static async signup({ name, email, password, role }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: role || 'customer',
      isEmailVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: formatUserDTO(user),
      accessToken,
      refreshToken,
    };
  }

  static async verifyEmail(token) {
    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: Date.now() },
    }).select('+emailVerifyToken +emailVerifyExpires');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired email verification token');
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    return formatUserDTO(user);
  }

  static async login({ email, password }) {
    let user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

  

    if (!user) {
      throw new ApiError(401, 'Invalid email or password credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password credentials');
    }

    if (!user.isEmailVerified && env.NODE_ENV === 'production') {
      throw new ApiError(403, 'Email is not verified. Please check your inbox.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Contact administrator.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    user.refreshTokenHash = refreshTokenHash;
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: formatUserDTO(user),
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token missing');
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id).select('+refreshTokenHash');

      if (!user || !user.refreshTokenHash) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        throw new ApiError(401, 'Refresh token reused or invalid');
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: formatUserDTO(user),
      };
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  static async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return true silently for security
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your Maidslife Admin password',
      html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    return true;
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokenHash = undefined; // Invalidate all active sessions
    await user.save();

    return true;
  }
}
