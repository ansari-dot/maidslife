import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { SettingsService } from './settings.service.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.getSettings();
  return res.status(200).json(new ApiResponse(200, settings, 'Settings retrieved successfully'));
});

export const updateGeneralSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettingsSection('general', req.body);
  return res.status(200).json(new ApiResponse(200, settings, 'General settings updated'));
});

export const updateBusinessSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettingsSection('business', req.body);
  return res.status(200).json(new ApiResponse(200, settings, 'Business settings updated'));
});

export const updateNotificationSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettingsSection('notifications', req.body);
  return res.status(200).json(new ApiResponse(200, settings, 'Notification settings updated'));
});

export const updateSecuritySettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettingsSection('security', req.body);
  return res.status(200).json(new ApiResponse(200, settings, 'Security settings updated'));
});
