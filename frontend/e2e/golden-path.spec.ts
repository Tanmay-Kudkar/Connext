import { expect, test, type Page } from "@playwright/test";

async function demoLogin(page: Page, as: "student" | "faculty") {
  await page.goto("/");
  await page.getByRole("button", { name: as === "faculty" ? "Demo as faculty" : "Demo as student" }).click();
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
}

test.describe("golden path", () => {
  test("onboard demo lands on feed", async ({ page }) => {
    await demoLogin(page, "student");
    await expect(page.getByText(/r\//).first()).toBeVisible();
  });

  test("college email OTP rejects gmail", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("College email").fill("someone@gmail.com");
    await page.getByRole("button", { name: "Continue with college email" }).click();
    await expect(page.getByTestId("auth-error")).toContainText(/college email/i);
  });

  test("mock LinkedIn is labelled simulated and fills passport", async ({ page }) => {
    await demoLogin(page, "student");
    await page.goto("/mock/linkedin");
    await expect(page.getByText(/Demo integration/)).toBeVisible();
    await expect(page.getByText(/simulated/i)).toBeVisible();
    await page.getByRole("button", { name: /Allow Connext/ }).click();
    await expect(page).toHaveURL(/passport/);
    await expect(page.getByText(/LinkedIn connected|CS student/)).toBeVisible();
  });

  test("community thread is nested without leaking college on anon posts", async ({ page }) => {
    await demoLogin(page, "student");
    await page.goto("/post/p1");
    await expect(page.getByRole("heading", { name: /full table scan/i })).toBeVisible();
    await expect(page.getByText("Verified student").first()).toBeVisible();
    await expect(page.getByText("This unblocked me")).toHaveCount(0);
    await expect(page.getByText(/Run ANALYZE|query planner|enable_seqscan/i).first()).toBeVisible();
  });

  test("ask shows similar threads or fail-open banner", async ({ page }) => {
    await demoLogin(page, "student");
    await page.goto("/ask");
    await page.getByLabel("Title").fill("Why does Postgres seq scan with an index on email");
    await expect(
      page.getByText(/Similar threads|Couldn't check similar threads|full table scan|index/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("unblock awards helper once and dashboard reads ledger", async ({ page, browser }) => {
    await demoLogin(page, "student");
    await page.goto("/ask");
    await page.getByLabel("Community").selectOption("dbms");
    const title = `How do I stop a seq scan on email ${Date.now()}`;
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Details").fill("Index exists. Planner still sequential scans.");
    await page.getByRole("button", { name: "Post question" }).click();
    await expect(page).toHaveURL(/\/post\//);
    const postUrl = page.url();

    const facultyContext = await browser.newContext();
    const facultyPage = await facultyContext.newPage();
    await demoLogin(facultyPage, "faculty");
    await facultyPage.goto(postUrl);
    await facultyPage.getByPlaceholder(/Help from another campus/i).fill("Run ANALYZE, then EXPLAIN ANALYZE again.");
    await facultyPage.getByRole("button", { name: "Reply" }).click();
    await expect(facultyPage.getByText(/Run ANALYZE/)).toBeVisible();
    await facultyContext.close();

    await page.goto(postUrl);
    await page.getByRole("button", { name: "This unblocked me" }).click();
    await expect(page.getByText("Unblocked").first()).toBeVisible();
    await page.goto("/activity");
    await expect(page.getByText(/XP/i).first()).toBeVisible();
    await expect(page.getByText(/this unblocked me|credits/i).first()).toBeVisible();
  });

  test("Pro mode persists and shows CV-style passport", async ({ page }) => {
    await demoLogin(page, "student");
    await page.goto("/passport");
    await page.getByRole("main").getByRole("button", { name: "Pro", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "pro");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "pro");
    await expect(page.getByText(/Curriculum vitae|ResearchGate|Papers/i).first()).toBeVisible();
  });

  test("map is list-first and recommends a teammate", async ({ page }) => {
    await demoLogin(page, "student");
    await page.goto("/map");
    await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();
    await expect(page.getByText(/Mumbai|Pune|Trichy/).first()).toBeVisible();
    await expect(page.getByText(/Recommended teammates/)).toBeVisible();
    await page.getByRole("button", { name: "Map" }).click();
    await expect(page.getByText(/Coarse clusters/)).toBeVisible();
  });

  test("faculty doubt radar has no identities", async ({ page }) => {
    await demoLogin(page, "faculty");
    await page.goto("/radar");
    await expect(page.getByRole("heading", { name: "Doubt Radar" })).toBeVisible();
    const list = await page.getByTestId("radar-list").innerText();
    expect(list).not.toMatch(/tanmay\.kudkar|@xie|author_id/);
    await expect(page.getByText(/PostgreSQL|indexing|embeddings|open/i).first()).toBeVisible();
  });
});
