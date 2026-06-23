import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/pg.js', () => ({
  query: vi.fn(),
}));

const { query } = await import('../lib/pg.js');

function mockRes() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

async function testRoute(router, method, path, body, params = {}) {
  const res = mockRes();
  const req = { body, params };
  const stack = router.stack.find(
    (r) => r.route?.path === path && r.route?.methods[method]
  );
  if (!stack) throw new Error(`Route ${method} ${path} not found`);
  await stack.route.stack[0].handle(req, res);
  return res;
}

describe('Admin Clubs Routes', () => {
  let router;

  beforeAll(async () => {
    router = (await import('../routes/admin/clubs/index.js')).default;
  });

  beforeEach(() => vi.clearAllMocks());

  it('POST / creates a club', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', name: 'Test Club' }] });
    const res = await testRoute(router, 'post', '/', {
      name: 'Test Club', description: 'Desc',
    }, {});
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Club' }));
  });

  it('POST / defaults empty fields', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', {}, {});
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('PUT /:id updates a club', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', name: 'Updated' }] });
    const res = await testRoute(router, 'put', '/:id', { name: 'Updated' }, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
  });

  it('PUT /:id returns 404 if not found', async () => {
    query.mockResolvedValue({ rows: [] });
    const res = await testRoute(router, 'put', '/:id', { name: 'Test' }, { id: '999' });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('DELETE /:id deletes a club', async () => {
    query.mockResolvedValue({});
    const res = await testRoute(router, 'delete', '/:id', {}, { id: '1' });
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('POST / handles achievements and gallery arrays', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', {
      name: 'Club',
      achievements: ['Gold 2024', 'Silver 2023'],
      gallery: [{ url: 'https://example.com/1.jpg', type: 'image' }],
      players: [{ id: 'p1', name: 'Player' }],
    }, {});
    expect(query).toHaveBeenCalled();
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[15]).toBe('["Gold 2024","Silver 2023"]'); // achievements
    expect(JSON.parse(pgParams[17])).toEqual([{ url: 'https://example.com/1.jpg', type: 'image' }]); // gallery
    expect(JSON.parse(pgParams[18])).toEqual([{ id: 'p1', name: 'Player' }]); // players
  });

  it('POST / handles convenor/coach/coConvenor objects', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', {
      convenor: { name: 'Dr. X', role: 'Convenor', details: 'Expert' },
      coConvenor: { name: 'Mr. Y', role: 'Co-Convenor', details: 'Assistant' },
      coach: { name: 'Coach Z', role: 'Coach', details: 'Pro', photoUrl: 'https://photo.jpg' },
    }, {});
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[5]).toBe('Dr. X');
    expect(pgParams[8]).toBe('Mr. Y');
    expect(pgParams[10]).toBe('Coach Z');
  });

  it('returns 500 on database error', async () => {
    query.mockRejectedValue(new Error('DB error'));
    const res = await testRoute(router, 'post', '/', { name: 'Test' }, {});
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Admin Events Routes', () => {
  let router;
  beforeAll(async () => {
    router = (await import('../routes/admin/events/index.js')).default;
  });
  beforeEach(() => vi.clearAllMocks());

  it('POST / creates an event', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', title: 'Event' }] });
    const res = await testRoute(router, 'post', '/', {
      title: 'Event', sport: 'Cricket', venue: 'Ground', date: '2026-06-15',
    }, {});
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('PUT /:id updates an event', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', title: 'Updated' }] });
    const res = await testRoute(router, 'put', '/:id', { title: 'Updated' }, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }));
  });

  it('DELETE /:id deletes an event', async () => {
    query.mockResolvedValue({});
    const res = await testRoute(router, 'delete', '/:id', {}, { id: '1' });
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('POST / handles registration link', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', {
      title: 'Event', sport: 'Cricket', registrationLink: 'https://forms.google.com/r',
    }, {});
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[18]).toBe('https://forms.google.com/r');
  });

  it('POST / defaults stage to PLANNED', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', {
      title: 'Event', sport: 'Cricket',
    }, {});
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[8]).toBe('PLANNED');
  });
});

describe('Admin Achievements Routes', () => {
  let router;
  beforeAll(async () => {
    router = (await import('../routes/admin/achievements/index.js')).default;
  });
  beforeEach(() => vi.clearAllMocks());

  it('POST / creates an achievement', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', title: 'Gold' }] });
    const res = await testRoute(router, 'post', '/', { title: 'Gold', sport: 'Cricket' }, {});
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('PUT /:id updates an achievement', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', title: 'Updated' }] });
    const res = await testRoute(router, 'put', '/:id', { title: 'Updated' }, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }));
  });

  it('DELETE /:id deletes an achievement', async () => {
    query.mockResolvedValue({});
    const res = await testRoute(router, 'delete', '/:id', {}, { id: '1' });
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('POST / defaults category to TROPHY', async () => {
    query.mockResolvedValue({ rows: [{ id: '1' }] });
    const res = await testRoute(router, 'post', '/', { title: 'Gold' }, {});
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[6]).toBe('TROPHY');
  });
});

describe('Admin News Routes', () => {
  let router;
  beforeAll(async () => {
    router = (await import('../routes/admin/news/index.js')).default;
  });
  beforeEach(() => vi.clearAllMocks());

  it('POST / creates news', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', headline: 'News' }] });
    const res = await testRoute(router, 'post', '/', { headline: 'News', imageUrl: 'https://img.jpg' }, {});
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('PUT /:id updates news', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', headline: 'Updated' }] });
    const res = await testRoute(router, 'put', '/:id', { headline: 'Updated' }, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ headline: 'Updated' }));
  });

  it('DELETE /:id deletes news', async () => {
    query.mockResolvedValue({});
    const res = await testRoute(router, 'delete', '/:id', {}, { id: '1' });
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

describe('Admin Council Routes', () => {
  let router;
  beforeAll(async () => {
    router = (await import('../routes/admin/council/index.js')).default;
  });
  beforeEach(() => vi.clearAllMocks());

  it('POST / creates a council member', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', name: 'Dr. Director' }] });
    const res = await testRoute(router, 'post', '/', { name: 'Dr. Director', title: 'Director' }, {});
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('PUT /:id updates a council member', async () => {
    query.mockResolvedValue({ rows: [{ id: '1', name: 'Updated' }] });
    const res = await testRoute(router, 'put', '/:id', { name: 'Updated' }, { id: '1' });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
  });

  it('DELETE /:id deletes a council member', async () => {
    query.mockResolvedValue({});
    const res = await testRoute(router, 'delete', '/:id', {}, { id: '1' });
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

describe('Admin Stats Routes', () => {
  let router;
  beforeAll(async () => {
    router = (await import('../routes/admin/stats/index.js')).default;
  });
  beforeEach(() => vi.clearAllMocks());

  it('PUT / updates or inserts stats', async () => {
    query.mockResolvedValue({ rows: [{ totalTeams: 20, totalMembers: 500 }] });
    const res = await testRoute(router, 'put', '/', { totalTeams: 20, totalMembers: 500 }, {});
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ totalTeams: 20, totalMembers: 500 }));
  });

  it('PUT / defaults to 0 for missing values', async () => {
    query.mockResolvedValue({ rows: [{ totalTeams: 0, totalMembers: 0 }] });
    const res = await testRoute(router, 'put', '/', {}, {});
    const pgParams = query.mock.calls[0][1];
    expect(pgParams[0]).toBe(0);
    expect(pgParams[1]).toBe(0);
  });
});
