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
            console.log('資料已成功抓取:', weatherData);
            return weatherData;
        })
        .catch(error => {
            console.error('發生錯誤：', error);
            
        })
}
// 處理搜尋邏輯
function handleSearch() {
    const userInput = searchInputField.value.trim().toLowerCase();
    console.log(`使用者輸入的縣市名: ${userInput}`);

    if (weatherData) {
        let locationIndex = weatherData.findIndex(location => location.locationName.toLowerCase()  === userInput);
        if (weatherData[locationIndex]) {
            console.log(`找到的縣市與索引： ${weatherData[locationIndex].locationName}、[${locationIndex}]`);
            updateDOM(locationIndex);
        } else {
            // alert('請輸入正確縣市名')
            const locationNameElement = document.getElementById('location-name');
            locationNameElement.innerText = '請輸入正確縣市名';
            locationNameElement.style ="color: #e55"
        }
    } else {
        console.error('資料載入失敗或尚未載入');
    }
}

// 更新 DOM 的函式
function updateDOM(locationIndex){
    const locationNameElement = document.getElementById('location-name');
    const weatherTypeElement = document.getElementById('weather-type');
    const rainProbabilityElement = document.querySelector('#rain-probability .en-text span')
    const comfortIndexElement = document.querySelector('#comfort-index .en-text');
    const temperatureElement = document.querySelector('#temperature span');
    const weatherIconElement = document.getElementById('weather-icon');
    const selectedLocation = weatherData[locationIndex];
    console.log(temperatureElement);
    

    //顯示目前資料
    console.log(selectedLocation); //當前城市
    // console.log(selectedLocation.weatherElement); //當前城市天氣
    // console.log(selectedLocation.weatherElement[0].time[0].parameter.parameterName); //當前城市天氣
    // console.log(selectedLocation.weatherElement[1].time[0].parameter.parameterName); //當前降雨機率
    // console.log(selectedLocation.weatherElement[3].time[0].parameter.parameterName); //當前舒適度
    console.log(selectedLocation.weatherElement[4].time[0].parameter.parameterName); //當前氣溫


    // 將資料封包成物件
    let selectedLocationInfo = {
        "weatherType": selectedLocation.weatherElement[0].time[0].parameter.parameterName,
        "rainProbability": selectedLocation.weatherElement[1].time[0].parameter.parameterName,
        "comfortIndex": selectedLocation.weatherElement[3].time[0].parameter.parameterName,
        "temperature": selectedLocation.weatherElement[4].time[0].parameter.parameterName
    }
    console.log(selectedLocationInfo.temperature);
    

    // 更新 DOM 內容
    locationNameElement.innerText = selectedLocation.locationName;
    weatherTypeElement.innerText = selectedLocationInfo.weatherType;
    rainProbabilityElement.innerText = selectedLocationInfo.rainProbability;
    comfortIndexElement.innerText = selectedLocationInfo.comfortIndex;
    temperatureElement.innerText = selectedLocationInfo.temperature;
}


// DOM 載入完成，抓取資料
document.addEventListener('DOMContentLoaded', function () {
    fetchWeatherData(apiUrl)
        .then(() => {
            let locationIndex = 5
            updateDOM(locationIndex)
            
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
            alert('失敗')
        });
});

// 修改 icon 的邏輯

