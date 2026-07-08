import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect } from "vitest";

describe("App Component", () => {
  it("renders the Get started heading", () => {
    render(<App />);
    expect(screen.getByText(/Get started/i)).toBeInTheDocument();
  });

  it("renders Documentation heading", () => {
    render(<App />);
    expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
  });

  it("renders Connect with us heading", () => {
    render(<App />);
    expect(screen.getByText(/Connect with us/i)).toBeInTheDocument();
  });

  it("increments counter when button is clicked", async () => {
    const user = userEvent.setup();

    render(<App />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Count is 0");

    await user.click(button);

    expect(button).toHaveTextContent("Count is 1");
  });
});