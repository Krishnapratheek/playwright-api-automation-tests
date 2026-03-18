import { test, expect } from '@playwright/test';

test.describe('Posts API Tests', () => {

  test('GET all posts', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET single post', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
  });

  test('POST create post', async ({ request }) => {
    const response = await request.post('/posts', {
      data: {
        title: 'QA Test',
        body: 'Playwright API',
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('QA Test');
    expect(body).toHaveProperty('id');
  });

  test('PUT update post', async ({ request }) => {
    const response = await request.put('/posts/1', {
      data: {
        id: 1,
        title: 'Updated Title',
        body: 'Updated Body',
        userId: 1,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Updated Title');
  });

  test('DELETE post', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
  });

  test('GET non-existent post should return 404', async ({ request }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
  });

  test('GET posts with query params', async ({ request }) => {
    const response = await request.get('/posts?userId=1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();

    body.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });
  });

  test('check response headers', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });

  test('response time should be under 1 second', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/posts');
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(1000);
  });

  test('validate data types of response', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(typeof body.id).toBe('number');
    expect(typeof body.userId).toBe('number');
    expect(typeof body.title).toBe('string');
    expect(typeof body.body).toBe('string');
  });

});