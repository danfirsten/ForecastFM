import { expect, test, vitest } from 'vitest';
import { mount } from 'svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import preprocess from 'svelte-preprocess';
import App from "App.svelte";
// import '@testing-library/jest-dom';
// import { vi } from 'vitest';


test('App', async () => {
    render(App);
});