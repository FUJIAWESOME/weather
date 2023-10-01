export function saveFavoriteCity(cityName) {
    const isIncludedFavoriteList = Object.keys(localStorage).includes(cityName);

    if (!isIncludedFavoriteList) {
        localStorage.setItem(cityName, '')
    } else {
        localStorage.removeItem(cityName);
    }
}

export function saveCurrentCity(cityName) {
    localStorage.setItem('currentCity', cityName);
}

export function getCurrentCity() {
    return localStorage.getItem('currentCity');
}

export function getFavoriteList() {
    const favoriteList = Object.keys(localStorage);
    const indexOfCurrentCity = favoriteList.indexOf('currentCity');

    if (indexOfCurrentCity !== -1) {
        favoriteList.splice(indexOfCurrentCity, 1);
    }

    return favoriteList;
}