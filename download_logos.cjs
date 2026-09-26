const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, 'public', 'images', 'logos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const logoSources = {
  'MARUTI': [
    'https://www.carlogos.org/car-logos/maruti-suzuki-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/500px-Suzuki_logo_2.svg.png'
  ],
  'HYUNDAI': [
    'https://www.carlogos.org/car-logos/hyundai-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/500px-Hyundai_Motor_Company_logo.svg.png'
  ],
  'SKODA': [
    'https://www.carlogos.org/car-logos/skoda-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Skoda_Auto_logo_%282011%29.svg/500px-Skoda_Auto_logo_%282011%29.svg.png'
  ],
  'VW': [
    'https://www.carlogos.org/car-logos/volkswagen-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/500px-Volkswagen_logo_2019.svg.png'
  ],
  'HONDA': [
    'https://www.carlogos.org/car-logos/honda-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/500px-Honda_Logo.svg.png'
  ],
  'NISSAN': [
    'https://www.carlogos.org/car-logos/nissan-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.png/500px-Nissan_logo.png'
  ],
  'FORD': [
    'https://www.carlogos.org/car-logos/ford-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/500px-Ford_Motor_Company_Logo.svg.png'
  ],
  'MAHINDRA': [
    'https://www.carlogos.org/car-logos/mahindra-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Mahindra_Auto_logo.svg/500px-Mahindra_Auto_logo.svg.png'
  ],
  'TOYOTA': [
    'https://www.carlogos.org/car-logos/toyota-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png'
  ],
  'TATA': [
    'https://www.carlogos.org/car-logos/tata-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/500px-Tata_logo.svg.png'
  ],
  'RENAULT': [
    'https://www.carlogos.org/car-logos/renault-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Renault_2021_Text.svg/500px-Renault_2021_Text.svg.png'
  ],
  'CHEVROLET': [
    'https://www.carlogos.org/car-logos/chevrolet-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chevrolet-logo.png/500px-Chevrolet-logo.png'
  ],
  'JAGUAR': [
    'https://www.carlogos.org/car-logos/jaguar-logo.png',
    'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Jaguar_Cars_logo.svg/500px-Jaguar_Cars_logo.svg.png'
  ],
  'LEXUS': [
    'https://www.carlogos.org/car-logos/lexus-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lexus_logo.svg/500px-Lexus_logo.svg.png'
  ],
  'CITROEN': [
    'https://www.carlogos.org/car-logos/citroen-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Citroen_logo_%282021%29.svg/500px-Citroen_logo_%282021%29.svg.png'
  ],
  'BYD': [
    'https://www.carlogos.org/car-logos/byd-logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/BYD_logo_%282022%29.svg/500px-BYD_logo_%282022%29.svg.png'
  ]
};

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  console.log('Downloading official car brand logos...');
  for (const [brand, urls] of Object.entries(logoSources)) {
    const fileName = `${brand.toLowerCase().replace(/\s+/g, '_')}.png`;
    const destPath = path.join(targetDir, fileName);
    let downloaded = false;
    for (const url of urls) {
      try {
        console.log(`Trying ${brand} from ${url}...`);
        await downloadUrl(url, destPath);
        const stats = fs.statSync(destPath);
        if (stats.size > 500) {
          console.log(`✅ ${brand} downloaded successfully (${stats.size} bytes)!`);
          downloaded = true;
          break;
        }
      } catch (err) {
        console.log(`Failed ${url}: ${err.message}`);
      }
    }
    if (!downloaded) {
      console.log(`❌ Could not download ${brand}`);
    }
  }
}

main();
