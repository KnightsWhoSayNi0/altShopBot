const {Client, MessageEmbed} = require("discord.js");
const client = new Client();
const token = require("./token.js")
// make a file token.js with this line in it
// module.exports = "[YOUR DISCORD TOKEN]";]

// all methods for html scraping
const https = require('https') // used for checking websites
const cheerio = require('cheerio')

// custom fetch for Node.js
const fetch = (method, url, payload=undefined) => new Promise((resolve, reject) => {
    https.get(
        url,
        res => {
            const dataBuffers = []
            res.on('data', data => dataBuffers.push(data.toString('utf8')))
            res.on('end', () => resolve(dataBuffers.join('')))
        }
    ).on('error', reject)
})

const scrapeHtml = url => new Promise((resolve, reject) =>{
    fetch('GET', url)
    .then(html => {
      const cheerioPage = cheerio.load(html)
      // cheerioPage is now a loaded html parser with a similar interface to jQuery
      // FOR EXAMPLE, to find a table with the id productData, you would do this:
      const productTable = cheerioPage('table .productData')
  
      // then you would need to reload the element into cheerio again to
      // perform more jQuery like searches on it:
      const cheerioProductTable = cheerio.load(productTable)
      const productRows = cheerioProductTable('tr')
  
      // now we have a reference to every row in the table, the object
      // returned from a cheerio search is array-like, but native JS functions
      // such as .map don't work on it, so we need to do a manually calibrated loop:
      let i = 0
      let cheerioProdRow, prodRowText
      const productsTextData = []
      while(i < productRows.length) {
        cheerioProdRow = cheerio.load(productRows[i])
        prodRowText = cheerioProdRow.text().trim()
        productsTextData.push(prodRowText)
        i++
      }
      resolve(productsTextData)
    })
    .catch(reject)
  })

var prefix = ".";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('message', msg => {
    if (msg.content === prefix + 'ping') {
        msg.reply("Pong!")
    }
    if (msg.content === prefix + 'help') {
        const embed = new MessageEmbed()
            .setTitle('AltShop Bot Help')
            .setColor(0xff0000)
            .setDescription('Prefix is: ' + prefix + '\nCommands:')
            .addField('ping', "Returns Pong!", true)
            .addField('kingalts', "Returns stock and prices for kingalts.shop")
        msg.channel.send(embed);
    }

    //start of commands
    if (msg.content === prefix + 'kingalts') {
        const embed = new MessageEmbed()
            .setTitle('Kingalts.shop')
            .setColor(0xa16464)
            .setThumbnail('https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fkingalts.shop%2Fassets%2Fimg%2Fkingalts.png&f=1&nofb=1')
            .setDescription('Current stock and prices for kingalts.shop')
            .addField('Unbanned NFA', 'Stock: ', true);
        msg.channel.send(embed);

        scrapeHtml('https://shoppy.gg/@penk')
        .then(data => {
        // expect the data returned to be an array of text from each 
        // row in the table from the html we loaded. Now we can do whatever
        // else you want with the scraped data. 
        console.log('data: ', data)
        })
        .catch(err => console.log('err: ', err))
    }
  });

client.login(token)