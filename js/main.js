import { getFavoriteList } from "./localStorage.js";

export const favoriteList = new Set(getFavoriteList());

export function addCity(cityName) {
    favoriteList.add(cityName);
}

export function deleteCity(cityName) {
    favoriteList.delete(cityName);
}

export function formateDate(dateString) {
    const dateObj = new Date(dateString);
  
    const options = {
      day: "numeric",
      month: "short",
    };
    const dateFormatter = new Intl.DateTimeFormat("en-US", options);
    const date = dateFormatter.format(dateObj);

    // const timeOptions = {
    //   hour: "2-digit",
    //   minute: "2-digit",
    // };
    // const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
    // const time = timeFormatter.format(dateObj);
  
    return date;
  }

export function formateDateCode(code) {
    let timestamp = code;
    let sunrise = new Date(timestamp * 1000);

    let hours = sunrise.getHours();
    let minutes = sunrise.getMinutes();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let formattedTime = hours + ":" + minutes;

    return formattedTime;
}