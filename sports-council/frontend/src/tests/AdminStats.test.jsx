import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminStats from "../pages/admin/AdminStats";

const mockMutate = vi.fn();
const mockStats = { totalTeams: 20, totalMembers: 500 };

vi.mock("swr", () => ({
  default: (key) => {
    if (key === "/api/stats") return { data: mockStats, mutate: mockMutate };
    return { data: null, mutate: vi.fn() };
  },
}));

describe("AdminStats", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders stats form with values", () => {
    render(<AdminStats />);
    expect(screen.getByText("Manage Statistics")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
  });

  it("allows editing total teams", async () => {
    render(<AdminStats />);
    const teamsInput = screen.getByDisplayValue("20");
    await userEvent.clear(teamsInput);
    await userEvent.type(teamsInput, "25");
    expect(teamsInput).toHaveValue(25);
  });

  it("allows editing total members", async () => {
    render(<AdminStats />);
    const membersInput = screen.getByDisplayValue("500");
    await userEvent.clear(membersInput);
    await userEvent.type(membersInput, "600");
    expect(membersInput).toHaveValue(600);
  });

  it("saves stats via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminStats />);
    await userEvent.click(screen.getByText("Update Stats"));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/stats", expect.objectContaining({ method: "PUT" }));
    });
  });

  it("sends correct data in API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminStats />);

    const teamsInput = screen.getByDisplayValue("20");
    await userEvent.clear(teamsInput);
    await userEvent.type(teamsInput, "30");
    await userEvent.click(screen.getByText("Update Stats"));

    await waitFor(() => {
      const callArg = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callArg.totalTeams).toBe(30);
    });
  });
});
