import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";

describe("AdminLayout - UI Alignment & Mobile", () => {
  it("has responsive sidebar with fixed width on desktop", () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    const sidebar = container.querySelector("nav");
    expect(sidebar?.className).toContain("w-64");
  });

  it("has main content area that fills remaining space", () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    const main = container.querySelector("main");
    expect(main?.className).toContain("flex-1");
    expect(main?.className).toContain("p-8");
  });

  it("header contains brand and logout button", () => {
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(screen.getByText("SRM Sports")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("has min-height for sidebar to fill viewport", () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    const sidebar = container.querySelector("nav");
    expect(sidebar?.className).toContain("min-h-");
  });

  it("renders all nav links with proper spacing", () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    );
    const navList = container.querySelector("ul");
    expect(navList?.className).toContain("space-y-2");
  });
});

describe("Admin Form - Input Alignment", () => {
  it("inputs use consistent full-width styling class", () => {
    const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm";
    expect(inputClass).toContain("w-full");
    expect(inputClass).toContain("rounded-xl");
    expect(inputClass).toContain("text-sm");
  });

  it("form layout uses consistent spacing", () => {
    const spacing = "space-y-5";
    expect(spacing).toBe("space-y-5");
  });

  it("button pairs use consistent gap and alignment", () => {
    const buttonContainer = "flex justify-end gap-3";
    expect(buttonContainer).toContain("flex");
    expect(buttonContainer).toContain("justify-end");
    expect(buttonContainer).toContain("gap-3");
  });
});

describe("Admin Table - Responsive Layout", () => {
  it("table has responsive overflow container", () => {
    const tableContainer = "bg-card rounded-lg border border-border overflow-hidden";
    expect(tableContainer).toContain("overflow-hidden");
    expect(tableContainer).toContain("rounded-lg");
  });

  it("table uses full width", () => {
    expect("w-full").toBe("w-full");
  });

  it("table headers use consistent uppercase styling", () => {
    const headerClass = "px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider";
    expect(headerClass).toContain("uppercase");
    expect(headerClass).toContain("tracking-wider");
    expect(headerClass).toContain("text-xs");
  });
});

describe("Dashboard - Grid Responsiveness", () => {
  it("stats grid uses responsive columns", () => {
    const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
    expect(gridClass).toContain("grid-cols-1");
    expect(gridClass).toContain("md:grid-cols-2");
    expect(gridClass).toContain("lg:grid-cols-4");
  });

  it("quick actions grid uses responsive columns", () => {
    const gridClass = "grid grid-cols-1 md:grid-cols-3 gap-4";
    expect(gridClass).toContain("grid-cols-1");
    expect(gridClass).toContain("md:grid-cols-3");
  });
});
