/**
 * @license MIT
 * @fileoverview Manage all routes
 * @copyright codegg 2023 All rights reserved
 * @author codegg <codegg401@gmail.com>
 */

'use strict';

/**
 * Imports
 */
import { updateWeather, error404 } from "./app.js";



const defaultLocation = "#/weather?lat=51.5073219&lon=0.1276474" //london

const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;

        updateWeather(`lat=${latitude}, lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
    });
}

/**
 * @param {string} query Searched query
 */
const searchLocation = query => updateWeather(...query.split("&"));

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchLocation]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(route)(query) : error404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});