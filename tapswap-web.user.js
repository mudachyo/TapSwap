// ==UserScript==
// @name         TapSwap-web
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Running TapSwap in a browser
// @author       mudachyo
// @match        *://app.tapswap.club/*
// @grant        none
// @icon         https://cdn4.cdn-telegram.org/file/RoC7ZYx9yo7MOeTx8vw_4JFfXOAAM7eh_KQ3-qNO734aqCHu42kMJxce6roxb1X1SjzFubMXuthhRkd9fQTceshS9EuSobMcdCMcUJr2ZulEyBu_Ks9qiA4Li7sP_gfiPdAbca4SX5aTgDGJbEfaBUsC6A5SpPDxWAdM7Q91uJwpI_BmY8IaPFfWpICIyvWr6jFvCX8VhZfpMnkhcArGaab3QJDqURkPeWxzJsnGGs8xsOWq2IFH0TU7qtS1Le7IFYQ780MBE0m8NKcYKLk9z3L-P2_UqcyBwX9tjVNd8sQmGC0217UlHNSLpgftPjAln_TXOUbQ1_rJO3npRbKuAg.jpg
// @downloadURL  https://github.com/mudachyo/TapSwap/raw/main/tapswap-web.user.js
// @updateURL    https://github.com/mudachyo/TapSwap/raw/main/tapswap-web.user.js
// @homepage     https://github.com/mudachyo/TapSwap
// ==/UserScript==

(function() {
    'use strict';

    // Функция для замены URL скрипта
    function replaceScriptUrl() {
        // URL-адрес для замены
        const oldUrl = 'https://telegram.org/js/telegram-web-app.js';
        const newUrl = 'https://ktnff.tech/universal/telegram-web-app.js';

        // Получаем все теги <script> на странице
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            // Проверяем, содержит ли src один из URL-адресов для замены
            if (script.src === oldUrl) {
                // Создаем новый тег <script> с новым URL
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';

                // Заменяем старый тег на новый
                script.parentNode.replaceChild(newScript, script);
                console.log('Script URL replaced:', newScript.src);
            }
        }
    }

    // Функция для перезагрузки страницы
    function checkAndReload() {
        if (document.querySelector('div._leaveContainer_rxbn1_1')) {
            console.log('Class _leaveContainer_rxbn1_1 found, reloading page.');
            location.reload();
        }
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceScriptUrl();
                checkAndReload();
            }
        });
    });

    // Настройки наблюдателя
    const config = {
        childList: true,
        subtree: true
    };

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, config);

    // Первоначальный запуск замены URL и проверка на наличие класса
    replaceScriptUrl();
    checkAndReload();
})();
