// Global variables for OpenWeatherMap API
const apiKey = '0fc0c6254743be9bcdab1060897df182&units=imperial'; 

// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(zipCode) {
  const baseURL = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;

  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Weather data fetched:', data);
      console.log(data.main);
      // After successfully fetching the weather data, call the function to send it to the backend
      await sendDataToServer('http://localhost:9000/add' ,data); // Await the POST request to ensure completion before updating the UI
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to send the fetched weather data to the backend via POST
async function sendDataToServer(url = '', weatherData = {}) {
  const feelings = document.getElementById('feelings').value;
  const temperature = weatherData.main ? weatherData.main.temp : 'N/A';

  // Create the data object to send to the server
  const dataToSend = {
    temperature: temperature,
    date: new Date().toLocaleDateString(),
    userResponse: feelings,
  };

  try {
    const response = await fetch(url, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const responseData = await response.json();
    console.log(responseData.message); 

    // Now that the data has been successfully added to the backend, Call updateUI to dynamically change the content of the DOM
    await updateUI();
  } catch (error) {
    console.error('Error sending data to server:', error);
  }
}

// Function to retrieve the latest weather data from the backend and update the UI
async function updateUI() {
  try {
    const response = await fetch('http://localhost:9000/weather'); // Fetch data from the backend
    const data = await response.json();

    // Update the DOM with the new data
    document.getElementById('date').innerHTML = `Date: ${data.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${data.temperature}°F`;
    document.getElementById('content').innerHTML = `Feeling: ${data.userResponse}`;

 
  } catch (error) {
    console.error('Error updating UI:', error);
  }
}

// Event listener for the "Generate" button
document.getElementById('generate').addEventListener('click', () => {
  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  
  if (zipCode && feelings) {
    getWeatherData(zipCode);
  } else {
    alert('Please enter a valid zip code and your feelings.');
  }
});