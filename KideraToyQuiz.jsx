import { useState, useEffect } from "react";

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
    note:"A favourite for tummy time. It keeps babies engaged long enough to actually build that core strength.",
    search:"Young Wonderer Sensory Water Mat tummy time"
  },
  {
    id:"p3", fam:"water-mat", name:"High Contrast Black & White Tummy Time Water Mat", age_min:0, age_max:12,
    dev_areas:["sensory","gross"], tags:["tummy-time","water","visual"],
    price:24.99, asin:"B0DBH9PSP2", afflink:"https://www.amazon.com.au/dp/B0DBH9PSP2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71dCRSG7tWL._AC_SX679_.jpg",
    note:"Black and white, sensory, tummy time — everything a newborn needs in one mat.",
    search:"High Contrast Black White Tummy Time Water Mat Young Wonderer"
  },
  // 4-12 months
  {
    id:"p4", name:"Crawling Crab Baby Toy with Music & Lights", age_min:4, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["cause-effect","crawling","movement"],
    price:22.99, asin:"B09TS9BLGS", afflink:"https://www.amazon.com.au/dp/B09TS9BLGS/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61ey5f2SteL._AC_SX679_.jpg",
    note:"Moves side to side and lights up — babies track it with their eyes and crawl after it. Great neck and core workout.",
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
    note:"Buttons, shapes, music and flaps — lots of ways for little hands to explore cause and effect.",
    search:"VTech Turn Learn Cube 150503"
  },
  {
    id:"p7", name:"VTech Light and Move Learning Ball", age_min:6, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["cause-effect","crawling","movement"],
    price:20, asin:"B01D2TC31Y", afflink:"https://www.amazon.com.au/dp/B01D2TC31Y/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71toQH2A1hL._AC_SX679_.jpg",
    note:"Rolls away and lights up — babies crawl after it without realising they're doing gross motor work.",
    search:"VTech Light Move Learning Ball crawl"
  },
  {
    id:"p8", name:"Young Wonderer Hanging Sensory Toy (Brooklyn the Bear)", age_min:0, age_max:6,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","visual","grasping"],
    price:21.99, asin:"B0FG8FKQ9D", afflink:"https://www.amazon.com.au/dp/B0FG8FKQ9D/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61TAdRAnNPL._AC_SX679_.jpg",
    note:"Hangs on a pram or cot. Textures, crinkle sounds, and faces for early visual tracking and grasping.",
    search:"Young Wonderer Hanging Sensory Toy Brooklyn Bear"
  },
  // 9-18 months
  {
    id:"p9", name:"INFANTINO Bop & Drop Ball Tower", age_min:9, age_max:18,
    dev_areas:["cognitive","fine","sensory"], tags:["cause-effect","visual-tracking"],
    price:52, asin:"B01MG1Q1D8", afflink:"https://www.amazon.com.au/dp/B01MG1Q1D8/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71UtdhcPgbL._AC_SX679_.jpg",
    note:"Watch the balls go round. Builds anticipation and visual tracking and it's genuinely mesmerising.",
    search:"INFANTINO Bop Drop Ball Tower marble track"
  },
  {
    id:"p10", name:"TOMY Pic N Pop Toy", age_min:9, age_max:36,
    dev_areas:["gross","cognitive","sensory"], tags:["cause-effect","walking","movement"],
    price:27.99, asin:"B002NWJ1LW", afflink:"https://www.amazon.com.au/dp/B002NWJ1LW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61Au2YeaOIL._AC_SY879_.jpg",
    note:"Push it along and watch the balls pop out. Great for early walkers — exciting, motivating, and simple.",
    search:"TOMY E71161 Pic N Pop Toy multicoloured"
  },
  {
    id:"p11", name:"Hape Pound & Tap Bench (Xylophone & Keyboard)", age_min:12, age_max:24,
    dev_areas:["fine","cognitive","sensory"], tags:["cause-effect","hand-strength","music"],
    price:53, asin:"B00712O2D6", afflink:"https://www.amazon.com.au/dp/B00712O2D6/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71HkmCUbupL._AC_SX679_.jpg",
    note:"Bash the balls through and play the xylophone. Hand strength, cause-and-effect, and music all at once.",
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
    dev_areas:["fine","cognitive","language"], tags:["constructive","vehicles","trains","blocks-tiles","numbers"],
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
    note:"Sorting, stacking, pouring, hiding, pretend cooking. More versatile than they look — great bang for buck.",
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
    note:"Soft floating stacking cubes for bath time. Sensory input, cause-and-effect, and a reason to stay in the bath.",
    search:"Playgro Splash Learn Bath Blocks baby"
  },
  // 18m - 3yr
  {
    id:"p19", name:"Wooden Shape Sorter", age_min:12, age_max:36,
    dev_areas:["cognitive","fine"], tags:["sorting","problem-solving","puzzle"],
    price:18, asin:"B00005RF5G", afflink:"https://www.amazon.com.au/dp/B00005RF5G/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71SvToMje4L._AC_SX679_.jpg",
    note:"A staple for good reason. Sorting shapes builds problem-solving, spatial reasoning, and fine motor in one hit.",
    search:"wooden shape sorter toddler toy"
  },
  {
    id:"p20", name:"Fat Brain Squigz Suction Starter Set", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","sensory"], tags:["sensory","constructive","open-ended"],
    price:40, asin:"B00DEBB3N0", afflink:"https://www.amazon.com.au/dp/B00DEBB3N0/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71ZdC75TxgL._AC_SX679_.jpg",
    note:"Suction cup building pieces that stick to any smooth surface — bathroom tiles, windows, high chairs. Genuinely creative.",
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
    note:"The best way to learn to ride a bike. Builds balance and core strength without the training wheel transition later.",
    search:"12 inch balance bike toddler"
  },
  {
    id:"p23", name:"9 Pcs Rainbow Play Scarves", age_min:12, age_max:84,
    dev_areas:["sensory","social","gross","language"], tags:["sensory","pretend-play","movement","open-ended"],
    price:15, asin:"B0D9LZ3ZVQ", afflink:"https://www.amazon.com.au/dp/B0D9LZ3ZVQ/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81kIJk6PcNL._AC_SX679_.jpg",
    note:"Silks for play are one of the most underrated toys. Peek-a-boo, dress-up, dancing, sensory exploration — endless uses.",
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
    id:"p27", name:"BRIO My First Railway Beginner Pack", age_min:18, age_max:60,
    dev_areas:["fine","cognitive","social"], tags:["vehicles","trains","constructive","pretend-play"],
    price:55, asin:"B00RMLUWGW", afflink:"https://www.amazon.com.au/dp/B00RMLUWGW/?tag=brittanyot0c-22",
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
    note:"A lovely alternative to traditional blocks. Creativity, problem-solving, and fine motor through open-ended building.",
    search:"Flower Garden Building Toys 224 pcs kids STEM"
  },
  // 2-4 years
  {
    id:"p31", name:"Play Dough Tool Set", age_min:24, age_max:72,
    dev_areas:["fine","sensory","cognitive"], tags:["playdough","hand-strength","sensory"],
    price:18, asin:"B09Z21T1V2", afflink:"https://www.amazon.com.au/dp/B09Z21T1V2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81WEl2xX0cL._AC_SX679_.jpg",
    note:"Play dough is one of the best fine motor and sensory tools out there. Tools add another layer of purposeful play.",
    search:"play dough tools set kids toddler"
  },
  {
    id:"p32", name:"Egg Crayons", age_min:18, age_max:48,
    dev_areas:["fine"], tags:["drawing","grip"],
    price:12, asin:"144134294X", afflink:"https://www.amazon.com.au/dp/144134294X/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81QsxBeZ6FL._AC_SX679_.jpg",
    note:"Egg shape naturally encourages a good grip. A really simple swap that makes a difference for pencil development.",
    search:"egg crayons toddler grip"
  },
  {
    id:"p33", name:"Little Tikes Red Light Green Light Active Play", age_min:36, age_max:84,
    dev_areas:["gross","cognitive","social"], tags:["outdoor","movement","balance","turn-taking"],
    price:22, asin:"B0D8JTKFRY", afflink:"https://www.amazon.com.au/dp/B0D8JTKFRY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71BpEZ11TRL._AC_SY879_.jpg",
    note:"Red light green light is great for impulse control, listening skills, and coordination. And it's just fun.",
    search:"Little Tikes Red Light Green Light Active Play toy"
  },
  {
    id:"p34", name:"Lehoo Castle Light-Up Musical Stepping Stones", age_min:24, age_max:60,
    dev_areas:["gross","sensory","cognitive"], tags:["balance","coordination","sensory","movement"],
    price:60, asin:"B0F28PLY7Z", afflink:"https://www.amazon.com.au/dp/B0F28PLY7Z/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71e6uCuwgqL._AC_SX679_.jpg",
    note:"Step on them and they light up and play music. Great for obstacle courses, balance practice, and the floor is lava.",
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
    note:"Animals, barns, and keys to unlock them. Vocabulary, sorting, fine motor, and pretend play all together.",
    search:"Grarain Montessori Farm Animals Toys 10 piece set barns keys"
  },
  {
    id:"p37", name:"Play Kitchen Set", age_min:24, age_max:72,
    dev_areas:["social","language","fine","cognitive"], tags:["pretend-play","cooking","role-play"],
    price:65, asin:"B0FCSJDQHH", afflink:"https://www.amazon.com.au/dp/B0FCSJDQHH/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/7165vCFzWHL._AC_SX679_.jpg",
    note:"A well-stocked play kitchen gets used for years. Language, social, fine motor, cognition — it hits everything.",
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
    note:"Sensory play done well. Hours of independent exploration, pouring, scooping, and problem-solving.",
    search:"sand water activity table kids outdoor"
  },
  {
    id:"p40", fam:"fishing-game", name:"Wooden Magnetic Fishing Set", age_min:36, age_max:72,
    dev_areas:["fine","language","social"], tags:["hand-eye","turn-taking","vocabulary"],
    price:16, asin:"B07XDPJDBN", afflink:"https://www.amazon.com.au/dp/B07XDPJDBN/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71Fd6w5qwDL._AC_SX679_.jpg",
    note:"Catching fish with a magnetic rod is a surprisingly good hand-eye challenge. Good for turn-taking too.",
    search:"wooden magnetic fishing set kids toy"
  },
  {
    id:"p41", name:"Goliath Pop the Pig Game", age_min:36, age_max:72,
    dev_areas:["social","cognitive"], tags:["turn-taking","anticipation","board-game"],
    price:25, asin:"B00CYQ24QG", afflink:"https://www.amazon.com.au/dp/B00CYQ24QG/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81RpyENDxSL._AC_SY879_.jpg",
    note:"Builds turn-taking and anticipation without being complicated. The belly popping never stops being funny.",
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
    note:"Finger puppets hidden inside locked containers with number matching. Fine motor, language, and problem-solving.",
    search:"Coogam Fine Motor Finger Puppets Treasure Number Locks Pirate"
  },
  {
    id:"p45", name:"Garybank Emotional Dart Board with Emotion Cards", age_min:48, age_max:96,
    dev_areas:["social","cognitive","gross"], tags:["emotional-regulation","hand-eye","social","turn-taking"],
    price:48, asin:"B0D6GBTNNT", afflink:"https://www.amazon.com.au/dp/B0D6GBTNNT/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81wEO6SWROL._AC_SX679_.jpg",
    note:"Emotion cards plus a dart board — physical play and emotional literacy together. A great OT tool for home.",
    search:"Garybank Emotional Dart Social Skills Activities Kids emotion cards"
  },
  // 4-8 years
  {
    id:"p46", name:"LEGO Bluey Beach & Family Car Trip Set", age_min:48, age_max:72,
    dev_areas:["fine","cognitive","social","language"], tags:["constructive","pretend-play","blocks-tiles","vehicles"],
    price:30, asin:"B0DWF3TB7V", afflink:"https://www.amazon.com.au/dp/B0DWF3TB7V/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81DegoOVGFL._AC_SX679_.jpg",
    note:"Bluey LEGO is a winner for fans of the show. Building plus Bluey-world pretend play — a solid combo.",
    search:"LEGO Bluey Beach Family Car Trip 11202 preschool"
  },
  {
    id:"p47", name:"Wipe Clean Writing Practice Book", age_min:36, age_max:60,
    dev_areas:["fine","language","cognitive"], tags:["pre-writing","letter-formation","reusable"],
    price:12, asin:"0723292086", afflink:"https://www.amazon.com.au/dp/0723292086/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71FZXYfkYvL._SY522_.jpg",
    note:"Reusable so they can practice as many times as they need. Good for letter formation and pencil grip.",
    search:"wipe clean writing practice book kids preschool"
  },
  {
    id:"p48", name:"Spring-Loaded Learning Scissors", age_min:30, age_max:60,
    dev_areas:["fine"], tags:["scissors","hand-strength"],
    price:12, asin:"B0GXVZQMHL", afflink:"https://www.amazon.com.au/dp/B0GXVZQMHL/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71lTxcPEVAL._AC_SX679_.jpg",
    note:"Spring-loaded so kids get the opening motion for free. Good starting scissors for building hand strength.",
    search:"spring loaded learning scissors kids safety"
  },
  {
    id:"p49", name:"Hungry Hungry Hippos Game", age_min:48, age_max:96,
    dev_areas:["gross","social","cognitive"], tags:["turn-taking","hand-eye","board-game"],
    price:25, asin:"B0C3DNT9W3", afflink:"https://www.amazon.com.au/dp/B0C3DNT9W3/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81T5qNcaVlL._AC_SX679_.jpg",
    note:"Fast-paced, good for hand strength, crossing the midline, and friendly competition. A first board game classic.",
    search:"Hungry Hungry Hippos Game preschool"
  },
  {
    id:"p50", name:"My First Snakes and Ladders", age_min:36, age_max:60,
    dev_areas:["social","cognitive"], tags:["turn-taking","counting","board-game"],
    price:18, asin:"B0BSXQDGT9", afflink:"https://www.amazon.com.au/dp/B0BSXQDGT9/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81dAB6kwwGL._AC_SX679_.jpg",
    note:"A solid first board game. Turn-taking, counting, and learning to handle not winning immediately.",
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
    note:"Visual perception, quick processing, and great for mixed ages. Works in 5 minutes or an hour.",
    search:"Moose Spot It Classic Card Game"
  },
  {
    id:"p53", name:"Story Cubes", age_min:48, age_max:120,
    dev_areas:["language","cognitive","social"], tags:["storytelling","vocabulary","creativity"],
    price:18, asin:"B08T5PDYWV", afflink:"https://www.amazon.com.au/dp/B08T5PDYWV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71V9THjd0tL._AC_SY879_.jpg",
    note:"Roll and tell a story. Great for imaginative kids — builds narrative skills and vocabulary in a fun way.",
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
    note:"Step to play music. Gross motor, rhythm, and sensory input — great for kids who love movement and sound together.",
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
    id:"p57", name:"TIME Timer Visual Analogue Timer (60 min)", age_min:36, age_max:144,
    dev_areas:["cognitive","selfcare"], tags:["independence","executive-function","transitions"],
    price:71, asin:"B08FBHVLWB", afflink:"https://www.amazon.com.au/dp/B08FBHVLWB/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81NGboLz2PL._AC_SX679_.jpg",
    note:"A visual timer that shows time passing as a red disc shrinking. Brilliant for transitions, task completion, and independence.",
    search:"TIME Timer Original Large 60 Minute Visual Timer"
  },
  {
    id:"p58", fam:"ball-run", name:"Fat Brain Air Toobz Ball Tube Set", age_min:36, age_max:96,
    dev_areas:["cognitive","fine","gross"], tags:["constructive","cause-effect","problem-solving","STEM"],
    price:179, asin:"B0C21LRH2K", afflink:"https://www.amazon.com.au/dp/B0C21LRH2K/?tag=brittanyot0c-22",
    img:null,
    note:"Build the tube system and watch balls zoom through it. Cause and effect, spatial reasoning, and engineering thinking.",
    search:"Fat Brain Air Toobz Ball Tube Physics Toy"
  },
  {
    id:"p59", name:"Origami Craft Kit for Kids", age_min:48, age_max:96,
    dev_areas:["fine","cognitive"], tags:["craft","focus","problem-solving"],
    price:15, asin:"080484707X", afflink:"https://www.amazon.com.au/dp/080484707X/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91ECrvwZ6eL._SY522_.jpg",
    note:"Origami is brilliant for finger strength, focus, and following sequential steps. A calming activity that builds precision.",
    search:"origami craft kit kids beginner"
  },
  {
    id:"p60", name:"Diamond Painting Kit for Kids (Gem Art Keychains)", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["craft","focus","mindfulness","art"],
    price:20, asin:"B0CGZSNVMM", afflink:"https://www.amazon.com.au/dp/B0CGZSNVMM/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81-Ln-ywhrL._AC_SX679_.jpg",
    note:"Calming, focused, and beautiful results. Good for kids who like quiet crafts that feel purposeful.",
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
    note:"Real sewing skills on felt projects — pillow, bag, keyring. Builds hand-eye coordination, focus, and pride in making something.",
    search:"KRAFUN Beginner Sewing Kit Kids 6 Projects"
  },
  {
    id:"p63", name:"Twister Party Game (Ages 6+)", age_min:72, age_max:144,
    dev_areas:["gross","social"], tags:["balance","coordination","turn-taking","movement","board-game"],
    price:25, asin:"B0723923ZP", afflink:"https://www.amazon.com.au/dp/B0723923ZP/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51pLykE9KVL._AC_SX679_.jpg",
    note:"Gross motor, coordination, following instructions, and loads of laughs. Works for mixed ages too.",
    search:"Twister Party Game Hasbro Air Moves"
  },
  {
    id:"p64", name:"Hasbro Bop It Extreme", age_min:96, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["hand-eye","reaction-time","listening","board-game"],
    price:40, asin:"B09JDMZ8X4", afflink:"https://www.amazon.com.au/dp/B09JDMZ8X4/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71n6Ctm70mL._AC_SX679_.jpg",
    note:"Fast, loud, and fun. Builds reaction time, listening skills, and hand-eye coordination.",
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
    note:"Decision-making, money concepts, turn-taking, and family connection. A classic for a reason.",
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
    note:"Poke-in art builds fine motor precision and focus through calming, creative craft. Beautiful results too.",
    search:"Skillmatics Poke-In Art Magical Princesses craft kit"
  },
  {
    id:"p70", name:"JOYIN Big Bubble Wands Set (18 pcs)", age_min:36, age_max:120,
    dev_areas:["gross","sensory","social"], tags:["outdoor","sensory","movement","breath-control"],
    price:30, asin:"B089KVTJPP", afflink:"https://www.amazon.com.au/dp/B089KVTJPP/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/81TyfJ1QGGL._AC_SX679_.jpg",
    note:"Bubbles are genuinely therapeutic — breath control, visual tracking, chasing, and pure joy. This set is great value.",
    search:"JOYIN Big Bubble Wands Set Giant Bubble Maker"
  },
  {
    id:"p71", fam:"magnetic-tiles", name:"Magnetic Blocks Building Set (150 pcs)", age_min:36, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["magnetic-tiles","constructive","open-ended","blocks-tiles"],
    price:45, asin:"B0B2QQL3MW", afflink:"https://www.amazon.com.au/dp/B0B2QQL3MW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71vWgpHjwsL._AC_SX679_.jpg",
    note:"150 pieces gives real scope for big builds. Spatial reasoning, creativity, and fine motor in one open-ended set.",
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
    note:"Three outdoor games in one — ring toss, stomp rocket, and jump. Good for active kids who need variety.",
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
    dev_areas:["gross","sensory"], tags:["vestibular","proprioceptive","movement","sensory","heavy-work"],
    price:45, asin:"B008AK6WMC", afflink:"https://www.amazon.com.au/dp/B008AK6WMC/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61SYSbIv+ZL._SX522_.jpg",
    note:"One of the best vestibular and proprioceptive tools going. Lying prone and scooting builds core strength and upper body — kids love it.",
    search:"scooter board kids sensory OT therapy roller"
  },
  {
    id:"p77", name:"Body Sock / Sensory Compression Suit", age_min:36, age_max:96,
    dev_areas:["sensory","gross"], tags:["proprioceptive","deep-pressure","sensory","vestibular"],
    price:35, asin:"B0CQX932VD", afflink:"https://www.amazon.com.au/dp/B0CQX932VD/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51GH5idognL._AC_SX679_.jpg",
    note:"Deep pressure input from head to toe. Really calming for kids who seek proprioceptive input or need help with body awareness.",
    search:"body sock sensory compression suit kids proprioceptive"
  },
  {
    id:"p78", name:"Lycra Sensory Swing", age_min:24, age_max:96,
    dev_areas:["sensory","gross"], tags:["vestibular","proprioceptive","sensory","deep-pressure","swing"],
    price:65, asin:"B0829WS6MW", afflink:"https://www.amazon.com.au/dp/B0829WS6MW/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71xeJs9UJ-L._AC_SX679_.jpg",
    note:"Vestibular and deep pressure input together — great for sensory seekers and kids who need help with regulation. Hangs from a doorframe or beam.",
    search:"lycra sensory swing kids therapy indoor cocoon"
  },
  {
    id:"p79", name:"Crash Mat / Sensory Crash Pad", age_min:24, age_max:96,
    dev_areas:["sensory","gross"], tags:["proprioceptive","heavy-work","sensory","movement","vestibular"],
    price:89, asin:"B0GQDCZ8Z5", afflink:"https://www.amazon.com.au/dp/B0GQDCZ8Z5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61-tk0popiL._AC_SX679_.jpg",
    note:"Jump into it, roll on it, crash into it. Proprioceptive input kids who need it absolutely love. Great paired with a lycra swing.",
    search:"crash mat sensory crash pad kids therapy bean bag"
  },
  {
    id:"p80", name:"Yoga Ball / Exercise Ball (Kids Size)", age_min:36, age_max:144,
    dev_areas:["gross","sensory"], tags:["proprioceptive","vestibular","balance","heavy-work","sensory"],
    price:25, asin:"B01M25TPKV", afflink:"https://www.amazon.com.au/dp/B01M25TPKV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/91zwDDnfb5L._AC_SX679_.jpg",
    note:"Sitting on it, rolling over it, bouncing on it — all great for core strength, balance, and vestibular input. Super versatile.",
    search:"kids yoga exercise balance ball 45cm children sensory"
  },
  {
    id:"p81", name:"Peanut Ball / Therapy Peanut Roller", age_min:12, age_max:72,
    dev_areas:["gross","sensory"], tags:["proprioceptive","vestibular","tummy-time","heavy-work","balance"],
    price:30, asin:"B01N7KH666", afflink:"https://www.amazon.com.au/dp/B01N7KH666/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61E75yvmspL._AC_SX679_.jpg",
    note:"The peanut shape stops it rolling away — great for tummy time with babies and for rolling proprioceptive input with toddlers.",
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
    note:"Cubbies, ramps, boats, obstacle courses — kids build their own adventures. Families rave about these and they genuinely get used for years.",
    search:"play couch kids foam modular nugget couch"
  },
  {
    id:"p84", name:"Spinning Sensory Chair / Swivel Chair", age_min:36, age_max:144,
    dev_areas:["sensory"], tags:["vestibular","sensory","self-regulation","focus"],
    price:55, asin:"B0G3TV75KV", afflink:"https://www.amazon.com.au/dp/B0G3TV75KV/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51ZnCGayDtL._AC_SX679_.jpg",
    note:"Spinning provides vestibular input that can help with focus and regulation. A lot of kids seek this — giving them a sanctioned way to do it is a win.",
    search:"spinning sensory chair kids swivel wobble vestibular"
  },

  // ── OUTDOOR & ACTIVE PLAY ────────────────────────────────────────────────────
  {
    id:"p85", name:"Kids Bowling Set (Indoor/Outdoor)", age_min:24, age_max:72,
    dev_areas:["gross","cognitive","social"], tags:["outdoor","hand-eye","turn-taking","movement","sports"],
    price:20, asin:"B00AU0O7OU", afflink:"https://www.amazon.com.au/dp/B00AU0O7OU/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/712DRbBOwzL._AC_SX679_.jpg",
    note:"Aiming, rolling, counting pins — hand-eye coordination and turn-taking without needing much space.",
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
    note:"Solid proprioceptive input. Great for kids who need to get big energy out, especially before seated tasks.",
    search:"kids standing boxing bag punching bag freestanding"
  },
  {
    id:"p88", name:"Quick Sticks / Reaction Sticks Game", age_min:60, age_max:144,
    dev_areas:["gross","cognitive","social"], tags:["hand-eye","reaction-time","outdoor","turn-taking","movement","sports"],
    price:22, asin:"B0GJL2ZSF8", afflink:"https://www.amazon.com.au/dp/B0GJL2ZSF8/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61isSZ2xosL._AC_SX679_.jpg",
    note:"Drop the stick, catch it before it hits the ground. Reaction time, hand-eye coordination, and competitive fun. Works inside too.",
    search:"quick sticks reaction sticks game kids catch reflex"
  },
  {
    id:"p89", name:"Eezy Peezy Swing Car Ride-On", age_min:18, age_max:60,
    dev_areas:["gross","sensory"], tags:["vestibular","coordination","movement","outdoor","bilateral"],
    price:45, asin:"B0DZ64KXM7", afflink:"https://www.amazon.com.au/dp/B0DZ64KXM7/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61ezTckD5GL._AC_SX679_.jpg",
    note:"Twist and turn to move — no pedals or pushing needed. Builds bilateral coordination and vestibular processing. Kids are obsessed with these.",
    search:"eezy peezy twist ride on swing car toddler"
  },
  {
    id:"p90", name:"Roller Coaster Ride-On", age_min:36, age_max:72,
    dev_areas:["gross","sensory"], tags:["vestibular","movement","outdoor","sensory"],
    price:139, asin:"B0GWR1V48F", afflink:"https://www.amazon.com.au/dp/B0GWR1V48F/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61G8nv8BOwL._AC_SX679_.jpg",
    note:"Repetitive movement up and over — vestibular input, anticipation, and the kind of thrill kids who love movement absolutely seek out.",
    search:"kids roller coaster ride on outdoor toddler"
  },
  {
    id:"p91", name:"Kids Climbing Frame with Slide", age_min:24, age_max:84,
    dev_areas:["gross","sensory"], tags:["climbing","outdoor","strength","movement","vestibular"],
    price:299, asin:"B0CGQY9DCH", afflink:"https://www.amazon.com.au/dp/B0CGQY9DCH/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61qgyqtxSXL._AC_SX679_.jpg",
    note:"Climbing, sliding, hanging — all proprioceptive and vestibular input. If you have outdoor space, a climbing frame is one of the best investments you'll make.",
    search:"kids climbing frame slide outdoor backyard"
  },
  {
    id:"p92", name:"Wheelbarrow / Kids Garden Wheelbarrow", age_min:24, age_max:60,
    dev_areas:["gross","sensory","cognitive"], tags:["heavy-work","outdoor","proprioceptive","life-skills"],
    price:25, asin:"B088PQZGX5", afflink:"https://www.amazon.com.au/dp/B088PQZGX5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71l6fRyi7AL._AC_SX679_.jpg",
    note:"Loading and pushing a wheelbarrow is brilliant heavy work. Builds upper body strength, coordination, and a sense of real contribution.",
    search:"kids wheelbarrow garden toy outdoor play"
  },
  {
    id:"p93", name:"Trio Rocker / Three-Way Rocker", age_min:12, age_max:60,
    dev_areas:["gross","sensory","social"], tags:["vestibular","movement","balance","sensory","turn-taking"],
    price:79, asin:"B0GTLQPDBY", afflink:"https://www.amazon.com.au/dp/B0GTLQPDBY/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51Y6k83ImHL._AC_SX679_.jpg",
    note:"Rock solo or with a friend. Great vestibular input and the cooperative element when two kids rock together builds social skills.",
    search:"trio rocker kids balance board vestibular three way"
  },
  {
    id:"p94", name:"Play Tunnel (Pop-Up Crawl Tunnel)", age_min:12, age_max:72,
    dev_areas:["gross","sensory","cognitive"], tags:["crawling","movement","proprioceptive","vestibular","outdoor"],
    price:30, asin:"B0CBNZDSR5", afflink:"https://www.amazon.com.au/dp/B0CBNZDSR5/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71G0twryyoL._AC_SX679_.jpg",
    note:"Crawling through tunnels is brilliant proprioceptive input and supports motor planning. Fold it up and it goes anywhere.",
    search:"kids pop up play tunnel crawl tunnel toddler outdoor"
  },
  {
    id:"p95", name:"Swivel See Saw", age_min:36, age_max:84,
    dev_areas:["gross","sensory","social"], tags:["vestibular","balance","outdoor","turn-taking","social"],
    price:89, asin:"B07BKVSB27", afflink:"https://www.amazon.com.au/dp/B07BKVSB27/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/51zJGDUmRQL._AC_SX679_.jpg",
    note:"More dynamic than a standard see saw — the swivel motion adds a vestibular challenge. Great cooperative play too.",
    search:"swivel see saw kids outdoor balance rocker"
  },
  {
    id:"p96", name:"Frisbee", age_min:60, age_max:144,
    dev_areas:["gross","social"], tags:["outdoor","hand-eye","coordination","movement","sports"],
    price:10, asin:"B0813DBQ36", afflink:"https://www.amazon.com.au/dp/B0813DBQ36/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71g3xfUfNRL._AC_SX679_.jpg",
    note:"Throwing and catching a frisbee is deceptively hard. Great for hand-eye coordination, timing, and bilateral movement.",
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
    id:"p98", name:"Outdoor Sidewalk Chalk (Jumbo Pack)", age_min:24, age_max:96,
    dev_areas:["fine","gross","cognitive","social"], tags:["outdoor","drawing","creative","movement","pre-writing"],
    price:12, asin:"B00AHAJGXK", afflink:"https://www.amazon.com.au/dp/B00AHAJGXK/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/61mhqNvT+dL._AC_SX679_.jpg",
    note:"Draw courses, trace bodies, play hopscotch, write letters. Chalk is one of those things that buys hours of outdoor creative play.",
    search:"jumbo sidewalk chalk kids outdoor washable pack"
  },
  {
    id:"p99", name:"Sibling Doll Set (Baby & Toddler Dolls)", age_min:24, age_max:72,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","nurturing","role-play","social","emotions","dolls"],
    price:25, asin:"B0F8QJCHT2", afflink:"https://www.amazon.com.au/dp/B0F8QJCHT2/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71r9GTNOpDL._AC_SX679_.jpg",
    note:"Two dolls — a baby and a toddler — opens up sibling and family storylines in pretend play. Brilliant for kids with a new baby at home.",
    search:"sibling doll set baby toddler soft doll pretend play"
  },
  {
    id:"p100", name:"Step-On Rocket Launcher", age_min:36, age_max:96,
    dev_areas:["gross","cognitive","sensory"], tags:["outdoor","jumping","cause-effect","movement","proprioceptive"],
    price:22, asin:"B0006O8Q7Y", afflink:"https://www.amazon.com.au/dp/B0006O8Q7Y/?tag=brittanyot0c-22",
    img:"https://m.media-amazon.com/images/I/71mli4BTVvL._AC_SX679_.jpg",
    note:"Stomp on the pad and the rocket flies. Running, jumping, chasing — and the cause-and-effect element keeps kids coming back.",
    search:"step on rocket launcher kids stomp outdoor foam"
  },

  // ── FROM MILESTONES GUIDE 6m-6yrs ──────────────────────────────────────────
  {
    id:"p101", name:"Bee Crawl Toy with Music & Lights", age_min:4, age_max:12,
    dev_areas:["gross","sensory","cognitive"], tags:["crawling","movement","cause-effect","music"],
    price:22, asin:"B07PBCC6VC", afflink:"https://www.amazon.com.au/dp/B07PBCC6VC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81NpQsDvlAL._AC_SX679_.jpg",
    note:"Moves in a zigzag pattern encouraging babies to track and chase it. Great for building crawling motivation and neck strength.",
    search:"bee crawl toy baby music lights crawling"
  },
  {
    id:"p102", name:"VTech Ocean Buddies Animal Band", age_min:6, age_max:12,
    dev_areas:["language","sensory","cognitive"], tags:["music","cause-effect","language","animals"],
    price:28, asin:null, img:null,
    note:"Lights, sounds, animal names, and music. Supports early language development and auditory exploration.",
    search:"VTech Ocean Buddies Animal Band baby toy"
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
    note:"Babies start to discover their own hands and feet through these. Builds body awareness and early sensory exploration from day one.",
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
    note:"Faces, textures, and sounds babies love. Great for early social development and visual engagement with faces.",
    search:"Lamaze My Friend interactive plush baby toy faces"
  },
  {
    id:"p110", name:"Talking Toy Mattel Puppy", age_min:9, age_max:18,
    dev_areas:["language","social","cognitive"], tags:["language","cause-effect","animals","music"],
    price:28, asin:"B0D9MWMXSX", afflink:"https://www.amazon.com.au/dp/B0D9MWMXSX/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71B4yVQEJZL._AC_SY879_.jpg",
    note:"Press paws and ears to hear songs and phrases. Supports early word recognition and turn-taking with a toy.",
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
    note:"Open the barn, animals pop out or drop through. Vocabulary, animal sounds, and early pretend play all in one.",
    search:"wooden barn toy animals toddler farm playset"
  },
  {
    id:"p113", name:"DIY Busy Board / Sensory Board", age_min:12, age_max:36,
    dev_areas:["fine","cognitive","sensory"], tags:["fine-motor","problem-solving","sensory","cause-effect","selfcare"],
    price:35, asin:"B0DZNWQPLD", afflink:"https://www.amazon.com.au/dp/B0DZNWQPLD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/815dLiPGZDL._AC_SX679_.jpg",
    note:"Zippers, buckles, buttons, latches, locks. Brilliant for fine motor and self-care skill development all on one board.",
    search:"busy board toddler sensory montessori fine motor latches"
  },
  {
    id:"p114", name:"Musical Dancing Duck Toy (walking ducks)", age_min:4, age_max:12,
    dev_areas:["gross","sensory","language"], tags:["crawling","movement","music","cause-effect"],
    price:55, asin:"B0DWWTGBJ1", afflink:"https://www.amazon.com.au/dp/B0DWWTGBJ1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61vNy2ayBfL._AC_SX679_.jpg",
    note:"They walk in a line, hold hands, and sing. Movement and music together — great for crawling motivation and sensory regulation through rhythm.",
    search:"musical walking dancing duck toy baby crawling"
  },
  // ── FROM 2 YEAR OLD GUIDE ──────────────────────────────────────────────────
  {
    id:"p115", name:"Ride-On Trike / Balance Bike with Pedals", age_min:24, age_max:48,
    dev_areas:["gross"], tags:["balance","coordination","outdoor","movement","bilateral","vehicles"],
    price:55, asin:"B0FPLQCZYM", afflink:"https://www.amazon.com.au/dp/B0FPLQCZYM/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61ARxP8lIxL._AC_SX679_.jpg",
    note:"The transition from balance bike to pedal trike. Builds bilateral coordination, leg strength, and steering control.",
    search:"toddler trike ride on balance bike pedals 2 year old"
  },
  {
    id:"p116", name:"Large Outdoor Play Ball", age_min:12, age_max:60,
    dev_areas:["gross","social"], tags:["outdoor","movement","hand-eye","bilateral","throwing","sports"],
    price:12, asin:"B0FWBBQ7KW", afflink:"https://www.amazon.com.au/dp/B0FWBBQ7KW/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71k5uVk+0CL._AC_SX679_.jpg",
    note:"Rolling, kicking, throwing, chasing — a large ball is one of the most versatile gross motor tools you can own.",
    search:"large outdoor play ball toddler kids"
  },
  {
    id:"p117", name:"Pretend Microphone Toy", age_min:24, age_max:60,
    dev_areas:["language","social","cognitive"], tags:["language","music","pretend-play","creative"],
    price:15, asin:"B08PYS8C3T", afflink:"https://www.amazon.com.au/dp/B08PYS8C3T/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81wWXPiLB5L._AC_SX679_.jpg",
    note:"Singing, storytelling, putting on shows. Great for language confidence and creative play.",
    search:"pretend microphone toy toddler kids singing"
  },
  {
    id:"p118", name:"Flash Card Reader / Interactive Learning System", age_min:24, age_max:60,
    dev_areas:["language","cognitive"], tags:["language","letters","numbers","cause-effect"],
    price:35, asin:"B0C1YLTG64", afflink:"https://www.amazon.com.au/dp/B0C1YLTG64/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71l6HQcQZML._AC_SX679_.jpg",
    note:"Slide in a card and hear the word, sound, or letter. Builds early literacy and vocabulary in a hands-on way.",
    search:"flash card reader kids interactive learning toy words letters"
  },
  {
    id:"p119", name:"Doll Pram & Nursery Accessories Set", age_min:18, age_max:60,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","nurturing","role-play","social","emotions","dolls"],
    price:45, asin:"B0GVHL148L", afflink:"https://www.amazon.com.au/dp/B0GVHL148L/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81-y8Ffg+eL._AC_SX679_.jpg",
    note:"Pram, bed, feeding accessories — this opens up rich nurturing pretend play that builds empathy and language.",
    search:"doll pram nursery set accessories toddler pretend play"
  },
  {
    id:"p120", name:"Step Stool for Kids", age_min:18, age_max:60,
    dev_areas:["selfcare","gross","cognitive"], tags:["independence","selfcare","life-skills"],
    price:20, asin:"B0DDPCSKKW", afflink:"https://www.amazon.com.au/dp/B0DDPCSKKW/?tag=brittanyot0c-22	https://m.media-amazon.com/images/I/61cCr2P-1bL._AC_SY879_.jpg", img:null,
    note:"Reaching the sink, climbing onto the toilet, getting to the bench. A step stool is one of the best independence tools in the house.",
    search:"kids step stool toddler bathroom independence"
  },
  {
    id:"p121", name:"Open Cup for Toddlers", age_min:12, age_max:36,
    dev_areas:["selfcare","fine"], tags:["drinking","independence","selfcare"],
    price:8, asin:"B0DBKDZRN1", afflink:"https://www.amazon.com.au/dp/B0DBKDZRN1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/719QmnbIfVL._AC_SX679_.jpg",
    note:"Learning to drink from an open cup is an important self-care milestone. Small, heavy-based cups work best.",
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
    note:"Properly sized cutlery makes self-feeding much more achievable. A simple swap that builds independence at mealtimes.",
    search:"toddler cutlery set fork spoon kids sized"
  },
  {
    id:"p124", name:"Toys with Clothing / Dressing Doll", age_min:24, age_max:60,
    dev_areas:["fine","selfcare","social"], tags:["selfcare","fine-motor","pretend-play","independence","buttons","dolls"],
    price:22, asin:"B07JZ5ZBFC", afflink:"https://www.amazon.com.au/dp/B07JZ5ZBFC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51hCK-AgIUL._AC_SX679_.jpg",
    note:"Dolls with zippers, buttons, and velcro help kids practice dressing skills on something other than themselves first.",
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
    note:"Stepping through rungs in different patterns is great for foot-eye coordination, motor planning, and bilateral integration.",
    search:"agility ladder kids exercise coordination outdoor"
  },
  {
    id:"p128", name:"Jungle Gym Climbing Dome", age_min:36, age_max:96,
    dev_areas:["gross","sensory"], tags:["climbing","outdoor","strength","movement","proprioceptive","vestibular"],
    price:120, asin:"B0CGQY9DCH", afflink:"https://www.amazon.com.au/dp/B0CGQY9DCH/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61qgyqtxSXL._AC_SX679_.jpg",
    note:"More options than a standard frame — reach the top, hang upside down, set challenges. Great for confident movers.",
    search:"kids jungle gym climbing dome outdoor backyard"
  },
  {
    id:"p129", name:"Movement Foam Dice", age_min:24, age_max:72,
    dev_areas:["gross","cognitive","social"], tags:["movement","outdoor","balance","coordination","turn-taking","animals"],
    price:22, asin:"B096SKTL77", afflink:"https://www.amazon.com.au/dp/B096SKTL77/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71n5en7LA3L._AC_SX679_.jpg",
    note:"Roll the dice and do the movement — jump, hop, balance. Adds unpredictability to physical play and is great for obstacle courses.",
    search:"movement foam dice kids action gross motor play"
  },
  {
    id:"p130", name:"Balance Scale Toy (Maths Scale)", age_min:36, age_max:72,
    dev_areas:["cognitive","language","fine"], tags:["problem-solving","sorting","numbers","cause-effect"],
    price:25, asin:"B085SMGQQH", afflink:"https://www.amazon.com.au/dp/B085SMGQQH/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71o+2-jiTCL._AC_SX679_.jpg",
    note:"Which side is heavier? Add and remove objects to balance it. Brilliant for early maths concepts and problem-solving exploration.",
    search:"balance scale toy kids learning maths heavy light"
  },
  {
    id:"p131", name:"Anatomy Body Puzzle", age_min:36, age_max:72,
    dev_areas:["cognitive","language"], tags:["puzzle","problem-solving","body-awareness","language"],
    price:28, asin:"B0FJBFVTNK", afflink:"https://www.amazon.com.au/dp/B0FJBFVTNK/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81Px15OhhCL._AC_SX679_.jpg",
    note:"Skin, muscles, bones, organs — layer by layer. Introduces the human body in a hands-on, memorable way.",
    search:"anatomy body puzzle kids layers organs bones"
  },
  {
    id:"p132", name:"Glowing Marble Run", age_min:48, age_max:96,
    dev_areas:["cognitive","fine","sensory"], tags:["constructive","problem-solving","cause-effect","visual-tracking"],
    price:45, asin:"B07JL8QGLR", afflink:"https://www.amazon.com.au/dp/B07JL8QGLR/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81f0rpm6ZzL._AC_SX679_.jpg",
    note:"Build the track, then adjust it to change how the marble moves. Problem-solving, spatial reasoning, and cause-and-effect.",
    search:"glowing marble run kids building toy glow dark"
  },
  {
    id:"p133", name:"Dress Up Costume Set (Princess / Doctor / Police / Chef / Pirate)", age_min:36, age_max:72,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","role-play","empathy","social","creative"],
    price:25, asin:"B0B3RBXMMX", afflink:"https://www.amazon.com.au/dp/B0B3RBXMMX/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71gp7CHfbHL._AC_SX679_.jpg",
    note:"Dress up and become someone else for a while. Role play builds empathy, communication, and creativity — and it's always a hit.",
    search:"kids dress up costume set princess doctor police pirate"
  },
  {
    id:"p134", name:"Fruit Stand Avalanche Balance Game", age_min:36, age_max:72,
    dev_areas:["fine","social","cognitive"], tags:["balance","fine-motor","turn-taking","hand-eye","board-game"],
    price:28, asin:"B0035EQDT0", afflink:"https://www.amazon.com.au/dp/B0035EQDT0/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61QN1CufBYL._AC_SX679_.jpg",
    note:"Place fruit on the stand without knocking it over. Fine motor precision, turn-taking, and crossing the midline. A favourite in my therapy kit.",
    search:"fruit stand avalanche balance game kids stacking"
  },
  {
    id:"p135", name:"Hopscotch Mat (Foam or Fabric)", age_min:24, age_max:72,
    dev_areas:["gross","cognitive"], tags:["balance","coordination","bilateral","movement","counting"],
    price:20, asin:"B07Q313KVG", afflink:"https://www.amazon.com.au/dp/B07Q313KVG/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61v4yxyeNVL._AC_SX679_.jpg",
    note:"Hopping on one foot, bilateral coordination, counting, colour recognition. Works indoors and you can add challenges as they grow.",
    search:"hopscotch mat kids foam fabric indoor outdoor"
  },
  {
    id:"p136", name:"Balance Beam Set (Curved Indoor Balance)", age_min:24, age_max:72,
    dev_areas:["gross","sensory","cognitive"], tags:["balance","coordination","vestibular","movement","outdoor"],
    price:55, asin:"B0FSV7BFZ5", afflink:"https://www.amazon.com.au/dp/B0FSV7BFZ5/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81tJ2PzatNL._AC_SX679_.jpg",
    note:"Walking along a beam builds balance, core strength, and proprioceptive awareness. Curved sets can also be used as rocker boards.",
    search:"kids balance beam set curved indoor outdoor play"
  },
  {
    id:"p137", name:"Magnetic Letter Set (Fridge Magnets)", age_min:24, age_max:60,
    dev_areas:["language","cognitive","fine"], tags:["letters","language","sorting","fine-motor"],
    price:18, asin:"B07KK5Y92W", afflink:"https://www.amazon.com.au/dp/B07KK5Y92W/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/714OXG3R42L._AC_SX679_.jpg",
    note:"A fridge classic for early literacy. Hands-on letter recognition, spelling their name, and early phonics play.",
    search:"magnetic letter set fridge magnets kids alphabet"
  },
  {
    id:"p138", name:"Storytelling Dot Point Cards", age_min:48, age_max:96,
    dev_areas:["language","cognitive","social"], tags:["storytelling","vocabulary","creative","language"],
    price:15, asin:"B0CJHCM3B7", afflink:"https://www.amazon.com.au/dp/B0CJHCM3B7/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61zciXAJ0TL._AC_SX679_.jpg",
    note:"Dot points to build a story around. Sparks narrative thinking, vocabulary, and imagination in a structured but open-ended way.",
    search:"storytelling dot point cards kids narrative prompts"
  },
  {
    id:"p139", name:"Dominos (Classic Set)", age_min:60, age_max:144,
    dev_areas:["cognitive","social","fine"], tags:["counting","turn-taking","problem-solving","board-game","fine-motor"],
    price:18, asin:"B0D6RZ1PHQ", afflink:"https://www.amazon.com.au/dp/B0D6RZ1PHQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/614LxsAQYgL._AC_SX679_.jpg",
    note:"Matching, counting, turn-taking, and the very satisfying chain reaction when you line them up and knock them down.",
    search:"dominos classic set kids game counting"
  },
  {
    id:"p140", name:"Problem-Solving Balance Game (e.g. Penguin Trap / Stacking)", age_min:48, age_max:96,
    dev_areas:["cognitive","fine","social"], tags:["balance","problem-solving","fine-motor","turn-taking","board-game"],
    price:22, asin:"B0GCW6G6R9", afflink:"https://www.amazon.com.au/dp/B0GCW6G6R9/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61CSiW5eyzL._AC_SX679_.jpg",
    note:"Stack the pieces without toppling it. Spatial reasoning, fine motor control, and managing the tension of waiting your turn.",
    search:"kids problem solving balance stacking game penguin"
  },
  {
    id:"p141", name:"Learn to Tie Shoelaces Board / Book", age_min:48, age_max:84,
    dev_areas:["fine","selfcare","cognitive"], tags:["fine-motor","selfcare","independence","hand-eye"],
    price:15, asin:"B0BM9F2B32", afflink:"https://www.amazon.com.au/dp/B0BM9F2B32/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61XFvDBdUgL._AC_SY695_.jpg",
    note:"A dedicated practice board means they can work on lacing without the frustration of being in a hurry. Important self-care milestone.",
    search:"learn tie shoelaces board kids practice lacing"
  },
  // ── FROM GIFTING GUIDE 0-12 ────────────────────────────────────────────────
  {
    id:"p142", name:"Musical Walking Duck Toy (Line of Ducks)", age_min:4, age_max:12,
    dev_areas:["gross","sensory","language"], tags:["crawling","movement","music","cause-effect"],
    price:55, asin:"B0DWWTGBJ1", afflink:"https://www.amazon.com.au/dp/B0DWWTGBJ1/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61vNy2ayBfL._AC_SX679_.jpg",
    note:"They walk in a line, hold hands, and sing. Movement plus rhythm — great for supporting crawling and early sensory regulation.",
    search:"musical walking duck toy baby line ducks singing crawling"
  },
  {
    id:"p143", name:"Ride-On Horse Toy", age_min:24, age_max:48,
    dev_areas:["gross","sensory","social"], tags:["vestibular","balance","pretend-play","movement"],
    price:39, asin:"B0B1MYQBJZ", afflink:"https://www.amazon.com.au/dp/B0B1MYQBJZ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61Ycy5kBC3L._AC_SX679_.jpg",
    note:"Bounce, rock, and gallop. Vestibular input, core strength, and rich pretend play — kids care for their horse, feed it, take it places.",
    search:"ride on horse toy kids toddler bounce rocking"
  },
  {
    id:"p144", name:"Traffic Light Toy (Road Safety)", age_min:24, age_max:60,
    dev_areas:["cognitive","language","gross"], tags:["cause-effect","language","movement","road-safety"],
    price:35, asin:"B000OZ0A24", afflink:"https://www.amazon.com.au/dp/B000OZ0A24/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61TOu3lbmRL._AC_SY879_.jpg",
    note:"Stop and go concepts in a play-based, safe environment. I love this for kids working on traffic safety goals — really natural way to learn it.",
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
    note:"Unlock the chest with number or colour sequences. Fine motor, sequencing, and the excitement of unlocking surprises — a mix of mystery and skill building.",
    search:"treasure chest toy kids mystery unlock numbers colours"
  },
  {
    id:"p148", name:"Busy Book (Perth-Made Activity Book)", age_min:36, age_max:72,
    dev_areas:["cognitive","fine","language","social"], tags:["fine-motor","pretend-play","sorting","numbers","letters"],
    price:90, asin:"B0DZNWQPLD", afflink:"https://www.amazon.com.au/dp/B0DZNWQPLD/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/815dLiPGZDL._AC_SX679_.jpg",
    note:"A Perth-made all-in-one activity book. Pretend play, fine motor, early learning — colours, numbers, maths, even a map of Australia. Supports local and genuinely brilliant.",
    search:"Busy Book kids activity learning pretend play Australia"
  },
  {
    id:"p149", name:"Nest Swing / Platform Swing", age_min:36, age_max:144,
    dev_areas:["sensory","gross","social"], tags:["vestibular","swing","outdoor","sensory","social"],
    price:219, asin:"B082T3RJ2J", afflink:"https://www.amazon.com.au/dp/B082T3RJ2J/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81iLT87ekAL._AC_SX679_.jpg",
    note:"Multiple kids can swing together on a nest swing — vestibular input plus the cooperative element. A backyard favourite.",
    search:"nest swing platform swing kids outdoor backyard"
  },
  {
    id:"p150", name:"Kinetic Sand (Sensory Moulding Sand)", age_min:36, age_max:120,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fine-motor","creative","tactile"],
    price:22, asin:"B0BRQXVSD4", afflink:"https://www.amazon.com.au/dp/B0BRQXVSD4/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81hBNp5LczL._AC_SX679_.jpg",
    note:"Moulds like wet sand but stays clean and dry. Brilliant tactile input and one of the best calm-down sensory activities.",
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
    note:"Layer by layer — skin, muscles, skeleton, organs. Introduces body awareness in a way kids remember because they can hold it.",
    search:"human body puzzle layered anatomy kids learning"
  },
  {
    id:"p153", name:"Truck and Construction Tool Play Set", age_min:24, age_max:60,
    dev_areas:["fine","cognitive","social"], tags:["vehicles","tool-use","pretend-play","constructive"],
    price:30, asin:"B0F6MZ6X3H", afflink:"https://www.amazon.com.au/dp/B0F6MZ6X3H/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71rnLi7zcBL._AC_SX679_.jpg",
    note:"Trucks to drive and tools to build with. Combines two interests kids often have together — vehicles and building.",
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
    note:"A stage for shows, stories, and characters. Puppet theatre builds language, narrative, and the confidence to perform.",
    search:"kids puppet theatre fabric foldable children plays"
  },
  {
    id:"p156", fam:"ball-run", name:"Connetix Ball Run Expansion Pack", age_min:48, age_max:120,
    dev_areas:["cognitive","fine","sensory"], tags:["constructive","cause-effect","problem-solving","magnetic-tiles","blocks-tiles","STEM"],
    price:85, asin:"B0BLCPYDL5", afflink:"https://www.amazon.com.au/dp/B0BLCPYDL5/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/61FHULJNkLL._AC_SX679_.jpg",
    note:"Add tubes and funnels to magnetic tiles and watch balls run through. Engineering thinking and spatial reasoning at their best.",
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
    id:"p158", fam:"putty", name:"Therapy Putty / Resistive Putty Set", age_min:48, age_max:144,
    dev_areas:["fine","sensory"], tags:["hand-strength","sensory","fine-motor","tactile","fidget"],
    price:18, asin:"B07YF9X67Z", afflink:"https://www.amazon.com.au/dp/B07YF9X67Z/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/719lR4Gm+-L._AC_SX679_.jpg",
    note:"Different resistance levels for different hand strength needs. Squeezing, stretching, hiding objects — great for hand strengthening and sensory input.",
    search:"therapy putty kids resistive hand strengthening sensory"
  },
  {
    id:"p159", name:"Sensory Bin Kit (Scoops, Funnels, Tweezers)", age_min:18, age_max:60,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","fine-motor","tactile","pouring","sorting"],
    price:20, asin:"B0GZ2JRJHZ", afflink:"https://www.amazon.com.au/dp/B0GZ2JRJHZ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81bSi8nYMkL._AC_SX679_.jpg",
    note:"Fill a bin with rice, beans, water beads, or kinetic sand and add these tools. Scooping, pouring, tweezering — so much fine motor and sensory work.",
    search:"sensory bin kit tools scoops funnels tweezers kids"
  },
  {
    id:"p160", name:"Liquid Motion Calm Down Timer / Sensory Bottle", age_min:12, age_max:144,
    dev_areas:["sensory","cognitive","social"], tags:["sensory","self-regulation","visual","calm-down"],
    price:15, asin:"B0C5CWKLNL", afflink:"https://www.amazon.com.au/dp/B0C5CWKLNL/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81-hXXrQphL._AC_SX679_.jpg",
    note:"Flip it and watch the liquid move slowly down. Genuinely calming visual input — good for regulation, transitions, and focus.",
    search:"liquid motion timer calm down sensory bottle kids visual"
  },
  {
    id:"p161", name:"Textured Sensory Balls Set", age_min:0, age_max:60,
    dev_areas:["sensory","fine","gross"], tags:["sensory","tactile","grasping","fine-motor"],
    price:18, asin:"B09H7LSD22", afflink:"https://www.amazon.com.au/dp/B09H7LSD22/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51K3Y-sXPfL._AC_SX679_.jpg",
    note:"Different textures, sizes, and resistances. Great for tactile exploration at any age — from babies grasping to older kids squeezing for input.",
    search:"textured sensory balls set kids tactile variety"
  },
  // ── FROM 5-6 YEAR GUIDE / GIFTING GUIDE 5-10 ─────────────────────────────
  {
    id:"p162", name:"Noodle Knock Out Game", age_min:48, age_max:120,
    dev_areas:["gross","social","cognitive"], tags:["outdoor","movement","turn-taking","hand-eye","social","sports"],
    price:22, asin:"B0F4KYG3BC", afflink:"https://www.amazon.com.au/dp/B0F4KYG3BC/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/31TYpvfcJBL._AC_SX679_.jpg",
    note:"Knock pool noodles off pedestals with a ball. Active, funny, and great for hand-eye coordination and turn-taking.",
    search:"noodle knock out game kids outdoor active"
  },
  {
    id:"p163", name:"Excavation Kit (Dino or Gem)", age_min:60, age_max:120,
    dev_areas:["cognitive","fine"], tags:["dinosaurs","science","STEM","problem-solving","fine-motor"],
    price:22, asin:"B0GGRD2PYY", afflink:"https://www.amazon.com.au/dp/B0GGRD2PYY/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71hrjbTRzZL._AC_SX679_.jpg",
    note:"Chip away to reveal the fossil or gem inside. Patience, fine motor control, and the thrill of discovery. Great for dino fans.",
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
    note:"Designed by Brittany to support cognitive, language, and fine motor development through play-based activities. Laminate pages and reuse endlessly.",
    search:"Early Years Activity Book Kidera Brittany OT printable"
  },
  {
    id:"p166", name:"Mess-Free Painting Set", age_min:24, age_max:60,
    dev_areas:["fine","sensory","cognitive"], tags:["drawing","art","sensory","creative","mark-making"],
    price:18, asin:"B084Y3DLFJ", afflink:"https://www.amazon.com.au/dp/B084Y3DLFJ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/81q13+KL29L._AC_SX679_.jpg",
    note:"All the benefits of painting without the mess. Builds brush skills that transfer directly to pencil control later.",
    search:"mess free painting set kids toddler no mess art"
  },
  {
    id:"p167", name:"Bingo Dot Markers (Daubers)", age_min:24, age_max:60,
    dev_areas:["fine","cognitive"], tags:["drawing","fine-motor","grip","pre-writing","colours"],
    price:15, asin:"B086XBXH34", afflink:"https://www.amazon.com.au/dp/B086XBXH34/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71vi6YRNlbL._AC_SX679_.jpg",
    note:"Big satisfying dots that build hand control and grip strength. Great for dot-to-dot activities, colour recognition, and early mark making.",
    search:"bingo dot markers daubers kids art toddler"
  },
  {
    id:"p168", name:"Marvel Avengers Action Figure Set", age_min:60, age_max:120,
    dev_areas:["social","language","cognitive"], tags:["pretend-play","role-play","storytelling","social"],
    price:48, asin:"B0DNFR5VFK", afflink:"https://www.amazon.com.au/dp/B0DNFR5VFK/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71Ysb6GKu9L._AC_SX679_.jpg",
    note:"Character figures for open-ended pretend play. Superhero stories, good vs bad, rescue missions — rich imaginative play that kids come back to again and again.",
    search:"Marvel Avengers action figure set kids Iron Man"
  },
  {
    id:"p169", name:"Bike with Training Wheels (16 inch)", age_min:48, age_max:84,
    dev_areas:["gross"], tags:["balance","coordination","outdoor","movement","bilateral","vehicles"],
    price:120, asin:"B0DMV6BCW3", afflink:"https://www.amazon.com.au/dp/B0DMV6BCW3/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71a-iKUhcfL._AC_SX679_.jpg",
    note:"Pedalling builds leg strength and rhythm. Steering develops hand-eye coordination and core stability. A classic milestone.",
    search:"kids bike training wheels 16 inch pedal bicycle"
  },
  {
    id:"p170", name:"Melty Bead Set (Hama / Perler Beads)", age_min:60, age_max:120,
    dev_areas:["fine","cognitive"], tags:["fine-motor","focus","patterns","art","hand-eye"],
    price:22, asin:"B08M8YWJPT", afflink:"https://www.amazon.com.au/dp/B08M8YWJPT/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/816S1ti3FoS._AC_SX679_.jpg",
    note:"Place tiny beads on a pegboard then iron to fuse. Precision, patience, pattern making, and pincer grip — excellent for older kids who like detailed craft.",
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
    note:"Throw soft toys or balls into a basket from different distances. Turn-taking, aiming, and adjusting throw strength.",
    search:"basket throwing game soft toys kids indoor outdoor"
  },
  {
    id:"p173", name:"Keezi Water Table with Umbrella (26pcs)", age_min:24, age_max:72,
    dev_areas:["sensory","fine","cognitive"], tags:["sensory","water","outdoor","pouring","sorting"],
    price:79, asin:"B0778F2NKQ", afflink:"https://www.amazon.com.au/dp/B0778F2NKQ/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/51esJP5lDXL._AC_SX679_.jpg",
    note:"Waterwheel, boats, buckets, and a slide all in one. Outdoor water play that keeps kids busy for hours while building fine motor and sensory skills.",
    search:"Keezi Water Table Umbrella sandpit toys kids outdoor"
  },
  {
    id:"p174", name:"Duckie Goes On An Adventure High Contrast Bath Book", age_min:0, age_max:12,
    dev_areas:["sensory","language","cognitive"], tags:["visual","tummy-time","water","books","sensory"],
    price:20, asin:"0646879340", afflink:"https://www.amazon.com.au/dp/0646879340/?tag=brittanyot0c-22", img:"https://m.media-amazon.com/images/I/71kBKnub47L._SY522_.jpg",
    note:"High contrast black and white bath book. Sensory play in the bath plus early visual development and language. A lovely combination.",
    search:"Duckie Goes On An Adventure High Contrast Bath Book baby"
  },

  // ── GAP-FILL EXPANSION (from Brittany's worksheet) ──────────────────────────
  {
    id:"p175", name:"Animal Barn Playset", age_min:12, age_max:36,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","cause-effect","language"],
    price:32.99, asin:null, afflink:"https://link.amazon/B0fNJdiYr", img:"https://m.media-amazon.com/images/I/81Wy6HIjoTL._AC_SL1500_.jpg",
    note:"Open the doors, pop the animals in and out, make the sounds. Barn play is packed with early vocabulary and simple pretend play.",
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
    note:"Ask smart questions to guess the animal in ten. Builds question asking, categorising and vocabulary, all skills I work on in therapy constantly.",
    search:"Skillmatics Guess in 10: Animal Kingdom kids"
  },
  {
    id:"p179", name:"LEGO Creator 3-in-1 Cute Animals", age_min:96, age_max:120,
    dev_areas:["fine","cognitive"], tags:["animals","constructive","blocks-tiles","problem-solving"], fam:"lego",
    price:31.49, asin:null, afflink:"https://link.amazon/B0flNdA3S", img:"https://m.media-amazon.com/images/I/81nXrJT7jkL._AC_SX679_.jpg",
    note:"Build three different animals from one set. Following the instructions builds sequencing and visual perception, and rebuilding keeps it fresh.",
    search:"LEGO Creator 3-in-1 Cute Animals kids"
  },
  {
    id:"p180", name:"Toddler Learning Farm Train Set", age_min:12, age_max:36,
    dev_areas:["cognitive","language","fine"], tags:["animals","cause-effect","sorting","trains"],
    price:45.99, asin:null, afflink:"https://link.amazon/B0iqnQX7s", img:"https://m.media-amazon.com/images/I/81kVIPnqrDL._AC_SX679_.jpg",
    note:"Animals, sorting and a train all in one. Lots of cause and effect and early language for little farm fans.",
    search:"Toddler Learning Farm Train Set kids"
  },
  {
    id:"p181", name:"Weighted Dragon Plush", age_min:60, age_max:120,
    dev_areas:["sensory","social"], tags:["deep-pressure","plush","animals","self-regulation","calm-down"],
    price:57.94, asin:null, afflink:"https://link.amazon/B0dCMfh64", img:"https://m.media-amazon.com/images/I/51VD8R5RN4L._AC_SX679_.jpg",
    note:"Weighted plush gives lovely calming deep pressure across the lap or shoulders. A cuddly regulation tool that doesn't look like one.",
    search:"Weighted Dragon Plush kids"
  },
  {
    id:"p182", name:"Spot It! Animals Card Game", age_min:48, age_max:120,
    dev_areas:["cognitive","social"], tags:["animals","visual","reaction-time","card-game","turn-taking"],
    price:17.95, asin:null, afflink:"https://link.amazon/B02X5JKJZ", img:"https://m.media-amazon.com/images/I/71lMRod-nIL._AC_SX679_.jpg",
    note:"Find the matching animal before everyone else. Fast, funny, and brilliant for visual scanning and processing speed.",
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
    id:"p185", name:"Farm Animal Memory Cards", age_min:36, age_max:120,
    dev_areas:["cognitive","social"], tags:["animals","memory","turn-taking","card-game"], fam:"memory-cards",
    price:9.29, asin:null, afflink:"https://link.amazon/B05Xda5t4", img:"https://m.media-amazon.com/images/I/7180poFdu1L._SL1500_.jpg",
    note:"A classic memory game with friendly farm faces. Working memory, turn-taking and a genuine chance for kids to beat the grown-ups.",
    search:"Farm Animal Memory Cards kids"
  },
  {
    id:"p186", name:"I Spy Animals Book", age_min:24, age_max:48,
    dev_areas:["language","cognitive"], tags:["animals","books","visual","language"], fam:"i-spy-book",
    price:20.21, asin:null, afflink:"https://link.amazon/B0dbjwbzv", img:"https://m.media-amazon.com/images/I/61PYd0Em4LL._SL1000_.jpg",
    note:"Search the page, find the animal, name it together. I spy books build visual scanning and vocabulary side by side.",
    search:"I Spy Animals Book kids"
  },
  {
    id:"p187", name:"Melissa & Doug Magnetic Fishing Game", age_min:36, age_max:60,
    dev_areas:["fine","cognitive"], tags:["animals","fine-motor","hand-eye","patience"], fam:"fishing-game",
    price:16.37, asin:null, afflink:"https://link.amazon/B0aq1iy3i", img:"https://m.media-amazon.com/images/I/817blwa0MZL._AC_SX679_.jpg",
    note:"Steady hands and patience to hook each fish. Magnetic fishing is a quiet fine motor workout kids ask to repeat.",
    search:"Melissa & Doug Magnetic Fishing Game kids"
  },
  {
    id:"p188", name:"I Spy Ocean Animals Book", age_min:36, age_max:96,
    dev_areas:["language","cognitive"], tags:["animals","books","visual","language"], fam:"i-spy-book",
    price:19.21, asin:null, afflink:"https://link.amazon/B07qHSBLV", img:"https://m.media-amazon.com/images/I/71cycnoRvdL._SL1000_.jpg",
    note:"Under the sea seek and find. Great for visual attention and ocean vocabulary, and it works beautifully as a calm-down activity.",
    search:"I Spy Ocean Animals Book kids"
  },
  {
    id:"p189", name:"Skillmatics Search & Find: Animals at Play", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["animals","visual","reusable","focus","mark-making"],
    price:19.99, asin:null, afflink:"https://link.amazon/B00oHlB50", img:"https://m.media-amazon.com/images/I/81nEi3D6b0L._AC_SL1500_.jpg",
    note:"Wipe clean search and find boards you can use over and over. Visual scanning, focus and pen control in one reusable pack.",
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
    note:"Bath time is sensory play time. Pouring, squeezing and splashing with ocean friends builds hand skills while they soak.",
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
    note:"Big, realistic dinosaurs that hold up to serious play. Perfect for storytelling, sensory bins and backyard dino digs.",
    search:"6 Piece Large Dinosaur Figures Set kids"
  },
  {
    id:"p195", name:"Melissa & Doug Pet Vet Play Set", age_min:36, age_max:96,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","role-play","nurturing","empathy"], fam:"vet-set",
    price:52.9, asin:null, afflink:"https://link.amazon/B07fd56G4", img:"https://m.media-amazon.com/images/I/714NIH2CVFL._AC_SL1500_.jpg",
    note:"Check-ups, bandages and lots of caring talk. Vet play builds empathy and language, and it's a lovely bridge for kids who find doctor visits scary.",
    search:"Melissa & Doug Pet Vet Play Set kids"
  },
  {
    id:"p196", name:"Critter Clinic Vet Set", age_min:24, age_max:72,
    dev_areas:["fine","social","cognitive"], tags:["animals","pretend-play","fine-motor","problem-solving","nurturing"], fam:"vet-set",
    price:99.99, asin:null, afflink:"https://link.amazon/B07Uw326b", img:"https://m.media-amazon.com/images/I/81EJpdwEpDL._AC_SL1500_.jpg",
    note:"Six little doors, six keys, and patients waiting inside. The lock and key work is sneaky fine motor gold on top of the caring play.",
    search:"Critter Clinic Vet Set kids"
  },
  {
    id:"p197", name:"Hape Puppy Care Clinic Vet Set", age_min:36, age_max:84,
    dev_areas:["social","language","cognitive"], tags:["animals","pretend-play","role-play","nurturing","empathy"], fam:"vet-set",
    price:49.99, asin:null, afflink:"https://link.amazon/B0dV33seI", img:"https://m.media-amazon.com/images/I/81PQ6knFe0L._AC_SL1500_.jpg",
    note:"A beautiful wooden clinic for looking after a poorly puppy. Nurturing pretend play that builds empathy and sequencing.",
    search:"Hape Puppy Care Clinic Vet Set kids"
  },
  {
    id:"p198", name:"Play-Doh Care 'n Carry Vet Set", age_min:36, age_max:84,
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
    note:"Seventy experiments means weeks of what happens if. Following the steps builds sequencing and the results build a little scientist.",
    search:"70 Lab Experiments Science Kit kids"
  },
  {
    id:"p201", name:"National Geographic Science Magic Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","social"], tags:["STEM","science","experiments","performance"], fam:"science-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B0c9bE2RU", img:"https://m.media-amazon.com/images/I/81zJwByLeFL._AC_SL1500_.jpg",
    note:"Science tricks they can perform for the family. Learning the science AND presenting the show builds confidence on both fronts.",
    search:"National Geographic Science Magic Kit kids"
  },
  {
    id:"p202", name:"150 Science Experiments Kit", age_min:96, age_max:120,
    dev_areas:["cognitive","fine"], tags:["STEM","science","experiments","problem-solving"], fam:"science-kit",
    price:39.99, asin:null, afflink:"https://link.amazon/B09QQhUsc", img:"https://m.media-amazon.com/images/I/818eRP4CCUL._AC_SL1500_.jpg",
    note:"A big box of proper experiments for a kid who asks why about everything. Independence, sequencing and real science thinking.",
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
    note:"Build a working circuit and watch the motor spin. Cause and effect at its most satisfying, and a great budget entry into electronics.",
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
    id:"p209", name:"Learning Resources Code & Go Robot Mouse", age_min:48, age_max:96,
    dev_areas:["cognitive","fine"], tags:["STEM","coding","problem-solving","sequencing","cause-effect"], fam:"coding-robot",
    price:60.6, asin:null, afflink:"https://link.amazon/B0b4cnk1L", img:"https://m.media-amazon.com/images/I/81SVjjQPCWL._AC_SL1500_.jpg",
    note:"Program the mouse to find the cheese, no screen needed. Screen-free coding that teaches sequencing and planning through play.",
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
    note:"The classic for a reason. Colour and number matching, turn-taking, and coping when someone hits you with a draw four. All real skills.",
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
    note:"Does your person wear glasses? Guess Who quietly teaches question asking, deduction and describing features. A therapy room staple for good reason.",
    search:"Guess Who kids"
  },
  {
    id:"p222", name:"Monopoly Junior: Bluey Edition", age_min:60, age_max:120,
    dev_areas:["cognitive","social"], tags:["board-game","numbers","turn-taking","bluey"],
    price:22.0, asin:null, afflink:"https://link.amazon/B09NDA80D", img:"https://m.media-amazon.com/images/I/81DPZQ6tQYL._AC_SL1500_.jpg",
    note:"A first board game with the Heeler family along for the ride. Counting, turn-taking and simple money concepts at just the right level.",
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
    id:"p224", name:"Pop Up Pirate", age_min:36, age_max:96,
    dev_areas:["fine","cognitive","social"], tags:["board-game","turn-taking","fine-motor","cause-effect","suspense"],
    price:14.95, asin:null, afflink:"https://link.amazon/B02qOPxKy", img:"https://m.media-amazon.com/images/I/812lSGtI33L._AC_SL1500_.jpg",
    note:"Slide the swords in and wait for the pirate to pop. Turn-taking, fine motor and managing the suspense. Kids beg to play it again.",
    search:"Pop Up Pirate kids"
  },
  {
    id:"p225", name:"Jenga", age_min:72, age_max:120,
    dev_areas:["fine","cognitive","social"], tags:["board-game","fine-motor","balance","turn-taking","hand-eye"],
    price:29.99, asin:null, afflink:"https://link.amazon/B08T6H9Ih", img:"https://m.media-amazon.com/images/I/81xyPFZTrfL._AC_SL1500_.jpg",
    note:"Steady hands, careful planning and the delicious tension of a wobbling tower. Fine motor control under pressure, plus a big crash payoff.",
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
    note:"A backyard goal turns kicking practice into a game. Striking a moving ball builds timing, balance and coordination, and it's World Cup year.",
    search:"Pop-Up Soccer Goal Set kids"
  },
  {
    id:"p230", name:"Little Tikes T-Ball Set", age_min:18, age_max:72,
    dev_areas:["gross"], tags:["outdoor","sports","hand-eye","coordination","bilateral"],
    price:29.0, asin:null, afflink:"https://link.amazon/B06s4CGzx", img:"https://m.media-amazon.com/images/I/61nGSQIlFeL._AC_SL1500_.jpg",
    note:"The ball sits still so little sluggers can connect. T-ball is the perfect first hitting sport, building hand-eye coordination without the frustration.",
    search:"Little Tikes T-Ball Set kids"
  },
  {
    id:"p231", name:"Totem Tennis Set", age_min:72, age_max:120,
    dev_areas:["gross"], tags:["outdoor","sports","hand-eye","coordination","reaction-time"],
    price:75.95, asin:null, afflink:"https://link.amazon/B02Gt20Dt", img:"https://m.media-amazon.com/images/I/51JvRnkHNBL._AC_SL1500_.jpg",
    note:"An Aussie backyard classic. Tracking a ball on a string builds visual tracking and timing, and one kid can play solo when no one's free.",
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
    note:"A rescue boat build with rescue missions to follow. Following LEGO instructions is brilliant for sequencing and visual perception.",
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
    note:"A pocket-money LEGO set with maximum cute factor. A great first build for small hands and short attention spans.",
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
    note:"Cafe role play meets a satisfying build. Taking orders and serving customers is social skills practice in disguise.",
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
    note:"A tree house build with a cat party inside it. Animal lovers get their fix while the fine motor work happens quietly.",
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
    note:"An under-the-sea palace at a lovely price point. Compact builds like this are perfect confidence builders.",
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
    note:"A pocket-money loader build for little construction fans. Small sets are underrated for building independence.",
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
    id:"p253", name:"Crazy Aaron's Thinking Putty", age_min:36, age_max:144,
    dev_areas:["sensory","fine"], tags:["sensory","fidget","hand-strength","tactile","calm-down"], fam:"putty",
    price:14.99, asin:null, afflink:"https://link.amazon/B0fLOwsag", img:"https://m.media-amazon.com/images/I/81J2cIswLwL._AC_SL1500_.jpg",
    note:"The premium putty. Stretch it, snap it, sculpt it. Wonderful tactile input for busy hands and genuinely calming to work with.",
    search:"Crazy Aaron's Thinking Putty kids"
  },
  {
    id:"p254", name:"Sensory Stress Cube Set", age_min:36, age_max:144,
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
    note:"Chunky wooden pieces for the very first puzzlers. Grasping, rotating and fitting builds fine motor and visual skills together.",
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
    note:"One hundred pieces is a proper sit-down challenge. Sustained focus, visual scanning and the pride of the finished picture.",
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
      {value:30, label:"2 to 3 years",            emoji:"🌿"},
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
    subtitle:"Helps me think about what kind of recommendation makes sense.",
    type:"single",
    options:[
      {value:"birthday",          label:"Birthday gift",                       emoji:"🎂"},
      {value:"christmas",         label:"Christmas",                           emoji:"🎄"},
      {value:"everyday",          label:"Just looking for good play ideas",    emoji:"🧸"},
      {value:"gift-from-someone", label:"Giving ideas to a relative or friend",emoji:"🎁"},
      {value:"therapy-support",   label:"Supporting specific development goals",emoji:"💛"},
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
      {value:"no-limit",  label:"No budget in mind"},
    ],
  },
  {
    id:"child_snapshot",
    question:"Tell me about your child right now",
    subtitle:"What are they obsessed with? Favourite toys, characters or activities? How do they like to play — physical, creative, focused, social? Any skills or goals you're working on? The more you share, the better the match.",
    type:"text",
    placeholder:"e.g. He's completely obsessed with trains and anything with wheels. Just started walking at 14 months. Loves being outside and has about 20 words. Very determined. Still mouths a lot of toys so nothing too small...",
    optional:false,
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
      {value:"art",           label:"Drawing, painting and crafts 🎨", minAge:13},
      {value:"music",         label:"Music and singing 🎵"},
      {value:"stories",       label:"Books and stories 📚"},
      {value:"puzzles",       label:"Puzzles and figuring things out 🧩", minAge:13},
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
      {value:"gross",         label:"Gross motor — movement, strength, coordination 🤸"},
      {value:"fine",          label:"Fine motor — hand strength, grip, finger skills ✍️"},
      {value:"language",      label:"Communication and language 💬"},
      {value:"cognitive",     label:"Problem-solving and learning 🧠"},
      {value:"social",        label:"Social skills, turn-taking and emotional regulation 🤝"},
      {value:"sensory",       label:"Sensory play and exploration 🌈"},
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

function parseBudget(b){
  if(b==="under-20")return[0,20];if(b==="20-50")return[20,50];
  if(b==="50-100")return[50,100];if(b==="100-plus")return[100,999];
  return[0,9999];
}


// Convert stored months value to the friendly age label used in the quiz
function ageLabel(months){
  const map={2:"0 to 3 months",4:"4 to 6 months",7:"7 to 12 months",13:"12 to 18 months",19:"18 months to 2 years",30:"2 to 3 years",42:"3 to 4 years",54:"4 to 5 years",66:"5 to 6 years",84:"6 to 8 years",108:"8 to 10 years"};
  return map[months]||(months+" months");
}


// Detect when a parent's description suggests developmental delays or additional needs.
// When present, toys rated for younger ages become eligible (gently penalised so
// age-typical options still lead when equally relevant). The age MINIMUM is never
// relaxed: a toy rated older than the child is never suggested, for safety.
function hasDelaySignals(answers){
  const text=((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();
  return /(develop\w*\s+delay|delay(ed)?\b|non[\s-]?verbal|not\s+(yet\s+)?talking|can'?t\s+talk|doesn'?t\s+talk|no\s+words|autis|\basd\b|down\s+syndrome|disabilit|special\s+needs|global\s+delay|behind\s+(his|her|their)\s+peers|regress|intellectual|cerebral\s+palsy|\bndis\b)/i.test(text);
}

function hasNonverbalSignals(answers){
  const text=((answers.child_snapshot||"")+" "+(answers.wildcard||"")).toLowerCase();
  return /(non[\s-]?verbal|no\s+words|can'?t\s+talk|doesn'?t\s+talk|not\s+(yet\s+)?talking|minimally\s+verbal|few\s+words)/i.test(text);
}

function scoreProduct(p, answers){
  const age=answers.child_age;
  if(age<p.age_min)return -1; // hard floor: never a toy rated for older kids
  const _overAge=age>p.age_max;
  if(_overAge&&!hasDelaySignals(answers))return -1;
  const[,budgetMax]=parseBudget(answers.budget);
  if(p.price>budgetMax)return -1;

  const alreadyHave=answers.already_have||[];
  // Hard exclusions
  if(alreadyHave.includes("blocks-tiles")&&p.tags.includes("blocks-tiles"))return -1;
  if(alreadyHave.includes("board-games")&&p.tags.includes("board-game"))return -1;
  if(alreadyHave.includes("books")&&p.tags.includes("books"))return -1;
  if(alreadyHave.includes("craft-supplies")&&(p.tags.includes("craft")||p.tags.includes("drawing")&&!p.tags.includes("vertical-surface")))return -1;
  if(alreadyHave.includes("pretend-play")&&p.tags.includes("pretend-play")&&!p.tags.includes("tool-use")&&!p.tags.includes("dinosaurs")&&!p.tags.includes("vehicles")&&!p.tags.includes("trains"))return -1;
  if(alreadyHave.includes("outdoor-toys")&&p.tags.includes("outdoor")&&p.dev_areas.length===1&&p.dev_areas[0]==="gross")return -1;
  if(alreadyHave.includes("puzzles")&&(p.tags.includes("jigsaw")||p.fam==="jigsaw"))return -1;
  if(alreadyHave.includes("vehicles-already")&&p.tags.includes("vehicles")&&!p.tags.includes("constructive"))return -1;
  if(alreadyHave.includes("dolls-already")&&(p.tags.includes("dolls")||p.tags.includes("plush")))return -1;
  if(alreadyHave.includes("dinosaurs-already")&&p.tags.includes("dinosaurs")&&!(p.fam==="jigsaw"||p.tags.includes("constructive")))return -1;
  if(alreadyHave.includes("sensory-fidget")&&(p.tags.includes("fidget")||p.fam==="putty"))return -1;
  if(alreadyHave.includes("stem-already")&&(p.fam==="science-kit"||p.fam==="circuit-kit"))return -1;

  // Functional/everyday equipment (cups, potty, step stool, cutlery, dressing doll) is only relevant
  // when self-care is a chosen goal, or when the parent picked no goals at all. Otherwise exclude it
  // so we never suggest a cup to someone focused on language, for example.
  const FUNCTIONAL_IDS=["p120","p121","p122","p123","p124"];
  const devFocusGoals=(answers.dev_focus||[]);
  const selfcareWanted=devFocusGoals.includes("selfcare")||devFocusGoals.includes("no-preference")||devFocusGoals.length===0;
  if(FUNCTIONAL_IDS.includes(p.id)&&!selfcareWanted)return -1;


  let score=_overAge?-Math.min(6,Math.ceil((age-p.age_max)/12)):0;
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

  const interests=answers.interests||[];
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
    games:["board-game","card-game","word-game"],
    water:["water","sensory","breath-control","tactile","fidget"],science:["STEM","science","experiments","coding","circuits"],
  };
  // Sensory dev area — direct boost for sensory-specific tags
  if((answers.dev_focus||[]).includes("sensory")){
    const sensoryTags=["vestibular","proprioceptive","deep-pressure","sensory","fidget","stretchy","heavy-work","swing","soft-play"];
    if(p.tags.some(t=>sensoryTags.includes(t)))score+=4;
  }
  // Active/movement play style — boost heavy work and outdoor
  if((answers.play_style||[]).includes("active-physical")){
    const activeTags=["heavy-work","proprioceptive","vestibular","climbing","jumping","movement","outdoor"];
    if(p.tags.some(t=>activeTags.includes(t)))score+=2;
  }
  p._matchedInterests=[];
  interests.forEach(interest=>{
    const mapped=directTagMap[interest]||[];
    const matchCount=p.tags.filter(t=>mapped.includes(t)).length;
    if(matchCount>0){score+=matchCount*4;p._matchedInterests.push(interest);}
  });

  const playStyle=answers.play_style||[];
  if(playStyle.includes("active-physical")&&p.dev_areas.includes("gross"))score+=2;
  if(playStyle.includes("calm-focused")&&(p.dev_areas.includes("fine")||p.dev_areas.includes("cognitive")))score+=2;
  if(playStyle.includes("open-ended")&&p.tags.includes("open-ended"))score+=2;
  if(playStyle.includes("with-adults")&&(p.dev_areas.includes("social")||p.tags.includes("turn-taking")))score+=1;
  if(playStyle.includes("with-siblings-friends")&&p.tags.includes("turn-taking"))score+=1;
  return score;
}

const INTEREST_CAP=2;

function getRecommendations(answers,count=5,excluded=[]){
  const scored=PRODUCTS
    .filter(p=>!excluded.includes(p.id))
    .map(p=>{const score=scoreProduct(p,answers);return{...p,score,_matchedInterests:p._matchedInterests};})
    .filter(p=>p.score>=0)
    .sort((a,b)=>b.score-a.score);

  const CAP=(answers.interests||[]).length<=1?3:INTEREST_CAP;
  const result=[];const usedAreas=new Set();const interestCount={};const famUsed=new Set();
  const famBlocked=(p)=>p.fam&&famUsed.has(p.fam); // never two of the same kind (e.g. two science kits)
  const take=(p)=>{result.push(p);p.dev_areas.forEach(a=>usedAreas.add(a));if(p.fam)famUsed.add(p.fam);
    (p._matchedInterests||[]).forEach(int=>{interestCount[int]=(interestCount[int]||0)+1;});};

  // ── GOAL COVERAGE: ensure at least one toy per chosen development goal ──
  const chosenGoals=(answers.dev_focus||[]).filter(g=>g!=="no-preference");
  for(const goal of chosenGoals){
    if(result.length>=count)break;
    // highest scoring toy that covers this goal and isn't already picked
    const pick=scored.find(p=>p.dev_areas.includes(goal)&&!result.find(r=>r.id===p.id)&&!famBlocked(p));
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
    if(newArea||result.length<2||ints.length>0)take(p);
  }
  for(const p of scored){
    if(result.length>=count)break;
    if(result.find(r=>r.id===p.id))continue;
    if(famBlocked(p))continue;
    const ints=p._matchedInterests||[];
    const capped=ints.some(int=>(interestCount[int]||0)>=CAP);
    if(!capped)take(p);
  }
  for(const p of scored){
    if(result.length>=count)break;
    if(!result.find(r=>r.id===p.id))result.push(p);
  }
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
      if(res.ok&&data.ok){setDone(true);}
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
    "Making sure they will love these",
    "Finding a just right challenge",
    "Adding a little OT flair",
    "Generating play tips just for you",
    "Scrutinising the toy aisle",
    "Checking everything is age appropriate",
    "Lining up the perfect picks",
    "Thinking like a paediatric OT",
    "Almost there, good things take a sec",
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
      <div style={{fontSize:18,color:TEXT,fontWeight:700,marginBottom:10}}>This might take a minute</div>
      <div key={i} style={{fontSize:15,color:K_GREEN,fontWeight:600,minHeight:22,animation:"fadeIn 0.5s ease"}}>{messages[i]}</div>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function KideraToyQuiz(){
  const[step,setStep]=useState(0);const[answers,setAnswers]=useState({});
  const[result,setResult]=useState(null);const[loading,setLoading]=useState(false);
  const[swappingIndex,setSwappingIndex]=useState(null);const[excludedIds,setExcludedIds]=useState([]);

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
    const summary=`Child's age: ${ageLabel(answers.child_age)}
Occasion: ${answers.occasion}. Budget: ${answers.budget}.
Parent's description of their child: "${answers.child_snapshot||"not provided"}"
Buying for: ${answers.recipient==="my-child"||!answers.recipient?"their own child":"a child who is NOT their own (this is a gift)"}
Interests ticked: ${(answers.interests||[]).filter(v=>v!=="not-sure").join(", ")||"not sure / none specified"}
Development goals the parent wants to support: ${(answers.dev_focus||[]).join(", ")||"none specified"}
How the child likes to play: ${(answers.play_style||[]).filter(v=>v!=="not-sure").join(", ")||"not sure / not specified"}
Already have plenty of: ${(answers.already_have||[]).join(", ")||"nothing specified"}
Extra notes: ${answers.wildcard||"none"}`;

    if(singleIndex!==null){
      const toy=recs[singleIndex];
      const prompt=`You are Brittany, a paediatric OT and Kidera founder. You write like a knowledgeable friend, warm and direct. Short sentences. No jargon. No em dashes. No AI words like "seamlessly", "fostering", "ensuring".

Child: ${summary}

The toy: "${toy.name}". What it actually is and does: ${toy.note}

Write ONE sentence explaining why this toy is a good match for this specific child. Draw on what the parent described and only on the product's real features. Be specific, not generic.

JSON only: {"reason":"..."}`;
      const res=await fetch("/api/personalise",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({max_tokens:200,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      return JSON.parse(data.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
    }

    const devLabelMap={gross:"gross motor",fine:"fine motor",cognitive:"problem-solving and learning",language:"communication and language",social:"social and emotional skills",sensory:"sensory",selfcare:"self-care and independence"};
    const FUNCTIONAL_IDS=["p120","p121","p122","p123","p124"]; // step stool, learning tower, cup, potty, cutlery, dressing doll
    const isFunctional=(p)=>FUNCTIONAL_IDS.includes(p.id)||/learning tower|step stool|cutlery|open cup|potty|toilet seat|dressing doll/i.test(p.name);
    const productList=recs.map((p,i)=>`${i+1}. ${p.name} ($${p.price}) supports: ${p.dev_areas.map(d=>devLabelMap[d]||d).join(", ")}. What it is and does: ${p.note}${isFunctional(p)?" [FUNCTIONAL EVERYDAY EQUIPMENT, apply the special functional rule]":""}`).join("\n");
    const goalsRaw=(answers.dev_focus||[]).filter(g=>g!=="no-preference");
    const goalsList=goalsRaw.map(g=>devLabelMap[g]||g).join(", ");
    const prompt=`You are Brittany, a paediatric occupational therapist with 8 years of experience and founder of Kidera, a children's development brand in Perth, Australia.

Your writing style: warm, direct, genuine. Write like you're talking to a friend who trusts your expertise. Short sentences. Plain language. No em dashes. No AI words like "seamlessly", "fostering", "ensuring", "delve", "empowering", "testament", "navigate". Never use the words "workhorse", "arsenal" or "toolkit" when talking about children or their development. Specific and practical.

Parent's answers:
${summary}

Toys to personalise (with the development areas each one supports):
${productList}

The development goals this parent told us they want to support: ${goalsList||"none specified, so focus on their interests and the child's described stage"}

Write a warm reason for each toy. Every reason MUST explicitly connect the toy back to this specific child, to a development goal they chose, an interest they ticked, something they described, or the child's current stage. Name the connection out loud. For example: "This one is brilliant for the fine motor goal you mentioned, because pressing the buttons builds the hand strength she'll later use for writing" or "Since he's obsessed with trains, this taps straight into that while sneaking in some problem-solving."

Where a toy genuinely supports MORE THAN ONE of the goals or areas the parent cares about, say so. Do not limit a toy to a single goal. For example a lift-the-flap book is great for both fine motor and language, so name both. Toddler cutlery supports both fine motor and self-care. Only mention the goals that genuinely apply, do not stretch.

Even when a toy is picked because the child LOVES it (an interest match), still link it back to the development goals the parent chose wherever there is a real connection. For example if a child loves water drawing and the parent's goal is language, do not just say "she'll love this", also explain how it supports language, like "and it is a lovely language builder too, naming colours and objects as she paints." Interest and goal should both show up in the reason whenever both genuinely apply.

IMPORTANT COVERAGE RULE: The parent chose these development goals: ${goalsList||"(none)"}. Across the five reasons, make sure EVERY ONE of those goals is explicitly named and covered by at least one toy. If a toy supports one of their goals, say so directly using the goal's name, for example "good for your fine motor goal because...". Do not leave any chosen goal unmentioned.

${hasDelaySignals(answers)?`IMPORTANT CONTEXT: The parent's description suggests this child may have developmental delays or additional needs. Some picks may be rated for younger ages on purpose. They were chosen to meet the child at their current developmental level, which is exactly the right approach. Frame every reason around what this child enjoys and can do right now and the next small step it builds, never around age. Never describe a toy as being for younger kids, for babies, or simple. Speak about the child with the same warmth and respect as any other child.

`:""}${answers.recipient&&answers.recipient!=="my-child"?`GIFT MODE: The person taking this quiz is choosing a gift for a child who is NOT their own. Never say "your child". Refer to the child as "this child" or "this little one". Return an empty string for every play_idea, no play ideas in gift mode. Frame each reason as why this makes a great gift for this specific child. For the curator note, speak to a thoughtful gift-giver: acknowledge the care they are putting into choosing well, and end with the sentiment that this child's parents know them best and any of these picks will land beautifully.

`:""}GROUNDING RULE: Each toy's listing above tells you what it actually is and does. Base every reason and play idea ONLY on the product's real features. Never invent features it does not have. Think through the practical reality of the suggestion before writing it: if the toy itself gives the cues (lights, sounds, spoken commands, music), do not tell the parent to give the cue, the child responds to the toy. If a toy launches, flies, or travels a long way, suggest an open space like a park or oval rather than assuming a backyard is big enough. If an activity is messy, only suggest it somewhere that makes sense. Every play idea must be something a real parent could physically do with that exact product.

Unless GIFT MODE above applies, for EVERY toy always include a play idea. Never leave one blank. Use Brittany's style from her 30 Day Play Calendar: specific, active, one sentence, a little playful. Examples of her style:
- "Set up a dinosaur hospital where the T-Rex has crashed and needs the doctor kit to fix his leg"
- "Use the scarves for peek-a-boo or wave them around like ocean waves while you sing a song"
- "Make it a challenge, can they stack it higher than last time before it falls?"
- "Take it outside and draw a road system with chalk for the trucks to drive on"
- "Hide small toys inside the kinetic sand and let them excavate like a palaeontologist"
If the toy already matches the child's interest, the play idea should be a fresh new way to play with it, ideally one that also stretches a development goal the parent chose. For example if a child loves water drawing and the parent's goal is language, suggest "Name each thing as they paint it, or take turns drawing something and guessing what the other drew, to get lots of new words flowing." Always try to weave a chosen goal into the play idea where it fits naturally.
Keep play ideas brief, practical, and fun.

SPECIAL RULE FOR FUNCTIONAL OR EVERYDAY EQUIPMENT (learning towers, step stools, toddler cutlery, open cups, potties, dressing dolls, anything practical rather than a typical toy): For these, the play idea should show how to bring the item INTO play, not just use it for its everyday function. Examples in Brittany's voice:
- Toddler cutlery: "Bring it into play too, set up a teddy bear picnic, play restaurants, or use it to cut and serve playdough food"
- Learning tower or step stool: "Pop them up at the bench and let them join in cooking or washing up. Being part of the everyday alongside you is rich, hands-on learning and play for a little one"
- Open cup: "Practice in the bath or at a tea party with the dolls first, where a spill doesn't matter"
- Dressing doll: "Let them dress and undress the doll as a game before tackling their own buttons"
And in the REASON for these functional items, it is good to also mention they help at mealtimes or daily routines, and to link that to the self-care and independence goal where the parent picked it. Functional equipment is play AND practical, say both. ALWAYS include a play idea for functional equipment, never leave it blank, even if it does not match a stated interest (unless GIFT MODE applies).

Then write a warm, individualised 2-3 sentence note from Brittany. It must feel personal to THIS family, never generic. If the parent gave lots of detail, reference something specific they said. If they gave very little, still make it feel individual by drawing on their actual quiz choices: their child's age (${ageLabel(answers.child_age)}), the goals they picked, the interests they ticked, or the occasion. Speak to their situation directly. No em dashes. Short sentences. End with this sentiment in Brittany's own words: every child develops at their own pace, and you know yours best. (If GIFT MODE applies, use the gift ending described there instead.)

VARIETY RULE: The five toys are deliberately varied. Never present two toys as interchangeable or repeat the same reasoning for two different toys. Each reason should make clear what this specific toy adds that the others don't.

ALIGNMENT RULE: Number every item to match the numbered toy list above exactly. The object with n=1 must be about toy 1 and no other toy, n=2 about toy 2, and so on. Repeat the product name in the "product" field as a check.

JSON only (no markdown):
{"items":[{"n":1,"product":"exact name of toy 1","reason":"...","play_idea":"..."},{"n":2,"product":"...","reason":"...","play_idea":"..."},{"n":3,"product":"...","reason":"...","play_idea":"..."},{"n":4,"product":"...","reason":"...","play_idea":"..."},{"n":5,"product":"...","reason":"...","play_idea":"..."}],"curator_note":"..."}`;

    const res=await fetch("/api/personalise",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({max_tokens:1500,messages:[{role:"user",content:prompt}]})});
    const data=await res.json();
    const parsed=JSON.parse(data.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
    return normalizeAI(parsed,recs);
  }

  async function handleSubmit(){
    setLoading(true);
    try{
      const recs=getRecommendations(answers,5,excludedIds);
      const ai=await callAI(recs);
      setResult({recs,play_ideas:ai.play_ideas||recs.map(()=>""),...ai});
    }catch{
      const recs=getRecommendations(answers,5,excludedIds);
      setResult({recs,personalised_reasons:recs.map(p=>p.note),play_ideas:recs.map(()=>""),curator_note:"These picks are matched to your child's age, interests and development. Trust your instincts, and remember the best toy is always one that sparks real joy for them."});
    }finally{setLoading(false);}
  }

  async function handleSwap(index){
    const toReplace=result.recs[index];
    const newExcluded=[...excludedIds,toReplace.id];
    const keptIds=result.recs.filter((_,i)=>i!==index).map(r=>r.id);
    setExcludedIds(newExcluded);setSwappingIndex(index);
    try{
      const replacement=getRecommendations({...answers},1,[...newExcluded,...keptIds]);
      if(!replacement.length){setSwappingIndex(null);return;}
      const newToy=replacement[0];
      let reason=newToy.note;let playIdea="";
      try{const ai=await callAI([newToy],0);reason=ai.reason||newToy.note;}catch{}
      setResult(prev=>{
        const newRecs=[...prev.recs];newRecs[index]=newToy;
        const newReasons=[...prev.personalised_reasons];newReasons[index]=reason;
        const newPlayIdeas=[...(prev.play_ideas||[])];newPlayIdeas[index]=playIdea;
        return{...prev,recs:newRecs,personalised_reasons:newReasons,play_ideas:newPlayIdeas};
      });
    }finally{setSwappingIndex(null);}
  }

  function reset(){setStep(0);setAnswers({});setResult(null);setLoading(false);setSwappingIndex(null);setExcludedIds([]);}

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if(result)return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"system-ui,sans-serif",paddingBottom:60}}>
      <div style={{background:K_YELLOW,padding:"28px 24px",textAlign:"center"}}>
        <img src={LOGO} alt="Kidera" style={{height:56,objectFit:"contain",marginBottom:10}} onError={e=>{e.target.style.display="none";}}/>
        <h1 style={{fontSize:"clamp(18px,4vw,26px)",fontWeight:800,color:TEXT,margin:"0 0 6px"}}>Your personalised toy picks</h1>
        <p style={{fontSize:14,color:TEXT,margin:0,opacity:0.7}}>{isGift?"Matched to this child by a paediatric OT":"Matched to your child by a paediatric OT"}</p>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"0 20px"}}>
        {result.recs.map((toy,i)=>(
          <div key={`${toy.id}-${i}`} style={{background:CARD,borderRadius:16,border:`1px solid ${BORDER}`,marginTop:20,boxShadow:"0 2px 8px rgba(0,0,0,0.05)",overflow:"hidden",opacity:swappingIndex===i?0.45:1,transition:"opacity 0.25s"}}>
            <ProductImage toy={toy}/>
            <div style={{padding:"18px 22px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:i===0?K_GREEN:BORDER,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"#fff":MUTED,flexShrink:0}}>{i+1}</div>
                {i===0&&<div style={{fontSize:11,color:K_GREEN,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:700}}>Top pick</div>}
                <div style={{fontSize:13,color:MUTED,marginLeft:"auto",fontWeight:600}}>~${toy.price} AUD</div>
              </div>
              <h2 style={{fontSize:16,fontWeight:700,color:TEXT,margin:"0 0 8px",lineHeight:1.3}}>{toy.name}</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                {toy.dev_areas.map(a=>(<span key={a} style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:`${DEV_COLOURS[a]}22`,color:DEV_COLOURS[a],fontWeight:600,border:`1px solid ${DEV_COLOURS[a]}44`}}>{DEV_LABELS[a]}</span>))}
              </div>
              <p style={{fontSize:14,color:TEXT,lineHeight:1.7,margin:"0 0 10px"}}>{result.personalised_reasons[i]}</p>
              {result.play_ideas&&result.play_ideas[i]&&(
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
                <button onClick={()=>handleSwap(i)} disabled={swappingIndex!==null}
                  style={{fontSize:13,color:MUTED,background:"none",border:`1px solid ${BORDER}`,borderRadius:8,padding:"9px 14px",cursor:swappingIndex!==null?"default":"pointer"}}>
                  {swappingIndex===i?"Finding a swap...":"Already have / not quite right"}
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
          <p style={{fontSize:14,lineHeight:1.8,color:TEXT,margin:"0 0 10px"}}>{result.curator_note}</p>
          <p style={{fontSize:12,color:MUTED,margin:0}}>Questions? <a href="mailto:brittany@kidera.com.au" style={{color:K_GREEN}}>brittany@kidera.com.au</a></p>
        </div>

        <div style={{background:"#F9F7F0",borderRadius:12,padding:"14px 18px",marginTop:14,fontSize:12,color:MUTED,lineHeight:1.7}}>
          <p style={{margin:"0 0 6px"}}><strong>Affiliate disclosure:</strong> Links above are Amazon AU affiliate links. Kidera earns a small commission at no extra cost to you.</p>
          <p style={{margin:0}}>This quiz was built and curated by Brittany using her professional OT expertise and knowledge of child development. It uses smart technology to personalise results, and while every recommendation has been carefully considered, these are a starting point rather than a definitive guide. {isGift?"Their parents know them best.":"You know your child best."}</p>
        </div>

        <FreebieSignup/>

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
            <textarea value={answers[current.id]||""} onChange={e=>setSingle(current.id,e.target.value)} placeholder={current.placeholder}
              style={{width:"100%",minHeight:current.id==="child_snapshot"?140:100,padding:"14px 16px",borderRadius:12,border:`2px solid ${BORDER}`,fontSize:15,lineHeight:1.6,background:CARD,color:TEXT,resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"system-ui"}}/>
            {current.optional&&<p style={{fontSize:13,color:MUTED,marginTop:6}}>Optional. Skip if nothing comes to mind.</p>}
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

