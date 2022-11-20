import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
const InputAutocomplete = () => {
  // For Main Data
  const [films, setFilms] = useState([]);
  // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([]);
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({});

  useEffect(() => {
    fetch("https://aboutreact.herokuapp.com/getpost.php?offset=1")
      .then((res) => res.json())
      .then((json) => {
        setFilms(json.results);
        //setting the data in the films state
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const findFilm = (query) => {
    // Method called every time when we change the value of the input
    if (query) {
      // Making a case insensitive regular expression
      const regex = new RegExp(`${query.trim()}`, "i");
      // Setting the filtered film array according the query
      setFilteredFilms(films.filter((film) => film.title.search(regex) >= 0));
    } else {
      // If the query is null then return blank
      [];
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          // Data to show in suggestion
          data={filteredFilms}
          // Default value if you want to set something in input
          defaultValue={
            JSON.stringify(selectedValue) === "{}" ? "" : selectedValue.title
          }
          // Onchange of the text changing the state of the query
          // Which will trigger the findFilm method
          // To show the suggestions
          onChangeText={(text) => findFilm(text)}
          placeholder="Enter the film title"
          renderItem={(item) => {
            console.log(item);
            return (
              // For the suggestion view
              <TouchableOpacity
                onPress={() => {
                  setSelectedValue(item);
                  setFilteredFilms([]);
                }}
              >
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.descriptionContainer}>
          {films.length > 0 ? (
            <>
              <Text style={styles.infoText}>Selected Data</Text>
              <Text style={styles.infoText}>
                {JSON.stringify(selectedValue)}
              </Text>
            </>
          ) : (
            <Text style={styles.infoText}>Enter The Film Title</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  autocompleteContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
  },
});
export default InputAutocomplete;
