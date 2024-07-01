const fs = require('fs');
const path = require('path');

function saveImage(imageData) {
    try {
        // Converter a base64 em buffer
        const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
        const binaryData = Buffer.from(base64Data, 'base64');

        // Gera um nome aleatório para a imagem
        const imageName = `visitor-${Date.now()}.png`; // Nome com extensão .png
        const imagePath = path.join(__dirname, '../public/uploads', imageName);

        // Salva a imagem
        fs.writeFileSync(imagePath, binaryData);

        return `/uploads/${imageName}`;
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        throw error;
    }
}

module.exports = saveImage;
