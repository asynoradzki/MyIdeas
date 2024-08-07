import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        watchForFileChanges: false,
        defaultCommandTimeout: 4000,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
