import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Maidslife Home Services Admin Backend API',
    version: '1.0.0',
    description:
      'Comprehensive REST API documentation for Maidslife Admin Management Panel. Features authentication, catalog hierarchy, bookings, live dispatch, cleaners, customer CRM, promo coupons, gallery, business analytics reports, and platform settings.',
    contact: {
      name: 'Maidslife Engineering Team',
      email: 'engineering@maidslife.ae',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT Access Token stored in httpOnly cookie',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Optional Bearer token for API tools',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 5 },
            },
          },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Residential Cleaning' },
          slug: { type: 'string', example: 'residential-cleaning' },
          description: { type: 'string', example: 'Standard home cleaning services' },
          icon: { type: 'string', example: 'home' },
          sortOrder: { type: 'number', example: 1 },
          isActive: { type: 'boolean', example: true },
        },
      },
      Service: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          category: { type: 'string' },
          name: { type: 'string', example: 'Deep Home Cleaning' },
          slug: { type: 'string', example: 'deep-home-cleaning' },
          startingPrice: { type: 'number', example: 299 },
          rating: { type: 'number', example: 4.9 },
          isActive: { type: 'boolean', example: true },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          bookingRef: { type: 'string', example: 'ML-1042' },
          customer: { type: 'string' },
          service: { type: 'string' },
          area: { type: 'string', example: 'Dubai Marina' },
          scheduledAt: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['pending_assignment', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled'],
            example: 'assigned',
          },
          amount: { type: 'number', example: 350 },
        },
      },
      Cleaner: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Aisha Khan' },
          phone: { type: 'string', example: '+971501234567' },
          emirate: { type: 'string', example: 'Dubai' },
          rating: { type: 'number', example: 4.92 },
          status: {
            type: 'string',
            enum: ['available', 'on_job', 'off_duty', 'on_leave'],
            example: 'available',
          },
        },
      },
      Coupon: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          code: { type: 'string', example: 'SUMMER20' },
          discountType: { type: 'string', enum: ['percent', 'flat'], example: 'percent' },
          discountValue: { type: 'number', example: 20 },
          minOrder: { type: 'number', example: 150 },
          expiresAt: { type: 'string', format: 'date-time' },
          isActive: { type: 'boolean', example: true },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication & Session operations' },
    { name: 'Categories', description: 'Catalog category hierarchy' },
    { name: 'Services', description: 'Home service offerings & Sharp image uploads' },

    { name: 'Addons', description: 'Service add-on extras' },
    { name: 'Bookings', description: 'Booking dispatch, status updates & cleaner assignment' },
    { name: 'Cleaners', description: 'Cleaner fleet management & duty status' },
    { name: 'Customers', description: 'Customer CRM records' },
    { name: 'Coupons', description: 'Promotional discount coupons & validation' },
    { name: 'Gallery', description: 'Before & After showcase image portfolio' },
    { name: 'Reports', description: 'Business telemetry & MongoDB aggregation analytics' },
    { name: 'Settings', description: 'Global platform settings & business rule configurations' },
  ],
  paths: {
    '/api/v1/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register new admin/staff account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Admin Staff' },
                  email: { type: 'string', example: 'admin@maidslife.ae' },
                  password: { type: 'string', example: 'Secret123!' },
                  role: { type: 'string', enum: ['super_admin', 'ops_manager', 'dispatcher', 'support'], example: 'ops_manager' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Account registered' } },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'User login (issues httpOnly JWT cookie)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@maidslife.ae' },
                  password: { type: 'string', example: 'Secret123!' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful' } },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current logged-in user profile',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 200: { description: 'Current user profile' } },
      },
    },
    '/api/v1/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories with pagination & search',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of categories' } },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create category (Ops/Super Admin)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Category' },
            },
          },
        },
        responses: { 201: { description: 'Category created' } },
      },
    },
    '/api/v1/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Category detail' } },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Category updated' } },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category (Super Admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Category deleted' } },
      },
    },
    '/api/v1/services': {
      get: {
        tags: ['Services'],
        summary: 'List all services',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of services' } },
      },
      post: {
        tags: ['Services'],
        summary: 'Create service',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } },
        },
        responses: { 201: { description: 'Service created' } },
      },
    },
    '/api/v1/services/{id}': {
      get: {
        tags: ['Services'],
        summary: 'Get service details by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service detail' } },
      },
      put: {
        tags: ['Services'],
        summary: 'Update service',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service updated' } },
      },
      delete: {
        tags: ['Services'],
        summary: 'Delete service',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Service deleted' } },
      },
    },
    '/api/v1/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List bookings with status & date range filters',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'area', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Bookings list' } },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create new booking order',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } },
        },
        responses: { 201: { description: 'Booking created' } },
      },
    },
    '/api/v1/bookings/{id}/status': {
      patch: {
        tags: ['Bookings'],
        summary: 'Update booking status (timeline auto-updated)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending_assignment', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled'] },
                  note: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Booking status updated' } },
      },
    },
    '/api/v1/bookings/{id}/assign-cleaner': {
      patch: {
        tags: ['Bookings'],
        summary: 'Assign cleaner to booking',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cleanerId'],
                properties: { cleanerId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Cleaner assigned' } },
      },
    },
    '/api/v1/cleaners': {
      get: {
        tags: ['Cleaners'],
        summary: 'List cleaner fleet & duty statuses',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Cleaners list' } },
      },
      post: {
        tags: ['Cleaners'],
        summary: 'Add cleaner to fleet',
        security: [{ cookieAuth: [] }],
        responses: { 201: { description: 'Cleaner created' } },
      },
    },
    '/api/v1/coupons/validate': {
      post: {
        tags: ['Coupons'],
        summary: 'Validate coupon code & calculate discount',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'orderAmount'],
                properties: {
                  code: { type: 'string', example: 'SUMMER20' },
                  orderAmount: { type: 'number', example: 250 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Coupon discount calculation result' } },
      },
    },
    '/api/v1/reports/overview': {
      get: {
        tags: ['Reports'],
        summary: 'Executive dashboard overview telemetry',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Dashboard metrics summary' } },
      },
    },
    '/api/v1/reports/revenue': {
      get: {
        tags: ['Reports'],
        summary: 'Revenue trend telemetry',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'days', in: 'query', schema: { type: 'integer', default: 30 } }],
        responses: { 200: { description: 'Daily revenue aggregation data' } },
      },
    },
    '/api/v1/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get platform settings & business rules',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Settings object' } },
      },
    },
  },
};

export { swaggerUi };
