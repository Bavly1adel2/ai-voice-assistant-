const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const saveNameButton = document.getElementById('saveName');
const nameInput = document.getElementById('nameInput');
let userName = "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";

// Your OpenWeatherMap API key
const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// Save name when the user clicks 'Save Name'
saveNameButton.addEventListener('click', () => {
    userName = nameInput.value;
    if (userName) {
        speak(`Hello ${userName}, your name is saved! How can I assist you?`);
        wishMe(); // Greet user based on the time of day
    } else {
        speak("Please enter your name.");
    }
});

// Function to handle speech synthesis
function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.rate = 1;
    textSpeak.volume = 1;
    textSpeak.pitch = 1;
    window.speechSynthesis.speak(textSpeak);
}

// Function to greet user based on the time of day
function wishMe() {
    const hour = new Date().getHours();
    if (hour < 12) {
        speak(`Good morning, ${userName}!`);
    } else if (hour < 17) {
        speak(`Good afternoon, ${userName}!`);
    } else {
        speak(`Good evening, ${userName}!`);
    }
}

// Listen for speech result
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    content.textContent = transcript;
    takeCommand(transcript);
};

// Start speech recognition on button click
btn.addEventListener('click', () => {
    if (!userName) {
        speak("Please enter your name first.");
    } else {
        content.textContent = "Listening...";
        recognition.start();
    }
});

// Function to handle commands
function takeCommand(message) {
    if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        speak("Opening Google.");
    } else if (message.includes('weather')) {
        const city = message.split("weather in ")[1]; // Extract city name from command
        if (city) {
            fetchWeather(city);
        } else {
            speak("Please specify a city for the weather.");
        }
    } else if (message.includes('hey') || message.includes('hello')) {
        speak(`Hello, ${userName}! How can I assist you today?`);
    } else {
        speak("Sorry, I didn't understand that. Can you please repeat?");
    }
}

// Function to fetch weather data
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            const temp = data.main.temp;
            const weatherDescription = data.weather[0].description;
            speak(`The current temperature in ${city} is ${temp} degrees Celsius with ${weatherDescription}.`);
        })
        .catch(error => {
            speak("Sorry, I couldn't find the weather for that city.");
        });
}

window.addEventListener('load', () => {
    speak("Initializing J.A.R.V.I.S.");
});
