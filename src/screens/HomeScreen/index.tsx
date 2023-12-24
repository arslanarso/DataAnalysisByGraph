import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import dataSet from '../../data/data.json';

/**
 * Home screen component.
 * @param {object} props - React component props.
 * @param {object} props.navigation - React Navigation navigation prop.
 * @returns {JSX.Element} - Home screen JSX element.
 */
const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  /**
   * State to track the selected process.
   */
  const [process, setProcess] = useState<string>('');

  /**
   * State to store the selected date.
   */
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  /**
   * State to store the selected brands for comparison.
   */
  const [selectedBrands, setSelectedBrands] = useState<string[]>('');

  /**
   * Ref for the bottom sheet.
   */
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  /**
   * Ref for the bottom sheet used for brand comparison.
   */
  const bottomSheetRefForCompare = useRef<BottomSheetModal>(null);

  /**
   * Opens the bottom sheet for date selection.
   */
  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  /**
   * Opens the bottom sheet for brand comparison.
   */
  const openBottomSheetForCompare = () => {
    bottomSheetRefForCompare.current?.present();
  };

  /**
   * Handles the selection of a date.
   * @param {number} day - Selected day.
   * @param {number} month - Selected month.
   * @param {number} year - Selected year.
   */
  const handleDateSelection = (day: number, month: number, year: number) => {
    setSelectedDate({day, month, year});
  };

  /**
   * Retrieves all beer brands from the data set.
   * @returns {string[]} - Array of unique beer brands.
   */
  const getAllBeerBrands = (): string[] => {
    const allBrands: string[] = [];
    dataSet.data.forEach(day => {
      day.locations.forEach(location => {
        location.sold.forEach(brand => {
          if (!allBrands.includes(brand.name)) {
            allBrands.push(brand.name);
          }
        });
      });
    });
    return allBrands;
  };

  /**
   * Handles the selection of a date or brand for comparison.
   * @param {number} day - Selected day.
   * @param {number} month - Selected month.
   * @param {number} year - Selected year.
   * @param {string} brandName - Selected brand name.
   */
  const handleSelection = (
    day: number | null,
    month: number | null,
    year: number | null,
    brandName: string | null,
  ) => {
    if (day !== null && month !== null && year !== null) {
      setSelectedDate({day, month, year});
    }

    if (brandName !== null) {
      const isBrandSelected = selectedBrands.includes(brandName);

      if (isBrandSelected) {
        setSelectedBrands(prevBrands =>
          prevBrands.filter(brand => brand !== brandName),
        );
      } else if (selectedBrands.length < 2) {
        setSelectedBrands(prevBrands => [...prevBrands, brandName]);
      }
    }
  };

  /**
   * Handles the confirmation action.
   * Navigates to the LineGraph screen with the selected date.
   */
  const handleConfirm = () => {
    if (selectedDate) {
      navigation.navigate('LineGraph', {
        title: process,
        selectedDate: selectedDate,
      });

      setSelectedDate(null);

      bottomSheetRef.current?.dismiss();
    }
  };

  /**
   * Handles the confirmation action for brand comparison.
   * Navigates to the LineGraph screen with selected date and brands.
   */
  const handleConfirmForCompare = () => {
    if (selectedDate && selectedBrands.length === 2) {
      navigation.navigate('LineGraph', {
        title: process,
        selectedDate,
        selectedBrands,
      });

      setSelectedDate(null);
      setSelectedBrands([]);

      bottomSheetRefForCompare.current?.dismiss();
    } else {
    }
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          backgroundColor: '#c53042',
          height: Dimensions.get('screen').height,
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.header}>
            Welcome to BDA! Please select the action you would like to take
            below.
          </Text>
        </View>
        <View
          style={{
            marginTop: '7%',
            flexDirection: 'row',
            width: Dimensions.get('screen').width,
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            onPress={() => {
              setProcess('BySelectedDate');
              openBottomSheet();
            }}
            style={styles.btn}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/calendar.png')}
            />

            <Text style={styles.btnText}>List by date</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setProcess('Top5Brand');
              openBottomSheet();
            }}
            style={styles.btn}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/calendar.png')}
            />

            <Text style={styles.btnText}> List Top 5 Brands</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setProcess('CompareBrands');
              openBottomSheetForCompare();
            }}
            style={styles.btn}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/calendar.png')}
            />

            <Text style={styles.btnText}> Compare Brands</Text>
          </Pressable>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={[250, 350]}
        backgroundComponent={({style}) => (
          <View style={[style, {flex: 1, backgroundColor: 'white'}]} />
        )}>
        <View style={{padding: 16}}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              Please select a date
            </Text>
          </View>

          <FlatList
            data={dataSet.data}
            keyExtractor={item => `${item.day}-${item.month}-${item.year}`}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  handleDateSelection(item.day, item.month, item.year)
                }
                style={[
                  styles.dateButton,
                  selectedDate &&
                    selectedDate.day === item.day &&
                    selectedDate.month === item.month &&
                    selectedDate.year === item.year && {
                      backgroundColor: '#00d882',
                    },
                ]}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>{`${item.day}/${item.month}/${item.year}`}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedDate
                ? styles.confirmButtonGreen
                : styles.confirmButtonTransparent,
            ]}
            onPress={handleConfirm}>
            <Text
              style={[
                selectedDate
                  ? styles.confirmButtonGreenText
                  : styles.confirmButtonTransparentText,
              ]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetRefForCompare}
        index={0}
        snapPoints={[500]}
        backgroundComponent={({style}) => (
          <View style={[style, {flex: 1, backgroundColor: 'white'}]} />
        )}>
        <View style={{padding: 16}}>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              Please select a date
            </Text>
          </View>
          <FlatList
            data={dataSet.data}
            keyExtractor={item => `${item.day}-${item.month}-${item.year}`}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  handleDateSelection(item.day, item.month, item.year)
                }
                style={[
                  styles.dateButton,
                  selectedDate &&
                    selectedDate.day === item.day &&
                    selectedDate.month === item.month &&
                    selectedDate.year === item.year && {
                      backgroundColor: '#00d882',
                    },
                ]}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>{`${item.day}/${item.month}/${item.year}`}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                marginTop: 10,
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                textAlign: 'center',
              }}>
              Please select two company for compare data
            </Text>
          </View>
          <FlatList
            style={{maxHeight: 200}}
            data={getAllBeerBrands()}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleSelection(null, null, null, item)}
                style={[
                  styles.brandButton,
                  selectedBrands.includes(item) && {backgroundColor: '#00d882'},
                ]}>
                <Text style={{fontWeight: 'bold'}}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[
              selectedDate && selectedBrands.length === 2
                ? styles.confirmButtonGreen
                : styles.confirmButtonTransparent,
            ]}
            onPress={handleConfirmForCompare}>
            <Text
              style={[
                selectedDate && selectedBrands.length === 2
                  ? styles.confirmButtonGreenText
                  : styles.confirmButtonTransparentText,
              ]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: '30%',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn: {
    width: Dimensions.get('screen').width / 3.5,

    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderColor: 'white',
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  btnText: {
    top: 10,

    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  confirmButtonGreen: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#00d882',
  },
  confirmButtonTransparent: {
    backgroundColor: 'transparent',
    color: 'transparent',
  },
  confirmButtonGreenText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#00d882',
  },
  confirmButtonTransparentText: {
    backgroundColor: 'transparent',
    color: 'transparent',
  },
  confirmButton: {},
  brandButton: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
});

export default HomeScreen;
