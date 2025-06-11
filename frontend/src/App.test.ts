/*
import { expect, test, vitest } from 'vitest';
import { mount } from 'svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import preprocess from 'svelte-preprocess';
import App from "App.svelte";
// import '@testing-library/jest-dom';
// import { vi } from 'vitest';
*/
import { test } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { describe, test, expect, beforeEach, vi } from "vitest";
import App from "./App.svelte";
import Playlist from "./Playlist.svelte";
import LandingPage from "./LandingPage.svelte";
import LocationPage from "./LocationPage.svelte";

test("App", async () => {
  render(App);
});

function setViewport(width: number, height: number = 800) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
}

// test playlist responsiveness
describe("Playlist component", () => {
  beforeEach(() => {
    localStorage.setItem(
      "trackIds",
      JSON.stringify(["4uLU6hMCjMI75M1A2tKUQC", "6habFhsOp2NvshLv26DqMb"])
    );
  });

  test("renders correctly on desktop", async () => {
    setViewport(1200);
    const { container } = render(Playlist);
    const playlist = container.querySelector(".playlist");
    const styles = getComputedStyle(playlist!);
    expect(styles.gridTemplateColumns.split(" ").length).toBeGreaterThan(0);
  });

  test("renders in single column on mobile", async () => {
    setViewport(500);
    const { container } = render(Playlist);

    const playlist = container.querySelector(".playlist");
    const styles = getComputedStyle(playlist!);
    expect(styles.gridTemplateColumns.split(" ").length).toBe(1);
  });
});

// test landing page responsive layout
describe("LandingPage component", () => {
  beforeEach(() => {
    // Reset viewport between tests
    setViewport(1200);
  });

  test("renders steps horizontally on desktop", () => {
    setViewport(1200);
    const { container } = render(LandingPage);

    const steps = container.querySelector(".steps");
    expect(steps).toBeTruthy();
    expect(steps!.children.length).toBe(3);
  });

  test("renders steps in single column on mobile", () => {
    setViewport(500);
    const { container } = render(LandingPage);

    const steps = container.querySelector(".steps");
    expect(steps).toBeTruthy();
    expect(steps!.children.length).toBe(3);
  });
});

// test location page responsive layout
describe("LocationPage responsive layout", () => {
  test("renders location card and input on desktop", () => {
    setViewport(1200);
    const { container } = render(LocationPage);

    const card = container.querySelector(".location-card");
    const input = container.querySelector(".location-input");
    const title = container.querySelector(".location-title");

    expect(card).toBeTruthy();
    expect(input).toBeTruthy();
    expect(title?.textContent).toBe("ForecastFM");
  });

  test("renders correctly on small screens (mobile)", () => {
    setViewport(500);
    const { container } = render(LocationPage);

    const input = container.querySelector(".location-input");
    const title = container.querySelector(".location-title");
    const card = container.querySelector(".location-card");

    expect(input).toBeTruthy();
    expect(title).toBeTruthy();
    expect(card).toBeTruthy();
  });
});

describe("Playlist weather display", () => {
  beforeEach(() => {
    // mock localStorage for testing
    localStorage.setItem(
      "trackIds",
      JSON.stringify(["4uLU6hMCjMI75M1A2tKUQC", "6habFhsOp2NvshLv26DqMb"])
    );
  });

  test("displays location and temperature", () => {
    const { container } = render(Playlist, {
      props: {
        location: "New York, NY",
        temperature: "72°F Cloudy",
        weatherCode: 2, // maps to "Cloudy"
      },
    });

    const locationEl = container.querySelector(".weather-text .location");
    expect(locationEl?.textContent).toBe("New York, NY");

    const temperatureEl = container.querySelector(".weather-text .temperature");
    expect(temperatureEl?.textContent).toBe("72°F Cloudy");
  });

  test("displays correct weather icon", () => {
    const { container } = render(Playlist, {
      props: {
        location: "New York, NY",
        temperature: "72°F Cloudy",
        weatherCode: 2, // maps to "Cloudy"
      },
    });

    const icon = container.querySelector(".logo img");
    expect(icon?.getAttribute("src")).toBe("/assets/Cloudy.png");
    expect(icon?.getAttribute("alt")).toBe("Cloudy");
  });
});
