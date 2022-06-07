const form = document.querySelector(`form`)
const widgetButton = document.querySelector(`.showWidget`) 
const copyWidgetButton = document.querySelector(`.copyWidgetButton`)
const changeColorsElems = [[...document.querySelector(`.outerCircle`).querySelectorAll(`span`)],document.querySelector(`.temp`),document.querySelector(`.tempDescr`)]
const arrow = document.querySelector(`.arrow`)    
const red = `#e42618`
const blue = `#0000ff`

const currTimeElem = document.querySelector(`.currTime`)
const currTempElem = document.querySelector(`.temp`)
const currTempIconElem = document.querySelector(`.tempIcon`)
const nextDaysTempElem = document.querySelector(`.nextDaysTempWrapper`)
const nextDaysTemp = document.querySelectorAll(`.nextDaysTemp`)
const nextDaysIcon = document.querySelectorAll(`.nextDaysTempIcon`)



const  APIKEY = "2e9102dcb16420f8333072bce3987290";



let arrowPos = 0


async function getData(e){
    e.preventDefault()
    const prevWidget = document.getElementById(`openweathermap-widget-11`)    
    if(prevWidget){
        prevWidget.remove()
    }      
    copyWidgetButton.removeEventListener(`click`,copyWidgetCode)
    if(copyWidgetButton){
        copyWidgetButton.style.display = `none`
    }
    if(widgetButton){
        widgetButton.style.display = `none`
    }
    let changeColorInterval;
    let moveArrowInterval;

    initiateAnimation()
    
    const location = form.querySelector(`[type="text"]`).value





let status = false;
setTimeout(() => {
    if (!status){
        alert(`Что то пошло не так. Убедитесь, что город введён корректно или попробуйте  ещё раз. Если не поможет - убедитесь, что у вас работает ВПН или воспользуйтесь кнопкой показа работы приложения без ВПН.`)
        clearInterval(changeColorInterval)
        clearInterval(moveArrowInterval)    
        while(Math.abs(arrowPos % 360) != 0){
            arrowPos++;
        }
        arrow.style.transform = `translate(0,-80%) rotate(${arrowPos}deg)`   
    }
}, 5000);
let geoResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKEY}`)
let geoData = await geoResp.json()









const LAT =  +geoData.coord.lat
const LON =  +geoData.coord.lon
let currWeatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${APIKEY}`)

let currWeatherData = await currWeatherResp.json()



const cityID = geoData.id


let nextDaysWeatherResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${APIKEY}`)
let nextDaysWeatherData = await nextDaysWeatherResp.json()
status = true;





const currDate = new Date(currWeatherData.dt * 1000)
const currTime = `${getWeekDay(currDate.getDay())}: ${getNum(currDate.getHours()) }:${getNum(currDate.getMinutes())}`

const nextDaysObj = nextDaysWeatherData.list
const nextDays = getNextDays(nextDaysObj)
const nextDaysTimes = getNextDaysTimes(nextDays)
const nextDaysDays = getNextDaysDays(nextDays)
const nextDaysIconSrcs = getNextDaysIconState(nextDays);


const currTemp = Math.round(Number(currWeatherData.main.temp - 273.15))

fillData()
clearInterval(changeColorInterval)
clearInterval(moveArrowInterval)
changeColorToFinal(changeColorsElems,currTemp)
moveArrowFinal()
widgetButton.style.display = `block`
widgetButton.addEventListener(`click`,clickOnWidgetButton)


function getNextDays(obj){
    let daysArr = [];
    const currDay = currDate.toLocaleDateString().slice(0,2)
    for(let chunk of obj){       
        const day = chunk["dt_txt"].slice(8,10)
        const time = chunk["dt_txt"].slice(-8);
        if(currDay != day && time === `15:00:00` ){
            daysArr.push(chunk)
        }  
    }
    if(daysArr.length != 5){
        daysArr.push(obj[obj.length - 1])
    }
    return daysArr;
}
function getNextDaysTimes(daysArr){
    let timeArr = []
    for(let day of daysArr){      
        timeArr.push(Math.round(day.main.temp - 273.15))
    }
    if(timeArr.length != 5){
        timeArr.push(Math.round(arr[obj.length - 1].main.temp - 273.15))
    }
    return timeArr

}

function getNextDaysDays(daysArr){

    let newDaysArr = []
    for(let day of daysArr){
        const currDay = getWeekDay(new Date(day["dt_txt"]).getDay())
        newDaysArr.push(currDay)
    }
    return newDaysArr
}
function getNextDaysIconState(daysArr){
    if(!Array.isArray(daysArr)){
        daysArr = [daysArr]
    }
    let iconsStateArr = []
    for(let day of daysArr){
        const mainState = day.weather["0"].main
        const descrState = day.weather["0"].description        
        if(mainState == `Clouds`){
            if(descrState.includes("overcast") || descrState.includes("scattered")){
                iconsStateArr.push(`./clouds.png`)
                continue;
            }
            iconsStateArr.push(`./cloudsandsun.png`)
            continue;
        }
        if(mainState == `Rain`){
            if(descrState.includes(`light`)){
                iconsStateArr.push(`./lightrain.png`)
                continue;
            }
            iconsStateArr.push(`./rain.png`)
            continue;
        }
        if(mainState == `Clear`){
            iconsStateArr.push(`./clear.png`)
            continue;
        }
        if(mainState == `Snow`){
            iconsStateArr.push(`./snow.png`)
            continue
        }
    }        
    return iconsStateArr;
}



function fillData(){
    nextDaysTempElem.style.display = `flex`
    fillNextDays()
    fillnextDaysIcons()
    fillLocation()
    changeSign()    



    function fillnextDaysIcons(){          
        currTempIconElem.src = `${getNextDaysIconState(currWeatherData)}`        
        for(let i = 0; i < nextDaysTemp.length; i++){
            nextDaysTemp[i].querySelector(`.nextDaysTempIcon`).src = nextDaysIconSrcs[i];
        }

    }


    function fillNextDays(){
        currTimeElem.textContent = currTime
        currTempElem.textContent = currTemp
        for(let i = 0; i < nextDaysTemp.length;i++){
            nextDaysTemp[i].querySelector(`.nextDaysTempDescr`).textContent = `${nextDaysTimes[i]} °C`
            nextDaysTemp[i].querySelector(`.nextDaysTempDay`).textContent = `${nextDaysDays[i]}`
        }         
    }
    function fillLocation(){
        document.querySelector(`.location`).textContent = `${currWeatherData.name}`
    }
    function changeSign(){
        let degreesArr = document.querySelector(`.outerCircle`).querySelectorAll(`p`)
        for(let item of degreesArr){
            if(item.textContent[0] != `-` && currTemp < 0 ){
                item.textContent = `-${item.textContent}`
                continue;
            }
            if(item.textContent[0] === `-` && currTemp > 0){
                item.textContent = item.textContent.slice(1)
                continue;
            }
        }
    }
}





function getWeekDay(num){
    if(num == 1) return `Понедельник`
    if(num == 2) return `Вторник`
    if(num == 3) return `Среда`
    if(num == 4) return `Четверг`
    if(num == 5) return `Пятница`
    if(num == 6) return `Суббота`
    if(num == 0) return `Воскресенье`
}
function getNum(num){
    if(+num < 10) return `0${num}`
    return num
}
function initiateAnimation(){    
     changeColorInterval = setInterval(() => {
        for(let elem of changeColorsElems){     
            if(Array.isArray(elem)){
                for(let span of elem){
                    changeColorInt(span)
                }
            }else{
                changeColorInt(elem)
            }
        }        
    }, 300);
     moveArrowInterval = setInterval(() => {
        moveArrow(arrowPos)
    }, 70);


    function moveArrow(prevArrowPosition){            
        arrow.style.transform = `translate(0,-80%) rotate(${prevArrowPosition + 5}deg)`
        arrowPos += 5
    }
}
function changeColorInt(element,finalColor){ 
    const data = element.dataset    
    if(data.bcg){
        if(data.bcg === `blue`){
            element.style.background = finalColor || `${red}`
            data.bcg = `red`
            return
        }
        if(data.bcg === `red`){
            element.style.background = finalColor || `${blue}`
            data.bcg = `blue`
            return
        }
        element.style.background = finalColor || `${blue}`
        data.bcg = `blue`
        return
    }
    if(data.color){        
        if(data.color === `red`){
            element.style.color = finalColor || `${blue}`
            data.color = `blue`
            return
        }
        if(data.color === `blue`){
            element.style.color = finalColor || `${red}`
            data.color = `red`
            return;
        }
        element.style.color = finalColor || `${red}`
        data.color = `red`
        return;
    }
}

function changeColorToFinal(elems,finalTemp){
    let finalColor;
    if(finalTemp < 0){
        finalColor = `#9898f3`
        if(finalTemp < -5) finalColor = `#9898f3`
        if(finalTemp < -15) finalColor = `#6d6df2`
        if(finalTemp < -25) finalColor = `#5252f4`
        if(finalTemp < -35) finalColor = `#1a1af1`
    }else{
        finalColor = `#f6aba6`
        if(finalTemp > 5 ) finalColor = `#f6aba6`
        if(finalTemp > 15) finalColor = `#f48e87`
        if(finalTemp > 25) finalColor = `#ef6f66`
        if(finalTemp > 35) finalColor = `#f1463a`
        if(finalTemp > 45) finalColor = `#f02112`
    }
    for(let elem of elems){     
        if(Array.isArray(elem)){
            for(let span of elem){
                changeColorInt(span,finalColor)
            }
        }else{
            changeColorInt(elem,finalColor)
        }
    }    
}

function moveArrowFinal(){
    while(Math.abs(arrowPos % 360) != 0){
        arrowPos++;
    }
    arrow.style.transform = `translate(0,-80%) rotate(${arrowPos + currTemp* 6}deg)`
    arrowPos += currTemp * 6
}



function clickOnWidgetButton(){
    widgetButton.removeEventListener(`click`,clickOnWidgetButton)
    postWidget(cityID)
    widgetButton.style.display = `none`
}
function postWidget(cityID){
    document.body.insertAdjacentHTML(`afterbegin`,`<div id="openweathermap-widget-11"></div>`)

    let firstScript = document.createElement(`script`)
    firstScript.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'
    document.body.append(firstScript)
    copyWidgetButton.style.display = `block`
    copyWidgetButton.addEventListener(`click`,copyWidgetCode)    

    window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 11,cityid: cityID,appid: '5d54f70f564870867a6855f792634f2b',units: 'metric',containerid: 'openweathermap-widget-11',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();   
}
function copyWidgetCode(e){
    const copyText = `<div id="openweathermap-widget-11"></div>
    <script src='//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script><script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 11,cityid: ${cityID},appid: '5d54f70f564870867a6855f792634f2b',units: 'metric',containerid: 'openweathermap-widget-11',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();</script>`
    navigator.clipboard.writeText(copyText)
}

}
form.addEventListener(`submit`,getData)

const altWorkButton = document.querySelector(`.altWork`)
altWorkButton.addEventListener(`click`,altWork)

function altWork(){
    const prevWidget = document.getElementById(`openweathermap-widget-11`)    
    if(prevWidget){
        prevWidget.remove()
    }      
    copyWidgetButton.removeEventListener(`click`,copyWidgetCode)
    if(copyWidgetButton){
        copyWidgetButton.style.display = `none`
    }
    if(widgetButton){
        widgetButton.style.display = `none`
    }
    let changeColorInterval;
    let moveArrowInterval;

    initiateAnimation()
    
    const location = `Moscow`
    const cityID = 524901;
    const currTemp = 20
    const icons = [`./clouds.png`,`./cloudsandsun.png`,`./clear.png`,`./lightrain.png`,`./rain.png`]
    const dates = [`Вторник`, `Среда`, `Четверг`,`Пятница`, `Суббота`]
    const temps = [`17`,`18`,`15`,`14`,`10`]
    const currDate = [`Понедельник 15:30`]
    const currIcon = `./clear.png`

function fillData(){
    nextDaysTempElem.style.display = `flex`
    fillNextDays()
     currTempIconElem.src = currIcon
    fillnextDaysIcons()
    fillLocation()
    changeSign()    



    function fillnextDaysIcons(){  
        for(let i = 0; i < nextDaysTemp.length; i++){
            nextDaysTemp[i].querySelector(`.nextDaysTempIcon`).src = icons[i];
        }      
    }


    function fillNextDays(){
        currTimeElem.textContent = currDate
        currTempElem.textContent = currTemp
        for(let i = 0; i < nextDaysTemp.length;i++){
            nextDaysTemp[i].querySelector(`.nextDaysTempDescr`).textContent = `${temps[i]} °C`
            nextDaysTemp[i].querySelector(`.nextDaysTempDay`).textContent = `${dates[i]}`
        }       
    }
    function fillLocation(){
        document.querySelector(`.location`).textContent = `${location}`
    }
    function changeSign(){
        let degreesArr = document.querySelector(`.outerCircle`).querySelectorAll(`p`)
        for(let item of degreesArr){
            if(item.textContent[0] != `-` && currTemp < 0 ){
                item.textContent = `-${item.textContent}`
                continue;
            }
            if(item.textContent[0] === `-` && currTemp > 0){
                item.textContent = item.textContent.slice(1)
                continue;
            }
        }
    }
}






function initiateAnimation(){    
    changeColorInterval = setInterval(() => {
        for(let elem of changeColorsElems){     
            if(Array.isArray(elem)){
                for(let span of elem){
                    changeColorInt(span)
                }
            }else{
                changeColorInt(elem)
            }
        }        
    }, 300);
     moveArrowInterval = setInterval(() => {
        moveArrow(arrowPos)
    }, 70);
    setTimeout(() => {
        clearInterval(changeColorInterval);
        clearInterval(moveArrowInterval)
        fillData()
        changeColorToFinal(changeColorsElems,currTemp)
        moveArrowFinal()
        widgetButton.style.display = `block`
        widgetButton.addEventListener(`click`,clickOnWidgetButton)
    }, 2000);

    function moveArrow(prevArrowPosition){            
        arrow.style.transform = `translate(0,-80%) rotate(${prevArrowPosition + 5}deg)`
        arrowPos += 5
    }
}
function changeColorInt(element,finalColor){ 
    const data = element.dataset    
    if(data.bcg){
        if(data.bcg === `blue`){
            element.style.background = finalColor || `${red}`
            data.bcg = `red`
            return
        }
        if(data.bcg === `red`){
            element.style.background = finalColor || `${blue}`
            data.bcg = `blue`
            return
        }
        element.style.background = finalColor || `${blue}`
        data.bcg = `blue`
        return
    }
    if(data.color){        
        if(data.color === `red`){
            element.style.color = finalColor || `${blue}`
            data.color = `blue`
            return
        }
        if(data.color === `blue`){
            element.style.color = finalColor || `${red}`
            data.color = `red`
            return;
        }
        element.style.color = finalColor || `${red}`
        data.color = `red`
        return;
    }
}

function changeColorToFinal(elems,finalTemp){
    let finalColor;
    if(finalTemp < 0){
        finalColor = `#9898f3`
        if(finalTemp < -5) finalColor = `#9898f3`
        if(finalTemp < -15) finalColor = `#6d6df2`
        if(finalTemp < -25) finalColor = `#5252f4`
        if(finalTemp < -35) finalColor = `#1a1af1`
    }else{
        finalColor = `#f6aba6`
        if(finalTemp > 5 ) finalColor = `#f6aba6`
        if(finalTemp > 15) finalColor = `#f48e87`
        if(finalTemp > 25) finalColor = `#ef6f66`
        if(finalTemp > 35) finalColor = `#f1463a`
        if(finalTemp > 45) finalColor = `#f02112`
    }
    for(let elem of elems){     
        if(Array.isArray(elem)){
            for(let span of elem){
                changeColorInt(span,finalColor)
            }
        }else{
            changeColorInt(elem,finalColor)
        }
    }    
}

function moveArrowFinal(){
    console.log(arrowPos,currTemp * 6)
    while(Math.abs(arrowPos % 360) != 0){
        arrowPos++;
    }
    console.log(arrowPos,currTemp * 6)
    arrow.style.transform = `translate(0,-80%) rotate(${arrowPos + currTemp* 6}deg)`
    arrowPos += currTemp * 6
}



function clickOnWidgetButton(){
    widgetButton.removeEventListener(`click`,clickOnWidgetButton)
    postWidget(cityID)
    widgetButton.style.display = `none`
}
function postWidget(cityID){
    document.body.insertAdjacentHTML(`afterbegin`,`<div id="openweathermap-widget-11"></div>`)

    let firstScript = document.createElement(`script`)
    firstScript.src = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"
    document.body.append(firstScript)
    copyWidgetButton.style.display = `block`
    copyWidgetButton.addEventListener(`click`,copyWidgetCode)    

    window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 11,cityid: cityID,appid: '5d54f70f564870867a6855f792634f2b',units: 'metric',containerid: 'openweathermap-widget-11',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();   
}
function copyWidgetCode(e){
    const copyText = `<div id="openweathermap-widget-11"></div>
    <script src='//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script><script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 11,cityid: ${cityID},appid: '5d54f70f564870867a6855f792634f2b',units: 'metric',containerid: 'openweathermap-widget-11',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();</script>`
    navigator.clipboard.writeText(copyText)
    

}

}

