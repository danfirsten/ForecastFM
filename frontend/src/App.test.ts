import { test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, test, expect, beforeEach, vi, it } from "vitest";
import App from "./App.svelte";
import Playlist from "./Playlist.svelte";
import LandingPage from "./LandingPage.svelte";
import LocationPage from "./LocationPage.svelte";
import * as spotifyModule from "./SpotifyTest.svelte";
import { push } from "svelte-spa-router";

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

// test playlist page weather display
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

// test playlist page playlist display
const setTrackIds = (ids: string[]) =>
  localStorage.setItem("trackIds", JSON.stringify(ids));

describe("Playlist - song list rendering", () => {
  beforeEach(() => localStorage.clear());

  test("renders a playlist with up to 20 songs", () => {
    const ids = Array.from({ length: 25 }, (_, i) => `track-id-${i}`);
    setTrackIds(ids);

    const { container } = render(Playlist, {
      props: {
        location: "Paris, France",
        temperature: "65°F Cloudy",
        weatherCode: 2, // “Cloudy”
      },
    });

    const songs = container.querySelectorAll(".playlist .song-embed");
    expect(songs.length).toBe(20); // capped at 20

    songs.forEach((div) => {
      const iframe = div.querySelector("iframe");
      expect(iframe).toBeTruthy();
      const src = iframe!.getAttribute("src")!;
      const match = ids.find((id) => src.includes(id));
      expect(match).toBeTruthy();
    });
  });

  test("renders playlist even when fewer than 20 songs supplied", () => {
    const ids = ["alpha", "beta", "gamma"];
    setTrackIds(ids);

    const { container } = render(Playlist);
    const songs = container.querySelectorAll(".playlist .song-embed");
    expect(songs.length).toBe(3);
  });
});

// test landing page get my forecast button
describe("LandingPage", () => {
  test("displays the Get My Forecast button", async () => {
    const { container } = render(LandingPage);
    const button = container.querySelector("#forecast-button");
    expect(button).toBeTruthy(); // Checks that the button exists
    expect(button?.textContent).toMatch(/Get My Forecast/i);
  });

  test("displays the Get My Forecast button and attaches click listener", async () => {
    const addEventListenerSpy = vi.spyOn(
      window.HTMLButtonElement.prototype,
      "addEventListener"
    );
    render(LandingPage);

    // window.onload to simulate browser behavior
    await window.onload?.();

    const button = document.getElementById("forecast-button");
    expect(button).not.toBeNull();

    // Check if click listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    addEventListenerSpy.mockRestore();
  });
});
