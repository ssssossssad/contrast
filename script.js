const bgColorInput = document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const previewBox = document.getElementById('previewBox');
const previewText = document.getElementById('previewText');
const resultBox = document.getElementById('resultBox');

/**
 * Перетворення HEX у RGB масив
 */
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

/**
 * Обчислення відносної яскравості (Luminance)
 */
function luminance(r, g, b) {
    let a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Основна функція розрахунку контрасту
 */
function calculateContrast() {
    let bgRgb = hexToRgb(bgColorInput.value);
    let textRgb = hexToRgb(textColorInput.value);
    
    let lum1 = luminance(...bgRgb);
    let lum2 = luminance(...textRgb);
    
    let brightest = Math.max(lum1, lum2);
    let darkest = Math.min(lum1, lum2);
    let contrast = (brightest + 0.05) / (darkest + 0.05);
    
    // Оновлюємо візуальні елементи
    previewBox.style.backgroundColor = bgColorInput.value;
    previewText.style.color = textColorInput.value;
    
    let ratio = contrast.toFixed(2);
    
    if (contrast >= 4.5) {
        resultBox.className = 'result pass';
        resultBox.innerHTML = `✅ Коефіцієнт: ${ratio}:1 <br><small>Текст добре читається (Тест пройдено)</small>`;
    } else {
        resultBox.className = 'result fail';
        resultBox.innerHTML = `❌ Коефіцієнт: ${ratio}:1 <br><small>Низький контраст! Порушення правил UX</small>`;
    }
}

// Слухачі подій для інтерактивності
bgColorInput.addEventListener('input', calculateContrast);
textColorInput.addEventListener('input', calculateContrast);

// Початковий запуск при завантаженні сторінки
calculateContrast();
