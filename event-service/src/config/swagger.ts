import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Service API',
      version: '1.0.0',
      description: 'Event Management API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateEventInput: {
          type: 'object',
          required: ['title', 'description', 'date', 'location', 'category'],
          properties: {
            title: {
              type: 'string',
              description: 'Event title'
            },
            description: {
              type: 'string',
              description: 'Event description'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Event date and time'
            },
            location: {
              type: 'string',
              description: 'Event location'
            },
            maxParticipants: {
              type: 'number',
              description: 'Maximum number of participants (optional)'
            },
            category: {
              type: 'string',
              description: 'Event category'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            organizer: { type: 'string' },
            participants: {
              type: 'array',
              items: { type: 'string' }
            },
            maxParticipants: { type: 'number' },
            category: { type: 'string' },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'completed', 'cancelled']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);