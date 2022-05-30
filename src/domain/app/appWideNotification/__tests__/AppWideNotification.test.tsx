import React from "react";

import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  cleanup,
} from "../../../testinLibraryUtils";
import AppWideNotification from "../AppWideNotification";

let envStore: any = null;

beforeAll(() => {
  envStore = process.env;
});

beforeEach(() => {
  process.env = envStore;
});

afterAll(() => {
  process.env = envStore;
});

function setupVisibleNotification() {
  const content = "App notification content";
  process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED = "1";
  process.env.REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_FI = "Ilmoitus";
  process.env.REACT_APP_SITE_WIDE_NOTIFICATION_FI = content;

  return { content };
}

test("should not be visible when flag for it is not toggled on", () => {
  delete process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED;

  render(<AppWideNotification />);

  expect(
    screen.queryByRole("heading", { name: "Ilmoitus" })
  ).not.toBeInTheDocument();

  cleanup();
  render(<AppWideNotification />);
  process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED = "false";
  expect(
    screen.queryByRole("heading", { name: "Ilmoitus" })
  ).not.toBeInTheDocument();

  cleanup();
  render(<AppWideNotification />);
  process.env.REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED = "0";
  expect(
    screen.queryByRole("heading", { name: "Ilmoitus" })
  ).not.toBeInTheDocument();
});

test("should be visible when enabled and has translation", () => {
  const { content } = setupVisibleNotification();

  render(<AppWideNotification />);

  expect(screen.getByRole("heading", { name: "Ilmoitus" })).toBeInTheDocument();
  expect(screen.getByText(content)).toBeInTheDocument();
});

test("should be dismissable", async () => {
  const { content } = setupVisibleNotification();

  render(<AppWideNotification />);

  expect(screen.queryByText(content)).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "Sulje" }));

  await waitForElementToBeRemoved(() => screen.queryByText(content));
});
