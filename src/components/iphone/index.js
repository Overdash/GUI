// import preact
import { h, render, Component } from 'preact';
// import stylesheets
import style from './style';
import style_iphone from '../button/style_iphone';
import kitStyle from './kit';
import matchStyle from './match';
// import jquery for API calls
import $ from 'jquery';

export default class Index extends Component {
//var Iphone = React.createClass({

    // a constructor with initial set states
    constructor(props){
        super(props);
        // temperature state
        this.state.temp = "";
        // button display state
        this.setState({ display: true });
    }

    // a call to fetch weather data via wunderground
    fetchWeatherData = () => {
        // API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
        var url = "http://api.wunderground.com/api/8b06c82a13669c25/conditions/q/UK/London.json";
        $.ajax({
            url: url,
            dataType: "jsonp",
            success : this.parseResponse,
            error : function(req, err){ console.log('API call failed ' + err); }
        });
        // once the data grabbed, hide the button
        this.setState({ display: false });
    };


    /*Notes: < 10 DEG, 3 Layers - Long Sleeve Thermal. Sunny & Rainy -> Soft Ground
     10 - 18, 2 layers - Short Sleeve Thermal. Sunny -> Firm ground/ Blades, Rainy -> Soft Ground
     18> 1 layer - Compression base layer Sunny -> Hard Ground/ Blades, Rainy -> Firm Ground*/


    // the main render method for the iphone component
    render() {
        //Variable declaration
        let topWear;
        let topWearURL;
        let layers;
        let boots;
        let bootsURL = '../../assets/icons/jpeg/studs/soft_ground.png';
        let bottoms = 'Joggers';
        let bottomsURL = '../../assets/icons/jpeg/base layers/Joggers.png';

        //This determines the images to use on the containers (Weather and Kit images)
        //Depending on the condition
        if(this.state.temp < 10){
            topWear = 'Long Sleeve';
            topWearURL = '../../assets/icons/jpeg/base layers/3_Long_sleeve_thermal.png';
            layers = 3;
            boots = 'Soft Ground';
        } else if(this.state.temp >= 10 && this.state.temp <= 18) {
            topWear = 'Short Sleeve';
            topWearURL = '../../assets/icons/jpeg/base layers/2_short_sleeve_thermal.png';
            layers = 2;
            if(this.state.cond != 'Partly Cloudy' || this.state.cond != 'Clear')
                boots = 'Soft Ground';
            else{
                boots = 'Hard Ground/ Blades';
                bootsURL = '../../assets/icons/jpeg/studs/hard_ground.png';
            }
        } else {
            topWear = 'Compression Base';
            topWearURL = '../../assets/icons/jpeg/base layers/compression_base.png';
            layers = 1;
            bottoms = 'Shorts';
            bootsURL = '../../assets/icons/jpeg/studs/firm_ground.png';
            bottomsURL = '../../assets/icons/jpeg/base layers/shorts.png';
            if(this.state.cond != 'Partly Cloudy' || this.state.cond != 'Clear')
                boots = 'Firm Ground';
            else {
                boots = 'Firm Ground/ Blades';
                bootsURL = '../../assets/icons/jpeg/studs/blades.png';
            }
        }

        //Find the date and temp
        layers += ' Layers';
        const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

        //Find next 3 days!
        let now = new Date();
        let day = this.getWeekday(now.getDay());
        let month = this.getMonthString(now.getMonth());
        let date = now.getDate();
        //Get tomorrow and the next three days
        let dummyDate = new Date();
        dummyDate.setDate(dummyDate.getDate() + 1);
        let nextDay = this.getWeekday(dummyDate.getDay());
        dummyDate.setDate(dummyDate.getDate() + 1);
        let dayAfter = this.getWeekday(dummyDate.getDay());
        dummyDate.setDate(dummyDate.getDate() + 1);
        let thirdDay = this.getWeekday(dummyDate.getDay());
        //console.log(document.getElementById("master").style.background);


        let night = '../../assets/icons/jpeg/weather/Night.png';
        let currentCondIcon;
        if(this.state.cond == 'Sunny' || this.state.cond == 'Clear')
            currentCondIcon = '../../assets/icons/jpeg/weather/sunny.png';
        else if(this.state.cond == 'Partly Cloudy'){
            currentCondIcon = '../../assets/icons/jpeg/weather/cloudy_Day.png';
            night = '../../assets/icons/jpeg/weather/cloudy_night.png';
        } else if(this.state.cond == 'Snow')
            currentCondIcon = '../../assets/icons/jpeg/weather/Snow.png';
        else
            currentCondIcon = '../../assets/icons/jpeg/weather/Raining.png';

        // display all weather data
        return (
            <div id="master" class={ style.container }>
                <div id="main">
                    <button class={style.cal} onClick={this.changeToMatch}>Match View</button>
                    <button class={style.cal} onClick={this.handleClick} style={"left: 162px;"}>
                        Login FB
                    </button>
                    <button class={style.cal} style="left: 20px;" onClick={this.changeToKit}>Kit Check</button>

                    <div class={ style.details }></div>
                    <div class={style.rBox}>
                        <div class= { style.header } >
                            <span class={ tempStyles }>{ this.state.temp }</span>
                        </div>
                        <p>{this.state.cond}</p>
                    </div>
                    <div class={style.upperCircle} style={"background-image: url('"+currentCondIcon+"');" +
                    "background-repeat: no-repeat; background-position:50% 50%; background-size: 90%"}>
                    </div>
                    <div class={style.rBoxBottom}>
                        <span class={tempStyles} style={"left: 110px;"}>{this.state.nightTemp}</span>
                        <p style={"left: 85px;"}>{this.state.cond}</p>
                    </div>
                    <div class = {style.lowerCircle} style={"background-image: url('"+night+"');" +
                    "background-repeat: no-repeat; background-position:50% 50%; background-size: 80%"}>

                    </div>
                    <div class= {style.locBox}>
                        <p>{this.state.locate}</p>
                        <p class={style.little}>{day}, {month} {date}</p>
                    </div>

                    <div class={style.sqContainer}>
                        <p>{nextDay}</p>
                        <div class={style.circle} style={"background-image: url('../../assets/icons/jpeg/weather/Raining.png');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 100%"}>
                        </div>
                    </div>

                    <div class={style.sqContainer} style="left:160px;">
                        <p>{dayAfter}</p>
                        <div class={style.circle} style={"background-image: url('../../assets/icons/jpeg/weather/sunny.png');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 70%"}>
                        </div>
                    </div>

                    <div class={style.sqContainer} style="left:270px;">
                        <p>{thirdDay}</p>
                        <div class={style.circle} style={"background-image: url('../../assets/icons/jpeg/weather/cloudy_Day.png');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 100%"}>
                        </div>
                    </div>

                    <div class= { style_iphone.container }>
                        {/*{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/> : null }*/}
                        {this.state.display ? this.fetchWeatherData() : null}
                    </div>
                </div>

                <div id="match" style={"display:none;"}>
                    <header style={"font-weight: bold; font-size:25px;"}>Previous Games Overview</header>
                    <button class={style.cal} onClick={this.backHome}>Back</button>
                    <button class={style.cal} onClick={this.changeBG} style={"left: 162px;"}>
                        Change Background
                    </button>
                    <button class={style.cal} style={"left: 17px;"}>Enter Next Match</button>

                    <div class={matchStyle.boxCont}>
                        <p>Conditions</p>
                        <div class={matchStyle.circle} style={"background-image: url('../../assets/icons/jpeg/weather/Raining.png');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 100%"}>
                        </div>
                        <p style={"bottom: -38px;"}>Partly Cloudy</p>
                    </div>
                    <div class={matchStyle.rBoxLeft}>
                        <span>YouFC Result:</span>
                        <p>5</p>
                    </div>
                    <div class={matchStyle.rBoxRight}>
                        <span style={"left: 60px;"}>OppFC Result:</span>
                        <p>1</p>
                    </div>

                    <div class={matchStyle.boxCont} style={"top: 412px;"}>
                        <p>Conditions</p>
                        <div class={matchStyle.circle} style={"background-image: url('"+currentCondIcon+"');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 80%"}
                        onClick={this.changeToKit}>
                        </div>
                        <p style={"bottom: -38px;"}>{this.state.cond}</p>
                        <p style={"bottom: -150px; left: -110px; width: 350px;"}>
                            From the last couple games, it's clear your team performs better in the Rain.
                        </p>
                    </div>
                    <div class={matchStyle.rBoxLeft} style={"top: 437px;"}>
                        <span style={"bottom: 25px;"}>YouFC Result:</span>
                        <p>3</p>
                    </div>
                    <div class={matchStyle.rBoxRight} style={"top: 437px;"}>
                        <span style={"left: 60px;"}>NotYouFC Result:</span>
                        <p>4</p>
                    </div>
                </div>

                <div id="kit" style={"display:none;"}>
                    <button class={style.cal} onClick={this.backHome}>Back</button>
                    <button class={style.cal} onClick={this.toRecommended} style={"left: 162px;"}>
                        Recommend. Purchases
                    </button>
                    <button class={style.cal} style={"left: 20px;"} onClick={this.changeToNote}>Add Note</button>
                    <header style={"font-weight: bold; font-size:25px;"}>Recommended Kit</header>
                    <div class={kitStyle.sqContainer}>
                        <span>Thermal</span>
                        <div class={kitStyle.circle} style={"background-image: url('"+topWearURL+"');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 80%"}> </div>
                        <p>{topWear} {layers}</p>
                    </div>
                    <div class={kitStyle.sqContainer} style={"left: 145px;"}>
                        <span>Footwear</span>
                        <div class={kitStyle.circle} style={"background-image: url('"+bootsURL+"');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 170%"}> </div>
                        <p>{boots}</p>
                    </div>
                    <div class={kitStyle.sqContainer} style={"left: 275px;"}>
                        <span>Bottoms</span>
                        <div class={kitStyle.circle} style={"background-image: url('"+bottomsURL+"');" +
                        "background-repeat: no-repeat; background-position:50% 50%; background-size: 100%"}>
                        </div>
                        <p>{bottoms}</p>
                    </div>
                    <div class={kitStyle.sqContainer} style={"left: 145px; top: 410px;"}>
                        <span>Training</span>
                        <div class={kitStyle.circle} style={"background-image: url('../../assets/icons/jpeg/base layers/Jacket.png'); " +
                        "background-repeat: no-repeat; " +
                        "background-position:50% 50%; background-size: 80%"}> </div>
                        <p>Jacket</p>
                    </div>
                </div>

                <div id="bg" style={"display:none;"}>
                    <button class={style.cal} onClick={this.changeToMatch}>Back</button>
                    <header style={"font-weight: bold; font-size:25px;"}>Background Upload</header>
                    <div style={"position: absolute; left: 37px; top:350px"}>
                        <form>
                            URL to Image: <input type="file" name="bgURL"/> <br/><br/>
                            <input type="submit" class={style.cal} value="Submit" onClick={this.changeToMatch}/>
                        </form>
                    </div>
                </div>

                <div id="note" style={"display:none;"}>
                    <header style={"font-weight: bold; font-size:25px;"}>Add Note</header>
                    <button class={style.cal} onClick={this.changeToKit}>Back</button>
                    <p style={"position:absolute; top:250px; left:55px;"}>
                        Add a Note for yourself (Automatically Saves)
                    </p>
                    <textarea style={"position:absolute; top:310px; left:100px; width:224px;"} rows="5" cols="40">

                    </textarea>
                </div>
            </div>
        );
    }

    parseResponse = (parsed_json) => {
        let location = parsed_json['current_observation']['display_location']['city'];
        let temp_c = parsed_json['current_observation']['temp_c'];
        let conditions = parsed_json['current_observation']['weather'];
        let lateTemp = temp_c - 5;

        // set states for fields so they could be rendered later on
        this.setState({
            locate : location,
            temp : temp_c,
            cond : conditions,
            nightTemp : lateTemp
        });
    };

    getWeekday(day){ //Translate the day of the week from a number to a String-day
        var weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[day];
    }

    getMonthString(month){ //Translate a numerical month value to a String.
        var months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'];
        return months[month];
    }

    changeToMatch() { //Switch to calendar page
        //let main = document.getElementById("main");
        document.getElementById('main').style.display = "none";
        document.getElementById("match").style.display = "block";
        document.getElementById("kit").style.display = "none";
        document.getElementById("bg").style.display = "none";
        document.getElementById("note").style.display = "none";

    }

    backHome(){ //Switch back home
        document.getElementById("main").style.display = "block";
        document.getElementById("match").style.display = "none";
        document.getElementById("kit").style.display = "none";
        document.getElementById("bg").style.display = "none";
        document.getElementById("note").style.display = "none";

    }

    changeToKit(){ //Switch to kit page
        document.getElementById("main").style.display = "none";
        document.getElementById("match").style.display = "none";
        document.getElementById("kit").style.display = "block";
        document.getElementById("bg").style.display = "none";
        document.getElementById("note").style.display = "none";
    }

    changeBG(){
        //console.log(document.getElementById("master").style.background);
        /*if(document.getElementById("master").style.backgroundImage.toString() === "url('../../assets/backgrounds/footballBG.png')"){
            console.log("Here");
            document.getElementById("master").style.backgroundImage = "url('../../assets/backgrounds/appBG.jpeg')";
        } else {
            console.log("Here Else");
            document.getElementById("master").style.backgroundImage = "url('../../assets/backgrounds/footballBG.png')";
        }*/
        document.getElementById("main").style.display = "none";
        document.getElementById("match").style.display = "none";
        document.getElementById("kit").style.display = "none";
        document.getElementById("bg").style.display = "block";
        document.getElementById("note").style.display = "none";
    }

    changeToNote(){
        document.getElementById("main").style.display = "none";
        document.getElementById("match").style.display = "none";
        document.getElementById("kit").style.display = "none";
        document.getElementById("bg").style.display = "none";
        document.getElementById("note").style.display = "block";
    }

    toRecommended(){
        window.open('https://www.amazon.co.uk/Sportswear-Outdoor-Clothing/b?ie=UTF8&node=116189031');
    }

    //Facebook API stuff!
    componentDidMount() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '281043865661978',
                cookie     : true,  // enable cookies to allow the server to access
                // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.8' // use version 2.1
            });

            // Now that we've initialized the JavaScript SDK, we call
            // FB.getLoginStatus().  This function gets the state of the
            // person visiting this page and can return one of three states to
            // the callback you provide.  They can be:
            //
            // 1. Logged into your app ('connected')
            // 2. Logged into Facebook, but not your app ('not_authorized')
            // 3. Not logged into Facebook and can't tell if they are logged into
            //    your app or not.
            //
            // These three cases are handled in the callback function.
            FB.getLoginStatus(function(response) {
                this.statusChangeCallback(response);
            }.bind(this));
        }.bind(this);

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
/*
    testAPI = function() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
        });
    };
*/

// This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = function(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
        }
    };

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
    checkLoginState = function() {
        FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    };

    handleClick =  function() {
        FB.login(this.checkLoginState);
    };
}