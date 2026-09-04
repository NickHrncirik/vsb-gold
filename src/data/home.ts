import chapter01 from '../assets/home/chapter-01.jpg'
import chapter02 from '../assets/home/chapter-02.jpg'
import chapter03 from '../assets/home/chapter-03.jpg'
import chapter04 from '../assets/home/chapter-04.jpg'

export const HOME_CHAPTERS = [
  {
    id: 'intro',
    variant: 'brand' as const,
    kicker: 'House of Madness',
    title: '#VSB GOLD',
    body: 'Craft and culture fused into jewelry that means something.',
    image: chapter01,
    imageLeft: true,
  },
  {
    id: 'layer',
    kicker: 'Collection 01',
    title: 'Layered.',
    body: 'Gold with weight. Street and craft in one piece.',
    image: chapter02,
    imageLeft: false,
  },
  {
    id: 'closer',
    kicker: 'Detail',
    title: 'Closer.',
    body: 'Every ridge holds the light. Nothing extra.',
    image: chapter03,
    imageLeft: true,
  },
  {
    id: 'house',
    kicker: 'Form',
    title: 'The house.',
    body: 'Craft and culture fused into jewelry that means something.',
    image: chapter04,
    imageLeft: false,
  },
] as const
