import { formateDateCode, formateDate, favoriteList, addCity, deleteCity } from "./main.js";
import { saveCurrentCity, getCurrentCity, saveFavoriteCity } from "./localStorage.js";

const SERVER_URL_FORECAST = 'http://api.openweathermap.org/data/2.5/forecast';
const SERVER_URL_WEATHER = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f660a2fb1e4bad108d6160b7f58c555f';

const UI_ELEMENTS = {
    TABS_MENU: document.querySelectorAll('.main-tabs__item'),
    TABS_CONTENT: document.querySelectorAll('.main-tabs__block'),
    SEARCH_FORM: document.querySelector('.search-form'),
    SEARCH_INPUT: document.querySelector('.search__input'),
    NOW_TEMPERATURE: document.querySelector('.weather-now__temperature'),
    NOW_CITY: document.querySelector('.title-city-now'),
    NOW_IMG: document.querySelector('.weather-now__img'),
    DETAILS_TITLE: document.querySelector('.weather-details__title'),
    DETAILS_TEMPERATURE: document.querySelector('.temperature'),
    DETAILS_FEELS_LIKE: document.querySelector('.feels_like'),
    DETAILS_WEATHER: document.querySelector('.weather'),
    DETAILS_SUNRISE: document.querySelector('.sunrise'),
    DETAILS_SUNSET: document.querySelector('.sunset'),
    FAVORITE_LIST_ADD: document.querySelector('.weather-now__btn'),
    CITY_LIST: document.querySelector('.city-list'),
    FORECAST_LIST: document.querySelector('.weather-forecast__list'),
    FORECAST_TITLE: document.querySelector('.weather-forecast__title'),
}

loadInfo();

UI_ELEMENTS.FAVORITE_LIST_ADD.addEventListener('click', (event) => {
    const currentCity = event.currentTarget.previousElementSibling.textContent;

    if (favoriteList.has(currentCity)) {
        deleteCity(currentCity);
        saveFavoriteCity(currentCity);

        const cityListItems = document.querySelectorAll('.city-list__item');
        cityListItems.forEach(item => {
            if (item.textContent === currentCity) {
                item.parentNode.remove()
            }
        })

    } else {
        addCity(currentCity);
        saveFavoriteCity(currentCity);
        addCityToUI(currentCity);
    }

    showInfoAboutCity();
    deleteCityFromUI();

    event.currentTarget.classList.toggle('active-heart');
})

UI_ELEMENTS.TABS_MENU.forEach((item) => {
    item.addEventListener('click', (event) => {
        const clickedItemId = event.target.getAttribute('data-tab');

        UI_ELEMENTS.TABS_MENU.forEach((item) => item.classList.remove('main-tabs__item--active'));
        UI_ELEMENTS.TABS_CONTENT.forEach((item) => item.classList.remove('main-tabs__block--active'));

        event.target.classList.add('main-tabs__item--active');
        document.getElementById(clickedItemId).classList.add('main-tabs__block--active');
    })
})

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = UI_ELEMENTS.SEARCH_INPUT.value;

    currentWeatherRequest(cityName);
    forecastWeatherRequest(cityName);

    UI_ELEMENTS.SEARCH_INPUT.value = '';
})

function showInfoAboutCity() {
    const cityBtnsList = document.querySelectorAll('.city-list__item');

    cityBtnsList.forEach(item => {
        item.addEventListener('click', event => {
            const currentCity = event.currentTarget.textContent;

            currentWeatherRequest(currentCity);
            forecastWeatherRequest(currentCity);
        })
    })
}

function addCityToUI(cityName) {
    const li = document.createElement('li');

    li.innerHTML = `
        <button class="city-list__item">${cityName}</button>
        <button class="city-list__close-btn"></button>
    `;

    UI_ELEMENTS.CITY_LIST.append(li);
}

function deleteCityFromUI() {
    const deleteBtn = document.querySelectorAll('.city-list__close-btn');

    deleteBtn.forEach(item => {
        item.addEventListener('click', (event) => {
            const currentCity = event.currentTarget.previousElementSibling.textContent;

            deleteCity(currentCity);
            saveFavoriteCity(currentCity);

            event.currentTarget.parentNode.remove();

            checkStatus();
        })
    })
}

function checkStatus() {
    const nowCity = document.querySelector('.title-city-now');

    if (favoriteList.has(nowCity.textContent)) {
        nowCity.nextElementSibling.classList.add('active-heart');
    } else {
        nowCity.nextElementSibling.classList.remove('active-heart');
    }
}

async function currentWeatherRequest(cityName) {
    const url = `${SERVER_URL_WEATHER}?q=${cityName}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
    
        UI_ELEMENTS.NOW_TEMPERATURE.textContent = Math.round(data.main.temp) + '°';
        UI_ELEMENTS.NOW_CITY.textContent = data.name;
        UI_ELEMENTS.NOW_IMG.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        UI_ELEMENTS.DETAILS_TITLE.textContent = data.name;
        UI_ELEMENTS.DETAILS_TEMPERATURE.textContent = Math.round(data.main.temp) + '°';
        UI_ELEMENTS.DETAILS_FEELS_LIKE.textContent = Math.round(data.main.feels_like) + '°';
        UI_ELEMENTS.DETAILS_WEATHER.textContent = data.weather[0].main;
        UI_ELEMENTS.DETAILS_SUNRISE.textContent = formateDateCode(data.sys.sunrise);
        UI_ELEMENTS.DETAILS_SUNSET.textContent = formateDateCode(data.sys.sunset);
    
        checkStatus();
    
        saveCurrentCity(data.name);
    } catch(error) {
        console.log(error);
    }
}

async function forecastWeatherRequest(cityName) {
    const url = `${SERVER_URL_FORECAST}?q=${cityName}&units=metric&appid=${API_KEY}`;

    UI_ELEMENTS.FORECAST_LIST.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        UI_ELEMENTS.FORECAST_TITLE.textContent = data.city.name;

        data.list.forEach(item => {
            const date = formateDate(item.dt_txt);
            
            const li = document.createElement('li');
            li.className = 'weather-forecast__list-item';
            li.innerHTML = `
            <div class="weather-forecast__top">
                <p class="weather-forecast__text forecast_data">${date}</p>
                <p class="weather-forecast__text time">${formateDateCode(item.dt)}</p>
            </div>
            <div class="weather-forecast__bottom">
                <div class="weather-forecast__parameters">
                    <p class="weather-forecast__text temperature"> Temperature: ${Math.round(item.main.temp)}°</p>
                    <p class="weather-forecast__text"> Feels like: ${Math.round(item.main.feels_like)}°</p>
                </div>
                <div class="weather-forecast__precipitation">
                    <p class="weather-forecast__text">${item.weather[0].main}</p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="weather icon" class="weather-forecast__img">
                </div>
            </div>
            `;

            UI_ELEMENTS.FORECAST_LIST.append(li);

        })

        saveCurrentCity(data.city.name);
    } catch(error) {
        console.log(error);
    }
}

function loadInfo() {
    loadFavoriteList();
    loadCurrentCity();
    showInfoAboutCity();
    deleteCityFromUI();
}

function loadFavoriteList() {
    favoriteList.forEach(item => addCityToUI(item));
}

function loadCurrentCity() {
    const currentCity = getCurrentCity();

    if (currentCity) {
        currentWeatherRequest(currentCity);
        forecastWeatherRequest(currentCity);
    }
}