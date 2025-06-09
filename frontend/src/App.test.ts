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
import { render } from "@testing-library/svelte";
import { describe, test, expect, beforeEach } from "vitest";
import App from "./App.svelte";
import Playlist from "./Playlist.svelte";

test("App", async () => {
  render(App);
});

function setViewport(width: number, height: number = 800) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
}

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
