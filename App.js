//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';

const hourlyForecasts = [
  { dt:1606258800, time: "6", forecast: "V. Cloudy", precipitation: "0%", temperature: "15" },
  { dt:1606262400, time: "6", forecast: "¯\\_(ツ)_/¯", precipitation: "0%", temperature: "15" },
  { dt:1606266000, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606269600, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606273200, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276801, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276802, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276803, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276804, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276805, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276806, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276807, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276808, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276809, time: "6", forecast: "clear", precipitation: "0%", temperature: "15" },
  { dt:1606276810, time: "6", forecast: "M. Cloudy", precipitation: "0%", temperature: "15" },
]

const weatherResponse = [
  { dt:"1606258800", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606262400", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606266000", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606269600", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606273200", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276801", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276802", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276803", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276804", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276805", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276806", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276807", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276808", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276809", time: "6", clouds: 90, humidity: "0%", temp: "15" },
  { dt:"1606276810", time: "6", clouds: 90, humidity: "0%", temp: "15" },
]

function formatTime(s, timeZone) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: 'numeric', 
    timeZone: timeZone
  });
  
  return dtFormat.format(new Date(s * 1e3));
}

function cloudConverter(percent) {
  switch(true) {
    case (percent >= 0 && percent < 6):
      return "Clear"  
    case (percent >= 6  && percent < 26):
      return "Mostly Clear"  
    case (percent >= 26  && percent < 51):
      return "Partly Cloudy"  
    case (percent >= 51  && percent < 70):
      return "Mostly Cloudy"  
    case (percent >= 70  && percent < 88):
      return "Very Cloudy"  
    default:
      return "¯\\_(ツ)_/¯"
  }
}

function parseWeatherResponse(weatherResponse) {

  const timeZone = weatherResponse.current.timezone

  const currentTemp = weatherResponse.current.temp
  console.log(currentTemp)

  const mainWeatherDescription = weatherResponse.current.weather.main

  const feelsLike = weatherResponse.current.feels_like
    
  const currentWindSpeed = weatherResponse.current.wind_speed
  console.log(currentWindSpeed)
  
  const currentHumidity = weatherResponse.current.humidity
  console.log(currentHumidity)
  
  const hourlyMetrics =  weatherResponse.hourly.map(({dt, temp, clouds, humidity}) => ({dt, temp, clouds, humidity}))
  
  console.log(hourlyMetrics)
}

export default function App() {

  const [ weatherProperties, setWeatherProperties ] = useState({})

  //const fetchWeatherProperties = useCallback( async (lat,lon,key) => {
  //  const result = await fetch(
  //  'https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=${key}'
  //);
  //const data = await result.json()
  //setWeatherProperties(data)
  //}, [] )


  return (
    <View style={styles.wrapperContainer}>
      <View style={styles.lineOne}/>
      <View style={styles.container}>
        <Text style={styles.locationStyle}>London</Text>
        <Text style={styles.dateStyle}>Tuesday, Nov 24</Text>
        <Text style={styles.temperature}>15&deg;</Text>
        <View style={styles.descriptionTempRow}>
          <Text style={styles.descriptionTempText}>It's Cold</Text>
          <Text style={styles.descriptionTempText}>Feels Like: 12&deg;</Text>
        </View>
        <View style={styles.windsPrecipRow}>
          <Text style={styles.windSpeedHum}>Wind Speed</Text>
          <Text style={styles.windSpeedHum}>Humidity: 67%</Text>
        </View>
        <Text style={styles.hourly}>Hourly</Text>
      </View>
      <View style={styles.lineTwo}/>
      <View style={{flex:3}}>
        <FlatList
        //contentContainerStyle={{flex:1}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.hourForcastContainer}>
              <Text style={styles.hourForecast}>{item.time} PM</Text>
              <Text style={styles.hourForecast}>{item.forecast}</Text>
              <Text style={styles.hourForecast}>{item.precipitation}</Text>
              <Text style={styles.hourForecast}>{item.temperature}&deg;C</Text>
            </View>
          )}
          data={hourlyForecasts}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: "#D02A02",
  },
  lineOne: {
    flex: 1,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    //borderColor:'white',
    //borderWidth:2,
  },
  lineTwo: {
    flex: 0.3,
    marginLeft: 25,
    marginRight: 25,
    borderTopColor: 'black',
    borderTopWidth: 2,
    //borderColor:'white',
    //borderWidth:2,
  },  
  container: {
    flex: 7,
    justifyContent: 'center',
    //borderColor:'white',
    //borderWidth:2,
    marginLeft: 25,
    marginRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  hourForcastContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    marginRight: 25,
    //borderColor:'white',
    //borderWidth:2,
  },
  hourForecast: {
    flex: 1,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  windSpeedHum: {
    flex: 1,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "600",
  },
  hourly: {
    marginBottom: 3,
    fontSize: 17,
    fontWeight: "600",
  },
  temperature: {
    flex: 4,
    fontSize: 200,
    fontWeight: "900",
    paddingTop: 10,
    marginBottom:5
  },
  descriptionTempRow: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 5,
    //paddingLeft: 10,
  },
  descriptionTempText: {
    flex: 1,
    marginBottom: 5,
    fontSize: 25,
    fontWeight: "800",
  },
  windsPrecipRow: {
    flex: 1,
    flexDirection: "row",
    //paddingLeft: 10,
  },
  dateStyle: {
    marginBottom: 8,
    fontSize: 35,
    fontWeight: "400",
  },
  locationStyle: {
    marginBottom: 8,
    marginTop: 8,
    fontSize: 33,
    fontWeight: "800",
  },

});
