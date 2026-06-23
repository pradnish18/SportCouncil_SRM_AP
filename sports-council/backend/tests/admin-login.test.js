import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/pg.js', () => ({
  query: vi.fn(),
}));

const { query } = await import('../lib/pg.js');
const { default: router } = await import('../routes/admin/login/index.js');

function callRoute(method, path, req) {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  const stack = router.stack.find((r) => r.route?.path === path && r.route?.methods[method]);
  if (!stack) throw new Error(`Route ${method} ${path} not found`);
  return new Promise((resolve) => {
    stack.route.stack[0].handle(req, res, () => {});
    setTimeout(resolve, 50);
  });
}

describe('POST /api/admin/login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 if username or password missing', async () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    const stack = router.stack.find((r) => r.route?.path === '/' && r.route?.methods?.post);
    await stack.route.stack[0].handle({ body: { username: '', password: '' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username and password required' });
  });

  it('returns 401 if credentials are invalid', async () => {
    query.mockResolvedValue({ rows: [] });
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    const stack = router.stack.find((r) => r.route?.path === '/' && r.route?.methods?.post);
    await stack.route.stack[0].handle({ body: { username: 'admin', password: 'wrong' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('returns admin data on successful login', async () => {
    const mockAdmin = { id: '1', username: 'admin', password: 'password123', role: 'ADMIN', clubId: '' };
    query.mockResolvedValue({ rows: [{ ...mockAdmin }] });
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    const stack = router.stack.find((r) => r.route?.path === '/' && r.route?.methods?.post);
    await stack.route.stack[0].handle({ body: { username: 'admin', password: 'password123' } }, res);

    expect(res.json).toHaveBeenCalledWith({
      id: '1',
      username: 'admin',
      role: 'ADMIN',
      clubId: '',
    });
  });

  it('returns 500 on database error', async () => {
    query.mockRejectedValue(new Error('DB error'));
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    const stack = router.stack.find((r) => r.route?.path === '/' && r.route?.methods?.post);
    await stack.route.stack[0].handle({ body: { username: 'admin', password: 'pass' } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
