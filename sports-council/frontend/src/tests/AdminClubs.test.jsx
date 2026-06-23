import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminClubs from "../pages/admin/AdminClubs";

const mockMutate = vi.fn();
const mockClubs = [
  {
    id: "1",
    name: "Cricket",
    description: "Cricket club description",
    logoUrl: "🏏",
    bgImageUrl: "",
    convenorName: "Dr. Prem",
    convenorRole: "Convenor",
    convenorDetails: "Experienced coach",
    coConvenorName: "John",
    coConvenorRole: "Co-Convenor",
    coConvenorDetails: "Former captain",
    coachName: "Coach A",
    coachRole: "Coach",
    coachDetails: "Details",
    coachPhotoUrl: "",
    achievementsList: JSON.stringify(["South Zone Gold 2024", "National Silver 2023"]),
    gallery: [{ url: "https://example.com/photo.jpg", type: "image" }],
    players: [],
    order: 0,
    icon: "🏏",
    image: "",
  },
];

vi.mock("swr", async () => {
  const actual = await vi.importActual("swr");
  return {
    ...actual,
    default: (key) => {
      if (key === "/api/clubs") return { data: mockClubs, mutate: mockMutate };
      return { data: null, mutate: vi.fn() };
    },
  };
});

describe("AdminClubs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders club list table", () => {
    render(<AdminClubs />);
    expect(screen.getByText("Manage Clubs")).toBeInTheDocument();
    expect(screen.getByText("Cricket")).toBeInTheDocument();
    expect(screen.getByText("Dr. Prem")).toBeInTheDocument();
  });

  it("opens create modal on Add New Club click", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getByText("Add New Club"));
    expect(screen.getByText("Create Club")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Club Name")).toBeInTheDocument();
  });

  it("opens edit modal with populated fields", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Club")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Cricket")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Dr. Prem")).toBeInTheDocument();
    });
  });

  it("allows editing club fields", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Cricket")).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Cricket");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Cricket Team A");

    expect(nameInput).toHaveValue("Cricket Team A");
  });

  it("saves club via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<AdminClubs />);
    await userEvent.click(screen.getByText("Add New Club"));
    await userEvent.type(screen.getByPlaceholderText("Club Name"), "New Club");
    await userEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("allows adding achievements", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getByText("Add New Club"));

    await userEvent.click(screen.getByText("+ Add Achievement"));

    const achievementInput = screen.getByPlaceholderText(/south zone/i);
    await userEvent.type(achievementInput, "New Achievement");
    expect(achievementInput).toHaveValue("New Achievement");
  });

  it("allows removing achievements", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("South Zone Gold 2024")).toBeInTheDocument();
    });

    const removeBtns = screen.getAllByText("✕");
    await userEvent.click(removeBtns[0]);

    expect(screen.queryByDisplayValue("South Zone Gold 2024")).not.toBeInTheDocument();
  });

  it("allows adding gallery items", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getByText("Add New Club"));

    await userEvent.click(screen.getByText("+ Add Media Item"));

    const urlInputs = screen.getAllByPlaceholderText("Image URL");
    expect(urlInputs.length).toBeGreaterThan(0);
  });

  it("allows deleting a club", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<AdminClubs />);
    await userEvent.click(screen.getAllByText("Delete")[0]);

    expect(screen.getByText("Delete Club?")).toBeInTheDocument();
    await userEvent.click(screen.getAllByText("Delete")[1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/clubs/1", { method: "DELETE" });
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it("renders with all form fields for new club", async () => {
    render(<AdminClubs />);
    await userEvent.click(screen.getByText("Add New Club"));

    expect(screen.getByPlaceholderText("Club Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Logo Image URL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Background Image URL/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("Name").length).toBeGreaterThanOrEqual(3);
  });
});
