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
        let locationIndex = weatherData.findIndex(location => location.locationName === userInput);
        if (weatherData[locationIndex]) {
            console.log(`找到的縣市與索引： ${weatherData[locationIndex].locationName}、[${locationIndex}]`);
            updateDOM(locationIndex);
        } else {
            alert('請輸入正確縣市名')
        }
    } else {
        console.error('資料載入失敗或尚未載入');
    }
}

// 更新 DOM 的函式
function updateDOM(locationIndex){
    const locationNameElement = document.getElementById('location-name');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const weatherIconElement = document.getElementById('weather-icon');

    //顯示目前資料
    console.log(weatherData[locationIndex]); //當前城市
    

    // 更新 DOM 內容
    locationNameElement.innerText = weatherData[locationIndex].locationName

}


// DOM 載入完成，抓取資料
document.addEventListener('DOMContentLoaded', function () {
    fetchWeatherData(apiUrl)
        .then(() => {
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

