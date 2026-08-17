import flags from '../assets/719127354_1678581333292965_6140154825025333675_n.jpg'
import jesusDiamond from '../assets/711670822_1498815318710237_296133856799874668_n.jpg'
import jesusRope from '../assets/724706106_1540847281152865_1717226992168855156_n.jpg'
import charms from '../assets/724225825_1356486493084801_9195018457218154087_n.jpg'
import ring from '../assets/714063772_1886066698734737_2514804800906085754_n.jpg'
import plaque from '../assets/708450542_4608183346076456_8931785521843580948_n.jpg'

export type CollectionPiece = {
  id: string
  name: string
  kicker: string
  image: string
  status: 'available' | 'made-to-order' | 'coming-soon'
}

export const COLLECTION: CollectionPiece[] = [
  {
    id: 'flags',
    name: 'Checkered Flags',
    kicker: 'Collection 01',
    image: flags,
    status: 'made-to-order',
  },
  {
    id: 'jesus',
    name: 'Jesus Piece',
    kicker: 'Collection 01',
    image: jesusDiamond,
    status: 'made-to-order',
  },
  {
    id: 'jesus-rope',
    name: 'Jesus Piece — Rope',
    kicker: 'Collection 01',
    image: jesusRope,
    status: 'made-to-order',
  },
  {
    id: 'charms',
    name: 'Charm Chain',
    kicker: 'Collection 01',
    image: charms,
    status: 'made-to-order',
  },
  {
    id: 'ring',
    name: 'Pavé Ring',
    kicker: 'Collection 01',
    image: ring,
    status: 'made-to-order',
  },
  {
    id: 'plaque',
    name: 'House Plaque',
    kicker: 'Collection 01',
    image: plaque,
    status: 'made-to-order',
  },
]
