import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminAchievements from "../pages/admin/AdminAchievements";

const mockMutate = vi.fn();
const mockAchievements = [
  { id: "1", title: "Gold Medal", description: "Inter-University Gold", sport: "Cricket", category: "TROPHY" },
];

vi.mock("swr", () => ({
  default: (key) => {
    if (key === "/api/achievements") return { data: mockAchievements, mutate: mockMutate };
    return { data: null, mutate: vi.fn() };
  },
}));

describe("AdminAchievements", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders achievements list", () => {
    render(<AdminAchievements />);
    expect(screen.getByText("Manage Achievements")).toBeInTheDocument();
    expect(screen.getByText("Gold Medal")).toBeInTheDocument();
  });

  it("opens create modal", async () => {
    render(<AdminAchievements />);
    await userEvent.click(screen.getByText("Add New Achievement"));
    expect(screen.getByText("Create Achievement")).toBeInTheDocument();
  });

  it("opens edit modal with populated fields", async () => {
    render(<AdminAchievements />);
    await userEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Gold Medal")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Inter-University Gold")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Cricket")).toBeInTheDocument();
    });
  });

  it("allows category selection", async () => {
    render(<AdminAchievements />);
    await userEvent.click(screen.getByText("Add New Achievement"));
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "RECORD");
    expect(select).toHaveValue("RECORD");
  });

  it("saves via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminAchievements />);
    await userEvent.click(screen.getByText("Add New Achievement"));
    await userEvent.type(screen.getByPlaceholderText("Title"), "New Achi");
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("deletes an achievement", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminAchievements />);
    await userEvent.click(screen.getAllByText("Delete")[0]);
    await userEvent.click(screen.getAllByText("Delete")[1]);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/achievements/1", { method: "DELETE" });
    });
  });
});
