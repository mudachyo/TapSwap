// Configurable values
const minClickDelay = 30; // Minimum delay between clicks in milliseconds
const maxClickDelay = 50; // Maximum delay between clicks in milliseconds
const pauseMinTime = 100000; // Minimum pause time in milliseconds (100 seconds)
const pauseMaxTime = 300000; // Maximum pause time in milliseconds (300 seconds)
const energyThreshold = 25; // Energy threshold below which a pause is taken
const checkInterval = 3000; // Interval to check for coin presence in milliseconds (3 seconds)
const maxCheckAttempts = 5; // Maximum number of attempts to check for coin presence

let checkAttempts = 0; // Counter for check attempts

function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1); // Ensure the point is inside the circle
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
        console.log("%c[TapSwap-Autoclicker] - Coin found. Performing click.", "background: #8774E1; color: #fff; padding: 5px;");
        clickButton();
    } else {
        checkAttempts++;
        if (checkAttempts >= maxCheckAttempts) {
            console.log("%c[TapSwap-Autoclicker] - Coin not found after 5 attempts. Reloading page.", "background: #8774E1; color: #fff; padding: 5px;");
            location.reload();
        } else {
            console.log(`%c[TapSwap-Autoclicker] - Coin not found. Attempt ${checkAttempts}/${maxCheckAttempts}. Retrying in 3 seconds.`, "background: #8774E1; color: #fff; padding: 5px;");
            setTimeout(checkCoinAndClick, checkInterval);
        }
    }
}

function clickButton() {
    const currentEnergy = getCurrentEnergy();
    if (currentEnergy !== null && currentEnergy < energyThreshold) {
        const pauseTime = pauseMinTime + Math.random() * (pauseMaxTime - pauseMinTime);
        console.log(`%c[TapSwap-Autoclicker] - Energy below ${energyThreshold}. Pausing for ${Math.round(pauseTime / 1000)} seconds.`, "background: #8774E1; color: #fff; padding: 5px;");
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
        console.log("%c[TapSwap-Autoclicker] - Button not found!", "background: #8774E1; color: #fff; padding: 5px;");
    }
}

// Start the first check
checkCoinAndClick();
