const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

// puppeteer part
const puppeteer = require("puppeteer");
const PuppeteerMassScreenshots = require("./screen.shooter");

app.use(cors());

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  // event to catch the url when browsed
  socket.on("browse", async ({ url }) => {
    console.log("Here is the URL >>>> ", url);
    // puppeteer part
    const browser = await puppeteer.launch({
      headless: true,
    });
    //👇🏻 creates an incognito browser context
    const context = await browser.createIncognitoBrowserContext();
    //👇🏻 creates a new page in a pristine context.
    const page = await context.newPage();
    await page.setViewport({
        width: 1255,
        height: 800,
    });
    //👇🏻 Fetches the web page
    await page.goto(url);
    //👇🏻 Instance of PuppeteerMassScreenshots takes the screenshots
    const screenshots = new PuppeteerMassScreenshots();
    await screenshots.init(page, socket);
    await screenshots.start();
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});