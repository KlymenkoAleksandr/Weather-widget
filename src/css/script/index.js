const RENDER = {
    renderList(list) {
        return list.map(weather => {
            return (`
                <li>
                    <div>
                        ${this.getDate(weather.dt).toLocaleTimeString()}
                        ${this.getDate(weather.dt).toLocaleDateString()}
                    </div>
                    <div>
                        <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="">
                        <span>${Math.floor((typeof weather.temp === 'number' ? weather.temp : weather.temp.day) - 273)}°</span>
                    </div>
                </li>
            `);
        }).join('');
    },

    renderTodayDate(data) {
        return this.renderList(data.hourly);
    },

    renderWeekDate(data) {
        return this.renderList(data.daily);
    },

    fillTab(data) {
        const tabToday = document.getElementById('today');
        const tabWeek = document.getElementById('week');

        const contentToday = document.getElementById('weather-today-content');
        constcontentWeek = document.getElementById('weather-week-content');

        tabToday.addEventListener('click', e => {
            e.preventDefault();
            tabToday.classList.add('active');
            tabWeek.classList.remove('active');

            contentToday.removeAttribute('hidden');
            contentToday.innerHTML = this.renderTodayDate(data);
            constcontentWeek.setAttribute('hidden', true);
        });

        tabToday.click();
    },

    ready() {
        const loader = document.getElementById('page-loader');

        if (loader) {
            loader.classList.add('open');
        }
    },

    getDate(dt) {
        const date = new Date(dt * 1000);

        return date;
    },

    base(weatherData) {
        const city = document.getElementById('city');
        const country = document.getElementById('country');
        const time = document.getElementById('time');
        const date = document.getElementById('date');
        const temperature = document.getElementById('temperature');
        const icon = document.querySelector('#icon img');
        const weatherDescription = document.getElementById('weather-description');

        const [currentweather] = weatherData.weather;

        city.innerHTML = weatherData.name;
        country.innerHTML = weatherData.sys.country;
        time.innerHTML = this.getDate(weatherData.dt).toLocaleTimeString();
        date.innerHTML = this.getDate(weatherData.dt).toLocaleDateString();
        temperature.innerHTML = Math.floor(weatherData.main.temp - 273) + '°';

        icon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
        weatherDescription.innerHTML = currentweather.description;
    }

}

const APP = {
    init(event) {
        const weather = JSON.parse(event.target.response);

        RENDER.base(weather);
        RENDER.ready();

        API.getForecastWeather({
            lat: weather.coord.lat,
            lon: weather.coord.lon
        }, forecastEvent => {
            RENDER.fillTab(JSON.parse(forecastEvent.target.response));
        });
    },

    initWithCoordinates(lat, lon) {
        API.getCurrentWeather({lat, lon}, (event) => this.init(event));
    },

    initWithCityName() {
        const cityName = prompt('Enter your city name');

        API.getCurrentWeather({q: cityName}, (event) => this.init(event));
    }
}

function success(pos) {
    const crd = pos.coords;
console.log(crd);
    const lat = crd.latitude;
    const lon = crd.longitude;

    if (lat && lon) {
        APP.initWithCoordinates(lan, lon);
    }
}

function error() {
    console.log('Location not detected');

    APP.initWithCityName();
}

navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
})