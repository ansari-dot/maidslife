import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CustomerService } from './customer.service.js';

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await CustomerService.createCustomer(req.body);
  return res.status(201).json(new ApiResponse(201, customer, 'Customer created successfully'));
});

export const getCustomers = asyncHandler(async (req, res) => {
  const { customers, meta } = await CustomerService.getAllCustomers(req.query);
  return res.status(200).json(new ApiResponse(200, customers, 'Customers retrieved successfully', meta));
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await CustomerService.getCustomerById(req.params.id);
  return res.status(200).json(new ApiResponse(200, customer, 'Customer retrieved successfully'));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await CustomerService.updateCustomer(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, customer, 'Customer updated successfully'));
});
