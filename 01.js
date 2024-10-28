const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-A46B820C-9E90-4EA9-8000-54006FFA5797`;
let weatherData = null;
const searchBtn = document.getElementById('search-btn');
const searchInputField = document.getElementById('search-input');


// 資料抓取函式
function fetchWeatherData(apiUrl) {
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            weatherData = data.records.location || [];
            // console.log('資料已成功抓取:', weatherData);
            return weatherData;
        })
        .catch(error => {
            console.error('發生錯誤：', error);

        })
}
// 處理搜尋邏輯
function handleSearch() {
    const userInput = searchInputField.value.trim().toLowerCase();
    // console.log(`使用者輸入的縣市名: ${userInput}`);

    if (weatherData) {
        let locationIndex = weatherData.findIndex(location => location.locationName.toLowerCase() === userInput);
        if (weatherData[locationIndex]) {
            // console.log(`找到的縣市與索引： ${weatherData[locationIndex].locationName}、[${locationIndex}]`);
            updateDOM(locationIndex);
        } else {
            // alert('請輸入正確縣市名')
            const locationNameElement = document.getElementById('location-name');
            locationNameElement.innerText = '請輸入正確縣市名';
            locationNameElement.style = "color: #e55"
        }
    } else {
        console.error('資料載入失敗或尚未載入');
    }
}
// 選單選擇處理
function handleSelect() {
    const locationSelect = document.getElementById('location-select');
    locationSelect.addEventListener('change', function () {
        const selectValue = locationSelect.value;
        console.log(selectValue);
        if (weatherData) {
            let locationIndex = selectValue;
            updateDOM(locationIndex);
        } else {
            console.error('資料載入失敗或尚未載入');
        }

    })
}



// 更新 DOM 的函式
function updateDOM(locationIndex) {
    const locationNameElement = document.getElementById('location-name');
    const weatherTypeElement = document.getElementById('weather-type');
    const rainProbabilityElement = document.querySelector('#rain-probability .en-text span')
    const comfortIndexElement = document.querySelector('#comfort-index .en-text');
    const temperatureElement = document.querySelector('#temperature span');

    const selectedLocation = weatherData[locationIndex];
    // console.log(temperatureElement);


    //顯示目前資料
    console.log(selectedLocation); //當前城市
    // console.log(selectedLocation.weatherElement); //當前城市天氣
    // console.log(selectedLocation.weatherElement[0].time[0].parameter.parameterName); //當前城市天氣
    // console.log(selectedLocation.weatherElement[1].time[0].parameter.parameterName); //當前降雨機率
    // console.log(selectedLocation.weatherElement[3].time[0].parameter.parameterName); //當前舒適度
    // console.log(selectedLocation.weatherElement[4].time[0].parameter.parameterName); //當前氣溫


    // 將資料封包成物件
    let selectedLocationInfo = {
        "weatherType": selectedLocation.weatherElement[0].time[0].parameter.parameterName,
        "weatherTypeNumber": selectedLocation.weatherElement[0].time[0].parameter.parameterValue,
        "rainProbability": selectedLocation.weatherElement[1].time[0].parameter.parameterName,
        "comfortIndex": selectedLocation.weatherElement[3].time[0].parameter.parameterName,
        "temperature": selectedLocation.weatherElement[4].time[0].parameter.parameterName
    }
    // console.log(selectedLocationInfo.temperature);


    // 更新 DOM 內容
    locationNameElement.innerText = selectedLocation.locationName;
    weatherTypeElement.innerText = selectedLocationInfo.weatherType;
    rainProbabilityElement.innerText = selectedLocationInfo.rainProbability;
    comfortIndexElement.innerText = selectedLocationInfo.comfortIndex;
    temperatureElement.innerText = selectedLocationInfo.temperature;

    switchWeatherIcon(selectedLocationInfo)
}


// DOM 載入完成，抓取資料
document.addEventListener('DOMContentLoaded', function () {
    fetchWeatherData(apiUrl)
        .then(() => {
            let locationIndex = 5
            updateDOM(locationIndex);
            handleSelect();

            // 綁定搜尋按鈕的事件
            searchBtn.addEventListener('click', function () {
                handleSearch();
            });

            // 綁定 input 框的 Enter 事件
            searchInputField.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' && !event.isComposing) {  // 檢測是否是 Enter 鍵
                    searchBtn.click();  // 模擬點擊 search 按鈕
                }
            });
        })
        .catch(() => {
            console.error('資料載入失敗');
        });
});

// 修改 icon 的邏輯
function switchWeatherIcon(selectedLocationInfo) {
    const weatherIconElement = document.getElementById('weather-icon');
    if (selectedLocationInfo.weatherType) {
        // console.log(selectedLocationInfo.weatherType);
        // console.log(selectedLocationInfo.weatherTypeNumber);
        const weatherTypeNumber = Number(selectedLocationInfo.weatherTypeNumber);
        switch (weatherTypeNumber) {
            case 1:
                weatherIconElement.src = "weather-img/wx-icon/01-sunny.svg";
                break;
            case 2:
                weatherIconElement.src = "weather-img/wx-icon/02-partly-cloudy.svg";
                break;
            case 3:
                weatherIconElement.src = "weather-img/wx-icon/03-mostly-cloudy.svg";
                break;
            case 4:
                weatherIconElement.src = "weather-img/wx-icon/04-cloudy.svg";
                break;
            case 5:
                weatherIconElement.src = "weather-img/wx-icon/05-cloudy-to-overcast.svg";
                break;
            case 6:
                weatherIconElement.src = "weather-img/wx-icon/06-overcast-to-cloudy.svg";
                break;
            case 7:
                weatherIconElement.src = "weather-img/wx-icon/07-overcast.svg";
                break;
            case 8:
                weatherIconElement.src = "weather-img/wx-icon/08-cloudy-showers.svg";
                break;
            case 9:
                weatherIconElement.src = "weather-img/wx-icon/09-cloudy-showers.svg";
                break;
            case 10:
                weatherIconElement.src = "weather-img/wx-icon/10-overcast-showers.svg";
                break;
            case 11:
                weatherIconElement.src = "weather-img/wx-icon/11-overcast-occasional-showers.svg";
                break;
            case 14:
                weatherIconElement.src = "weather-img/wx-icon/14-overcast-rain.svg";
                break;
            case 20:
                weatherIconElement.src = "weather-img/wx-icon/14-overcast-rain.svg";
                break;
            default:
                weatherIconElement.src = "weather-img/wx-icon/default.svg"; // 預設 icon
        }
    } else {
        console.error('資料載入失敗')
    }


}
