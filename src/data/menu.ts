// 菜单配置，方便以后从后台 API 获取
export const menuData = [
  {
    title: "Store",
    href: "/uk/store",
    children: {
      leftColumn: {
        title: "Key Event",
        items: [
          { title: "Daily Picks", href: "/uk/store/daily-picks" },
          { title: "Golden Season Sale", href: "/uk/store/golden-season-sale" },
          { title: "New Arrivals", href: "/uk/store/new-arrivals" },
          { title: "Best Sellers", href: "/uk/store/best-sellers" },
        ]
      },
      centerColumn: {
        title: "Mi.com Feature",
        items: [
          { title: "Xiaomi for Business", href: "/uk/business" },
          { title: "Student Discount", href: "/uk/student-discount" },
          { title: "Trade In", href: "/uk/trade-in" },
          { title: "IMEI Redemption", href: "/uk/imei-redemption" },
          { title: "New User Incentive Programme", href: "/uk/new-user-incentive" },
          { title: "Xiaomi & Youtube Premium", href: "/uk/youtube-premium" },
          { title: "Xiaomi & Google One", href: "/uk/google-one" },
          { title: "Mi points", href: "/uk/mi-points" },
          { title: "Get the Xiaomi Store App", href: "/uk/store-app" },
        ]
      },
      rightColumn: {
        title: "Daily Picks >",
        items: [
          { 
            title: "Xiaomi Polarized Fitover Sunglasses", 
            href: "/uk/store/xiaomi-polarized-fitover-sunglasses",
            image: "/XiaomiPolarizedFitoverSunglasses.webp"
          },
          { 
            title: "Xiaomi Water Ionic Hair Dryer H500", 
            href: "/uk/store/xiaomi-water-ionic-hair-dryer-h500",
            image: "/XiaomiWaterIonicHairDryerH500.webp"
          },
          { 
            title: "Xiaomi Straw Mug", 
            href: "/uk/store/xiaomi-straw-mug",
            image: "/XiaomiStrawMug.webp"
          },
          { 
            title: "Xiaomi Smart Pet Food Feeder 2", 
            href: "/uk/store/xiaomi-smart-pet-food-feeder-2",
            image: "/XiaomiSmartPetFoodFeeder2 .webp"
          },
        ]
      }
    },
  },
  {
    title: "Wearables",
    href: "/uk/store/wearables",
    children: {
      leftColumn: {
        title: "Categories",
        items: [
          { title: "Smart Watches", href: "/uk/store/wearables/smart-watches" },
          { title: "Smart Bands", href: "/uk/store/wearables/smart-bands" },
          { title: "TWS Earphones", href: "/uk/store/wearables/tws-earphones" },
        ]
      },
      centerColumn: {
        title: "Featured Products",
        items: [
          { title: "Xiaomi Watch S4", href: "/uk/store/xiaomi-watch-s4" },
          { title: "REDMI Watch 5", href: "/uk/store/redmi-watch-5" },
          { title: "REDMI Watch 5 Lite", href: "/uk/store/redmi-watch-5-lite" },
          { title: "REDMI Watch 5 Active", href: "/uk/store/redmi-watch-5-active" },
          { title: "Xiaomi Watch 2", href: "/uk/store/xiaomi-watch-2" },
        ]
      },
      rightColumn: {
        title: "Popular Wearables >",
        items: [
          { 
            title: "Xiaomi Watch S4", 
            href: "/uk/store/xiaomi-watch-s4",
            image: "/XiaoMiWatchS4.webp"
          },
          { 
            title: "REDMI Watch 5", 
            href: "/uk/store/redmi-watch-5",
            image: "/RedMiWatch5.webp"
          },
          { 
            title: "REDMI Watch 5 Lite", 
            href: "/uk/store/redmi-watch-5-lite",
            image: "/RedMiWatch5Lite.webp"
          },
          { 
            title: "REDMI Watch 5 Active", 
            href: "/uk/store/redmi-watch-5-active",
            image: "/RedMiWatch5Active.webp"
          },
          { 
            title: "Xiaomi Watch 2", 
            href: "/uk/store/xiaomi-watch-2",
            image: "/XiaoMiWatch2.webp"
          },
          { 
            title: "Mi Band 9", 
            href: "/uk/store/mi-band-9",
            image: "/XiaoMiSmartBand9.webp"
          },
        ]
      }
    },
  },
  {
    title: "Smart Home",
    href: "/uk/store/smart-home",
    children: {
      // 左侧65%分类导航区域
      leftColumn: {
        title: "Categories",
        categories: [
          {
            title: "Cooking Appliances",
            items: [
              { title: "Toaster", href: "/uk/store/smart-home/toaster" },
              { title: "Microwave Oven", href: "/uk/store/smart-home/microwave-oven" },
              { title: "Rice Cookers", href: "/uk/store/smart-home/rice-cookers", isNew: true },
              { title: "Air Fryers", href: "/uk/store/smart-home/air-fryers" },
              { title: "Kettles", href: "/uk/store/smart-home/kettles", isNew: true },
            ]
          },
          {
            title: "Smart Lightings",
            items: [
              { title: "Smart Bulbs", href: "/uk/store/smart-home/smart-bulbs" },
              { title: "Indoor Lightings", href: "/uk/store/smart-home/indoor-lightings" },
            ]
          },
          {
            title: "Vacuum Cleaners",
            items: [
              { title: "Stick Vacuums", href: "/uk/store/smart-home/stick-vacuums" },
              { title: "Handheld Vacuums", href: "/uk/store/smart-home/handheld-vacuums" },
              { title: "Wet-Dry Vacuums", href: "/uk/store/smart-home/wet-dry-vacuums" },
              { title: "Robot Vacuums", href: "/uk/store/smart-home/robot-vacuums", isNew: true },
              { title: "Vacuum Cleaners Accessories", href: "/uk/store/smart-home/vacuum-accessories" },
            ]
          },
          {
            title: "Home Security",
            items: [
              { title: "Security Cameras", href: "/uk/store/smart-home/security-cameras", isNew: true },
              { title: "Smart Doorbells", href: "/uk/store/smart-home/smart-doorbells" },
              { title: "Smart Sensors & Hubs", href: "/uk/store/smart-home/smart-sensors-hubs" },
            ]
          },
          {
            title: "TVs & HA",
            items: [
              { title: "TVs", href: "/uk/store/smart-home/tvs" },
              { title: "Soundbars", href: "/uk/store/smart-home/soundbars", isNew: true },
              { title: "Speakers", href: "/uk/store/smart-home/speakers" },
              { title: "Projectors", href: "/uk/store/smart-home/projectors", isNew: true },
              { title: "Smart Clocks", href: "/uk/store/smart-home/smart-clocks" },
              { title: "TV Boxes/TV Sticks", href: "/uk/store/smart-home/tv-boxes-sticks", isNew: true },
            ]
          },
          {
            title: "Kitchen Appliances",
            items: [
              { title: "Water Dispensers", href: "/uk/store/smart-home/water-dispensers" },
              { title: "Blenders", href: "/uk/store/smart-home/blenders" },
            ]
          },
          {
            title: "Environment Appliances",
            items: [
              { title: "Dehumidifiers", href: "/uk/store/smart-home/dehumidifiers" },
              { title: "Heaters", href: "/uk/store/smart-home/heaters" },
              { title: "Air Purifiers", href: "/uk/store/smart-home/air-purifiers" },
              { title: "Temperature & Humidity Monitors", href: "/uk/store/smart-home/temperature-humidity-monitors" },
              { title: "Environment Appliances Accessories", href: "/uk/store/smart-home/environment-accessories" },
              { title: "Fans", href: "/uk/store/smart-home/fans" },
            ]
          },
        ]
      },
      // 右侧35%新品展示区域
      rightColumn: {
        title: "Featured Smart Home >",
        items: [
          { 
            title: "Xiaomi Outdoor Camera CW100 Dual", 
            href: "/uk/store/xiaomi-outdoor-camera-cw100-dual",
            image: "/XiaoMiOutdoorSmartCameraCW100Dual.webp"
          },
          { 
            title: "Xiaomi Robot Vacuum H40", 
            href: "/uk/store/xiaomi-robot-vacuum-h40",
            image: "/XiaoMiRobotVacuumH40.png"
          },
          { 
            title: "Xiaomi Robot Vacuum S40C", 
            href: "/uk/store/xiaomi-robot-vacuum-s40c",
            image: "/MiRobotVacuumS40C.webp"
          },
          { 
            title: "Xiaomi Smart Camera C701", 
            href: "/uk/store/xiaomi-smart-camera-c701",
            image: "/XiaomiSmartCameraC701.webp"
          },
        ]
      }
    },
  },
  {
    title: "Lifestyle",
    href: "/uk/store/lifestyle",
    children: {
      leftColumn: {
        title: "Categories",
        categories: [
          {
            title: "Chargings",
            items: [
              { title: "Cables", href: "/uk/store/lifestyle/cables", isNew: true },
              { title: "Wireless Chargings", href: "/uk/store/lifestyle/wireless-chargings" },
              { title: "Power Adapters", href: "/uk/store/lifestyle/power-adapters", isNew: true },
              { title: "Power Banks", href: "/uk/store/lifestyle/power-banks" },
            ]
          },
          {
            title: "Health & Fitness",
            items: [
              { title: "Water Bottle", href: "/uk/store/lifestyle/water-bottle", isNew: true },
              { title: "Clothing Care", href: "/uk/store/lifestyle/clothing-care" },
              { title: "Pets Care", href: "/uk/store/lifestyle/pets-care" },
              { title: "Scales", href: "/uk/store/lifestyle/scales" },
              { title: "Health and Fitness Accessories", href: "/uk/store/lifestyle/health-fitness-accessories" },
            ]
          },
          {
            title: "Personal Care",
            items: [
              { title: "Personal Care Accessories", href: "/uk/store/lifestyle/personal-care-accessories" },
              { title: "Electric Shavers", href: "/uk/store/lifestyle/electric-shavers" },
              { title: "Hair Clippers", href: "/uk/store/lifestyle/hair-clippers" },
              { title: "Hair Dryers", href: "/uk/store/lifestyle/hair-dryers" },
            ]
          },
          {
            title: "Tools",
            items: [
              { title: "Selfie Sticks", href: "/uk/store/lifestyle/selfie-sticks" },
              { title: "Cordless Drills", href: "/uk/store/lifestyle/cordless-drills" },
              { title: "Flashlights", href: "/uk/store/lifestyle/flashlights" },
              { title: "Screwdrivers", href: "/uk/store/lifestyle/screwdrivers" },
              { title: "Laser Measures", href: "/uk/store/lifestyle/laser-measures" },
            ]
          },
          {
            title: "Office",
            items: [
              { title: "Wi-Fi Range Extenders", href: "/uk/store/lifestyle/wifi-range-extenders" },
              { title: "Monitors", href: "/uk/store/lifestyle/monitors" },
              { title: "Routers", href: "/uk/store/lifestyle/routers" },
              { title: "Ink Pens", href: "/uk/store/lifestyle/ink-pens" },
              { title: "Keyboards and Mouse", href: "/uk/store/lifestyle/keyboards-mouse" },
              { title: "Office Accessories", href: "/uk/store/lifestyle/office-accessories" },
              { title: "Writing Tablets", href: "/uk/store/lifestyle/writing-tablets" },
              { title: "Photo Printers", href: "/uk/store/lifestyle/photo-printers" },
            ]
          },
          {
            title: "Outdoors",
            items: [
              { title: "Glasses", href: "/uk/store/lifestyle/glasses" },
              { title: "Scooters", href: "/uk/store/lifestyle/scooters", isNew: true },
              { title: "Luggages", href: "/uk/store/lifestyle/luggages" },
              { title: "Air Compressors", href: "/uk/store/lifestyle/air-compressors" },
              { title: "Outdoor Accessories", href: "/uk/store/lifestyle/outdoor-accessories" },
              { title: "Bags", href: "/uk/store/lifestyle/bags" },
            ]
          },
        ]
      },
      rightColumn: {
        title: "Featured Lifestyle >",
        items: [
          { 
            title: "Xiaomi 6A Braided USB-C to USB-C Cable (2m)", 
            href: "/uk/store/xiaomi-6a-braided-usb-c-to-usb-c-cable-2m",
            image: "/XiaoMi6ACtoCCable2M.webp"
          },
          { 
            title: "Xiaomi 3A Braided USB-C to USB-C Cable (1m)", 
            href: "/uk/store/xiaomi-3a-braided-usb-c-to-usb-c-cable-1m",
            image: "/XiaoMi3ACtoCCable1M.webp"
          },
          { 
            title: "Xiaomi 3A Braided USB-A to USB-C Cable (1m)", 
            href: "/uk/store/xiaomi-3a-braided-usb-a-to-usb-c-cable-1m",
            image: "/XiaoMi3AAtoCCable1M.webp"
          },
          { 
            title: "Xiaomi Electric Scooter 5 Plus", 
            href: "/uk/store/xiaomi-electric-scooter-5-plus",
            image: "/XiaoMiElectricScooter5Plus.webp"
          },
        ]
      }
    },
  },
  {
    title: "Discover",
    href: "/uk/discover",
  },
  {
    title: "Support",
    href: "/support",
  },
  {
    title: "Community",
    href: "/uk/community",
  },
];