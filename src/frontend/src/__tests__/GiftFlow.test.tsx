import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FlowersPage } from "@/components/FlowersPage";
import { GiftSelection } from "@/components/GiftSelection";
import { MemoriesPage } from "@/components/MemoriesPage";
import { PolaroidFrame } from "@/components/PolaroidFrame";

describe("GiftSelection", () => {
  it("renders the three labelled choices in a responsive three-column grid", () => {
    render(<GiftSelection onSelect={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Gifts for you" }),
    ).toBeInTheDocument();

    const grid = screen.getByTestId("gifts.page").querySelector("div");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("sm:grid-cols-3");

    for (const label of ["Message", "Memories", "Flowers"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("reports the selected gift when a choice is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<GiftSelection onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Memories" }));

    expect(onSelect).toHaveBeenCalledWith("memories");
  });

  it("activates a choice with the keyboard and exposes a visible focus ring", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<GiftSelection onSelect={onSelect} />);

    const flowers = screen.getByRole("button", { name: "Flowers" });
    expect(flowers.className).toContain("focus-visible:ring-2");

    await user.tab();
    await user.tab();
    await user.tab();
    expect(flowers).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("flowers");
  });
});

describe("PolaroidFrame", () => {
  it("shows the photo as-is inside a thick white frame", () => {
    render(
      <PolaroidFrame
        src="/assets/images/memory-1.jpg"
        alt="A cherished memory together"
        tilt={-5}
      />,
    );

    const img = screen.getByRole("img", {
      name: "A cherished memory together",
    });
    expect(img).toHaveAttribute("src", "/assets/images/memory-1.jpg");
    // object-contain keeps the whole photo visible without cropping.
    expect(img.className).toContain("object-contain");
  });

  it("falls back to a tidy placeholder instead of a broken image when the file is missing", () => {
    render(
      <PolaroidFrame
        src="/assets/images/memory-1.jpg"
        alt="A cherished memory together"
        tilt={-5}
      />,
    );

    const img = screen.getByRole("img", {
      name: "A cherished memory together",
    });
    fireEvent.error(img);

    expect(
      screen.queryByRole("img", { name: "A cherished memory together" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("/assets/images/memory-1.jpg")).toBeInTheDocument();
  });
});

describe("MemoriesPage", () => {
  it("renders two polaroids, the heading, floral accents and a Back control", () => {
    render(<MemoriesPage onBack={() => {}} />);

    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Kenangan Bersamamu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();

    // The floral corner accents are decorative inline SVG, never broken images.
    const page = screen.getByTestId("memories.page");
    expect(page.querySelectorAll("svg").length).toBeGreaterThanOrEqual(2);
    expect(page.querySelector("img")).not.toBeNull();
  });

  it("calls onBack when the Back control is activated", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<MemoriesPage onBack={onBack} />);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe("FlowersPage", () => {
  it("renders the bouquet, caption and a Back control", () => {
    render(<FlowersPage onBack={() => {}} />);

    expect(screen.getByTestId("flowers.caption")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    // The bouquet is inline SVG artwork, not a broken image.
    expect(
      screen.getByTestId("flowers.page").querySelector("svg"),
    ).not.toBeNull();
  });

  it("calls onBack when the Back control is activated", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<FlowersPage onBack={onBack} />);

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
