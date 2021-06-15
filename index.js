require("dotenv").config();
const axios = require("axios");

let totalSpent = 0;
let calls = 0;
let numOrders = 0;

async function main(pagination = "") {
  const {
    data: {
      data: { orders },
    },
  } = await axios.get(
    `https://www.swiggy.com/dapi/order/all?order_id=${pagination}`,
    {
      headers: {
        __fetch_req__: "true",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "if-none-match": process.env.IF_NONE_MATCH,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        cookie: process.env.COOKIE,
      },
      referrer: "https://www.swiggy.com/my-account",
      referrerPolicy: "strict-origin-when-cross-origin",
    }
  );
  calls++;
  totalSpent += orders.reduce((a, b) => {
    return a + Number(b.order_total);
  }, 0);
  const len = orders.length;
  numOrders += len;
  
  if (len < 10) {
    console.log("Finished Scrape. Total Spent : ", totalSpent);
    console.log("Total Calls: ", calls);
    console.log("Total Orders: ", numOrders);
    console.log("Average Order Value: ", Math.round(totalSpent / numOrders));
    return;
  }

  main(orders[len - 1].order_id).catch((e) => {
    console.log("Error scraping:", e);
    writeFileSync("error.json", JSON.stringify(orders[len - 1]));
  });
}
main().catch(console.error);
