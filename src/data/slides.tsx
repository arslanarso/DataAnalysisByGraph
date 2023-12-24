interface Slide {
  id: string;
  image: number;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: '1',
    image: require('../assets/images/1.png'),
    title: 'Analysis charts based on history!',
    subtitle: 'Access detailed analysis charts based on history!',
  },
  {
    id: '2',
    image: require('../assets/images/2.png'),
    title: 'Top 5 Brand Analysis!',
    subtitle: 'See the top 5 selling companies!',
  },
  {
    id: '3',
    image: require('../assets/images/3.png'),
    title: 'Comparative Analysis',
    subtitle: 'Compare 2 companies based on selected date!',
  },
];

export default slides;
