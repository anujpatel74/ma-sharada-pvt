const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Anuj Patel\\.gemini\\antigravity-ide\\brain\\135a889a-e22d-4b43-86fa-5d17a880b123';
const destBase = 'E:\\MAA-SHARDA PVT\\public\\images';

const mappings = [
  { pattern: /^amaron_car_battery/, dest: 'products/amaron_car_battery.jpg' },
  { pattern: /^amaron_bike_battery/, dest: 'products/amaron_bike_battery.jpg' },
  { pattern: /^amaron_tall_tubular/, dest: 'products/amaron_tall_tubular.jpg' },
  { pattern: /^exide_car_battery/, dest: 'products/exide_car_battery.jpg' },
  { pattern: /^exide_bike_battery/, dest: 'products/exide_bike_battery.jpg' },
  { pattern: /^luminous_inverter_battery/, dest: 'products/luminous_inverter_battery.jpg' },
  { pattern: /^goldstar_battery/, dest: 'products/goldstar_battery.jpg' },
  { pattern: /^solar_panel/, dest: 'products/solar_panel.jpg' },
  { pattern: /^pure_sine_wave_inverter/, dest: 'products/pure_sine_wave_inverter.jpg' },
  { pattern: /^battery_charging_bench/, dest: 'services/battery_charging_bench.jpg' },
  { pattern: /^distilled_battery_water/, dest: 'products/distilled_battery_water.jpg' },
  { pattern: /^hero_energy_showcase/, dest: 'hero/hero_energy_showcase.jpg' },
  { pattern: /^goldstar_promo_banner/, dest: 'hero/goldstar_promo_banner.jpg' }
];

const files = fs.readdirSync(srcDir);
mappings.forEach(m => {
  const match = files.find(f => m.pattern.test(f));
  if (match) {
    const fromPath = path.join(srcDir, match);
    const toPath = path.join(destBase, m.dest);
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.copyFileSync(fromPath, toPath);
    console.log(`Copied ${match} -> ${m.dest}`);
  } else {
    console.log(`No match for ${m.pattern}`);
  }
});
console.log('Done copying images.');
