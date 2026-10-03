import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ReportsService } from './reports.service.js';

export const getOverviewReport = asyncHandler(async (req, res) => {
  const data = await ReportsService.getOverview();
  return res.status(200).json(new ApiResponse(200, data, 'Overview telemetry fetched'));
});

export const getRevenueReport = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const data = await ReportsService.getRevenueStats(days);
  return res.status(200).json(new ApiResponse(200, data, 'Revenue trend report fetched'));
});

export const getByServiceReport = asyncHandler(async (req, res) => {
  const data = await ReportsService.getRevenueByService();
  return res.status(200).json(new ApiResponse(200, data, 'Revenue by service report fetched'));
});

export const getByAreaReport = asyncHandler(async (req, res) => {
  const data = await ReportsService.getRevenueByArea();
  return res.status(200).json(new ApiResponse(200, data, 'Revenue by area report fetched'));
});

export const getCleanerPerformanceReport = asyncHandler(async (req, res) => {
  const data = await ReportsService.getCleanerPerformance();
  return res.status(200).json(new ApiResponse(200, data, 'Cleaner performance report fetched'));
});
