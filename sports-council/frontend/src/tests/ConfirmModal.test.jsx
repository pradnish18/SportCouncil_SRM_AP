import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "../components/ConfirmModal";

describe("ConfirmModal", () => {
  it("renders when open is true", () => {
    render(
      <ConfirmModal
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete?"
        message="Are you sure?"
        confirmLabel="Delete"
      />
    );
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <ConfirmModal
        open={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete?"
        message="Are you sure?"
        confirmLabel="Delete"
      />
    );
    expect(screen.queryByText("Delete?")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        title="Delete?"
        message="Are you sure?"
        confirmLabel="Delete"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        title="Delete?"
        message="Are you sure?"
        confirmLabel="Delete"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
