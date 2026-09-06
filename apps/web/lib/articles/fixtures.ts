import "server-only";
import { articleSchema, type Article } from "./schema";

/**
 * Development-only fixtures. These are NEVER returned in production: the
 * repository only falls back to them when `firebaseAdminConfigured()` is
 * false (see repository.ts), which requires all three Firebase Admin env
 * vars to be absent — never true on a properly configured deployment. They
 * exist so the app is visually reviewable without a live Firestore connection.
 *
 * Content is intentionally qualitative and illustrative — no fabricated
 * statistics — and every record is validated through `articleSchema` so the
 * fixtures cannot silently drift from the real data contract.
 *
 * Cover photography is real, openly-licensed work from Wikimedia Commons
 * (CC BY / CC BY-SA), resolved through the API's `iiurlwidth` thumbnail
 * service rather than hand-built URLs — Commons filenames routinely contain
 * commas and parentheses that break naive thumb-path construction.
 */

const rawFixtures: Article[] = [
  {
    id: "fixture-tidelines",
    slug: "reading-the-tideline",
    title: "Reading the Tideline",
    author: "Mara Ellison",
    topic: "Oceans",
    excerpt:
      "The line of debris a wave leaves behind is a daily record of a warming, rising sea — once you learn to read it, you can’t unsee it.",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "Walk any beach after high tide and you’ll find a thin, curving line of seaweed, shell, and foam. Beachcombers call it the wrack line. It marks exactly how far the water reached — and lately, on many coasts, it is reaching a little farther each decade." },
      { type: "heading", level: 2, text: "What the wrack line records" },
      { type: "paragraph", text: "The tideline is not random. It traces the reach of the last high water, and its position drifts with sea level, storm surge, and the shape of the shore. Reading it is a small act of noticing that turns an abstract global number into something you can stand next to." },
      { type: "bulletedList", items: ["Warmer water expands, taking up more room in the same basin.", "Melting land ice adds new water to the ocean.", "Both effects push the average high-water mark landward over time."] },
      { type: "heading", level: 3, text: "A note for your next walk" },
      { type: "numberedList", items: ["Find the freshest wrack line after a high tide.", "Notice what it’s made of — natural debris, or plastic?", "Come back in a season and see whether it has moved."] },
      { type: "paragraph", text: "None of this requires instruments. It requires attention — the same attention that, multiplied across a community, becomes the political will to protect a coastline." },
    ],
    sourceLinks: [
      { label: "NASA — Sea Level", url: "https://climate.nasa.gov/vital-signs/sea-level/" },
      { label: "NOAA Tides & Currents", url: "https://tidesandcurrents.noaa.gov/" },
    ],
    externalLinks: { instagram: "https://instagram.com/theclimatenote", substack: "https://theclimatenote.substack.com" },
    readingMinutes: 6,
    publishedAt: "2026-08-28T09:00:00.000Z",
    generation: {
      summary: {
        problem: "Sea level is rising gradually, which makes it easy to ignore day to day even as it reshapes coastlines and floods communities over time.",
        whyItMatters: "Coastlines are where a large share of people live and work. Small average rises translate into far more frequent flooding during storms and high tides.",
        whatWeCanDo: "Noticing local change builds the awareness that supports coastal protection, and everyday emissions choices slow the warming that drives the rise.",
      },
      suggestedActions: [
        { id: "tide-1", title: "Mark a tideline you can return to", instruction: "Photograph the wrack line at a spot you visit often, and check it again next season.", cadence: "Once a season", evidence: "Repeated local observation builds durable awareness of change.", category: "nature", factorId: null, factorQuantity: null },
        { id: "tide-2", title: "Swap one short car trip", instruction: "Pick one regular trip under two miles and walk, cycle, or take transit instead this week.", cadence: "Weekly", evidence: "Short trips are among the easiest to shift away from driving.", category: "transport", factorId: null, factorQuantity: null },
        { id: "tide-3", title: "Learn your coast’s plan", instruction: "Find whether your town has a sea-level or flooding plan, and read the summary.", cadence: "Once", evidence: "Informed residents strengthen local climate planning.", category: "civic", factorId: null, factorQuantity: null },
      ],
      visualPlan: { searchQuery: "coastal wrack line high tide", altText: "A curving line of seaweed and foam left on wet sand by a receding tide", placement: "cover", generationPrompt: "A quiet, editorial photograph of a beach wrack line at low light, horizon high in frame." },
    },
    coverAsset: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Sunset_on_Morro_Strand_State_Beach%2C_Morro_Bay%2C_CA.%2C_03_Jan._2009.jpg/1920px-Sunset_on_Morro_Strand_State_Beach%2C_Morro_Bay%2C_CA.%2C_03_Jan._2009.jpg",
      altText: "Golden wet sand on Morro Strand State Beach at sunset, with a lone shorebird at the tideline.",
      caption: "Golden hour on Morro Strand State Beach, California.",
      attribution: "Mike Baird",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sunset_on_Morro_Strand_State_Beach,_Morro_Bay,_CA.,_03_Jan._2009.jpg",
      generated: false,
    },
  },
  {
    id: "fixture-pantry",
    slug: "the-climate-in-your-pantry",
    title: "The Climate in Your Pantry",
    author: "Devin Okafor",
    topic: "Food",
    excerpt:
      "A third of the food we grow is never eaten. The most powerful climate tool in your kitchen might be a shelf you can actually see.",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "Food waste is a climate problem hiding in plain sight. When food rots in landfill it releases methane, a potent greenhouse gas — and everything used to grow, ship, and chill that food is wasted alongside it." },
      { type: "heading", level: 2, text: "Notice before you shop" },
      { type: "paragraph", text: "Most waste isn’t dramatic. It’s the bag of greens that liquefies at the back of the fridge, the loaf that goes stale, the leftovers nobody claimed. The fix starts with seeing what you already have." },
      { type: "bulletedList", items: ["Keep a visible “eat first” shelf for food nearing its end.", "Plan two meals around what’s already open.", "Trust your senses over printed date labels where it’s safe to."] },
      { type: "paragraph", text: "This is the whole Climate Note idea in miniature: learn why it matters, notice where it shows up in your day, and act on the one thing in front of you." },
    ],
    sourceLinks: [
      { label: "Project Drawdown — Reduced Food Waste", url: "https://drawdown.org/solutions/reduced-food-waste" },
      { label: "EPA — Sustainable Management of Food", url: "https://www.epa.gov/sustainable-management-food" },
    ],
    externalLinks: { medium: "https://medium.com/@theclimatenote" },
    readingMinutes: 4,
    publishedAt: "2026-08-21T09:00:00.000Z",
    generation: {
      summary: {
        problem: "A large share of food is wasted, and food rotting in landfill emits methane while squandering the energy and water used to produce it.",
        whyItMatters: "Reducing food waste is one of the most accessible ways households can cut emissions, and it saves money at the same time.",
        whatWeCanDo: "Small kitchen habits — seeing what you have, planning around it, and storing it well — meaningfully cut the food that ends up in the bin.",
      },
      suggestedActions: [
        { id: "food-1", title: "Start an eat-first shelf", instruction: "Clear one shelf for food nearing its end and check it before every meal this week.", cadence: "Daily this week", evidence: "Visibility is the simplest lever against forgotten food.", category: "food", factorId: null, factorQuantity: null },
        { id: "food-2", title: "Cook one fridge-clearing meal", instruction: "Plan a single meal built entirely from what’s already open in your fridge.", cadence: "Weekly", evidence: "Using what you have directly avoids waste.", category: "food", factorId: null, factorQuantity: null },
        { id: "food-3", title: "Learn one date label", instruction: "Look up the difference between “best before” and “use by” for one food you often toss.", cadence: "Once", evidence: "Label literacy prevents needless discarding of safe food.", category: "learning", factorId: null, factorQuantity: null },
      ],
      visualPlan: { searchQuery: "open pantry shelf fresh vegetables", altText: "An open pantry and fridge shelf with fresh vegetables arranged to be seen", placement: "after-introduction", generationPrompt: "A warm, editorial still life of a tidy pantry shelf, soft daylight." },
    },
    coverAsset: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Person_examines_a_jar_of_spice_on_a_wooden_shelf_in_a_kitchen_pantry_during_daytime_in_a_cozy_home_setting.jpg/1920px-Person_examines_a_jar_of_spice_on_a_wooden_shelf_in_a_kitchen_pantry_during_daytime_in_a_cozy_home_setting.jpg",
      altText: "A hand reaching for a labelled jar on a wooden pantry shelf in daylight.",
      caption: "A shelf you can see is a shelf you actually use.",
      attribution: "Shixart1985",
      license: "CC BY 2.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Person_examines_a_jar_of_spice_on_a_wooden_shelf_in_a_kitchen_pantry_during_daytime_in_a_cozy_home_setting.jpg",
      generated: false,
    },
  },
  {
    id: "fixture-fifteen-minutes",
    slug: "the-fifteen-minute-neighborhood",
    title: "The Quiet Radicalism of a Fifteen-Minute Neighborhood",
    author: "Priya Anand",
    topic: "Cities",
    excerpt:
      "What if the most climate-friendly thing a city can build is simply a place where you don’t need to drive?",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "The idea is almost boring in its simplicity: arrange a neighborhood so that daily needs — groceries, school, a park, a doctor — sit within a short walk or ride. No new technology required." },
      { type: "heading", level: 2, text: "Why proximity is climate policy" },
      { type: "paragraph", text: "Transport is one of the largest sources of household emissions in many places, and much of it comes from short, routine trips. Shorten the distance and you quietly remove the trip altogether." },
      { type: "numberedList", items: ["Map the five places you visit most in a week.", "Notice how many you could reach without a car.", "Advocate for one missing piece — a crossing, a shop, a bus stop."] },
    ],
    sourceLinks: [{ label: "Our World in Data — Transport", url: "https://ourworldindata.org/transport" }],
    externalLinks: {},
    readingMinutes: 5,
    publishedAt: "2026-08-14T09:00:00.000Z",
    generation: {
      summary: {
        problem: "Car-dependent design locks in emissions by making even short daily trips require driving, regardless of individual intent.",
        whyItMatters: "Transport is a major and stubborn source of emissions, and the built environment shapes choices for decades once it is set.",
        whatWeCanDo: "Supporting walkable, mixed-use neighborhoods and shifting short trips off the car reduces both emissions and daily cost.",
      },
      suggestedActions: [
        { id: "city-1", title: "Map your weekly trips", instruction: "List the five places you go most and note which you could reach car-free.", cadence: "Once", evidence: "Awareness of trip patterns reveals easy switches.", category: "transport", factorId: null, factorQuantity: null },
        { id: "city-2", title: "Replace one drive", instruction: "Pick one mappable trip and try it on foot, bike, or transit this week.", cadence: "Weekly", evidence: "Shifting routine short trips is a durable habit.", category: "transport", factorId: null, factorQuantity: null },
        { id: "city-3", title: "Speak up for one fix", instruction: "Send a note to a local representative about one crossing, path, or stop you’d use.", cadence: "Once", evidence: "Local infrastructure responds to resident demand.", category: "civic", factorId: null, factorQuantity: null },
      ],
      visualPlan: { searchQuery: "walkable neighborhood street trees", altText: "A tree-lined neighborhood street with people walking and cycling", placement: "cover", generationPrompt: "An editorial street-level view of a leafy, walkable neighborhood at golden hour." },
    },
    coverAsset: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Farmers%27_Market_Haddington_%28geograph_7781652%29.jpg/1920px-Farmers%27_Market_Haddington_%28geograph_7781652%29.jpg",
      altText: "A busy morning street market in Haddington, with stalls and pedestrians on a walkable high street.",
      caption: "Proximity is quietly one of the strongest climate tools a city has.",
      attribution: "Richard Webb",
      license: "CC BY-SA 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Farmers%27_Market_Haddington_(geograph_7781652).jpg",
      generated: false,
    },
  },
  {
    id: "fixture-standby",
    slug: "the-hum-of-standby-power",
    title: "The Hum of Standby Power",
    author: "Leo Fischer",
    topic: "Energy",
    excerpt:
      "The devices you think are off are quietly drawing power all night. Learning to hear them is a small, satisfying act of noticing.",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "Look around a dark room at night and count the little glowing lights: the standby LED on the TV, the charger with nothing plugged in, the console sleeping but awake. Each draws a trickle of power, all day, every day." },
      { type: "heading", level: 2, text: "Small draws, always on" },
      { type: "paragraph", text: "Individually these loads are tiny. Collectively, and multiplied across a home and a year, they add up to real electricity — and real emissions where the grid still burns fossil fuels." },
      { type: "bulletedList", items: ["Group devices onto a switchable power strip.", "Unplug chargers that aren’t charging.", "Notice which “off” devices are still warm to the touch."] },
    ],
    sourceLinks: [{ label: "IEA — Energy Efficiency", url: "https://www.iea.org/topics/energy-efficiency" }],
    externalLinks: {},
    readingMinutes: 3,
    publishedAt: "2026-08-07T09:00:00.000Z",
    generation: {
      summary: {
        problem: "Devices on standby draw continuous “phantom” power, an invisible load that runs even when nothing is being used.",
        whyItMatters: "Where electricity still comes partly from fossil fuels, always-on loads mean always-on emissions, plus a needless cost on every bill.",
        whatWeCanDo: "Grouping devices on switchable strips and unplugging idle chargers removes the load with a single, repeatable habit.",
      },
      suggestedActions: [
        { id: "energy-1", title: "Find your night-lights", instruction: "Walk your home after dark and count every device still glowing or warm.", cadence: "Once", evidence: "Noticing phantom loads is the first step to removing them.", category: "energy", factorId: null, factorQuantity: null },
        { id: "energy-2", title: "Switch one strip", instruction: "Put a cluster of idle devices on one power strip you can turn off at night.", cadence: "Once", evidence: "A single switch removes a continuous draw.", category: "energy", factorId: null, factorQuantity: null },
        { id: "energy-3", title: "Unplug idle chargers", instruction: "Make a habit of unplugging chargers whenever nothing is attached.", cadence: "Daily", evidence: "Idle chargers draw power for no benefit.", category: "energy", factorId: null, factorQuantity: null },
      ],
      visualPlan: { searchQuery: "standby LED lights dark room", altText: "Small standby lights glowing on devices in a darkened room", placement: "cover", generationPrompt: "A moody photograph of tiny standby LEDs glowing in a dark living room." },
    },
    coverAsset: null,
  },
  {
    id: "fixture-verges",
    slug: "let-the-verges-grow",
    title: "Let the Verges Grow",
    author: null,
    topic: "Nature",
    excerpt:
      "The scruffy, unmown edge of a path is doing more for the climate and for wildlife than a perfect lawn ever could.",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "A road verge left to grow is not neglect. It’s habitat: wildflowers, insects, and the birds that follow them, plus roots that hold soil and carbon in place." },
      { type: "paragraph", text: "This week’s note is about resisting the urge to tidy — and seeing wildness as something worth keeping." },
    ],
    sourceLinks: [],
    externalLinks: {},
    readingMinutes: 2,
    publishedAt: "2026-07-31T09:00:00.000Z",
    generation: null,
    coverAsset: null,
  },
  {
    id: "fixture-commute",
    slug: "notes-from-a-slower-commute",
    title: "Notes From a Slower Commute",
    author: "Sofia Marchetti",
    topic: "Everyday",
    excerpt:
      "Trading fifteen minutes of speed for a walk changed what one reader noticed on the way to work — and what they did about it.",
    status: "published",
    contentBlocks: [
      { type: "paragraph", text: "For a month, a reader swapped the second half of their drive for a walk from a further-out stop. This is what they wrote down." },
      { type: "heading", level: 2, text: "What changed" },
      { type: "paragraph", text: "The emissions math was modest. The attention math was not: they started noticing the same trees, the same puddles, the same slow turn of a season — and began to care about a stretch of street they used to speed through." },
      { type: "numberedList", items: ["Choose a stop one further out than usual.", "Walk the last stretch, same time each day.", "Write down one thing you notice."] },
    ],
    sourceLinks: [{ label: "Our World in Data — CO₂ and GHG Emissions", url: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions" }],
    externalLinks: { substack: "https://theclimatenote.substack.com" },
    readingMinutes: 4,
    publishedAt: "2026-07-24T09:00:00.000Z",
    generation: {
      summary: {
        problem: "Fast, sealed commutes disconnect people from the places they move through, making environmental change easy to miss.",
        whyItMatters: "Care tends to follow attention. People protect the places and routines they actually notice and feel part of.",
        whatWeCanDo: "Building small pockets of slower, active travel into a routine cuts emissions and rebuilds a daily habit of noticing.",
      },
      suggestedActions: [
        { id: "commute-1", title: "Walk one stretch", instruction: "Get off one stop early, or park further out, and walk the last part of a routine trip.", cadence: "Daily this week", evidence: "Active travel replaces short motorized segments.", category: "transport", factorId: null, factorQuantity: null },
        { id: "commute-2", title: "Keep a noticing log", instruction: "Write down one thing you notice on your slower route each day.", cadence: "Daily", evidence: "Recorded attention deepens engagement over time.", category: "learning", factorId: null, factorQuantity: null },
        { id: "commute-3", title: "Share the route", instruction: "Tell one person about a walkable stretch they could try too.", cadence: "Once", evidence: "Social sharing spreads low-carbon habits.", category: "civic", factorId: null, factorQuantity: null },
      ],
      visualPlan: { searchQuery: "person walking tree lined path morning", altText: "A person walking a tree-lined path in soft morning light", placement: "after-introduction", generationPrompt: "A calm, editorial photo of a person walking a leafy path in the morning." },
    },
    coverAsset: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg/1920px-Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg",
      altText: "A paved park path running through lawns and deciduous trees in autumn colour.",
      caption: "A slower route is a more noticed one.",
      attribution: "Krzysztof Popławski",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Park_%C5%9Arodula,_Sosnowiec,_Jesie%C5%84_2021.jpg",
      generated: false,
    },
  },
];

// Validate every fixture through the real schema so demo data cannot drift from
// the production contract. Sorted newest-first to mirror the Firestore query.
export const fixtureArticles: Article[] = rawFixtures
  .map((article) => articleSchema.parse(article))
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
