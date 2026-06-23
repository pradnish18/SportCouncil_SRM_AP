import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCouncil from "../pages/admin/AdminCouncil";

const mockMutate = vi.fn();
const mockCouncil = {
  DIRECTOR: [{ id: "1", name: "Dr. Director", title: "Director of Sports", tier: "DIRECTOR", order: 1 }],
  STUDENT_BODY: [{ id: "2", name: "Student Leader", title: "Captain", tier: "STUDENT_BODY", order: 1 }],
};

vi.mock("swr", () => ({
  default: (key) => {
    if (key === "/api/council") return { data: mockCouncil, mutate: mockMutate };
    return { data: null, mutate: vi.fn() };
  },
}));

describe("AdminCouncil", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders council member list", () => {
    render(<AdminCouncil />);
    expect(screen.getByText("Manage Council")).toBeInTheDocument();
    expect(screen.getByText("Dr. Director")).toBeInTheDocument();
    expect(screen.getByText("Student Leader")).toBeInTheDocument();
  });

  it("shows tier labels in table", () => {
    render(<AdminCouncil />);
    expect(screen.getByText("DIRECTOR")).toBeInTheDocument();
    expect(screen.getByText("STUDENT_BODY")).toBeInTheDocument();
  });

  it("opens create modal", async () => {
    render(<AdminCouncil />);
    await userEvent.click(screen.getByText("Add New Member"));
    expect(screen.getByText("Add Council Member")).toBeInTheDocument();
  });

  it("opens edit modal with populated fields", async () => {
    render(<AdminCouncil />);
    await userEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Dr. Director")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Director of Sports")).toBeInTheDocument();
    });
  });

  it("allows tier selection in form", async () => {
    render(<AdminCouncil />);
    await userEvent.click(screen.getByText("Add New Member"));
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "COACH");
    expect(select).toHaveValue("COACH");
  });

  it("allows order editing", async () => {
    render(<AdminCouncil />);
    await userEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => {
      const orderInput = screen.getByDisplayValue("1");
      expect(orderInput).toBeInTheDocument();
    });
  });

  it("saves via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminCouncil />);
    await userEvent.click(screen.getByText("Add New Member"));
    await userEvent.type(screen.getByPlaceholderText("Name"), "New Member");
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("deletes a council member", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminCouncil />);
    await userEvent.click(screen.getAllByText("Delete")[0]);
    await userEvent.click(screen.getAllByText("Delete")[2]);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/council/1", { method: "DELETE" });
    });
  });
});
