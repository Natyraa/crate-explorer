import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders the current value and result count", () => {
    render(<SearchBar value="fela" onChange={() => {}} resultCount={12} totalCount={12000} />);

    expect(screen.getByRole("textbox")).toHaveValue("fela");
    expect(screen.getByText("12 / 12,000")).toBeInTheDocument();
  });

  it("calls onChange with the new value as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} resultCount={12000} totalCount={12000} />);

    await user.type(screen.getByRole("textbox"), "can");

    // called once per keystroke — last call should reflect the final character typed
    expect(onChange).toHaveBeenLastCalledWith("n");
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
