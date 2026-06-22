const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const brainDir = '/Users/alejandrorodriguez/.gemini/antigravity-ide/brain/373672da-204a-4a8f-b0df-019d6db34910';
const outDir = path.join(__dirname, 'backend/storage/app/public/sketches/steps');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const files = {
    'dog': 'dog_tutorial_grid_1782082777268.png',
    'bear': 'bear_grid_1782082801026.png',
    'penguin': 'penguin_grid_1782082810119.png',
    'bunny': 'bunny_grid_1782082816759.png',
    'anime_face': 'anime_face_grid_1782082826293.png',
    'chibi': 'chibi_grid_1782082834953.png'
};

async function processAll() {
    for (const [key, filename] of Object.entries(files)) {
        const filePath = path.join(brainDir, filename);
        console.log(`Processing ${key}...`);
        
        try {
            const metadata = await sharp(filePath).metadata();
            const w = metadata.width;
            const h = metadata.height;
            
            const colW = Math.floor(w / 3);
            const rowH = Math.floor(h / 2);
            
            let step = 1;
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 3; c++) {
                    const outPath = path.join(outDir, `ai_${key}_step_${step}.png`);
                    
                    await sharp(filePath)
                        .extract({
                            left: c * colW,
                            top: r * rowH,
                            width: colW,
                            height: rowH
                        })
                        .flatten({ background: '#ffffff' })
                        .toFile(outPath);
                    
                    step++;
                }
            }
            console.log(`Finished ${key}`);
        } catch (e) {
            console.error(`Error processing ${key}:`, e);
        }
    }
}

processAll().catch(console.error);
