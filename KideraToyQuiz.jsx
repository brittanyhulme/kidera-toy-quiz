import { useState, useEffect, useRef } from "react";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const LOGO = "https://images.squarespace-cdn.com/content/v1/63f6a22a05d1f52c5fbc9958/828c459a-9f72-4475-8cc5-b0045694bd96/Primary+Logo.png?format=300w";
const BRITTANY_PHOTO = "https://images.squarespace-cdn.com/content/v1/63f6a22a05d1f52c5fbc9958/912db301-e40e-4ff0-99f4-280babba1175/230201-9879+%281%29.JPG";

const K_YELLOW = "#F9C435";
const K_GREEN  = "#6BBF4E";
const K_BLUE   = "#4BAFCC";
const K_PINK   = "#F2607D";
const K_ORANGE = "#F47B20";
const BG       = "#FFFDF7";
const CARD     = "#FFFFFF";
const TEXT     = "#1A1A2E";
const MUTED    = "#6B7280";
const BORDER   = "#E8E4DA";

// ─── AFFILIATE ────────────────────────────────────────────────────────────────
const AFFILIATE_TAG = "brittanyot0c-22";

// Build a verified Amazon AU link. For products with confirmed ASINs use /dp/,
// for everything else use a search link so it always works.
function buildUrl(toy) {
  // Prefer the real affiliate link from the spreadsheet
  if (toy.afflink) return toy.afflink;
  // Then a direct /dp/ link if we have a real ASIN
  if (toy.asin) return `https://www.amazon.com.au/dp/${toy.asin}?tag=${AFFILIATE_TAG}`;
  // Otherwise a search link so it always works
  const q = encodeURIComponent(toy.search || toy.name);
  return `https://www.amazon.com.au/s?k=${q}&tag=${AFFILIATE_TAG}`;
}

// ─── PRODUCT DATABASE ─────────────────────────────────────────────────────────
// img: real squarespace/public CDN URLs from Brittany's own guides, or null
// url: verified amazon.com.au URL where confirmed, else null (falls back to search)
// asin: verified AU ASIN where confirmed
const PRODUCTS = [
  // ── Oct 2026 import: 167 new curated toys (ages 2–8) ──
  {"id": "p325", "name": "Casdon Dyson Cord-Free Toy Vacuum", "age_min": 24, "age_max": 47, "dev_areas": ["cognitive", "social", "language", "selfcare"], "tags": ["pretend-play", "role-play", "tool-use"], "price": 49.0, "asin": "B08Z95RNXV", "afflink": "https://www.amazon.com.au/dp/B08Z95RNXV?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/51NKU7YvR4L._AC_SL1500_.jpg", "note": "It has working suction, which kids love.", "search": "Casdon Dyson Cord-Free Toy Vacuum"},
  {"id": "p326", "name": "Crayola My First Jumbo Crayons", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive"], "tags": ["art", "creative", "drawing", "mark-making"], "price": 10.75, "asin": "B0753DZ7TH", "afflink": "https://www.amazon.com.au/dp/B0753DZ7TH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/613Z6KyVTlL.jpg", "note": "It might feel like a stationery staple, but fat grip crayons are perfect for kids just getting started. They're easier to hold, and little hands don't tire out while those muscles are still building.", "search": "Crayola My First Jumbo Crayons"},
  {"id": "p327", "name": "Fat Brain Toys Air Toobz", "age_min": 24, "age_max": 59, "dev_areas": ["gross", "fine", "sensory", "cognitive"], "tags": ["constructive", "sensory", "cause-effect"], "price": 186.14, "asin": "", "afflink": "https://amzn.to/44gsa0M", "img": "https://m.media-amazon.com/images/I/71xosN2CvgL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "A super engaging sensory toy. The airflow, movement and popping balls encourage experimenting, and it grows with them. Great for little engineers in the making.", "search": "Fat Brain Toys Air Toobz"},
  {"id": "p328", "name": "Fisher-Price Little People Farm Animal Friends", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "sensory", "cognitive", "social", "language"], "tags": ["animals", "dolls", "nurturing", "plush", "pretend-play"], "price": 25.0, "asin": "B07MM6QX97", "afflink": "https://www.amazon.com.au/dp/B07MM6QX97?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61GeL-C3NGL.jpg", "note": "Chunky animals for pretend play, naming and animal noises.", "search": "Fisher-Price Little People Farm Animal Friends"},
  {"id": "p329", "name": "Goliath Jelly Blox Creative Kit (20 blocks)", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 35.05, "asin": "B0CP4BSFB9", "afflink": "https://www.amazon.com.au/dp/B0CP4BSFB9?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91iq1JV8eeL.jpg", "note": "A great next step in building, with a fun sensory element. They can enjoy squishing and feeling the blocks as well as building with them.", "search": "Goliath Jelly Blox Creative Kit (20 blocks)"},
  {"id": "p330", "name": "Green Toys Dump Truck", "age_min": 24, "age_max": 47, "dev_areas": ["sensory", "social", "language", "regulation"], "tags": ["vehicles"], "price": 54.95, "asin": "B0747DHSPL", "afflink": "https://www.amazon.com.au/dp/B0747DHSPL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/812M67CRroL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Great for pretend play or sand play, because it's got the tray.", "search": "Green Toys Dump Truck"},
  {"id": "p331", "name": "Green Toys Stacking Cups", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "sensory", "cognitive", "regulation", "selfcare"], "tags": ["constructive", "sorting", "cause-effect"], "price": 15.0, "asin": "B004K6KM8A", "afflink": "https://www.amazon.com.au/dp/B004K6KM8A?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81lhmz3CksL.jpg", "note": "Open-ended and only $15. Build a tower, nest them, use them as buckets or hats in the sandpit and bath, make mountains, or hide toys under them.", "search": "Green Toys Stacking Cups"},
  {"id": "p332", "name": "Hurtle Mini Kickboard 3 Wheel Scooter", "age_min": 24, "age_max": 35, "dev_areas": ["gross", "sensory", "social"], "tags": ["balance", "gross", "movement", "outdoor", "vestibular"], "price": 54.39, "asin": "B0DXRRSHZQ", "afflink": "https://www.amazon.com.au/dp/B0DXRRSHZQ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61X7kNFDbhL.jpg", "note": "Hopefully they'll ride it all the way to the park and back, but you may end up carrying it. Who knows?", "search": "Hurtle Mini Kickboard 3 Wheel Scooter"},
  {"id": "p333", "name": "Kids Musical Instruments Set", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "sensory", "cognitive", "language"], "tags": ["audio", "music", "rhythm"], "price": 39.99, "asin": "B06ZXRKGB2", "afflink": "https://www.amazon.com.au/dp/B06ZXRKGB2?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71dbC8nURrL.jpg", "note": "If you can handle the noise, I think it's a really great pick. Instruments let them dance along to their favourite songs and express themselves.", "search": "Kids Musical Instruments Set"},
  {"id": "p334", "name": "Kinderfeets Tiny Tot 2-in-1 Trike Balance Bike", "age_min": 24, "age_max": 35, "dev_areas": ["gross", "sensory", "social"], "tags": ["balance", "gross", "movement", "outdoor", "vestibular"], "price": 134.94, "asin": "B019J54GV0", "afflink": "https://www.amazon.com.au/dp/B019J54GV0?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/51OnH0X3dcL.jpg", "note": "Starts as a trike and becomes a balance bike, and it's wooden.", "search": "Kinderfeets Tiny Tot 2-in-1 Trike Balance Bike"},
  {"id": "p335", "name": "LEGO DUPLO Bluey Ice Cream Trip", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive", "social"], "tags": ["blocks-tiles", "constructive", "cooking", "open-ended", "pretend-play", "role-play"], "price": 34.0, "asin": "B0DWF16F36", "afflink": "https://www.amazon.com.au/dp/B0DWF16F36?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81yv7xwJu3L.jpg", "note": "Really like this one. It has the characters, the ice cream stand is a simple first build, and the car gets used in so many kinds of play.", "search": "LEGO DUPLO Bluey Ice Cream Trip"},
  {"id": "p336", "name": "LEGO DUPLO Classic Brick Box 10913", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 45.0, "asin": "B07W4KVGJM", "afflink": "https://www.amazon.com.au/dp/B07W4KVGJM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81TwXuCHF5L._AC_SL1500_.jpg", "note": "Really love this. Once they've got people, building a little town gives them bigger scenes to play out, which lines up with how pretend play develops.", "search": "LEGO DUPLO Classic Brick Box 10913"},
  {"id": "p337", "name": "LEGO DUPLO Classic Deluxe Brick Box", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 63.99, "asin": "B07WLMV14S", "afflink": "https://www.amazon.com.au/dp/B07WLMV14S?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81TwXuCHF5L.jpg", "note": "It has a playground with a slide, which is so cool. Same reasons as the Classic box, with more to build.", "search": "LEGO DUPLO Classic Deluxe Brick Box"},
  {"id": "p338", "name": "Light-Up Stepping Stones", "age_min": 24, "age_max": 35, "dev_areas": ["gross", "fine", "sensory", "cognitive"], "tags": ["balance", "heavy-work", "movement", "sensory", "tactile", "vestibular"], "price": 59.99, "asin": "", "afflink": "https://amzn.to/4p0Z1hL", "img": "https://m.media-amazon.com/images/I/71e6uCuwgqL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Perfect for toddlers who love movement. Balance, coordination and body awareness, plus lights that come on when they step, hop or roll something onto them. Cause and effect that toddlers adore.", "search": "Light-Up Stepping Stones"},
  {"id": "p339", "name": "Little Tikes Bluey Beach Water Table", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "sensory", "social", "language", "regulation"], "tags": ["pouring", "sensory", "water"], "price": 119.0, "asin": "B0D8XLC5TR", "afflink": "https://www.amazon.com.au/dp/B0D8XLC5TR?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71vmcTBlxoL.jpg", "note": "It's so cute that the characters can swim around the lazy river on the outside. Play out beach days and bring in some pretend play too.", "search": "Little Tikes Bluey Beach Water Table"},
  {"id": "p340", "name": "Little Tikes Cozy Coupe", "age_min": 24, "age_max": 35, "dev_areas": ["gross", "social"], "tags": ["balance", "gross", "movement", "outdoor", "vehicles", "vestibular"], "price": 139.0, "asin": "B01LY451EC", "afflink": "https://www.amazon.com.au/dp/B01LY451EC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61DJnAztRgL.jpg", "note": "Great for riding around the backyard. It's been around forever, so it's clearly a classic.", "search": "Little Tikes Cozy Coupe"},
  {"id": "p341", "name": "MEGA BLOKS First Builders Big Building Bag", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 25.0, "asin": "B007GE75HY", "afflink": "https://www.amazon.com.au/dp/B007GE75HY?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81VQ2cZO54L.jpg", "note": "Great if your child is into building and stacking. A nice step from wooden blocks to interlocking pieces that are big enough for two-year-olds to master.", "search": "MEGA BLOKS First Builders Big Building Bag"},
  {"id": "p342", "name": "Melissa & Doug Mine to Love Time to Eat Set", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["nurturing", "pretend-play", "role-play"], "price": 58.21, "asin": "B0037UP9GU", "afflink": "https://www.amazon.com.au/dp/B0037UP9GU?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71jw1tP1FiL.jpg", "note": "Great if your little one likes baby dolls, especially if they're seeing young babies around them or have a younger sibling.", "search": "Melissa & Doug Mine to Love Time to Eat Set"},
  {"id": "p343", "name": "Melissa & Doug Safari Chunky Puzzle", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["animals", "jigsaw", "problem-solving", "puzzle"], "price": 19.99, "asin": "B000B9RHYC", "afflink": "https://www.amazon.com.au/dp/B000B9RHYC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/713sIjqRYML.jpg", "note": "If your child can do peg puzzles with the little knobs, this is a good next step. Problem solving, hand-eye coordination and visual perception. Name the animals and colours, make the animal sounds, or use the pieces in pretend play. I love the animals in this one.", "search": "Melissa & Doug Safari Chunky Puzzle", "fam": "jigsaw"},
  {"id": "p344", "name": "Melissa & Doug Water Wow! On the Go", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "sensory", "cognitive", "regulation"], "tags": ["pouring", "sensory", "water"], "price": 10.99, "asin": "B00COLV64C", "afflink": "https://www.amazon.com.au/dp/B00COLV64C?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71hFfRWgAzL.jpg", "note": "I can vouch for this 100%. It's a core item in my kids' travel kit, because every time I tested it, this was the one kids kept coming back to and spent the longest on. And it's reusable.", "search": "Melissa & Doug Water Wow! On the Go"},
  {"id": "p345", "name": "Montessori Toddler Busy Board", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "sensory", "cognitive", "social", "language", "selfcare"], "tags": ["sensory", "tactile", "vehicles"], "price": 32.99, "asin": "B0BC95TQQS", "afflink": "https://www.amazon.com.au/dp/B0BC95TQQS?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71Mt++bT9sL.jpg", "note": "For kids who love fiddling, picking things up, pressing buttons and doing all the things.", "search": "Montessori Toddler Busy Board"},
  {"id": "p346", "name": "Munchkin Falls Bath Toy", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "sensory", "cognitive", "regulation"], "tags": ["bath", "sensory", "water"], "price": 16.95, "asin": "B01AHOKF0S", "afflink": "https://www.amazon.com.au/dp/B01AHOKF0S?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61u4MUTCSFL.jpg", "note": "Pour the water and watch it fall through and spin the windmill. It sticks onto the side of the bath, or use it in any water play.", "search": "Munchkin Falls Bath Toy"},
  {"id": "p347", "name": "Peppa Pig Family of Five with Baby Evie", "age_min": 24, "age_max": 59, "dev_areas": ["cognitive", "social", "language"], "tags": ["dolls", "nurturing", "plush", "pretend-play"], "price": 11.95, "asin": "B0DK7RDFMG", "afflink": "https://www.amazon.com.au/dp/B0DK7RDFMG?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61d+qq151nL.jpg", "note": "Perfect for adding to any pretend play, and a toy they won't outgrow for years.", "search": "Peppa Pig Family of Five with Baby Evie"},
  {"id": "p348", "name": "Play-Doh Starter Set", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "messy", "playdough", "tactile"], "price": 15.0, "asin": "B00TPMDNSU", "afflink": "https://www.amazon.com.au/dp/B00TPMDNSU?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81l-xfDvY-L.jpg", "note": "I don't know many kids who don't like Play-Doh, and $15 is a great price for four colours plus the tools. Creating, making, and building hand strength and fine motor skills.", "search": "Play-Doh Starter Set"},
  {"id": "p349", "name": "Somersault Wooden Hammer Bench", "age_min": 24, "age_max": 35, "dev_areas": ["fine", "sensory", "cognitive", "selfcare"], "tags": ["cause-effect", "tool-use", "sensory"], "price": 10.0, "asin": "B00005LOXV", "afflink": "https://www.amazon.com.au/dp/B00005LOXV?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/615xQ9XYJkL._AC_SL1500_.jpg", "note": "The simplest version: hit the peg, it goes down. It's also early tool practice, which helps later with colouring, drawing and holding cutlery.", "search": "Somersault Wooden Hammer Bench"},
  {"id": "p350", "name": "Step2 Spill & Splash Seaway Water Table", "age_min": 24, "age_max": 47, "dev_areas": ["sensory", "regulation"], "tags": ["bath", "pouring", "sensory", "water"], "price": 137.55, "asin": "B0193MPQK4", "afflink": "https://www.amazon.com.au/dp/B0193MPQK4?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81kiGHwFbxL.jpg", "note": "It looks like it holds a bit more water, for those summer days when you don't mind getting wet.", "search": "Step2 Spill & Splash Seaway Water Table"},
  {"id": "p351", "name": "That's Not My Puppy (Usborne)", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "sensory", "cognitive", "language"], "tags": ["animals", "books", "storytelling"], "price": 8.0, "asin": "1474959067", "afflink": "https://www.amazon.com.au/dp/1474959067?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81YditZPTQL.jpg", "note": "A cute touch and feel book. The textures add an extra interactive bit that keeps little ones engaged in reading.", "search": "That's Not My Puppy (Usborne)"},
  {"id": "p352", "name": "Toniebox 2 Starter Set", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "sensory", "cognitive", "language", "selfcare"], "tags": ["art", "audio", "craft", "creative", "music", "storytelling"], "price": 189.0, "asin": "B0FNC65HVK", "afflink": "https://www.amazon.com.au/dp/B0FNC65HVK?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/51V3bKk3f-L._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Really popular. I don't have one myself, but I've seen countless parents rave about it. A great screen-free way for kids to listen to music and stories.", "search": "Toniebox 2 Starter Set"},
  {"id": "p353", "name": "Toomies Bathtime Barista", "age_min": 24, "age_max": 47, "dev_areas": ["fine", "sensory", "cognitive", "social", "language", "regulation"], "tags": ["bath", "cooking", "pretend-play", "role-play", "sensory", "water"], "price": 34.0, "asin": "B0C74F4FSP", "afflink": "https://www.amazon.com.au/dp/B0C74F4FSP?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81WadewOcgL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "How cute is this, especially if you've got a coffee machine at home.", "search": "Toomies Bathtime Barista"},
  {"id": "p354", "name": "Where Is the Green Sheep?", "age_min": 24, "age_max": 47, "dev_areas": ["cognitive", "language"], "tags": ["animals", "books", "storytelling"], "price": 10.0, "asin": "0143501763", "afflink": "https://www.amazon.com.au/dp/0143501763?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91U63GT2PYL._AC_UL480_FMwebp_QL65_.jpg", "note": "A famous one, with over a million copies sold. Cheap, and a book they'll ask for again and again.", "search": "Where Is the Green Sheep?"},
  {"id": "p355", "name": "Backpack Buddy Busy Book", "age_min": 36, "age_max": 47, "dev_areas": ["fine", "cognitive", "social", "language", "selfcare"], "tags": ["books", "pretend-play", "role-play", "storytelling", "vehicles"], "price": 89.99, "asin": "", "afflink": "https://www.mybackpackbuddy.com/products/backpack-buddy", "img": "https://www.mybackpackbuddy.com/cdn/shop/files/Backpack-Buddy-Product-37_1.jpg?v=1727705926", "note": "Lots of activity pages packed into one zip-up busy book: an Australia map puzzle, build a house, a car page, colour matching, tell the time, and pack your bag, which gets big points for building independence. Made by a small Perth-based business.", "search": "Backpack Buddy Busy Book"},
  {"id": "p356", "name": "Bluey and Bingo Supermarket Playset", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["pretend-play", "role-play"], "price": 84.95, "asin": "B0DQ6R6CXX", "afflink": "https://www.amazon.com.au/dp/B0DQ6R6CXX?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81MQkNfDUTL.jpg", "note": "Kids often play out going to the shops, because they're often going with a family member.", "search": "Bluey and Bingo Supermarket Playset"},
  {"id": "p357", "name": "Bluey Wooden Tea Party Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["art", "cooking", "craft", "creative", "pretend-play", "role-play"], "price": 39.95, "asin": "B0BZZZLN8K", "afflink": "https://www.amazon.com.au/dp/B0BZZZLN8K?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71z0CUQUJgL._AC_SL1500_.jpg", "note": "Eating and drinking is one of the first scenes kids play out. Get more use out of it by playing cafés, where they bring you your coffee or tea order.", "search": "Bluey Wooden Tea Party Set"},
  {"id": "p358", "name": "Bluey XL House Playset", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["pretend-play", "role-play"], "price": 229.13, "asin": "B09Q4JP1XL", "afflink": "https://www.amazon.com.au/dp/B09Q4JP1XL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81ENmPTAaaL.jpg", "note": "As kids' play gets more complicated, they need a bigger scene. A playhouse or dollhouse is a great way to do that, with bigger stories where the characters play out their day in a house.", "search": "Bluey XL House Playset"},
  {"id": "p359", "name": "Connetix 47 Piece Ball Run Launcher Pack", "age_min": 36, "age_max": 59, "dev_areas": ["gross", "fine", "cognitive", "selfcare"], "tags": ["blocks-tiles", "cause-effect", "constructive", "gross", "movement", "open-ended", "outdoor", "problem-solving", "sports"], "price": 75.0, "asin": "", "afflink": "https://link.amazon/B09GT3jDu", "img": "https://m.media-amazon.com/images/I/61FHULJNkLL._AC_SL1500_.jpg", "note": "Build a run, launch the ball, see if it works, make an adjustment.", "search": "Connetix 47 Piece Ball Run Launcher Pack"},
  {"id": "p360", "name": "Crayola Color Wonder Mess Free Colouring", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "sensory", "cognitive", "regulation"], "tags": ["art", "creative", "drawing", "mark-making"], "price": 29.56, "asin": "", "afflink": "https://link.amazon/B00RyONZr", "img": "https://m.media-amazon.com/images/I/81qrREEpczL.jpg", "note": "A similar idea to Water Wow. If you like the sound of that but don't want water everywhere, this is a good pick. The colour only shows up on the special paper.", "search": "Crayola Color Wonder Mess Free Colouring"},
  {"id": "p361", "name": "Hape Dynamo Dominoes", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["board-game", "turn-taking"], "price": 69.99, "asin": "B07CM7D8WM", "afflink": "https://www.amazon.com.au/dp/B07CM7D8WM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71gZ0Uk0f0L._AC_UL480_FMwebp_QL65_.jpg", "note": "Not just a regular domino set. It comes with extras like a bell and stairs, for kids who love to build things and knock them over.", "search": "Hape Dynamo Dominoes"},
  {"id": "p362", "name": "KidBloom Kids Pretend Tool Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["art", "craft", "creative", "open-ended", "pretend-play", "role-play", "tool-use"], "price": 31.99, "asin": "B0F6CF58MF", "afflink": "https://www.amazon.com.au/dp/B0F6CF58MF?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81q9dYLqn+L.jpg", "note": "The costume turns them into a tradie, a mechanic, maybe an electrician.", "search": "KidBloom Kids Pretend Tool Set"},
  {"id": "p363", "name": "Kinetic Sand Construction Site Folding Sandbox", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "sensory", "social", "language", "regulation", "selfcare"], "tags": ["constructive", "messy", "open-ended", "sand", "sensory", "tactile"], "price": 39.0, "asin": "B084BNW2PW", "afflink": "https://www.amazon.com.au/dp/B084BNW2PW?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81s6oint9sL.jpg", "note": "Sensory play that packs away into its own box, with trucks for pretend play.", "search": "Kinetic Sand Construction Site Folding Sandbox"},
  {"id": "p364", "name": "KRIDDO Toddler Tricycle", "age_min": 36, "age_max": 47, "dev_areas": ["gross", "sensory", "social"], "tags": ["balance", "gross", "movement", "outdoor", "vestibular"], "price": 76.88, "asin": "B0B5MVCKCC", "afflink": "https://www.amazon.com.au/dp/B0B5MVCKCC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71p-s1Z4uQL._AC_SL1500_.jpg", "note": "A first trike for pedalling around the backyard or down to the park.", "search": "KRIDDO Toddler Tricycle"},
  {"id": "p365", "name": "LEGO DUPLO 3-in-1 Construction Vehicles", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended", "vehicles"], "price": 29.99, "asin": "B01MTWBPPI", "afflink": "https://www.amazon.com.au/dp/B01MTWBPPI?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81FPOPCCPJL.jpg", "note": "Three different vehicles from one set of bricks.", "search": "LEGO DUPLO 3-in-1 Construction Vehicles"},
  {"id": "p366", "name": "Magna-Tiles Classic 100-Piece Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 116.96, "asin": "B000CBSNRY", "afflink": "https://www.amazon.com.au/dp/B000CBSNRY?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71bRwQFK1vL.jpg", "note": "A good set if you're just getting started with magnet tiles.", "search": "Magna-Tiles Classic 100-Piece Set"},
  {"id": "p367", "name": "Melissa & Doug Cutting Food Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language", "selfcare"], "tags": ["cooking", "pretend-play", "role-play"], "price": 52.82, "asin": "B000GKD09C", "afflink": "https://www.amazon.com.au/dp/B000GKD09C?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/616z3oPgRvL.jpg", "note": "They're not just food: they cut apart and stick back together, so they can play chef and make you lunch. More tool use and fine motor skills too.", "search": "Melissa & Doug Cutting Food Set"},
  {"id": "p368", "name": "Melissa & Doug Examine & Treat Pet Vet Play Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["animals", "nurturing", "pretend-play", "role-play"], "price": 34.0, "asin": "B07TWN41KX", "afflink": "https://www.amazon.com.au/dp/B07TWN41KX?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/714NIH2CVFL._AC_SL1500_.jpg", "note": "This time they get to be the vet, with a plush dog and cat to look after.", "search": "Melissa & Doug Examine & Treat Pet Vet Play Set"},
  {"id": "p369", "name": "Melissa & Doug Get Well Doctor's Kit", "age_min": 36, "age_max": 59, "dev_areas": ["cognitive", "social", "language"], "tags": ["nurturing", "pretend-play", "role-play"], "price": 54.0, "asin": "B07VNB8BV9", "afflink": "https://www.amazon.com.au/dp/B07VNB8BV9?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71+q3oYOQSL.jpg", "note": "Handy before a real doctor or dentist visit, too.", "search": "Melissa & Doug Get Well Doctor's Kit"},
  {"id": "p370", "name": "Melissa & Doug Reusable Sticker Pad (Vehicles)", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "language"], "tags": ["art", "craft", "creative", "vehicles"], "price": 13.99, "asin": "122308079X", "afflink": "https://www.amazon.com.au/dp/122308079X?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81sKbswekkL.jpg", "note": "I have to vouch for these, because a reusable sticker book is in my travel kit. Instead of one-time stickers, they go on and come off over and over, so kids can create endless scenes. Stickers have a special novelty that makes them fun, and the peeling and placing is great fine motor work. There's also a puffy Safari version.", "search": "Melissa & Doug Reusable Sticker Pad (Vehicles)"},
  {"id": "p371", "name": "Melissa & Doug Water Wow! Farm", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "sensory", "cognitive", "regulation"], "tags": ["animals", "pouring", "sensory", "water"], "price": 10.99, "asin": "B06XCV39K9", "afflink": "https://www.amazon.com.au/dp/B06XCV39K9?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71r0G25vvFL.jpg", "note": "I can vouch for this 100%. A Water Wow is a core item in my kids' travel kit, because every time I tested it, this was the one kids kept coming back to and spent the longest on. And it's reusable.", "search": "Melissa & Doug Water Wow! Farm"},
  {"id": "p372", "name": "Mini Micro Deluxe Scooter (3 wheel)", "age_min": 36, "age_max": 47, "dev_areas": ["gross", "sensory", "social"], "tags": ["balance", "gross", "movement", "outdoor", "vestibular"], "price": 169.95, "asin": "B01BE0J9O2", "afflink": "https://www.amazon.com.au/dp/B01BE0J9O2?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61H0qLEvCSL.jpg", "note": "Hopefully they'll ride it all the way to the park and back, but you may end up carrying it. Who knows?", "search": "Mini Micro Deluxe Scooter (3 wheel)"},
  {"id": "p373", "name": "Montessori Treasure Chest", "age_min": 36, "age_max": 47, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["sensory", "problem-solving", "sorting"], "price": 45.99, "asin": "", "afflink": "https://amzn.to/4psamIH", "img": "https://m.media-amazon.com/images/I/81d14HaFFqL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Hands-on discovery that supports fine motor skills, colour and number recognition, sequencing and independent problem solving.", "search": "Montessori Treasure Chest"},
  {"id": "p374", "name": "National Geographic 10 Piece Balance Stepping Stones", "age_min": 36, "age_max": 47, "dev_areas": ["gross", "fine", "sensory", "social"], "tags": ["balance", "heavy-work", "movement", "sensory", "tactile", "vestibular"], "price": 54.99, "asin": "B0C95JJC33", "afflink": "https://www.amazon.com.au/dp/B0C95JJC33?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91p83xGiuCL._AC_SL1500_.jpg", "note": "A great open-ended pick. Hats, bowls, buckets, stepping stones, or an obstacle course. In my clinic the orange one often gets used as a fireplace.", "search": "National Geographic 10 Piece Balance Stepping Stones"},
  {"id": "p375", "name": "Orchard Toys Shopping List", "age_min": 36, "age_max": 47, "dev_areas": ["cognitive", "social", "language"], "tags": ["board-game", "pretend-play", "role-play", "turn-taking"], "price": 19.99, "asin": "B0007VTA5S", "afflink": "https://www.amazon.com.au/dp/B0007VTA5S?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91fudSEdTxL._AC_SX679_.jpg", "note": "I love the theme. An early board game linked to a real life skill, going shopping. That's a win.", "search": "Orchard Toys Shopping List"},
  {"id": "p376", "name": "Peaceable Kingdom Count Your Chickens", "age_min": 36, "age_max": 59, "dev_areas": ["cognitive", "social", "language"], "tags": ["animals", "board-game", "turn-taking"], "price": 24.92, "asin": "B004HVKAAS", "afflink": "https://www.amazon.com.au/dp/B004HVKAAS?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81lNgr5VaoL.jpg", "note": "A cooperative game, so nobody loses. You can't really expect kids this age to cope well with losing yet.", "search": "Peaceable Kingdom Count Your Chickens"},
  {"id": "p377", "name": "Play-Doh Super Sizzlin' Kitchen Playset", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["cooking", "creative", "messy", "playdough", "pretend-play", "role-play", "tactile"], "price": 86.99, "asin": "B0G2TC2HG8", "afflink": "https://www.amazon.com.au/dp/B0G2TC2HG8?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81Gx32tjULL.jpg", "note": "So cool. A little pasta maker, a stovetop, a card machine, a cheese maker, and you can make tomatoes, mushrooms, lettuce and burgers. A really cool way to set up a play kitchen. I really like this one.", "search": "Play-Doh Super Sizzlin' Kitchen Playset"},
  {"id": "p378", "name": "PLAYMOBIL Junior Airport Shuttle Bus", "age_min": 36, "age_max": 59, "dev_areas": ["cognitive", "social", "language"], "tags": ["vehicles"], "price": 35.99, "asin": "B0CS7SWXBJ", "afflink": "https://www.amazon.com.au/dp/B0CS7SWXBJ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81CPqE4Nz0L.jpg", "note": "How cool is this? The people have little suitcases that fit inside the bus. I'm a big fan of play where the bus picks people up and drops them off. It's a play loop that can go all day with different stories. Absolutely love this one.", "search": "PLAYMOBIL Junior Airport Shuttle Bus"},
  {"id": "p379", "name": "Rocket Air Launcher", "age_min": 36, "age_max": 47, "dev_areas": ["gross", "social"], "tags": ["gross", "movement", "outdoor"], "price": 35.66, "asin": "", "afflink": "https://amzn.to/4pCf9XK", "img": "https://m.media-amazon.com/images/I/71093GmxSfS._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Outdoor movement, coordination and turn taking, and always a hit at birthday parties.", "search": "Rocket Air Launcher"},
  {"id": "p380", "name": "Schleich Farm World Animal Set", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["animals"], "price": 49.99, "asin": "B0BSP2WZSS", "afflink": "https://www.amazon.com.au/dp/B0BSP2WZSS?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81DF78Wy68L.jpg", "note": "Realistic animals that end up in every kind of play.", "search": "Schleich Farm World Animal Set"},
  {"id": "p381", "name": "Shuttle Art Dot Markers (15 colours)", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 20.99, "asin": "B09M6T4QVV", "afflink": "https://www.amazon.com.au/dp/B09M6T4QVV?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71mpkmQjO7L.jpg", "note": "I have a set of these and quite like them. A good one for kids who aren't interested in drawing or writing. They still work on grasp, they're just a bit of extra fun.", "search": "Shuttle Art Dot Markers (15 colours)"},
  {"id": "p382", "name": "Take-Apart Dinosaur Construction Kit", "age_min": 36, "age_max": 59, "dev_areas": ["fine", "cognitive", "language"], "tags": ["art", "constructive", "craft", "creative", "dinosaurs", "open-ended"], "price": 28.99, "asin": "", "afflink": "https://amzn.to/3MnKoaw", "img": "https://images.squarespace-cdn.com/content/v1/63f6a22a05d1f52c5fbc9958/5ecaacf8-16f7-4d71-9c53-06a60f47af1d/81EGLaBn2sL._AC_SX679_.jpg", "note": "Sequencing, fine motor strength and problem solving through tool-based play, plus lots of imaginative storytelling.", "search": "Take-Apart Dinosaur Construction Kit"},
  {"id": "p383", "name": "TOMY Pop Up Pirate", "age_min": 36, "age_max": 59, "dev_areas": ["cognitive", "social"], "tags": ["turn-taking", "cause-effect", "board-game"], "price": 14.95, "asin": "B00000JICB", "afflink": "https://www.amazon.com.au/dp/B00000JICB?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/812lSGtI33L.jpg", "note": "Another classic. When a game has been selling for this many years, you know it's a good one. The anticipation of when the pirate will pop is exciting, and there's fine motor, hand coordination, colour naming and turn taking in there too. One of my top picks for a first board game.", "search": "TOMY Pop Up Pirate"},
  {"id": "p384", "name": "Yoto Mini Player", "age_min": 36, "age_max": 47, "dev_areas": ["cognitive", "language", "regulation", "selfcare"], "tags": ["audio", "music", "storytelling"], "price": 129.99, "asin": "", "afflink": "https://amzn.to/4aEGAf1", "img": "https://m.media-amazon.com/images/I/61oKXuf3HML._AC_SX679_.jpg", "note": "Language development, listening skills and independent quiet time, without screens.", "search": "Yoto Mini Player"},
  {"id": "p385", "name": "110 Piece Magnetic Tiles", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 49.0, "asin": "B0DB622LWW", "afflink": "https://www.amazon.com.au/dp/B0DB622LWW?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81bxyhK9nAL._AC_SL1500_.jpg", "note": "If you're just getting started, this is a good set to grab. I like the variety of pieces. It even comes with dinosaurs that can be characters in the scenes they build, plus windows and doors.", "search": "110 Piece Magnetic Tiles"},
  {"id": "p386", "name": "Bluey Bowling Set", "age_min": 48, "age_max": 59, "dev_areas": ["gross", "fine", "social", "selfcare"], "tags": ["animals"], "price": 25.0, "asin": "B0CFX89HYM", "afflink": "https://www.amazon.com.au/dp/B0CFX89HYM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71QfC7piLbL._AC_SL1500_.jpg", "note": "I love bowling as an activity. Throwing or rolling things towards a target helps with managing energy. Great indoors down a hallway, or outdoors at the park or in the backyard.", "search": "Bluey Bowling Set"},
  {"id": "p387", "name": "Bluey Shopping List Game", "age_min": 48, "age_max": 71, "dev_areas": ["cognitive", "social", "language"], "tags": ["board-game", "pretend-play", "role-play", "turn-taking"], "price": 15.95, "asin": "B0DQ62Q5K3", "afflink": "https://www.amazon.com.au/dp/B0DQ62Q5K3?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/714SLdlNOoL.jpg", "note": "Another early board game built around going shopping, and Bluey gets them in.", "search": "Bluey Shopping List Game"},
  {"id": "p388", "name": "BRIO Builder Construction Set, 136 pieces", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["constructive", "open-ended", "vehicles"], "price": 99.0, "asin": "B0DDV2PQ9X", "afflink": "https://www.amazon.com.au/dp/B0DDV2PQ9X?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61WHKLdl5UL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "For kids who are really into making things and need a step up. A good loose parts set, with screws, wheels, tools and lots of random pieces, so they can use their creativity to make whatever they like.", "search": "BRIO Builder Construction Set, 136 pieces"},
  {"id": "p389", "name": "Claris: The Chicest Mouse in Paris (book)", "age_min": 48, "age_max": 59, "dev_areas": ["cognitive", "language"], "tags": ["books", "storytelling"], "price": 22.74, "asin": "1760502596", "afflink": "https://www.amazon.com.au/dp/1760502596?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91ki8d4+oEL.jpg", "note": "An Aussie picture book series, and one of my community picks of what parents are getting their kids this Christmas.", "search": "Claris: The Chicest Mouse in Paris (book)"},
  {"id": "p390", "name": "Coogam Wooden Pattern Blocks", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["blocks-tiles", "constructive", "open-ended", "patterns", "problem-solving", "puzzle"], "price": 26.99, "asin": "B07W3RQ2M8", "afflink": "https://www.amazon.com.au/dp/B07W3RQ2M8?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61ZkWIuoPxL.jpg", "note": "Portable, because they come in a tin, and they come with reference cards. Good for kids who get stuck for ideas with a regular block set and need lots of help. They look at a card and build the shape. Lots of visual perception: can they see it accurately, work out which parts make the whole picture, and recreate it?", "search": "Coogam Wooden Pattern Blocks"},
  {"id": "p391", "name": "Crayola Scribble Scrubbie Bathtub Playset", "age_min": 48, "age_max": 83, "dev_areas": ["fine", "sensory", "cognitive", "social", "regulation"], "tags": ["bath", "pretend-play", "role-play", "sensory", "water"], "price": 33.0, "asin": "B08LPRSMXC", "afflink": "https://www.amazon.com.au/dp/B08LPRSMXC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81wASj9MnxL.jpg", "note": "Decorate the little characters and give them personalities, then wash them off in the little bathtub and start again.", "search": "Crayola Scribble Scrubbie Bathtub Playset"},
  {"id": "p392", "name": "CUTE STONE Kids Gardening Tool Set (20 pcs)", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "selfcare"], "tags": ["pretend-play", "role-play", "tool-use"], "price": 42.49, "asin": "B0CQG749D3", "afflink": "https://www.amazon.com.au/dp/B0CQG749D3?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81GxaNtMpSL.jpg", "note": "They can get involved in the gardening too.", "search": "CUTE STONE Kids Gardening Tool Set (20 pcs)"},
  {"id": "p393", "name": "Flower Building Set", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["constructive", "open-ended"], "price": 21.99, "asin": "", "afflink": "https://amzn.to/4pOLQks", "img": "https://m.media-amazon.com/images/I/813pDXZnndL._AC_SL1500_.jpg", "note": "Fine motor precision and creative design.", "search": "Flower Building Set"},
  {"id": "p394", "name": "Hape Quadrilla Race to the Finish Marble Run", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["cause-effect", "constructive", "open-ended", "problem-solving"], "price": 52.49, "asin": "B079NLL5RC", "afflink": "https://www.amazon.com.au/dp/B079NLL5RC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71nz4KAoPzL.jpg", "note": "Build it, test it, fix it. Wooden and sturdy.", "search": "Hape Quadrilla Race to the Finish Marble Run"},
  {"id": "p395", "name": "Hoot Owl Hoot", "age_min": 48, "age_max": 71, "dev_areas": ["cognitive", "social"], "tags": ["animals", "board-game", "turn-taking"], "price": 36.0, "asin": "B004HVKAAI", "afflink": "https://www.amazon.com.au/dp/B004HVKAAI?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/618A7cqKYUL._AC_SL1000_.jpg", "note": "Another cooperative one, so the whole family wins or loses together.", "search": "Hoot Owl Hoot"},
  {"id": "p396", "name": "Jupitearth Silky Crayons", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 22.79, "asin": "B0CSK7M8H5", "afflink": "https://www.amazon.com.au/dp/B0CSK7M8H5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/7141t2kWBAL.jpg", "note": "Twist-up crayons that glide on, so they don't need to press hard to get colour.", "search": "Jupitearth Silky Crayons"},
  {"id": "p397", "name": "Kids Digital Camera (Dinosaur)", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive", "language"], "tags": ["creative", "dinosaurs"], "price": 25.99, "asin": "B0CYGPYHBL", "afflink": "https://www.amazon.com.au/dp/B0CYGPYHBL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71o-Y9oisBL.jpg", "note": "For kids who are constantly wanting to take photos on your phone. They can start taking all of their own.", "search": "Kids Digital Camera (Dinosaur)"},
  {"id": "p398", "name": "Kids Safe Knife Set (13 piece)", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "social", "selfcare"], "tags": ["cooking", "pretend-play", "tool-use"], "price": 26.97, "asin": "B0BTY4R8GP", "afflink": "https://www.amazon.com.au/dp/B0BTY4R8GP?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/715v6ewfIaL.jpg", "note": "Kids this age are old enough to start learning kitchen skills with supervision, and these minimise the risk of cuts.", "search": "Kids Safe Knife Set (13 piece)"},
  {"id": "p399", "name": "LEGO Bluey Beach", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 39.99, "asin": "", "afflink": "https://amzn.to/3XEODkr", "img": "https://m.media-amazon.com/images/I/81DegoOVGFL._AC_SL1500_.jpg", "note": "Imaginative play, sequencing and storytelling with characters they already love.", "search": "LEGO Bluey Beach"},
  {"id": "p400", "name": "Lite-Brite Touch", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "sensory", "cognitive", "social"], "tags": ["art", "creative", "drawing"], "price": 62.49, "asin": "B0BPJZC26G", "afflink": "https://www.amazon.com.au/dp/B0BPJZC26G?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81i492KQphL.jpg", "note": "Something different and unique that serves a few purposes. A sensory tool for kids who like light-up things, a way to draw and make patterns, or a board for games like Connect Four. Portable enough for the car, too.", "search": "Lite-Brite Touch"},
  {"id": "p401", "name": "Makedo Cardboard Construction Tool Kit", "age_min": 48, "age_max": 59, "dev_areas": ["fine", "cognitive", "social"], "tags": ["constructive", "open-ended", "vehicles"], "price": 38.5, "asin": "", "afflink": "https://amzn.to/4pp6l7w", "img": "https://m.media-amazon.com/images/I/718oba1zzML._AC_SL1500_.jpg", "note": "Cardboard construction for little engineers. Creativity, teamwork and sustainable play.", "search": "Makedo Cardboard Construction Tool Kit"},
  {"id": "p402", "name": "Melissa & Doug Julia Magnetic Dress-Up", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "social", "language", "selfcare"], "tags": ["pretend-play", "role-play"], "price": 22.99, "asin": "B01B1UE4Q8", "afflink": "https://www.amazon.com.au/dp/B01B1UE4Q8?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71idXxOHrrL.jpg", "note": "Lots of characters, and they actually stand up, so they work in pretend play. Going to work in a uniform, then coming home and changing into a home outfit: playing out daily routines.", "search": "Melissa & Doug Julia Magnetic Dress-Up"},
  {"id": "p403", "name": "Melissa & Doug Scoop & Serve Ice Cream Set", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["cooking", "pretend-play", "role-play"], "price": 74.99, "asin": "B06XHQ3G3C", "afflink": "https://www.amazon.com.au/dp/B06XHQ3G3C?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61jXeH+pI8L.jpg", "note": "It can turn into an ice cream shop, or be a bigger part of a restaurant scene.", "search": "Melissa & Doug Scoop & Serve Ice Cream Set"},
  {"id": "p404", "name": "Pizza Oven Set", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["cooking", "pretend-play", "role-play"], "price": 20.0, "asin": "", "afflink": "https://link.amazon/B02SJPAqr", "img": "https://m.media-amazon.com/images/I/81Kmxje7LtL._AC_SL1500_.jpg", "note": "This has all the tools a kid needs to run a pizza shop, or maybe an Italian restaurant. Lots of skill opportunities: taking orders, following instructions to prep the pizza, remembering someone's order, practicing money skills and communication.", "search": "Pizza Oven Set"},
  {"id": "p405", "name": "Pop the Pig", "age_min": 48, "age_max": 59, "dev_areas": ["cognitive", "social", "regulation"], "tags": ["board-game", "turn-taking"], "price": 38.98, "asin": "", "afflink": "https://amzn.to/48rBmSv", "img": "https://m.media-amazon.com/images/I/81CV3G+701S._AC_SL1500_.jpg", "note": "Turn taking, impulse control and numeracy, with plenty of laughs.", "search": "Pop the Pig"},
  {"id": "p406", "name": "Skillmatics Snip Snip Scissor Skills Book", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "language"], "tags": ["books", "storytelling"], "price": 27.0, "asin": "B0CHXWHJQH", "afflink": "https://www.amazon.com.au/dp/B0CHXWHJQH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71xF6IAgaIL._AC_SL1500_.jpg", "note": "Twenty-five cutting activities in order: snipping first, then straight lines, then curves.", "search": "Skillmatics Snip Snip Scissor Skills Book"},
  {"id": "p407", "name": "SKLZ Pro Mini Basketball Hoop", "age_min": 48, "age_max": 71, "dev_areas": ["gross", "social", "language"], "tags": ["gross", "movement", "outdoor", "sports"], "price": 46.83, "asin": "B08MWW3NGY", "afflink": "https://www.amazon.com.au/dp/B08MWW3NGY?tag=brittanyot0c-22", "img": "assets/products/sklz-mini-hoop.jpg", "note": "For kids who love throwing, this is a great indoor one. It's a mini hoop with soft foam balls, so you can redirect all the throwing and keep it safe.", "search": "SKLZ Pro Mini Basketball Hoop"},
  {"id": "p408", "name": "Spot It! Bluey", "age_min": 48, "age_max": 71, "dev_areas": ["cognitive", "social", "language"], "tags": ["card-game", "turn-taking"], "price": 19.0, "asin": "B0F8NYCJZB", "afflink": "https://www.amazon.com.au/dp/B0F8NYCJZB?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81tH66y8oOL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "A really popular card game, and lots of fun for all ages. I enjoy playing it as an adult, so it's a really family-friendly one to get. There are lots of different versions too.", "search": "Spot It! Bluey"},
  {"id": "p409", "name": "Supermarket Playset", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "social", "language", "selfcare"], "tags": ["pretend-play", "role-play"], "price": 49.0, "asin": "B00Z0IIDZ6", "afflink": "https://www.amazon.com.au/dp/B00Z0IIDZ6?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/815CBR7DviL._AC_SL1500_.jpg", "note": "With a cash register, they can run pretty much any business: a beauty salon, a barbershop, a restaurant or a café. It helps with maths and money skills too. The only downside is the US play money. I couldn't find a version with Australian money, but you can buy some or print out Australian notes to go with it.", "search": "Supermarket Playset"},
  {"id": "p410", "name": "UNO Junior", "age_min": 48, "age_max": 71, "dev_areas": ["cognitive", "social", "language"], "tags": ["card-game", "turn-taking"], "price": 23.2, "asin": "B07Y94Y3JL", "afflink": "https://www.amazon.com.au/dp/B07Y94Y3JL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81X+33RmfvL.jpg", "note": "A first 'real' card game. Matching, turn-taking, losing well.", "search": "UNO Junior"},
  {"id": "p411", "name": "VTech Marble Rush Adventure Set", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["cause-effect", "constructive", "open-ended", "problem-solving"], "price": 83.49, "asin": "B095X7QD3T", "afflink": "https://www.amazon.com.au/dp/B095X7QD3T?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81aX-A0Q37L.jpg", "note": "The ultimate marble run setup, with extras that make it more fun: a slide, a spinner wheel and different ramps.", "search": "VTech Marble Rush Adventure Set"},
  {"id": "p412", "name": "Waytoplay Expressway 16 Piece", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["vehicles"], "price": 109.9, "asin": "B075KRXLL7", "afflink": "https://www.amazon.com.au/dp/B075KRXLL7?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71vZ9VUOzdL._AC_SL1500_.jpg", "note": "A road track that can be set up basically anywhere. The pieces fit together like a puzzle, so they build their own shape. Great for kids who love car play or Hot Wheels, race stories, bus stories, or building a bigger town. A great open-ended toy.", "search": "Waytoplay Expressway 16 Piece"},
  {"id": "p413", "name": "Connect 4 (Hasbro)", "age_min": 60, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 24.99, "asin": "B0FHKZ4BP1", "afflink": "https://www.amazon.com.au/dp/B0FHKZ4BP1?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81ENjThbHuL.jpg", "note": "A great strategy game, with chances for strategic thinking, problem solving and turn taking. Being two-player, it's a good level while they're still getting used to games with rules.", "search": "Connect 4 (Hasbro)"},
  {"id": "p414", "name": "Crayola Inspiration Art Case (140 pieces)", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 24.0, "asin": "B07XNWRZKP", "afflink": "https://www.amazon.com.au/dp/B07XNWRZKP?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71JDCuJS17L.jpg", "note": "A great comprehensive kit with pencils, textas, crayons and some paper. Pull it out, then pack it all away into the case when they're finished.", "search": "Crayola Inspiration Art Case (140 pieces)"},
  {"id": "p415", "name": "Crazy Aaron's Thinking Putty (Eggcellent)", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive", "regulation"], "tags": ["calm-down", "fidget", "sensory", "stretchy", "tactile"], "price": 19.95, "asin": "B0DV97DZLT", "afflink": "https://www.amazon.com.au/dp/B0DV97DZLT?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/715JjmNdKuL.jpg", "note": "This one is just the egg, but click through and look at related products: Crazy Aaron's has lots of different putties. I like the search and find ones, with little pieces hidden inside to look for. Quite mindful, as well as being a fidget. Great for kids who are into slime or benefit from having something to do with their hands.", "search": "Crazy Aaron's Thinking Putty (Eggcellent)", "fam": "putty"},
  {"id": "p416", "name": "Galt Marble Run 24 Piece", "age_min": 60, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["cause-effect", "constructive", "open-ended", "problem-solving"], "price": 52.7, "asin": "", "afflink": "https://link.amazon/B07xBN7Bd", "img": "https://m.media-amazon.com/images/I/81j0Z168TmL._AC_SL1500_.jpg", "note": "A great first marble run. Twenty-four pieces is about what a five-year-old can build on their own.", "search": "Galt Marble Run 24 Piece"},
  {"id": "p417", "name": "Hama Beads 4,000 with 3 Pegboards", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "cognitive", "social"], "tags": ["art", "craft", "creative", "open-ended"], "price": 35.05, "asin": "B07BZHYJF4", "afflink": "https://www.amazon.com.au/dp/B07BZHYJF4?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71UyC4J6dLL._AC_SL1500_.jpg", "note": "For craft lovers. They put tiny beads together to make a creation, then you iron it and the heat sticks the beads together.", "search": "Hama Beads 4,000 with 3 Pegboards"},
  {"id": "p418", "name": "Hot Wheels Track Creator Triple Loop Pack", "age_min": 60, "age_max": 71, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["vehicles"], "price": 52.99, "asin": "B0DMW8ZPK5", "afflink": "https://www.amazon.com.au/dp/B0DMW8ZPK5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61MzAV0ZBCL.jpg", "note": "Build the track, test the loop, change it when it fails.", "search": "Hot Wheels Track Creator Triple Loop Pack"},
  {"id": "p419", "name": "Inspireyes Kids Walkie Talkies (rechargeable)", "age_min": 60, "age_max": 107, "dev_areas": ["gross", "cognitive", "social", "language"], "tags": ["outdoor", "turn-taking"], "price": 34.19, "asin": "B0CDLVDTVK", "afflink": "https://www.amazon.com.au/dp/B0CDLVDTVK?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61Z8niwNRGL.jpg", "note": "A fun one that not many people think of, because they're not really in the toy category. They can be used for so many games, and they're great for practicing clear communication.", "search": "Inspireyes Kids Walkie Talkies (rechargeable)"},
  {"id": "p420", "name": "LCD Writing Tablets (4 pack)", "age_min": 60, "age_max": 71, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["drawing", "mark-making", "pre-writing", "creative"], "price": 18.99, "asin": "B0D46FMQTJ", "afflink": "https://www.amazon.com.au/dp/B0D46FMQTJ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71eSSNJH9fL.jpg", "note": "A great portable one for the car or when you're travelling, but they do have a battery, so be mindful of that.", "search": "LCD Writing Tablets (4 pack)"},
  {"id": "p421", "name": "LEGO Classic Creative Colourful Bricks 11045", "age_min": 60, "age_max": 83, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["art", "blocks-tiles", "constructive", "creative", "drawing", "mark-making", "open-ended"], "price": 69.0, "asin": "B0FPXG1H81", "afflink": "https://www.amazon.com.au/dp/B0FPXG1H81?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81GiOq0uCzL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "A tub of bricks and no instructions.", "search": "LEGO Classic Creative Colourful Bricks 11045"},
  {"id": "p422", "name": "LEGO Classic Large Creative Brick Box", "age_min": 60, "age_max": 83, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 63.99, "asin": "B00PY3EYQO", "afflink": "https://www.amazon.com.au/dp/B00PY3EYQO?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/8161c2gxUQL.jpg", "note": "Bigger box for kids who've outgrown the starter set.", "search": "LEGO Classic Large Creative Brick Box"},
  {"id": "p423", "name": "Melissa & Doug Design-Your-Own Bracelets", "age_min": 60, "age_max": 83, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 11.99, "asin": "B009WLPEJA", "afflink": "https://www.amazon.com.au/dp/B009WLPEJA?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81L9Vbt8L2L.jpg", "note": "A super cute activity where kids use their creativity to express their style. Relatively inexpensive, so great if you're on a budget.", "search": "Melissa & Doug Design-Your-Own Bracelets"},
  {"id": "p424", "name": "Melissa & Doug Reusable Puffy Sticker Set (Safari)", "age_min": 60, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["animals", "art", "craft", "creative"], "price": 11.69, "asin": "B01B1TIB8G", "afflink": "https://www.amazon.com.au/dp/B01B1TIB8G?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81a1XTAwA7L.jpg", "note": "Puffy reusable stickers that go on and come off over and over. Great fine motor work, and they travel well.", "search": "Melissa & Doug Reusable Puffy Sticker Set (Safari)"},
  {"id": "p425", "name": "Mocoosy Rainbow Scratch Art Paper (60)", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 17.99, "asin": "B0827B2G51", "afflink": "https://www.amazon.com.au/dp/B0827B2G51?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81LeH4f+frL.jpg", "note": "Great for kids who are into craft, and a good one to take out and about.", "search": "Mocoosy Rainbow Scratch Art Paper (60)"},
  {"id": "p426", "name": "National Geographic Jumbo Dinosaur Egg Dig Kit", "age_min": 60, "age_max": 71, "dev_areas": ["fine", "language"], "tags": ["STEM", "dinosaurs", "experiments", "science"], "price": 29.99, "asin": "B0FLB6Q7S6", "afflink": "https://www.amazon.com.au/dp/B0FLB6Q7S6?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91cLytyBtBL.jpg", "note": "Really fun, though it's more of a single use. Really cool for kids who are into dinosaurs, because they excavate them and see which species they find.", "search": "National Geographic Jumbo Dinosaur Egg Dig Kit", "fam": "science-kit"},
  {"id": "p427", "name": "National Geographic Junior Chemistry Set", "age_min": 60, "age_max": 83, "dev_areas": ["gross", "fine", "cognitive", "language"], "tags": ["STEM", "experiments", "science"], "price": 18.0, "asin": "B0D348KMCL", "afflink": "https://www.amazon.com.au/dp/B0D348KMCL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/811gJGW7KZL._AC_SL1500_.jpg", "note": "I find science experiments really engaging for a lot of kids. If your child likes mixing things and watching them react and change colour, this is a great pick: DIY volcanoes, and blowing up a balloon without using your breath.", "search": "National Geographic Junior Chemistry Set", "fam": "science-kit"},
  {"id": "p428", "name": "Operation", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "cognitive", "social", "language"], "tags": ["board-game", "turn-taking"], "price": 39.0, "asin": "B0DBJDYQNR", "afflink": "https://www.amazon.com.au/dp/B0DBJDYQNR?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/818tvmYyGbL._AC_SL1500_.jpg", "note": "The classic buzzing tweezers game, and great for fine-tuning tool skills. In my OT brain, it links directly to using tweezers with more precision, and it strengthens hand-eye coordination and the finger and hand muscles used for writing and drawing.", "search": "Operation"},
  {"id": "p429", "name": "Orchard Toys Pop to the Shops", "age_min": 60, "age_max": 83, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 28.0, "asin": "B004TLPG6Y", "afflink": "https://www.amazon.com.au/dp/B004TLPG6Y?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81hDGj9qtHL.jpg", "note": "I love the theme. An early board game linked to a real life skill, going shopping. That's a win.", "search": "Orchard Toys Pop to the Shops"},
  {"id": "p430", "name": "Paint by Sticker Kids: Rainbows Everywhere", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 11.75, "asin": "1523517751", "afflink": "https://www.amazon.com.au/dp/1523517751?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/8118OU1RIyL.jpg", "note": "Inexpensive and great for travel. It can be quite a mindful activity, but I'd only gift this to a child who will sit for a while and work on one crafty project, which probably isn't every kid.", "search": "Paint by Sticker Kids: Rainbows Everywhere"},
  {"id": "p431", "name": "Primal Hatch Jurassic World Dinosaur Egg", "age_min": 60, "age_max": 71, "dev_areas": ["cognitive", "sensory"], "tags": ["STEM", "dinosaurs", "experiments", "science"], "price": 62.81, "asin": "B0DSL9L1ZS", "afflink": "https://www.amazon.com.au/dp/B0DSL9L1ZS?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/8150cn6Mv2L.jpg", "note": "If growing their collection of larger dinosaurs is the priority, this is another cool egg hatching one.", "search": "Primal Hatch Jurassic World Dinosaur Egg", "fam": "science-kit"},
  {"id": "p432", "name": "ThinkFun Rush Hour Junior", "age_min": 60, "age_max": 71, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "deduction", "problem-solving", "puzzle", "turn-taking"], "price": 29.95, "asin": "B098FH4PXD", "afflink": "https://www.amazon.com.au/dp/B098FH4PXD?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61Aie7WuKXL._AC_.jpg", "note": "It's got some strategy to it, and you can work on it together.", "search": "ThinkFun Rush Hour Junior"},
  {"id": "p433", "name": "Usborne See Inside: How Things Work", "age_min": 60, "age_max": 83, "dev_areas": ["fine", "cognitive", "language"], "tags": ["books", "storytelling"], "price": 16.99, "asin": "0746098510", "afflink": "https://www.amazon.com.au/dp/0746098510?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91e6XWe8+NL.jpg", "note": "An excellent lift-the-flap book for kids who are constantly asking how things are built. Lots of cars, trucks, planes and cranes, so great for more mechanically minded kids.", "search": "Usborne See Inside: How Things Work"},
  {"id": "p434", "name": "Usborne Sticker Dolly Dressing: Unicorns", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive", "language", "selfcare"], "tags": ["art", "books", "craft", "creative", "dolls", "nurturing", "plush", "pretend-play", "storytelling"], "price": 7.0, "asin": "1474967825", "afflink": "https://www.amazon.com.au/dp/1474967825?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81-glt2KM9L.jpg", "note": "Glowing reviews, and a great one to buy as an inexpensive gift or for travel.", "search": "Usborne Sticker Dolly Dressing: Unicorns"},
  {"id": "p435", "name": "3Doodler Start Essentials 3D Pen", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 90.0, "asin": "B0DWHRGQ6Z", "afflink": "https://www.amazon.com.au/dp/B0DWHRGQ6Z?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71XVMb8RXAL._AC_SL1500_.jpg", "note": "Draw in the air and it sets solid. It uses a low-heat eco-plastic rather than standard filament, and 3Doodler rate it 6 to 13.", "search": "3Doodler Start Essentials 3D Pen"},
  {"id": "p436", "name": "Aigybobo Origami Paper Set (308 pcs)", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 20.23, "asin": "B09WQCHK3M", "afflink": "https://www.amazon.com.au/dp/B09WQCHK3M?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81Mpb14Bb-L.jpg", "note": "A great one for kids who are showing an interest in craft. Great for learning to follow instructions and practicing precision and folding.", "search": "Aigybobo Origami Paper Set (308 pcs)"},
  {"id": "p437", "name": "Crayola Marker Airbrush", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "creative", "drawing", "mark-making", "vertical-surface"], "price": 25.0, "asin": "B0DTB2N2D9", "afflink": "https://www.amazon.com.au/dp/B0DTB2N2D9?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81161P5MeNL.jpg", "note": "A fun one for making different designs, for kids who are really into their craft creations.", "search": "Crayola Marker Airbrush"},
  {"id": "p438", "name": "Dragomino", "age_min": 72, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 29.45, "asin": "B08GDMYJ87", "afflink": "https://www.amazon.com.au/dp/B08GDMYJ87?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/815cb1C+DNL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "A great strategy board game for kids who are showing more of an interest in board games, or dragons.", "search": "Dragomino"},
  {"id": "p439", "name": "GraviTrax Starter Set (124 pieces)", "age_min": 72, "age_max": 83, "dev_areas": ["fine", "cognitive"], "tags": ["art", "cause-effect", "constructive", "craft", "creative", "open-ended", "problem-solving"], "price": 84.0, "asin": "B0BSXKTRYZ", "afflink": "https://www.amazon.com.au/dp/B0BSXKTRYZ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81G1Ak9ITTL.jpg", "note": "An upgraded marble run. Although it says 8+, reviews say six-year-olds have absolutely loved this set, so judge it on what your child is into.", "search": "GraviTrax Starter Set (124 pieces)"},
  {"id": "p440", "name": "Guess Who? Pokemon Edition", "age_min": 72, "age_max": 107, "dev_areas": ["cognitive", "social", "language"], "tags": ["board-game", "deduction", "turn-taking"], "price": 34.0, "asin": "B0FPF2RXPH", "afflink": "https://www.amazon.com.au/dp/B0FPF2RXPH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81+vKYSRtvL.jpg", "note": "The same yes/no questions game, with Pokémon characters.", "search": "Guess Who? Pokemon Edition"},
  {"id": "p441", "name": "Gunn & Moore Kids Cricket Set", "age_min": 72, "age_max": 107, "dev_areas": ["gross", "fine", "social"], "tags": ["gross", "movement", "outdoor", "sports"], "price": 55.57, "asin": "B074HB2BJW", "afflink": "https://www.amazon.com.au/dp/B074HB2BJW?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61JX3PCO0EL.jpg", "note": "Backyard cricket for the summer holidays. Throwing, catching and hitting, and a great way to get everyone outside.", "search": "Gunn & Moore Kids Cricket Set"},
  {"id": "p442", "name": "Inscraft Fuse Beads Kit (21,000)", "age_min": 72, "age_max": 83, "dev_areas": ["fine", "cognitive", "social"], "tags": ["art", "craft", "creative", "open-ended"], "price": 36.99, "asin": "B07QSF67HF", "afflink": "https://www.amazon.com.au/dp/B07QSF67HF?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91FbJXgPNLL.jpg", "note": "A big kit of iron-on beads. Build the design on a pegboard, iron it, and the beads stick together.", "search": "Inscraft Fuse Beads Kit (21,000)"},
  {"id": "p443", "name": "JOYIN Kids Bow and Arrow Set", "age_min": 72, "age_max": 107, "dev_areas": ["gross", "fine", "social"], "tags": ["gross", "movement", "outdoor"], "price": 35.99, "asin": "B0BBZP9442", "afflink": "https://www.amazon.com.au/dp/B0BBZP9442?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81Cpwfh20zL.jpg", "note": "A great way to get them moving while building skills: hand-eye coordination, aiming and the motor skills that go with it.", "search": "JOYIN Kids Bow and Arrow Set"},
  {"id": "p444", "name": "Learning Resources Botley 2.0 Coding Robot", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["STEM", "board-game", "coding", "experiments", "science", "turn-taking"], "price": 132.1, "asin": "B083T58PKM", "afflink": "https://www.amazon.com.au/dp/B083T58PKM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61oXEo71duL.jpg", "note": "A good step up for kids who are getting into robots, coding and STEM.", "search": "Learning Resources Botley 2.0 Coding Robot"},
  {"id": "p445", "name": "Outfoxed!", "age_min": 72, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "deduction", "turn-taking"], "price": 52.0, "asin": "", "afflink": "https://link.amazon/B05H9ralx", "img": "https://m.media-amazon.com/images/I/81c8K6IVBhL._AC_SL1500_.jpg", "note": "A cooperative one I bought recently, and it's been so loved by all the kids I've played with. Particularly successful for happy sibling sessions, with no arguing and everyone working together.", "search": "Outfoxed!"},
  {"id": "p446", "name": "Rainbow Loom Mega Combo Case", "age_min": 72, "age_max": 83, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 39.76, "asin": "B085WNTJT1", "afflink": "https://www.amazon.com.au/dp/B085WNTJT1?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91DpX91zoPL.jpg", "note": "Bracelet making is back this year, and it's fine motor work from start to finish.", "search": "Rainbow Loom Mega Combo Case"},
  {"id": "p447", "name": "Stomp Rocket Dueling Rockets", "age_min": 72, "age_max": 83, "dev_areas": ["gross", "social"], "tags": ["gross", "movement", "outdoor"], "price": 32.95, "asin": "B0CTQQJS7Q", "afflink": "https://www.amazon.com.au/dp/B0CTQQJS7Q?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81BjqWnJLLL._AC_SL1500_.jpg", "note": "Two launch pads, two kids, stomp at the same time and see whose goes higher. Four rockets, no batteries, up to about 60 metres.", "search": "Stomp Rocket Dueling Rockets"},
  {"id": "p448", "name": "Swingball Classic All Surface Set", "age_min": 72, "age_max": 107, "dev_areas": ["gross", "fine", "sensory", "social", "regulation"], "tags": ["gross", "movement", "outdoor", "sports"], "price": 75.95, "asin": "B09GPWQYTL", "afflink": "https://www.amazon.com.au/dp/B09GPWQYTL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/51JvRnkHNBL.jpg", "note": "An Aussie summer backyard classic. Great for hand-eye coordination and getting them outside.", "search": "Swingball Classic All Surface Set"},
  {"id": "p449", "name": "ThinkFun Rush Hour", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive", "social"], "tags": ["board-game", "deduction", "problem-solving", "puzzle", "turn-taking"], "price": 42.48, "asin": "B0CZRYZ3K5", "afflink": "https://www.amazon.com.au/dp/B0CZRYZ3K5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81J2Mi-3lLL.jpg", "note": "It's got some strategy to it, and you can work on it together. 40 challenge cards, from beginner to expert.", "search": "ThinkFun Rush Hour"},
  {"id": "p450", "name": "Ticket to Ride: First Journey", "age_min": 72, "age_max": 107, "dev_areas": ["gross", "cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 54.99, "asin": "B093SM933P", "afflink": "https://www.amazon.com.au/dp/B093SM933P?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81S5Km93bhL._AC_SL1500_.jpg", "note": "You may have heard of Ticket to Ride, a popular strategy board game. First Journey is the kids' version: claim train routes across the map to connect your cities. Planning ahead, strategy and turn taking.", "search": "Ticket to Ride: First Journey"},
  {"id": "p451", "name": "Tiger Tribe Shrinkorama: Magical Woodlands", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative"], "price": 22.5, "asin": "", "afflink": "https://link.amazon/B0erDvxvU", "img": "https://m.media-amazon.com/images/I/81PZCPb35jL._AC_SL1500_.jpg", "note": "A great make-your-own charm set. Also cute for making key rings or decorations.", "search": "Tiger Tribe Shrinkorama: Magical Woodlands"},
  {"id": "p452", "name": "Catan Junior", "age_min": 84, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 49.99, "asin": "B007N0KZ64", "afflink": "https://www.amazon.com.au/dp/B007N0KZ64?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81rjLiFzpHL._AC_SL1500_.jpg", "note": "You may have heard of Catan, a popular strategy board game. This is the junior version, if your child likes board games. Collecting resources, trading with the other players and planning ahead.", "search": "Catan Junior"},
  {"id": "p453", "name": "Clay Bead Bracelet Making Kit", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "sensory", "cognitive", "social"], "tags": ["art", "craft", "creative", "open-ended"], "price": 19.99, "asin": "B0BZHQZ4YP", "afflink": "https://www.amazon.com.au/dp/B0BZHQZ4YP?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81pEHfIZreL.jpg", "note": "A kit for making clay bead charm and friendship bracelets.", "search": "Clay Bead Bracelet Making Kit"},
  {"id": "p454", "name": "Cra-Z-Loom All In One Colossal Loom Studio", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 35.0, "asin": "B0CJXPX71K", "afflink": "https://www.amazon.com.au/dp/B0CJXPX71K?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91IcuEEkYiL._AC_SX300_SY300_QL70_ML2_.jpg", "note": "Loom band bracelets, where kids use their creativity to express their style.", "search": "Cra-Z-Loom All In One Colossal Loom Studio"},
  {"id": "p455", "name": "Crayola Light-Up Tracing Pad", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["art", "creative", "drawing", "mark-making"], "price": 59.42, "asin": "B0084JUNVU", "afflink": "https://www.amazon.com.au/dp/B0084JUNVU?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91EqGnlluBL.jpg", "note": "For kids who are really enjoying their drawing and like tracing from examples, this is a great way for them to build their skills.", "search": "Crayola Light-Up Tracing Pad"},
  {"id": "p456", "name": "Creativity for Kids Grow 'N Glow Terrarium", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["STEM", "art", "craft", "creative", "experiments", "science"], "price": 30.0, "asin": "B07XF2CHL7", "afflink": "https://www.amazon.com.au/dp/B07XF2CHL7?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/9115QwTGThL._AC_SL1500_.jpg", "note": "Build a small terrarium, plant the seeds and watch it grow. It glows in the dark, too.", "search": "Creativity for Kids Grow 'N Glow Terrarium", "fam": "science-kit"},
  {"id": "p457", "name": "Dog Man (Book 1)", "age_min": 84, "age_max": 107, "dev_areas": ["fine", "cognitive", "language"], "tags": ["books", "storytelling"], "price": 14.0, "asin": "0545581605", "afflink": "https://www.amazon.com.au/dp/0545581605?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61J04f7X39L.jpg", "note": "A graphic novel that gets reluctant readers reading.", "search": "Dog Man (Book 1)"},
  {"id": "p458", "name": "Duncan Butterfly Yo-Yo", "age_min": 84, "age_max": 95, "dev_areas": ["gross", "social", "regulation"], "tags": ["gross", "movement", "outdoor"], "price": 11.95, "asin": "B09V7B5122", "afflink": "https://www.amazon.com.au/dp/B09V7B5122?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81tEH2fAxlL._AC_SL1500_.jpg", "note": "The best-selling string-trick yo-yo. The wide gap and steel axle make it much easier for beginners. Great for hand-eye coordination and persistence.", "search": "Duncan Butterfly Yo-Yo"},
  {"id": "p459", "name": "GraviTrax Starter Set", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive", "language"], "tags": ["art", "cause-effect", "constructive", "craft", "creative", "open-ended", "problem-solving"], "price": 109.99, "asin": "B0CLS25823", "afflink": "https://www.amazon.com.au/dp/B0CLS25823?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81G1Ak9ITTL._AC_SL1500_.jpg", "note": "An upgraded marble run. Build upwards, using height and momentum to move the marble along.", "search": "GraviTrax Starter Set"},
  {"id": "p460", "name": "Kids Camera Instant Print", "age_min": 84, "age_max": 107, "dev_areas": ["fine", "cognitive", "language"], "tags": ["creative"], "price": 48.99, "asin": "B0F47JRCFW", "afflink": "https://www.amazon.com.au/dp/B0F47JRCFW?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71O9Np14X8L.jpg", "note": "Prints the photo straight away, no phone needed. For kids who are always asking to take photos.", "search": "Kids Camera Instant Print"},
  {"id": "p461", "name": "Klutz Make Your Own Mini Erasers", "age_min": 84, "age_max": 107, "dev_areas": ["fine", "cognitive", "social"], "tags": ["art", "craft", "creative", "open-ended"], "price": 35.45, "asin": "1338037501", "afflink": "https://www.amazon.com.au/dp/1338037501?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81ynWAcIDdL.jpg", "note": "Really cute, and it turns into a usable eraser they can take to school.", "search": "Klutz Make Your Own Mini Erasers"},
  {"id": "p462", "name": "LEGO Creator 3-in-1 Cute Hamster", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended"], "price": 10.0, "asin": "B0FPXD4D4B", "afflink": "https://www.amazon.com.au/dp/B0FPXD4D4B?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/818G-Hjkn5L.jpg", "note": "Three builds in one box for $10. A great small LEGO project.", "search": "LEGO Creator 3-in-1 Cute Hamster"},
  {"id": "p463", "name": "LEGO Minecraft Chicken Farm", "age_min": 84, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["animals", "art", "blocks-tiles", "constructive", "craft", "creative", "open-ended"], "price": 21.99, "asin": "B0FPXDBPSZ", "afflink": "https://www.amazon.com.au/dp/B0FPXDBPSZ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71Dvt29r3hL.jpg", "note": "For Minecraft fans. Build it, then play it out.", "search": "LEGO Minecraft Chicken Farm"},
  {"id": "p464", "name": "National Geographic Gigantic Gemstone Dig Kit", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive", "regulation"], "tags": ["STEM", "experiments", "science"], "price": 34.99, "asin": "B0FHBKRYS5", "afflink": "https://www.amazon.com.au/dp/B0FHBKRYS5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91S9RnQIOzL.jpg", "note": "Chipping and brushing to find real gemstones. Patience and fine motor skills.", "search": "National Geographic Gigantic Gemstone Dig Kit", "fam": "science-kit"},
  {"id": "p465", "name": "Ravensburger Ocean Turtles 200 Piece XXL Puzzle", "age_min": 84, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["animals", "jigsaw", "problem-solving", "puzzle"], "price": 19.95, "asin": "B001R1RRC0", "afflink": "https://www.amazon.com.au/dp/B001R1RRC0?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81t+bGqENIL.jpg", "note": "Bigger pieces make 200 pieces doable.", "search": "Ravensburger Ocean Turtles 200 Piece XXL Puzzle", "fam": "jigsaw"},
  {"id": "p466", "name": "Ravensburger The Amazing Labyrinth", "age_min": 84, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "deduction", "problem-solving", "puzzle", "turn-taking"], "price": 35.99, "asin": "B00000J0JF", "afflink": "https://www.amazon.com.au/dp/B00000J0JF?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81nzjQQ7c0L.jpg", "note": "While the Amazon title says board game for adults, it's actually suitable for seven- and eight-year-olds. A strategy and challenge-based game.", "search": "Ravensburger The Amazing Labyrinth"},
  {"id": "p467", "name": "Snap Circuits Beginner", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive", "social"], "tags": ["STEM", "circuits", "experiments", "science"], "price": 60.49, "asin": "B011M0XXXM", "afflink": "https://www.amazon.com.au/dp/B011M0XXXM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61eiK83g-NL.jpg", "note": "Snap-together circuits, and an easier start than Snap Circuits Jr.", "search": "Snap Circuits Beginner", "fam": "circuit-kit"},
  {"id": "p468", "name": "Spirograph Design Set", "age_min": 84, "age_max": 95, "dev_areas": ["fine", "cognitive"], "tags": ["art", "creative", "drawing", "mark-making"], "price": 19.0, "asin": "B0B6GWVST9", "afflink": "https://www.amazon.com.au/dp/B0B6GWVST9?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/917EV7D+kdL.jpg", "note": "A bit of a niche gift, but for kids who are really into drawing and would enjoy drawing patterns, it's a considered, inexpensive gift. A good addition to a drawing kit if you're not sure what to get them.", "search": "Spirograph Design Set"},
  {"id": "p469", "name": "Taco Cat Goat Cheese Pizza: On the Flip Side", "age_min": 84, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["card-game", "turn-taking"], "price": 36.19, "asin": "B08YS4CY61", "afflink": "https://www.amazon.com.au/dp/B08YS4CY61?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61LjWZyQWqL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "A new twist on Taco Cat Goat Cheese Pizza. Same quick reactions and attention, and plenty of chaos.", "search": "Taco Cat Goat Cheese Pizza: On the Flip Side"},
  {"id": "p470", "name": "UNO Flip!", "age_min": 84, "age_max": 95, "dev_areas": ["cognitive", "social"], "tags": ["card-game", "turn-taking"], "price": 11.98, "asin": "B083GDQLCL", "afflink": "https://www.amazon.com.au/dp/B083GDQLCL?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81YZt9V6i8L.jpg", "note": "A twist on UNO for kids who've mastered the original.", "search": "UNO Flip!"},
  {"id": "p471", "name": "Connect 4 Shots", "age_min": 96, "age_max": 107, "dev_areas": ["gross", "cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 25.0, "asin": "B07BMK2ZJK", "afflink": "https://www.amazon.com.au/dp/B07BMK2ZJK?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71H0zeTvxEL.jpg", "note": "Bounce the balls into the grid. Active, fast and competitive, with lots of hand-eye coordination.", "search": "Connect 4 Shots"},
  {"id": "p472", "name": "Cool Maker Stack'd Heishi Bracelet Studio", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 34.0, "asin": "B0DT8HQYPF", "afflink": "https://www.amazon.com.au/dp/B0DT8HQYPF?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81vrhWRZiaL._AC_SY300_SX300_QL70_ML2_.jpg", "note": "Bracelets are the craft of the year. This one has a bead pen that picks the beads up and drops them where you want them, so designs stay in order.", "search": "Cool Maker Stack'd Heishi Bracelet Studio"},
  {"id": "p473", "name": "Diary of a Wimpy Kid Box Set", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "language", "selfcare"], "tags": ["books", "storytelling"], "price": 84.91, "asin": "B07BDPNJ1H", "afflink": "https://www.amazon.com.au/dp/B07BDPNJ1H?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71+s9iehQOL.jpg", "note": "Funny chapter books for independent readers.", "search": "Diary of a Wimpy Kid Box Set"},
  {"id": "p474", "name": "Exploding Kittens", "age_min": 96, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["card-game", "turn-taking"], "price": 33.95, "asin": "B010TQY7A8", "afflink": "https://www.amazon.com.au/dp/B010TQY7A8?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71+-Wq2C8zL.jpg", "note": "Fast and funny, and one the whole family will actually want to play.", "search": "Exploding Kittens"},
  {"id": "p475", "name": "Flip 7", "age_min": 96, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["card-game", "turn-taking"], "price": 14.95, "asin": "B0DWGVM7RY", "afflink": "https://www.amazon.com.au/dp/B0DWGVM7RY?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81m3yB192RL.jpg", "note": "A push-your-luck card game that's huge this year. Quick to learn, and great for weighing up a risk: flip another card, or stop?", "search": "Flip 7"},
  {"id": "p476", "name": "KINSPORY 290 Piece Art Set", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "selfcare"], "tags": ["art", "craft", "creative", "drawing", "mark-making"], "price": 22.54, "asin": "B0914XGPQQ", "afflink": "https://www.amazon.com.au/dp/B0914XGPQQ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81D+O1t0UGL.jpg", "note": "Everything for drawing and colouring in one case, so it's easy to pull out and pack away.", "search": "KINSPORY 290 Piece Art Set"},
  {"id": "p477", "name": "Klutz LEGO Chain Reactions", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["STEM", "blocks-tiles", "constructive", "experiments", "open-ended", "science"], "price": 29.99, "asin": "0545703301", "afflink": "https://www.amazon.com.au/dp/0545703301?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71ann8qnIhL.jpg", "note": "Build machines that knock each other over. Set it up, see if it works, adjust it.", "search": "Klutz LEGO Chain Reactions"},
  {"id": "p478", "name": "LEGO Speed Champions Time Machine", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended", "vehicles"], "price": 31.99, "asin": "B0FPXDXXYR", "afflink": "https://www.amazon.com.au/dp/B0FPXDXXYR?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/814d7kfxh1L.jpg", "note": "A detailed build that follows the instructions over a few sessions.", "search": "LEGO Speed Champions Time Machine"},
  {"id": "p479", "name": "LEGO Technic Yellow Motorbike", "age_min": 96, "age_max": 107, "dev_areas": ["gross", "fine", "sensory", "cognitive"], "tags": ["blocks-tiles", "constructive", "open-ended", "vehicles"], "price": 12.0, "asin": "B0FPVTSQ3T", "afflink": "https://www.amazon.com.au/dp/B0FPVTSQ3T?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/811L6iGwC1L.jpg", "note": "A first Technic set, with gears and moving parts for kids who like to see how things work.", "search": "LEGO Technic Yellow Motorbike"},
  {"id": "p480", "name": "Make It Real Mini Pottery Studio Deluxe", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["art", "craft", "creative", "open-ended"], "price": 106.16, "asin": "B0CP7L36MR", "afflink": "https://www.amazon.com.au/dp/B0CP7L36MR?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81JNbQISfbL.jpg", "note": "A real mini pottery wheel. Messy, but very satisfying, and great for kids who love making things with their hands.", "search": "Make It Real Mini Pottery Studio Deluxe"},
  {"id": "p481", "name": "Monopoly Deal", "age_min": 96, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "card-game", "turn-taking"], "price": 7.0, "asin": "B0CPXCDG65", "afflink": "https://www.amazon.com.au/dp/B0CPXCDG65?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81-tKuW1IqL.jpg", "note": "Monopoly in about 15 minutes. A cheap one with a bit of strategy and money maths in it.", "search": "Monopoly Deal"},
  {"id": "p482", "name": "National Geographic Circuit Maker", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["STEM", "circuits", "experiments", "science"], "price": 122.65, "asin": "B0D21N1453", "afflink": "https://www.amazon.com.au/dp/B0D21N1453?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91EMQqNa7aL.jpg", "note": "Build electronic circuits with lights and sound.", "search": "National Geographic Circuit Maker", "fam": "circuit-kit"},
  {"id": "p483", "name": "National Geographic Rock Tumbler", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "regulation"], "tags": ["STEM", "experiments", "science"], "price": 139.99, "asin": "B086Z83SV5", "afflink": "https://www.amazon.com.au/dp/B086Z83SV5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/813f+VXqndL.jpg", "note": "A long project that ends with polished gemstones. Great for patience.", "search": "National Geographic Rock Tumbler", "fam": "science-kit"},
  {"id": "p484", "name": "Pokemon Battle Academy", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "social"], "tags": ["board-game", "turn-taking"], "price": 49.95, "asin": "B0D1R6CT83", "afflink": "https://www.amazon.com.au/dp/B0D1R6CT83?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91sqTvV5wuL.jpg", "note": "Pokémon cards are still huge at school, and this teaches the actual game step by step. Rules, maths and strategy, rather than just collecting.", "search": "Pokemon Battle Academy"},
  {"id": "p485", "name": "Rubik's Cube 3x3 Magnetic Speed Cube", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "regulation"], "tags": ["problem-solving", "puzzle", "patterns"], "price": 19.99, "asin": "B0CSPJT21Q", "afflink": "https://www.amazon.com.au/dp/B0CSPJT21Q?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61uYRF8wYHL.jpg", "note": "A smoother cube for learning to solve. Problem solving and persistence, and very satisfying when it finally clicks.", "search": "Rubik's Cube 3x3 Magnetic Speed Cube"},
  {"id": "p486", "name": "Snap Circuits Jr. SC-100", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "cognitive", "social"], "tags": ["STEM", "circuits", "experiments", "science"], "price": 89.9, "asin": "B00008BFZH", "afflink": "https://www.amazon.com.au/dp/B00008BFZH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71wjLjOAVBL._AC_SL1500_.jpg", "note": "Over a hundred electronics projects that snap onto a grid, with no soldering. Great for kids who are super interested in science and putting things together.", "search": "Snap Circuits Jr. SC-100", "fam": "circuit-kit"},
  {"id": "p487", "name": "Thames & Kosmos Ooze Labs Chemistry Station", "age_min": 96, "age_max": 107, "dev_areas": ["fine", "sensory", "cognitive"], "tags": ["STEM", "experiments", "science"], "price": 71.99, "asin": "B07B7W5S3H", "afflink": "https://www.amazon.com.au/dp/B07B7W5S3H?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91PSN57KN7L._AC_SL1500_.jpg", "note": "Ten experiments with a real test-tube station. Great for kids who like mixing things and watching them react.", "search": "Thames & Kosmos Ooze Labs Chemistry Station", "fam": "science-kit"},
  {"id": "p488", "name": "Ticket to Ride Europe", "age_min": 96, "age_max": 107, "dev_areas": ["gross", "cognitive", "social", "language"], "tags": ["board-game", "turn-taking"], "price": 49.95, "asin": "B074N9B2XH", "afflink": "https://www.amazon.com.au/dp/B074N9B2XH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81gs2ynFfgL.jpg", "note": "The full version of Ticket to Ride, for families who are ready for a bigger strategy game. Lots of planning ahead.", "search": "Ticket to Ride Europe"},
  {"id": "p489", "name": "UNO Show 'Em No Mercy", "age_min": 96, "age_max": 107, "dev_areas": ["cognitive", "social"], "tags": ["card-game", "turn-taking"], "price": 11.95, "asin": "B0CBNR2ML6", "afflink": "https://www.amazon.com.au/dp/B0CBNR2ML6?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61-FBLI+khL.jpg", "note": "I personally have this in my therapy kit, and kids love the unhingedness of getting to put down several +10s in a row. Chaotic but fun.", "search": "UNO Show 'Em No Mercy"},
  {"id": "p490", "name": "Walkie Talkies for Kids (rechargeable)", "age_min": 96, "age_max": 107, "dev_areas": ["gross", "social", "language"], "tags": ["outdoor", "turn-taking"], "price": 65.99, "asin": "B0DWF3CCQT", "afflink": "https://www.amazon.com.au/dp/B0DWF3CCQT?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71p6DJkQtlL.jpg", "note": "Longer range, for backyard and campsite missions.", "search": "Walkie Talkies for Kids (rechargeable)"},
  {"id": "p491", "name": "Zombie Kidz Evolution", "age_min": 96, "age_max": 107, "dev_areas": ["cognitive", "social", "language"], "tags": ["board-game", "turn-taking"], "price": 31.95, "asin": "B07M5BFVP2", "afflink": "https://www.amazon.com.au/dp/B07M5BFVP2?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81Wo+fRuFwL.jpg", "note": "The reviews look great, and everyone describes this game as great fun family time.", "search": "Zombie Kidz Evolution"},
  // ── Oct 2026 gap picks: categories parents named that the library didn't cover ──
  {"id": "p492", "name": "Fisher-Price Little People Push & Play Tractor", "age_min": 12, "age_max": 35, "dev_areas": ["gross", "fine", "language", "social"], "tags": ["vehicles", "pretend-play", "farm", "cause-effect"], "price": 41.99, "asin": "B0DNZRB87R", "afflink": "https://www.amazon.com.au/dp/B0DNZRB87R?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71BQ0Hw-TNL._AC_SL1500_.jpg", "note": "A tractor with a farmer who rides along. Push it, load it, and it ends up in every farm game.", "search": "Fisher-Price Little People Push & Play Tractor", "fam": "tractor"},
  {"id": "p493", "name": "Green Toys Tractor", "age_min": 24, "age_max": 59, "dev_areas": ["gross", "fine", "social", "language"], "tags": ["vehicles", "outdoor", "sand", "farm", "pretend-play"], "price": 36.65, "asin": "B00BN6QAXQ", "afflink": "https://www.amazon.com.au/dp/B00BN6QAXQ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71E7a1oL8ZL._AC_SL1500_.jpg", "note": "Big, chunky and fine in the sandpit or the veggie patch. Made from recycled milk bottles, so it can live outside.", "search": "Green Toys Tractor", "fam": "tractor"},
  {"id": "p494", "name": "LEGO City Tractor 60498", "age_min": 72, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["constructive", "vehicles", "farm"], "price": 22.0, "asin": "B0FPXGS8Z3", "afflink": "https://www.amazon.com.au/dp/B0FPXGS8Z3?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/813DJRFWMcL._AC_SL1500_.jpg", "note": "A small LEGO City build with a farmer and big rubber tyres. A good first set for a tractor kid who's ready for real LEGO.", "search": "LEGO City Tractor 60498"},
  {"id": "p495", "name": "Playgro My First Soccer Ball", "age_min": 7, "age_max": 35, "dev_areas": ["gross", "fine", "sensory"], "tags": ["sports", "movement", "soft-play", "grasping"], "price": 13.0, "asin": "B001RCU77G", "afflink": "https://www.amazon.com.au/dp/B001RCU77G?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/7114OhO-H+L._AC_SL1500_.jpg", "note": "A soft fabric ball that rattles. Little ones can roll it, chase it and kick it inside without anything getting broken.", "search": "Playgro My First Soccer Ball", "fam": "soccer"},
  {"id": "p496", "name": "Little Tikes Easy Score Soccer Set", "age_min": 24, "age_max": 59, "dev_areas": ["gross", "social"], "tags": ["sports", "outdoor", "movement"], "price": 59.0, "asin": "B00840LCAU", "afflink": "https://www.amazon.com.au/dp/B00840LCAU?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/515wnbR7tqL._AC_SL1000_.jpg", "note": "A toddler-height goal with a ball and pump. Lots of kicking, chasing and running back to try again.", "search": "Little Tikes Easy Score Soccer Set", "fam": "soccer"},
  {"id": "p497", "name": "SKLZ Pro Mini Soccer Goal", "age_min": 48, "age_max": 107, "dev_areas": ["gross", "social"], "tags": ["sports", "movement", "outdoor"], "price": 44.95, "asin": "B09HC9PPJC", "afflink": "https://www.amazon.com.au/dp/B09HC9PPJC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61+YzqI4PaL._AC_SL1500_.jpg", "note": "A small goal with a soft ball that works in the hallway or the backyard. Good for kids who want to practise their shots every day.", "search": "SKLZ Pro Mini Soccer Goal", "fam": "soccer"},
  {"id": "p498", "name": "Powerplay Plastic Cricket Set", "age_min": 36, "age_max": 71, "dev_areas": ["gross", "social"], "tags": ["sports", "outdoor", "movement"], "price": 63.4, "asin": "B0DZY192QY", "afflink": "https://www.amazon.com.au/dp/B0DZY192QY?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/717O8RfM-xL._AC_SL1500_.jpg", "note": "A plastic bat, ball and stumps for backyard cricket with the family. Light enough for a little one to swing.", "search": "Powerplay Plastic Cricket Set", "fam": "cricket"},
  {"id": "p499", "name": "Melissa & Doug Reusable Puffy Sticker Play Set (Fairy)", "age_min": 36, "age_max": 83, "dev_areas": ["fine", "language", "cognitive"], "tags": ["pretend-play", "storytelling", "creative", "reusable"], "price": 14.99, "asin": "B00F1A6JSG", "afflink": "https://www.amazon.com.au/dp/B00F1A6JSG?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81eQOcB0njL._AC_SL1500_.jpg", "note": "The fairy version of the puffy stickers I love. They build a scene, peel the stickers off and build it again. Good for the car.", "search": "Melissa & Doug Reusable Puffy Sticker Play Set (Fairy)", "fam": "puffy-stickers"},
  {"id": "p500", "name": "Schleich Bayala Fairy Eyela with Unicorn", "age_min": 60, "age_max": 107, "dev_areas": ["language", "social", "fine"], "tags": ["pretend-play", "storytelling", "animals"], "price": 44.97, "asin": "B09S3WNLRJ", "afflink": "https://www.amazon.com.au/dp/B09S3WNLRJ?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71s+Eq+YNzL._AC_SL1500_.jpg", "note": "A fairy and her unicorn, with the same quality as the Schleich farm animals. They end up in every story.", "search": "Schleich Bayala Fairy Eyela with Unicorn"},
  {"id": "p501", "name": "4M Mould & Paint Flower Fairy", "age_min": 60, "age_max": 107, "dev_areas": ["fine"], "tags": ["craft", "art", "creative"], "price": 19.19, "asin": "B00067U818", "afflink": "https://www.amazon.com.au/dp/B00067U818?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81PNJQukpaL._AC_SL1500_.jpg", "note": "Pour the plaster, let it set, pop out the fairies and paint them into six fridge magnets. A grown-up helps with the plaster mixing.", "search": "4M Mould & Paint Flower Fairy"},
  {"id": "p502", "name": "Melissa & Doug Reusable Puffy Sticker Play Set (Mermaid)", "age_min": 36, "age_max": 83, "dev_areas": ["fine", "language", "cognitive"], "tags": ["pretend-play", "storytelling", "creative", "reusable"], "price": 12.99, "asin": "B00F1A6AIA", "afflink": "https://www.amazon.com.au/dp/B00F1A6AIA?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/811WBcu5yqL._AC_SL1500_.jpg", "note": "Mermaid scenes they can build, peel off and build again. A good one for the car or a cafe.", "search": "Melissa & Doug Reusable Puffy Sticker Play Set (Mermaid)", "fam": "puffy-stickers"},
  {"id": "p503", "name": "Peaceable Kingdom Shimmery Magical Mermaid Floor Puzzle", "age_min": 36, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["jigsaw", "puzzle", "problem-solving"], "price": 31.22, "asin": "B07N8FWLSH", "afflink": "https://www.amazon.com.au/dp/B07N8FWLSH?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91974LuJrrL._AC_SL1500_.jpg", "note": "A big shimmery floor puzzle with large pieces. One to do together on the lounge room floor.", "search": "Peaceable Kingdom Shimmery Magical Mermaid Floor Puzzle", "fam": "jigsaw"},
  {"id": "p504", "name": "Barbie Mermaid Doll with Pet Dolphin", "age_min": 36, "age_max": 95, "dev_areas": ["language", "social", "fine"], "tags": ["dolls", "pretend-play", "water", "bath", "storytelling"], "price": 25.0, "asin": "B0CKJ5QFH6", "afflink": "https://www.amazon.com.au/dp/B0CKJ5QFH6?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81FkSMP-zSL._AC_SL1500_.jpg", "note": "For the mermaid kid who also loves dolls. Into the bath for an underwater story.", "search": "Barbie Mermaid Doll with Pet Dolphin"},
  {"id": "p505", "name": "Wild Republic Hug'ems Black Cat Plush", "age_min": 12, "age_max": 71, "dev_areas": ["social", "language", "sensory"], "tags": ["plush", "animals", "nurturing"], "price": 12.49, "asin": "B01C5SRLGA", "afflink": "https://www.amazon.com.au/dp/B01C5SRLGA?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71ybD8v3+fL._AC_SL1500_.jpg", "note": "A soft, realistic cat to carry everywhere. Cheap, and there are other colours if theirs is a tabby.", "search": "Wild Republic Hug'ems Black Cat Plush"},
  {"id": "p506", "name": "Hape Family Pets Dolls House Set", "age_min": 36, "age_max": 95, "dev_areas": ["fine", "language", "social"], "tags": ["animals", "pretend-play", "dolls", "storytelling"], "price": 33.98, "asin": "B00712O56A", "afflink": "https://www.amazon.com.au/dp/B00712O56A?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/6108L+oCZVL._AC_SL1500_.jpg", "note": "Small wooden family pets for the dolls house or any pretend play.", "search": "Hape Family Pets Dolls House Set"},
  {"id": "p507", "name": "KRAFUN Puppies & Kittens Sewing Kit", "age_min": 60, "age_max": 107, "dev_areas": ["fine", "cognitive"], "tags": ["craft", "art", "creative", "animals"], "price": 29.99, "asin": "B0C2XYP6L3", "afflink": "https://www.amazon.com.au/dp/B0C2XYP6L3?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91mB2CWZP9L._AC_SL1500_.jpg", "note": "Sew your own felt kittens and puppies. For crafty kids who love animals, and they keep what they make.", "search": "KRAFUN Puppies & Kittens Sewing Kit"},
  {"id": "p508", "name": "Little Kids Fubbles No-Spill Bubble Tumbler", "age_min": 18, "age_max": 59, "dev_areas": ["fine", "sensory", "gross"], "tags": ["outdoor", "cause-effect", "movement"], "price": 28.08, "asin": "B00BN4QVF0", "afflink": "https://www.amazon.com.au/dp/B00BN4QVF0?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61KPNRqXDUL._AC_SL1500_.jpg", "note": "A no-spill tub, so toddlers can hold the bubbles themselves without tipping it all out.", "search": "Little Kids Fubbles No-Spill Bubble Tumbler", "fam": "bubbles"},
  {"id": "p509", "name": "SLOOSH Bubble Lawn Mower", "age_min": 36, "age_max": 59, "dev_areas": ["gross", "sensory"], "tags": ["outdoor", "movement", "walking", "pretend-play"], "price": 39.99, "asin": "B0BZXNZZ67", "afflink": "https://www.amazon.com.au/dp/B0BZXNZZ67?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91K3VGf3fsL._AC_SL1500_.jpg", "note": "Push it round the yard and it blows bubbles. Mowing the lawn like the grown-ups, with bubbles.", "search": "SLOOSH Bubble Lawn Mower", "fam": "bubbles"},
  {"id": "p510", "name": "B. toys Bug Bungalow Insect Catching Kit", "age_min": 36, "age_max": 95, "dev_areas": ["fine", "cognitive", "gross"], "tags": ["outdoor", "science", "animals"], "price": 21.9, "asin": "B01M0V474Y", "afflink": "https://www.amazon.com.au/dp/B01M0V474Y?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71mJaGDesEL._AC_SL1500_.jpg", "note": "A mesh bug house with tools for catching bugs and having a good look. Then they let them go again.", "search": "B. toys Bug Bungalow Insect Catching Kit", "fam": "bug-kit"},
  {"id": "p511", "name": "National Geographic Bug Catcher Kit and Habitat", "age_min": 48, "age_max": 107, "dev_areas": ["cognitive", "fine", "gross"], "tags": ["outdoor", "science", "STEM", "animals"], "price": 44.99, "asin": "B0DQ64BQX5", "afflink": "https://www.amazon.com.au/dp/B0DQ64BQX5?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81a8GKmMmyL._AC_SL1500_.jpg", "note": "A bigger kit with a habitat and catching tools, for kids who spend all day in the garden looking under rocks.", "search": "National Geographic Bug Catcher Kit and Habitat", "fam": "bug-kit"},
  {"id": "p512", "name": "Adventure Kidz Outdoor Exploration Kit", "age_min": 36, "age_max": 107, "dev_areas": ["gross", "cognitive", "language"], "tags": ["outdoor", "science", "pretend-play", "movement"], "price": 43.7, "asin": "B0948PBFV3", "afflink": "https://www.amazon.com.au/dp/B0948PBFV3?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71y8doRKsxL._AC_SL1500_.jpg", "note": "Binoculars, a torch, a compass and a magnifying glass in a backpack. Bush walks, camping and backyard missions.", "search": "Adventure Kidz Outdoor Exploration Kit"},
  {"id": "p513", "name": "LEGO DUPLO Rescue Fire Engine", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "cognitive", "social"], "tags": ["constructive", "blocks-tiles", "vehicles", "pretend-play"], "price": 42.49, "asin": "B09BNTZH9C", "afflink": "https://www.amazon.com.au/dp/B09BNTZH9C?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81ACVut2SBL._AC_SL1500_.jpg", "note": "A DUPLO fire engine with a firefighter, lights and sounds. Simple to build, then straight into rescues.", "search": "LEGO DUPLO Rescue Fire Engine"},
  {"id": "p514", "name": "Melissa & Doug Giant Fire Truck Floor Puzzle", "age_min": 36, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["jigsaw", "puzzle", "vehicles"], "price": 20.99, "asin": "B000084JMC", "afflink": "https://www.amazon.com.au/dp/B000084JMC?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71g+lQ1XS1L._AC_SL1500_.jpg", "note": "A big floor puzzle of a fire truck with thick pieces. A good one for a fire truck kid who's starting puzzles.", "search": "Melissa & Doug Giant Fire Truck Floor Puzzle", "fam": "jigsaw"},
  {"id": "p515", "name": "Siku Water Cannon Fire Truck", "age_min": 36, "age_max": 95, "dev_areas": ["fine", "language"], "tags": ["vehicles", "pretend-play"], "price": 7.99, "asin": "B0002HR2GG", "afflink": "https://www.amazon.com.au/dp/B0002HR2GG?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/41YUSK-79tL._AC_SL1000_.jpg", "note": "A small metal fire truck that fits in a pocket. Cheap, and a good stocking filler.", "search": "Siku Water Cannon Fire Truck"},
  {"id": "p516", "name": "PAW Patrol All Paws On Deck Figure Pack (10)", "age_min": 36, "age_max": 71, "dev_areas": ["language", "social"], "tags": ["pretend-play", "storytelling", "role-play"], "price": 39.0, "asin": "B0B4Y639SN", "afflink": "https://www.amazon.com.au/dp/B0B4Y639SN?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81cPgudNoPL._AC_SL1500_.jpg", "note": "Ten pups and characters in one pack. Every Paw Patrol kid wants the whole team for their rescues.", "search": "PAW Patrol All Paws On Deck Figure Pack (10)"},
  {"id": "p517", "name": "Ravensburger Paw Patrol 4 Puzzles in a Box", "age_min": 48, "age_max": 71, "dev_areas": ["fine", "cognitive"], "tags": ["jigsaw", "puzzle"], "price": 17.99, "asin": "B08PM49PCT", "afflink": "https://www.amazon.com.au/dp/B08PM49PCT?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71u1ryaGMOL._AC_SL1000_.jpg", "note": "Four puzzles that go from 12 to 24 pieces, so they can work up as they go.", "search": "Ravensburger Paw Patrol 4 Puzzles in a Box", "fam": "jigsaw"},
  {"id": "p518", "name": "PAW Patrol Rex's Dinosaur Rescue Vehicle", "age_min": 36, "age_max": 71, "dev_areas": ["language", "fine"], "tags": ["vehicles", "dinosaurs", "pretend-play"], "price": 19.99, "asin": "B0DCBZWQVW", "afflink": "https://www.amazon.com.au/dp/B0DCBZWQVW?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71vaBR7OcCL._AC_SL1500_.jpg", "note": "A pup and his vehicle in one. Good for a kid who's into Paw Patrol and dinosaurs.", "search": "PAW Patrol Rex's Dinosaur Rescue Vehicle"},
  {"id": "p519", "name": "Mattel Disney Frozen Elsa Doll (Frozen 2)", "age_min": 36, "age_max": 95, "dev_areas": ["language", "social", "fine"], "tags": ["dolls", "pretend-play", "storytelling"], "price": 20.0, "asin": "B0B2BF33BG", "afflink": "https://www.amazon.com.au/dp/B0B2BF33BG?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81Lk1garPpL._AC_SL1500_.jpg", "note": "The classic Elsa doll. For the kid who sings Let It Go on repeat.", "search": "Mattel Disney Frozen Elsa Doll (Frozen 2)"},
  {"id": "p520", "name": "LEGO DUPLO Disney Frozen Creative Box with Elsa and Olaf", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "cognitive"], "tags": ["constructive", "blocks-tiles", "pretend-play"], "price": 22.0, "asin": "B01N9DA50W", "afflink": "https://www.amazon.com.au/dp/B01N9DA50W?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/810ECCLTlCL._AC_SL1500_.jpg", "note": "DUPLO bricks with Elsa and Olaf, for free building with the characters they love.", "search": "LEGO DUPLO Disney Frozen Creative Box with Elsa and Olaf"},
  {"id": "p521", "name": "Tonies Olaf Figure", "age_min": 36, "age_max": 83, "dev_areas": ["language"], "tags": ["audio", "music", "storytelling"], "price": 29.0, "asin": "B0BDSWM47P", "afflink": "https://www.amazon.com.au/dp/B0BDSWM47P?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/41+iipst7WL._AC_SL1333_.jpg", "note": "Olaf's songs and stories for the Toniebox. You'll need a Toniebox for this one.", "search": "Tonies Olaf Figure"},
  {"id": "p522", "name": "KidKraft Chelsea Cottage Wooden Dolls House", "age_min": 36, "age_max": 95, "dev_areas": ["fine", "language", "social"], "tags": ["dolls", "pretend-play", "storytelling", "role-play"], "price": 109.35, "asin": "B003ADVR3S", "afflink": "https://www.amazon.com.au/dp/B003ADVR3S?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91+2o967tvL._AC_SL1500_.jpg", "note": "A wooden dolls house with the furniture included. A big gift, and one they'll play with for years.", "search": "KidKraft Chelsea Cottage Wooden Dolls House", "fam": "dolls-house"},
  {"id": "p523", "name": "Hape Baby Nursery Dolls House Furniture", "age_min": 36, "age_max": 95, "dev_areas": ["fine", "language", "social"], "tags": ["dolls", "nurturing", "pretend-play"], "price": 34.36, "asin": "B007827L6Y", "afflink": "https://www.amazon.com.au/dp/B007827L6Y?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71WLaNoiRzL._AC_SL1500_.jpg", "note": "A nursery set for a dolls house, with a cot and baby things. Lots of looking-after-the-baby play.", "search": "Hape Baby Nursery Dolls House Furniture"},
  {"id": "p524", "name": "Melissa & Doug Let's Explore Campfire S'mores Play Set", "age_min": 36, "age_max": 71, "dev_areas": ["language", "social", "fine"], "tags": ["pretend-play", "cooking", "role-play", "storytelling"], "price": 59.99, "asin": "B099FGV77J", "afflink": "https://www.amazon.com.au/dp/B099FGV77J?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71RqSl3rYLL._AC_SL1500_.jpg", "note": "A pretend campfire with s'mores and roasting sticks. Camping in the lounge room.", "search": "Melissa & Doug Let's Explore Campfire S'mores Play Set", "fam": "camping"},
  {"id": "p525", "name": "Fun Little Toys Kids Play Tent with Camping Gear", "age_min": 36, "age_max": 83, "dev_areas": ["gross", "language", "social"], "tags": ["pretend-play", "role-play", "outdoor"], "price": 61.99, "asin": "B07KKB4LFM", "afflink": "https://www.amazon.com.au/dp/B07KKB4LFM?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71HyYCPQleL._AC_SL1500_.jpg", "note": "A kids' tent with pretend camping gear. Inside on a rainy day or out in the backyard.", "search": "Fun Little Toys Kids Play Tent with Camping Gear", "fam": "camping"},
  {"id": "p526", "name": "Little Tikes Easy Store 3-Foot Trampoline", "age_min": 36, "age_max": 71, "dev_areas": ["gross", "sensory"], "tags": ["movement", "jumping", "balance", "vestibular"], "price": 124.95, "asin": "B08R9XZ2NX", "afflink": "https://www.amazon.com.au/dp/B08R9XZ2NX?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71NYs4MrYzL._AC_SL1500_.jpg", "note": "A small trampoline with a handlebar that folds away. For the kid who bounces off the couch.", "search": "Little Tikes Easy Store 3-Foot Trampoline", "fam": "trampoline"},
  {"id": "p527", "name": "SkyBound 36 Inch Kids Trampoline with Handle", "age_min": 36, "age_max": 71, "dev_areas": ["gross", "sensory"], "tags": ["movement", "jumping", "balance", "vestibular"], "price": 80.43, "asin": "B0CXC12PYX", "afflink": "https://www.amazon.com.au/dp/B0CXC12PYX?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/51WweAYt2PL._AC_SL1500_.jpg", "note": "A cheaper mini trampoline with a handle to hold while they bounce.", "search": "SkyBound 36 Inch Kids Trampoline with Handle", "fam": "trampoline"},
  {"id": "p528", "name": "LEGO DUPLO Town First Time at the Airport", "age_min": 24, "age_max": 59, "dev_areas": ["fine", "language", "social"], "tags": ["constructive", "blocks-tiles", "vehicles", "pretend-play"], "price": 39.95, "asin": "B0DWDQ9YBY", "afflink": "https://www.amazon.com.au/dp/B0DWDQ9YBY?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81SEyGnM-GL._AC_SL1500_.jpg", "note": "A DUPLO plane and airport. Good before a first flight, so they can play out what will happen.", "search": "LEGO DUPLO Town First Time at the Airport"},
  {"id": "p529", "name": "Matchbox Takeoff Adventure Airport Set", "age_min": 36, "age_max": 83, "dev_areas": ["fine", "language"], "tags": ["vehicles", "pretend-play"], "price": 29.88, "asin": "B0D7PVGZJK", "afflink": "https://www.amazon.com.au/dp/B0D7PVGZJK?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/71FEFFs8taL._AC_SL1500_.jpg", "note": "A Matchbox airport with a plane and a car. For kids already into small cars.", "search": "Matchbox Takeoff Adventure Airport Set"},
  {"id": "p530", "name": "Winning Moves No Stress Chess", "age_min": 84, "age_max": 119, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "problem-solving"], "price": 51.0, "asin": "B0007Q1IO4", "afflink": "https://www.amazon.com.au/dp/B0007Q1IO4?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81i+qkFWKdL._AC_SL1500_.jpg", "note": "Cards tell you which piece to move and how, so kids can play a real game before they know all the rules.", "search": "Winning Moves No Stress Chess", "fam": "chess"},
  {"id": "p531", "name": "Harry Potter Chess Teacher Beginner Set", "age_min": 72, "age_max": 119, "dev_areas": ["cognitive", "social"], "tags": ["board-game", "problem-solving"], "price": 58.13, "asin": "B0CSYJMFHV", "afflink": "https://www.amazon.com.au/dp/B0CSYJMFHV?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/91ZX3rrV+TL._AC_SL1500_.jpg", "note": "Each piece shows how it moves. Good for a Harry Potter fan learning chess.", "search": "Harry Potter Chess Teacher Beginner Set", "fam": "chess"},
  {"id": "p532", "name": "Hape Wooden Penguin Musical Wobbler", "age_min": 12, "age_max": 35, "dev_areas": ["gross", "sensory", "cognitive"], "tags": ["music", "cause-effect", "grasping"], "price": 17.0, "asin": "B07217GBJB", "afflink": "https://www.amazon.com.au/dp/B07217GBJB?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/61J+Bpa4bsL._AC_SL1500_.jpg", "note": "Push it and it wobbles back with a chime. Little ones love making it go again and again.", "search": "Hape Wooden Penguin Musical Wobbler"},
  {"id": "p533", "name": "Baby Einstein Star Bright Symphony", "age_min": 3, "age_max": 24, "dev_areas": ["sensory", "cognitive", "fine"], "tags": ["music", "cause-effect", "visual", "audio"], "price": 18.94, "asin": "B00TFAOIY0", "afflink": "https://www.amazon.com.au/dp/B00TFAOIY0?tag=brittanyot0c-22", "img": "https://m.media-amazon.com/images/I/81qQijqmLrL._AC_SL1500_.jpg", "note": "Press a star to hear an instrument and see the lights. Cheap and easy for little hands.", "search": "Baby Einstein Star Bright Symphony"},
  // 0-6 months
  {
    id:"p1", name:"Young Wonderer High Contrast Baby Book", age_min:0, age_max:6,
    dev_areas:["sensory","cognitive"], tags:["visual","tummy-time"],
    price:24.99, asin:"064684704X", afflink:"https://www.amazon.com.au/dp/064684704X/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81Cctsg094L._AC_SX679_.jpg",
    note:"Bold black-and-white patterns are exactly what newborn eyes need. Great for tummy time and those early weeks.",
    search:"Young Wonderer High Contrast Baby Book"
  },
  {
    id:"p2", fam:"water-mat", name:"Young Wonderer Sensory Water Mat", age_min:0, age_max:12,
    dev_areas:["sensory","gross","fine"], tags:["tummy-time","sensory","water"],
    price:39.99, asin:"B0DBH9PSP2", afflink:"https://www.amazon.com.au/dp/B0DBH9PSP2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71dCRSG7tWL._AC_SX679_.jpg",
    note:"A favourite for tummy time. Most babies will stay on it a good while before they start complaining.",
    search:"Young Wonderer Sensory Water Mat tummy time"
  },
  {
    id:"p3", fam:"water-mat", name:"High Contrast Black & White Tummy Time Water Mat", age_min:0, age_max:12,
    dev_areas:["sensory","gross"], tags:["tummy-time","water","visual"],
    price:24.99, asin:"B0DBH9PSP2", afflink:"https://www.amazon.com.au/dp/B0DBH9PSP2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71dCRSG7tWL._AC_SX679_.jpg",
    note:"Black and white, sensory, tummy time. Everything a newborn needs in one mat.",
    search:"High Contrast Black White Tummy Time Water Mat Young Wonderer"
  },
  // 4-12 months
  {
    id:"p4", name:"Crawling Crab Baby Toy with Music & Lights", age_min:4, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["cause-effect","crawling","movement"],
    price:22.99, asin:"B09TS9BLGS", afflink:"https://www.amazon.com.au/dp/B09TS9BLGS/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61ey5f2SteL._AC_SX679_.jpg",
    note:"Moves side to side and lights up. Babies track it with their eyes and crawl after it. Great neck and core workout.",
    search:"crawling crab baby toy light music"
  },
  {
    id:"p5", name:"KaeKid Musical Dancing Duck Toy", age_min:4, age_max:12,
    dev_areas:["gross","sensory","language"], tags:["cause-effect","crawling","music"],
    price:54.99, asin:"B0DYJTZCPX", afflink:"https://www.amazon.com.au/dp/B0DYJTZCPX/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61W4vKgdjrL._AC_SX679_.jpg",
    note:"Music, lights, and movement all together. Great for tummy time motivation and encouraging crawling.",
    search:"KaeKid Musical Dancing Duck Baby Toy"
  },
  {
    id:"p6", name:"VTech Turn & Learn Cube", age_min:6, age_max:12,
    dev_areas:["fine","cognitive","language"], tags:["cause-effect"],
    price:24, asin:"B00GNAP830", afflink:"https://www.amazon.com.au/dp/B00GNAP830/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/6187i8MX97L._AC_SX679_.jpg",
    note:"Buttons, shapes, music and flaps. Lots of ways for little hands to explore cause and effect.",
    search:"VTech Turn Learn Cube 150503"
  },
  {
    id:"p7", name:"VTech Light and Move Learning Ball", age_min:6, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["cause-effect","crawling","movement"],
    price:20, asin:"B01D2TC31Y", afflink:"https://www.amazon.com.au/dp/B01D2TC31Y/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71toQH2A1hL._AC_SX679_.jpg",
    note:"Rolls away and lights up. Babies set off after it and keep going.",
    search:"VTech Light Move Learning Ball crawl"
  },
  {
    id:"p8", name:"Young Wonderer Hanging Sensory Toy (Brooklyn the Bear)", age_min:0, age_max:6,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","visual","grasping"],
    price:21.99, asin:"B0FG8FKQ9D", afflink:"https://www.amazon.com.au/dp/B0FG8FKQ9D/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61TAdRAnNPL._AC_SX679_.jpg",
    note:"Hangs on a pram or cot. Textures, crinkle sounds and faces to stare at and grab.",
    search:"Young Wonderer Hanging Sensory Toy Brooklyn Bear"
  },
  // 9-18 months
  {
    id:"p9", name:"INFANTINO Bop & Drop Ball Tower", age_min:9, age_max:18,
    dev_areas:["cognitive","fine","sensory"], tags:["cause-effect","visual-tracking"],
    price:52, asin:"B01MG1Q1D8", afflink:"https://www.amazon.com.au/dp/B01MG1Q1D8/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71UtdhcPgbL._AC_SX679_.jpg",
    note:"Watch the balls go round and round. Babies follow them with their eyes and wait for the next one.",
    search:"INFANTINO Bop Drop Ball Tower marble track"
  },
  {
    id:"p10", name:"TOMY Pic N Pop Toy", age_min:9, age_max:36,
    dev_areas:["gross","cognitive","sensory"], tags:["cause-effect","walking","movement"],
    price:27.99, asin:"B002NWJ1LW", afflink:"https://www.amazon.com.au/dp/B002NWJ1LW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61Au2YeaOIL._AC_SY879_.jpg",
    note:"Push it along and watch the balls pop out. Great for early walkers: exciting, motivating, and simple.",
    search:"TOMY E71161 Pic N Pop Toy multicoloured"
  },
  {
    id:"p11", name:"Hape Pound & Tap Bench (Xylophone & Keyboard)", age_min:12, age_max:24,
    dev_areas:["fine","cognitive","sensory"], tags:["cause-effect","hand-strength","music"],
    price:53, asin:"B00712O2D6", afflink:"https://www.amazon.com.au/dp/B00712O2D6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71HkmCUbupL._AC_SX679_.jpg",
    note:"Bash the balls through the holes and they land on the xylophone. Noise with a reason behind it.",
    search:"Hape Pound Tap Bench Xylophone toddler"
  },
  {
    id:"p12", name:"Where's Spot Lift the Flap Book", age_min:12, age_max:36,
    dev_areas:["language","cognitive","fine"], tags:["books","language"],
    price:15, asin:"0723263663", afflink:"https://www.amazon.com.au/dp/0723263663/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71KVqcTu0HL._SY522_.jpg",
    note:"A classic for good reason. Simple language, lift-the-flap fun, and it travels everywhere.",
    search:"Where's Spot Lift Flap Book Eric Hill"
  },
  // 12-24 months
  {
    id:"p13", name:"VTech Feed Me Dino Activity Toy", age_min:12, age_max:24,
    dev_areas:["fine","cognitive","language"], tags:["cause-effect","feeding","dinosaurs"],
    price:24, asin:"B00K5PJMYA", afflink:"https://www.amazon.com.au/dp/B00K5PJMYA/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/815MxLEf8sL._AC_SX679_.jpg",
    note:"Feed the dino and watch it react. A hit with toddlers who love dinosaurs and cause-and-effect play.",
    search:"VTech Feed Me Dino Activity Toy"
  },
  {
    id:"p14", name:"LEGO DUPLO My First Number Train", age_min:18, age_max:48,
    dev_areas:["fine","cognitive","language"], tags:["constructive","vehicles","trains","blocks-tiles","numbers"],fam:"train-set",
    price:22, asin:"B08W5FV9GN", afflink:"https://www.amazon.com.au/dp/B08W5FV9GN/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81HByhoQf1L._AC_SX679_.jpg",
    note:"Trains kids can actually build and count with. Great for vehicle lovers who are starting to put things together.",
    search:"LEGO DUPLO My First Number Train 10954"
  },
  {
    id:"p15", name:"ALTGOU Baby Spinning Stacking Rainbow Ring Toy", age_min:6, age_max:24,
    dev_areas:["fine","cognitive","sensory"], tags:["stacking","cause-effect","visual-input"],
    price:18, asin:"B0BGBS9FVD", afflink:"https://www.amazon.com.au/dp/B0BGBS9FVD/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/616BJo3B+qL._AC_SX679_.jpg",
    note:"Stack it, sort big to small, then flip it and watch them spin. Always gets a big reaction.",
    search:"ALTGOU Baby Spinning Stacking Rainbow Ring Stacker"
  },
  {
    id:"p16", name:"JCRBILW Rainbow Ball Colour Sorting Cups", age_min:12, age_max:36,
    dev_areas:["cognitive","fine","language"], tags:["sorting","colours","open-ended"],
    price:18, asin:"B077XGPKWW", afflink:"https://www.amazon.com.au/dp/B077XGPKWW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51+q1OJkzKL._AC_SX679_.jpg",
    note:"Sorting, stacking, pouring, hiding, pretend cooking. More versatile than they look, and great bang for buck.",
    search:"JCRBILW Rainbow Ball Cups Colour Sorting Toy"
  },
  {
    id:"p17", name:"Coogam Wooden Truck Shape Sorting Toy", age_min:24, age_max:48,
    dev_areas:["fine","cognitive"], tags:["sorting","problem-solving","vehicles","puzzle"],
    price:37, asin:"B0FGX6JTSD", afflink:"https://www.amazon.com.au/dp/B0FGX6JTSD/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/7138gUNtaaL._AC_SX679_.jpg",
    note:"Shapes, colours, and a truck all in one. The figures add a pretend play element that keeps kids coming back.",
    search:"Coogam Wooden Truck Shape Sorting Toy color matching"
  },
  {
    id:"p18", name:"Playgro Splash & Learn Bath Blocks", age_min:6, age_max:24,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","water","stacking"],
    price:26, asin:"B07CXZQNGH", afflink:"https://www.amazon.com.au/dp/B07CXZQNGH/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81H0n1CHiZL._AC_SX679_.jpg",
    note:"Soft floating stacking cubes. Scoop, pour, squirt, and a reason to stay in the bath a bit longer.",
    search:"Playgro Splash Learn Bath Blocks baby"
  },
  // 18m - 3yr
  {
    id:"p19", name:"Wooden Shape Sorter", age_min:12, age_max:36,
    dev_areas:["cognitive","fine"], tags:["sorting","problem-solving","puzzle"],
    price:18, asin:"B00005RF5G", afflink:"https://www.amazon.com.au/dp/B00005RF5G/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71SvToMje4L._AC_SX679_.jpg",
    note:"A staple for good reason. Turning a shape around until it finally drops through the hole is the whole game.",
    search:"wooden shape sorter toddler toy"
  },
  {
    id:"p20", name:"Fat Brain Squigz Suction Starter Set", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","sensory"], tags:["sensory","constructive","open-ended"],
    price:40, asin:"B00DEBB3N0", afflink:"https://www.amazon.com.au/dp/B00DEBB3N0/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71ZdC75TxgL._AC_SX679_.jpg",
    note:"Suction cup building pieces that stick to any smooth surface: bathroom tiles, windows, high chairs. Genuinely creative.",
    search:"Fat Brain Toys Squigz Starter Set 24 piece"
  },
  {
    id:"p21", name:"Wooden Magnetic Drawing Board", age_min:18, age_max:48,
    dev_areas:["fine","cognitive"], tags:["drawing","mark-making"],
    price:18, asin:"B005NJT4S2", afflink:"https://www.amazon.com.au/dp/B005NJT4S2/?tag=brittanyot0c-22",
    img:null,
    note:"Mess-free, reusable, and travels well. Great for early mark making and scribbling.",
    search:"Wooden Magnetic Drawing Board toddler"
  },
  {
    id:"p22", name:"Balance Bike (12 inch)", age_min:24, age_max:48,
    dev_areas:["gross"], tags:["balance","coordination","outdoor","movement"],
    price:65, asin:"B0BZC86CFM", afflink:"https://www.amazon.com.au/dp/B0BZC86CFM/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81AbYrRWq-L._AC_SX679_.jpg",
    note:"The best way to learn to ride a bike. No training wheels to unlearn later, which is the main thing.",
    search:"12 inch balance bike toddler"
  },
  {
    id:"p23", name:"9 Pcs Rainbow Play Scarves", age_min:12, age_max:84,
    dev_areas:["sensory","social","gross","language"], tags:["sensory","pretend-play","movement","open-ended","music"],
    price:15, asin:"B0D9LZ3ZVQ", afflink:"https://www.amazon.com.au/dp/B0D9LZ3ZVQ/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81kIJk6PcNL._AC_SX679_.jpg",
    note:"Silks for play are one of the most underrated toys. Peek-a-boo, dress-up, dancing, sensory exploration. Endless uses.",
    search:"JEOJEOY 9 Pcs Fabric Play Scarves Rainbow Dance"
  },
  {
    id:"p24", name:"JOYIN Dinosaur Truck Toy Set 13-in-1", age_min:36, age_max:72,
    dev_areas:["cognitive","social","language"], tags:["pretend-play","vehicles","dinosaurs","trains"],
    price:45, asin:"B0DLFKRDYG", afflink:"https://www.amazon.com.au/dp/B0DLFKRDYG/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91K9wIhzhcL._AC_SX679_.jpg",
    note:"Dinos AND vehicles in one. If your child loves both, this is the dream toy. Pull-back cars, carrier truck, figures.",
    search:"JOYIN Dinosaur Truck Toy Set 13 in 1 transport carrier"
  },
  {
    id:"p25", name:"Jaoxikai Take Apart Dinosaur Tool Set", age_min:36, age_max:72,
    dev_areas:["fine","cognitive"], tags:["tool-use","problem-solving","hand-strength","dinosaurs"],
    price:29.99, asin:"B0995KVK9G", afflink:"https://www.amazon.com.au/dp/B0995KVK9G/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81EGLaBn2sL._AC_SX679_.jpg",
    note:"Take it apart and put it back together with a real electric drill. Dino fans who love tools will be obsessed.",
    search:"Jaoxikai Take Apart Dinosaur Tool Set electric drill"
  },
  {
    id:"p26", name:"Dinosaur Colour Sorting Sensory Toy", age_min:24, age_max:60,
    dev_areas:["fine","cognitive","sensory"], tags:["sorting","dinosaurs","sensory","colours"],
    price:11, asin:"B0GZ48TJKZ", afflink:"https://www.amazon.com.au/dp/B0GZ48TJKZ/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61+jbKKFbzL._AC_SX679_.jpg",
    note:"Squish, sort, and find the right dino section. Perfect for dinosaur fans who like tactile, hands-on play.",
    search:"Dinosaur Color Sorting Sensory Toy toddler Montessori"
  },
  {
    id:"p27", name:"BRIO My First Railway Beginner Pack", age_min:18, age_max:36,
    dev_areas:["fine","cognitive","social"], tags:["vehicles","trains","constructive","pretend-play"],fam:"train-set",
    price:74, asin:"B00RMLUWGW", afflink:"https://www.amazon.com.au/dp/B00RMLUWGW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71FLO8ky54L._AC_SX679_.jpg",
    note:"A proper wooden train set. Magnetic connections, rainbow bridge, quality that lasts years. Good for train lovers from 18 months.",
    search:"BRIO My First Railway Beginner Pack 33727 wooden train"
  },
  {
    id:"p28", name:"Educational Insights Design & Drill Bolt-It Bucket", age_min:36, age_max:72,
    dev_areas:["fine","cognitive"], tags:["tool-use","problem-solving","hand-strength"],
    price:45, asin:"B09S7JKDS6", afflink:"https://www.amazon.com.au/dp/B09S7JKDS6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71Hm7OO76KL._AC_SX679_.jpg",
    note:"Real battery-operated drill, 56 pieces to bolt together. Kids who love tools and taking things apart will love this.",
    search:"Educational Insights Design Drill Bolt-It Bucket electric drill"
  },
  {
    id:"p29", name:"Montessori 2-in-1 Magnetic Maze & Alphabet Puzzle Board", age_min:24, age_max:60,
    dev_areas:["fine","cognitive","language"], tags:["sorting","problem-solving","letters","colours"],
    price:37, asin:"B0FZJR854K", afflink:"https://www.amazon.com.au/dp/B0FZJR854K/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71R8sZwtjXL._AC_SX679_.jpg",
    note:"Double-sided: colour sorting maze on one side, alphabet puzzle on the other. Gets a lot of use for the price.",
    search:"Montessori 2 in 1 Magnetic Maze Alphabet Puzzle Board toddler busy board"
  },
  {
    id:"p30", name:"Flower Garden Building Set (224 pcs)", age_min:36, age_max:96,
    dev_areas:["fine","cognitive"], tags:["constructive","creative","open-ended"],
    price:20, asin:"B0B9GV7QS5", afflink:"https://www.amazon.com.au/dp/B0B9GV7QS5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/813pDXZnndL._AC_SX679_.jpg",
    note:"A lovely alternative to ordinary blocks. Open-ended, so what gets made is up to them.",
    search:"Flower Garden Building Toys 224 pcs kids STEM"
  },
  // 2-4 years
  {
    id:"p31", name:"Play Dough Tool Set", age_min:24, age_max:72,
    dev_areas:["fine","sensory","cognitive"], tags:["playdough","hand-strength","sensory"],
    price:18, asin:"B09Z21T1V2", afflink:"https://www.amazon.com.au/dp/B09Z21T1V2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81WEl2xX0cL._AC_SX679_.jpg",
    note:"Play dough earns its keep. The tools give them more to do with it than squashing.",
    search:"play dough tools set kids toddler"
  },
  {
    id:"p32", name:"Egg Crayons", age_min:18, age_max:48,
    dev_areas:["fine"], tags:["drawing","grip"],
    price:12, asin:"144134294X", afflink:"https://www.amazon.com.au/dp/144134294X/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81QsxBeZ6FL._AC_SX679_.jpg",
    note:"The egg shape sits in the hand in a way skinny pencils don't. A cheap swap worth trying.",
    search:"egg crayons toddler grip"
  },
  {
    id:"p33", name:"Little Tikes Red Light Green Light Active Play", age_min:36, age_max:84,
    dev_areas:["gross","cognitive","social"], tags:["outdoor","movement","balance","turn-taking"],
    price:22, asin:"B0D8JTKFRY", afflink:"https://www.amazon.com.au/dp/B0D8JTKFRY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71BpEZ11TRL._AC_SY879_.jpg",
    note:"Red light green light, with a toy that calls it. Kids run, freeze, and argue about who moved.",
    search:"Little Tikes Red Light Green Light Active Play toy"
  },
  {
    id:"p34", name:"Lehoo Castle Light-Up Musical Stepping Stones", age_min:24, age_max:60,
    dev_areas:["gross","sensory","cognitive"], tags:["balance","coordination","sensory","movement"],
    price:60, asin:"B0F28PLY7Z", afflink:"https://www.amazon.com.au/dp/B0F28PLY7Z/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71e6uCuwgqL._AC_SX679_.jpg",
    note:"Step on them and they light up and play music. Ours end up in obstacle courses and as lava stepping stones.",
    search:"Lehoo Castle Light Up Musical Stepping Stones kids"
  },
  {
    id:"p35", name:"Kids Doctor Kit", age_min:36, age_max:72,
    dev_areas:["social","cognitive","language"], tags:["pretend-play","nurturing","role-play"],
    price:22, asin:"B09VZ69QND", afflink:"https://www.amazon.com.au/dp/B09VZ69QND/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/711PDSMLPUL._AC_SX679_.jpg",
    note:"Role play around caring for others is huge for empathy development at this age.",
    search:"kids doctor kit pretend play set"
  },
  {
    id:"p36", name:"Montessori Farm Animals Toys (10 Piece Set)", age_min:36, age_max:60,
    dev_areas:["fine","cognitive","language"], tags:["animals","sorting","pretend-play","problem-solving"],
    price:35, asin:"B0D9268BYY", afflink:"https://www.amazon.com.au/dp/B0D9268BYY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/41o0y6EgFDL._AC_.jpg",
    note:"Animals, barns, and keys that open them. Matching the key to the lock is the bit they get stuck on.",
    search:"Grarain Montessori Farm Animals Toys 10 piece set barns keys"
  },
  {
    id:"p37", name:"Play Kitchen Set", age_min:24, age_max:72,
    dev_areas:["social","language","fine","cognitive"], tags:["pretend-play","cooking","role-play"],
    price:65, asin:"B0FCSJDQHH", afflink:"https://www.amazon.com.au/dp/B0FCSJDQHH/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/7165vCFzWHL._AC_SX679_.jpg",
    note:"A well-stocked play kitchen gets used for years. Cooking, serving, running a cafe, feeding the dog.",
    search:"kids play kitchen set toddler"
  },
  {
    id:"p38", name:"Kids Art Easel (Chalkboard & Whiteboard)", age_min:36, age_max:96,
    dev_areas:["fine","cognitive"], tags:["drawing","vertical-surface","pre-writing"],
    price:59, asin:"B0GCYCVN3Y", afflink:"https://www.amazon.com.au/dp/B0GCYCVN3Y/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71gwphfXMeL._AC_SX679_.jpg",
    note:"Drawing vertically does things for shoulder stability and wrist control that drawing flat doesn't. Worth it.",
    search:"kids art easel chalkboard whiteboard double sided"
  },
  {
    id:"p39", name:"Sand and Water Activity Table", age_min:36, age_max:72,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","outdoor","water"],
    price:59, asin:"B07ZQ35ZVL", afflink:"https://www.amazon.com.au/dp/B07ZQ35ZVL/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51f3Ja-c9vL._AC_SX679_.jpg",
    note:"Pouring, scooping, burying, digging it out again. They'll get on with it on their own for ages.",
    search:"sand water activity table kids outdoor"
  },
  {
    id:"p40", fam:"fishing-game", name:"Wooden Magnetic Fishing Set", age_min:36, age_max:72,
    dev_areas:["fine","language","social"], tags:["hand-eye","turn-taking","vocabulary"],
    price:16, asin:"B07XDPJDBN", afflink:"https://www.amazon.com.au/dp/B07XDPJDBN/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71Fd6w5qwDL._AC_SX679_.jpg",
    note:"Catching the fish with a magnetic rod is harder than it looks. Easy to play in pairs.",
    search:"wooden magnetic fishing set kids toy"
  },
  {
    id:"p41", name:"Goliath Pop the Pig Game", age_min:36, age_max:72,
    dev_areas:["social","cognitive"], tags:["turn-taking","anticipation","board-game"],
    price:25, asin:"B00CYQ24QG", afflink:"https://www.amazon.com.au/dp/B00CYQ24QG/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81RpyENDxSL._AC_SY879_.jpg",
    note:"Simple enough for a two year old to follow. The belly popping never stops being funny.",
    search:"Goliath Pop the Pig Game preschool"
  },
  {
    id:"p42", name:"Stomp Rocket Launcher", age_min:36, age_max:120,
    dev_areas:["gross"], tags:["outdoor","jumping","cause-effect","movement","STEM"],
    price:36, asin:"B098B24R1P", afflink:"https://www.amazon.com.au/dp/B098B24R1P/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71093GmxSfS._AC_SX679_.jpg",
    note:"Jump on it and watch the rocket fly. Kids who can't sit still love this one. Good for siblings too.",
    search:"YEEBAY stomp rocket launcher kids foam rockets"
  },
  {
    id:"p43", name:"KOAICS Rainbow Crystal Gem Blocks (16 pcs)", age_min:36, age_max:72,
    dev_areas:["fine","cognitive","sensory"], tags:["constructive","light-play","open-ended","blocks-tiles"],
    price:40, asin:"B0B9NBLK6P", afflink:"https://www.amazon.com.au/dp/B0B9NBLK6P/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/712lTeRH-XL._AC_SX679_.jpg",
    note:"Beautiful sensory blocks. Hold them up to the light, sort by colour, build structures. Really lovely.",
    search:"KOAICS Rainbow Crystal Acrylic Gem Blocks sensory"
  },
  {
    id:"p44", name:"Coogam Fine Motor Finger Puppets Treasure Box", age_min:36, age_max:72,
    dev_areas:["fine","cognitive","language","social"], tags:["fine-motor","animals","pretend-play","problem-solving"],
    price:37, asin:"B0CTK2YQXY", afflink:"https://www.amazon.com.au/dp/B0CTK2YQXY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81d14HaFFqL._AC_SX679_.jpg",
    note:"Finger puppets hidden inside little locked boxes, each with a number to match. Working out which key goes where is the game.",
    search:"Coogam Fine Motor Finger Puppets Treasure Number Locks Pirate"
  },
  {
    id:"p45", name:"Garybank Emotional Dart Board with Emotion Cards", age_min:48, age_max:96,
    dev_areas:["social","cognitive","gross"], tags:["emotional-regulation","hand-eye","social","turn-taking"],
    price:48, asin:"B0D6GBTNNT", afflink:"https://www.amazon.com.au/dp/B0D6GBTNNT/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81wEO6SWROL._AC_SX679_.jpg",
    note:"Emotion cards plus a dart board. Throw, then talk about where it landed. One I like for home.",
    search:"Garybank Emotional Dart Social Skills Activities Kids emotion cards"
  },
  // 4-8 years
  {
    id:"p46", name:"LEGO Bluey Beach & Family Car Trip Set", age_min:48, age_max:72,
    dev_areas:["fine","cognitive","social","language"], tags:["constructive","pretend-play","blocks-tiles","vehicles"],
    price:30, asin:"B0DWF3TB7V", afflink:"https://www.amazon.com.au/dp/B0DWF3TB7V/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81DegoOVGFL._AC_SX679_.jpg",
    note:"Bluey LEGO is a winner for fans of the show. Building plus Bluey-world pretend play. A solid combo.",
    search:"LEGO Bluey Beach Family Car Trip 11202 preschool"
  },
  {
    id:"p47", name:"Wipe Clean Writing Practice Book", age_min:36, age_max:60,
    dev_areas:["fine","language","cognitive"], tags:["pre-writing","letter-formation","reusable"],
    price:12, asin:"0723292086", afflink:"https://www.amazon.com.au/dp/0723292086/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71FZXYfkYvL._SY522_.jpg",
    note:"Wipe clean, so they can do the same letter twenty times without going through a whole pad.",
    search:"wipe clean writing practice book kids preschool"
  },
  {
    id:"p48", name:"Spring-Loaded Learning Scissors", age_min:30, age_max:60,
    dev_areas:["fine"], tags:["scissors","hand-strength"],
    price:12, asin:"B0GXVZQMHL", afflink:"https://www.amazon.com.au/dp/B0GXVZQMHL/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71lTxcPEVAL._AC_SX679_.jpg",
    note:"Spring-loaded, so the scissors open themselves and the child only has to squeeze. A good first pair.",
    search:"spring loaded learning scissors kids safety"
  },
  {
    id:"p49", name:"Hungry Hungry Hippos Game", age_min:48, age_max:96,
    dev_areas:["gross","social","cognitive"], tags:["turn-taking","hand-eye","board-game"],
    price:25, asin:"B0C3DNT9W3", afflink:"https://www.amazon.com.au/dp/B0C3DNT9W3/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81T5qNcaVlL._AC_SX679_.jpg",
    note:"Fast, loud, and over before anyone loses interest. A good first board game.",
    search:"Hungry Hungry Hippos Game preschool"
  },
  {
    id:"p50", name:"My First Snakes and Ladders", age_min:36, age_max:60,
    dev_areas:["social","cognitive"], tags:["turn-taking","counting","board-game"],
    price:18, asin:"B0BSXQDGT9", afflink:"https://www.amazon.com.au/dp/B0BSXQDGT9/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81dAB6kwwGL._AC_SX679_.jpg",
    note:"A solid first board game. Counting, waiting your turn, and not winning, which is the hard part.",
    search:"My First Snakes and Ladders board game toddler"
  },
  {
    id:"p51", name:"Connect 4 Strategy Game", age_min:72, age_max:120,
    dev_areas:["cognitive","social"], tags:["strategy","turn-taking","problem-solving","board-game"],
    price:25, asin:"B00D8STBHY", afflink:"https://www.amazon.com.au/dp/B00D8STBHY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81pFBKk4P-L._AC_SX679_.jpg",
    note:"Strategic thinking and planning. Good for kids who are ready for something with more challenge and strategy.",
    search:"Connect 4 Classic Strategy Board Game"
  },
  {
    id:"p52", name:"Spot It! Classic Card Game (Moose)", age_min:60, age_max:144,
    dev_areas:["cognitive","social"], tags:["visual-perception","turn-taking","board-game","memory"],
    price:22, asin:"B077YGQ492", afflink:"https://www.amazon.com.au/dp/B077YGQ492/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81DVfh0rFvL._AC_SX679_.jpg",
    note:"Spot the match before anyone else. Works for mixed ages, and for five minutes or an hour.",
    search:"Moose Spot It Classic Card Game"
  },
  {
    id:"p53", name:"Story Cubes", age_min:48, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["storytelling","vocabulary","creativity"],
    price:18, asin:"B08T5PDYWV", afflink:"https://www.amazon.com.au/dp/B08T5PDYWV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71V9THjd0tL._AC_SY879_.jpg",
    note:"Roll the dice, see what you get, make up the rest. One for kids who already love a story.",
    search:"Story Cubes storytelling dice game kids"
  },
  {
    id:"p54", name:"Conversation Starter Cards for Kids", age_min:48, age_max:144,
    dev_areas:["language","social"], tags:["conversation","emotional-literacy","family"],
    price:15, asin:"B0891Y35LR", afflink:"https://www.amazon.com.au/dp/B0891Y35LR/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91sI5snt84L._AC_SX679_.jpg",
    note:"Prompts that lead to real conversations. Good for kids who need some scaffolding to open up.",
    search:"conversation starter cards kids family"
  },
  {
    id:"p55", name:"M SANMERSEN Piano Mat (Musical Floor Mat)", age_min:24, age_max:96,
    dev_areas:["gross","sensory","language","cognitive"], tags:["music","movement","sensory","cause-effect"],
    price:39, asin:"B07PPMQJBW", afflink:"https://www.amazon.com.au/dp/B07PPMQJBW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71H0J+lsC-L._AC_SX679_.jpg",
    note:"Step on it and it plays. One for kids who want to be moving and making noise at the same time.",
    search:"M SANMERSEN Piano Mat musical floor mat kids"
  },
  {
    id:"p56", name:"Yoto Mini Screen-Free Audio Player", age_min:36, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["audio","screen-free","independence"],
    price:129, asin:"B0D541M5C6", afflink:"https://www.amazon.com.au/dp/B0D541M5C6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61oKXuf3HML._AC_SX679_.jpg",
    note:"Screen-free audio player kids can control themselves. Stories, music, sleep sounds. Families love these.",
    search:"Yoto Mini 2024 screen-free audio player kids"
  },
  {
    id:"p58", fam:"ball-run", name:"Fat Brain Air Toobz Ball Tube Set", age_min:36, age_max:96,
    dev_areas:["cognitive","fine","gross"], tags:["constructive","cause-effect","problem-solving","STEM"],
    price:179, asin:"B0C21LRH2K", afflink:"https://www.amazon.com.au/dp/B0C21LRH2K/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71xosN2CvgL._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Build the tube system, drop a ball in, watch where it comes out. Then change it and try again.",
    search:"Fat Brain Air Toobz Ball Tube Physics Toy"
  },
  {
    id:"p59", name:"Origami Craft Kit for Kids", age_min:48, age_max:96,
    dev_areas:["fine","cognitive"], tags:["craft","focus","problem-solving"],
    price:15, asin:"080484707X", afflink:"https://www.amazon.com.au/dp/080484707X/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91ECrvwZ6eL._SY522_.jpg",
    note:"Origami asks for careful fingers and following one step at a time. Quiet work, and they end up with something to keep.",
    search:"origami craft kit kids beginner"
  },
  {
    id:"p60", name:"Diamond Painting Kit for Kids (Gem Art Keychains)", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["craft","focus","mindfulness","art"],
    price:20, asin:"B0CGZSNVMM", afflink:"https://www.amazon.com.au/dp/B0CGZSNVMM/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81-Ln-ywhrL._AC_SX679_.jpg",
    note:"Quiet, absorbing, and the results actually look good. One for kids who like a craft with a point to it.",
    search:"Diamond Painting Kits Kids Gem Art Keychains"
  },
  {
    id:"p61", name:"Inspireyes Walkie Talkies for Kids (3 Pack Rechargeable)", age_min:48, age_max:120,
    dev_areas:["language","social","cognitive"], tags:["outdoor","communication","teamwork"],
    price:60, asin:"B09QW9Z6FX", afflink:"https://www.amazon.com.au/dp/B09QW9Z6FX/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71FyC-sNn-L._AC_SX679_.jpg",
    note:"Outdoor play, secret missions, teamwork. Kids who love adventure and imaginative play get so much out of these.",
    search:"Inspireyes Walkie Talkies Kids Rechargeable 3 Pack"
  },
  {
    id:"p62", name:"KRAFUN Beginner Sewing Kit for Kids 5+", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["craft","focus","hand-eye","art"],
    price:30, asin:"B091GXM2Y6", afflink:"https://www.amazon.com.au/dp/B091GXM2Y6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91nStU0iH2L._AC_SX679_.jpg",
    note:"Real sewing on felt: a pillow, a bag, a keyring. They finish with something they made and will show everyone.",
    search:"KRAFUN Beginner Sewing Kit Kids 6 Projects"
  },
  {
    id:"p63", name:"Twister Party Game (Ages 6+)", age_min:72, age_max:144,
    dev_areas:["gross","social"], tags:["balance","coordination","turn-taking","movement","board-game"],
    price:25, asin:"B0723923ZP", afflink:"https://www.amazon.com.au/dp/B0723923ZP/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51pLykE9KVL._AC_SX679_.jpg",
    note:"Daft instructions, a lot of flailing about, and loads of laughs. Works for mixed ages.",
    search:"Twister Party Game Hasbro Air Moves"
  },
  {
    id:"p64", name:"Hasbro Bop It Extreme", age_min:96, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["hand-eye","reaction-time","listening","board-game"],
    price:40, asin:"B09JDMZ8X4", afflink:"https://www.amazon.com.au/dp/B09JDMZ8X4/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71n6Ctm70mL._AC_SX679_.jpg",
    note:"Fast, loud, and fun. Everyone grabs for the same thing at the same time.",
    search:"Hasbro Bop It Extreme game"
  },
  {
    id:"p65", name:"Mouse Trap Board Game (Ages 6+)", age_min:72, age_max:120,
    dev_areas:["cognitive","social"], tags:["cause-effect","turn-taking","board-game","problem-solving"],
    price:30, asin:"B09NB1DPTC", afflink:"https://www.amazon.com.au/dp/B09NB1DPTC/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81UqarfDnGL._AC_SX679_.jpg",
    note:"The chain reaction mechanism is brilliant for cause-and-effect thinking. A good upgrade from simpler board games.",
    search:"Hasbro Mouse Trap Board Game kids"
  },
  {
    id:"p66", name:"Game of Life Board Game (Ages 8+)", age_min:96, age_max:144,
    dev_areas:["cognitive","social","language"], tags:["strategy","turn-taking","board-game","social"],
    price:35, asin:"B08BHHRSPK", afflink:"https://www.amazon.com.au/dp/B08BHHRSPK/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81A0K5YsuxL._AC_SX679_.jpg",
    note:"Deciding what to buy, handling the money, waiting your turn. A classic for a reason.",
    search:"Game of Life Board Game Hasbro family"
  },
  {
    id:"p67", name:"Makedo Discover Cardboard Construction Tool Kit", age_min:60, age_max:144,
    dev_areas:["fine","cognitive"], tags:["constructive","creative","problem-solving","STEM"],
    price:77, asin:"B08X4ZX456", afflink:"https://www.amazon.com.au/dp/B08X4ZX456/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81BxX5mw2yL._AC_SX679_.jpg",
    note:"Safe tools for turning cardboard boxes into whatever they want. Creative, sustainable, and genuinely engaging.",
    search:"Makedo Discover Cardboard Construction Tool Kit STEM"
  },
  {
    id:"p68", name:"Rechargeable Laser Tag Set (Ages 8+)", age_min:96, age_max:144,
    dev_areas:["gross","social","cognitive"], tags:["outdoor","teamwork","movement","strategy"],
    price:175, asin:"B09RS5C3LR", afflink:"https://www.amazon.com.au/dp/B09RS5C3LR/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71yxaBvKrAL._AC_SX679_.jpg",
    note:"Active, outdoor, strategic play for older kids. Great for groups and getting kids off screens.",
    search:"rechargeable laser tag set kids outdoor gun vest sensors"
  },
  {
    id:"p69", name:"Skillmatics Poke-In Art Craft Kit", age_min:48, age_max:120,
    dev_areas:["fine","cognitive"], tags:["craft","focus","art","fine-motor"],
    price:35, asin:"B0CZP42TND", afflink:"https://www.amazon.com.au/dp/B0CZP42TND/?tag=brittanyot0c-22",
    img:null,
    note:"Poke the pieces in one at a time until the picture appears. Slow, absorbing work, and it looks lovely finished.",
    search:"Skillmatics Poke-In Art Magical Princesses craft kit"
  },
  {
    id:"p70", name:"JOYIN Big Bubble Wands Set (18 pcs)", age_min:36, age_max:120,
    dev_areas:["gross","sensory","social"], tags:["outdoor","sensory","movement","breath-control"],
    price:30, asin:"B089KVTJPP", afflink:"https://www.amazon.com.au/dp/B089KVTJPP/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81TyfJ1QGGL._AC_SX679_.jpg",
    note:"Blowing them, chasing them, popping them. Bubbles never get old and this set is good value.",
    search:"JOYIN Big Bubble Wands Set Giant Bubble Maker"
  },
  {
    id:"p71", fam:"magnetic-tiles", name:"Magnetic Blocks Building Set (150 pcs)", age_min:36, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["magnetic-tiles","constructive","open-ended","blocks-tiles"],
    price:45, asin:"B0B2QQL3MW", afflink:"https://www.amazon.com.au/dp/B0B2QQL3MW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71vWgpHjwsL._AC_SX679_.jpg",
    note:"150 pieces is enough for proper big builds. Open-ended, so it never really gets finished.",
    search:"magnetic blocks building tiles 150 pcs kids STEM"
  },
  {
    id:"p72", name:"Sand Pal Beach Building Kit (9 pieces)", age_min:36, age_max:120,
    dev_areas:["fine","cognitive","sensory"], tags:["outdoor","constructive","sensory","water"],
    price:59, asin:"B07RSNQ7GJ", afflink:"https://www.amazon.com.au/dp/B07RSNQ7GJ/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81ZlY7iq6cL._AC_SX679_.jpg",
    note:"Create brick-like structures at the beach. Creative, sensory-rich, and unlike anything else in a toy box.",
    search:"Sand Pal Beach Toys Kids Building Molds"
  },
  {
    id:"p73", name:"Powza 3-in-1 Musical Jump, Ring Toss & Rocket Launcher", age_min:48, age_max:96,
    dev_areas:["gross","social","cognitive"], tags:["outdoor","movement","hand-eye","cause-effect"],
    price:45, asin:"B0CTG1HXKN", afflink:"https://www.amazon.com.au/dp/B0CTG1HXKN/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61bpnyDQGHL._AC_SX679_.jpg",
    note:"Three outdoor games in one: ring toss, stomp rocket, and jump. Good for active kids who need variety.",
    search:"Powza 3 in 1 Musical Jump Ring Toss Rocket Launcher kids outdoor"
  },

  // ── SENSORY & HEAVY WORK ────────────────────────────────────────────────────
  {
    id:"p74", name:"Monkey Noodles Sensory Stretch Toy", age_min:36, age_max:144,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fidget","hand-strength","stretchy"],
    price:18, asin:"B0GTZDXF8N", afflink:"https://www.amazon.com.au/dp/B0GTZDXF8N/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71DWMNfsDpL._AC_SX679_.jpg",
    note:"Stretch them, wrap them, link them together. Great for kids who need tactile input and something to do with their hands.",
    search:"monkey noodles sensory stretch toy kids fidget"
  },
  {
    id:"p75", name:"Infinity Cube Fidget Toy", age_min:60, age_max:144,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fidget","focus","fine-motor"],
    price:12, asin:"B0DJGTW126", afflink:"https://www.amazon.com.au/dp/B0DJGTW126/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51vhMUakHmL._AC_SX679_.jpg",
    note:"Quiet, portable, and genuinely satisfying to flip. Good for kids who need something to do with their hands during focused tasks.",
    search:"infinity cube fidget toy kids metal"
  },
  {
    id:"p76", name:"Scooter Board", age_min:36, age_max:120,
    dev_areas:["gross","sensory"], tags:["vestibular","proprioceptive","movement","sensory","heavy-work","sports"],
    price:45, asin:"B008AK6WMC", afflink:"https://www.amazon.com.au/dp/B008AK6WMC/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61SYSbIv+ZL._SX522_.jpg",
    note:"Lie on your tummy and pull yourself along with your hands. Kids go hard at it.",
    search:"scooter board kids sensory OT therapy roller"
  },
  {
    id:"p77", name:"Body Sock / Sensory Compression Suit", age_min:36, age_max:96,
    dev_areas:["sensory","gross"], tags:["proprioceptive","deep-pressure","sensory","vestibular","sports"],
    price:35, asin:"B0CQX932VD", afflink:"https://www.amazon.com.au/dp/B0CQX932VD/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51GH5idognL._AC_SX679_.jpg",
    note:"A stretchy tunnel to push and squash against. Kids who like a tight squeeze tend to get straight in it.",
    search:"body sock sensory compression suit kids proprioceptive"
  },
  {
    id:"p78", name:"Lycra Sensory Swing", age_min:24, age_max:96,
    dev_areas:["sensory","gross"], tags:["vestibular","proprioceptive","sensory","deep-pressure","swing","sports"],
    price:65, asin:"B0829WS6MW", afflink:"https://www.amazon.com.au/dp/B0829WS6MW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71xeJs9UJ-L._AC_SX679_.jpg",
    note:"A hammock swing that wraps around while it moves. One for kids who like swinging and being squashed. Hangs from a doorframe or beam.",
    search:"lycra sensory swing kids therapy indoor cocoon"
  },
  {
    id:"p79", fam:"crash-pad", name:"Crash Mat / Sensory Crash Pad", age_min:24, age_max:96,
    dev_areas:["sensory","gross"], tags:["proprioceptive","heavy-work","sensory","movement","vestibular","sports"],
    price:189, asin:"B0GQDCZ8Z5", afflink:"https://www.amazon.com.au/dp/B0GQDCZ8Z5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61-tk0popiL._AC_SX679_.jpg",
    note:"Jump into it, roll on it, crash into it. Kids who like a heavy landing love these. Pairs well with a lycra swing.",
    search:"crash mat sensory crash pad kids therapy bean bag"
  },
  {
    id:"p80", name:"Yoga Ball / Exercise Ball (Kids Size)", age_min:36, age_max:144,
    dev_areas:["gross","sensory"], tags:["proprioceptive","vestibular","balance","heavy-work","sensory","sports"],
    price:25, asin:"B01M25TPKV", afflink:"https://www.amazon.com.au/dp/B01M25TPKV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91zwDDnfb5L._AC_SX679_.jpg",
    note:"Sit on it, roll over it, bounce on it, flop on it. Gets used more ways than you'd expect.",
    search:"kids yoga exercise balance ball 45cm children sensory"
  },
  {
    id:"p81", name:"Peanut Ball (Peanut-Shaped Exercise Ball)", age_min:12, age_max:72,
    dev_areas:["gross","sensory"], tags:["proprioceptive","vestibular","tummy-time","heavy-work","balance","sports"],
    price:30, asin:"B01N7KH666", afflink:"https://www.amazon.com.au/dp/B01N7KH666/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61E75yvmspL._AC_SX679_.jpg",
    note:"The peanut shape stops it rolling away on you. Good for tummy time with babies, and toddlers like being rolled around on it.",
    search:"peanut ball therapy roller kids sensory tummy time"
  },
  {
    id:"p82", name:"Soft Play Foam Cubes / Climbing Blocks Set", age_min:12, age_max:60,
    dev_areas:["gross","sensory","cognitive"], tags:["climbing","movement","proprioceptive","constructive","soft-play"],
    price:120, asin:"B0CL8Y8M9K", afflink:"https://www.amazon.com.au/dp/B0CL8Y8M9K/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51IGIDA4IzL._AC_SX679_.jpg",
    note:"Stack them, climb them, crash into them, build obstacle courses. Soft play cubes are endlessly versatile for active indoor play.",
    search:"soft play foam blocks cubes kids indoor climbing set"
  },
  {
    id:"p83", name:"Play Couch / Foam Modular Couch", age_min:12, age_max:96,
    dev_areas:["gross","sensory","cognitive","social"], tags:["climbing","movement","constructive","open-ended","soft-play"],
    price:139, asin:"B0FV12V5W7", afflink:"https://www.amazon.com.au/dp/B0FV12V5W7/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71DGRdjP4cL._AC_SX679_.jpg",
    note:"Cubbies, ramps, boats, obstacle courses. Kids build their own adventures. Families rave about these and they genuinely get used for years.",
    search:"play couch kids foam modular nugget couch"
  },
  {
    id:"p84", name:"Spinning Sensory Chair / Swivel Chair", age_min:36, age_max:144,
    dev_areas:["sensory"], tags:["vestibular","sensory","self-regulation","focus"],
    price:55, asin:"B0G3TV75KV", afflink:"https://www.amazon.com.au/dp/B0G3TV75KV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51ZnCGayDtL._AC_SX679_.jpg",
    note:"Some kids will spin all day given the chance. This gives them somewhere to do it that isn't the office chair.",
    search:"spinning sensory chair kids swivel wobble vestibular"
  },

  // ── OUTDOOR & ACTIVE PLAY ────────────────────────────────────────────────────
  {
    id:"p85", name:"Kids Bowling Set (Indoor/Outdoor)", age_min:24, age_max:72,
    dev_areas:["gross","cognitive","social"], tags:["outdoor","hand-eye","turn-taking","movement","sports"],
    price:20, asin:"B00AU0O7OU", afflink:"https://www.amazon.com.au/dp/B00AU0O7OU/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/712DRbBOwzL._AC_SX679_.jpg",
    note:"Aiming, rolling, and counting the pins back up. Barely needs any space.",
    search:"kids bowling set indoor outdoor toddler"
  },
  {
    id:"p86", name:"Boxing Tumbler Punching Toy (Bop Bag)", age_min:36, age_max:96,
    dev_areas:["gross","sensory"], tags:["proprioceptive","heavy-work","movement","sensory","outdoor"],
    price:35, asin:"B0GKPJFYTD", afflink:"https://www.amazon.com.au/dp/B0GKPJFYTD/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71tRq4UMWmL._AC_SX679_.jpg",
    note:"Hitting and pushing are legitimate heavy work activities. A bop bag channels that need safely and kids genuinely love it.",
    search:"kids boxing tumbler bop bag punching toy inflatable"
  },
  {
    id:"p87", name:"Kids Boxing Bag (Standing)", age_min:48, age_max:120,
    dev_areas:["gross","sensory"], tags:["proprioceptive","heavy-work","movement","sensory"],
    price:60, asin:"B0BVVRMFD6", afflink:"https://www.amazon.com.au/dp/B0BVVRMFD6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/619LeVBTdAL._AC_SX679_.jpg",
    note:"Heavy, squashy, and made to be crashed into. One for kids with a lot of energy to get rid of.",
    search:"kids standing boxing bag punching bag freestanding"
  },
  {
    id:"p88", name:"Quick Sticks / Reaction Sticks Game", age_min:60, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["hand-eye","reaction-time","outdoor","turn-taking","movement","sports"],
    price:22, asin:"B0GJL2ZSF8", afflink:"https://www.amazon.com.au/dp/B0GJL2ZSF8/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61isSZ2xosL._AC_SX679_.jpg",
    note:"Drop the stick, catch it before it hits the floor. Quick, competitive, and it works inside.",
    search:"quick sticks reaction sticks game kids catch reflex"
  },
  {
    id:"p89", name:"Eezy Peezy Swing Car Ride-On", age_min:18, age_max:60,
    dev_areas:["gross","sensory"], tags:["vestibular","coordination","movement","outdoor","bilateral","sports"],
    price:45, asin:"B0DZ64KXM7", afflink:"https://www.amazon.com.au/dp/B0DZ64KXM7/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61ezTckD5GL._AC_SX679_.jpg",
    note:"Twist the wheel side to side and it goes. No pedals, no pushing. Kids are obsessed with these.",
    search:"eezy peezy twist ride on swing car toddler"
  },
  {
    id:"p90", name:"Roller Coaster Ride-On", age_min:36, age_max:72,
    dev_areas:["gross","sensory"], tags:["vestibular","movement","outdoor","sensory","sports"],
    price:139, asin:"B0GWR1V48F", afflink:"https://www.amazon.com.au/dp/B0GWR1V48F/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61G8nv8BOwL._AC_SX679_.jpg",
    note:"Up and over, again and again. One for the kids who never want to get off.",
    search:"kids roller coaster ride on outdoor toddler"
  },
  {
    id:"p91", name:"Kids Climbing Frame with Slide", age_min:24, age_max:84,
    dev_areas:["gross","sensory"], tags:["climbing","outdoor","strength","movement","vestibular"],
    price:299, asin:"B0CGQY9DCH", afflink:"https://www.amazon.com.au/dp/B0CGQY9DCH/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61qgyqtxSXL._AC_SX679_.jpg",
    note:"Climbing, sliding, hanging upside down. If you have the outdoor space, a climbing frame is one of the best things you'll buy.",
    search:"kids climbing frame slide outdoor backyard"
  },
  {
    id:"p92", name:"Wheelbarrow / Kids Garden Wheelbarrow", age_min:24, age_max:60,
    dev_areas:["gross","sensory","cognitive"], tags:["heavy-work","outdoor","proprioceptive","life-skills"],
    price:25, asin:"B088PQZGX5", afflink:"https://www.amazon.com.au/dp/B088PQZGX5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71l6fRyi7AL._AC_SX679_.jpg",
    note:"Loading it up and pushing it is proper hard work. One for kids who want a real job in the garden.",
    search:"kids wheelbarrow garden toy outdoor play"
  },
  {
    id:"p93", name:"Trio Rocker / Three-Way Rocker", age_min:12, age_max:60,
    dev_areas:["gross","sensory","social"], tags:["vestibular","movement","balance","sensory","turn-taking","sports"],
    price:79, asin:"B0GTLQPDBY", afflink:"https://www.amazon.com.au/dp/B0GTLQPDBY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51Y6k83ImHL._AC_SX679_.jpg",
    note:"Rock on your own or with someone facing you. Two kids have to find the same rhythm, which is half the entertainment.",
    search:"trio rocker kids balance board vestibular three way"
  },
  {
    id:"p94", name:"Play Tunnel (Pop-Up Crawl Tunnel)", age_min:12, age_max:72,
    dev_areas:["gross","sensory","cognitive"], tags:["crawling","movement","proprioceptive","vestibular","outdoor"],
    price:30, asin:"B0CBNZDSR5", afflink:"https://www.amazon.com.au/dp/B0CBNZDSR5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71G0twryyoL._AC_SX679_.jpg",
    note:"Crawling through a tunnel is its own reward. Folds flat and goes in the boot.",
    search:"kids pop up play tunnel crawl tunnel toddler outdoor"
  },
  {
    id:"p95", name:"Swivel See Saw", age_min:36, age_max:84,
    dev_areas:["gross","sensory","social"], tags:["vestibular","balance","outdoor","turn-taking","social","sports"],
    price:89, asin:"B07BKVSB27", afflink:"https://www.amazon.com.au/dp/B07BKVSB27/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51zJGDUmRQL._AC_SX679_.jpg",
    note:"More going on than a standard see saw, because it swivels as well as rocks. Takes two to work it.",
    search:"swivel see saw kids outdoor balance rocker"
  },
  {
    id:"p96", name:"Frisbee", age_min:60, age_max:144,
    dev_areas:["gross","social"], tags:["outdoor","hand-eye","coordination","movement","sports"],
    price:10, asin:"B0813DBQ36", afflink:"https://www.amazon.com.au/dp/B0813DBQ36/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71g3xfUfNRL._AC_SX679_.jpg",
    note:"Throwing and catching a frisbee is harder than it looks. Expect a lot of chasing at first.",
    search:"frisbee kids outdoor play"
  },
  {
    id:"p97", name:"Pool Noodles (Pack of 6)", age_min:24, age_max:144,
    dev_areas:["gross","sensory","social","cognitive"], tags:["outdoor","movement","open-ended","sensory","heavy-work"],
    price:18, asin:"B0CPYBXSYW", afflink:"https://www.amazon.com.au/dp/B0CPYBXSYW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61szepOTO-L._AC_SX679_.jpg",
    note:"One of the most versatile cheap toys going. Lightsaber battles, tug of war, tow a scooter board, build forts, balance beams. Endless.",
    search:"pool noodles bulk pack 6 kids play"
  },
  {
    id:"p98", name:"Outdoor Sidewalk Chalk (Jumbo Pack)", age_min:36, age_max:96,
    dev_areas:["fine","gross","cognitive","social"], tags:["outdoor","drawing","creative","movement","pre-writing"],
    price:12, asin:"B00AHAJGXK", afflink:"https://www.amazon.com.au/dp/B00AHAJGXK/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61mhqNvT+dL._AC_SX679_.jpg",
    note:"Draw courses, trace bodies, play hopscotch, write letters. Chalk is one of those things that buys hours of outdoor creative play.",
    search:"jumbo sidewalk chalk kids outdoor washable pack"
  },
  {
    id:"p99", name:"Basket Plush Baby Dolls Multicultural Sensory Set (6 Piece)", age_min:12, age_max:36,
    dev_areas:["social","language","sensory","cognitive"], tags:["dolls","pretend-play","nurturing","plush","emotions","social"],
    price:69, asin:null, afflink:"https://link.amazon/B09VYhCqZ", img:"https://m.media-amazon.com/images/I/71PxArzE0IL._AC_SL1254_.jpg",
    note:"Six soft, huggable babies with different skin tones, in a basket ready for play. Beautiful for nurturing play, early language, and seeing the whole world reflected back in their toys.",
    search:"multicultural plush baby dolls sensory set basket"
  },
  {
    id:"p100", name:"Step-On Rocket Launcher", age_min:36, age_max:96,
    dev_areas:["gross","cognitive","sensory"], tags:["outdoor","jumping","cause-effect","movement","proprioceptive","sports"],
    price:22, asin:"B0006O8Q7Y", afflink:"https://www.amazon.com.au/dp/B0006O8Q7Y/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71mli4BTVvL._AC_SX679_.jpg",
    note:"Stomp on the pad and the rocket flies. Running, jumping, chasing, and the cause-and-effect element keeps kids coming back.",
    search:"step on rocket launcher kids stomp outdoor foam"
  },

  // ── FROM MILESTONES GUIDE 6m-6yrs ──────────────────────────────────────────
  {
    id:"p101", name:"Bee Crawl Toy with Music & Lights", age_min:4, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["crawling","movement","cause-effect","music"],
    price:22, asin:"B07PBCC6VC", afflink:"https://www.amazon.com.au/dp/B07PBCC6VC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81NpQsDvlAL._AC_SX679_.jpg",
    note:"Zigzags across the floor so babies have to follow it with their eyes, then go after it.",
    search:"bee crawl toy baby music lights crawling"
  },
  {
    id:"p102", fam:"instrument-set", name:"Lehoo Castle Kids Musical Instruments Set", age_min:12, age_max:60,
    dev_areas:["sensory","language","fine","social"], tags:["music","rhythm","cause-effect","instruments"],
    price:28, asin:null, afflink:"https://link.amazon/B0f1MuLS1", img:"https://m.media-amazon.com/images/I/718lR46PMYL._AC_SL1500_.jpg",
    note:"Shakers, tambourine, bells. Real instruments small hands can actually play, and loud enough to be satisfying.",
    search:"Lehoo Castle kids musical instruments set toddler"
  },
  {
    id:"p103", name:"Lamaze Fun with Colours Soft Book", age_min:0, age_max:12,
    dev_areas:["sensory","language","cognitive"], tags:["visual","sensory","books","tummy-time"],
    price:18, asin:"B07Q7D7FHJ", afflink:"https://www.amazon.com.au/dp/B07Q7D7FHJ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/812dJ6H3quL._AC_SX679_.jpg",
    note:"Soft pages, crinkle sounds, bright colours. A great early book for sensory exploration and early language.",
    search:"Lamaze Fun with Colours soft baby book sensory"
  },
  {
    id:"p104", name:"Crinkle Soft Book / Sensory Crinkle Toy", age_min:0, age_max:12,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","grasping","visual","tummy-time"],
    price:15, asin:"B0DSLP842G", afflink:"https://www.amazon.com.au/dp/B0DSLP842G/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61SvQjDtjSL._AC_SX679_.jpg",
    note:"Crinkle sounds, bright colours, soft textures. Babies are fascinated by these from the very early weeks.",
    search:"crinkle soft book baby sensory toy"
  },
  {
    id:"p105", name:"O Ball Rattle", age_min:0, age_max:12,
    dev_areas:["fine","sensory","gross"], tags:["grasping","sensory","cause-effect"],
    price:12, asin:"B0CTJGXHTQ", afflink:"https://www.amazon.com.au/dp/B0CTJGXHTQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/8169Y+0WpOL._AC_SX679_.jpg",
    note:"The open lattice design makes it genuinely easy for tiny hands to grab. One of the best first grasping toys.",
    search:"O Ball rattle baby toy grasping"
  },
  {
    id:"p106", name:"Wrist Rattles & Foot Finders Set", age_min:0, age_max:6,
    dev_areas:["sensory","gross","cognitive"], tags:["sensory","visual","body-awareness","tummy-time"],
    price:12, asin:"B0D8KK52KD", afflink:"https://www.amazon.com.au/dp/B0D8KK52KD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71WbRa7jzZL._AC_SX679_.jpg",
    note:"Wrist and ankle rattles. Babies move, hear a noise, and slowly work out it was them.",
    search:"wrist rattles foot finders baby set sensory"
  },
  {
    id:"p107", name:"Handheld Baby Rattle", age_min:0, age_max:6,
    dev_areas:["fine","sensory","cognitive"], tags:["grasping","cause-effect","sensory"],
    price:10, asin:"B0772WYFPP", afflink:"https://www.amazon.com.au/dp/B0772WYFPP/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81OcKm1MXQL._AC_SX679_.jpg",
    note:"Shake it and it makes a sound. One of the first cause-and-effect experiences a baby has. Simple and important.",
    search:"baby handheld rattle newborn toy grasping"
  },
  {
    id:"p108", name:"Plush Tissue Box Pull Toy", age_min:4, age_max:12,
    dev_areas:["fine","cognitive","sensory"], tags:["cause-effect","grasping","reaching","sensory"],
    price:15, asin:"B0B28WBW5Y", afflink:"https://www.amazon.com.au/dp/B0B28WBW5Y/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/812KDU7jWzL._AC_SX679_.jpg",
    note:"Pull the scarves out one by one. Brilliant for reaching, grasping, and the early understanding that things still exist when hidden.",
    search:"baby plush tissue box pull toy scarves sensory"
  },
  {
    id:"p109", name:"Lamaze My Friend Range (Interactive Plush)", age_min:0, age_max:12,
    dev_areas:["social","sensory","language"], tags:["sensory","social","faces","language","plush"],
    price:25, asin:"B000I2Q0FO", afflink:"https://www.amazon.com.au/dp/B000I2Q0FO/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/618sATXIZHL._AC_SX679_.jpg",
    note:"Faces, textures and sounds. Babies stare at faces more than anything else, and this is full of them.",
    search:"Lamaze My Friend interactive plush baby toy faces"
  },
  {
    id:"p110", name:"Talking Toy Mattel Puppy", age_min:9, age_max:18,
    dev_areas:["language","social","cognitive"], tags:["language","cause-effect","animals","music"],
    price:28, asin:"B0D9MWMXSX", afflink:"https://www.amazon.com.au/dp/B0D9MWMXSX/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71B4yVQEJZL._AC_SY879_.jpg",
    note:"Press the paws and ears for songs and phrases. Babies press the same one about forty times.",
    search:"Mattel talking puppy baby toy words songs"
  },
  {
    id:"p111", name:"Tickle Me Elmo", age_min:9, age_max:24,
    dev_areas:["social","language","cognitive"], tags:["language","social","cause-effect","music"],
    price:35, asin:"B089VYVBB9", afflink:"https://www.amazon.com.au/dp/B089VYVBB9/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/619vCYzaaUL._AC_SX679_.jpg",
    note:"Squeeze him and he giggles and moves. The reaction is totally irresistible for babies and toddlers. Brilliant for cause-and-effect at this age.",
    search:"Tickle Me Elmo baby toddler toy"
  },
  {
    id:"p112", name:"Barn Toy with Animals", age_min:12, age_max:36,
    dev_areas:["cognitive","language","social"], tags:["pretend-play","animals","cause-effect","language"],
    price:28, asin:"B0FFGQSKQN", afflink:"https://www.amazon.com.au/dp/B0FFGQSKQN/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81wKyFHYqJL._AC_SX679_.jpg",
    note:"Open the barn and the animals pop out or drop through. Expect a lot of animal noises.",
    search:"wooden barn toy animals toddler farm playset"
  },
  {
    id:"p113", name:"DIY Busy Board / Sensory Board", age_min:12, age_max:36,
    dev_areas:["fine","cognitive","sensory"], tags:["fine-motor","problem-solving","sensory","cause-effect","selfcare"],
    price:35, asin:"B0DZNWQPLD", afflink:"https://www.amazon.com.au/dp/B0DZNWQPLD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/815dLiPGZDL._AC_SX679_.jpg",
    note:"Zippers, buckles, buttons, latches and locks, all on one board. Every fastening they'll meet on real clothes.",
    search:"busy board toddler sensory montessori fine motor latches"
  },
  {
    id:"p114", name:"Musical Dancing Duck Toy (walking ducks)", age_min:4, age_max:12,
    dev_areas:["gross","sensory","language"], tags:["crawling","movement","music","cause-effect"],
    price:55, asin:"B0DWWTGBJ1", afflink:"https://www.amazon.com.au/dp/B0DWWTGBJ1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61vNy2ayBfL._AC_SX679_.jpg",
    note:"They walk in a line, hold hands and sing. Babies tend to set off after them.",
    search:"musical walking dancing duck toy baby crawling"
  },
  // ── FROM 2 YEAR OLD GUIDE ──────────────────────────────────────────────────
  {
    id:"p115", name:"Ride-On Trike / Balance Bike with Pedals", age_min:24, age_max:48,
    dev_areas:["gross"], tags:["balance","coordination","outdoor","movement","bilateral","vehicles"],
    price:55, asin:"B0FPLQCZYM", afflink:"https://www.amazon.com.au/dp/B0FPLQCZYM/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61ARxP8lIxL._AC_SX679_.jpg",
    note:"The step between a balance bike and a proper bike. Pedalling and steering at the same time takes a while.",
    search:"toddler trike ride on balance bike pedals 2 year old"
  },
  {
    id:"p116", name:"Large Outdoor Play Ball", age_min:12, age_max:60,
    dev_areas:["gross","social"], tags:["outdoor","movement","hand-eye","bilateral","throwing","sports"],
    price:12, asin:"B0FWBBQ7KW", afflink:"https://www.amazon.com.au/dp/B0FWBBQ7KW/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71k5uVk+0CL._AC_SX679_.jpg",
    note:"Rolling, kicking, throwing, chasing. A big ball earns its space more than most things.",
    search:"large outdoor play ball toddler kids"
  },
  {
    id:"p117", name:"Pretend Microphone Toy", age_min:24, age_max:60,
    dev_areas:["language","social","cognitive"], tags:["language","music","pretend-play","creative"],
    price:15, asin:"B08PYS8C3T", afflink:"https://www.amazon.com.au/dp/B08PYS8C3T/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81wWXPiLB5L._AC_SX679_.jpg",
    note:"Singing, storytelling, putting on a show for whoever is in the room. Loud, in a good way.",
    search:"pretend microphone toy toddler kids singing"
  },
  {
    id:"p118", name:"Flash Card Reader / Interactive Learning System", age_min:24, age_max:60,
    dev_areas:["language","cognitive"], tags:["language","letters","numbers","cause-effect"],
    price:35, asin:"B0C1YLTG64", afflink:"https://www.amazon.com.au/dp/B0C1YLTG64/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71l6HQcQZML._AC_SX679_.jpg",
    note:"Slide in a card and it reads out the word, sound or letter. They can use it without an adult sitting there.",
    search:"flash card reader kids interactive learning toy words letters"
  },
  {
    id:"p119", name:"Doll Pram & Nursery Accessories Set", age_min:18, age_max:60,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","nurturing","role-play","social","emotions","dolls"],
    price:45, asin:"B0GVHL148L", afflink:"https://www.amazon.com.au/dp/B0GVHL148L/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81-y8Ffg+eL._AC_SX679_.jpg",
    note:"Pram, bed, feeding bits. Opens up all the looking-after play, which some kids will do for hours.",
    search:"doll pram nursery set accessories toddler pretend play"
  },
  {
    id:"p120", name:"Learning Tower (Kitchen Helper)", age_min:18, age_max:60,
    dev_areas:["selfcare","gross","cognitive"], tags:["independence","selfcare","life-skills"],
    price:112, asin:"B0DDPCSKKW", afflink:"https://www.amazon.com.au/dp/B0DDPCSKKW/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61cCr2P-1bL._AC_SL1500_.jpg",
    note:"Brings them safely up to bench height so they can join in cooking, washing up and everyday life. Being part of the action alongside you is rich, hands-on learning.",
    search:"kids step stool toddler bathroom independence"
  },
  {
    id:"p121", name:"Open Cup for Toddlers", age_min:12, age_max:36,
    dev_areas:["selfcare","fine"], tags:["drinking","independence","selfcare"],
    price:8, asin:"B0DBKDZRN1", afflink:"https://www.amazon.com.au/dp/B0DBKDZRN1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/719QmnbIfVL._AC_SX679_.jpg",
    note:"For moving off a sippy cup. Small and heavy-based works best, because it doesn't tip the second they let go.",
    search:"open cup toddler kids drinking small heavy base"
  },
  {
    id:"p122", name:"Potty / Toddler Toilet Seat", age_min:18, age_max:48,
    dev_areas:["selfcare"], tags:["selfcare","independence","life-skills"],
    price:25, asin:"B0CC5TTDNM", afflink:"https://www.amazon.com.au/dp/B0CC5TTDNM/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61qMfnvKinL._AC_SX679_.jpg",
    note:"A toddler-sized toilet seat or potty makes the bathroom less intimidating. An important tool when toilet training begins.",
    search:"toddler toilet seat potty training kids"
  },
  {
    id:"p123", name:"Toddler Sized Cutlery Set", age_min:12, age_max:36,
    dev_areas:["selfcare","fine"], tags:["feeding","independence","selfcare"],
    price:12, asin:"B0CPJLZB4T", afflink:"https://www.amazon.com.au/dp/B0CPJLZB4T/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/611g6pjlcqL._AC_SX679_.jpg",
    note:"Cutlery actually sized for small hands. An adult fork is a big ask at that age.",
    search:"toddler cutlery set fork spoon kids sized"
  },
  {
    id:"p124", name:"Toys with Clothing / Dressing Doll", age_min:24, age_max:60,
    dev_areas:["fine","selfcare","social"], tags:["selfcare","fine-motor","pretend-play","independence","buttons","dolls"],
    price:22, asin:"B07JZ5ZBFC", afflink:"https://www.amazon.com.au/dp/B07JZ5ZBFC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51hCK-AgIUL._AC_SX679_.jpg",
    note:"Zippers, buttons and velcro on a doll, so they can have a go without anyone rushing them out the door.",
    search:"dressing doll toy buttons zippers velcro toddler fine motor"
  },
  // ── FROM 3 YEAR OLD GUIDE ─────────────────────────────────────────────────
  {
    id:"p125", fam:"magnetic-tiles", name:"Connetix Magnetic Tiles (Rainbow Starter Pack)", age_min:36, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["magnetic-tiles","constructive","open-ended","blocks-tiles","STEM"],
    price:119, asin:"B0CLLPJ8TK", afflink:"https://www.amazon.com.au/dp/B0CLLPJ8TK/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61WUM-54HfL._AC_SX679_.jpg",
    note:"The premium magnetic tile set. Translucent colours, premium quality, and endlessly open-ended. Worth the investment.",
    search:"Connetix magnetic tiles rainbow starter pack"
  },
  {
    id:"p126", name:"Vehicle and Tool Set", age_min:24, age_max:60,
    dev_areas:["fine","cognitive","social"], tags:["vehicles","tool-use","pretend-play","constructive"],
    price:30, asin:"B0CXMR9FQ3", afflink:"https://www.amazon.com.au/dp/B0CXMR9FQ3/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71o1FNTElQL._AC_SX679_.jpg",
    note:"Trucks, tools, and the ability to fix and build things. Combines vehicle play with tool use in a really natural way.",
    search:"vehicle tool set kids toddler construction play"
  },
  // ── FROM 4 YEAR OLD GUIDE ─────────────────────────────────────────────────
  {
    id:"p127", name:"Agility Ladder for Kids", age_min:36, age_max:96,
    dev_areas:["gross"], tags:["coordination","bilateral","outdoor","movement","balance","sports"],
    price:20, asin:"B0C5JRD4QD", afflink:"https://www.amazon.com.au/dp/B0C5JRD4QD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61zNnh5RAuL._AC_SX679_.jpg",
    note:"Lay them out and step through the rungs, then change the pattern. Works inside on a rainy day.",
    search:"agility ladder kids exercise coordination outdoor"
  },
  {
    id:"p128", name:"Jungle Gym Climbing Dome", age_min:36, age_max:96,
    dev_areas:["gross","sensory"], tags:["climbing","outdoor","strength","movement","proprioceptive","vestibular","sports"],
    price:120, asin:"B0CGQY9DCH", afflink:"https://www.amazon.com.au/dp/B0CGQY9DCH/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61qgyqtxSXL._AC_SX679_.jpg",
    note:"More options than a standard frame: reach the top, hang upside down, set challenges. Great for confident movers.",
    search:"kids jungle gym climbing dome outdoor backyard"
  },
  {
    id:"p129", name:"Movement Foam Dice", age_min:24, age_max:72,
    dev_areas:["gross","cognitive","social"], tags:["movement","outdoor","balance","coordination","turn-taking","animals"],
    price:22, asin:"B096SKTL77", afflink:"https://www.amazon.com.au/dp/B096SKTL77/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71n5en7LA3L._AC_SX679_.jpg",
    note:"Roll the dice and do the movement: jump, hop, balance. Adds unpredictability to physical play and is great for obstacle courses.",
    search:"movement foam dice kids action gross motor play"
  },
  {
    id:"p130", name:"Balance Scale Toy (Maths Scale)", age_min:36, age_max:72,
    dev_areas:["cognitive","language","fine"], tags:["problem-solving","sorting","numbers","cause-effect"],
    price:25, asin:"B085SMGQQH", afflink:"https://www.amazon.com.au/dp/B085SMGQQH/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71o+2-jiTCL._AC_SX679_.jpg",
    note:"Which side is heavier? Add things, take things off, get it level. Then start again.",
    search:"balance scale toy kids learning maths heavy light"
  },
  {
    id:"p131", name:"Anatomy Body Puzzle", age_min:36, age_max:72,
    dev_areas:["cognitive","language"], tags:["puzzle","problem-solving","body-awareness","language"],
    price:28, asin:"B0FJBFVTNK", afflink:"https://www.amazon.com.au/dp/B0FJBFVTNK/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Px15OhhCL._AC_SX679_.jpg",
    note:"Skin, muscles, bones, organs, layer by layer. Introduces the human body in a hands-on, memorable way.",
    search:"anatomy body puzzle kids layers organs bones"
  },
  {
    id:"p132", name:"Glowing Marble Run", age_min:48, age_max:96,
    dev_areas:["cognitive","fine","sensory"], tags:["constructive","problem-solving","cause-effect","visual-tracking"],
    price:45, asin:"B07JL8QGLR", afflink:"https://www.amazon.com.au/dp/B07JL8QGLR/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81f0rpm6ZzL._AC_SX679_.jpg",
    note:"Build the track, drop the marble, change the track when it doesn't work. That loop is the whole appeal.",
    search:"glowing marble run kids building toy glow dark"
  },
  {
    id:"p133", name:"Dress Up Costume Set (Princess / Doctor / Police / Chef / Pirate)", age_min:36, age_max:72,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","role-play","empathy","social","creative"],
    price:25, asin:"B0B3RBXMMX", afflink:"https://www.amazon.com.au/dp/B0B3RBXMMX/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71gp7CHfbHL._AC_SX679_.jpg",
    note:"Dress up and be someone else for a while. Always a hit, and the costumes get worn to the shops.",
    search:"kids dress up costume set princess doctor police pirate"
  },
  {
    id:"p134", name:"Fruit Stand Avalanche Balance Game", age_min:36, age_max:72,
    dev_areas:["fine","social","cognitive"], tags:["balance","fine-motor","turn-taking","hand-eye","board-game"],
    price:28, asin:"B0035EQDT0", afflink:"https://www.amazon.com.au/dp/B0035EQDT0/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61QN1CufBYL._AC_SX679_.jpg",
    note:"Stack the fruit on the wobbly stand without bringing the lot down. One I keep in my work bag.",
    search:"fruit stand avalanche balance game kids stacking"
  },
  {
    id:"p135", name:"Hopscotch Mat (Foam or Fabric)", age_min:24, age_max:72,
    dev_areas:["gross","cognitive"], tags:["balance","coordination","bilateral","movement","counting"],
    price:20, asin:"B07Q313KVG", afflink:"https://www.amazon.com.au/dp/B07Q313KVG/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61v4yxyeNVL._AC_SX679_.jpg",
    note:"Hopping, counting squares, calling out colours. Works indoors, and you can make the rules harder as they grow.",
    search:"hopscotch mat kids foam fabric indoor outdoor"
  },
  {
    id:"p136", name:"Balance Beam Set (Curved Indoor Balance)", age_min:24, age_max:72,
    dev_areas:["gross","sensory","cognitive"], tags:["balance","coordination","vestibular","movement","outdoor"],
    price:55, asin:"B0FSV7BFZ5", afflink:"https://www.amazon.com.au/dp/B0FSV7BFZ5/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81tJ2PzatNL._AC_SX679_.jpg",
    note:"Walk the beam without touching the floor. The curved pieces flip over and work as rockers too.",
    search:"kids balance beam set curved indoor outdoor play"
  },
  {
    id:"p137", name:"Magnetic Letter Set (Fridge Magnets)", age_min:24, age_max:60,
    dev_areas:["language","cognitive","fine"], tags:["letters","language","sorting","fine-motor"],
    price:18, asin:"B07KK5Y92W", afflink:"https://www.amazon.com.au/dp/B07KK5Y92W/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/714OXG3R42L._AC_SX679_.jpg",
    note:"A fridge classic. Finding the letters in their own name is usually where it starts.",
    search:"magnetic letter set fridge magnets kids alphabet"
  },
  {
    id:"p138", name:"Storytelling Dot Point Cards", age_min:48, age_max:96,
    dev_areas:["language","cognitive","social"], tags:["storytelling","vocabulary","creative","language"],
    price:15, asin:"B0CJHCM3B7", afflink:"https://www.amazon.com.au/dp/B0CJHCM3B7/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61zciXAJ0TL._AC_SX679_.jpg",
    note:"Prompts to make a story around. Enough structure to get going, loose enough to go anywhere.",
    search:"storytelling dot point cards kids narrative prompts"
  },
  {
    id:"p139", name:"Dominos (Classic Set)", age_min:60, age_max:144,
    dev_areas:["cognitive","social","fine"], tags:["counting","turn-taking","problem-solving","board-game","fine-motor"],
    price:18, asin:"B0D6RZ1PHQ", afflink:"https://www.amazon.com.au/dp/B0D6RZ1PHQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/614LxsAQYgL._AC_SX679_.jpg",
    note:"Matching, counting, taking turns, and the very satisfying chain reaction when you line them up and knock them down.",
    search:"dominos classic set kids game counting"
  },
  {
    id:"p140", name:"Problem-Solving Balance Game (e.g. Penguin Trap / Stacking)", age_min:48, age_max:96,
    dev_areas:["cognitive","fine","social"], tags:["balance","problem-solving","fine-motor","turn-taking","board-game"],
    price:22, asin:"B0GCW6G6R9", afflink:"https://www.amazon.com.au/dp/B0GCW6G6R9/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61CSiW5eyzL._AC_SX679_.jpg",
    note:"Stack the pieces without bringing it down. The waiting-your-turn tension is the best part.",
    search:"kids problem solving balance stacking game penguin"
  },
  {
    id:"p141", name:"Learn to Tie Shoelaces Board / Book", age_min:48, age_max:84,
    dev_areas:["fine","selfcare","cognitive"], tags:["fine-motor","selfcare","independence","hand-eye"],
    price:15, asin:"B0BM9F2B32", afflink:"https://www.amazon.com.au/dp/B0BM9F2B32/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61XFvDBdUgL._AC_SY695_.jpg",
    note:"A lacing board means they can have a go at it when nobody is waiting by the door.",
    search:"learn tie shoelaces board kids practice lacing"
  },
  // ── FROM GIFTING GUIDE 0-12 ────────────────────────────────────────────────
  {
    id:"p142", name:"Musical Walking Duck Toy (Line of Ducks)", age_min:4, age_max:12,
    dev_areas:["gross","sensory","language"], tags:["crawling","movement","music","cause-effect"],
    price:55, asin:"B0DWWTGBJ1", afflink:"https://www.amazon.com.au/dp/B0DWWTGBJ1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61vNy2ayBfL._AC_SX679_.jpg",
    note:"They walk in a line, hold hands and sing. Babies will often take off after them.",
    search:"musical walking duck toy baby line ducks singing crawling"
  },
  {
    id:"p143", name:"Ride-On Horse Toy", age_min:24, age_max:48,
    dev_areas:["gross","sensory","social"], tags:["vestibular","balance","pretend-play","movement"],
    price:39, asin:"B0B1MYQBJZ", afflink:"https://www.amazon.com.au/dp/B0B1MYQBJZ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61Ycy5kBC3L._AC_SX679_.jpg",
    note:"Bounce, rock and gallop. Kids look after their horse, feed it and take it places.",
    search:"ride on horse toy kids toddler bounce rocking"
  },
  {
    id:"p144", name:"Traffic Light Toy (Road Safety)", age_min:24, age_max:60,
    dev_areas:["cognitive","language","gross"], tags:["cause-effect","language","movement","road-safety"],
    price:35, asin:"B000OZ0A24", afflink:"https://www.amazon.com.au/dp/B000OZ0A24/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61TOu3lbmRL._AC_SY879_.jpg",
    note:"Stop and go concepts in a play-based, safe environment. I love this for kids working on traffic safety goals. Really natural way to learn it.",
    search:"traffic light toy kids road safety stop go play"
  },
  {
    id:"p145", name:"The Very Hungry Caterpillar Book & Soft Toy Set", age_min:0, age_max:36,
    dev_areas:["language","cognitive","social"], tags:["books","language","animals","storytelling"],
    price:15, asin:"0723297851", afflink:"https://www.amazon.com.au/dp/0723297851/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81dJ4JbecjL._SX679_.jpg",
    note:"A timeless classic with a matching soft toy. Using the toy to act out the book makes reading interactive and engaging. A beautiful gift.",
    search:"Very Hungry Caterpillar book soft toy set Eric Carle"
  },
  {
    id:"p146", name:"Bananas in Pyjamas Talking Plush", age_min:12, age_max:36,
    dev_areas:["language","social","cognitive"], tags:["language","social","cause-effect","pretend-play","plush"],
    price:28, asin:"B07H8YXV1L", afflink:"https://www.amazon.com.au/dp/B07H8YXV1L/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51OQosG1piL._AC_SX679_.jpg",
    note:"A very Australian classic. Press the tummy and hear B1 and B2. Brilliant for early language, familiar characters, and cause-and-effect play.",
    search:"Bananas in Pyjamas talking plush toy B1 B2"
  },
  {
    id:"p147", name:"Treasure Chest Discovery Toy", age_min:24, age_max:72,
    dev_areas:["fine","cognitive","language"], tags:["fine-motor","problem-solving","cause-effect","numbers","colours"],
    price:44, asin:"B0CTK2YQXY", afflink:"https://www.amazon.com.au/dp/B0CTK2YQXY/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81d14HaFFqL._AC_SX679_.jpg",
    note:"Open the chest with the right number or colour sequence. Getting it open is the whole point, and there's something inside.",
    search:"treasure chest toy kids mystery unlock numbers colours"
  },
  {
    id:"p148", name:"Busy Book (Perth-Made Activity Book)", age_min:36, age_max:72,
    dev_areas:["cognitive","fine","language","social"], tags:["fine-motor","pretend-play","sorting","numbers","letters"],
    price:90, asin:"B0DZNWQPLD", afflink:"https://www.amazon.com.au/dp/B0DZNWQPLD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/815dLiPGZDL._AC_SX679_.jpg",
    note:"A Perth-made all-in-one activity book. Colours, numbers, early maths, even a map of Australia. Local, and genuinely well made.",
    search:"Busy Book kids activity learning pretend play Australia"
  },
  {
    id:"p149", name:"Nest Swing / Platform Swing", age_min:36, age_max:144,
    dev_areas:["sensory","gross","social"], tags:["vestibular","swing","outdoor","sensory","social","sports"],
    price:219, asin:"B082T3RJ2J", afflink:"https://www.amazon.com.au/dp/B082T3RJ2J/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81iLT87ekAL._AC_SX679_.jpg",
    note:"Big enough for two or three kids to swing at once. A backyard favourite.",
    search:"nest swing platform swing kids outdoor backyard"
  },
  {
    id:"p150", name:"Kinetic Sand (Sensory Moulding Sand)", age_min:36, age_max:120,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fine-motor","creative","tactile","sand","messy"],
    price:22, asin:"B0BRQXVSD4", afflink:"https://www.amazon.com.au/dp/B0BRQXVSD4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81hBNp5LczL._AC_SX679_.jpg",
    note:"Moulds like wet sand but stays dry and doesn't go everywhere. One for kids who like their hands in something.",
    search:"kinetic sand kids sensory moulding sand set"
  },
  {
    id:"p151", name:"Water Magic Art Mat / Water Drawing Mat", age_min:12, age_max:48,
    dev_areas:["fine","cognitive","sensory"], tags:["drawing","mark-making","sensory","pre-writing"],
    price:15, asin:"B07MYTFN7Z", afflink:"https://www.amazon.com.au/dp/B07MYTFN7Z/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/819o0s3753L._AC_SX679_.jpg",
    note:"Paint with water and watch it disappear. Mess-free, reusable, and great for early mark making and pre-writing exploration.",
    search:"water magic art mat kids drawing paint water"
  },
  {
    id:"p152", name:"Human Body Puzzle (Layered Anatomy)", age_min:36, age_max:72,
    dev_areas:["cognitive","language"], tags:["puzzle","body-awareness","language","problem-solving"],
    price:28, asin:"B09VJTKPHJ", afflink:"https://www.amazon.com.au/dp/B09VJTKPHJ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71+tywIKKiL._AC_SY879_.jpg",
    note:"Layer by layer: skin, muscles, skeleton, organs. They can take it apart and put it back, which is why it sticks.",
    search:"human body puzzle layered anatomy kids learning"
  },
  {
    id:"p153", name:"Truck and Construction Tool Play Set", age_min:24, age_max:60,
    dev_areas:["fine","cognitive","social"], tags:["vehicles","tool-use","pretend-play","constructive"],
    price:30, asin:"B0F6MZ6X3H", afflink:"https://www.amazon.com.au/dp/B0F6MZ6X3H/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71rnLi7zcBL._AC_SX679_.jpg",
    note:"Trucks to drive and tools to build with. Combines two interests kids often have together: vehicles and building.",
    search:"truck construction tool set kids play toys toddler"
  },
  {
    id:"p154", fam:"magnetic-tiles", name:"Magnetic Castle Tiles", age_min:36, age_max:84,
    dev_areas:["fine","cognitive"], tags:["magnetic-tiles","constructive","blocks-tiles","creative"],
    price:45, asin:"B0CL7QV63C", afflink:"https://www.amazon.com.au/dp/B0CL7QV63C/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81ugjSvS3FL._AC_SX679_.jpg",
    note:"Magnetic tiles with castle and brick designs. Build worlds, castles, and structures with an imaginative twist.",
    search:"magnetic castle tiles kids building constructive play"
  },
  {
    id:"p155", name:"Puppet Theatre (Cardboard or Fabric)", age_min:36, age_max:84,
    dev_areas:["language","social","cognitive"], tags:["pretend-play","storytelling","creative","language"],
    price:35, asin:"B0DNML6FZ4", afflink:"https://www.amazon.com.au/dp/B0DNML6FZ4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71u2KlNCfsL._AC_SX679_.jpg",
    note:"A stage for shows and made-up stories. The puppet does the talking, which suits some kids.",
    search:"kids puppet theatre fabric foldable children plays"
  },
  {
    id:"p156", fam:"ball-run", name:"Connetix Ball Run Expansion Pack", age_min:48, age_max:120,
    dev_areas:["cognitive","fine","sensory"], tags:["constructive","cause-effect","problem-solving","magnetic-tiles","blocks-tiles","STEM"],
    price:85, asin:"B0BLCPYDL5", afflink:"https://www.amazon.com.au/dp/B0BLCPYDL5/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61FHULJNkLL._AC_SX679_.jpg",
    note:"Add tubes and funnels to magnetic tiles and run the balls through. Redesigning it when the ball gets stuck is half the fun.",
    search:"Connetix ball run expansion pack magnetic tiles"
  },
  {
    id:"p157", name:"Pop Tubes Sensory Fidget Set", age_min:36, age_max:144,
    dev_areas:["sensory","fine"], tags:["sensory","fidget","fine-motor","tactile","stretchy"],
    price:12, asin:"B0C6YPDYT2", afflink:"https://www.amazon.com.au/dp/B0C6YPDYT2/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/91uZ8KlpIbL._AC_SX679_.jpg",
    note:"Stretch, connect, pop, and pull apart. Tactile input on the go. Great for kids who need something to do with their hands.",
    search:"pop tubes sensory fidget set kids tactile"
  },
  {
    id:"p158", fam:"putty", name:"Resistive Hand Putty Set", age_min:48, age_max:144,
    dev_areas:["fine","sensory"], tags:["hand-strength","sensory","fine-motor","tactile","fidget"],
    price:18, asin:"B07YF9X67Z", afflink:"https://www.amazon.com.au/dp/B07YF9X67Z/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/719lR4Gm+-L._AC_SX679_.jpg",
    note:"Comes in different resistances. Squeeze it, stretch it, hide little objects inside and dig them out again.",
    search:"therapy putty kids resistive hand strengthening sensory"
  },
  {
    id:"p159", name:"Sensory Bin Kit (Scoops, Funnels, Tweezers)", age_min:18, age_max:60,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fine-motor","tactile","pouring","sorting"],
    price:20, asin:"B0GZ2JRJHZ", afflink:"https://www.amazon.com.au/dp/B0GZ2JRJHZ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81bSi8nYMkL._AC_SX679_.jpg",
    note:"Fill a bin with rice, dried pasta or kinetic sand and add these. Scooping, pouring, tweezering things out.",
    search:"sensory bin kit tools scoops funnels tweezers kids"
  },
  {
    id:"p160", name:"Liquid Motion Calm Down Timer / Sensory Bottle", age_min:12, age_max:144,
    dev_areas:["sensory","cognitive","social"], tags:["sensory","self-regulation","visual","calm-down"],
    price:15, asin:"B0C5CWKLNL", afflink:"https://www.amazon.com.au/dp/B0C5CWKLNL/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81-hXXrQphL._AC_SX679_.jpg",
    note:"Flip it and watch the liquid crawl down. Hard to look away from, which is the point.",
    search:"liquid motion timer calm down sensory bottle kids visual"
  },
  {
    id:"p161", name:"Textured Sensory Balls Set", age_min:0, age_max:60,
    dev_areas:["sensory","fine","gross"], tags:["sensory","tactile","grasping","fine-motor"],
    price:18, asin:"B09H7LSD22", afflink:"https://www.amazon.com.au/dp/B09H7LSD22/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51K3Y-sXPfL._AC_SX679_.jpg",
    note:"Different textures, sizes, and resistances. Great for tactile exploration at any age, from babies grasping to older kids squeezing for input.",
    search:"textured sensory balls set kids tactile variety"
  },
  // ── FROM 5-6 YEAR GUIDE / GIFTING GUIDE 5-10 ─────────────────────────────
  {
    id:"p162", name:"Noodle Knock Out Game", age_min:48, age_max:120,
    dev_areas:["gross","social","cognitive"], tags:["outdoor","movement","turn-taking","hand-eye","social","sports"],
    price:22, asin:"B0F4KYG3BC", afflink:"https://www.amazon.com.au/dp/B0F4KYG3BC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/31TYpvfcJBL._AC_SX679_.jpg",
    note:"Knock the pool noodles off their stands with a ball. Active, silly, and easy to set up in a backyard.",
    search:"noodle knock out game kids outdoor active"
  },
  {
    id:"p163", name:"Excavation Kit (Dino or Gem)", age_min:60, age_max:120,
    dev_areas:["cognitive","fine"], tags:["dinosaurs","science","STEM","problem-solving","fine-motor"],
    price:22, asin:"B0GGRD2PYY", afflink:"https://www.amazon.com.au/dp/B0GGRD2PYY/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71hrjbTRzZL._AC_SX679_.jpg",
    note:"Chip away until the fossil or gem appears. Slow going, which is the appeal. One for dino fans.",
    search:"excavation kit kids dinosaur fossil gem dig"
  },
  {
    id:"p164", name:"Dry Erase Whiteboard with Markers", age_min:36, age_max:84,
    dev_areas:["fine","language","cognitive"], tags:["drawing","pre-writing","letter-formation","reusable"],
    price:20, asin:"B0753PD2CP", afflink:"https://www.amazon.com.au/dp/B0753PD2CP/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61AxvXcJrIL._AC_SX679_.jpg",
    note:"A whiteboard means unlimited practice for drawing, writing, and mark making without going through paper. Great for letter formation.",
    search:"dry erase whiteboard kids markers learning drawing"
  },
  {
    id:"p165", name:"Early Years Printable Activity Book (Brittany Kidera)", age_min:36, age_max:60,
    dev_areas:["fine","cognitive","language"], tags:["pre-writing","letters","numbers","fine-motor","reusable"],
    price:15, asin:null, img:null,
    note:"Designed by me, a paediatric OT, as play-based activities for the early years. Laminate the pages and reuse them.",
    search:"Early Years Activity Book Kidera Brittany OT printable"
  },
  {
    id:"p166", name:"Mess-Free Painting Set", age_min:36, age_max:60,
    dev_areas:["fine","sensory","cognitive"], tags:["drawing","art","sensory","creative","mark-making"],
    price:18, asin:"B084Y3DLFJ", afflink:"https://www.amazon.com.au/dp/B084Y3DLFJ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81q13+KL29L._AC_SX679_.jpg",
    note:"Painting without the mess. Water on the page, colour appears, dries, do it again.",
    search:"mess free painting set kids toddler no mess art"
  },
  {
    id:"p167", name:"Bingo Dot Markers (Daubers)", age_min:24, age_max:60,
    dev_areas:["fine","cognitive"], tags:["drawing","fine-motor","grip","pre-writing","colours"],
    price:15, asin:"B086XBXH34", afflink:"https://www.amazon.com.au/dp/B086XBXH34/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71vi6YRNlbL._AC_SX679_.jpg",
    note:"Big satisfying dots, and no fiddly lids. A good first set of markers.",
    search:"bingo dot markers daubers kids art toddler"
  },
  {
    id:"p168", name:"Marvel Avengers Action Figure Set", age_min:60, age_max:120,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","role-play","storytelling","social"],
    price:48, asin:"B0DNFR5VFK", afflink:"https://www.amazon.com.au/dp/B0DNFR5VFK/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71Ysb6GKu9L._AC_SX679_.jpg",
    note:"Character figures for open-ended pretend play. Superhero stories, good vs bad, rescue missions. Rich imaginative play that kids come back to again and again.",
    search:"Marvel Avengers action figure set kids Iron Man"
  },
  {
    id:"p169", name:"Bike with Training Wheels (16 inch)", age_min:48, age_max:84,
    dev_areas:["gross"], tags:["balance","coordination","outdoor","movement","bilateral","vehicles"],
    price:120, asin:"B0DMV6BCW3", afflink:"https://www.amazon.com.au/dp/B0DMV6BCW3/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71a-iKUhcfL._AC_SX679_.jpg",
    note:"Pedalling and steering at the same time takes a few goes. A classic, and they last.",
    search:"kids bike training wheels 16 inch pedal bicycle"
  },
  {
    id:"p170", name:"Melty Bead Set (Hama / Perler Beads)", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["fine-motor","focus","patterns","art","hand-eye"],
    price:22, asin:"B08M8YWJPT", afflink:"https://www.amazon.com.au/dp/B08M8YWJPT/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/816S1ti3FoS._AC_SX679_.jpg",
    note:"Place tiny beads on a pegboard then iron to fuse. Precision, patience, pattern making, and pincer grip. Excellent for older kids who like detailed craft.",
    search:"melty beads hama perler bead set kids craft"
  },
  {
    id:"p171", name:"Tying Shoelaces Practice Frame / Board Book", age_min:48, age_max:84,
    dev_areas:["fine","selfcare","cognitive"], tags:["selfcare","fine-motor","independence","bilateral","hand-eye"],
    price:15, asin:"0812065530", afflink:"https://www.amazon.com.au/dp/0812065530/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71qD+Lz9x-L._SY522_.jpg",
    note:"Practice the steps of lacing without the rush of getting out the door. A dedicated frame or book makes this achievable.",
    search:"learn to tie shoelaces frame board book kids practice"
  },
  {
    id:"p172", name:"Basket and Soft Toy Throwing Game", age_min:24, age_max:72,
    dev_areas:["gross","cognitive","social"], tags:["throwing","hand-eye","turn-taking","outdoor","movement","sports"],
    price:18, asin:"B0D8BRH5TC", afflink:"https://www.amazon.com.au/dp/B0D8BRH5TC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Jqn6EAB2L._AC_SX679_.jpg",
    note:"Throw soft toys or balls into the basket, then move further back. Easy to make harder.",
    search:"basket throwing game soft toys kids indoor outdoor"
  },
  {
    id:"p173", name:"Keezi Water Table with Umbrella (26pcs)", age_min:24, age_max:72,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","water","outdoor","pouring","sorting"],
    price:79, asin:"B0778F2NKQ", afflink:"https://www.amazon.com.au/dp/B0778F2NKQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51esJP5lDXL._AC_SX679_.jpg",
    note:"Waterwheel, boats, buckets and a slide in one. Outdoor water play that buys you an afternoon.",
    search:"Keezi Water Table Umbrella sandpit toys kids outdoor"
  },
  {
    id:"p174", name:"Duckie Goes On An Adventure High Contrast Bath Book", age_min:0, age_max:12,
    dev_areas:["sensory","language","cognitive"], tags:["visual","tummy-time","water","books","sensory"],
    price:20, asin:"0646879340", afflink:"https://www.amazon.com.au/dp/0646879340/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71kBKnub47L._SY522_.jpg",
    note:"High contrast black and white, and it goes in the bath. Babies lock onto the pages.",
    search:"Duckie Goes On An Adventure High Contrast Bath Book baby"
  },

  // ── GAP-FILL EXPANSION (from Brittany's worksheet) ──────────────────────────
  {
    id:"p175", name:"Animal Barn Playset", age_min:12, age_max:36,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","cause-effect","language"],
    price:32.99, asin:null, afflink:"https://link.amazon/B0fNJdiYr", img:"https://m.media-amazon.com/images/I/81Wy6HIjoTL._AC_SL1500_.jpg",
    note:"Open the doors, pop the animals in and out, make the sounds. Simple, and it gets played with daily for a good while.",
    search:"Animal Barn Playset kids"
  },
  {
    id:"p176", name:"Wild Animal Figurines Set", age_min:36, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["animals","pretend-play","small-world","language"], fam:"animal-figures",
    price:16.5, asin:null, afflink:"https://link.amazon/B0fVx9mcW", img:"https://m.media-amazon.com/images/I/81rAoT7X8uL._AC_SL1500_.jpg",
    note:"A tub of wild animals goes further than almost any toy. Sorting, naming, habitats, storytelling, small world play. It grows with them for years.",
    search:"Wild Animal Figurines Set kids"
  },
  {
    id:"p177", name:"24 Pack Mini Animal Plush Set", age_min:36, age_max:120,
    dev_areas:["social","language","cognitive"], tags:["animals","plush","pretend-play","storytelling"],
    price:31.99, asin:null, afflink:"https://link.amazon/B05NlgB8R", img:"https://m.media-amazon.com/images/I/9186RDRJomL._AC_SL1500_.jpg",
    note:"A whole zoo of little soft friends. Brilliant for sorting, counting, hiding games and endless storylines.",
    search:"24 Pack Mini Animal Plush Set kids"
  },
  {
    id:"p178", name:"Skillmatics Guess in 10: Animal Kingdom", age_min:36, age_max:72,
    dev_areas:["language","cognitive","social"], tags:["animals","turn-taking","vocabulary","board-game","questions"], fam:"guess-in-10",
    price:15.29, asin:null, afflink:"https://link.amazon/B0hIlequT", img:"https://m.media-amazon.com/images/I/81zJwhaGlIL._AC_SX679_.jpg",
    note:"Ask ten questions and guess the animal. Kids have to think about what to ask, which is the fun of it.",
    search:"Skillmatics Guess in 10: Animal Kingdom kids"
  },
  {
    id:"p179", name:"LEGO Creator 3-in-1 Cute Animals", age_min:96, age_max:120,
    dev_areas:["fine","cognitive"], tags:["animals","constructive","blocks-tiles","problem-solving"], fam:"lego",
    price:31.49, asin:null, afflink:"https://link.amazon/B0flNdA3S", img:"https://m.media-amazon.com/images/I/81nXrJT7jkL._AC_SX679_.jpg",
    note:"Three different animals from one box. They can pull it apart and build the next one.",
    search:"LEGO Creator 3-in-1 Cute Animals kids"
  },
  {
    id:"p180", name:"Toddler Learning Farm Train Set", age_min:12, age_max:36,
    dev_areas:["cognitive","language","fine"], tags:["animals","cause-effect","sorting","trains"],fam:"train-set",
    price:45.99, asin:null, afflink:"https://link.amazon/B0iqnQX7s", img:"https://m.media-amazon.com/images/I/81kVIPnqrDL._AC_SX679_.jpg",
    note:"Animals, sorting and a train all in one. Lots of cause and effect and early language for little farm fans.",
    search:"Toddler Learning Farm Train Set kids"
  },
  {
    id:"p181", name:"Weighted Dragon Plush", age_min:60, age_max:120,
    dev_areas:["sensory","social"], tags:["deep-pressure","plush","animals","self-regulation","calm-down"],
    price:57.94, asin:null, afflink:"https://link.amazon/B0dCMfh64", img:"https://m.media-amazon.com/images/I/51VD8R5RN4L._AC_SX679_.jpg",
    note:"A weighted plush that sits across the lap or shoulders. Heavy, soft, and it looks like an ordinary toy.",
    search:"Weighted Dragon Plush kids"
  },
  {
    id:"p182", name:"Spot It! Animals Card Game", age_min:48, age_max:72,
    dev_areas:["cognitive","social"], tags:["animals","visual","reaction-time","card-game","turn-taking"],
    price:17.95, asin:null, afflink:"https://link.amazon/B02X5JKJZ", img:"https://m.media-amazon.com/images/I/71lMRod-nIL._AC_SX679_.jpg",
    note:"Find the matching animal before anyone else does. Fast, funny, and over quickly.",
    search:"Spot It! Animals Card Game kids"
  },
  {
    id:"p183", name:"Skillmatics Guess in 10: Animal Planet", age_min:72, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["animals","turn-taking","vocabulary","board-game","questions"], fam:"guess-in-10",
    price:17.99, asin:null, afflink:"https://link.amazon/B00cLKjbI", img:"https://m.media-amazon.com/images/I/81i169CgFhL._AC_SL1500_.jpg",
    note:"The step-up version for school age animal lovers. Question asking, deduction and animal facts in one quick game.",
    search:"Skillmatics Guess in 10: Animal Planet kids"
  },
  {
    id:"p184", name:"Skillmatics Guess in 10: Underwater Animals", age_min:96, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["animals","turn-taking","vocabulary","board-game","questions"], fam:"guess-in-10",
    price:19.99, asin:null, afflink:"https://link.amazon/B0c9Q85km", img:"https://m.media-amazon.com/images/I/81nNa7qaMnL._AC_SL1500_.jpg",
    note:"Ocean edition for older kids who know their hammerheads from their humpbacks. Deduction and language dressed up as a game.",
    search:"Skillmatics Guess in 10: Underwater Animals kids"
  },
  {
    id:"p185", name:"Farm Animal Memory Cards", age_min:36, age_max:72,
    dev_areas:["cognitive","social"], tags:["animals","memory","turn-taking","card-game"], fam:"memory-cards",
    price:9.29, asin:null, afflink:"https://link.amazon/B05Xda5t4", img:"https://m.media-amazon.com/images/I/7180poFdu1L._SL1500_.jpg",
    note:"A classic memory game with friendly farm faces. One of the few games where kids genuinely beat the grown-ups.",
    search:"Farm Animal Memory Cards kids"
  },
  {
    id:"p186", name:"I Spy Animals Book", age_min:24, age_max:48,
    dev_areas:["language","cognitive"], tags:["animals","books","visual","language"], fam:"i-spy-book",
    price:20.21, asin:null, afflink:"https://link.amazon/B0dbjwbzv", img:"https://m.media-amazon.com/images/I/61PYd0Em4LL._SL1000_.jpg",
    note:"Search the page, find the animal, name it together. Good for a long car trip.",
    search:"I Spy Animals Book kids"
  },
  {
    id:"p187", name:"Melissa & Doug Magnetic Fishing Game", age_min:36, age_max:60,
    dev_areas:["fine","cognitive"], tags:["animals","fine-motor","hand-eye","patience"], fam:"fishing-game",
    price:16.37, asin:null, afflink:"https://link.amazon/B0aq1iy3i", img:"https://m.media-amazon.com/images/I/817blwa0MZL._AC_SX679_.jpg",
    note:"Steady hands and patience to hook each fish. Quiet, and they ask to do it again.",
    search:"Melissa & Doug Magnetic Fishing Game kids"
  },
  {
    id:"p188", name:"I Spy Ocean Animals Book", age_min:36, age_max:96,
    dev_areas:["language","cognitive"], tags:["animals","books","visual","language"], fam:"i-spy-book",
    price:19.21, asin:null, afflink:"https://link.amazon/B07qHSBLV", img:"https://m.media-amazon.com/images/I/71cycnoRvdL._SL1000_.jpg",
    note:"An under the sea seek and find. Quiet, slow, and they'll go back to the same page twice.",
    search:"I Spy Ocean Animals Book kids"
  },
  {
    id:"p189", name:"Skillmatics Search & Find: Animals at Play", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["animals","visual","reusable","focus","mark-making"],
    price:19.99, asin:null, afflink:"https://link.amazon/B00oHlB50", img:"https://m.media-amazon.com/images/I/81nEi3D6b0L._AC_SL1500_.jpg",
    note:"Wipe clean search and find boards you can use over and over. Good for a cafe or a waiting room.",
    search:"Skillmatics Search & Find: Animals at Play kids"
  },
  {
    id:"p190", name:"Learning Resources Ocean Emotions Seashells", age_min:18, age_max:72,
    dev_areas:["social","language"], tags:["emotions","animals","social","language"],
    price:72.87, asin:null, afflink:"https://link.amazon/B01nGqvBG", img:"https://m.media-amazon.com/images/I/71AZmaVLNrL._AC_SL1400_.jpg",
    note:"Each little shell friend shows a different feeling. A gentle, hands-on way to name emotions, which is the first step to managing them.",
    search:"Learning Resources Ocean Emotions Seashells kids"
  },
  {
    id:"p191", name:"Baby Einstein Ocean Explorers Bath Pals", age_min:3, age_max:48,
    dev_areas:["sensory","cognitive"], tags:["water","animals","sensory","bath","cause-effect"],
    price:22.55, asin:null, afflink:"https://link.amazon/B0fe2SAeq", img:"https://m.media-amazon.com/images/I/71e21inAv+L._AC_SL1500_.jpg",
    note:"Pouring, squeezing and splashing while they're already in the bath. Makes getting in easier on the nights they resist.",
    search:"Baby Einstein Ocean Explorers Bath Pals kids"
  },
  {
    id:"p192", name:"60 Piece Sea Animals Set", age_min:36, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["animals","pretend-play","small-world","sorting"], fam:"animal-figures",
    price:18.99, asin:null, afflink:"https://link.amazon/B0flEZ9PK", img:"https://m.media-amazon.com/images/I/71ex794AjeL._AC_SL1500_.jpg",
    note:"A whole ocean in a tub. Sort them, name them, build underwater worlds. Add water or kinetic sand and it becomes a sensory bin too.",
    search:"60 Piece Sea Animals Set kids"
  },
  {
    id:"p193", name:"60 Piece Farm Animals Set", age_min:36, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["animals","pretend-play","small-world","sorting"], fam:"animal-figures",
    price:35.27, asin:null, afflink:"https://link.amazon/B05kNAT35", img:"https://m.media-amazon.com/images/I/71utz6V4J2L._AC_SL1500_.jpg",
    note:"Sixty farm friends for sorting, matching, counting and small world play. Simple figures like these carry years of play.",
    search:"60 Piece Farm Animals Set kids"
  },
  {
    id:"p194", name:"6 Piece Large Dinosaur Figures Set", age_min:36, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["dinosaurs","animals","pretend-play","small-world"], fam:"animal-figures",
    price:57.99, asin:null, afflink:"https://link.amazon/B0cNdcdgK", img:"https://m.media-amazon.com/images/I/91J8hbHJvvL._AC_SL1500_.jpg",
    note:"Big, realistic dinosaurs that survive being thrown. They end up in sensory bins and buried in the garden.",
    search:"6 Piece Large Dinosaur Figures Set kids"
  },
  {
    id:"p195", name:"Melissa & Doug Pet Vet Play Set", age_min:36, age_max:120,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","role-play","nurturing","empathy"], fam:"vet-set",
    price:52.9, asin:null, afflink:"https://link.amazon/B07fd56G4", img:"https://m.media-amazon.com/images/I/714NIH2CVFL._AC_SL1500_.jpg",
    note:"Check-ups, bandages and a lot of caring talk. The animals get very thoroughly looked after.",
    search:"Melissa & Doug Pet Vet Play Set kids"
  },
  {
    id:"p196", name:"Critter Clinic Vet Set", age_min:24, age_max:120,
    dev_areas:["fine","social","cognitive"], tags:["animals","pretend-play","fine-motor","problem-solving","nurturing"], fam:"vet-set",
    price:99.99, asin:null, afflink:"https://link.amazon/B07Uw326b", img:"https://m.media-amazon.com/images/I/81EJpdwEpDL._AC_SL1500_.jpg",
    note:"Six little doors, six keys, and a patient behind each one. Matching key to door, then looking after whoever is inside.",
    search:"Critter Clinic Vet Set kids"
  },
  {
    id:"p197", name:"Hape Puppy Care Clinic Vet Set", age_min:36, age_max:120,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","role-play","nurturing","empathy"], fam:"vet-set",
    price:49.99, asin:null, afflink:"https://link.amazon/B0dV33seI", img:"https://m.media-amazon.com/images/I/81PQ6knFe0L._AC_SL1500_.jpg",
    note:"A wooden vet clinic for one very unwell puppy. Lovely thing, and the looking-after play runs for ages.",
    search:"Hape Puppy Care Clinic Vet Set kids"
  },
  {
    id:"p198", name:"Play-Doh Care 'n Carry Vet Set", age_min:36, age_max:120,
    dev_areas:["fine","sensory","social"], tags:["animals","pretend-play","sensory","tactile","nurturing"], fam:"vet-set",
    price:24.0, asin:null, afflink:"https://link.amazon/B0flFzxTj", img:"https://m.media-amazon.com/images/I/81dNr8hjbNL._AC_SL1500_.jpg",
    note:"Vet play plus playdough in one. Squeezing and rolling the dough strengthens little hands while the caring storylines run.",
    search:"Play-Doh Care 'n Carry Vet Set kids"
  },
  {
    id:"p199", name:"Galt Bubble Lab", age_min:60, age_max:120,
    dev_areas:["cognitive","sensory"], tags:["STEM","science","cause-effect","experiments"], fam:"science-kit",
    price:22.99, asin:null, afflink:"https://link.amazon/B09RR6znD", img:"https://m.media-amazon.com/images/I/61OVpF+53aL._AC_SL1080_.jpg",
    note:"Real bubble experiments with a proper wow factor. Science that feels like magic is exactly how curiosity starts.",
    search:"Galt Bubble Lab kids"
  },
  {
    id:"p200", name:"70 Lab Experiments Science Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments","problem-solving"], fam:"science-kit",
    price:34.99, asin:null, afflink:"https://link.amazon/B0f9whsfu", img:"https://m.media-amazon.com/images/I/81ooFv9f7kL._AC_SL1500_.jpg",
    note:"Seventy experiments, so weeks of what happens if. Follow the steps and see what you get.",
    search:"70 Lab Experiments Science Kit kids"
  },
  {
    id:"p201", name:"National Geographic Science Magic Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","social"], tags:["STEM","science","experiments","performance"], fam:"science-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B0c9bE2RU", img:"https://m.media-amazon.com/images/I/81zJwByLeFL._AC_SL1500_.jpg",
    note:"Science tricks they can perform for the family. Learning the trick and putting on the show are two different jobs, and kids like both.",
    search:"National Geographic Science Magic Kit kids"
  },
  {
    id:"p202", name:"150 Science Experiments Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments","problem-solving"], fam:"science-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B09QQhUsc", img:"https://m.media-amazon.com/images/I/818eRP4CCUL._AC_SL1500_.jpg",
    note:"A big box of proper experiments for the kid who asks why about everything. Most of them they can run themselves.",
    search:"150 Science Experiments Kit kids"
  },
  {
    id:"p203", name:"Doctor Jupiter Girls Science Kit", age_min:72, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments"], fam:"science-kit",
    price:45.99, asin:null, afflink:"https://link.amazon/B07Woi59A", img:"https://m.media-amazon.com/images/I/71siUaJa5gL._AC_SL1500_.jpg",
    note:"Designed to pull girls into science early, and it works. Hands-on experiments that make STEM feel like it belongs to them.",
    search:"Doctor Jupiter Girls Science Kit kids"
  },
  {
    id:"p204", name:"Electric Circuit Motor Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","cause-effect","problem-solving"], fam:"circuit-kit",
    price:19.99, asin:null, afflink:"https://link.amazon/B0gJE5JZz", img:"https://m.media-amazon.com/images/I/61B5GfDiIYL._AC_SL1000_.jpg",
    note:"Snap the circuit together and the motor spins. A cheap way in to electronics.",
    search:"Electric Circuit Motor Kit kids"
  },
  {
    id:"p205", name:"Galt Science Lab", age_min:72, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments"], fam:"science-kit",
    price:34.95, asin:null, afflink:"https://link.amazon/B08KeUwOv", img:"https://m.media-amazon.com/images/I/613uYRsOFoL._AC_SL1080_.jpg",
    note:"A solid first proper science kit. Clear instructions, real reactions, and the pride of doing it themselves.",
    search:"Galt Science Lab kids"
  },
  {
    id:"p206", name:"Doctor Jupiter Super Science Kit", age_min:72, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments"], fam:"science-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B07CeXMth", img:"https://m.media-amazon.com/images/I/81PTUy0feoL._AC_SL1500_.jpg",
    note:"A big variety kit for kids who ask how everything works. Every experiment is a little lesson in following steps and predicting outcomes.",
    search:"Doctor Jupiter Super Science Kit kids"
  },
  {
    id:"p207", name:"Snap Circuits Flight Deck", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","problem-solving","constructive"], fam:"circuit-kit",
    price:44.1, asin:null, afflink:"https://link.amazon/B07GEBYcx", img:"https://m.media-amazon.com/images/I/71KOXQhpz5L._AC_SL1268_.jpg",
    note:"Snap the pieces together and things actually fly. Snap Circuits are the gold standard for teaching real electronics safely.",
    search:"Snap Circuits Flight Deck kids"
  },
  {
    id:"p208", name:"Galt Rainbow Lab", age_min:60, age_max:120,
    dev_areas:["cognitive","sensory"], tags:["STEM","science","experiments","colours"], fam:"science-kit",
    price:38.24, asin:null, afflink:"https://link.amazon/B03NHkZmm", img:"https://m.media-amazon.com/images/I/61wtOHQBYFL._AC_SL1080_.jpg",
    note:"Colour mixing science with big visual payoffs. Perfect for younger scientists who need to see something happen right now.",
    search:"Galt Rainbow Lab kids"
  },
  {
    id:"p209", name:"Learning Resources Code & Go Robot Mouse", age_min:48, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","coding","problem-solving","sequencing","cause-effect"], fam:"coding-robot",
    price:60.6, asin:null, afflink:"https://link.amazon/B0b4cnk1L", img:"https://m.media-amazon.com/images/I/81SVjjQPCWL._AC_SL1500_.jpg",
    note:"Press the arrows, send the mouse off, watch it get the route wrong. Coding with no screen.",
    search:"Learning Resources Code & Go Robot Mouse kids"
  },
  {
    id:"p210", name:"Apitor Coding Robot Building Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","coding","constructive","problem-solving"], fam:"coding-robot",
    price:89.99, asin:null, afflink:"https://link.amazon/B00HvI7BW", img:"https://m.media-amazon.com/images/I/714gnKxoPSL._AC_SL1500_.jpg",
    note:"Build the robot, then code it to move. A genuine step-up project for an older kid ready to be stretched.",
    search:"Apitor Coding Robot Building Kit kids"
  },
  {
    id:"p211", name:"Snap Circuits Junior 100 Experiments", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","problem-solving"], fam:"circuit-kit",
    price:65.55, asin:null, afflink:"https://link.amazon/B0fvhynmZ", img:"https://m.media-amazon.com/images/I/91THy3rMlCL._AC_SL1500_.jpg",
    note:"One hundred circuit projects that snap together safely. Lights, sounds and sirens they built themselves. The confidence payoff is huge.",
    search:"Snap Circuits Junior 100 Experiments kids"
  },
  {
    id:"p212", name:"National Geographic Circuit Maker Electronics Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","problem-solving"], fam:"circuit-kit",
    price:120.97, asin:null, afflink:"https://link.amazon/B0aVGjLUz", img:"https://m.media-amazon.com/images/I/91EMQqNa7aL._AC_SL1500_.jpg",
    note:"A serious electronics kit for a seriously curious kid. The kind of present that starts a lifelong interest.",
    search:"National Geographic Circuit Maker Electronics Kit kids"
  },
  {
    id:"p213", name:"Snap Circuits BRIC: Bricks & Circuits Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","constructive","blocks-tiles"], fam:"circuit-kit",
    price:62.74, asin:null, afflink:"https://link.amazon/B02V1FALM", img:"https://m.media-amazon.com/images/I/61kKPO5qK6L._AC_SL1097_.jpg",
    note:"Building bricks meet working circuits. Perfect for a builder who's ready to make their creations light up and move.",
    search:"Snap Circuits BRIC: Bricks & Circuits Kit kids"
  },
  {
    id:"p214", name:"Doctor Jupiter Electricity Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","experiments"], fam:"circuit-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B01o3i6mh", img:"https://m.media-amazon.com/images/I/71iTlefcwNL._AC_SL1000_.jpg",
    note:"Hands-on electricity experiments that answer the how does that work questions properly. Great value for the depth you get.",
    search:"Doctor Jupiter Electricity Kit kids"
  },
  {
    id:"p215", name:"Snap Circuits Arcade", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","circuits","problem-solving"], fam:"circuit-kit",
    price:104.82, asin:null, afflink:"https://link.amazon/B027s96N3", img:"https://m.media-amazon.com/images/I/71dyfiqJ3iL._AC_SL1500_.jpg",
    note:"Build your own working arcade games from circuits. The most motivating version of Snap Circuits for game-loving kids.",
    search:"Snap Circuits Arcade kids"
  },
  {
    id:"p216", name:"UNO Card Game", age_min:84, age_max:120,
    dev_areas:["cognitive","social"], tags:["card-game","turn-taking","colours","numbers","board-game"],
    price:6.0, asin:null, afflink:"https://link.amazon/B05f6mBWE", img:"https://m.media-amazon.com/images/I/71ozbtH8PbL._AC_SL1500_.jpg",
    note:"The classic for a reason. Matching colours and numbers, and coping when someone hits you with a draw four.",
    search:"UNO Card Game kids"
  },
  {
    id:"p217", name:"5 Second Rule Game", age_min:96, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["card-game","language","vocabulary","reaction-time","board-game"],
    price:9.95, asin:null, afflink:"https://link.amazon/B0hzFxSuN", img:"https://m.media-amazon.com/images/I/61Jb80Mp5oL._AC_SL1200_.jpg",
    note:"Name three things in five seconds. Brilliant for word retrieval and thinking under pressure, and it gets very funny very fast.",
    search:"5 Second Rule Game kids"
  },
  {
    id:"p218", name:"Old Maid Card Game", age_min:48, age_max:120,
    dev_areas:["cognitive","social"], tags:["card-game","turn-taking","matching","board-game"],
    price:6.45, asin:null, afflink:"https://link.amazon/B0az647MF", img:"https://m.media-amazon.com/images/I/710I31VASCL._AC_SL1500_.jpg",
    note:"Simple, quick and a little bit cheeky. Matching, holding a hand of cards, and learning to keep a poker face.",
    search:"Old Maid Card Game kids"
  },
  {
    id:"p219", name:"Monopoly Deal Card Game", age_min:96, age_max:120,
    dev_areas:["cognitive","social"], tags:["card-game","strategy","numbers","turn-taking","board-game"],
    price:7.0, asin:null, afflink:"https://link.amazon/B050ix1Xh", img:"https://m.media-amazon.com/images/I/81-tKuW1IqL._AC_SL1500_.jpg",
    note:"All the property-dealing fun of Monopoly in fifteen minutes. Strategy, money maths and losing gracefully, without the three-hour meltdown.",
    search:"Monopoly Deal Card Game kids"
  },
  {
    id:"p220", name:"Tapple Word Game", age_min:96, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["word-game","language","vocabulary","letters","reaction-time","board-game"],
    price:25.0, asin:null, afflink:"https://link.amazon/B06Zhi5Al", img:"https://m.media-amazon.com/images/I/81dTQBmNewL._AC_SL1500_.jpg",
    note:"Hit the timer, name a word, don't repeat a letter. Fast word retrieval under pressure, which is exactly the skill kids need for classroom answers.",
    search:"Tapple Word Game kids"
  },
  {
    id:"p221", name:"Guess Who", age_min:72, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["board-game","questions","language","deduction","turn-taking"],
    price:19.99, asin:null, afflink:"https://link.amazon/B0dW5ZcfA", img:"https://m.media-amazon.com/images/I/81Y72Ho77dL._AC_SL1500_.jpg",
    note:"Does your person wear glasses? A lot of thinking about what to ask next, hidden inside a simple game. One I use at work.",
    search:"Guess Who kids"
  },
  {
    id:"p222", name:"Monopoly Junior: Bluey Edition", age_min:60, age_max:120,
    dev_areas:["cognitive","social"], tags:["board-game","numbers","turn-taking","bluey"],
    price:22.0, asin:null, afflink:"https://link.amazon/B09NDA80D", img:"https://m.media-amazon.com/images/I/81DPZQ6tQYL._AC_SL1500_.jpg",
    note:"A first board game with the Heeler family along for the ride. Counting, taking turns, and handling pretend money.",
    search:"Monopoly Junior: Bluey Edition kids"
  },
  {
    id:"p223", name:"Taco Cat Goat Cheese Pizza", age_min:96, age_max:120,
    dev_areas:["cognitive","social"], tags:["card-game","reaction-time","attention","board-game"],
    price:15.0, asin:null, afflink:"https://link.amazon/B07JR692b", img:"https://m.media-amazon.com/images/I/61NYm2jYMHL._AC_SL1465_.jpg",
    note:"Say the word, flip the card, slap when they match. Pure attention and impulse control training disguised as chaos.",
    search:"Taco Cat Goat Cheese Pizza kids"
  },
  {
    id:"p224", name:"Pop Up Pirate", age_min:36, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["board-game","turn-taking","fine-motor","cause-effect","suspense"],
    price:14.95, asin:null, afflink:"https://link.amazon/B02qOPxKy", img:"https://m.media-amazon.com/images/I/812lSGtI33L._AC_SL1500_.jpg",
    note:"Slide the swords in and wait for the pirate to pop. The suspense is unbearable and they beg to play again.",
    search:"Pop Up Pirate kids"
  },
  {
    id:"p225", name:"Jenga", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["board-game","fine-motor","balance","turn-taking","hand-eye"],
    price:29.99, asin:null, afflink:"https://link.amazon/B08T6H9Ih", img:"https://m.media-amazon.com/images/I/81xyPFZTrfL._AC_SL1500_.jpg",
    note:"Steady hands, careful planning, and the delicious tension of a wobbling tower. Then the crash.",
    search:"Jenga kids"
  },
  {
    id:"p226", name:"Hedbanz", age_min:72, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["board-game","questions","language","deduction","turn-taking"],
    price:20.0, asin:null, afflink:"https://link.amazon/B0gkGGvho", img:"https://m.media-amazon.com/images/I/81vv05gBltL._AC_SL1500_.jpg",
    note:"What am I? Asking the right questions to work out the card on your own head. Question forming and categorising, wrapped in giggles.",
    search:"Hedbanz kids"
  },
  {
    id:"p227", name:"Trouble", age_min:60, age_max:120,
    dev_areas:["cognitive","social"], tags:["board-game","counting","turn-taking","numbers"],
    price:19.95, asin:null, afflink:"https://link.amazon/B0d42A2h2", img:"https://m.media-amazon.com/images/I/81M3F7FcsyL._AC_SL1500_.jpg",
    note:"Pop the dice, count the moves, cope with getting sent home. Counting and good sportsmanship practice in every round.",
    search:"Trouble kids"
  },
  {
    id:"p228", name:"Bananagrams", age_min:84, age_max:120,
    dev_areas:["language","cognitive","fine"], tags:["word-game","letters","language","spelling","board-game"],
    price:19.95, asin:null, afflink:"https://link.amazon/B0cPPgcCJ", img:"https://m.media-amazon.com/images/I/719SDWO2ldL._AC_SL1500_.jpg",
    note:"Build your own crossword faster than everyone else. Spelling and word building at speed, and the banana pouch travels anywhere.",
    search:"Bananagrams kids"
  },
  {
    id:"p229", name:"Pop-Up Soccer Goal Set", age_min:72, age_max:120,
    dev_areas:["gross","social"], tags:["outdoor","sports","movement","coordination","bilateral"],
    price:57.0, asin:null, afflink:"https://link.amazon/B02hRPQa8", img:"https://m.media-amazon.com/images/I/81b7qvRpFSL._AC_SL1500_.jpg",
    note:"A backyard goal turns kicking about into an actual game. Hitting a moving ball takes practice.",
    search:"Pop-Up Soccer Goal Set kids"
  },
  {
    id:"p230", name:"Little Tikes T-Ball Set", age_min:18, age_max:36,
    dev_areas:["gross"], tags:["outdoor","sports","hand-eye","coordination","bilateral"],
    price:29.0, asin:null, afflink:"https://link.amazon/B06s4CGzx", img:"https://m.media-amazon.com/images/I/61nGSQIlFeL._AC_SL1500_.jpg",
    note:"The ball sits still, so they actually connect with it. A better first go than someone pitching at them.",
    search:"Little Tikes T-Ball Set kids"
  },
  {
    id:"p231", name:"Totem Tennis Set", age_min:72, age_max:120,
    dev_areas:["gross"], tags:["outdoor","sports","hand-eye","coordination","reaction-time"],
    price:75.95, asin:null, afflink:"https://link.amazon/B02Gt20Dt", img:"https://m.media-amazon.com/images/I/51JvRnkHNBL._AC_SL1500_.jpg",
    note:"An Aussie backyard classic. One kid can play it on their own when nobody else is free.",
    search:"Totem Tennis Set kids"
  },
  {
    id:"p232", name:"LEGO Friends Nature Glamping Cabin", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","lego"], fam:"lego",
    price:31.99, asin:"B0FPXFTCCG", afflink:"https://www.amazon.com.au/dp/B0FPXFTCCG?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81DCgWqZUcL._AC_SL1500_.jpg",
    note:"Build it, then play in it. LEGO Friends sets roll construction and pretend play into one, so the fun keeps going after the build.",
    search:"LEGO Friends Nature Glamping Cabin kids"
  },
  {
    id:"p233", name:"LEGO City Fire Rescue Boat", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","vehicles","pretend-play","lego"], fam:"lego",
    price:50.61, asin:"B0DHZVJST6", afflink:"https://www.amazon.com.au/dp/B0DHZVJST6?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Vcy6pZ24L._AC_SL1500_.jpg",
    note:"A rescue boat to build, then rescue missions to run with it. The instructions are followable on their own.",
    search:"LEGO City Fire Rescue Boat kids"
  },
  {
    id:"p234", name:"LEGO Disney Belle & the Beast's Enchanted Castle", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","storytelling","lego"], fam:"lego",
    price:47.99, asin:"B0FPXG66P7", afflink:"https://www.amazon.com.au/dp/B0FPXG66P7?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81c9-SVwXeL._AC_SL1500_.jpg",
    note:"Build the castle, then retell the tale as old as time. Story-driven builds keep imaginative kids playing long after the last brick.",
    search:"LEGO Disney Belle & the Beast's Enchanted Castle kids"
  },
  {
    id:"p235", name:"LEGO Friends Heartlake City Mini Supermarket", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","role-play","lego"], fam:"lego",
    price:23.99, asin:"B0FPXBHY2V", afflink:"https://www.amazon.com.au/dp/B0FPXBHY2V?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/818Nax0kqqL._AC_SL1500_.jpg",
    note:"A build plus shop play in one. Great starter LEGO price, and the supermarket storylines bring in loads of language.",
    search:"LEGO Friends Heartlake City Mini Supermarket kids"
  },
  {
    id:"p236", name:"LEGO Friends Unicorn & Flamingo Pool Party", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","pretend-play","animals","lego"], fam:"lego",
    price:9.6, asin:"B0DWF4JFMF", afflink:"https://www.amazon.com.au/dp/B0DWF4JFMF?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81DrJVckQfL._AC_SL1500_.jpg",
    note:"A pocket-money LEGO set that is very cute. Small enough to finish in one sitting.",
    search:"LEGO Friends Unicorn & Flamingo Pool Party kids"
  },
  {
    id:"p237", name:"LEGO Classic Creative Vehicles", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","open-ended","lego"], fam:"lego",
    price:63.99, asin:"B0H4NHQ343", afflink:"https://www.amazon.com.au/dp/B0H4NHQ343?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81bVSZ51cFL._AC_SL1500_.jpg",
    note:"Open-ended bricks with vehicle ideas to spark them. Classic sets are my pick for creativity because there's no single right answer.",
    search:"LEGO Classic Creative Vehicles kids"
  },
  {
    id:"p238", name:"LEGO Toy Story 5 Blaze's Horse Ranch", age_min:48, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","animals","lego"], fam:"lego",
    price:59.0, asin:"B0FPXG718F", afflink:"https://www.amazon.com.au/dp/B0FPXG718F?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81v0PoitvGL._AC_SL1500_.jpg",
    note:"A 4+ set with chunkier pieces and beloved characters. A lovely bridge between DUPLO and proper LEGO.",
    search:"LEGO Toy Story 5 Blaze's Horse Ranch kids"
  },
  {
    id:"p239", name:"LEGO Friends Unicorn Dream Café", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","role-play","lego"], fam:"lego",
    price:47.99, asin:"B0FPVZ2B9Y", afflink:"https://www.amazon.com.au/dp/B0FPVZ2B9Y?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81GqoPqfLrL._AC_SL1500_.jpg",
    note:"A cafe to build, then a cafe to run. Taking orders and getting them wrong is most of the fun.",
    search:"LEGO Friends Unicorn Dream Café kids"
  },
  {
    id:"p240", name:"LEGO Disney Mini Belle & Tiana with Castle", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","storytelling","lego"], fam:"lego",
    price:39.0, asin:"B0FPXG9QQL", afflink:"https://www.amazon.com.au/dp/B0FPXG9QQL?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81RXoNhd7FL._AC_SL1500_.jpg",
    note:"Two princesses, one castle, endless storylines. Build first, then let the imaginative play take over.",
    search:"LEGO Disney Mini Belle & Tiana with Castle kids"
  },
  {
    id:"p241", name:"LEGO Classic Medium Creative Brick Box", age_min:48, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","open-ended","lego"], fam:"lego",
    price:34.4, asin:"B0C7F8G2L2", afflink:"https://www.amazon.com.au/dp/B0C7F8G2L2?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81TNNA5OXCL._AC_SL1500_.jpg",
    note:"Just bricks and imagination. If I could only recommend one LEGO product, it's the classic box, because open-ended building never gets outgrown.",
    search:"LEGO Classic Medium Creative Brick Box kids"
  },
  {
    id:"p242", name:"LEGO Classic Creative Dinosaurs", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","dinosaurs","open-ended","lego"], fam:"lego",
    price:34.4, asin:"B0G7JDFL1B", afflink:"https://www.amazon.com.au/dp/B0G7JDFL1B?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81UhCOtHsKL._AC_SL1500_.jpg",
    note:"Build a T-Rex, pull it apart, build a triceratops. Dino love plus construction skills in one box.",
    search:"LEGO Classic Creative Dinosaurs kids"
  },
  {
    id:"p243", name:"LEGO Friends Fun Water Park Day", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","water","lego"], fam:"lego",
    price:34.0, asin:"B0FPXGQ1DK", afflink:"https://www.amazon.com.au/dp/B0FPXGQ1DK?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81C08sfT4fL._AC_SL1500_.jpg",
    note:"Water slides and summer storylines. The build is the warm-up, the pretend play is the main event.",
    search:"LEGO Friends Fun Water Park Day kids"
  },
  {
    id:"p244", name:"LEGO City F1 Pit Stop & Pit Crew with Ferrari", age_min:72, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","lego"], fam:"lego",
    price:31.2, asin:"B0DHSHH218", afflink:"https://www.amazon.com.au/dp/B0DHSHH218?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81NSva3jycL._AC_SL1500_.jpg",
    note:"A pit stop build for speed-obsessed kids. Cars plus construction is a winning combination for keeping vehicle lovers building.",
    search:"LEGO City F1 Pit Stop & Pit Crew with Ferrari kids"
  },
  {
    id:"p245", name:"LEGO Friends Cat Birthday Party & Tree House", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","animals","pretend-play","lego"], fam:"lego",
    price:31.2, asin:"B0DWDWMVZ4", afflink:"https://www.amazon.com.au/dp/B0DWDWMVZ4?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81FL73NR3DL._AC_SL1500_.jpg",
    note:"A tree house to build with a cat party going on inside it. One for the animal obsessed.",
    search:"LEGO Friends Cat Birthday Party & Tree House kids"
  },
  {
    id:"p246", name:"LEGO Disney Moana's Island Fun", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","storytelling","lego"], fam:"lego",
    price:29.0, asin:"B0DSBQ2ZG2", afflink:"https://www.amazon.com.au/dp/B0DSBQ2ZG2?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Oe7tvhHwL._AC_SL1500_.jpg",
    note:"Moana's island in brick form. Familiar characters lower the entry bar for kids who find building tricky.",
    search:"LEGO Disney Moana's Island Fun kids"
  },
  {
    id:"p247", name:"LEGO City Doughnut Truck", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","pretend-play","lego"], fam:"lego",
    price:23.99, asin:"B0H4178848", afflink:"https://www.amazon.com.au/dp/B0H4178848?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81DkCvjbH7L._AC_SL1500_.jpg",
    note:"A doughnut truck. Enough said. A fun, affordable build that rolls straight into pretend play.",
    search:"LEGO City Doughnut Truck kids"
  },
  {
    id:"p248", name:"LEGO Disney Ariel's Magical Mini Palace", age_min:60, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["constructive","blocks-tiles","pretend-play","storytelling","lego"], fam:"lego",
    price:23.2, asin:"B0FPXJHB6S", afflink:"https://www.amazon.com.au/dp/B0FPXJHB6S?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/811fGe6WTTL._AC_SL1500_.jpg",
    note:"An under the sea palace, and not expensive. Small enough to finish in an afternoon.",
    search:"LEGO Disney Ariel's Magical Mini Palace kids"
  },
  {
    id:"p249", name:"LEGO City Blue Monster Truck", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","lego"], fam:"lego",
    price:19.0, asin:"B0DNMJRKKD", afflink:"https://www.amazon.com.au/dp/B0DNMJRKKD?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81T4G46DlOL._AC_SL1500_.jpg",
    note:"A monster truck they build themselves hits different. Great value entry into LEGO City for vehicle fans.",
    search:"LEGO City Blue Monster Truck kids"
  },
  {
    id:"p250", name:"LEGO Friends Axolotl Adventure Boat", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","animals","lego"], fam:"lego",
    price:10.0, asin:"B0FPXDDHKQ", afflink:"https://www.amazon.com.au/dp/B0FPXDDHKQ?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81U4jdPZoTL._AC_SL1500_.jpg",
    note:"An axolotl boat for ten dollars. A perfect party gift or first solo build.",
    search:"LEGO Friends Axolotl Adventure Boat kids"
  },
  {
    id:"p251", name:"LEGO City Rides Construction Loader", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","lego"], fam:"lego",
    price:9.0, asin:"B0H1YSKW8X", afflink:"https://www.amazon.com.au/dp/B0H1YSKW8X?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/713CdcEJQ8L._AC_SL1500_.jpg",
    note:"A pocket-money loader for the digger-obsessed. Small sets like this they can usually do on their own.",
    search:"LEGO City Rides Construction Loader kids"
  },
  {
    id:"p252", name:"LEGO City Rides Police Truck", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["constructive","blocks-tiles","vehicles","lego"], fam:"lego",
    price:9.0, asin:"B0H41948HP", afflink:"https://www.amazon.com.au/dp/B0H41948HP?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71JQlHxPNNL._AC_SL1500_.jpg",
    note:"Nine dollars, one police truck, one very proud builder. A brilliant low-stakes way to test the LEGO waters.",
    search:"LEGO City Rides Police Truck kids"
  },
  {
    id:"p253", name:"Crazy Aaron's Thinking Putty", age_min:36, age_max:120,
    dev_areas:["sensory","fine"], tags:["sensory","fidget","hand-strength","tactile","calm-down"], fam:"putty",
    price:14.99, asin:null, afflink:"https://link.amazon/B0fLOwsag", img:"https://m.media-amazon.com/images/I/81J2cIswLwL._AC_SL1500_.jpg",
    note:"The good putty. Stretch it, snap it, sculpt it. Something for hands that won't sit still.",
    search:"Crazy Aaron's Thinking Putty kids"
  },
  {
    id:"p254", name:"Sensory Stress Cube Set", age_min:36, age_max:120,
    dev_areas:["sensory","fine"], tags:["sensory","fidget","tactile","calm-down","self-regulation"],
    price:54.99, asin:null, afflink:"https://link.amazon/B05lAF34Z", img:"https://m.media-amazon.com/images/I/61du20U9CcL._AC_SL1280_.jpg",
    note:"Squeeze, press and squish. A set of stress cubes gives fidgety hands somewhere legal to go during homework, car trips and big feelings.",
    search:"Sensory Stress Cube Set kids"
  },
  {
    id:"p255", name:"QUOKKA Toddler Floor Puzzle: Farm Animals (40pc)", age_min:24, age_max:48,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","problem-solving","visual"], fam:"jigsaw",
    price:16.99, asin:"B0DP6VXBNT", afflink:"https://www.amazon.com.au/dp/B0DP6VXBNT?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/819kZNiA4xL._AC_SL1500_.jpg",
    note:"Big floor pieces sized for little hands. Working a puzzle on the floor adds crawling and reaching, so the whole body joins in.",
    search:"QUOKKA Toddler Floor Puzzle: Farm Animals (40pc) kids"
  },
  {
    id:"p256", name:"Toddler Wooden Animal Jigsaw Puzzles", age_min:12, age_max:36,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","colours","shapes"], fam:"jigsaw",
    price:28.99, asin:"B07WK74S3V", afflink:"https://www.amazon.com.au/dp/B07WK74S3V?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71yMMQ9m2HL._AC_SL1500_.jpg",
    note:"Chunky wooden pieces with knobs, for a first puzzle. Turning the piece until it drops in is the whole job.",
    search:"Toddler Wooden Animal Jigsaw Puzzles kids"
  },
  {
    id:"p257", name:"Ravensburger Bluey Family Time Puzzle (35pc)", age_min:36, age_max:84,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","bluey","problem-solving","visual"], fam:"jigsaw",
    price:14.95, asin:"B0GSXML71J", afflink:"https://www.amazon.com.au/dp/B0GSXML71J?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71VlSBuY+RL._AC_SL1500_.jpg",
    note:"A just-right 35 pieces with the Heeler family. Familiar characters keep kids at the table long enough to finish, and finishing is the win.",
    search:"Ravensburger Bluey Family Time Puzzle (35pc) kids"
  },
  {
    id:"p258", name:"Ravensburger On the Farm My First Puzzle", age_min:18, age_max:36,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","problem-solving"], fam:"jigsaw",
    price:14.95, asin:"B0CMX8CS7S", afflink:"https://www.amazon.com.au/dp/B0CMX8CS7S?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/713c6IC45oL._AC_SL1314_.jpg",
    note:"Four little puzzles that grow from two pieces to five. A perfect first jigsaw that meets a toddler exactly where they are.",
    search:"Ravensburger On the Farm My First Puzzle kids"
  },
  {
    id:"p259", name:"Melissa & Doug Pets Peg Puzzle", age_min:24, age_max:48,
    dev_areas:["fine","cognitive","language"], tags:["puzzle","animals","fine-motor","grasping"], fam:"jigsaw",
    price:12.99, asin:"B01G6Q5S08", afflink:"https://www.amazon.com.au/dp/B01G6Q5S08?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81gKuesFB0L._AC_SL1500_.jpg",
    note:"Little pegs make the pieces easy to lift, and pinching them is quiet pincer grip practice. Name each pet as it goes in for a language boost.",
    search:"Melissa & Doug Pets Peg Puzzle kids"
  },
  {
    id:"p260", name:"Melissa & Doug Safari Peg Puzzle", age_min:24, age_max:48,
    dev_areas:["fine","cognitive","language"], tags:["puzzle","animals","fine-motor","grasping"], fam:"jigsaw",
    price:12.99, asin:"B01F33AOAE", afflink:"https://www.amazon.com.au/dp/B01F33AOAE?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81m+6WmU4FL._AC_SL1500_.jpg",
    note:"Safari friends with easy-grip pegs. Puzzle play plus animal names, and the pincer grip work sets up pencil skills later.",
    search:"Melissa & Doug Safari Peg Puzzle kids"
  },
  {
    id:"p261", name:"6 Wooden Animal Jigsaw Puzzles Set (30pc each)", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","problem-solving"], fam:"jigsaw",
    price:16.98, asin:"B0CBR8GDNZ", afflink:"https://www.amazon.com.au/dp/B0CBR8GDNZ?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/91hPsJMBqTL._AC_SL1500_.jpg",
    note:"Six puzzles in one box means the challenge keeps refreshing. Thirty pieces is the sweet spot for building persistence without frustration.",
    search:"6 Wooden Animal Jigsaw Puzzles Set (30pc each) kids"
  },
  {
    id:"p262", name:"Ravensburger Disney Princess Puzzle (100pc)", age_min:72, age_max:120,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","problem-solving","focus"], fam:"jigsaw",
    price:22.49, asin:"B0CQ59DYJJ", afflink:"https://www.amazon.com.au/dp/B0CQ59DYJJ?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61pI0LMmpmL._AC_SL1024_.jpg",
    note:"One hundred pieces is a proper sit-down job. They'll want it left out so they can come back to it.",
    search:"Ravensburger Disney Princess Puzzle (100pc) kids"
  },
  {
    id:"p263", name:"Magnetic Dinosaur Travel Puzzle Book (3-in-1)", age_min:36, age_max:72,
    dev_areas:["cognitive","fine"], tags:["puzzle","dinosaurs","travel","problem-solving","magnetic"], fam:"jigsaw",
    price:19.99, asin:"B0DT1MC1K4", afflink:"https://www.amazon.com.au/dp/B0DT1MC1K4?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81zIZ4GsewL._AC_SL1500_.jpg",
    note:"Magnetic pieces that stay put in the car or cafe. Three dino puzzles in a book that travels anywhere. Genius for waiting rooms.",
    search:"Magnetic Dinosaur Travel Puzzle Book (3-in-1) kids"
  },
  {
    id:"p264", name:"Galt 4 Dinosaur Puzzles in a Box", age_min:36, age_max:84,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","dinosaurs","problem-solving"], fam:"jigsaw",
    price:13.0, asin:"B0G99QYZ3K", afflink:"https://www.amazon.com.au/dp/B0G99QYZ3K?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81dcmL3AKzL._AC_SL1500_.jpg",
    note:"Four dino puzzles that step up from 12 to 24 pieces. The built-in progression means it grows with them.",
    search:"Galt 4 Dinosaur Puzzles in a Box kids"
  },
  {
    id:"p265", name:"Galt 4 Farm Animal Puzzles in a Box", age_min:36, age_max:72,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","problem-solving"], fam:"jigsaw",
    price:13.79, asin:"B0G99M91ZN", afflink:"https://www.amazon.com.au/dp/B0G99M91ZN?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61skV5W9SsL._AC_SL1000_.jpg",
    note:"Farm puzzles that start at four pieces and build up. Perfect for a younger puzzler finding their confidence.",
    search:"Galt 4 Farm Animal Puzzles in a Box kids"
  },
  {
    id:"p266", name:"Ravensburger Spider-Man 4-in-1 Puzzles", age_min:36, age_max:84,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","problem-solving"], fam:"jigsaw",
    price:19.95, asin:"B07175FQXG", afflink:"https://www.amazon.com.au/dp/B07175FQXG?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/91UBglx5v6L._AC_SL1500_.jpg",
    note:"Four Spidey puzzles in rising sizes. A favourite character can be the difference between refusing puzzles and requesting them.",
    search:"Ravensburger Spider-Man 4-in-1 Puzzles kids"
  },
  {
    id:"p267", name:"QUOKKA 100pc Floor Puzzles 3-Pack (Ocean, Animals, Dinosaurs)", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","animals","dinosaurs","problem-solving"], fam:"jigsaw",
    price:39.99, asin:"B0FJMV19J8", afflink:"https://www.amazon.com.au/dp/B0FJMV19J8?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81c2m--Ie8L._AC_SL1500_.jpg",
    note:"Three big floor puzzles covering ocean, animals and dinos. Floor puzzles get the whole body moving while the brain works.",
    search:"QUOKKA 100pc Floor Puzzles 3-Pack (Ocean, Animals, Dinosaurs) kids"
  },
  {
    id:"p268", name:"QUOKKA Puzzles 4x60 (Space, Dino, Firefighters)", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","dinosaurs","problem-solving"], fam:"jigsaw",
    price:36.99, asin:"B0DGGX79J8", afflink:"https://www.amazon.com.au/dp/B0DGGX79J8?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/812+OguWS2L._AC_SL1500_.jpg",
    note:"Four 60-piece puzzles across space, dinos and firefighters. Enough variety to follow whatever they're obsessed with this month.",
    search:"QUOKKA Puzzles 4x60 (Space, Dino, Firefighters) kids"
  },
  {
    id:"p269", name:"Skillmatics World Map Puzzle (96pc + facts)", age_min:72, age_max:144,
    dev_areas:["cognitive","language"], tags:["puzzle","jigsaw","problem-solving","geography","STEM"], fam:"jigsaw",
    price:39.99, asin:"B0C1NWSCBN", afflink:"https://www.amazon.com.au/dp/B0C1NWSCBN?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81g77RSCzzL._AC_SL1500_.jpg",
    note:"Build the world and learn 400 facts along the way. Puzzle skills plus geography for curious school-age kids.",
    search:"Skillmatics World Map Puzzle (96pc + facts) kids"
  },
  {
    id:"p270", name:"QUOKKA World Puzzle with Flashcards (70pc)", age_min:72, age_max:96,
    dev_areas:["cognitive","language"], tags:["puzzle","jigsaw","problem-solving","geography"], fam:"jigsaw",
    price:29.99, asin:"B0DP52SRRT", afflink:"https://www.amazon.com.au/dp/B0DP52SRRT?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81+7FwOAjsL._AC_SL1500_.jpg",
    note:"A world map puzzle with flashcards to match. Great for kids starting to ask where places are.",
    search:"QUOKKA World Puzzle with Flashcards (70pc) kids"
  },
  {
    id:"p271", name:"Ravensburger Minecraft Cutaway Puzzle (300pc)", age_min:96, age_max:144,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","problem-solving","focus","minecraft"], fam:"jigsaw",
    price:24.95, asin:"B0D6LLPBN7", afflink:"https://www.amazon.com.au/dp/B0D6LLPBN7?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81+gk5fF-CL._AC_SL1500_.jpg",
    note:"Three hundred pieces of Minecraft. For a gaming-mad kid, this converts screen love into sustained offline focus.",
    search:"Ravensburger Minecraft Cutaway Puzzle (300pc) kids"
  },
  {
    id:"p272", name:"Galt 4 Vehicle Puzzles in a Box", age_min:36, age_max:84,
    dev_areas:["cognitive","fine"], tags:["puzzle","jigsaw","vehicles","problem-solving"], fam:"jigsaw",
    price:13.0, asin:"B0CHN8C5X5", afflink:"https://www.amazon.com.au/dp/B0CHN8C5X5?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/814dGapN+oL._AC_SL1500_.jpg",
    note:"Four vehicle puzzles in rising difficulty. Diggers and trucks pull vehicle fans into puzzle play they'd otherwise skip.",
    search:"Galt 4 Vehicle Puzzles in a Box kids"
  },
{
    id:"p273", name:"Electronic Dance Mat", age_min:36, age_max:120,
    dev_areas:["gross","sensory","cognitive"], tags:["music","movement","coordination","cause-effect","dance"],
    price:45, asin:null, afflink:"https://link.amazon/B06iNCATi", img:"https://m.media-amazon.com/images/I/81hLfap3RGL._AC_SL1500_.jpg",
    note:"Step on the lights and follow the beat. Gets a lot of energy out without anyone leaving the lounge room.",
    search:"kids electronic dance mat music lights"
  },
  {
    id:"p274", name:"Wooden Musical Instruments Set", age_min:36, age_max:120,
    dev_areas:["sensory","fine","social","language"], tags:["music","rhythm","instruments"], fam:"instrument-set",
    price:40, asin:null, afflink:"https://link.amazon/B0iVEOSjB", img:"https://m.media-amazon.com/images/I/81Rtx8wXZgL._AC_SL1500_.jpg",
    note:"A wooden set of shakers, drums and bells. Nicer to listen to than the plastic ones, and they last.",
    search:"wooden musical instruments set kids toddler"
  },
  {
    id:"p275", name:"Boomwhackers Musical Tubes", age_min:36, age_max:144,
    dev_areas:["gross","cognitive","social","sensory"], tags:["music","rhythm","instruments","coordination","social"],
    price:45, asin:null, afflink:"https://link.amazon/B0i3oE1JP", img:"https://m.media-amazon.com/images/I/710my2-medL._SL1500_.jpg",
    note:"Colour-coded tubes you whack to play real notes. Follow along with YouTube videos to play actual songs together, or grab a song book. Brilliant for music lovers and even better as a family band.",
    search:"Boomwhackers musical tubes kids set"
  },

  {
    id:"p276", name:"Aerial Silks / Hammock Swing", age_min:72, age_max:144,
    dev_areas:["gross","sensory"], tags:["sports","movement","vestibular","proprioceptive","climbing","heavy-work","swing"],
    price:132, asin:null, afflink:"https://link.amazon/B06oSypJO", img:"https://m.media-amazon.com/images/I/51F8lGFpyqL._AC_SL1098_.jpg",
    note:"Climbing, hanging and spinning, all from one piece of kit. You'll need somewhere sturdy to hang it, and an outdoor monkey bar frame works well.",
    search:"kids aerial silks hammock swing"
  },
  {
    id:"p277", name:"Ninja Warrior Obstacle Course Kit", age_min:72, age_max:144,
    dev_areas:["gross","sensory","cognitive"], tags:["sports","outdoor","movement","climbing","strength","proprioceptive","motor-planning"],
    price:149, asin:null, afflink:"https://link.amazon/B07EjvjgH", img:"https://m.media-amazon.com/images/I/81HDiwi6VIL._AC_SL1500_.jpg",
    note:"A backyard ninja course for climbing, swinging and balancing. You'll need two solid trees or a park to set it up.",
    search:"kids ninja warrior obstacle course slackline kit"
  },
  {
    id:"p278", name:"Cornhole Bean Bag Toss Set (Deluxe)", age_min:60, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["sports","outdoor","hand-eye","turn-taking","coordination"], fam:"cornhole",
    price:116, asin:null, afflink:"https://link.amazon/B0iRse7KA", img:"https://m.media-amazon.com/images/I/81X2xOX7UBL._AC_SL1500_.jpg",
    note:"Toss the bean bags at the board and argue about the score. One the whole family will actually play.",
    search:"cornhole bean bag toss set kids outdoor"
  },
  {
    id:"p279", name:"Cornhole Bean Bag Toss Set (Value)", age_min:60, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["sports","outdoor","hand-eye","turn-taking","coordination"], fam:"cornhole",
    price:69, asin:null, afflink:"https://link.amazon/B08ckB90K", img:"https://m.media-amazon.com/images/I/61fR27mq97L._AC_SL1500_.jpg",
    note:"The same bean bag toss fun at a friendlier price. Everyone can join in, including the grandparents.",
    search:"cornhole bean bag toss set kids budget"
  },
  {
    id:"p280", name:"Throw & Catch Game Set (Paddle & Ball)", age_min:36, age_max:144,
    dev_areas:["gross","social"], tags:["sports","outdoor","hand-eye","coordination","bilateral"],
    price:25, asin:null, afflink:"https://link.amazon/B0fmhyFhJ", img:"https://m.media-amazon.com/images/I/81MnIuR6o-L._AC_SL1500_.jpg",
    note:"The catch mitts give a big surface area, so little ones learning to catch actually succeed. A fun, forgiving way to build throwing and catching for any age.",
    search:"throw catch game set paddle ball kids"
  },
  {
    id:"p281", name:"Gymnastics Tumbling Mat", age_min:48, age_max:144,
    dev_areas:["gross","sensory"], tags:["sports","gymnastics","movement","proprioceptive","heavy-work","balance"],
    price:132, asin:null, afflink:"https://link.amazon/B0bXvqh4d", img:"https://m.media-amazon.com/images/I/61quw4sWayL._AC_SL1500_.jpg",
    note:"A padded mat that makes cartwheels, rolls and handstands safe to practise at home. Wonderful for the child who is always tumbling, and the landing surface gives peace of mind.",
    search:"kids gymnastics tumbling mat folding"
  },
  {
    id:"p282", fam:"crash-pad", name:"Sensory Crash Pad (Large)", age_min:36, age_max:144,
    dev_areas:["sensory","gross"], tags:["sports","proprioceptive","deep-pressure","heavy-work","sensory","movement"],
    price:145, asin:null, afflink:"https://link.amazon/B08L9MFbR", img:"https://m.media-amazon.com/images/I/71nrU-d2rqL._AC_SL1500_.jpg",
    note:"Made for jumping and crashing into. One for kids who go looking for a heavy landing. Pair it with something safe to climb and jump off.",
    search:"sensory crash pad kids large proprioceptive"
  },
  {
    id:"p283", name:"Adjustable Basketball Hoop", age_min:60, age_max:144,
    dev_areas:["gross","social"], tags:["sports","outdoor","hand-eye","coordination","throwing"],
    price:139, asin:null, afflink:"https://link.amazon/B00ae7Uec", img:"https://m.media-amazon.com/images/I/61hDmLa1F8L._AC_SL1500_.jpg",
    note:"Shooting hoops in the driveway, and the height adjusts as they grow. One for the kid who throws everything anyway.",
    search:"kids adjustable basketball hoop outdoor"
  },
  {
    id:"p284", name:"Lehoo Castle Wooden Train Set", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","social","language"], tags:["trains","vehicles","constructive","pretend-play"], fam:"train-set",
    price:50, asin:null, afflink:"https://link.amazon/B0bJskZ7b", img:"https://m.media-amazon.com/images/I/81BVQzMPE7L._AC_SL1500_.jpg",
    note:"A lovely combination of trains and construction. I love sets like this with pieces to build a whole story rather than just a track, because they open up such rich pretend play.",
    search:"Lehoo Castle wooden train set construction kids"
  },
  {
    id:"p285", name:"Lehoo Castle Wooden Train Set (Fantasy)", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","social","language"], tags:["trains","vehicles","constructive","pretend-play"], fam:"train-set",
    price:39.99, asin:null, afflink:"https://link.amazon/B0hgWf7S3", img:"https://m.media-amazon.com/images/I/716SIjBLrML._AC_SL1500_.jpg",
    note:"Trains and construction together, perfect for building a whole fantasy world with princesses and unicorns. Sets with story pieces like this spark so much more pretend play than a track alone.",
    search:"Lehoo Castle wooden train set princesses unicorns"
  },
  {
    id:"p286", name:"60PCS Wooden Train Set", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","social"], tags:["trains","vehicles","constructive","pretend-play","magnetic"], fam:"train-set",
    price:53, asin:null, afflink:"https://link.amazon/B0gqnEyV5", img:"https://m.media-amazon.com/images/I/81rTOPPP6iL._AC_SL1500_.jpg",
    note:"Trains and construction in one, with fun magnetic pieces added to the mix. Building the story alongside the track makes for really rich, open-ended pretend play.",
    search:"60 piece wooden train set magnetic kids"
  },
  {
    id:"p287", name:"110PCS Montessori Wooden Train Set", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","social","language"], tags:["trains","vehicles","constructive","pretend-play"], fam:"train-set",
    price:72, asin:null, afflink:"https://link.amazon/B0hFaIL2N", img:"https://m.media-amazon.com/images/I/91e3Z50M2GL._AC_SL1500_.jpg",
    note:"This is the ultimate set. If you want to get the lot, this is the one. I absolutely love that you can build a whole town to play out, so the possibilities really are endless.",
    search:"110 piece Montessori wooden train set town kids"
  },
  // Added Oct 2026 from Amazon AU research: 100+ ratings and 4.4 stars or more.
  {
    id:"p288", fam:"slime-kit", name:"Elmer's Glow in the Dark Slime Kit", age_min:72, age_max:120,
    dev_areas:["fine","sensory"], tags:["craft","slime","messy","tactile","creative"],
    price:20, asin:"B07GWTGGH1", afflink:"https://www.amazon.com.au/dp/B07GWTGGH1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81gKxIeV5WL._AC_SL1500_.jpg",
    note:"Everything to make your own glow-in-the-dark slime. They measure, mix and squish it, then turn the lights off to see it glow.",
    search:"Elmers glow in the dark slime kit"
  },
  {
    id:"p289", fam:"slime-kit", name:"Galt Slime Lab Science Kit", age_min:84, age_max:144,
    dev_areas:["fine","cognitive"], tags:["slime","messy","science","experiments","STEM"],
    price:14.9, asin:"B06XRGR78J", afflink:"https://www.amazon.com.au/dp/B06XRGR78J/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/610nUthzBrL._AC_SL1080_.jpg",
    note:"A small science kit for making slime. They follow the steps, mix a batch and see what changes when they add more or less.",
    search:"Galt slime lab science kit"
  },
  {
    id:"p290", fam:"unicorn-craft", name:"Skillmatics Aqua Puffs Unicorns Craft Kit", age_min:48, age_max:120,
    dev_areas:["fine"], tags:["craft","art","creative","unicorn"],
    price:34.99, asin:"B0F9WFBTP5", afflink:"https://www.amazon.com.au/dp/B0F9WFBTP5/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/813jv0gP7UL._AC_SL1500_.jpg",
    note:"A unicorn craft kit with lots of small pieces to place. They follow the picture and end up with something to show off.",
    search:"Skillmatics Aqua Puffs unicorns craft kit"
  },
  {
    id:"p291", fam:"unicorn-craft", name:"4M Mould & Paint Unicorns", age_min:60, age_max:144,
    dev_areas:["fine"], tags:["craft","art","creative","unicorn"],
    price:19.99, asin:"B0772VFWTN", afflink:"https://www.amazon.com.au/dp/B0772VFWTN/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71hcH4+mkoL._AC_SL1500_.jpg",
    note:"Pour plaster into the unicorn moulds, let it set, pop them out and paint them. A grown-up helps with the plaster mixing.",
    search:"4M mould and paint unicorns"
  },
  {
    id:"p292", fam:"unicorn-craft", name:"Skillmatics Storybook Art Kit: Unicorns & Princesses", age_min:60, age_max:120,
    dev_areas:["fine","language"], tags:["craft","art","creative","storytelling","unicorn"],
    price:34.99, asin:"B0CMH9HN74", afflink:"https://www.amazon.com.au/dp/B0CMH9HN74/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81SPy05b3kL._AC_SL1500_.jpg",
    note:"An art kit that goes with a unicorn and princess story. They make the pictures as the story goes along.",
    search:"Skillmatics storybook art kit unicorns princesses"
  },
  {
    id:"p293", fam:"toilet-seat", name:"Potty Training Seat with Step Stool Ladder (Befol)", age_min:24, age_max:48,
    dev_areas:["selfcare"], tags:["selfcare","independence","life-skills","toileting"],
    price:49.98, asin:"B0CC5SR4FV", afflink:"https://www.amazon.com.au/dp/B0CC5SR4FV/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61IXNWGZBML._AC_SL1500_.jpg",
    note:"A smaller seat with a little ladder that sits on your own toilet. They climb up by themselves and their feet have somewhere to rest.",
    search:"potty training seat step stool ladder toilet toddler"
  },
  {
    id:"p294", fam:"toilet-seat", name:"Potty Training Seat with Step Stool Ladder (Fedicelly)", age_min:24, age_max:48,
    dev_areas:["selfcare"], tags:["selfcare","independence","life-skills","toileting"],
    price:45.98, asin:"B0H72LQ8YZ", afflink:"https://www.amazon.com.au/dp/B0H72LQ8YZ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61w2s0qV-NL._AC_SL1254_.jpg",
    note:"A toddler seat and step ladder for the big toilet. They climb up on their own instead of being lifted.",
    search:"potty training seat step stool ladder toilet toddler"
  },
  {
    id:"p295", fam:"potty-book", name:"No More Nappies: A Potty-Training Book", age_min:24, age_max:36,
    dev_areas:["language","selfcare"], tags:["books","toileting","selfcare","storytelling"],
    price:6, asin:"1509836314", afflink:"https://www.amazon.com.au/dp/1509836314/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81fZHA1dDhL._SL1500_.jpg",
    note:"A board book about using the potty, with Aussie and UK words like nappies. Read it together before you start and while it's happening.",
    search:"no more nappies potty training board book toilet"
  },
  {
    id:"p296", fam:"potty-book", name:"Ms Rachel: Potty Time with Bean", age_min:12, age_max:36,
    dev_areas:["language","selfcare"], tags:["books","toileting","selfcare","storytelling"],
    price:10, asin:"0241764394", afflink:"https://www.amazon.com.au/dp/0241764394/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81DM1WsVm8L._SL1500_.jpg",
    note:"A Ms Rachel board book about Bean learning to use the potty. A familiar face for toddlers who already know her.",
    search:"Ms Rachel potty time with Bean board book toilet"
  },
  {
    id:"p297", fam:"potty-book", name:"Let's Go to the Potty!", age_min:12, age_max:36,
    dev_areas:["language","selfcare"], tags:["books","toileting","selfcare","storytelling"],
    price:13.5, asin:"1646119932", afflink:"https://www.amazon.com.au/dp/1646119932/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81QedS+0+CL._SL1500_.jpg",
    note:"A picture book that goes through each step of using the potty, one page at a time.",
    search:"lets go to the potty picture book toilet"
  },
  {
    id:"p298", fam:"potty-chart", name:"Hey Duggee: My Potty Badge Sticker Activity Book", age_min:24, age_max:72,
    dev_areas:["selfcare","fine"], tags:["toileting","selfcare","independence"],
    price:11.7, asin:"140595146X", afflink:"https://www.amazon.com.au/dp/140595146X/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81B5ud3S7tL._SL1500_.jpg",
    note:"A Hey Duggee sticker book for keeping track of potty goes. They add a sticker each time and can see the page filling up.",
    search:"Hey Duggee potty badge sticker activity book toilet"
  },
  {
    id:"p299", fam:"potty-chart", name:"Toilet Training Chart with Stickers (PUTSKA)", age_min:24, age_max:48,
    dev_areas:["selfcare"], tags:["toileting","selfcare","independence"],
    price:14.99, asin:"B08H8P66CQ", afflink:"https://www.amazon.com.au/dp/B08H8P66CQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81I-qUz2cxL._AC_SL1500_.jpg",
    note:"A toilet chart and stickers to track how it's going. They pop a sticker on each time they go, and you can both see it.",
    search:"toilet training potty chart stickers tracking"
  },
  {
    id:"p300", name:"Tangle Jr. Fuzzies", age_min:72, age_max:144,
    dev_areas:["fine","sensory"], tags:["fidget","tactile","sensory","fine-motor"],
    price:19.99, asin:"B000S0TOS6", afflink:"https://www.amazon.com.au/dp/B000S0TOS6/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51LyhAR90JL._AC_SL1000_.jpg",
    note:"A twisty fidget with a soft fuzzy coating. It turns and loops in one hand and makes no noise, so it fits in a pocket at school.",
    search:"Tangle Jr fuzzies fidget"
  },
  {
    id:"p301", fam:"putty", name:"Crazy Aaron's Thinking Putty Mini Tin (Glow)", age_min:72, age_max:144,
    dev_areas:["fine","sensory"], tags:["fidget","tactile","sensory","hand-strength"],
    price:19, asin:"B07G8PC54S", afflink:"https://www.amazon.com.au/dp/B07G8PC54S/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71rrsPaEaiL._AC_SL1399_.jpg",
    note:"A small tin of putty that glows after time in the light. Stretch it, squash it, roll it. Small enough for a school bag.",
    search:"Crazy Aarons thinking putty mini tin glow"
  },
  {
    id:"p302", fam:"chew", name:"Sensory Chew Necklaces (9-Pack)", age_min:72, age_max:144,
    dev_areas:["sensory"], tags:["fidget","chew","sensory","tactile"],
    price:28.9, asin:"B0956YQS97", afflink:"https://www.amazon.com.au/dp/B0956YQS97/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/615SxoQ6nZS._AC_SL1500_.jpg",
    note:"Silicone necklaces made for chewing. Nine in the pack, so there's one for home, one for the school bag and spares.",
    search:"chew necklace silicone chewable kids"
  },
  {
    id:"p303", fam:"bedtime-book", name:"Ten Minutes to Bed: Little Dragon", age_min:24, age_max:72,
    dev_areas:["language"], tags:["books","storytelling","bedtime"],
    price:15.99, asin:"0241464374", afflink:"https://www.amazon.com.au/dp/0241464374/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/91R2d5MD33L._SL1500_.jpg",
    note:"A bedtime story about a little dragon who counts down the ten minutes to bed. Good to read once they're already in bed.",
    search:"ten minutes to bed little dragon bedtime book"
  },
  {
    id:"p304", fam:"night-light", name:"Silicone Touch Night Light", age_min:24, age_max:96,
    dev_areas:["sensory","selfcare"], tags:["bedtime","visual","independence"],
    price:22.94, asin:"B08T6D2724", afflink:"https://www.amazon.com.au/dp/B08T6D2724/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61TV8Aeo5+L._AC_SL1500_.jpg",
    note:"A soft silicone night light they can tap on and off themselves. Rechargeable, so there's no cord by the bed.",
    search:"silicone touch night light kids rechargeable"
  },
  {
    id:"p305", fam:"night-light", name:"Duck Silicone Night Light", age_min:24, age_max:96,
    dev_areas:["sensory","selfcare"], tags:["bedtime","visual","independence","animals"],
    price:23.39, asin:"B09135CFSF", afflink:"https://www.amazon.com.au/dp/B09135CFSF/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61ifUtHpWZL._AC_SL1500_.jpg",
    note:"A duck-shaped silicone night light. Tap it to turn it on. Rechargeable.",
    search:"duck silicone night light kids rechargeable"
  },
  {
    id:"p306", fam:"night-light", name:"Dreamegg Ok-to-Wake Clock with Night Light", age_min:24, age_max:72,
    dev_areas:["selfcare"], tags:["bedtime","independence","visual"],
    price:79.99, asin:"B0DHK56XRP", afflink:"https://www.amazon.com.au/dp/B0DHK56XRP/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71J1Wag4GLL._AC_SL1500_.jpg",
    note:"An ok-to-wake clock with a night light and white noise. The light shows them when it's time to get up, so they can check it themselves.",
    search:"Dreamegg ok to wake sleep trainer clock night light"
  },
  {
    id:"p307", fam:"bluey-bath", name:"Tomy Toomies Bluey Family Bath Pourers", age_min:18, age_max:36,
    dev_areas:["sensory","fine"], tags:["water","bath","pouring","bluey","pretend-play"],
    price:18, asin:"B0CP3WV78W", afflink:"https://www.amazon.com.au/dp/B0CP3WV78W/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61+b-xbwGfL._AC_SL1500_.jpg",
    note:"Bluey and her family as bath pourers. Fill them, tip them and watch where the water goes.",
    search:"Toomies Bluey family pourers bath"
  },
  {
    id:"p308", fam:"bluey-bath", name:"Bluey Shower & Scrub Bath Toy", age_min:18, age_max:48,
    dev_areas:["sensory","selfcare"], tags:["water","bath","bluey","pretend-play"],
    price:22.95, asin:"B0F6Y4ZG7F", afflink:"https://www.amazon.com.au/dp/B0F6Y4ZG7F/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61FY6gpZ8qL._AC_SL1500_.jpg",
    note:"A Bluey bath set for washing and scrubbing in the tub, with Bluey along for bath time.",
    search:"Bluey shower scrub bath toy"
  },
  {
    id:"p309", fam:"bluey-plush", name:"Bingo & Bluey Plush 2-Pack", age_min:36, age_max:72,
    dev_areas:["social","language"], tags:["plush","dolls","bluey","pretend-play"],
    price:32.77, asin:"B08GYCRTL4", afflink:"https://www.amazon.com.au/dp/B08GYCRTL4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/814QEZpMDSL._AC_SL1500_.jpg",
    note:"Soft Bluey and Bingo. For cuddles, bedtime and playing out their favourite episodes.",
    search:"Bluey Bingo plush 2 pack"
  },
  {
    id:"p310", name:"Bluey Family Figure 4-Pack", age_min:36, age_max:72,
    dev_areas:["social","language"], tags:["bluey","pretend-play","small-world","storytelling"],
    price:19, asin:"B083XNCRS3", afflink:"https://www.amazon.com.au/dp/B083XNCRS3/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/91tKWhd87gL._AC_SL1500_.jpg",
    note:"Bluey, Bingo, Bandit and Chilli figures. Small enough to carry around and act out their own episodes.",
    search:"Bluey family figure 4 pack"
  },
  {
    id:"p311", fam:"wiggles-dress-up", name:"The Wiggles Yellow Wiggle Deluxe Costume", age_min:24, age_max:60,
    dev_areas:["gross","social"], tags:["pretend-play","role-play","music","dance"],
    price:29.85, asin:"B0F799VTPG", afflink:"https://www.amazon.com.au/dp/B0F799VTPG/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51ao+SshulL._AC_SL1500_.jpg",
    note:"The yellow Wiggle costume. Put the songs on and do the moves together.",
    search:"The Wiggles yellow wiggle costume dress up"
  },
  {
    id:"p312", fam:"wiggles-dress-up", name:"The Wiggles Yellow Wiggle Headband & Bows", age_min:36, age_max:60,
    dev_areas:["gross","social"], tags:["pretend-play","role-play","music","dance"],
    price:11.99, asin:"B076HNLSKV", afflink:"https://www.amazon.com.au/dp/B076HNLSKV/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/816esms57AL._AC_SL1500_.jpg",
    note:"A yellow Wiggle headband and shoe bows. A quick dress-up for dancing along to the songs.",
    search:"The Wiggles yellow wiggle headband shoe bows dress up"
  },
  {
    id:"p313", name:"Wild Republic Mako Shark Plush", age_min:36, age_max:84,
    dev_areas:["social","language"], tags:["plush","animals","pretend-play"],
    price:14.95, asin:"B07BZVMCX4", afflink:"https://www.amazon.com.au/dp/B07BZVMCX4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71-Kzk0-ieL._AC_SL1500_.jpg",
    note:"A soft mako shark. For cuddles and for the shark games they make up.",
    search:"Wild Republic mako shark plush ocean"
  },
  {
    id:"p314", name:"Realistic Shark Bath Figures (6 Pack)", age_min:36, age_max:84,
    dev_areas:["language","sensory"], tags:["animals","water","bath","small-world","pretend-play"],
    price:23.99, asin:"B07RV6SQ9G", afflink:"https://www.amazon.com.au/dp/B07RV6SQ9G/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71iBH9uNszL._AC_SL1500_.jpg",
    note:"Six realistic shark figures. Into the bath, the sandpit or a tub of water for their own ocean.",
    search:"shark figures bath toys realistic ocean"
  },
  {
    id:"p315", name:"Mudpuppy Go Shark! Card Game", age_min:48, age_max:84,
    dev_areas:["social","cognitive"], tags:["card-game","turn-taking","animals"],
    price:17.42, asin:"0735377375", afflink:"https://www.amazon.com.au/dp/0735377375/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81SWtzpP4OL._AC_SL1500_.jpg",
    note:"A shark card game for a small group. Taking turns, asking for cards and waiting for the shark.",
    search:"Mudpuppy Go Shark card game ocean"
  },
  {
    id:"p316", name:"Hot Wheels Shark Chomp Transporter", age_min:48, age_max:96,
    dev_areas:["fine","cognitive"], tags:["vehicles","animals","pretend-play"],
    price:19.95, asin:"B08J4H1VYP", afflink:"https://www.amazon.com.au/dp/B08J4H1VYP/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Mb53tpCnL._AC_SL1500_.jpg",
    note:"A Hot Wheels truck shaped like a shark that chomps the cars. Comes with one car.",
    search:"Hot Wheels shark chomp transporter"
  },
  {
    id:"p317", fam:"jigsaw", name:"Peaceable Kingdom Shiny Shark Floor Puzzle (53pc)", age_min:60, age_max:84,
    dev_areas:["cognitive","fine"], tags:["jigsaw","puzzle","animals","problem-solving"],
    price:26, asin:"B09J5GCK67", afflink:"https://www.amazon.com.au/dp/B09J5GCK67/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71J0Ze+cAWL._AC_SL1500_.jpg",
    note:"A 53-piece floor puzzle of sharks with shiny bits. Big enough to spread out across the floor.",
    search:"Peaceable Kingdom shiny shark floor puzzle ocean"
  },
  {
    id:"p318", fam:"scarves", name:"Juggling Scarves for Kids", age_min:48, age_max:108,
    dev_areas:["gross"], tags:["throwing","hand-eye","coordination","movement","dance"],
    price:12.59, asin:"B07197RSHB", afflink:"https://www.amazon.com.au/dp/B07197RSHB/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61hrmq97pbL._AC_SL1001_.jpg",
    note:"Light scarves that float down slowly, so there's time to catch them. Throw one and catch it, then try two.",
    search:"juggling scarves kids dance catching"
  },
  {
    id:"p319", fam:"scarves", name:"Novelty Place Juggling & Dance Scarves (12pc)", age_min:48, age_max:108,
    dev_areas:["gross"], tags:["throwing","hand-eye","coordination","movement","dance"],
    price:17.95, asin:"B07V1SQR46", afflink:"https://www.amazon.com.au/dp/B07V1SQR46/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71AiB+1qDfL._AC_SL1500_.jpg",
    note:"Twelve floaty scarves for catching, waving and dancing. Enough for the whole family to join in.",
    search:"juggling scarves dance kids 12 pack"
  },
  {
    id:"p320", fam:"catch-set", name:"Sticky Paddle Toss and Catch Set", age_min:36, age_max:108,
    dev_areas:["gross","social"], tags:["throwing","hand-eye","coordination","turn-taking","outdoor"],
    price:23.86, asin:"B0DHLFVML4", afflink:"https://www.amazon.com.au/dp/B0DHLFVML4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71qp1C1U8YL._AC_SL1500_.jpg",
    note:"Paddles and soft balls that stick where they land. Throw to each other and catch on the paddle instead of with hands.",
    search:"toss and catch sticky paddle ball set"
  },
  {
    id:"p321", fam:"catch-set", name:"Jalunth Sticky Paddle Ball Catch Set", age_min:36, age_max:144,
    dev_areas:["gross","social"], tags:["throwing","hand-eye","coordination","turn-taking","outdoor"],
    price:19.23, asin:"B08QRW7XV3", afflink:"https://www.amazon.com.au/dp/B08QRW7XV3/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81nbIMuKK4L._AC_SL1500_.jpg",
    note:"Sticky paddles and balls for throwing and catching with a partner, inside or out.",
    search:"sticky paddle ball catch set"
  },
  {
    id:"p322", name:"Large Soft Foam Ball (7 inch, quiet)", age_min:48, age_max:108,
    dev_areas:["gross"], tags:["throwing","hand-eye","gross-motor","movement"],
    price:13.99, asin:"B0B3SXB72N", afflink:"https://www.amazon.com.au/dp/B0B3SXB72N/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61Ga86j6lyL._AC_SL1500_.jpg",
    note:"A big soft foam ball that's quiet when it bounces. A bigger ball to catch, and fine to use inside.",
    search:"soft foam ball quiet 7 inch kids"
  },
  {
    id:"p323", fam:"night-light", name:"Kids Ok-to-Wake Clock", age_min:24, age_max:72,
    dev_areas:["selfcare"], tags:["bedtime","independence","visual"],
    price:64.31, asin:"B09MDQNJ36", afflink:"https://www.amazon.com.au/dp/B09MDQNJ36/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51w44TOkN1L._AC_SL1200_.jpg",
    note:"A clock that changes colour when it's time to get up. They check the clock themselves instead of calling out to you. Ships from the US.",
    search:"ok to wake clock kids toddler sleep trainer"
  },
  {
    id:"p324", name:"Tonies The Wiggles: Dorothy the Dinosaur", age_min:36, age_max:72,
    dev_areas:["language"], tags:["music","audio","wiggles","dinosaurs"],
    price:60.87, asin:"B0GQKCJTNC", afflink:"https://www.amazon.com.au/dp/B0GQKCJTNC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71VHqOKSlgL._AC_SL1500_.jpg",
    note:"A Dorothy the Dinosaur Tonie with Wiggles songs on it. It only plays on a Toniebox, so this one is for families who already have the player.",
    search:"Tonies The Wiggles Dorothy the Dinosaur"
  },
];

// ─── QUIZ STEPS ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    id:"recipient",
    question:"Who are you finding toys for?",
    subtitle:"",
    type:"single",
    options:[
      {value:"my-child", label:"My own child"},
      {value:"family",   label:"A grandchild, niece, nephew or family member"},
      {value:"friend",   label:"A friend's child"},
      {value:"other",    label:"Another special kid in my life"},
    ],
  },
  {
    id:"child_age",
    question:"How old is your child?",
    subtitle:"Don't worry, this is not purely about age. We will also look at your child's interests, abilities and the goals you care about to find the right fit. Age is just our starting point.",
    type:"single",
    options:[
      {value:2,  label:"0 to 3 months",          emoji:"🌱"},
      {value:4,  label:"4 to 6 months",           emoji:"🐛"},
      {value:7,  label:"7 to 12 months",          emoji:"🐣"},
      {value:13, label:"12 to 18 months",         emoji:"🐥"},
      {value:19, label:"18 months to 2 years",    emoji:"🐦"},
      {value:24, label:"2 years old",             emoji:"🌿"},
      {value:42, label:"3 to 4 years",            emoji:"🌻"},
      {value:54, label:"4 to 5 years",            emoji:"⭐"},
      {value:66, label:"5 to 6 years",            emoji:"🚀"},
      {value:84, label:"6 to 8 years",            emoji:"🦋"},
      {value:108,label:"8 to 10 years",           emoji:"🎯"},
    ],
  },
  {
    id:"occasion",
    question:"What are you shopping for?",
    subtitle:"Pick any that apply.",
    type:"multi",
    options:[
      {value:"birthday",           label:"Birthday gift",                        emoji:"🎂"},
      {value:"christmas",          label:"Christmas",                            emoji:"🎄"},
      {value:"christmas-stocking", label:"Christmas stocking fillers (under $20)",emoji:"🧦"},
      {value:"everyday",           label:"Just looking for good play ideas",     emoji:"🧸"},
      {value:"gift-from-someone",  label:"Giving ideas to a relative or friend", emoji:"🎁"},
      {value:"therapy-support",    label:"Supporting specific development goals", emoji:"💛"},
    ],
  },
  {
    id:"budget",
    question:"What's your budget?",
    subtitle:"No judgement either way. I'll work with what you've got.",
    type:"single",
    options:[
      {value:"under-20",  label:"Under $20"},
      {value:"20-50",     label:"$20 to $50"},
      {value:"50-100",    label:"$50 to $100"},
      {value:"100-plus",  label:"$100 or more"},
      {value:"mix",       label:"A mix of smaller and bigger-ticket toys"},
      {value:"no-limit",  label:"Just give me the most accurate picks"},
    ],
  },
  {
    id:"child_snapshot",
    question:"Tell me about your child right now",
    subtitle:"What are they obsessed with? Favourite toys, characters or activities? How do they like to play: physical, creative, focused, social? Any skills or goals you're working on? The more you share, the better the match.",
    type:"text",
    optional:true,
    optionalNote:"Optional. The more you write here, the closer the picks will be.",
  },
  {
    id:"interests",
    question:"What does your child love?",
    subtitle:"Tick everything that applies. This directly shapes what I suggest.",
    type:"multi",
    options:[
      {value:"baby-discovery",label:"Watching, reaching and grabbing everything 👶", maxAge:19},
      {value:"animals",       label:"Animals and creatures 🐾"},
      {value:"vehicles",      label:"Cars, trucks and trains 🚂", minAge:13},
      {value:"dinosaurs",     label:"Dinosaurs 🦕", minAge:19},
      {value:"building",      label:"Building and making things 🏗️", minAge:13},
      {value:"pretend-play",  label:"Pretend play and role play 👑", minAge:13},
      {value:"dolls",         label:"Dolls and soft toys 🍼", minAge:13},
      {value:"movement",      label:"Running, jumping, climbing, outdoor play 🏃", minAge:13},
      {value:"sports",        label:"Sports and ball games ⚽", minAge:19},
      {value:"gymnastics",    label:"Gymnastics, tumbling and cartwheels 🤸", minAge:36},
      {value:"art",           label:"Drawing, painting and crafts 🎨", minAge:13},
      {value:"music",         label:"Music, singing and dancing 🎵"},
      {value:"stories",       label:"Books and stories 📚"},
      {value:"puzzles",       label:"Puzzles and figuring things out 🧩", minAge:18},
      {value:"games",         label:"Board games and card games 🎲", minAge:30},
      {value:"water",         label:"Water, slime and messy play 💧"},
      {value:"science",       label:"Science, experiments and how things work 🔬", minAge:30},
      {value:"not-sure",      label:"Not sure yet, surprise me! ✨"},
    ],
  },
  {
    id:"dev_focus",
    question:"Any development areas you'd love to support?",
    subtitle:"As an OT I always think about the why behind a toy. Pick anything that feels relevant, or just select the last option if you're not sure.",
    type:"multi",
    options:[
      {value:"gross",         label:"Gross motor: movement, strength, coordination 🤸"},
      {value:"fine",          label:"Fine motor: hand strength, grip, finger skills ✍️"},
      {value:"language",      label:"Communication and language 💬"},
      {value:"cognitive",     label:"Problem-solving and learning 🧠"},
      {value:"social",        label:"Social skills, turn-taking and emotional regulation 🤝"},
      {value:"sensory",       label:"Sensory play and exploration 🌈"},
      {value:"sensory-tools", label:"Sensory tools and regulation supports 🧩"},
      {value:"selfcare",      label:"Self-care and independence 🙌"},
      {value:"no-preference", label:"Just want great, engaging play 🎉"},
    ],
  },
  {
    id:"play_style",
    question:"How does your child like to play?",
    subtitle:"Helps me find toys they'll actually use.",
    type:"multi",
    options:[
      {value:"exploring-mouthing",    label:"Exploring with hands and mouth 👶", maxAge:19},
      {value:"watching-listening",    label:"Watching, listening and taking it all in 👀", maxAge:30},
      {value:"independent",           label:"Happy to play independently for stretches 🧍"},
      {value:"with-adults",           label:"Loves playing with a grown-up 🧑‍🤝‍🧑"},
      {value:"with-siblings-friends", label:"Loves playing with other kids 👯"},
      {value:"active-physical",       label:"Always moving, can't sit still 🏃"},
      {value:"calm-focused",          label:"Gets absorbed in calm, focused activities 🧘"},
      {value:"open-ended",            label:"Gets creative with open-ended toys 🎭"},
      {value:"structured",            label:"Likes toys with clear rules or a goal 🎯", minAge:30},
      {value:"not-sure",              label:"Not sure 🤷"},
    ],
  },
  {
    id:"already_have",
    question:"Anything you already have plenty of?",
    subtitle:"Tell me what to avoid so I don't suggest more of the same.",
    type:"multi",
    options:[
      {value:"blocks-tiles",   label:"Blocks, magnetic tiles or Lego"},
      {value:"puzzles",        label:"Puzzles"},
      {value:"books",          label:"Books"},
      {value:"craft-supplies", label:"Art and craft supplies"},
      {value:"outdoor-toys",   label:"Outdoor play equipment"},
      {value:"pretend-play",   label:"Pretend play toys (kitchen, dress-ups etc.)"},
      {value:"board-games",    label:"Board games and card games"},
      {value:"vehicles-already",label:"Cars, trucks and vehicles"},
      {value:"dolls-already",  label:"Dolls and soft toys"},
      {value:"dinosaurs-already",label:"Dinosaur toys"},
      {value:"sensory-fidget", label:"Fidget and sensory toys"},
      {value:"stem-already",   label:"Science and STEM kits"},
      {value:"nothing",        label:"Nothing, all suggestions welcome"},
    ],
  },
  {
    id:"wildcard",
    question:"Anything else I should know?",
    subtitle:"",
    type:"text",
    placeholder:"e.g. He's sensitive to loud noises so we avoid things that beep a lot. She gets overwhelmed by too many small pieces...",
    optional:true,
  },
];

const DEV_LABELS  = {gross:"Gross Motor",fine:"Fine Motor",cognitive:"Cognitive",language:"Language",social:"Social-Emotional",sensory:"Sensory",selfcare:"Self-Care"};
const DEV_COLOURS = {gross:K_ORANGE,fine:K_BLUE,cognitive:"#9C6FDE",language:K_GREEN,social:K_YELLOW,sensory:K_PINK,selfcare:"#6BCB77"};
// Imports can carry areas the page has no label for. "Regulation" folds into
// sensory (it is never shown as a label, it reads as a claim), and anything
// else without a label is dropped, so no card shows a blank chip.
PRODUCTS.forEach(p=>{p.dev_areas=[...new Set((p.dev_areas||[]).map(a=>a==="regulation"?"sensory":a))].filter(a=>DEV_LABELS[a]);});
// A few tags from the October import that pull toys into the wrong interests.
{const fix={p352:{drop:["art","craft","creative"]},p386:{drop:["animals"],add:["movement","gross"]}};
  PRODUCTS.forEach(p=>{const f=fix[p.id];if(!f)return;p.tags=[...new Set(p.tags.filter(t=>!(f.drop||[]).includes(t)).concat(f.add||[]))];});}
// The chips on a card: the areas this parent picked come first, then the rest,
// and never more than three, so a busy board doesn't claim to do everything.
function chipAreas(toy,answers){
  const goals=new Set((answers.dev_focus||[]).map(g=>g==="sensory-tools"?"sensory":g));
  const areas=(toy.dev_areas||[]).filter(a=>DEV_LABELS[a]);
  // It's a toy guide, so clinical-sounding areas only show when the parent picked them.
  const quiet=new Set(["sensory","selfcare","regulation"]);
  const hit=areas.filter(a=>goals.has(a));
  const rest=areas.filter(a=>!goals.has(a)&&!quiet.has(a));
  const out=[...hit,...rest].slice(0,hit.length?3:2);
  return out.length?out:areas.slice(0,1);
}

function fmtPrice(n){const v=Number(n)||0;return Number.isInteger(v)?String(v):v.toFixed(2);}
function budgetLine(b){
  const map={"under-20":"Each pick is under $20.","20-50":"Each pick is under $50, priced per toy, not in total.","50-100":"Each pick is under $100, priced per toy, not in total.","100-plus":"Picks start from $100, priced per toy.","mix":"A mix of price points, a couple of smaller things and something bigger."};
  return map[b]||"";
}
function parseBudget(b){
  if(b==="under-20")return[0,20];if(b==="20-50")return[20,50];
  if(b==="50-100")return[50,100];if(b==="100-plus")return[100,999];if(b==="mix")return[0,9999];
  return[0,9999];
}


// Convert stored months value to the friendly age label used in the quiz
// Q5's example has to match the age the parent just picked, or it reads as
// written for someone else's child.
function snapshotPlaceholder(months){
  const m = Number(months);
  if(!m) return "e.g. She's into animals and anything musical. Happiest outside. Gets frustrated when something is too tricky...";
  if(m <= 7)  return "e.g. She's just started rolling and grabs at everything. Loves being sung to. Mouths every single toy so nothing small...";
  if(m <= 12) return "e.g. He's crawling everywhere and pulling up on the furniture. Loves peek-a-boo. Still mouths most things so nothing small...";
  if(m <= 24) return "e.g. He's completely obsessed with trains and anything with wheels. Just started walking. Loves being outside and has about 20 words. Still mouths a lot of toys so nothing too small...";
  if(m <= 54) return "e.g. She's into dinosaurs and drawing. Will play on her own for a while but gets frustrated when something is tricky. Loves being read to at bedtime...";
  if(m <= 84) return "e.g. He's big on Lego and soccer. Takes a while to settle after school. Prefers things with a clear goal over open-ended play...";
  return "e.g. She's into craft and anything she can make herself. Reads a lot. Gets bored with toys quickly so it has to hold her attention...";
}

function ageLabel(months){
  const map={2:"0 to 3 months",4:"4 to 6 months",7:"7 to 12 months",13:"12 to 18 months",19:"18 months to 2 years",24:"2 years old",42:"3 to 4 years",54:"4 to 5 years",66:"5 to 6 years",84:"6 to 8 years",108:"8 to 10 years"};
  return map[months]||(months+" months");
}


// Detect when a parent's description suggests developmental delays or additional needs.
// When present, toys rated for younger ages become eligible (gently penalised so
// age-typical options still lead when equally relevant). The age MINIMUM is never
// relaxed: a toy rated older than the child is never suggested, for safety.
function hasDelaySignals(answers){
  const text=((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();
  // Only DEFINITE indicators relax the age ceiling. Everyday phrases like
  // "not talking yet" are normal toddler descriptions and must NOT trigger this.
  return /(develop\w*\s+delay|developmental(ly)?\s+delayed|global\s+delay|\bgdd\b|delay(ed)?\s+(in|with)\s|non[\s-]?verbal|autis|\basd\b|down\s+syndrome|disabilit|intellectual\s+disab|cerebral\s+palsy|special\s+needs|\bndis\b|regressi)/i.test(text);
}

// A parent telling us the child still mouths things, or asking for nothing small,
// is a choking-risk instruction. It is the one free-text signal that must change
// what we suggest rather than just how we describe it.
function hasMouthingSignals(answers){
  const text=((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();
  // "mouth" on its own is not enough. An Australian parent saying their kid has a
  // big mouth on them is describing a talker, not a choking risk.
  const mouths=/(in\s+(his|her|their|its|the)\s+mouth|mouths?\s+(everything|things|toys|them|it|anything)|mouthing\b|still\s+mouths?\b|chew(s|ing)?\s+(on\s+)?(everything|things|toys|anything|his|her|their|my|the|clothes|sleeves?|shirts?|collars?|pencils?)|bit(es|ing)\s+(everything|things|toys)|swallow)/i.test(text);
  const noSmall=/(no(thing)?\s+(with\s+)?(tiny|small|little)\s+(piece|part|bit)s?|avoid\s+(tiny|small)\s+(piece|part)s?|too\s+many\s+small\s+pieces|choking|chok(e|ing)\s+hazard|small\s+parts?\s+(risk|worry|concern))/i.test(text);
  // Ticking "explores with hands and mouth" is the parent telling us the same thing.
  const ticked=(answers.play_style||[]).includes("exploring-mouthing");
  return mouths || noSmall || ticked;
}

function hasNonverbalSignals(answers){
  const text=((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();
  return /(non[\s-]?verbal|no\s+words|can'?t\s+talk|doesn'?t\s+talk|not\s+(yet\s+)?talking|minimally\s+verbal|few\s+words)/i.test(text);
}

// What a parent types tells us more than the boxes they tick. These map typed
// words onto the same interest values the checkboxes use, so "sharks" or
// "Minecraft" in the description counts even if nobody ticked a box for it.
const TYPED_INTERESTS=[
  ["animals",/\b(animals?|dogs?|pupp(y|ies)|cats?|kittens?|horses?|ponies|pony|farm|zoo|sharks?|whales?|dolphins?|fish|sea creatures?|birds?|bugs?|insects?|frogs?)\b/i],
  ["water",/\b(water|bath|pool|swim\w*|beach|splash\w*)\b/i],
  ["messy",/\b(sand|slime|messy|squish\w*|play-?doh|playdough|goo|gooey)\b/i],
  ["vehicles",/\b(diggers?|excavators?|trucks?|cars?|trains?|tractors?|buses|bus|fire ?engines?|vehicles?|planes?|rockets?)\b/i],
  ["dinosaurs",/\b(dinos?|dinosaurs?|t-?rex)\b/i],
  ["building",/\b(lego|duplo|build\w*|blocks|magna-?tiles|construct\w*|minecraft)\b/i],
  ["art",/\b(draw\w*|paint\w*|crafts?|colou?ring)\b/i],
  ["music",/\b(music|sing\w*|danc\w*|drums?|instruments?|songs?)\b/i],
  ["stories",/\b(books?|stories|story|reading)\b/i],
  ["puzzles",/\b(puzzles?|jigsaws?)\b/i],
  ["science",/\b(science|experiments?|stem|how things work)\b/i],
  ["games",/\b(board games?|card games?|competitive|uno)\b/i],
  ["dolls",/\b(dolls?|teddy|teddies|soft toys?|plush\w*)\b/i],
  ["pretend-play",/\b(pretend|dress[- ]?ups?|role[- ]?play|imaginative|bluey|peppa|paw patrol|superhero\w*|frozen)\b/i],
  ["movement",/\b(climb\w*|running|jump\w*|trampoline|outside|outdoors?|bikes?|scooters?|throw\w*|swing\w*)\b/i],
];
function typedText(answers){return ((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();}
function effectiveInterests(answers){
  const ticked=(answers.interests||[]).filter(v=>v!=="not-sure");
  const text=typedText(answers);
  const typed=TYPED_INTERESTS.filter(([,re])=>saidPositively(text,re)).map(([v])=>v);
  return [...new Set([...ticked,...typed])];
}
// Specific things the parent named ("sharks", "diggers") that a toy's own name
// or description also mentions get a direct nudge up.
function namedThings(answers){
  const m=typedText(answers).match(/\b(sharks?|whales?|dolphins?|horses?|unicorns?|dinosaurs?|diggers?|trucks?|trains?|tractors?|rockets?|planes?|cats?|dogs?|pupp(?:y|ies)|farm|ocean|space|lego|duplo|water|sand|drums?|bubbles?|slime|minecraft|magnets?|marble|garden(?:ing)?|veggie|soccer|football|fair(?:y|ies)|kittens?)\b/g)||[];
  return [...new Set(m.map(w=>w.replace(/^gardening$/,"garden").replace(/^veggie$/,"garden").replace(/(ies)$/,"y").replace(/s$/,"")))];
}
// A diagnosis or a professional already involved. When this is true the family
// has support, so the results must not send them off to a GP.
function hasDiagnosis(answers){
  return /(diagnos\w*|\badhd\b|\badd\b|autis\w*|\basd\b|dyspraxi\w*|cerebral\s+palsy|down\s+syndrome|\bfasd\b|paediatrician|pediatrician|psycholog\w*|speech\s+(path\w*|therap\w*)|\bot\b|occupational\s+therap\w*|\bndis\b)/i.test(typedText(answers));
}
function professionalAlreadyInvolved(answers){
  return hasDiagnosis(answers)||/(nurse|gp|doctor|paed\w*|therapist|teacher|kindy|daycare)\s+(said|says|has|have|flagged|mentioned|told|is|are|wants|suggested|noticed)/i.test(typedText(answers))
    // On a waitlist or already referred counts too: they have been through the GP.
    ||/(wait(ing)?[\s-]?list|referr(ed|al)|assessment (booked|coming|soon)|seeing (a|an|the) (speechie|speech|ot|psych\w*|paed\w*))/i.test(typedText(answers));
}
// Worries a parent types in their own words. Each one nudges up the toys that
// fit it, so a parent who wrote "toilet training" sees the potty seat.
const NEG_BEFORE=/(\bnot|n't|\bno|hates?|dislikes?|scared of|afraid of)\s+(\w+\s+)?$/i;
// For worries, "not toilet trained" and "doesn't sleep" ARE the worry, so only
// "already" or "fully" switch one off.
const NEG_WORRY=/(already|fully)\s+$/i;
function saidPositively(text,re,neg=NEG_BEFORE){
  const g=new RegExp(re.source,re.flags.includes("g")?re.flags:re.flags+"g");
  let m;while((m=g.exec(text))){if(!neg.test(text.slice(Math.max(0,m.index-24),m.index)))return true;}
  return false;
}
const CALM_TAGS=["calm-down","self-regulation","mindfulness","breath-control","emotional-regulation"];
const WORRIES=[
  {key:"toilet",label:"toilet training",re:/\b(toilet\w*|potty|nappy|nappies)\b/i,
    boost:p=>(p.id==="p122"||(p.tags||[]).includes("toileting"))?8:p.id==="p120"?4:0,
    fits:p=>p.id==="p122"||(p.tags||[]).includes("toileting")||/potty|toilet/i.test(p.name+" "+(p.note||""))},
  // Nail biting and chewing share the same toys, but the page names the one the
  // parent actually wrote. Saying "nail biting" to a parent who wrote "chews his
  // shirt" tells them nobody read it.
  {key:"nails",label:t=>/nail/i.test(t)?(/chew/i.test(t)?"nail biting and chewing":"nail biting"):"chewing",re:/nail[- ]?bit\w*|bit(es|ing|e) (his |her |their |my )?(finger)?nails|chew(s|ing)? (on )?(his |her |their |my )?(clothes|sleeves?|shirts?|collars?|pencils?|everything|anything)/i,
    boost:p=>(p.tags||[]).includes("chew")?8:((p.tags||[]).includes("fidget")||p.fam==="putty"||(p.tags||[]).includes("tactile"))?6:0,
    fits:p=>(p.tags||[]).includes("fidget")||(p.tags||[]).includes("chew")||p.fam==="putty"},
  {key:"sleep",label:"sleep",re:/\b(sleep\w*|bedtime|bed time|settl(e|ing) (at night|for bed|to sleep)|wind(ing)? down|night wak\w*|wak(es|ing) (up )?(at night|a lot|often|early))\b/i,
    boost:p=>((p.tags||[]).some(t=>CALM_TAGS.includes(t))||(p.tags||[]).includes("bedtime"))?5:0,
    fits:p=>(p.tags||[]).some(t=>CALM_TAGS.includes(t))||(p.tags||[]).includes("bedtime")||/sleep|bedtime|night/i.test(p.name)},
  {key:"feelings",label:null,re:/\b(anxious|anxiety|worrier|worries a lot|big feelings|meltdowns?|tantrums?|overwhelm\w*)\b/i,
    boost:p=>((p.tags||[]).some(t=>CALM_TAGS.includes(t))||(p.tags||[]).includes("emotions"))?4:0},
  {key:"coordination",label:null,re:/\b(dyspraxi\w*|clumsy|uncoordinated|coordination|bumps into|trips over|falls over)\b/i,
    boost:p=>(p.tags||[]).some(t=>["balance","coordination","throwing","hand-eye","bilateral","motor-planning","gross-motor"].includes(t))?4:0,
    fits:p=>(p.tags||[]).includes("throwing")||p.fam==="scarves"||p.fam==="catch-set"},
];
function worriesOf(answers){const t=typedText(answers);return WORRIES.filter(w=>saidPositively(t,w.re,NEG_WORRY));}
// Shows, characters and themes a parent names. If nothing in the picks matches
// one, the results say so instead of pretending.
const THEMES=[
  ["slime",/\bslime\b/i,/slime/i],["unicorn",/\bunicorns?\b/i,/unicorn/i],["Bluey",/\bbluey\b/i,/bluey/i],
  ["Wiggles",/\bwiggles\b/i,/wiggles/i],["Paw Patrol",/\bpaw patrol\b/i,/paw patrol/i],["Peppa Pig",/\bpeppa\b/i,/peppa/i],
  ["Minecraft",/\bminecraft\b/i,/minecraft/i],["Frozen",/\b(frozen|elsa)\b/i,/frozen|elsa/i],["Spider-Man",/\bspider[- ]?man\b/i,/spider[- ]?man/i],
  ["Pok\u00e9mon",/\bpok[e\u00e9]mon\b/i,/pok[e\u00e9]mon/i],["mermaid",/\bmermaids?\b/i,/mermaid/i],["fairy",/\bfair(y|ies)\b/i,/fair(y|ies)/i],
  ["shark",/\bsharks?\b/i,/shark|ocean/i],["dinosaur",/\b(dinos?|dinosaurs?|t-?rex)\b/i,/dino|t-?rex/i],["train",/\btrains?\b/i,/train/i],
  ["space",/\b(space|planets?|astronauts?)\b/i,/\bspace ?(ship|station|rocket|themed)|outer space|planet|rocket|astronaut|solar system/i],["horse",/\b(horses?|pon(y|ies))\b/i,/horse|pony/i],
  ["digger",/\b(diggers?|excavators?)\b/i,/digger|excavator|construction|bulldozer|backhoe|dump truck/i,true],["car",/\bcars?\b/i,/\bcars?\b|vehicle|hot wheels/i],
  // Things parents type that no checkbox covers.
  // These match on the toy's name only: "buried in the garden" in a note doesn't make dinosaurs a garden toy.
  ["garden",/\b(garden\w*|veggie (patch|garden)|planting|watering the)\b/i,/garden|wheelbarrow|watering can/i,true],["tractor",/\btractors?\b/i,/tractor/i,true],
  ["bubble",/\bbubbles?\b/i,/bubble/i,true],["cat",/\b(cats?|kittens?)\b/i,/(?<!taco )\b(cats?|kittens?)\b/i,true],["soccer",/\b(soccer|football)\b/i,/soccer|football/i,true],
  ["farm",/\b(farms?|farm animals?)\b/i,/farm|barn|tractor/i,true],["fire truck",/\bfire ?(trucks?|engines?|fighters?|station)\b/i,/fire (truck|engine|station)/i,true],
  ["doctor",/\b(playing doctors?|doctors? and nurses|doctor kit|vet kit|playing vets?)\b/i,/doctor|\bvet\b|medical/i,true],["kitchen",/\b(cooking|baking|play kitchen|chef)\b/i,/kitchen|cook|bak(e|ing)|tea set/i,true],
  ["dress-up",/\b(dress(ing)?[- ]?up|costumes?)\b/i,/dress[- ]?up|costume/i,true],["shop",/\b(playing shops?|shopkeeper|cash register)\b/i,/shop|cash register|checkout/i,true],
  ["puppet",/\bpuppets?\b/i,/puppet/i,true],["magnetic tile",/\b(magna ?-?tiles?|magnetic tiles|connetix)\b/i,/magna|connetix|magnetic tile/i,true],
  ["playdough",/\b(play ?-?doh|playdough|play dough)\b/i,/play-?doh|dough/i,true],["scooter or bike",/\b(scooters?|bikes?|trikes?)\b/i,/scooter|bike|trike/i,true],
  ["princess",/\bprincess(es)?\b/i,/princess/i,true],["superhero",/\bsuper ?heroes?\b/i,/super ?hero|spider|batman|marvel/i,true],
  ["bug",/\b(bugs?|insects?|beetles?|butterfl\w+)\b/i,/bug|insect|butterfl|beetle/i,true],["camping",/\bcamping\b/i,/camp|tent/i,true],
  ["plane",/\b(planes?|aeroplanes?|airplanes?|helicopters?)\b/i,/plane|helicopter|airport/i,true],["fishing",/\bfishing\b/i,/fishing/i,true],
  ["dolls house",/\bdoll'?s? ?houses?\b/i,/doll.?s? ?house/i,true],["footy",/\b(footy|afl)\b/i,/footy|afl/i,true],["cricket",/\bcricket\b/i,/cricket/i,true],
  ["basketball",/\bbasketball\b/i,/basketball|hoop/i,true],["chess",/\bchess\b/i,/chess/i,true],["trampoline",/\btrampolines?\b/i,/trampoline/i,true],["drum",/\bdrums?\b/i,/drum/i,true],["dog",/\b(dogs?|pupp(y|ies))\b/i,/\bdogs?\b|pupp/i,true],
];
function joinList(a){return a.length<2?a.join(""):a.slice(0,-1).join(", ")+" or "+a[a.length-1];}
function joinAnd(a){return a.length<2?a.join(""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];}
// Themes the parent named that the library has nothing for at this age.
function gapThemes(answers,recs){
  const t=typedText(answers);const age=answers.child_age||0;
  const hayOf=(p,nameOnly)=>nameOnly?(p.name||""):((p.name||"")+" "+(p.note||"")+" "+(p.search||"")+" "+(p.tags||[]).join(" "));
  const fitsAge=p=>(p.age_min||0)<=age+6&&(p.age_max==null||p.age_max>=age-6);
  return THEMES.filter(([,re,hit,nameOnly])=>saidPositively(t,re)&&!recs.some(p=>hit.test(hayOf(p,nameOnly)))&&!PRODUCTS.some(p=>fitsAge(p)&&hit.test(hayOf(p,nameOnly)))).map(([l])=>l);
}
function libraryGapLine(answers,recs){
  const t=typedText(answers);
  const themes=gapThemes(answers,recs);
  const worries=worriesOf(answers).filter(w=>w.label&&w.fits&&!recs.some(w.fits)).map(w=>typeof w.label==="function"?w.label(t):w.label);
  if(!themes.length&&!worries.length)return "";
  const out=[];
  if(themes.length)out.push(`I don't have any ${joinList(themes)} toys in my library yet.`);
  if(worries.length)out.push(`You mentioned ${joinAnd(worries)}. Nothing in these picks fits ${worries.length>1?"those":"that"}.`);
  out.push("My library only holds things I've chosen myself, so it won't have everything.");
  return out.join(" ");
}
// One of each kind of toy. Products without their own family get one from their
// name, so three soft books or three looking-after sets never fill a list.
function famOf(p,answers){
  if(p.fam==="vet-set")return "care-play";
  if(p.fam)return p.fam;
  if(["p42","p73","p100"].includes(p.id))return "rocket-launcher";
  if(["p91","p128"].includes(p.id))return "climbing-frame";
  if(p.id==="p122")return "toilet-seat";
  const n=(p.name||"").toLowerCase();
  if(/soft book|crinkle|cloth book|bath book|touch and feel/.test(n))return "soft-book";
  if(/doctor|vet\b|clinic|nursery|pram|hospital/.test(n))return "care-play";
  if(/memory|matching cards|\bsnap\b/.test(n))return "memory-cards";
  if(/spot it/.test(n))return "spot-it";
  const wantsBooks=effectiveInterests(answers).includes("stories");
  if(!wantsBooks&&(p.tags||[]).includes("books"))return "book";
  return null;
}
// A second family from the name, for lines and kinds of toy that new imports
// don't tag: two DUPLO sets, two play food sets or two scooters never share a list.
const NAME_FAMS=[
  ["big-bricks",/\bduplo\b|mega bloks/],["lego",/\blego\b/],
  ["magnetic-tiles",/magna-?tiles|magnetic (tiles|blocks)/],["marble-run",/marble|gravitrax/],["ball-run",/ball run|air toobz/],
  ["play-food",/\bfood\b|time to eat|ice cream|pizza|tea (party|set)|kitchen|barista|\bcafe\b/],["shop-play",/supermarket|cash register/],
  ["water-table",/water table/],["water-wow",/water wow/],["bath-toy",/\bbath(time|tub)?\b/],
  ["ride-on",/scooter|trike|tricycle|balance bike|cozy coupe|ride[- ]on/],["stepping-stones",/stepping stones/],
  ["crayons-markers",/crayons?\b|markers?\b/],["bead-craft",/\bbeads?\b|\bloom\b|bracelet/],["sticker-art",/sticker/],
  ["audio-player",/yoto|toniebox/],["rocket-launcher",/rocket (air )?launcher|stomp rocket/],["walkie-talkie",/walkie/],
  ["camera",/camera/],["playdough",/play-?doh|playdough/],["busy-board",/busy (board|book)/],["dress-up",/dress-?up|costume/],
  ["rush-hour",/rush hour/],["ticket-to-ride",/ticket to ride/],["connect-4",/connect 4/],["uno",/\buno\b/],["bluey-playset",/bluey.*(house|playset)/],
];
function famsOf(p,answers){
  const out=[];const f=famOf(p,answers);if(f)out.push(f);
  const n=(p.name||"").toLowerCase();
  const nf=NAME_FAMS.find(([,re])=>re.test(n));if(nf&&!out.includes(nf[0]))out.push(nf[0]);
  if((p.tags||[]).includes("card-game")&&!out.includes("card-game"))out.push("card-game");
  return out;
}

function scoreProduct(p, answers){
  const age=answers.child_age;
  if(age<p.age_min)return -1; // hard floor: never a toy rated for older kids
  // Each age answer covers a band (6 to 8 is 72 to 95 months). A toy is too young
  // only if it tops out before the band starts, so a "6 to 7" toy still shows for "6 to 8".
  const bandLo={42:36,54:48,66:60,84:72,108:96}[age]||age;
  const _overAge=bandLo>p.age_max;
  if(_overAge&&!hasDelaySignals(answers))return -1;
  const[,budgetMax]=parseBudget(answers.budget);
  // The page says "each pick is under $X", so $X itself is over.
  const strictMax=["under-20","20-50","50-100"].includes(answers.budget);
  if(p.price>budgetMax||(strictMax&&p.price>=budgetMax))return -1;

  const alreadyHave=answers.already_have||[];
  // Hard exclusions
  if(alreadyHave.includes("blocks-tiles")&&p.tags.includes("blocks-tiles"))return -1;
  if(alreadyHave.includes("board-games")&&p.tags.includes("board-game"))return -1;
  if(alreadyHave.includes("books")&&p.tags.includes("books"))return -1;
  if(alreadyHave.includes("craft-supplies")&&(p.tags.includes("craft")||p.tags.includes("drawing")&&!p.tags.includes("vertical-surface")))return -1;
  if(alreadyHave.includes("pretend-play")&&p.tags.includes("pretend-play")&&!p.tags.includes("tool-use")&&!p.tags.includes("dinosaurs")&&!p.tags.includes("vehicles")&&!p.tags.includes("trains"))return -1;
  if(alreadyHave.includes("outdoor-toys")&&p.tags.includes("outdoor")&&p.dev_areas.length===1&&p.dev_areas[0]==="gross")return -1;
  // A family with outdoor play equipment does not need more big backyard gear.
  if(alreadyHave.includes("outdoor-toys")&&(p.tags.includes("climbing")||p.tags.includes("swing")||/climbing|slide|swing|trampoline|hoop|dome|jungle gym|cubby|sandpit|soccer goal|t-ball/i.test(p.name)))return -1;
  if(alreadyHave.includes("puzzles")&&(p.tags.includes("jigsaw")||p.fam==="jigsaw"))return -1;
  if(alreadyHave.includes("vehicles-already")&&p.tags.includes("vehicles")&&!p.tags.includes("constructive"))return -1;
  if(alreadyHave.includes("dolls-already")&&(p.tags.includes("dolls")||p.tags.includes("plush")||/soft toy|plush/i.test(p.name)))return -1;
  if(alreadyHave.includes("dinosaurs-already")&&p.tags.includes("dinosaurs")&&!(p.fam==="jigsaw"||p.tags.includes("constructive")))return -1;
  // A chew tool is its own thing, not another fidget, so it stays in.
  if(alreadyHave.includes("sensory-fidget")&&(p.tags.includes("fidget")||p.fam==="putty")&&!p.tags.includes("chew"))return -1;
  if(alreadyHave.includes("stem-already")&&(p.fam==="science-kit"||p.fam==="circuit-kit"))return -1;

  // Functional/everyday equipment (cups, potty, step stool, cutlery, dressing doll) is only relevant
  // when self-care is a chosen goal, or when the parent picked no goals at all. Otherwise exclude it
  // so we never suggest a cup to someone focused on language, for example.
  const FUNCTIONAL_IDS=["p120","p121","p122","p123","p124"];
  const devFocusGoals=(answers.dev_focus||[]);
  const selfcareWanted=devFocusGoals.includes("selfcare")||devFocusGoals.includes("no-preference")||devFocusGoals.length===0;
  const toiletWorry=worriesOf(answers).some(w=>w.key==="toilet");
  if(FUNCTIONAL_IDS.includes(p.id)&&!selfcareWanted&&!(toiletWorry&&(p.id==="p122"||p.id==="p120")))return -1;
  // Toilet training, chewing and sleep gear only shows when the parent raised it
  // (or picked self-care, for the toilet things). Nobody needs a potty book by surprise.
  const worryKeys=worriesOf(answers).map(w=>w.key);
  if(p.tags.includes("toileting")&&!toiletWorry&&!devFocusGoals.includes("selfcare"))return -1;
  if(p.tags.includes("chew")&&!worryKeys.includes("nails")&&!hasMouthingSignals(answers))return -1;
  if(p.fam==="night-light"&&!worryKeys.includes("sleep"))return -1;
  // Therapy gear (body socks, crash pads, therapy balls, weighted things) only
  // shows when the parent asked for sensory or therapy support. It's a toy quiz,
  // and a soccer-mad seven year old's birthday list is no place for a body sock.
  const therapyGear=(p.tags||[]).includes("deep-pressure")||["p76","p79","p80","p81","p84"].includes(p.id);
  const sensoryAsked=devFocusGoals.includes("sensory")||devFocusGoals.includes("sensory-tools")||(answers.occasion||[]).includes("therapy-support");
  if(therapyGear&&!sensoryAsked)return -1;


  let score=_overAge?-Math.min(6,Math.ceil((age-p.age_max)/12)):0;
  // Prices sit inside the band the parent picked, not just under its ceiling.
  const[budgetMin]=parseBudget(answers.budget);
  if(budgetMin>0&&p.price>=budgetMin)score+=4;
  // Under the band ranks lower, and well under it ranks a lot lower, but never
  // drops out: tiny babies' toys are cheap and a short list is worse.
  const budgetPenalty=budgetMin>0&&p.price<budgetMin?(p.price<budgetMin*0.5?7:4):0;
  // A toy whose range tops out close to the child's age is near the end of its
  // life for them, and older kids notice when a pick is meant for little ones.
  if(age>=60&&!hasDelaySignals(answers)&&p.age_max<bandLo+6)score-=3;
  // Preschool sets (rated from 3 or younger) read as babyish to an 8 or 9 year old.
  // Broad all-ages items (a fidget rated 3 to 12) are left alone.
  if(age>=96&&!hasDelaySignals(answers)&&p.age_min<=36&&p.age_max<=120)return -1;
  if(age>=72&&!hasDelaySignals(answers)&&p.age_min<=24&&p.age_max<=96)score-=3;
  // A child described as nonverbal or minimally verbal: down-rank games whose core
  // mechanic demands expressive language. Books and receptive-language toys stay.
  if(hasNonverbalSignals(answers)){
    const speechDemanding=["questions","word-game","vocabulary","spelling","deduction"];
    if(p.tags.some(t=>speechDemanding.includes(t)))score-=5;
  }
  const devFocus=answers.dev_focus||[];
  if(!devFocus.includes("no-preference")){
    score+=p.dev_areas.filter(d=>devFocus.includes(d)).length*3;
  } else {score+=2;}

  const interests=effectiveInterests(answers);
  const directTagMap={
    "baby-discovery":["visual","tummy-time","grasping","sensory","cause-effect"],
    dolls:["dolls","nurturing","plush"],
    animals:["animals"],vehicles:["vehicles","trains"],dinosaurs:["dinosaurs"],
    building:["constructive","tool-use"],
    "pretend-play":["pretend-play","role-play","storytelling","cooking","nurturing","emotions"],
    movement:["movement","outdoor","climbing","balance","jumping","walking","vestibular","heavy-work","bilateral","soft-play"],
    art:["drawing","craft","mark-making","pre-writing","art","creative"],
    music:["music","rhythm","audio"],stories:["books","storytelling","audio"],
    puzzles:["problem-solving","puzzle","sorting","memory","patterns"],
    sports:["sports"],
    gymnastics:["gymnastics","sports","balance","proprioceptive","vestibular","heavy-work"],
    games:["board-game","card-game","word-game"],
    water:["water","pouring","bath"],messy:["sand","slime","messy","playdough","tactile"],science:["STEM","science","experiments","coding","circuits"],
  };
  // Sensory dev area: direct boost for sensory-specific tags
  if((answers.dev_focus||[]).includes("sensory")){
    const sensoryTags=["vestibular","proprioceptive","deep-pressure","sensory","fidget","stretchy","heavy-work","swing","soft-play"];
    if(p.tags.some(t=>sensoryTags.includes(t)))score+=4;
  }
  if((answers.dev_focus||[]).includes("sensory-tools")){
    const toolTags=["vestibular","proprioceptive","deep-pressure","fidget","heavy-work","swing","soft-play","self-regulation","calm-down","tactile"];
    if(p.tags.some(t=>toolTags.includes(t)))score+=5;
  }
  // Active/movement play style: boost heavy work and outdoor
  if((answers.play_style||[]).includes("active-physical")){
    const activeTags=["heavy-work","proprioceptive","vestibular","climbing","jumping","movement","outdoor"];
    if(p.tags.some(t=>activeTags.includes(t)))score+=2;
  }
  p._matchedInterests=[];
  interests.forEach(interest=>{
    const mapped=directTagMap[interest]||[];
    // Capped at two tags per interest, so a toy with five pretend-play tags
    // doesn't outrank one that matches what the parent actually typed.
    const matchCount=Math.min(2,p.tags.filter(t=>mapped.includes(t)).length);
    if(matchCount>0){score+=matchCount*4;p._matchedInterests.push(interest);}
  });

  const hay=((p.name||"")+" "+(p.note||"")+" "+(p.search||"")).toLowerCase();
  if(namedThings(answers).some(w=>w.length>=3&&hay.includes(w)))score+=3;
  worriesOf(answers).forEach(w=>{score+=w.boost(p);});
  // A character toy (Bluey, Wiggles) ranks lower unless the parent named that
  // character. Plenty of kids love Bluey, but nobody asked us to guess.
  const brand=THEMES.slice(2,10).find(([,,hit])=>hit.test(p.name||""));
  if(brand&&!saidPositively(typedText(answers),brand[1]))score-=3;

  const playStyle=answers.play_style||[];
  if(playStyle.includes("active-physical")&&p.dev_areas.includes("gross"))score+=2;
  if(playStyle.includes("calm-focused")&&(p.dev_areas.includes("fine")||p.dev_areas.includes("cognitive")))score+=2;
  if(playStyle.includes("open-ended")&&p.tags.includes("open-ended"))score+=2;
  if(playStyle.includes("with-adults")&&(p.dev_areas.includes("social")||p.tags.includes("turn-taking")))score+=1;
  if(playStyle.includes("with-siblings-friends")&&p.tags.includes("turn-taking"))score+=1;
  return score>=0?Math.max(0,score-budgetPenalty):score;
}

const INTEREST_CAP=2;

const STOCKING_FILLERS = [
  {
    id:"sf1", name:"Nuby Fun Watering Can Bath Toy", ages:[24],
    dev_areas:["sensory"], tags:["water"],
    price:5.99, afflink:"https://www.amazon.com.au/dp/B06X1DXWKL?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B06X1DXWKL.01._SCLZZZZZZZ_.jpg",
    note:"They scoop, they tip, and they watch where the water actually lands."
  },
  {
    id:"sf2", name:"Briarpatch First 100 Words Matching Game", ages:[24],
    dev_areas:["language", "social"], tags:["board-game", "language"],
    price:6.99, afflink:"https://www.amazon.com.au/dp/B086KVS5JX?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B086KVS5JX.01._SCLZZZZZZZ_.jpg",
    note:"Find the pair, then name it."
  },
  {
    id:"sf3", name:"Oball Rattle & Roll Vehicle", ages:[24],
    dev_areas:["cognitive", "gross", "sensory"], tags:["gross-motor", "music", "pretend-play"],
    price:8.0, afflink:"https://www.amazon.com.au/dp/B00CL2H1U2?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B00CL2H1U2.01._SCLZZZZZZZ_.jpg",
    note:"Perfect pick for easy hand manipulation and early pretend play."
  },
  {
    id:"sf4", name:"Tomy Lamaze Pile and Play Stacking Cups", ages:[24],
    dev_areas:["fine"], tags:["fine-motor"],
    price:7.19, afflink:"https://www.amazon.com.au/dp/B077XGPKWW?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B077XGPKWW.01._SCLZZZZZZZ_.jpg",
    note:"They nest and they stack, which means working out size order and then letting go with some control. The cheapest thing on this whole list and one of the best."
  },
  {
    id:"sf5", name:"Nuby Floating Octopus Bath Toy", ages:[24],
    dev_areas:["fine", "sensory"], tags:["fine-motor", "water"],
    price:12.0, afflink:"https://www.amazon.com.au/dp/B083ZZSGLR?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B083ZZSGLR.01._SCLZZZZZZZ_.jpg",
    note:"They post rings onto a target while it bobs about. Two hands, one moving target."
  },
  {
    id:"sf6", name:"Melissa & Doug Pets Peg Puzzle", ages:[24, 42],
    dev_areas:["cognitive", "fine"], tags:["fine-motor", "problem-solving"],
    price:14.49, afflink:"https://www.amazon.com.au/dp/B00J1XDZIQ?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B00J1XDZIQ.01._SCLZZZZZZZ_.jpg",
    note:"The knobs are the point. They ask for a pincer grip rather than a whole hand, which is the grip that comes before a pencil."
  },
  {
    id:"sf7", name:"TOMY Toomies Hide and Squeak Eggs", ages:[24],
    dev_areas:["cognitive", "language"], tags:["language", "problem-solving"],
    price:14.99, afflink:"https://www.amazon.com.au/dp/B0C77Z2G86?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/610MOiLHylL._AC_SX522_.jpg",
    note:"Open, match, put back. Container play and shape matching in one, and the squeak keeps them at it."
  },
  {
    id:"sf8", name:"Munchkin Falls Bath Toy", ages:[24],
    dev_areas:["fine", "language", "sensory"], tags:["fine-motor", "language", "water"],
    price:16.95, afflink:"https://www.amazon.com.au/dp/B01AHOKF0S?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B01AHOKF0S.01._SCLZZZZZZZ_.jpg",
    note:"Stack the cups on the wall, pour water in the top, watch what happens. Cause and effect they are in charge of, in a place they are already sitting."
  },
  {
    id:"sf9", name:"Siku DHL Delivery Van Die-Cast", ages:[42],
    dev_areas:["gross"], tags:["gross-motor"],
    price:5.48, afflink:"https://www.amazon.com.au/dp/B0002HR1YE?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0002HR1YE.01._SCLZZZZZZZ_.jpg",
    note:"One good vehicle sets off a whole delivery run around the lounge room."
  },
  {
    id:"sf10", name:"BIC Kids Plastidecor Triangle Crayons", ages:[42],
    dev_areas:["fine"], tags:["art", "craft"],
    price:5.5, afflink:"https://www.amazon.com.au/dp/B008T2P5EC?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B008T2P5EC.01._SCLZZZZZZZ_.jpg",
    note:"Crayons are a staple at this age for colouring and drawing."
  },
  {
    id:"sf11", name:"Briarpatch First 100 Animals Matching Game", ages:[42],
    dev_areas:["cognitive", "language", "social"], tags:["board-game", "language", "pretend-play"],
    price:6.99, afflink:"https://www.amazon.com.au/dp/B086L6961D?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B086L6961D.01._SCLZZZZZZZ_.jpg",
    note:"Turn over, match, take turns."
  },
  {
    id:"sf12", name:"Melissa & Doug Water Wow, Farm", ages:[42],
    dev_areas:["cognitive", "sensory"], tags:["pretend-play", "water"],
    price:10.99, afflink:"https://www.amazon.com.au/dp/B06XCV39K9?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B06XCV39K9.01._SCLZZZZZZZ_.jpg",
    note:"Fat pen, no mess, and the page dries back to blank, so it resets forever. The barrel is the right thickness for a three-year-old hand."
  },
  {
    id:"sf13", name:"Crayola Washable Sidewalk Chalk", ages:[42, 54],
    dev_areas:["fine"], tags:["art", "craft"],
    price:11.0, afflink:"https://www.amazon.com.au/dp/B00AHAJGXK?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B00AHAJGXK.01._SCLZZZZZZZ_.jpg",
    note:"Drawing on concrete uses the whole arm and shoulder rather than the fingers, which is the right scale at three."
  },
  {
    id:"sf14", name:"Melissa & Doug Design-Your-Own Bracelets", ages:[42, 54],
    dev_areas:["fine", "gross"], tags:["art", "craft", "fine-motor", "gross-motor"],
    price:11.99, afflink:"https://www.amazon.com.au/dp/B009WLPEJA?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B009WLPEJA.01._SCLZZZZZZZ_.jpg",
    note:"So cute, and a nice fiddly craft to sit down with."
  },
  {
    id:"sf15", name:"Melissa & Doug Reusable Sticker Pad, Vehicles", ages:[42],
    dev_areas:["fine", "gross"], tags:["art", "craft", "gross-motor"],
    price:12.99, afflink:"https://www.amazon.com.au/dp/122308079X?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/122308079X.01._SCLZZZZZZZ_.jpg",
    note:"Peeling a sticker off the sheet and putting it where they meant to is fiddly precision work. These lift off and go back on, so it resets forever."
  },
  {
    id:"sf16", name:"Stacking cups", ages:[42],
    dev_areas:["fine", "sensory"], tags:["fine-motor", "water"],
    price:12.99, afflink:"https://link.amazon/B0aImQeOz",
    img:"https://m.media-amazon.com/images/I/71wvFaRCtYL._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Nesting, stacking and size ordering in one set, and they do a second life in the bath and the sandpit as pouring cups."
  },
  {
    id:"sf17", name:"Galt Farm Animals 4 Puzzles in a Box", ages:[42],
    dev_areas:["cognitive", "language"], tags:["language", "pretend-play", "problem-solving"],
    price:13.79, afflink:"https://www.amazon.com.au/dp/B0074HZZRU?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0074HZZRU.01._SCLZZZZZZZ_.jpg",
    note:"Four puzzles that step up in difficulty, so there's somewhere to go once the first one's easy. Edge matching and sticking with it."
  },
  {
    id:"sf18", name:"Schleich Andalusian Horse Figurine", ages:[42],
    dev_areas:["cognitive"], tags:["pretend-play"],
    price:14.24, afflink:"https://www.amazon.com.au/dp/B016H1XD40?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B016H1XD40.01._SCLZZZZZZZ_.jpg",
    note:"One good animal figure does more for pretend play than a bucket of cheap ones."
  },
  {
    id:"sf19", name:"Learning Resources Primary Shapes Template Set", ages:[42, 54],
    dev_areas:["cognitive", "language"], tags:["language", "problem-solving"],
    price:14.95, afflink:"https://www.amazon.com.au/dp/B004DJ65XK?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B004DJ65XK.01._SCLZZZZZZZ_.jpg",
    note:"Pre-writing. Tracing around a shape is the step between scribbling and letters, and the template holds still while they go around it."
  },
  {
    id:"sf20", name:"Playdough tool set", ages:[42],
    dev_areas:["fine"], tags:["art", "craft", "fine-motor"],
    price:15.0, afflink:"https://link.amazon/B062QcCLS",
    img:"https://m.media-amazon.com/images/I/81l-xfDvY-L._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Rolling and cutting playdough takes some force, and both hands end up doing different jobs."
  },
  {
    id:"sf21", name:"Galt Fun Buttons, 40 pieces", ages:[42, 54, 66],
    dev_areas:["cognitive", "fine"], tags:["fine-motor", "pretend-play"],
    price:18.0, afflink:"https://www.amazon.com.au/dp/B002AL9AIU?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B002AL9AIU.01._SCLZZZZZZZ_.jpg",
    note:"Laces through buttonholes. One hand holds and steadies, the other feeds, the two-handed pattern that shows up again in cutting and writing."
  },
  {
    id:"sf22", name:"TOMY Pop Up Bluey Game", ages:[42],
    dev_areas:["sensory", "social"], tags:["board-game", "sensory"],
    price:19.0, afflink:"https://www.amazon.com.au/dp/B0D8KW4JPM?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0D8KW4JPM.01._SCLZZZZZZZ_.jpg",
    note:"You wait your turn, take a chance, and then handle it when the thing pops. Short enough that a three-year-old stays with it."
  },
  {
    id:"sf23", name:"Bingo or dot markers", ages:[42],
    dev_areas:["fine"], tags:["art", "craft"],
    price:15.0, afflink:"https://link.amazon/B006eXuMy",
    img:"https://m.media-amazon.com/images/I/71MAAb96fHL._AC_SY550_.jpg",
    note:"A fat cylinder to wrap a whole hand around, and aiming each dot at a target takes more control than it looks."
  },
  {
    id:"sf24", name:"Little Brian Bath Paint Sticks, 6 pack", ages:[42, 54, 66],
    dev_areas:["fine", "sensory"], tags:["art", "craft", "fine-motor", "water"],
    price:11.99, afflink:"https://link.amazon/B0eJVHeSx",
    img:"https://m.media-amazon.com/images/I/71PkkiTkE+L._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Painting in the bath, and it washes straight off the tiles. Twist-up sticks, so no brush, no palette and nothing to clean up afterwards."
  },
  {
    id:"sf25", name:"Dinosaur Pull Back Vehicles, 6 pack", ages:[42, 54, 66, 84],
    dev_areas:["gross"], tags:["gross-motor"],
    price:15.99, afflink:"https://link.amazon/B0a9LTXsL",
    img:"https://m.media-amazon.com/images/I/71aTFyPwXIL._AC_SX679_.jpg",
    note:"Pull it back, let it go. One movement, instant result, and six of them means a race. Tiny, so they actually fit in a stocking."
  },
  {
    id:"sf26", name:"Hot Wheels Monster Truck, single 1:64", ages:[54],
    dev_areas:["cognitive", "gross", "sensory"], tags:["gross-motor", "music", "pretend-play"],
    price:5.0, afflink:"https://www.amazon.com.au/dp/B07S3FBJ5P?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07S3FBJ5P.01._SCLZZZZZZZ_.jpg",
    note:"Five dollars, nine centimetres, and it will get crushed, ramped and narrated for months."
  },
  {
    id:"sf27", name:"BIC Kids Evolution Triangular Colouring Pencils", ages:[54],
    dev_areas:["fine"], tags:["art", "craft"],
    price:5.5, afflink:"https://www.amazon.com.au/dp/B000KTB4UG?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B000KTB4UG.01._SCLZZZZZZZ_.jpg",
    note:"Everyone needs colouring pencils as a staple, especially at this age, where colouring in and drawing become much more common."
  },
  {
    id:"sf28", name:"Old Maid Card Game", ages:[54],
    dev_areas:["gross", "social"], tags:["board-game", "gross-motor"],
    price:6.45, afflink:"https://www.amazon.com.au/dp/B0768C28SW?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0768C28SW.01._SCLZZZZZZZ_.jpg",
    note:"Four is a great age to learn some introductory card games. Great news for board game loving parents."
  },
  {
    id:"sf29", name:"Galt Jungle 4 Puzzles in a Box", ages:[54],
    dev_areas:["cognitive", "fine"], tags:["art", "craft", "problem-solving"],
    price:13.79, afflink:"https://www.amazon.com.au/dp/B07MC8YSKC?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07MC8YSKC.01._SCLZZZZZZZ_.jpg",
    note:"Four puzzles starting small and grading bigger, so they can progress as they get better at puzzling."
  },
  {
    id:"sf30", name:"Orchard Toys Dinosaur Dominoes", ages:[54],
    dev_areas:["gross", "language", "social"], tags:["board-game", "gross-motor", "language"],
    price:14.99, afflink:"https://www.amazon.com.au/dp/B01E6SKZRO?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B01E6SKZRO.01._SCLZZZZZZZ_.jpg",
    note:"Matching the pictures, taking turns, and the whole thing is over in ten minutes."
  },
  {
    id:"sf31", name:"Outdoor Nature Scavenger Hunt Cards", ages:[54, 66, 84],
    dev_areas:["gross", "language"], tags:["gross-motor", "language", "outdoor", "science"],
    price:17.0, afflink:"https://www.amazon.com.au/dp/B00NB1ICMI?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61ZDqTMs6-L._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"A deck of things to find outside. At four it is matching a picture to the real thing, and it works at the park, the beach or the backyard."
  },
  {
    id:"sf32", name:"UNO Junior", ages:[54],
    dev_areas:["cognitive", "fine", "gross"], tags:["art", "craft", "gross-motor", "problem-solving"],
    price:18.23, afflink:"https://www.amazon.com.au/dp/B07Y94Y3JL?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07Y94Y3JL.01._SCLZZZZZZZ_.jpg",
    note:"A fan of cards is its own hand skill, and colour-and-number rules are about as much structure as a four-year-old can carry."
  },
  {
    id:"sf33", name:"Skillmatics Magical Scratch Art Book", ages:[54, 66, 84],
    dev_areas:["fine"], tags:["art", "craft"],
    price:19.99, afflink:"https://www.amazon.com.au/dp/B0BZZCGRMT?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81Y+WrABiFL._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"A mindful art activity for kids who like to sit and draw or colour."
  },
  {
    id:"sf34", name:"Melissa & Doug Scissor Skills Activity Pad", ages:[54, 66],
    dev_areas:["fine", "language"], tags:["fine-motor", "language"],
    price:9.99, afflink:"https://link.amazon/B02yL8TGS",
    img:"https://m.media-amazon.com/images/I/815YxqMGUzL._SY342_.jpg",
    note:"Cutting practice with the lines already printed for them."
  },
  {
    id:"sf35", name:"Play-Doh Marvel Spider-Man Thwip Squisher Set", ages:[54, 66],
    dev_areas:["cognitive", "fine", "gross", "language", "sensory"], tags:["art", "craft", "gross-motor", "language", "pretend-play", "sensory"],
    price:14.99, afflink:"https://link.amazon/B0053dVHM",
    img:"https://m.media-amazon.com/images/I/71GLp4qfGNL._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Squishing and squeezing dough, wrapped up in a character they already love."
  },
  {
    id:"sf36", name:"Go Fish Card Game", ages:[66],
    dev_areas:["gross", "social"], tags:["board-game", "gross-motor"],
    price:6.99, afflink:"https://www.amazon.com.au/dp/B076888X5P?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B076888X5P.01._SCLZZZZZZZ_.jpg",
    note:"Asking, remembering who said they had what, and waiting your turn. A whole game in a box the size of a phone."
  },
  {
    id:"sf37", name:"Waddingtons Number 1 Playing Cards", ages:[66],
    dev_areas:["cognitive", "gross"], tags:["gross-motor", "problem-solving"],
    price:7.84, afflink:"https://www.amazon.com.au/dp/B07N7ZXHZS?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07N7ZXHZS.01._SCLZZZZZZZ_.jpg",
    note:"A real deck. Shuffling and dealing is its own hand skill, and Snap, Go Fish and Memory all come out of one pack."
  },
  {
    id:"sf38", name:"Crayola Silly Scents Slim Markers, 10 pack", ages:[66],
    dev_areas:["cognitive"], tags:["pretend-play"],
    price:8.0, afflink:"https://www.amazon.com.au/dp/B0CG9M7V1Z?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0CG9M7V1Z.01._SCLZZZZZZZ_.jpg",
    note:"Slim barrels ask for a pinch grip rather than a fist, which is about right at five."
  },
  {
    id:"sf39", name:"Sakura Cray-Pas Junior Oil Pastels, 16 colours", ages:[66],
    dev_areas:["fine", "sensory"], tags:["art", "craft", "music"],
    price:9.11, afflink:"https://www.amazon.com.au/dp/B0017DA3W4?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0017DA3W4.01._SCLZZZZZZZ_.jpg",
    note:"Pressing, blending and layering with the whole stick. A flat tin, so it slides straight into a stocking."
  },
  {
    id:"sf40", name:"KINGOU Hexagon Tangram Puzzle", ages:[66],
    dev_areas:["cognitive"], tags:["problem-solving"],
    price:10.0, afflink:"https://www.amazon.com.au/dp/B07XLWJ4Q8?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71GseSMni9L._AC_SX679_.jpg",
    note:"Shapes into a fixed frame. You have to rotate a piece in your head before you try it, and then try again when you're wrong."
  },
  {
    id:"sf41", name:"Crayola 24 Coloured Pencils", ages:[66],
    dev_areas:["cognitive", "fine"], tags:["art", "craft", "pretend-play"],
    price:10.91, afflink:"https://www.amazon.com.au/dp/B0009RNQEQ?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0009RNQEQ.01._SCLZZZZZZZ_.jpg",
    note:"Unglamorous, and the thing they'll use most. Colouring in detail builds the hand endurance that school handwriting will ask for."
  },
  {
    id:"sf42", name:"Waboba Moon Ball", ages:[66],
    dev_areas:["gross", "sensory", "social"], tags:["board-game", "gross-motor", "music"],
    price:14.06, afflink:"https://www.amazon.com.au/dp/B07YV6TLSZ?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07YV6TLSZ.01._SCLZZZZZZZ_.jpg",
    note:"Bounces absurdly high and not always where you expect. Watching it, chasing it, getting a hand to it is the whole game. Off concrete it clears a single-storey roof, which I worked out the expensive way."
  },
  {
    id:"sf43", name:"Djeco Mini Family Card Game", ages:[66],
    dev_areas:["gross", "social"], tags:["board-game", "gross-motor"],
    price:14.95, afflink:"https://www.amazon.com.au/dp/B00OXJ78XQ?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B00OXJ78XQ.01._SCLZZZZZZZ_.jpg",
    note:"Another option for card games if your family is loving them."
  },
  {
    id:"sf44", name:"Skillmatics Guess in 10: Animal Planet", ages:[66],
    dev_areas:["cognitive", "fine", "sensory"], tags:["art", "craft", "music", "pretend-play"],
    price:17.99, afflink:"https://www.amazon.com.au/dp/B07RMJ8SG6?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B07RMJ8SG6.01._SCLZZZZZZZ_.jpg",
    note:"Ten yes or no questions to narrow down an answer. Narrowing down instead of guessing wildly is the hard part, and it takes a few rounds before it clicks."
  },
  {
    id:"sf45", name:"Simxkai Rainbow Delta Kite", ages:[66, 84],
    dev_areas:["gross"], tags:["gross-motor"],
    price:19.99, afflink:"https://www.amazon.com.au/dp/B08L6CQ47N?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71zpKFCeX+L._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"To get it up they have to run, time the release, then keep making small corrections on the line. Great fun outdoor activity for a windy day."
  },
  {
    id:"sf46", name:"Staedtler Noris Aquarell Watercolour Pencils", ages:[84],
    dev_areas:["fine", "sensory"], tags:["art", "craft", "water"],
    price:8.95, afflink:"https://www.amazon.com.au/dp/B0018O7FQO?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0018O7FQO.01._SCLZZZZZZZ_.jpg",
    note:"Draw dry, then go over it with a wet brush and watch it change. Two techniques in one pencil."
  },
  {
    id:"sf47", name:"100 Wooden Alphabet Scrabble Tiles", ages:[84],
    dev_areas:["cognitive", "fine", "language"], tags:["art", "craft", "language", "pretend-play"],
    price:9.38, afflink:"https://www.amazon.com.au/dp/B07XX2GNR8?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71PMdYiJDXL._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"A bag of letter tiles and nothing else. Building words and pulling them apart again, on the floor, with no board telling them what to do."
  },
  {
    id:"sf48", name:"Top Trumps Sonic the Hedgehog", ages:[84],
    dev_areas:["cognitive", "social"], tags:["board-game", "problem-solving"],
    price:9.95, afflink:"https://www.amazon.com.au/dp/B0B8125RT9?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0B8125RT9.01._SCLZZZZZZZ_.jpg",
    note:"They compare numbers across categories and pick the one that wins. Quiet maths inside a game about Sonic."
  },
  {
    id:"sf49", name:"Bicycle Mickey Mouse Playing Cards", ages:[84],
    dev_areas:["gross"], tags:["gross-motor"],
    price:9.95, afflink:"https://www.amazon.com.au/dp/B0C7D26Y1S?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B0C7D26Y1S.01._SCLZZZZZZZ_.jpg",
    note:"A proper deck with a good finish. Snap, Rummy, card houses, and the shuffling that goes with all of it."
  },
  {
    id:"sf50", name:"UNO Classic", ages:[84],
    dev_areas:["cognitive", "gross", "language"], tags:["gross-motor", "language", "pretend-play"],
    price:6.0, afflink:"https://www.amazon.com.au/dp/B005I5M2F8?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/P/B005I5M2F8.01._SCLZZZZZZZ_.jpg",
    note:"Six dollars. Reading what has been played and deciding when to drop a wild card is more thinking than it looks like."
  },
  {
    id:"sf51", name:"Coogam Wooden Tangram Jigsaw", ages:[84],
    dev_areas:["cognitive"], tags:["pretend-play", "problem-solving"],
    price:18.99, afflink:"https://www.amazon.com.au/dp/B07GF9421C?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61Z9XY-gORL._AC_SX522_.jpg",
    note:"Rebuild a printed silhouette from seven pieces. Sixty puzzles, gets genuinely hard, and it's quiet."
  },
  {
    id:"sf52", name:"EverBrite Mini Torches, 3 pack", ages:[84],
    dev_areas:["gross", "language"], tags:["gross-motor", "language", "outdoor", "science"],
    price:18.99, afflink:"https://www.amazon.com.au/dp/B0B6N6JLV1?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71zmjPZ4arL._AC_SX342_SY445_QL70_ML2_.jpg",
    note:"A real torch, not a toy one. For tents, cubby houses, reading under the covers."
  },
  {
    id:"sf53", name:"LEGO Creator 3 in 1 Cute Hamster 31376", ages:[84],
    dev_areas:["cognitive", "fine"], tags:["art", "craft", "fine-motor", "pretend-play"],
    price:10.0, afflink:"https://link.amazon/B01490Rqz",
    img:"https://m.media-amazon.com/images/I/818G-Hjkn5L._AC_SY300_SX300_QL70_ML2_.jpg",
    note:"Three builds from the one box, so it gets pulled apart and rebuilt rather than finished once. Following a picture sequence step by step is its own skill at six."
  },
];

function stockingCandidates(answers,excluded){
  const age=answers.child_age;
  const goals=new Set(answers.dev_focus||[]);
  return STOCKING_FILLERS
    .filter(p=>p.ages.includes(age) && !excluded.includes(p.id))
    .map(p=>{let s=4;(p.dev_areas||[]).forEach(a=>{if(goals.has(a))s+=2;});
      return {...p,age_min:age,age_max:age,score:s,_matchedInterests:[],fam:undefined};});
}

function getRecommendations(answers,count=5,excluded=[],kept=[]){
  const stockingMode=(answers.occasion||[]).includes("christmas-stocking");
  let scored=PRODUCTS
    .filter(p=>!excluded.includes(p.id))
    .map(p=>{const score=scoreProduct(p,answers);return{...p,score,_matchedInterests:p._matchedInterests};})
    .filter(p=>p.score>=0)
    .sort((a,b)=>b.score-a.score);
  if(stockingMode){
    // Stocking-filler occasion: cap everything at $20 and blend in the curated
    // stocking fillers, so results are a mix of these picks AND other suitable
    // under-$20 toys from the main catalogue.
    scored=scored.filter(p=>(p.price||0)>0 && (p.price||0)<=20);
    const sfCands=stockingCandidates(answers,excluded);
    scored=sfCands.concat(scored).sort((a,b)=>b.score-a.score);
  }

  const CAP=effectiveInterests(answers).length<=1?3:INTEREST_CAP;
  const result=[];const usedAreas=new Set();const interestCount={};
  // On a swap, the toys staying on the page count too: no second DUPLO set.
  const famUsed=new Set(kept.flatMap(k=>famsOf(k,answers)));
  const isToilet=(p)=>p.id==="p122"||(p.tags||[]).includes("toileting");
  // Never two of the same kind (e.g. two science kits), and at most two toilet
  // training things, so one worry doesn't fill the whole list.
  const famBlocked=(p)=>{if(famsOf(p,answers).some(f=>famUsed.has(f)))return true;return isToilet(p)&&result.filter(isToilet).length>=2;};
  const take=(p)=>{result.push(p);p.dev_areas.forEach(a=>usedAreas.add(a));famsOf(p,answers).forEach(f=>famUsed.add(f));
    (p._matchedInterests||[]).forEach(int=>{interestCount[int]=(interestCount[int]||0)+1;});};

  // ── THEIR OWN WORDS: a worry the parent typed gets one toy that fits it ──
  // (toilet training, nail biting, sleep), ahead of interest caps, at most two.
  {let added=0;
  for(const w of worriesOf(answers).filter(w=>w.fits)){
    if(added>=2||result.length>=count)break;
    if(result.some(w.fits))continue;
    const pick=scored.find(p=>w.boost(p)>0&&w.fits(p)&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
    if(pick){take(pick);added++;}
  }}

  // A show, character or theme they named (Minecraft, Bluey, sharks) gets its
  // best match in, even if that interest is already well covered. At most two.
  {
    const t=typedText(answers);const hayOf=(p,nameOnly)=>nameOnly?(p.name||""):((p.name||"")+" "+(p.note||"")+" "+(p.search||"")+" "+(p.tags||[]).join(" "));
    let added=0;
    for(const [,re,hit,nameOnly] of THEMES){
      if(added>=2||result.length>=count)break;
      if(!saidPositively(t,re)||result.some(p=>hit.test(hayOf(p,nameOnly))))continue;
      const pick=scored.find(p=>p.score>=0&&hit.test(hayOf(p,nameOnly))&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
      if(pick){take(pick);added++;}
    }
  }

  // ── GOAL COVERAGE: ensure at least one toy per chosen development goal ──
  const chosenGoals=(answers.dev_focus||[]).filter(g=>g!=="no-preference");
  const goalArea=(g)=>g==="sensory-tools"?"sensory":g;
  for(const goal of chosenGoals){
    if(result.length>=count)break;
    // highest scoring toy that covers this goal and isn't already picked
    const pick=scored.find(p=>p.dev_areas.includes(goalArea(goal))&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
    if(pick){
      const ints=pick._matchedInterests||[];
      const capped=ints.some(int=>(interestCount[int]||0)>=CAP);
      if(!capped)take(pick);
    }
  }

  // ── fill remaining slots, diversifying dev areas ──
  for(const p of scored){
    if(result.length>=count)break;
    if(result.find(r=>r.id===p.id))continue;
    if(famBlocked(p))continue;
    const ints=p._matchedInterests||[];
    const capped=ints.some(int=>(interestCount[int]||0)>=CAP);
    if(capped)continue;
    const newArea=p.dev_areas.find(a=>!usedAreas.has(a));
    // Variety is good, but not at any cost: a weak match does not earn a place
    // just because it covers an area nobody asked about.
    const strongEnough=p.score>=Math.max(3,((scored[0]&&scored[0].score)||0)*0.35);
    if((newArea&&strongEnough)||result.length<2||ints.length>0)take(p);
  }
  for(const p of scored){
    if(result.length>=count)break;
    if(result.find(r=>r.id===p.id))continue;
    if(famBlocked(p))continue;
    const ints=p._matchedInterests||[];
    const capped=ints.some(int=>(interestCount[int]||0)>=CAP);
    if(!capped)take(p);
  }
  // Before repeating a kind of toy, take anything new even if its interest is
  // already well covered. A broad interest like "grabbing everything" should not
  // force three soft books into a baby's list.
  for(const p of scored){
    if(result.length>=count)break;
    if(result.find(r=>r.id===p.id))continue;
    if(famBlocked(p))continue;
    take(p);
  }
  for(const p of scored){
    if(result.length>=count)break;
    if(!result.find(r=>r.id===p.id))result.push(p);
  }
  // ── MIX BUDGET: guarantee a spread of price points when the parent asks for
  // a mix (some smaller, some bigger-ticket). Keep the personalised picks the
  // selection already made, then rebalance only the weakest slots. ──
  if(answers.budget==="mix"&&!stockingMode){
    const LO=p=>(p.price||0)>0&&(p.price||0)<=25;
    const HI=p=>(p.price||0)>=50;
    const protectedIds=new Set();
    const replaceWeakest=(cand,canRemove)=>{
      let idx=-1,sc=Infinity;
      for(let i=0;i<result.length;i++){
        if(protectedIds.has(result[i].id))continue;
        if(!canRemove(result[i]))continue;
        if(result[i].score<sc){sc=result[i].score;idx=i;}
      }
      if(idx<0)return false;
      result.splice(idx,1,cand);protectedIds.add(cand.id);famsOf(cand,answers).forEach(f=>famUsed.add(f));return true;
    };
    if(!result.some(HI)){
      const cand=scored.find(p=>HI(p)&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
      if(cand)replaceWeakest(cand,r=>!HI(r));
    }
    // Protect the strongest big-ticket pick so the low-cost fill below can't
    // swap away the only premium item.
    const hiInResult=result.filter(HI).sort((a,b)=>b.score-a.score);
    if(hiInResult.length)protectedIds.add(hiInResult[0].id);
    let guard=0;
    while(result.filter(LO).length<2&&guard++<4){
      const cand=scored.find(p=>LO(p)&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
      if(!cand)break;
      const canRemove=r=>!LO(r)&&!protectedIds.has(r.id)&&(!HI(r)||result.filter(HI).length>1);
      if(!replaceWeakest(cand,canRemove))break;
    }
  }
  // The Top pick is the strongest match overall. Picks that came in for a worry
  // or a theme the parent typed stay on the list, just not always first.
  result.sort((a,b)=>b.score-a.score);
  return result.slice(0,count);
}

// ─── PRODUCT IMAGE ────────────────────────────────────────────────────────────
function ProductImage({toy}){
  const[failed,setFailed]=useState(false);
  const emoji=toy.dev_areas.includes("gross")?"🏃":toy.dev_areas.includes("sensory")?"🌈":toy.dev_areas.includes("language")?"📚":toy.dev_areas.includes("social")?"🤝":toy.dev_areas.includes("fine")?"✍️":"🧸";
  if(failed||!toy.img){
    return(<div style={{background:"#F8F6F0",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"28px 20px",borderBottom:`1px solid ${BORDER}`,minHeight:100,gap:6}}>
      <div style={{fontSize:40}}>{emoji}</div>
      <div style={{fontSize:11,color:MUTED}}>Image not available</div>
    </div>);
  }
  // Route through a CORS-friendly image proxy so images render in sandboxes and everywhere else.
  const proxied=toy.img?`https://images.weserv.nl/?url=${encodeURIComponent(toy.img.replace(/^https?:\/\//,""))}`:null;
  return(<div style={{background:"#F8F6F0",display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 20px 12px",borderBottom:`1px solid ${BORDER}`,minHeight:120}}>
    <img src={proxied} alt={toy.name} style={{maxHeight:180,maxWidth:"100%",objectFit:"contain"}} onError={(e)=>{if(e.target.src!==toy.img){e.target.src=toy.img;}else{setFailed(true);}}} loading="lazy"/>
  </div>);
}

// ─── FEEDBACK WIDGET ──────────────────────────────────────────────────────────
// ─── FREEBIE SIGNUP (Mailchimp) ───────────────────────────────────────────────
function FreebieSignup(){
  const[email,setEmail]=useState("");
  const[sending,setSending]=useState(false);
  const[done,setDone]=useState(false);
  const[error,setError]=useState("");

  async function subscribe(){
    const e=email.trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){setError("Please enter a valid email address.");return;}
    setSending(true);setError("");
    try{
      const res=await fetch("/api/subscribe",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:e}),
      });
      const data=await res.json();
      if(res.ok&&data.ok){setDone(true);try{if(window.parent&&window.parent!==window)window.parent.postMessage({type:"kidera:signup",list:"main",source:"toy-quiz"},"https://kidera.com.au");}catch(_){}}
      else{setError(data.error||"Could not sign up right now. Please try again.");}
    }catch{
      setError("Could not sign up right now. Please try again.");
    }finally{setSending(false);}
  }

  if(done){return(
    <div style={{background:`linear-gradient(135deg,${K_YELLOW}22,${K_GREEN}18)`,border:`1.5px solid ${K_GREEN}55`,borderRadius:16,padding:"22px 24px",marginTop:18,textAlign:"center"}}>
      <div style={{fontSize:30,marginBottom:8}}>🎉</div>
      <div style={{fontSize:16,fontWeight:800,color:TEXT,marginBottom:6}}>You're in! Check your inbox.</div>
      <div style={{fontSize:14,color:TEXT,lineHeight:1.6}}>Your freebies are on their way, and I'll see you in the monthly email. So glad to have you here.</div>
    </div>
  );}

  return(
    <div style={{background:`linear-gradient(135deg,${K_YELLOW}22,${K_BLUE}14)`,border:`1.5px solid ${K_YELLOW}`,borderRadius:16,padding:"24px",marginTop:18}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:30,marginBottom:8}}>🎁</div>
        <div style={{fontSize:18,fontWeight:800,color:TEXT,marginBottom:8}}>Want my free play resources?</div>
        <p style={{fontSize:14,color:TEXT,lineHeight:1.65,margin:"0 auto",maxWidth:440}}>
          Pop your email in to unlock my free resource library, including play guides, milestone checklists and the 30 Day Play Calendar. You'll also get my monthly email with play tips, toy recommendations, blog posts and new products. No spam, just the good stuff, and you can unsubscribe anytime.
        </p>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",maxWidth:460,margin:"0 auto"}}>
        <input
          type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
          onKeyDown={e=>{if(e.key==="Enter")subscribe();}}
          placeholder="you@email.com" disabled={sending}
          style={{flex:1,minWidth:180,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontSize:15,color:TEXT,outline:"none",boxSizing:"border-box",fontFamily:"system-ui",background:CARD}}/>
        <button onClick={subscribe} disabled={sending}
          style={{padding:"12px 22px",borderRadius:10,border:"none",background:sending?BORDER:K_GREEN,color:sending?MUTED:"#fff",fontSize:15,fontWeight:700,cursor:sending?"default":"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
          {sending?"Signing up...":"Send me the freebies"}
        </button>
      </div>
      {error&&<div style={{fontSize:13,color:K_PINK,marginTop:10,textAlign:"center"}}>{error}</div>}
      <p style={{fontSize:11,color:MUTED,marginTop:12,textAlign:"center"}}>By signing up you agree to receive emails from Kidera. Unsubscribe anytime.</p>
    </div>
  );
}

// ─── FEEDBACK WIDGET ──────────────────────────────────────────────────────────
function FeedbackWidget(){
  const[rating,setRating]=useState(0);const[hovered,setHovered]=useState(0);
  const[comment,setComment]=useState("");const[submitted,setSubmitted]=useState(false);
  const[sending,setSending]=useState(false);const[error,setError]=useState(false);

  const FORMSPREE_URL="https://formspree.io/f/xaqgbnnq";

  async function sendFeedback(){
    if(rating===0&&!comment.trim())return;
    setSending(true);setError(false);
    try{
      const res=await fetch(FORMSPREE_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({
          rating:rating>0?`${rating} out of 5`:"not given",
          comment:comment.trim()||"(none)",
          source:"Kidera Toy Quiz",
        }),
      });
      if(res.ok){setSubmitted(true);}
      else{setError(true);}
    }catch{
      setError(true);
    }finally{setSending(false);}
  }

  if(submitted){return(
    <div style={{background:"#F0FAF4",border:`1px solid ${K_GREEN}40`,borderRadius:12,padding:"16px 18px",marginTop:14,textAlign:"center"}}>
      <div style={{fontSize:22,marginBottom:6}}>💛</div>
      <div style={{fontSize:14,color:TEXT,fontWeight:600}}>Thank you so much!</div>
      <div style={{fontSize:13,color:MUTED,marginTop:4}}>Your feedback helps make this better for every family.</div>
    </div>
  );}
  return(<div style={{background:"#FFFDF7",border:`1px solid ${BORDER}`,borderRadius:12,padding:"18px 20px",marginTop:14}}>
    <div style={{fontSize:14,fontWeight:700,color:TEXT,marginBottom:4}}>How did you find this today?</div>
    <div style={{fontSize:13,color:MUTED,marginBottom:14}}>One word or a sentence is plenty. It helps a bunch!</div>
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[1,2,3,4,5].map(star=>(
        <button key={star} onClick={()=>setRating(star)} onMouseEnter={()=>setHovered(star)} onMouseLeave={()=>setHovered(0)}
          style={{fontSize:28,background:"none",border:"none",cursor:"pointer",padding:2,lineHeight:1,transition:"transform 0.1s",transform:(hovered||rating)>=star?"scale(1.2)":"scale(1)"}}>
          {(hovered||rating)>=star?"⭐":"☆"}
        </button>
      ))}
    </div>
    <textarea value={comment} onChange={e=>setComment(e.target.value)}
      placeholder="e.g. Really helpful, saved me so much time! / The picks were spot on / I wasn't sure about one of the suggestions..."
      style={{width:"100%",minHeight:72,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${BORDER}`,fontSize:14,lineHeight:1.6,color:TEXT,resize:"none",outline:"none",boxSizing:"border-box",fontFamily:"system-ui",background:CARD}}/>
    <button onClick={sendFeedback} disabled={(rating===0&&!comment.trim())||sending}
      style={{marginTop:10,padding:"9px 22px",borderRadius:10,border:"none",background:(rating>0||comment.trim())&&!sending?K_GREEN:BORDER,color:(rating>0||comment.trim())&&!sending?"#fff":MUTED,fontSize:14,fontWeight:600,cursor:(rating>0||comment.trim())&&!sending?"pointer":"default",transition:"all 0.2s"}}>
      {sending?"Sending...":"Send feedback"}
    </button>
    {error&&<div style={{fontSize:13,color:K_PINK,marginTop:10}}>Something went wrong sending that. Please try again in a moment.</div>}
  </div>);
}

// ─── LOADING SCREEN (rotating messages) ───────────────────────────────────────
function LoadingScreen(){
  const messages=[
    "Matching all the info you shared...",
    "Looking through Brittany's library...",
    "Lining up your picks...",
  ];
  const[i,setI]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setI(prev=>(prev+1)%messages.length),1600);
    return()=>clearInterval(t);
  },[]);
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",padding:"0 24px",textAlign:"center"}}>
      <img src={LOGO} alt="Kidera" style={{height:48,marginBottom:24}} onError={e=>{e.target.style.display="none";}}/>
      <div style={{fontSize:40,marginBottom:18,animation:"bounce 1s infinite"}}>🧸</div>
      <div style={{fontSize:18,color:TEXT,fontWeight:700,marginBottom:10}}>Finding your picks</div>
      <div key={i} style={{fontSize:15,color:K_GREEN,fontWeight:600,minHeight:22,animation:"fadeIn 0.5s ease"}}>{messages[i]}</div>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}


// The reply should be JSON. Take the outermost {...} so stray words or code
// fences around it don't break the page; return null if it still won't parse.
function parseAI(text){
  const t=String(text||"").replace(/```json|```/g,"");
  const a=t.indexOf("{"),b=t.lastIndexOf("}");
  if(a<0||b<=a)return null;
  const s=t.slice(a,b+1);
  try{return JSON.parse(s);}catch{ /* try the repair below */ }
  // Sonnet sometimes leaves a comma before a closing } or ], which JSON rejects.
  try{return JSON.parse(s.replace(/,\s*([}\]])/g,"$1"));}catch{return null;}
}

// Map AI output to the recs by explicit key (n), falling back to product-name match,
// so a shuffled or shifted AI response can never put text on the wrong card.
function normalizeAI(parsed, recs){
  if(parsed&&parsed.personalised_reasons)return parsed; // old shape, pass through
  if(parsed&&Array.isArray(parsed.items)){
    const byName=(p)=>parsed.items.find(x=>x.product&&(
      String(x.product).toLowerCase().includes(p.name.toLowerCase().slice(0,14))||
      p.name.toLowerCase().includes(String(x.product).toLowerCase().slice(0,14))
    ));
    const pick=(p,i)=>parsed.items.find(x=>Number(x.n)===i+1)||byName(p);
    return{
      personalised_reasons:recs.map((p,i)=>{const it=pick(p,i);return(it&&it.reason)||p.note;}),
      play_ideas:recs.map((p,i)=>{const it=pick(p,i);return(it&&it.play_idea)||"";}),
      curator_note:parsed.curator_note||"",
    };
  }
  return parsed;
}

// A last line of defence on what the AI writes. Prompts are instructions, not
// guarantees, and the panel test showed the model still promising "no small loose
// pieces" once. Any sentence that makes a safety promise, sends a family with a
// diagnosis to a GP, or uses a banned phrase is dropped or fixed here in code.
const SAFETY_PROMISE=/(\bsafe(ly)?\b|\b(no|without|free of|zero)\s+(small|loose|tiny|little)\s+(loose\s+)?(parts|pieces|bits)\b|choke|choking|safe for (babies|bubs|her|him|them|your)|completely safe|perfectly safe|totally safe|100% safe|designed (to be )?safe|safe to mouth|nothing (small|loose))/i;
const REFERRAL=/\b(gp|doctor|child health nurse|health nurse|paediatrician|pediatrician|speech pathologist|a professional|health professional)\b|get (it|him|her|them|this|that) checked|worth (checking|mentioning|raising)/i;
const STOCK_LINES=/\bno rush\b|\bplenty of time\b|\b(he|she|they)('ll| will) get there\b|develops? at (their|his|her|its) own pace|makes sense at (his|her|their|this) age|(completely|totally|perfectly|very) normal|normal (at|for) (his|her|their|this) age|will (come|catch up) (in time|soon|with time)|nothing to worry about/i;
const DEFICIT=/a change from (her|his|their) usual|instead of (lining|stimming|repeating)|(move|steer|get) (her|him|them) away from|break (the|her|his|their) habit/i;
const MOUTHING=/\bmouth(s|ing|ed)?\b/i;
// HARD RULE: no toy is ever described as something to mouth, chew, bite or suck
// unless it is a chew tool. This runs on every result, whatever the parent wrote.
const MOUTH_WORDS=/\b(mouth\w*|chew\w*|teeth\w*|teething|gnaw\w*|suck(s|ing)?\s+on|bit(e|es|ing)\s+(on|it|them|down))\b/i;
const isChewTool=p=>!!p&&(p.tags||[]).includes("chew");
// One child, not a category: no "classic ADHD", no "autistic kids love".
const GENERALISE=/\bclassic (adhd|autis\w*|asd|sensory)\b|\b(adhd|autistic|asd|sensory)[- ](kids?|children|brains?|combo|thing|trait)s?\b|\btypical (of )?(adhd|autis\w*)\b|\b(all|most|many) (adhd|autistic) (kids|children)\b/i;
const SALES=/\b(investment|worth every cent|pays for itself|must-have)\b/i;
const OUTCOME=/\b(build|builds|building|boost|boosts|improve|improves|strengthen|strengthens|develop|develops)\s+(her|his|their|your child's|real)?\s*(connection|confidence|resilience|focus|regulation|skills?|strength|coordination|attention|calm)\b|\binstead of worrying\b|\bwhen (the )?anxiety\b|\bsettle (her|his|their) (thoughts|mind|nerves|worries)\b|\bcalm(s|ing)? (her|him|them) down\b|\bhelps? (her|him|them) (relax|calm|cope|settle)\b|\bsettle\b[^.]{0,30}\bmind\b|\b(great|good|huge|brilliant|perfect|ideal) for (her |his |their )?(social|language|speech|fine|gross|motor|emotional|cause|problem|focus|attention|regulation|development)|\b(language|skill|confidence)[- ]building\b|\bconvert\w* (that |their |his |her )?screen time|\baway from the (device|screen)s?\b|\bsustained focus\b/i;
function splitSentences(t){return String(t||"").match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g)||[];}
function cleanText(t,answers,{isNote=false,fallback="",toy=null,recs=[]}={}){
  if(!t)return t;
  const dropReferral=professionalAlreadyInvolved(answers);
  const mouthing=hasMouthingSignals(answers);
  // In the note, chewing can only come up when a chew tool is one of the picks.
  const chewAllowed=isNote?recs.some(isChewTool):isChewTool(toy);
  let out=splitSentences(t).filter(x=>{
    if(SAFETY_PROMISE.test(x))return false;
    if(SALES.test(x)||OUTCOME.test(x))return false;
    if(DEFICIT.test(x)||GENERALISE.test(x))return false;
    if(MOUTH_WORDS.test(x)&&!(chewAllowed&&/chew/i.test(x)&&!MOUTHING.test(x)))return false;
    if(mouthing&&MOUTHING.test(x))return false;
    if(dropReferral&&REFERRAL.test(x))return false;
    if(isNote&&STOCK_LINES.test(x))return false;
    return true;
  }).join("").trim();
  if(answers.child_age>=60)out=out.replace(/\b(your |their )?(GP or (a |your )?)?child health nurse( or (a |your )?GP)?\b/gi,(m,pre)=>(pre||"")+"GP");
  out=out.replace(/\bnavigat(e|es|ing) (through|around)\b/gi,"get $2").replace(/\bnavigat(e|es|ing)\b/gi,"work out")
    .replace(/\ba game[- ]changer\b/gi,"a good fit").replace(/\bgame[- ]changer\b/gi,"good fit")
    .replace(/\s*\u2014\s*/g,", ").replace(/\s+[-\u2013]\s+/g,", ").replace(/\s{2,}/g," ");
  return out||fallback;
}
function sanitizeAI(ai,answers,recs=[]){
  if(!ai)return ai;
  const isGift=answers.recipient&&answers.recipient!=="my-child";
  let note=cleanText(ai.curator_note,answers,{isNote:true,recs});
  // Gift mode: the one to buy is always the Top pick on the page, never another.
  if(note&&isGift&&recs[0]){
    const top=recs[0].name.toLowerCase().slice(0,16);
    note=splitSentences(note).map(x=>/\b(only (buy|get|pick|choose|grab|go for) one|pick (just )?one|(can|could) only (buy|get|pick|choose)|one to (buy|get))\b/i.test(x)&&!x.toLowerCase().includes(top)
      ?`If you can only get one, I'd go with the ${recs[0].name}. `:x).join("").trim();
  }
  if(note&&!/\b(you|parents|they) know\b|\bknow\b[^.!?]{0,30}\bbest/i.test(note)){
    note=note+(isGift?" You and their family know them best.":" You know your child best.");
  }
  return{...ai,
    personalised_reasons:(ai.personalised_reasons||[]).map((r,i)=>cleanText(r,answers,{toy:recs[i],fallback:(recs[i]&&recs[i].note)||""})||(recs[i]&&recs[i].note)||""),
    play_ideas:(ai.play_ideas||[]).map((r,i)=>isGift?"":cleanText(r,answers,{toy:recs[i]})),
    curator_note:note,
  };
}

// ─── EMAIL GATE: unlock results ─────────────────────────────────
function EmailGate({recs,onUnlock,isGift}){
  const count=recs.length;
  const preview=recs.slice(0,2);
  const [email,setEmail] = useState("");
  const [busy,setBusy]   = useState(false);
  const [err,setErr]     = useState("");

  function detectSource(){
    try{
      const p = new URLSearchParams(window.location.search);
      let s = p.get("utm_source") || p.get("src") || "";
      if(!s && document.referrer){
        const r = document.referrer.toLowerCase();
        if(r.indexOf("tiktok")>-1) s = "tiktok";
        else if(r.indexOf("instagram")>-1) s = "instagram";
        else if(r.indexOf("facebook")>-1) s = "facebook";
        else if(r.indexOf("pinterest")>-1) s = "pinterest";
      }
      s = (s || "direct").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,24);
      return "quiz-src-" + s;
    }catch(e){ return "quiz-src-unknown"; }
  }

  async function submit(e){
    e.preventDefault();
    if(busy) return;
    const clean = email.trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)){ setErr("Please enter a valid email address."); return; }
    setErr(""); setBusy(true);
    try{
      const res = await fetch("/api/subscribe",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email:clean, tags:["quiz-gated", detectSource()] })
      });
      let data = {};
      try{ data = await res.json(); }catch(e2){}
      if(res.ok){ try{if(window.parent&&window.parent!==window)window.parent.postMessage({type:"kidera:signup",list:"main",source:"toy-quiz"},"https://kidera.com.au");}catch(_){} onUnlock(); return; }
      if(res.status >= 500){ onUnlock(); return; }
      setBusy(false);
      setErr((data && data.error) ? data.error : "Could not sign you up right now. Please try again.");
    }catch(e3){
      onUnlock();
    }
  }

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"system-ui,sans-serif",paddingBottom:60}}>
      <div style={{background:K_YELLOW,padding:"28px 24px",textAlign:"center"}}>
        <img src={LOGO} alt="Kidera" style={{height:56,objectFit:"contain",marginBottom:10}} onError={(e)=>{e.target.style.display="none";}}/>
        <h1 style={{fontSize:"clamp(18px,4vw,26px)",fontWeight:800,color:TEXT,margin:"0 0 6px"}}>Your picks are ready</h1>
        <p style={{fontSize:14,color:TEXT,margin:0,opacity:0.75}}>
          Here are the top {preview.length} of {count}, matched {isGift ? "to this child" : "to your child"} from a library chosen by a paediatric OT.
        </p>
      </div>
      <div style={{maxWidth:560,margin:"0 auto",padding:"0 20px"}}>
        {preview.map((toy,i)=>(
          <div key={toy.id} style={{background:CARD,borderRadius:16,border:"1px solid "+BORDER,marginTop:18,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <ProductImage toy={toy}/>
            <div style={{padding:"16px 20px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:i===0?K_GREEN:BORDER,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"#fff":MUTED,flexShrink:0}}>{i+1}</div>
                {i===0&&<div style={{fontSize:11,color:K_GREEN,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700}}>Top pick</div>}
                <div style={{fontSize:13,color:MUTED,marginLeft:"auto",fontWeight:600}}>~${fmtPrice(toy.price)} AUD</div>
              </div>
              <h2 style={{fontSize:16,fontWeight:700,color:TEXT,margin:"0 0 6px",lineHeight:1.3}}>{toy.name}</h2>
              <p style={{fontSize:14,color:TEXT,lineHeight:1.6,margin:0}}><strong>Brittany's note:</strong> {toy.note}</p>
            </div>
          </div>
        ))}
        {count>preview.length&&(
          <div style={{display:"flex",gap:8,marginTop:14}}>
            {recs.slice(preview.length).map((toy,i)=>(
              <div key={toy.id} aria-hidden="true" style={{flex:1,height:64,borderRadius:12,border:"1px dashed "+BORDER,background:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:MUTED,fontWeight:700}}>Pick {preview.length+i+1} 🔒</div>
            ))}
          </div>
        )}
        <div style={{background:CARD,border:"1px solid "+BORDER,borderRadius:16,padding:"24px 20px",marginTop:18}}>
          <h2 style={{fontSize:18,fontWeight:800,color:TEXT,margin:"0 0 8px"}}>See all {count} picks</h2>
          <p style={{fontSize:15,color:TEXT,margin:"0 0 10px",lineHeight:1.5}}>
            Pop in your email to see all {count}, with direct links{isGift ? "" : ", play ideas"} and why each one suits {isGift ? "this child" : "your child"}.
          </p>
          <p style={{fontSize:15,color:TEXT,margin:"0 0 14px",lineHeight:1.5}}>
            Already have one, or it's not quite right? Once you're in, you can swap any pick and I'll find another one based on your answers.
          </p>
          <form onSubmit={submit} noValidate>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email"
              style={{width:"100%",boxSizing:"border-box",padding:"14px 16px",fontSize:16,borderRadius:12,border:"1px solid "+BORDER,background:"#FFFFFF",color:TEXT,outline:"none",marginBottom:10}}/>
            {err ? <p role="alert" style={{color:K_PINK,fontSize:13,margin:"0 0 10px"}}>{err}</p> : null}
            <button type="submit" disabled={busy}
              style={{width:"100%",padding:"15px 18px",fontSize:16,fontWeight:800,borderRadius:12,border:"none",cursor:busy?"default":"pointer",background:busy?MUTED:K_GREEN,color:"#FFFFFF"}}>
              {busy ? "Unlocking..." : `Show me all ${count} picks`}
            </button>
          </form>
          <p style={{fontSize:12,color:MUTED,margin:"12px 0 0",lineHeight:1.5}}>
            You'll also get my monthly play and toy ideas, written by me. No spam, unsubscribe any time, and I'll never share your email.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function KideraToyQuiz(){
  const[step,setStep]=useState(0);const[answers,setAnswers]=useState({});
  const[result,setResult]=useState(null);const[gateOpen,setGateOpen]=useState(false);const[loading,setLoading]=useState(false);
  const[swappingIndex,setSwappingIndex]=useState(null);const[excludedIds,setExcludedIds]=useState([]);
  const runRef=useRef(null);

  const current=STEPS[step];
  const isGift=answers.recipient&&answers.recipient!=="my-child";
  const adapt=(t)=>{if(!t||!isGift)return t;return t.replace(/your child/g,"this child").replace(/Your child/g,"This child");};const progress=(step/STEPS.length)*100;

  function setSingle(id,value){setAnswers(p=>({...p,[id]:value}));}
  function toggleMulti(id,value){setAnswers(p=>{const ex=p[id]||[];return ex.includes(value)?{...p,[id]:ex.filter(v=>v!==value)}:{...p,[id]:[...ex,value]};});}

  function canAdvance(){
    if(current.optional)return true;
    const a=answers[current.id];
    if(current.type==="text")return a&&a.trim().length>2;
    if(current.type==="single")return a!==undefined&&a!==null;
    if(current.type==="multi")return a&&a.length>0;
    return false;
  }

  async function callAI(recs,singleIndex=null){
    const isGift=!!(answers.recipient&&answers.recipient!=="my-child");
    const mouthing=hasMouthingSignals(answers);
    const summary=`Child's age: ${ageLabel(answers.child_age)}
Buying for: ${isGift?"a child who is NOT their own (this is a present)":"their own child"}
Occasion: ${Array.isArray(answers.occasion)?(answers.occasion.join(", ")||"not specified"):(answers.occasion||"not specified")}. Budget: ${answers.budget}.
What they wrote about the child: "${answers.child_snapshot||"nothing"}"
Interests ticked: ${(answers.interests||[]).filter(v=>v!=="not-sure").join(", ")||"none"}
Areas they'd like to support: ${(answers.dev_focus||[]).join(", ")||"none"}
How the child likes to play: ${(answers.play_style||[]).filter(v=>v!=="not-sure").join(", ")||"not specified"}
Already have plenty of: ${(answers.already_have||[]).join(", ")||"nothing specified"}
Anything else: ${answers.wildcard||"nothing"}${gapThemes(answers,recs).length?`
Not in Brittany's library yet: ${joinList(gapThemes(answers,recs))} toys. None of the five toys is one, so never say or hint that a toy covers ${gapThemes(answers,recs).length>1?"them":"it"}, in the reasons or the note. The page tells them about the gap separately.`:""}`;

    const VOICE=`HOW BRITTANY WRITES
Warm, practical and Australian, like a friend who happens to be an OT. Plain words, short sentences, one idea per sentence. Name the actual toy, the actual thing the child does with it, and the actual interest the parent mentioned. Australian spelling (colour, favourite, mum). No em dashes. No rhetorical questions. Never write "it's not X, it's Y". Never use these words: delve, crucial, pivotal, tapestry, foundational, robust, seamless, seamlessly, landscape, realm, elevate, unlock, harness, journey, game-changer, dive in, navigate, fostering, ensuring, empowering, testament, workhorse, arsenal, toolkit, must-have, investment, worth every cent, mesmerising.`;

    const RULES=`HARD RULES. These override everything else.
1. MOUTHING. Never suggest, describe or hint at a child putting a toy in their mouth, chewing it, biting it or sucking it, unless that toy is marked [CHEW TOOL]. This holds even when the parent says their child mouths or chews things. No "he can mouth them", no "something for his hands and mouth". For every other toy, talk about hands, eyes, ears and body only.
2. SAFETY. Never say or imply a toy is safe, choke-free, sturdy, or free of small parts. You haven't seen the box.
3. NO HEALTH CLAIMS. Brittany is an AHPRA registered health practitioner, so nothing may promise or imply a health or developmental outcome. Never say a toy builds, develops, improves, strengthens, boosts, supports, promotes, teaches or helps a skill. Never call a toy calming, regulating or therapeutic, and never say it eases worry, helps with sleep or settles a busy mind. Describe what the child DOES ("he squeezes the tongs to grab each bug") and let the parent join the dots. "Great for hand strength" is out.
4. ONLY WHAT THEY SAID. Use only what the parent typed or ticked. Don't describe the child's personality beyond their words. Don't say the child already owns something unless the parent said so. Never generalise about a diagnosis ("classic ADHD", "autistic kids love") and talk about this one child only. Never guess an interest from the toy list.
5. ONLY WHAT THE TOY DOES. Describe only what that toy's listing says. Brittany's listing notes sometimes mention other products or her own opinion; describe this toy, not the others. If a listing is thin, keep the reason simple rather than filling gaps. Think through how the toy or game really works before you write. Most games mean taking turns (board games, card games, cornhole, Connect 4), so never say a game has no turns or no waiting. Something that launches straight up can't be steered. Don't add lights, sounds or moving parts the listing doesn't mention.
6. RESPECT. Lining things up, repetition, stimming, special interests, playing alone and screens are all fine. Never pitch a toy as a way to move a child away from any of them.`;

    const PLAY=`Every toy gets a play idea, all five of them. Play ideas are one sentence each: specific, active and a little playful, like Brittany's 30 Day Play Calendar ("Set up a dinosaur hospital where the T-Rex needs the doctor kit to fix his leg." "Take it outside and draw a chalk road for the trucks."). It must work with that exact toy in a real house or park, and it must fit the child the parent described:
- Few words or a late talker: offer two choices or let them point or show, and give the grown-up one word to say as they play, then a pause ("say 'splash!' and wait"). If the parent mentions signs, the grown-up signs the word as well. The fun never depends on the child saying a word.
- A worrier or a perfectionist: keep it low stakes. No timers, scores or races.
- Nothing messy in bed. Anything that launches or flies goes to a park or oval.${mouthing?`
- No loose small extras, like beads, buttons, coins, dry pasta or rice, or water beads.`:""}`;

    const markers=(p)=>`${(p.tags||[]).includes("chew")?" [CHEW TOOL: made to be chewed]":""}${/learning tower|step stool|cutlery|open cup|potty|toilet seat|dressing doll/i.test(p.name)||["p120","p121","p122","p123","p124"].includes(p.id)?" [EVERYDAY EQUIPMENT]":""}`;
    const devLabelMap={gross:"gross motor",fine:"fine motor",cognitive:"problem-solving and learning",language:"communication and language",social:"social and emotional skills",sensory:"sensory",selfcare:"self-care and independence","sensory-tools":"sensory tools"};

    if(singleIndex!==null){
      const toy=recs[singleIndex];
      const prompt=`You are writing one card for Kidera's toy quiz, in the voice of Brittany Hulme, a paediatric OT in Perth and Kidera's founder. The parent swapped a toy, and this is the replacement. It's a toy guide, about play, not therapy.

WHAT THEY TOLD US
${summary}

THE TOY: ${toy.name}${markers(toy)}. Areas: ${toy.dev_areas.map(d=>devLabelMap[d]||d).join(", ")}. What it is: ${toy.note}

${VOICE}

${RULES}

Write a reason of one or two sentences on why this toy suits this child, using what the parent told us and only the toy's real features.${isGift?` This is a present, so say "this little one" or the child's name, never "your child", and leave play_idea as an empty string.`:`
${PLAY}`}

JSON only: {"reason":"...","play_idea":"..."}`;
      const res=await fetch("/api/personalise",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({max_tokens:400,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const one=parseAI(data.content.map(b=>b.text||"").join(""))||{};
      return{reason:cleanText(one.reason,answers,{toy,fallback:toy.note}),play_idea:isGift?"":cleanText(one.play_idea||"",answers,{toy})};
    }

    const productList=recs.map((p,i)=>`${i+1}. ${p.name} ($${fmtPrice(p.price)})${markers(p)}. Areas: ${p.dev_areas.map(d=>devLabelMap[d]||d).join(", ")}. What it is: ${p.note}`).join("\n");
    const goalsList=(answers.dev_focus||[]).filter(g=>g!=="no-preference").map(g=>devLabelMap[g]||g).join(", ");
    const referral=professionalAlreadyInvolved(answers)
      ?"They've told us about a diagnosis, a professional who is already involved, or a waitlist. Don't suggest a GP, nurse or any professional, and don't suggest getting anything checked."
      :(answers.child_age>=60
        ?"If they named a worry about how their child is going, you may say once, briefly, that it's worth raising with their GP. Nothing more, and no child health nurse at this age."
        :"If they named a worry about how their child is going, you may say once, briefly, that it's worth raising with their GP or child health nurse. Nothing more.");

    const prompt=`You are writing the results page for Kidera's toy quiz, in the voice of Brittany Hulme, a paediatric occupational therapist in Perth and the founder of Kidera. Someone has told us about a child, and the quiz has matched five toys from Brittany's own library. Your job is to tell them, toy by toy, why it suits this child${isGift?"":" and how to play with it"}. This is a toy guide. It's about play, not therapy, and it doesn't need to solve anything.

WHAT THEY TOLD US
${summary}

THE FIVE TOYS (in order, and toy 1 is the Top pick)
${productList}

${VOICE}

${RULES}

THE REASONS (one per toy, two or three sentences)
Lead with why this toy suits THIS child: an interest they named, how they like to play, their age, or an area they picked. Say the link plainly ("You said she loves buttons, and this board is covered in them"). If a toy covers more than one area they picked, say so by describing what the child does. Only name an area if it's in that toy's areas list. ${goalsList?`They picked: ${goalsList}. Across the five reasons, pick up each of these at least once where a toy honestly fits, and leave out any that don't.`:"They didn't pick any areas, so lean on their interests and the child's age."}
If a pick doesn't match a stated interest, don't stretch it to fit. Say what it is and why it's a good one at this age.
If they typed a worry (talking, sleep, meltdowns, toileting), you don't need to fix it. Mention it only where a toy really connects through play, and never promise anything.
Every toy gets its own point. Don't repeat a reason across toys, and don't lean on the same phrase (like "lots to talk about") more than once.

${isGift?`THE PLAY IDEAS
This is a present, so leave every play_idea as an empty string.`:`THE PLAY IDEAS
${PLAY}
For toys marked [EVERYDAY EQUIPMENT] (step stools, cutlery, cups, potty seats, dressing dolls), the play idea brings it into play, like a teddy bear picnic with the cutlery, and the reason can mention where it gets used in the day.`}

BRITTANY'S NOTE (two or three sentences)
Speak to this ${isGift?"gift-giver":"family"}. Mention something specific they wrote, or if they wrote very little, the child's age (${ageLabel(answers.child_age)}), what they ticked, or the occasion. Keep it about the child and the toys. The toys come from Brittany's library and this list was matched from it, so don't say she hand-picked this list for them.
If they mentioned a worry, you can acknowledge it in plain words. Don't predict how it will go, don't say it's normal or that it will come with time, and never say there's nothing to worry about. ${referral} If it fits, you can add one small, everyday idea related to it (for talking: "When she points, say the word for her and leave a little pause."), written as an idea and never a fix.
${isGift?`This is a present for someone else's child. Say "this little one" or the child's name, never "your child". Don't praise the gift-giver for being thoughtful. If they can only buy one, say you'd go with "${recs[0]&&recs[0].name}" (toy 1, the Top pick) and why, in one sentence, and never name a different toy as the one to buy. If they named a show or character, tie it in honestly. End with one short line that they and the child's family know this child best.`:`End with one short line, in Brittany's words, that they know their child best. Never use "develops at their own pace" or anything like it.`}
${hasDelaySignals(answers)?`
Some picks may be rated for younger children on purpose, to meet this child where they are right now. Talk about what this child enjoys and can do, never about age, and never call a toy babyish, simple or for younger kids.
`:""}${recs.some(r=>(r.tags||[]).includes("deep-pressure"))?`
For the weighted item only (the one tagged for deep pressure), add that they should check the weight guidance on the listing. Don't add this to any other toy.
`:""}
FORMAT
Number the items to match the toy list exactly: n=1 is toy 1, and so on. Put the toy's name in "product" as a check. JSON only, no markdown:
{"items":[{"n":1,"product":"...","reason":"...","play_idea":"..."},{"n":2,"product":"...","reason":"...","play_idea":"..."},{"n":3,"product":"...","reason":"...","play_idea":"..."},{"n":4,"product":"...","reason":"...","play_idea":"..."},{"n":5,"product":"...","reason":"...","play_idea":"..."}],"curator_note":"..."}`;

    // Ask once, and if the reply isn't clean JSON, ask one more time before
    // falling back to Brittany's own notes. (The API allows one call per 2 seconds.)
    const ask=async()=>{const res=await fetch("/api/personalise",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({max_tokens:2000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();return parseAI((data.content||[]).map(b=>b.text||"").join(""));};
    let parsed=await ask().catch(()=>null);
    if(!parsed||!Array.isArray(parsed.items)){await new Promise(r=>setTimeout(r,2100));parsed=await ask();}
    if(!parsed)throw new Error("Unreadable reply");
    return sanitizeAI(normalizeAI(parsed,recs),answers,recs);
  }

  async function handleSubmit(){
    setLoading(true);
    const run={};runRef.current=run;
    const recs=getRecommendations(answers,5,excludedIds);
    const fallback={personalised_reasons:recs.map(p=>p.note),play_ideas:recs.map(()=>""),curator_note:"These picks are matched to the age, interests and goals you told me about. You know them best."};
    const build=(o)=>o.ok?{recs,play_ideas:o.ai.play_ideas||recs.map(()=>""),...o.ai,pending:false}:{recs,...fallback,pending:false};
    let done=null;
    const aiRun=callAI(recs).then(ai=>{done={ok:true,ai};},()=>{done={ok:false};});
    // A short pause so the loading screen doesn't flash, then straight to the picks.
    await new Promise(r=>setTimeout(r,1500));
    if(runRef.current!==run)return;
    setResult(done?build(done):{recs,...fallback,pending:true});
    setLoading(false);
    await aiRun;
    if(runRef.current!==run)return;
    setResult(prev=>prev&&prev.pending&&prev.recs===recs?build(done):prev);
  }

  async function handleSwap(index){
    const toReplace=result.recs[index];
    const newExcluded=[...excludedIds,toReplace.id];
    const keptIds=result.recs.filter((_,i)=>i!==index).map(r=>r.id);
    setExcludedIds(newExcluded);setSwappingIndex(index);
    try{
      const replacement=getRecommendations({...answers},1,[...newExcluded,...keptIds],result.recs.filter((_,i)=>i!==index));
      if(!replacement.length){setSwappingIndex(null);return;}
      const newToy=replacement[0];
      let reason=newToy.note;let playIdea="";
      try{const ai=await callAI([newToy],0);reason=ai.reason||newToy.note;playIdea=ai.play_idea||"";}catch{}
      setResult(prev=>{
        const newRecs=[...prev.recs];newRecs[index]=newToy;
        const newReasons=[...prev.personalised_reasons];newReasons[index]=reason;
        const newPlayIdeas=[...(prev.play_ideas||[])];newPlayIdeas[index]=playIdea;
        return{...prev,recs:newRecs,personalised_reasons:newReasons,play_ideas:newPlayIdeas};
      });
    }finally{setSwappingIndex(null);}
  }

  function reset(){runRef.current=null;setStep(0);setAnswers({});setResult(null);setGateOpen(false);setLoading(false);setSwappingIndex(null);setExcludedIds([]);}

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if(result&&!gateOpen)return(<EmailGate recs={result.recs||[]} isGift={isGift} onUnlock={()=>{setGateOpen(true);try{window.scrollTo(0,0);}catch{ /* not in a browser */ }}}/>);

  if(result)return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"system-ui,sans-serif",paddingBottom:60}}>
      <div style={{background:K_YELLOW,padding:"28px 24px",textAlign:"center"}}>
        <img src={LOGO} alt="Kidera" style={{height:56,objectFit:"contain",marginBottom:10}} onError={e=>{e.target.style.display="none";}}/>
        <h1 style={{fontSize:"clamp(18px,4vw,26px)",fontWeight:800,color:TEXT,margin:"0 0 6px"}}>Your personalised toy picks</h1>
        <p style={{fontSize:14,color:TEXT,margin:0,opacity:0.7}}>{isGift?"Picked for this child from a library chosen by a paediatric OT":"Picked for your child from a library chosen by a paediatric OT"}</p>
        {budgetLine(answers.budget)&&<p style={{fontSize:13,color:TEXT,margin:"6px 0 0",opacity:0.7}}>{budgetLine(answers.budget)}</p>}
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"0 20px"}}>
        <div style={{background:`${K_BLUE}14`,border:`1px solid ${K_BLUE}44`,borderRadius:12,padding:"11px 15px",marginTop:16,fontSize:13.5,color:TEXT,lineHeight:1.5}}>
          Results feeling too similar, or want a different option? Hit the <strong>Swap</strong> button on any card to trade it for another pick.
        </div>
        {isGift&&(
          <div style={{background:`${K_GREEN}12`,border:`1px solid ${K_GREEN}44`,borderRadius:12,padding:"11px 15px",marginTop:12,fontSize:13.5,color:TEXT,lineHeight:1.5}}>
            Shopping in person? Many of these, or something very close, are at Big W, Kmart, Target or a local toy shop. Take the name with you and ask.
          </div>
        )}
        {hasMouthingSignals(answers)&&(
          <div style={{background:`${K_YELLOW}2E`,border:`1px solid ${K_YELLOW}`,borderRadius:12,padding:"11px 15px",marginTop:12,fontSize:13.5,color:TEXT,lineHeight:1.5}}>
            {(answers.child_age||0)<13
              ?"You mentioned mouthing. Babies explore with their mouths, so check each listing says it suits your baby's age before you hand it over."
              :"You mentioned mouthing or small parts. These picks go by the maker's age rating, and anything rated 3 and up can still have small pieces in it. Check each listing yourself before you hand it over. Only a toy sold as a chew tool is made to go in the mouth."}
          </div>
        )}
        {result.recs.map((toy,i)=>(
          <div key={`${toy.id}-${i}`} style={{background:CARD,borderRadius:16,border:`1px solid ${BORDER}`,marginTop:20,boxShadow:"0 2px 8px rgba(0,0,0,0.05)",overflow:"hidden",opacity:swappingIndex===i?0.45:1,transition:"opacity 0.25s"}}>
            <ProductImage toy={toy}/>
            <div style={{padding:"18px 22px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:i===0?K_GREEN:BORDER,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"#fff":MUTED,flexShrink:0}}>{i+1}</div>
                {i===0&&<div style={{fontSize:11,color:K_GREEN,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700}}>Top pick</div>}
                <div style={{fontSize:13,color:MUTED,marginLeft:"auto",fontWeight:600}}>~${fmtPrice(toy.price)} AUD</div>
              </div>
              <h2 style={{fontSize:16,fontWeight:700,color:TEXT,margin:"0 0 8px",lineHeight:1.3}}>{toy.name}</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                {chipAreas(toy,answers).map(a=>(<span key={a} style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:`${DEV_COLOURS[a]}22`,color:DEV_COLOURS[a],fontWeight:600,border:`1px solid ${DEV_COLOURS[a]}44`}}>{DEV_LABELS[a]}</span>))}
              </div>
              <p style={{fontSize:14,color:result.pending?MUTED:TEXT,lineHeight:1.7,margin:"0 0 10px"}}>{result.personalised_reasons[i]}</p>
              {result.pending&&<p style={{fontSize:12.5,color:K_GREEN,fontWeight:600,margin:"-4px 0 12px"}}>Writing why this one suits {isGift?"them":"your child"}...</p>}
              {!result.pending&&result.play_ideas&&result.play_ideas[i]&&(
                <div style={{background:`${K_GREEN}12`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,flexShrink:0}}>💡</span>
                  <p style={{fontSize:13,color:TEXT,lineHeight:1.6,margin:0}}><strong>Play idea:</strong> {result.play_ideas[i]}</p>
                </div>
              )}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <a href={buildUrl(toy)} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:6,background:K_YELLOW,color:TEXT,fontWeight:700,fontSize:13,padding:"9px 18px",borderRadius:10,textDecoration:"none"}}>
                  View on Amazon AU
                </a>
                <button onClick={()=>handleSwap(i)} disabled={swappingIndex!==null||!!result.pending}
                  style={{fontSize:13,color:MUTED,background:"none",border:`1px solid ${BORDER}`,borderRadius:8,padding:"9px 14px",cursor:swappingIndex!==null||result.pending?"default":"pointer",opacity:result.pending?0.5:1}}>
                  {swappingIndex===i?"Finding a swap...":"🔄 Swap this (already have it or not quite right)"}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{background:"#FFFBEE",border:`1.5px solid ${K_YELLOW}`,borderRadius:16,padding:24,marginTop:24}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <img src={BRITTANY_PHOTO} alt="Brittany Hulme" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:`2px solid ${K_YELLOW}`,flexShrink:0}} onError={e=>{e.target.style.display="none";}}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:TEXT}}>Brittany Hulme</div>
              <div style={{fontSize:12,color:MUTED}}>Paediatric OT and Kidera founder</div>
            </div>
          </div>
          <p style={{fontSize:14,lineHeight:1.8,color:result.pending?MUTED:TEXT,margin:"0 0 10px"}}>{result.pending?"Writing my note for you. It'll pop up here in a few seconds.":result.curator_note}</p>
          {libraryGapLine(answers,result.recs)&&<p style={{fontSize:14,lineHeight:1.8,color:TEXT,margin:"0 0 10px"}}>{libraryGapLine(answers,result.recs)}</p>}
          <p style={{fontSize:12,color:MUTED,margin:0}}>Questions? <a href="mailto:brittany@kidera.com.au" style={{color:K_GREEN}}>brittany@kidera.com.au</a></p>
        </div>

        <div style={{background:"#F9F7F0",borderRadius:12,padding:"14px 18px",marginTop:14,fontSize:12,color:MUTED,lineHeight:1.7}}>
          <p style={{margin:"0 0 6px"}}><strong>Affiliate disclosure:</strong> Links above are Amazon AU affiliate links. Kidera earns a small commission at no extra cost to you.</p>
          <p style={{margin:"0 0 8px"}}>Prices shown are our best estimate and can change without notice, so double-check on Amazon before you buy.</p>
          <p style={{margin:0}}>This quiz was built and curated by Brittany using her professional OT expertise and knowledge of child development. It uses smart technology to personalise results, and while every recommendation has been carefully considered, these are a starting point rather than a definitive guide. {isGift?"Their parents know them best.":"You know your child best."}</p>
        </div>


        <FeedbackWidget/>

        <div style={{display:"flex",gap:12,marginTop:22,flexWrap:"wrap"}}>
          <button onClick={reset} style={{flex:1,padding:"13px",background:"transparent",border:`1.5px solid ${BORDER}`,borderRadius:12,fontSize:15,color:MUTED,cursor:"pointer",minWidth:140}}>Start again</button>
          <a href="https://kidera.com.au" target="_blank" rel="noopener noreferrer"
            style={{flex:1,padding:"13px",background:K_GREEN,borderRadius:12,fontSize:15,fontWeight:700,color:"#fff",textDecoration:"none",textAlign:"center",minWidth:140}}>Visit Kidera</a>
        </div>
      </div>
    </div>
  );

  if(loading)return <LoadingScreen/>;

  const isLast=step===STEPS.length-1;
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:K_YELLOW,padding:"12px 24px"}}>
        <div style={{maxWidth:640,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <img src={LOGO} alt="Kidera" style={{height:34,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
          <div style={{fontSize:13,color:TEXT,opacity:0.7}}>{step+1} of {STEPS.length}</div>
        </div>
      </div>
      <div style={{height:4,background:"#EDE9DC"}}>
        <div style={{height:"100%",width:`${progress+100/STEPS.length}%`,background:K_GREEN,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px 20px 24px"}}>
        <h2 style={{fontSize:"clamp(20px,5vw,26px)",fontWeight:700,color:TEXT,margin:"0 0 6px",lineHeight:1.3}}>{adapt(current.question)}</h2>
        <p style={{fontSize:15,color:MUTED,margin:"0 0 26px",lineHeight:1.5}}>{adapt(current.subtitle)}</p>

        {current.type==="single"&&(
          <div style={{display:"grid",gap:10}}>
            {current.options.filter(o=>{const a=answers.child_age;if(a==null)return true;return(!o.minAge||a>=o.minAge)&&(!o.maxAge||a<=o.maxAge);}).map(opt=>{
              const sel=answers[current.id]===opt.value;
              return(<button key={opt.value} onClick={()=>setSingle(current.id,opt.value)}
                style={{textAlign:"left",padding:"13px 16px",borderRadius:12,border:`2px solid ${sel?K_GREEN:BORDER}`,background:sel?`${K_GREEN}14`:CARD,cursor:"pointer",fontSize:15,color:TEXT,display:"flex",alignItems:"center",gap:10,transition:"all 0.15s"}}>
                {opt.emoji&&<span style={{fontSize:22,flexShrink:0}}>{opt.emoji}</span>}
                <span style={{fontWeight:sel?700:400}}>{opt.label}</span>
                {sel&&<span style={{marginLeft:"auto",color:K_GREEN,fontSize:18}}>✓</span>}
              </button>);
            })}
          </div>
        )}

        {current.type==="multi"&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {current.options.filter(o=>{const a=answers.child_age;if(a==null)return true;return(!o.minAge||a>=o.minAge)&&(!o.maxAge||a<=o.maxAge);}).map(opt=>{
              const sel=(answers[current.id]||[]).includes(opt.value);
              return(<button key={opt.value} onClick={()=>toggleMulti(current.id,opt.value)}
                style={{padding:"10px 16px",borderRadius:24,border:`2px solid ${sel?K_GREEN:BORDER}`,background:sel?`${K_GREEN}15`:CARD,cursor:"pointer",fontSize:14,color:sel?TEXT:MUTED,fontWeight:sel?700:400,transition:"all 0.15s"}}>
                {opt.label}
              </button>);
            })}
          </div>
        )}

        {current.type==="text"&&(
          <div>
            <textarea value={answers[current.id]||""} onChange={e=>setSingle(current.id,e.target.value)} placeholder={current.id==="child_snapshot"?snapshotPlaceholder(answers.child_age):current.placeholder}
              style={{width:"100%",minHeight:current.id==="child_snapshot"?140:100,padding:"14px 16px",borderRadius:12,border:`2px solid ${BORDER}`,fontSize:15,lineHeight:1.6,background:CARD,color:TEXT,resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"system-ui"}}/>
            {current.optional&&<p style={{fontSize:13,color:MUTED,marginTop:6}}>{current.optionalNote||"Optional. Skip if nothing comes to mind."}</p>}
          </div>
        )}

        <div style={{display:"flex",gap:12,marginTop:32}}>
          {step>0&&(<button onClick={()=>setStep(s=>s-1)}
            style={{padding:"13px 22px",borderRadius:12,border:`2px solid ${BORDER}`,background:"transparent",fontSize:15,color:MUTED,cursor:"pointer"}}>Back</button>)}
          <button onClick={()=>isLast?handleSubmit():setStep(s=>s+1)} disabled={!canAdvance()}
            style={{flex:1,padding:"13px 22px",borderRadius:12,border:"none",background:canAdvance()?K_GREEN:BORDER,color:canAdvance()?"#fff":MUTED,fontSize:15,fontWeight:700,cursor:canAdvance()?"pointer":"default",transition:"all 0.2s"}}>
            {isLast?"Show me my picks! 🎁":"Next"}
          </button>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,padding:"14px 24px",textAlign:"center"}}>
        <div style={{fontSize:12,color:MUTED}}>Recommendations by Brittany Hulme, Paediatric OT and Kidera founder.</div>
      </div>
    </div>
  );
}
