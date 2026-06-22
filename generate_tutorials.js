const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'backend/storage/app/public/sketches/steps');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function writeSvg(filename, content) {
    fs.writeFileSync(path.join(outDir, filename), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">\n${content}\n</svg>`);
}

const tutorials = [
    {
        key: 'osito',
        title: 'Osito Kawaii',
        description: 'Aprende a dibujar un tierno osito regordete.',
        difficulty: 'fácil',
        steps: [
            { desc: 'Dibuja un gran círculo suave para la cabeza.', svg: `<circle cx="100" cy="100" r="60" fill="none" stroke="#ddd" stroke-width="4" />` },
            { desc: 'Traza la cabeza y añádele dos orejitas redondas.', svg: `<circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="6" /><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="6" /><circle cx="150" cy="50" r="25" fill="none" stroke="black" stroke-width="6" />` },
            { desc: 'Ponle dos ojitos oscuros y una naricita ovalada.', svg: `<circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="6" /><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="6" /><circle cx="150" cy="50" r="25" fill="none" stroke="black" stroke-width="6" />\n<circle cx="75" cy="90" r="7" fill="black"/><circle cx="125" cy="90" r="7" fill="black"/><ellipse cx="100" cy="110" rx="10" ry="7" fill="black"/>` },
            { desc: 'Dibuja la boquita sonriente bajo la nariz.', svg: `<circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="6" /><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="6" /><circle cx="150" cy="50" r="25" fill="none" stroke="black" stroke-width="6" />\n<circle cx="75" cy="90" r="7" fill="black"/><circle cx="125" cy="90" r="7" fill="black"/><ellipse cx="100" cy="110" rx="10" ry="7" fill="black"/>\n<path d="M 90,125 Q 100,135 110,125" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>` },
            { desc: 'Por último, dale un toque tierno con unos coloretes rosados.', svg: `<circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="6" /><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="6" /><circle cx="150" cy="50" r="25" fill="none" stroke="black" stroke-width="6" />\n<circle cx="75" cy="90" r="7" fill="black"/><circle cx="125" cy="90" r="7" fill="black"/><ellipse cx="100" cy="110" rx="10" ry="7" fill="black"/>\n<path d="M 90,125 Q 100,135 110,125" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>\n<circle cx="65" cy="110" r="8" fill="pink"/><circle cx="135" cy="110" r="8" fill="pink"/><circle cx="50" cy="50" r="10" fill="pink"/><circle cx="150" cy="50" r="10" fill="pink"/>` }
        ]
    },
    {
        key: 'pinguino',
        title: 'Pingüino Pingüi',
        description: 'Un divertido pingüinito patoso.',
        difficulty: 'fácil',
        steps: [
            { desc: 'Haz un óvalo grande para el cuerpo huevito.', svg: `<ellipse cx="100" cy="110" rx="50" ry="70" fill="none" stroke="#ddd" stroke-width="4"/>` },
            { desc: 'Marca el cuerpo de negro y dibuja dos aletas a los lados.', svg: `<ellipse cx="100" cy="110" rx="50" ry="70" fill="none" stroke="black" stroke-width="6"/><path d="M 50,110 Q 20,130 30,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/><path d="M 150,110 Q 180,130 170,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>` },
            { desc: 'Traza la silueta de su suave barriga blanca.', svg: `<ellipse cx="100" cy="110" rx="50" ry="70" fill="none" stroke="black" stroke-width="6"/><path d="M 50,110 Q 20,130 30,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/><path d="M 150,110 Q 180,130 170,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>\n<ellipse cx="100" cy="125" rx="35" ry="45" fill="none" stroke="black" stroke-width="4" stroke-dasharray="5,5"/>` },
            { desc: 'Añade los ojitos y su pequeño pico naranja.', svg: `<ellipse cx="100" cy="110" rx="50" ry="70" fill="none" stroke="black" stroke-width="6"/><path d="M 50,110 Q 20,130 30,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/><path d="M 150,110 Q 180,130 170,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>\n<ellipse cx="100" cy="125" rx="35" ry="45" fill="none" stroke="black" stroke-width="4" stroke-dasharray="5,5"/>\n<circle cx="85" cy="80" r="5" fill="black"/><circle cx="115" cy="80" r="5" fill="black"/><path d="M 90,95 L 110,95 L 100,105 Z" fill="orange" stroke="black" stroke-width="3" stroke-linejoin="round"/>` },
            { desc: 'Ponle un par de patitas en la base ¡y listo!', svg: `<ellipse cx="100" cy="110" rx="50" ry="70" fill="none" stroke="black" stroke-width="6"/><path d="M 50,110 Q 20,130 30,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/><path d="M 150,110 Q 180,130 170,160 Z" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>\n<ellipse cx="100" cy="125" rx="35" ry="45" fill="none" stroke="black" stroke-width="4" stroke-dasharray="5,5"/>\n<circle cx="85" cy="80" r="5" fill="black"/><circle cx="115" cy="80" r="5" fill="black"/><path d="M 90,95 L 110,95 L 100,105 Z" fill="orange" stroke="black" stroke-width="3" stroke-linejoin="round"/>\n<ellipse cx="75" cy="180" rx="15" ry="8" fill="orange" stroke="black" stroke-width="4"/><ellipse cx="125" cy="180" rx="15" ry="8" fill="orange" stroke="black" stroke-width="4"/>` }
        ]
    },
    {
        key: 'conejito',
        title: 'Conejito Orejotas',
        description: 'Un conejito saltarín muy fácil de dibujar.',
        difficulty: 'fácil',
        steps: [
            { desc: 'Dibuja el círculo suave de la carita.', svg: `<circle cx="100" cy="120" r="50" fill="none" stroke="#ddd" stroke-width="4"/>` },
            { desc: 'Haz sus largas y graciosas orejas.', svg: `<circle cx="100" cy="120" r="50" fill="none" stroke="black" stroke-width="6"/><ellipse cx="70" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/><ellipse cx="130" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/>` },
            { desc: 'Ponle una boquita curiosa y sus ojos redondos.', svg: `<circle cx="100" cy="120" r="50" fill="none" stroke="black" stroke-width="6"/><ellipse cx="70" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/><ellipse cx="130" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/>\n<circle cx="80" cy="110" r="6" fill="black"/><circle cx="120" cy="110" r="6" fill="black"/><path d="M 100,120 L 95,125 M 100,120 L 105,125" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>` },
            { desc: 'Tres finos bigotes a cada lado.', svg: `<circle cx="100" cy="120" r="50" fill="none" stroke="black" stroke-width="6"/><ellipse cx="70" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/><ellipse cx="130" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/>\n<circle cx="80" cy="110" r="6" fill="black"/><circle cx="120" cy="110" r="6" fill="black"/><path d="M 100,120 L 95,125 M 100,120 L 105,125" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>\n<line x1="30" y1="105" x2="50" y2="110" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="115" x2="50" y2="115" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="125" x2="50" y2="120" stroke="black" stroke-width="3" stroke-linecap="round"/>\n<line x1="170" y1="105" x2="150" y2="110" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="170" y1="115" x2="150" y2="115" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="170" y1="125" x2="150" y2="120" stroke="black" stroke-width="3" stroke-linecap="round"/>` },
            { desc: 'Colorea el interior de las orejas de rosa.', svg: `<circle cx="100" cy="120" r="50" fill="none" stroke="black" stroke-width="6"/><ellipse cx="70" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/><ellipse cx="130" cy="50" rx="15" ry="40" fill="none" stroke="black" stroke-width="6"/>\n<circle cx="80" cy="110" r="6" fill="black"/><circle cx="120" cy="110" r="6" fill="black"/><path d="M 100,120 L 95,125 M 100,120 L 105,125" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>\n<line x1="30" y1="105" x2="50" y2="110" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="115" x2="50" y2="115" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="30" y1="125" x2="50" y2="120" stroke="black" stroke-width="3" stroke-linecap="round"/>\n<line x1="170" y1="105" x2="150" y2="110" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="170" y1="115" x2="150" y2="115" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="170" y1="125" x2="150" y2="120" stroke="black" stroke-width="3" stroke-linecap="round"/>\n<ellipse cx="70" cy="50" rx="6" ry="25" fill="pink"/><ellipse cx="130" cy="50" rx="6" ry="25" fill="pink"/>` }
        ]
    },
    {
        key: 'perrito',
        title: 'Perrito Shiba',
        description: 'Un cachorro muy amigable y redondeado.',
        difficulty: 'fácil',
        steps: [
            { desc: 'Comenzamos con una gran cabeza ovalada.', svg: `<ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="#ddd" stroke-width="4"/>` },
            { desc: 'Añádele unas orejas largas caídas a los lados.', svg: `<ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="black" stroke-width="6"/>\n<path d="M 45,95 Q 10,140 30,165 Q 50,150 60,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<path d="M 155,95 Q 190,140 170,165 Q 150,150 140,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>` },
            { desc: 'Dibuja el redondel para el morro en el centro.', svg: `<ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="black" stroke-width="6"/>\n<path d="M 45,95 Q 10,140 30,165 Q 50,150 60,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<path d="M 155,95 Q 190,140 170,165 Q 150,150 140,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<circle cx="100" cy="120" r="22" fill="none" stroke="black" stroke-width="4"/>` },
            { desc: 'Nariz negra y dos ojitos súper expresivos.', svg: `<ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="black" stroke-width="6"/>\n<path d="M 45,95 Q 10,140 30,165 Q 50,150 60,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<path d="M 155,95 Q 190,140 170,165 Q 150,150 140,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<circle cx="100" cy="120" r="22" fill="none" stroke="black" stroke-width="4"/>\n<ellipse cx="100" cy="110" rx="8" ry="5" fill="black"/><circle cx="70" cy="90" r="6" fill="black"/><circle cx="130" cy="90" r="6" fill="black"/>` },
            { desc: 'Sácale la lengua rosa para que parezca feliz.', svg: `<ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="black" stroke-width="6"/>\n<path d="M 45,95 Q 10,140 30,165 Q 50,150 60,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<path d="M 155,95 Q 190,140 170,165 Q 150,150 140,130" fill="none" stroke="black" stroke-width="6" stroke-linecap="round"/>\n<circle cx="100" cy="120" r="22" fill="none" stroke="black" stroke-width="4"/>\n<ellipse cx="100" cy="110" rx="8" ry="5" fill="black"/><circle cx="70" cy="90" r="6" fill="black"/><circle cx="130" cy="90" r="6" fill="black"/>\n<path d="M 92,130 Q 100,150 108,130" fill="pink" stroke="black" stroke-width="4" stroke-linecap="round"/>` }
        ]
    },
    {
        key: 'anime_cara',
        title: 'Cara Estilo Manga',
        description: 'Aprende las proporciones de una cara Anime.',
        difficulty: 'medio',
        steps: [
            { desc: 'Comienza con un círculo y una cruz para ubicar los elementos.', svg: `<circle cx="100" cy="90" r="50" fill="none" stroke="#ddd" stroke-width="3"/><line x1="100" y1="40" x2="100" y2="160" stroke="#ddd" stroke-width="3"/><line x1="40" y1="90" x2="160" y2="90" stroke="#ddd" stroke-width="3"/>` },
            { desc: 'Traza la barbilla afilada clásica del anime.', svg: `<circle cx="100" cy="90" r="50" fill="none" stroke="#ddd" stroke-width="3"/><line x1="100" y1="40" x2="100" y2="160" stroke="#ddd" stroke-width="3"/><line x1="40" y1="90" x2="160" y2="90" stroke="#ddd" stroke-width="3"/>\n<path d="M 50,90 Q 75,150 100,160 Q 125,150 150,90" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>` },
            { desc: 'Dibuja unos grandes ojos expresivos sobre la línea central.', svg: `<circle cx="100" cy="90" r="50" fill="none" stroke="#ddd" stroke-width="3"/><line x1="100" y1="40" x2="100" y2="160" stroke="#ddd" stroke-width="3"/><line x1="40" y1="90" x2="160" y2="90" stroke="#ddd" stroke-width="3"/>\n<path d="M 50,90 Q 75,150 100,160 Q 125,150 150,90" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>\n<ellipse cx="75" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><ellipse cx="125" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><circle cx="75" cy="95" r="5" fill="black"/><circle cx="125" cy="95" r="5" fill="black"/>` },
            { desc: 'Añade una nariz muy pequeña y una sonrisa fina.', svg: `<circle cx="100" cy="90" r="50" fill="none" stroke="#ddd" stroke-width="3"/><line x1="100" y1="40" x2="100" y2="160" stroke="#ddd" stroke-width="3"/><line x1="40" y1="90" x2="160" y2="90" stroke="#ddd" stroke-width="3"/>\n<path d="M 50,90 Q 75,150 100,160 Q 125,150 150,90" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>\n<ellipse cx="75" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><ellipse cx="125" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><circle cx="75" cy="95" r="5" fill="black"/><circle cx="125" cy="95" r="5" fill="black"/>\n<path d="M 100,120 L 96,126" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/><path d="M 90,140 Q 100,145 110,140" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>` },
            { desc: 'Termina el boceto enmarcando la cara con flequillo y pelo.', svg: `<circle cx="100" cy="90" r="50" fill="none" stroke="#ddd" stroke-width="3"/><line x1="100" y1="40" x2="100" y2="160" stroke="#ddd" stroke-width="3"/><line x1="40" y1="90" x2="160" y2="90" stroke="#ddd" stroke-width="3"/>\n<path d="M 50,90 Q 75,150 100,160 Q 125,150 150,90" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>\n<ellipse cx="75" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><ellipse cx="125" cy="100" rx="12" ry="18" fill="none" stroke="black" stroke-width="5"/><circle cx="75" cy="95" r="5" fill="black"/><circle cx="125" cy="95" r="5" fill="black"/>\n<path d="M 100,120 L 96,126" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/><path d="M 90,140 Q 100,145 110,140" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>\n<path d="M 100,40 Q 50,30 30,80 Q 20,130 40,160" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/><path d="M 100,40 Q 150,30 170,80 Q 180,130 160,160" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/><path d="M 40,90 Q 70,60 100,75 Q 130,60 160,90" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>` }
        ]
    },
    {
        key: 'anime_chibi',
        title: 'Personaje Chibi',
        description: 'Dibuja un personaje cabezón y adorable paso a paso.',
        difficulty: 'medio',
        steps: [
            { desc: 'Las proporciones Chibi se basan en una cabeza grande y cuerpo pequeño.', svg: `<circle cx="100" cy="70" r="45" fill="none" stroke="#ddd" stroke-width="4"/><ellipse cx="100" cy="140" rx="25" ry="30" fill="none" stroke="#ddd" stroke-width="4"/>` },
            { desc: 'Repasa el contorno grueso para la silueta general.', svg: `<circle cx="100" cy="70" r="45" fill="none" stroke="black" stroke-width="6"/><ellipse cx="100" cy="140" rx="25" ry="30" fill="none" stroke="black" stroke-width="6"/>` },
            { desc: 'Añádele los bracitos regordetes y las piernas.', svg: `<circle cx="100" cy="70" r="45" fill="none" stroke="black" stroke-width="6"/><ellipse cx="100" cy="140" rx="25" ry="30" fill="none" stroke="black" stroke-width="6"/>\n<line x1="75" y1="125" x2="45" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="125" y1="125" x2="155" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="85" y1="170" x2="85" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="115" y1="170" x2="115" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/>` },
            { desc: 'Los ojos deben ocupar mucho espacio de la cara.', svg: `<circle cx="100" cy="70" r="45" fill="none" stroke="black" stroke-width="6"/><ellipse cx="100" cy="140" rx="25" ry="30" fill="none" stroke="black" stroke-width="6"/>\n<line x1="75" y1="125" x2="45" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="125" y1="125" x2="155" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="85" y1="170" x2="85" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="115" y1="170" x2="115" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/>\n<ellipse cx="75" cy="80" rx="10" ry="14" fill="black"/><ellipse cx="125" cy="80" rx="10" ry="14" fill="black"/><circle cx="78" cy="75" r="4" fill="white"/><circle cx="128" cy="75" r="4" fill="white"/>` },
            { desc: 'Vístelo con un peto sencillo y una gran sonrisa.', svg: `<circle cx="100" cy="70" r="45" fill="none" stroke="black" stroke-width="6"/><ellipse cx="100" cy="140" rx="25" ry="30" fill="none" stroke="black" stroke-width="6"/>\n<line x1="75" y1="125" x2="45" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="125" y1="125" x2="155" y2="150" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="85" y1="170" x2="85" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/><line x1="115" y1="170" x2="115" y2="190" stroke="black" stroke-width="8" stroke-linecap="round"/>\n<ellipse cx="75" cy="80" rx="10" ry="14" fill="black"/><ellipse cx="125" cy="80" rx="10" ry="14" fill="black"/><circle cx="78" cy="75" r="4" fill="white"/><circle cx="128" cy="75" r="4" fill="white"/>\n<path d="M 75,140 L 125,140" stroke="black" stroke-width="5" stroke-linecap="round"/><path d="M 90,95 Q 100,100 110,95" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>` }
        ]
    }
];

let seederCode = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\Sketch;
use App\\Models\\SketchStep;

class TutorialsSeeder extends Seeder
{
    public function run(): void
    {
`;

tutorials.forEach(tut => {
    seederCode += `
        $sketch = Sketch::create([
            'title' => '${tut.title}',
            'description' => '${tut.description}',
            'difficulty' => '${tut.difficulty}',
            'total_steps' => ${tut.steps.length}
        ]);
`;
    tut.steps.forEach((step, idx) => {
        const stepNum = idx + 1;
        const filename = `${tut.key}_step_${stepNum}.svg`;
        writeSvg(filename, step.svg);
        
        seederCode += `
        SketchStep::create([
            'sketch_id' => $sketch->id,
            'step_number' => ${stepNum},
            'image_path' => 'sketches/steps/${filename}',
            'description' => '${step.desc}'
        ]);
`;
    });
});

seederCode += `
    }
}
`;

fs.writeFileSync(path.join(__dirname, 'backend/database/seeders/TutorialsSeeder.php'), seederCode);
console.log('Done!');
