import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminModal from "../components/AdminModal";

describe("AdminModal", () => {
  it("renders when open is true", () => {
    render(
      <AdminModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </AdminModal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <AdminModal open={false} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </AdminModal>
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <AdminModal open={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </AdminModal>
    );
    const closeBtn = screen.getByRole("button");
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(
      <AdminModal open={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </AdminModal>
    );
    const backdrop = screen.getByTestId("modal-backdrop");
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("has scrollable content with max height", () => {
    render(
      <AdminModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </AdminModal>
    );
    const content = screen.getByText("Test Modal").closest(".max-h-\\[85vh\\]");
    expect(content).toBeInTheDocument();
  });

  it("renders with animated framer-motion props", () => {
    render(
      <AdminModal open={true} onClose={vi.fn()} title="Animated Modal">
        <div>Content</div>
      </AdminModal>
    );
    expect(screen.getByText("Animated Modal")).toBeInTheDocument();
  });
});
