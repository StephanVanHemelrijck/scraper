const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://www.torfs.be/nl/home";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.get("/scrape", async (req, res) => {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    // Initial scrape of all categories
    const categoryNames = [];
    const categories = $(".button-link");
    categories.map((i, category) => categoryNames.push($(category).text()));

    const scrapedData = await Promise.all(
      categoryNames
        .filter((_, index) => index !== categoryNames.length - 1)
        .map(async (category, index) => {
          const response = await axios.get(
            `https://www.torfs.be/nl/${category.toLowerCase()}collectie/?cgid=${category}collectie&page=1.0&srule=nieuwste&sz=24`
          );
          const $ = cheerio.load(response.data);

          const categoryItems = $(".product-tile");
          const items = [];

          categoryItems.map((i, item) => {
            const image = $(item).find(".tile-image").attr("src");
            const name = $(item).find('[itemprop="name"]').text();
            const brand = $(item).find(".brand").text();
            const colorAmount = $(item)
              .find(".product-tile__color-amount")
              .text();
            const price = $(item)
              .find(
                "div.product-tile__content.product-tile__content--default.content > div.product-tile__price > div > span > span"
              )
              .text();
            items.push({
              image,
              name,
              brand,
              color_amount: colorAmount,
              price,
            });
          });

          return {
            name: category,
            items,
          };
        })
    );

    // Combine results into a single object
    const result = {
      categories: scrapedData,
    };

    res.status(200).send(result);
  } catch (err) {
    console.log("Error scraping data:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
