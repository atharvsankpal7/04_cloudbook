const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('E2E Test - Appointment Flow', () => {
  let professorToken, studentToken;
  let availabilityId, appointmentId;
  let professorId;

  // Increase timeout for the entire test suite
  jest.setTimeout(10000);

  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    } catch (error) {
      console.error('Cleanup error:', error);
      throw error;
    }
  });

  // Break down the large test into smaller, focused tests
  describe('User Registration and Authentication', () => {
    test('should register a professor successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'professor@test.com',
          password: 'password123',
          name: 'Professor Test',
          role: 'professor'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      professorToken = response.body.token;

      const decodedToken = require('jsonwebtoken').verify(
        professorToken,
        process.env.JWT_SECRET
      );
      professorId = decodedToken.userId;
    });

    test('should register a student successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'student@test.com',
          password: 'password123',
          name: 'Student Test',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      studentToken = response.body.token;
    });
  });

  describe('Availability Management', () => {
    test('should allow professor to add availability', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const response = await request(app)
        .post('/api/availability')
        .set('Authorization', `Bearer ${professorToken}`)
        .send({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      availabilityId = response.body._id;
    });

    test('should allow student to view professor availability', async () => {
      const response = await request(app)
        .get(`/api/availability/${professorId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('Appointment Management', () => {
    test('should allow student to book appointment', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          slotId: availabilityId,
          professorId: professorId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      appointmentId = response.body._id;
    });

    test('should allow professor to cancel appointment', async () => {
      const response = await request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${professorToken}`);

      expect(response.status).toBe(200);
    });

    test('should show cancelled status in student appointments', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      const cancelledAppointment = response.body.find(
        (a) => a._id === appointmentId
      );
      expect(cancelledAppointment.status).toBe('cancelled');
    });
  });
});