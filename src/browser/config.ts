import puppeteer from "puppeteer"

export const getBrowser = async () => {
  return await puppeteer.launch({
    userDataDir: "./src/browser/userData",
    ignoreHTTPSErrors: true,
  })
}
