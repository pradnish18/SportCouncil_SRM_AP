import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";

describe("AdminLayout", () => {
  const renderLayout = (path = "/admin") => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <AdminLayout />
      </MemoryRouter>
    );
  };

  it("renders header with brand name", () => {
    renderLayout();
    expect(screen.getByText("SRM Sports")).toBeInTheDocument();
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });

  it("renders logout link", () => {
    renderLayout();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("renders all sidebar navigation items", () => {
    renderLayout();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Clubs")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Council")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("renders the Outlet for nested routes", () => {
    renderLayout();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("has active state for current route", () => {
    renderLayout("/admin/clubs");
    const clubsLink = screen.getByText("Clubs").closest("a");
    expect(clubsLink?.className).toContain("bg-brand-srm");
  });

  it("has sidebar layout structure", () => {
    const { container } = renderLayout();
    const sidebar = container.querySelector("nav");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.className).toContain("w-64");
  });

  it("has main content area", () => {
    const { container } = renderLayout();
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain("flex-1");
  });
});
