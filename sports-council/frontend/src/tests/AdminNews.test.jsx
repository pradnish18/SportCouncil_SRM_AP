import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminNews from "../pages/admin/AdminNews";

const mockMutate = vi.fn();
const mockNews = [
  { id: "1", headline: "New Stadium Opening", description: "Details about new stadium", imageUrl: "https://example.com/img.jpg", order: 1 },
];

vi.mock("swr", () => ({
  default: (key) => {
    if (key === "/api/news") return { data: mockNews, mutate: mockMutate };
    return { data: null, mutate: vi.fn() };
  },
}));

describe("AdminNews", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders news list", () => {
    render(<AdminNews />);
    expect(screen.getByText("Manage News")).toBeInTheDocument();
    expect(screen.getByText("New Stadium Opening")).toBeInTheDocument();
  });

  it("opens create modal", async () => {
    render(<AdminNews />);
    await userEvent.click(screen.getByText("Add New News"));
    expect(screen.getByText("Create News")).toBeInTheDocument();
  });

  it("opens edit modal with populated fields", async () => {
    render(<AdminNews />);
    await userEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => {
      expect(screen.getByDisplayValue("New Stadium Opening")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com/img.jpg")).toBeInTheDocument();
    });
  });

  it("allows editing headline", async () => {
    render(<AdminNews />);
    await userEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => expect(screen.getByDisplayValue("New Stadium Opening")).toBeInTheDocument());
    const input = screen.getByDisplayValue("New Stadium Opening");
    await userEvent.clear(input);
    await userEvent.type(input, "Updated Headline");
    expect(input).toHaveValue("Updated Headline");
  });

  it("shows order field", async () => {
    render(<AdminNews />);
    await userEvent.click(screen.getByText("Add New News"));
    expect(screen.getByPlaceholderText("Order")).toBeInTheDocument();
  });

  it("saves via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminNews />);
    await userEvent.click(screen.getByText("Add New News"));
    await userEvent.type(screen.getByPlaceholderText("Headline"), "Breaking News");
    await userEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("deletes a news item", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminNews />);
    await userEvent.click(screen.getAllByText("Delete")[0]);
    await userEvent.click(screen.getAllByText("Delete")[1]);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/news/1", { method: "DELETE" });
    });
  });
});
