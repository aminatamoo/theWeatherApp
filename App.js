//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_KEY } from './secrets/secret.js';

export default function App() {

  const [ lon, setLon ] = useState(-0.118092)
  const [ lat, setLat ] = useState(51.509865)
  const [ weather, setWeather ] = useState(null)
  const [ hourlyMetrics, setHourlyMetrics ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ location, setLocation ] = useState("London")

  const cloudConverter = useCallback( (percent) => {
    switch(true) {
      case (percent >= 0 && percent < 6):
        return "Clear"
      case (percent >= 6  && percent < 26):
        return "Mostly Clear"
      case (percent >= 26  && percent < 51):
        return "Partly Cloudy"
      case (percent >= 51  && percent < 70):
        return "Mostly Cloudy"
      case (percent >= 70):
        return "Very Cloudy"  
      default:
        return "¯\\_(ツ)_/¯"
    }
  }, [])

  const getColors = useCallback( (weatherMain) => {
    switch(true) {
      case (weatherMain == "Drizzle" || weatherMain == "Rain" || weatherMain == "Snow" || weatherMain == "Clouds"):
        return ["#123285", "#E5E5E5"]
      case (weatherMain == "Clear"):
        return ["#DCBA32", "#000000"]
      case (weatherMain == "Thunderstorm" || weatherMain == "Tornado" || weatherMain == "Fog"):
        return ["#000000", "#E5E5E5"]
      default:
        return ["#D02A02", "#000000"]
    }
  }, [])


  useEffect(() => {
    fetchWeather();
  }, [])

  const fetchWeather = useCallback(async () => {
    try {
      let { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
          setErrorMessage('Access to location is needed to run the app')
          return
      }
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude} = location.coords

      setLon(longitude)
      setLat(latitude)

      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,daily,alerts&units=metric&appid=${API_KEY}`
      );
      if (result.ok) {
        const data = await result.json()
        setWeather(data)
      } else {
        setErrorMessage(result.message)
        //alert(JSON.stringify(result))
      }

    } catch (error) {
      alert(error)
    }
  }, [])

  const convertToCity = useCallback( async (longitude, latitude) => {
    try {
      const result = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (result.ok) {
        const data = await result.json()
        setLocation(data.city)
      } else {
        setErrorMessage(result.message)
      }

    } catch (error) {
      alert(error)
      return "London"
    }
  }, [])


  if (weather) {
    const { timezone, current: { dt, temp, feels_like, humidity, wind_speed, weather: [ details ] }, hourly: forecasts } = weather
    const { main, icon } = details
    const hourlyForecasts = forecasts.map(({dt, temp, clouds, humidity}) => ({dt, temp, clouds, humidity}))

    const dateFormat = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/London'
    })

    const timeFormat = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      hour12: true,
      timeZone: 'Europe/London'
    })

    const cityLocation = convertToCity(lon, lat)
    const [ backgroundColor, textColor ] = getColors(main)

    return (
      <View style={[styles.wrapperContainer, {backgroundColor: backgroundColor}]}>
        <View style={[styles.lineOne, {borderColor: textColor}]}/>
        <View style={styles.container}>
          <Text style={[styles.locationStyle, {color: textColor}]}>{location}</Text>
          <Text style={[styles.dateStyle, {color: textColor}]}>{dateFormat.format(new Date(dt * 1e3))}</Text>
          <Text style={[styles.temperature, {color: textColor}]}>{Math.round(temp)}&deg;</Text>
          <View style={styles.descriptionTempRow}>
            <Text style={[styles.descriptionTempText, { textTransform: "capitalize" }, {color: textColor}]}>{main}</Text>
            <Text style={[styles.descriptionTempText, {color: textColor}]}>Feels Like: {Math.round(feels_like)}&deg;</Text>
          </View>
          <View style={styles.windsPrecipRow}>
            <Text style={[styles.windSpeedHum, {color: textColor}]}>Wind Speed: {wind_speed} m/s</Text>
            <Text style={[styles.windSpeedHum, {color: textColor}]}>Humidity: {humidity}%</Text>
          </View>
          <Text style={[styles.hourly, {color: textColor}]}>Hourly</Text>
        </View>
        <View style={[styles.lineTwo, {borderColor: textColor}]}/>
        <View style={{flex:3}}>
          <FlatList
          //contentContainerStyle={{flex:1}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.hourForcastContainer}>
                <Text style={[styles.hourForecast, { textTransform: "uppercase" }, {color: textColor}]}>{timeFormat.format(new Date(item.dt * 1e3))}</Text>
                <Text style={[styles.hourForecast, {color: textColor}]}>{cloudConverter(item.clouds)}</Text>
                <Text style={[styles.hourForecast, {color: textColor}]}>{item.humidity}%</Text>
                <Text style={[styles.hourForecast, {color: textColor}]}>{Math.round(item.temp)}&deg;C</Text>
              </View>
            )}
            data={hourlyForecasts}
          />
        </View>
      </View>
    );
  } else {
    
    return (
      <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Getting the Weather...</Text>
          <StatusBar style="auto" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#D02A02",
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 50,
    fontWeight: "700",
    textAlign: "center",
  },
  lineOne: {
    flex: 1,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    borderBottomWidth: 3,
    //borderColor:'white',
    //borderWidth:2,
  },
  lineTwo: {
    flex: 0.3,
    marginLeft: 25,
    marginRight: 25,
    borderTopWidth: 2,
  },  
  container: {
    flex: 7,
    justifyContent: 'center',
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
    paddingTop: 5,
    marginBottom:5
  },
  descriptionTempRow: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 5,
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
