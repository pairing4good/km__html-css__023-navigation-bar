const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });  

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the list', () => {
  it('should not be indented', async () => {
    const value = await page.$eval('ul', (list) => {
      let listStyle = window.getComputedStyle(list);
      return listStyle.getPropertyValue('margin');
    });
      
    expect(value).toBe('0px');
  });
  
  it('should not be padded', async () => {
    const value = await page.$eval('ul', (list) => {
      let listStyle = window.getComputedStyle(list);
      return listStyle.getPropertyValue('padding');
    });
    
    expect(value).toBe('0px');
  });
  
  it('should not have bullet points', async () => {
    const value = await page.$eval('ul', (list) => {
      let listStyle = window.getComputedStyle(list);
      return listStyle.getPropertyValue('list-style-type');
    });
      
    expect(value).toBe('none');
  });
});

describe('the anchors', () => {
  it('should be padded with 10px', async () => {
    const display = await page.$eval('a', (anchor) => {
      let listStyle = window.getComputedStyle(anchor);
      return listStyle.getPropertyValue('display');
    });

    const padding = await page.$eval('a', (anchor) => {
      let listStyle = window.getComputedStyle(anchor);
      return listStyle.getPropertyValue('padding');
    });
      
    expect(display).toBe('block');
    expect(padding).toBe('10px');
  });
  
  it('should not be underlined', async () => {
    const value = await page.$eval('a', (anchor) => {
      let listStyle = window.getComputedStyle(anchor);
      return listStyle.getPropertyValue('text-decoration');
    });
      
    expect(value).toContain('none');
  });
  
  it('should have black text', async () => {
    const value = await page.$eval('a', (anchor) => {
      let listStyle = window.getComputedStyle(anchor);
      return listStyle.getPropertyValue('color');
    });
      
    expect(value).toBe('rgb(0, 0, 0)');
  });
});
