import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { AuthService } from './auth.service.js';
import { env } from '../../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  domain: env.NODE_ENV === 'production' ? '.maidslife.com' : undefined,
};

export const signup = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.signup(req.body);
  return res
    .status(201)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/v1/auth/refresh' })
    .json(new ApiResponse(201, { user }, 'User registered successfully.'));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await AuthService.verifyEmail(req.body.token);
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Email verified successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  return res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/v1/auth/refresh' })
    .json(new ApiResponse(200, { user }, 'Login successful'));
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken, refreshToken, user } = await AuthService.refreshToken(incomingRefreshToken);

  return res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/v1/auth/refresh' })
    .json(new ApiResponse(200, { user }, 'Token refreshed successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await AuthService.logout(req.user._id);
  }

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', { ...cookieOptions, path: '/api/v1/auth/refresh' })
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'Current user retrieved'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  return res.status(200).json(new ApiResponse(200, {}, 'Password reset email sent if account exists'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.newPassword);
  return res.status(200).json(new ApiResponse(200, {}, 'Password reset successfully'));
});
