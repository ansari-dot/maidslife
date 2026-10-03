import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { TeamService } from './team.service.js';

export const createTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamService.createTeamMember(req.body);
  return res.status(201).json(new ApiResponse(201, member, 'Team member created successfully'));
});

export const getTeamMembers = asyncHandler(async (req, res) => {
  const { team, meta } = await TeamService.getAllTeamMembers(req.query);
  return res.status(200).json(new ApiResponse(200, team, 'Team members fetched successfully', meta));
});

export const getTeamMemberById = asyncHandler(async (req, res) => {
  const member = await TeamService.getTeamMemberById(req.params.id);
  return res.status(200).json(new ApiResponse(200, member, 'Team member retrieved successfully'));
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamService.updateTeamMember(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, member, 'Team member updated successfully'));
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  await TeamService.deleteTeamMember(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Team member deleted successfully'));
});
