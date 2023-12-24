import React, {useMemo, useCallback} from 'react';
import {View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import dataSet from '../../data/data.json';

interface BeerData {
  name: string;
  sold: number;
  efficiency: number;
  quality: number;
}

interface LocationData {
  sold: BeerData[];
}

interface DayData {
  day: number;
  month: number;
  year: number;
  locations: LocationData[];
}

interface LineGraphScreenProps {
  route: {
    params: {
      title: string;
      selectedDate: {
        day: number;
        month: number;
        year: number;
      };
    };
  };
  navigation: any;
}

/**
 * React component for displaying a line graph with sales, efficiency, and quality data.
 * @component
 */
const LineGraphScreen: React.FC<LineGraphScreenProps> = ({
  route,
  navigation,
}) => {
  // Use the title to set the screen title dynamically
  const {title, selectedDate, selectedBrands} = route.params;

  let _day = selectedDate.day;
  let _month = selectedDate.month;
  let _year = selectedDate.year;

  React.useLayoutEffect(() => {
    if (title) {
      // Set the title in the header
      navigation.setOptions({
        title: title,
      });
    }
  }, [navigation, title]);

  // Get the data
  const {data} = useMemo(() => dataSet, []); // Memoize the data

  const selectedData = useMemo(() => {
    if (selectedBrands) {
      return data
        .filter(
          (item: DayData) =>
            item.day === _day && item.month === _month && item.year === _year,
        )
        .map((item: DayData) => {
          // For each location, filter the sold items based on selected brands
          const filteredLocations = item.locations.map(location => {
            const filteredBrands = location.sold.filter(beer =>
              selectedBrands.includes(beer.name),
            );
            return {...location, sold: filteredBrands};
          });

          return {...item, locations: filteredLocations};
        })
        .filter(item =>
          item.locations.some(location => location.sold.length > 0),
        );
    } else {
      // If no selected brands, filter only based on selected date
      return data.filter(
        (item: DayData) =>
          item.day === _day && item.month === _month && item.year === _year,
      );
    }
  }, [data, _day, _month, _year, selectedBrands]);

  const parseChartData = useCallback(() => {
    const beerLabels: string[] = [];
    const beerSoldData: number[] = [];
    const efficiencyData: number[] = [];
    const qualityData: number[] = [];

    let selectedBeers = selectedData[0]?.locations.reduce((acc, location) => {
      return acc.concat(location.sold);
    }, [] as BeerData[]);

    // If the title is 'Top5Brand', filter the top 5 brands based on sales
    if (title === 'Top5Brand') {
      selectedBeers = selectedBeers
        .sort((a, b) => b.sold - a.sold) // Sort by sales in descending order
        .slice(0, 5); // Take the top 5 brands
    }

    selectedBeers.forEach(beer => {
      beerLabels.push(beer.name);
      beerSoldData.push(beer.sold);
      efficiencyData.push(beer.efficiency);
      qualityData.push(beer.quality);
    });

    return {
      labels: beerLabels,
      datasets: [
        {
          data: beerSoldData,
          color: (opacity: number = 1) => `rgb(240, 240, 240), ${opacity})`, // White color for sales data
        },
        {
          data: efficiencyData,
          color: (opacity: number = 1) => `rgb(249, 217, 73), ${opacity})`, // Yellow color for efficiency data
        },
        {
          data: qualityData,
          color: (opacity: number = 1) => `rgb(60, 72, 107), ${opacity})`, // Navy color for quality data
        },
      ],
      legend: ['Liters Sold', 'Efficiency', 'Quality'],
    };
  }, [selectedData, title]);

  /**
   * Render the LineGraphScreen component.
   * @returns {JSX.Element} JSX element
   */
  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        alignItems: 'center',
        backgroundColor: '#c53042',
      }}>
      <View>
        <LineChart
          data={parseChartData()}
          width={Dimensions.get('screen').width}
          height={470}
          verticalLabelRotation={75}
          chartConfig={{
            backgroundColor: '#c53042',
            backgroundGradientFrom: '#c53042',
            backgroundGradientTo: '#c53042',

            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity: number = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity: number = 1) =>
              `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#c53042',
            },
            propsForVerticalLabels: {
              fontWeight: 'bold',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

export default LineGraphScreen;
