import type { Stagehand } from "@browserbasehq/stagehand";



// Export an async function so other files can use it.
export async function openUrl({ stagehand, url }: { stagehand: Stagehand, url: string }) {

    const page = await stagehand.browser.context.activePage() 
    await page?.goto(url, { waitUntil: "load", timeout: 30_000 });

    return {
        url: page?.url(),
        title: await page?.title() 
    }
 
}

// Get the first page currently open in the browser.

// Navigate to the provided URL.
// Wait for the page to load, with a maximum timeout of 30 seconds.

// Return the page's final URL and title.
// Wait for the page title to be retrieved before returning the result.