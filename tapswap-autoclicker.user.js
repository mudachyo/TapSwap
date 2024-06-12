// ==UserScript==
// @name         TapSwap Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.tapswap.club/*
// @author       mudachyo
// @version      1.0
// @description  12.06.2024, 17:09:30
// @grant        none
// @icon         https://cdn4.cdn-telegram.org/file/RoC7ZYx9yo7MOeTx8vw_4JFfXOAAM7eh_KQ3-qNO734aqCHu42kMJxce6roxb1X1SjzFubMXuthhRkd9fQTceshS9EuSobMcdCMcUJr2ZulEyBu_Ks9qiA4Li7sP_gfiPdAbca4SX5aTgDGJbEfaBUsC6A5SpPDxWAdM7Q91uJwpI_BmY8IaPFfWpICIyvWr6jFvCX8VhZfpMnkhcArGaab3QJDqURkPeWxzJsnGGs8xsOWq2IFH0TU7qtS1Le7IFYQ780MBE0m8NKcYKLk9z3L-P2_UqcyBwX9tjVNd8sQmGC0217UlHNSLpgftPjAln_TXOUbQ1_rJO3npRbKuAg.jpg
// @downloadURL  https://github.com/mudachyo/TapSwap/raw/main/tapswap-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/TapSwap/raw/main/tapswap-autoclicker.user.js
// @homepage     https://github.com/mudachyo/TapSwap
// ==/UserScript==

// Настраиваемые значения
const minClickDelay = 30; // Минимальная задержка между кликами в миллисекундах
const maxClickDelay = 50; // Максимальная задержка между кликами в миллисекундах
const pauseMinTime = 100000; // Минимальная пауза в миллисекундах (100 секунд)
const pauseMaxTime = 300000; // Максимальная пауза в миллисекундах (300 секунд)
const energyThreshold = 25; // Порог энергии, ниже которого делается пауза
const checkInterval = 1500; // Интервал проверки наличия монеты в миллисекундах (3 секунды)
const maxCheckAttempts = 3; // Максимальное количество попыток проверки наличия монеты

let checkAttempts = 0; // Счётчик попыток проверки

// Конфигурация стилей для логов
const styles = {
    success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};
const logPrefix = '%c[TapSwapBot] ';

// Перезапись функции console.log для добавления префикса и стилей
const originalLog = console.log;
console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[TapSwapBot]')) {
        originalLog.apply(console, arguments);
    }
};

// Отключение остальных методов консоли для чистоты вывода
console.error = console.warn = console.info = console.debug = () => { };

// Очистка консоли и стартовые сообщения
console.clear();
console.log(`${logPrefix}Starting`, styles.starting);
console.log(`${logPrefix}Created by https://t.me/mudachyo`, styles.starting);
console.log(`${logPrefix}Github https://github.com/mudachyo/TapSwap`, styles.starting);

function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1); // Проверяем, что точка находится внутри круга
    return {
        x: Math.round(x * radius),
        y: Math.round(y * radius)
    };
}

function getCurrentEnergy() {
    const energyElement = document.querySelector("div._value_tzq8x_13 h4._h4_1w1my_1");
    if (energyElement) {
        return parseInt(energyElement.textContent);
    }
    return null;
}

function checkCoinAndClick() {
    const button = document.querySelector("#ex1-layer img");

    if (button) {
        console.log(`${logPrefix}Coin found. The click is executed.`, styles.success);
        clickButton();
    } else {
        checkAttempts++;
        if (checkAttempts >= maxCheckAttempts) {
            console.log(`${logPrefix}Coin not found after 3 attempts. Reloading the page.`, styles.error);
            location.reload();
        } else {
            console.log(`${logPrefix}Coin not found. Attempt  ${checkAttempts}/${maxCheckAttempts}. Check again after 3 seconds.`, styles.error);
            setTimeout(checkCoinAndClick, checkInterval);
        }
    }
}

function clickButton() {
    const currentEnergy = getCurrentEnergy();
    if (currentEnergy !== null && currentEnergy < energyThreshold) {
        const pauseTime = pauseMinTime + Math.random() * (pauseMaxTime - pauseMinTime);
        console.log(`${logPrefix}The energy is lower ${energyThreshold}. Pause for ${Math.round(pauseTime / 1000)} seconds.`, styles.info);
        setTimeout(clickButton, pauseTime);
        return;
    }

    const button = document.querySelector("#ex1-layer img");

    if (button) {
        const rect = button.getBoundingClientRect();
        const radius = Math.min(rect.width, rect.height) / 2;
        const { x, y } = getRandomCoordinateInCircle(radius);

        const clientX = rect.left + radius + x;
        const clientY = rect.top + radius + y;

        const commonProperties = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY,
            screenX: clientX,
            screenY: clientY,
            pageX: clientX,
            pageY: clientY,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
            width: 1,
            height: 1,
            pressure: 0.5,
            button: 0,
            buttons: 1
        };

        // Trigger events
        triggerEvent(button, 'pointerdown', commonProperties);
        triggerEvent(button, 'mousedown', commonProperties);
        triggerEvent(button, 'pointerup', { ...commonProperties, pressure: 0 });
        triggerEvent(button, 'mouseup', commonProperties);
        triggerEvent(button, 'click', commonProperties);

        // Schedule the next click with a random delay
        const delay = minClickDelay + Math.random() * (maxClickDelay - minClickDelay);
        setTimeout(checkCoinAndClick, delay);
    } else {
        console.log(`${logPrefix}Coin not found!`, styles.error);
    }
}

// Start the first check
checkCoinAndClick();
