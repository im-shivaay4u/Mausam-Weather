const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]")
const usercontainer=document.querySelector('.Weather-container')
const grantaccesscontainer=document.querySelector(".grant-location-container")
const searchform=document.querySelector("[data-searchForm]")
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container")
const galti=document.querySelector(".error");

let oldtab=usertab;
const API_KEY="b7df3323d49d8e566e6a2751a09f47df";
oldtab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(newtab){                             //it
    if(newtab!=oldtab){                             //switcches 
        oldtab.classList.remove("current-tab");         //the background color of the tabs
        oldtab=newtab;
        oldtab.classList.add("current-tab");

        if(!searchform.classList.contains("active")){  //kya searchform wala conntainer is visible then make it  visible
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active")
            searchform.classList.add("active");
        }
        else{
            //main pehle search wale tab pr tha, ann your weather tab visible karna hai
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active")
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click",()=>{
    //pass  clicked tab as innput parameter
    switchtab(usertab)
})

searchtab.addEventListener("click",()=>{
    //pass  clicked tab as innput parameter
    switchtab(searchtab)
})

//check if the coordinates are already present or not
function getfromsessionstorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");

    if(!localcoordinates){
        
        grantaccesscontainer.classList.add("active");
    }

    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserWeather(coordinates)
    }
}

async function fetchuserWeather(coordinates){
    const {lat,lon}=coordinates;
    //make grant containet invisible
    grantaccesscontainer.classList.remove("active");
    //make the loader visible
    loadingscreen.classList.add("active");

    //api call
    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingscreen.classList.remove("active")
        userinfocontainer.classList.add("active")
        renderweatherinfo(data);

    }
    catch(err){
       console.log("an error has ocured")
        // loadingscreen.classList.remove("active");
        // //404 not found
        // userinfocontainer.classList.remove("active")
        // window.alert("the location does nnot matched")

    }
}
function renderweatherinfo(weatherinfo){
        //firstly we have to make fetch thee element
        const cityname=document.querySelector("[data-cityName]");
        const countryicon=document.querySelector("[data-countryIcon]");
        const desc=document.querySelector("[data-weatherDesc]")
        const weathericon=document.querySelector("[data-weatherIcon]")
        const temp=document.querySelector("[data-temp]")
        const windspeed=document.querySelector("[data-windspeed]")
        const humidity=document.querySelector("[data-humidity]")
        const cloudi=document.querySelector("[data-clouds]")

//         fetch values from weather info and put it onto UI element

    cityname.innerText=weatherinfo?.name;
    countryicon.src=`https://flagcdn.com/48x36/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description
    weathericon.src=`https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherinfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherinfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherinfo?.main?.humidity}%`;
    cloudi.innerText=`${weatherinfo?.clouds?.all}%`;
 }


 function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition)
    }
    else{
        //alert
        
        
        
    }
 }
 function showposition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates))
    fetchuserWeather(usercoordinates);
 }

 //adding a listener to the grant access button
 const grantAccessButton=document.querySelector("[data-grantAccess]");
 grantAccessButton.addEventListener("click",getlocation);


 const searchinput=document.querySelector("[data-searchInput] ")
 searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchinput.value==="") return;
    fetchsearchweatherinfo(searchinput.value);

 })

 async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active")

    try{
        const response=await fetch(
            `https://api.openweathermap.org./data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
    //     userinfocontainer.classList.remove("active")
    //    window.alert("the location does nnot matched")
    console.log("an error has occured")
        
    }
 }
 console.log("Everyone loves Shiva")