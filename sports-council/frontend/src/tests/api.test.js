import { fetcher } from "../lib/api";

describe("fetcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns JSON on successful response", async () => {
    const mockData = [{ id: 1, name: "Cricket" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetcher("/api/clubs");
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/clubs");
  });

  it("throws on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetcher("/api/clubs")).rejects.toThrow("Request failed: 500");
  });

  it("includes protocol in URL", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetcher("http://localhost:4000/api/clubs");
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:4000/api/clubs");
  });
});
