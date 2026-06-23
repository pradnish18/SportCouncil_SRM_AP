import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboard from "../pages/admin/AdminDashboard";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockStats = { totalTeams: 15, totalMembers: 300 };
const mockClubs = [{ id: "1" }, { id: "2" }, { id: "3" }];
const mockEvents = [{ id: "1" }, { id: "2" }];
const mockAchievements = [{ id: "1" }];

vi.mock("swr", () => ({
  default: (key) => {
    if (key === "/api/stats") return { data: mockStats };
    if (key === "/api/clubs") return { data: mockClubs };
    if (key === "/api/events") return { data: mockEvents };
    if (key === "/api/achievements") return { data: mockAchievements };
    return { data: null, mutate: vi.fn() };
  },
}));

describe("AdminDashboard", () => {
  it("renders welcome message", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/welcome to the srm sports council admin panel/i)).toBeInTheDocument();
  });

  it("displays stat cards with correct values", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Total Clubs")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // clubs.length
    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // events.length
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // achievements.length
    expect(screen.getByText("Total Members")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument(); // stats.totalMembers
  });

  it("renders all four stat cards in a grid", () => {
    const { container } = render(<AdminDashboard />);
    const statCards = container.querySelectorAll(".grid-cols-1");
    expect(statCards.length).toBeGreaterThan(0);
  });

  it("renders quick action buttons", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Add New Club")).toBeInTheDocument();
    expect(screen.getByText("Schedule Event")).toBeInTheDocument();
    expect(screen.getByText("Add Achievement")).toBeInTheDocument();
  });

  it("navigates on quick action click", async () => {
    render(<AdminDashboard />);
    await userEvent.click(screen.getByText("Add New Club"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/clubs");
  });
});
