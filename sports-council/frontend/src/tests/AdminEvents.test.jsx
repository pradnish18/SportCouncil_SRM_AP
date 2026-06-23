import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminEvents from "../pages/admin/AdminEvents";

const mockMutate = vi.fn();
const mockEvents = [
  {
    id: "1",
    title: "Cricket Final",
    sport: "Cricket",
    date: "2026-06-15T10:00:00.000Z",
    time: "10:00",
    venue: "Main Ground",
    registrationLink: "https://forms.google.com/register",
    stage: "UPCOMING",
  },
];

vi.mock("swr", async () => {
  return {
    default: (key) => {
      if (key === "/api/events") return { data: mockEvents, mutate: mockMutate };
      return { data: null, mutate: vi.fn() };
    },
  };
});

describe("AdminEvents", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders event list", () => {
    render(<AdminEvents />);
    expect(screen.getByText("Manage Events")).toBeInTheDocument();
    expect(screen.getByText("Cricket Final")).toBeInTheDocument();
  });

  it("opens create modal on Add New Event click", async () => {
    render(<AdminEvents />);
    await userEvent.click(screen.getByText("Add New Event"));
    expect(screen.getByText("Create Event")).toBeInTheDocument();
  });

  it("opens edit modal with populated event fields", async () => {
    render(<AdminEvents />);
    await userEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Cricket Final")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Cricket")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Main Ground")).toBeInTheDocument();
    });
  });

  it("shows registration link status in table", () => {
    render(<AdminEvents />);
    expect(screen.getByText("Linked")).toBeInTheDocument();
  });

  it("allows editing event fields", async () => {
    render(<AdminEvents />);
    await userEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Cricket Final")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Cricket Final");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Football Final");
    expect(titleInput).toHaveValue("Football Final");
  });

  it("saves event via API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<AdminEvents />);
    await userEvent.click(screen.getByText("Add New Event"));
    await userEvent.type(screen.getByPlaceholderText("Event Title"), "New Event");
    await userEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("renders calendar picker and time input", async () => {
    render(<AdminEvents />);
    await userEvent.click(screen.getByText("Add New Event"));

    expect(screen.getByText("Select date")).toBeInTheDocument();
    expect(screen.getAllByText("Date & Time").length).toBeGreaterThanOrEqual(1);
  });

  it("renders registration link input", async () => {
    render(<AdminEvents />);
    await userEvent.click(screen.getByText("Add New Event"));

    expect(screen.getByPlaceholderText("https://forms.google.com/...")).toBeInTheDocument();
  });

  it("deletes an event", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<AdminEvents />);
    await userEvent.click(screen.getAllByText("Delete")[0]);

    expect(screen.getByText("Delete Event?")).toBeInTheDocument();
    await userEvent.click(screen.getAllByText("Delete")[1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
