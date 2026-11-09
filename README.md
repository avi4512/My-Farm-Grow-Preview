# My Farm Grow Preview

A preview of the My Farm Grow website, a grocery store selling rice, dal, spices and kitchen staples sourced directly from farmers in Andhra Pradesh.

Customers can browse products and prices and find contact details. Online ordering is not open yet, so login, cart, checkout and admin features are switched off in this preview.

## What we sell

| Category | Products | Sold by |
| --- | --- | --- |
| Rice | Regular Rice, Sona Masuri Rice, Brown Rice | 25 kg and 50 kg bags |
| Pulses | Toor Dal, Whole Green Gram | kg |
| Spices | Red Chilli Powder | kg |
| Ghee | Pure Ghee | kg |
| Sweeteners | Natural Jaggery | kg |

We deliver to Vijayawada, Guntur, Visakhapatnam, Tirupati, Rajahmundry, Nellore and surrounding areas.

## Contact

- **Phone and WhatsApp:** +91 87902 04512
- **Address:** Door No. 7-26, Near Ramalayam Temple, Konanki, Piduguralla, Andhra Pradesh
- **Hours:** 7:00 AM to 8:00 PM, all days

## Run it locally

The site is plain HTML, CSS and JavaScript, so there is nothing to install. Open `index.html` in a browser, or start a local server from this folder:

```
python -m http.server 8000
```

Then go to http://localhost:8000. An internet connection is needed because the styles, icons and fonts load from Tailwind CSS, Lucide and Google Fonts.

## Project files

| Path | What it holds |
| --- | --- |
| `index.html` | Page layout, including the About and Contact pages |
| `css/style.css` | Site styling |
| `js/preview.js` | Product list and preview settings |
| `images/` | Product and banner photos |

To change a product, price or image, edit `PREVIEW_PRODUCTS` at the top of `js/preview.js`.

## Photo credits

These photos come from Wikimedia Commons and are licensed under CC BY-SA 4.0:

- [Red chilli powder](https://commons.wikimedia.org/wiki/File:Byadgi_chili_powder.jpg) by GI tagged products
- [Brown rice](https://commons.wikimedia.org/wiki/File:Brown_Rice.jpg) by Gaurav Dhwaj Khadka
- [Ghee](https://commons.wikimedia.org/wiki/File:Pure_Ghee-Homemade-Maharashtra.jpg) by Phadke09
