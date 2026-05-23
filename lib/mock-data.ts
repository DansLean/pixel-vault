export type Product = {
  id: number;
  name: string;
  fullName: string;
  price: number;
  rating: number;
  ratingCount: number;
  category: string;
  liked: boolean;
  tags: string[];
};

export type GalleryImage = {
  emoji: string;
  bg: string;
};

export type Author = {
  name: string;
  avatar: string; // emoji
  memberSince: string;
  assetsCount: number;
  followersCount: number;
};

export type Review = {
  id: number;
  author: string;
  avatar: string; // emoji
  rating: number;
  comment: string;
  date: string;
};

export type ProductDetail = Product & {
  creator: Author;
  description: string;
  images: GalleryImage[];
  reviews: Review[];
  license: {
    canDo: string[];
    cannotDo: string[];
  };
  fileFormat: string;
  fileSize: string;
  polygons: string;
  textures: string;
  rigged: boolean;
  animated: boolean;
};

export type Banner = {
  id: number;
  theme: string;
  title: string;
  subtitle: string;
  cta: string;
  discount?: string;
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  accent: string;
  textColor: string;
  badge?: string;
  badgeColor?: string;
  featuredItem?: string;
  featuredPrice?: string;
};

export const MOCK_AUTHOR: Author = {
  name: "VaultStudio3D",
  avatar: "🤖",
  memberSince: "2023",
  assetsCount: 12,
  followersCount: 128,
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "DevIndie",
    avatar: "👩‍💻",
    rating: 5,
    comment:
      "Excelente asset! Economizou muito meu tempo de desenvolvimento, a qualidade é incrível e a licença é bem clara. Recomendo!",
    date: "2 dias atrás",
  },
  {
    id: 2,
    author: "Artista3D",
    avatar: "🎨",
    rating: 4,
    comment:
      "Modelo muito bem feito e otimizado. Tive apenas um pequeno problema com a importação da textura, mas o suporte do criador foi rápido e resolveu.",
    date: "1 semana atrás",
  },
  {
    id: 3,
    author: "GameMakerBR",
    avatar: "🎮",
    rating: 5,
    comment:
      "Perfeito para o meu projeto de simulação. O estilo vintage é exatamente o que eu procurava. Comprarei mais assets deste criador com certeza.",
    date: "3 semanas atrás",
  },
];


export const PRODUCT_DETAIL: ProductDetail = {
  id: 1,
  name: "Locomotiva i...",
  fullName: "Locomotiva Industrial Vintage V1",
  price: 50.0,
  rating: 4.5,
  ratingCount: 131, // 128 + 3 new reviews
  category: "Pacote de Asset",
  creator: MOCK_AUTHOR,
  liked: false,
  tags: ["3D", "2D", "GUI", "Áudio", "Veículo", "Low Poly", "Histórico"],
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta nunc in mi consequat pretium. Nunc in eros ac neque euismod vestibulum. Aliquam convallis tristique turpis, id mattis nisl bibendum quis. Pellentesque non ullamcorper nisl, sed vehicula nisi. Donec elementum blandit quam id interdum. Nulla facilisi. Nullam tincidunt, nisi sit amet vehicula lacinia, lorem neque tempus nisl, ac commodo urna sem a purus. Morbi vel felis tellus. Sed lobortis, elit vitae ultrices fringilla, mauris orci convallis sapien, cursus facilisis augue justo et est. In hac habitasse platea dictumst. Cras at orci lectus.",
  images: [
    { emoji: "🚂", bg: "linear-gradient(135deg, #b8b4b0, #d4d0cc)" },
    { emoji: "🚃", bg: "linear-gradient(135deg, #a0b8c8, #c0d8e8)" },
    { emoji: "🛤️", bg: "linear-gradient(135deg, #b8c8a0, #d8e8c0)" },
    { emoji: "⚙️", bg: "linear-gradient(135deg, #c8b8a0, #e8d8c0)" },
  ],
  reviews: MOCK_REVIEWS,
  license: {
    canDo: [
      "Usar em projetos comerciais",
      "Usar em projetos pessoais",
      "Modificar o asset",
      "Usar em múltiplos projetos",
      "Distribuir junto com um jogo final",
    ],
    cannotDo: [
      "Revender o asset isoladamente",
      "Redistribuir gratuitamente",
      "Reivindicar autoria",
      "Usar em NFTs/IA",
    ],
  },
  fileFormat: "FBX, OBJ, BLEND",
  fileSize: "48 MB",
  polygons: "12.400",
  textures: "4K PBR",
  rigged: false,
  animated: false,
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Locomotiva i...",
    fullName: "Locomotiva Industrial Vintage V1",
    price: 50.0,
    rating: 4.5,
    ratingCount: 131,
    category: "Modelo 3D",
    liked: false,
    tags: ["Veículo", "Histórico", "Low Poly"],
  },
  {
    id: 2,
    name: "Locomotiva i...",
    fullName: "Locomotiva Industrial Vintage V2",
    price: 50.0,
    rating: 5,
    ratingCount: 87,
    category: "Modelo 3D",
    liked: true,
    tags: ["Veículo", "Histórico", "High Poly"],
  },
  {
    id: 3,
    name: "Locomotiva i...",
    fullName: "Locomotiva Industrial Steampunk",
    price: 50.0,
    rating: 4,
    ratingCount: 203,
    category: "Modelo 3D",
    liked: false,
    tags: ["Veículo", "Steampunk", "Animado"],
  },
  {
    id: 4,
    name: "Locomotiva i...",
    fullName: "Locomotiva Imperial Século XIX",
    price: 50.0,
    rating: 5,
    ratingCount: 56,
    category: "Modelo 3D",
    liked: false,
    tags: ["Veículo", "Histórico"],
  },
  {
    id: 5,
    name: "Locomotiva i...",
    fullName: "Locomotiva a Vapor Clássica",
    price: 50.0,
    rating: 4,
    ratingCount: 312,
    category: "Modelo 3D",
    liked: true,
    tags: ["Veículo", "Clássico"],
  },
  {
    id: 6,
    name: "Locomotiva i...",
    fullName: "Locomotiva Mineira Industrial",
    price: 50.0,
    rating: 3,
    ratingCount: 44,
    category: "Modelo 3D",
    liked: false,
    tags: ["Veículo", "Industrial"],
  },
];

export const BANNERS: Banner[] = [
  {
    id: 1,
    theme: "halloween",
    title: "Festa de Halloween",
    subtitle: "Modelos 3D assustadores com preços de arrepiar",
    cta: "Ver Ofertas de Terror",
    discount: "ATÉ 60% OFF",
    bgFrom: "#0d0015",
    bgMid: "#2d0a00",
    bgTo: "#1a0030",
    accent: "#ff6a00",
    textColor: "#fff",
    badge: "EVENTO ESPECIAL",
    badgeColor: "#ff6a00",
    featuredItem: "Pack Criaturas das Trevas",
    featuredPrice: "R$39,90",
  },
  {
    id: 2,
    theme: "summer",
    title: "Promoção de Verão",
    subtitle: "Os melhores modelos 3D para seus projetos criativos",
    cta: "Aproveitar Agora",
    discount: "ATÉ 40% OFF",
    bgFrom: "#001a3a",
    bgMid: "#003d1a",
    bgTo: "##001a2a",
    accent: "#ffd700",
    textColor: "#fff",
    badge: "OFERTA LIMITADA",
    badgeColor: "#ffd700",
    featuredItem: "Coleção Tropical Premium",
    featuredPrice: "R$29,90",
  },
  {
    id: 3,
    theme: "newArrivals",
    title: "Novidades da Semana",
    subtitle: "Explore os modelos mais recentes adicionados ao marketplace",
    cta: "Explorar Catálogo",
    bgFrom: "#000d1a",
    bgMid: "#001a33",
    bgTo: "#0a0020",
    accent: "#00b4ff",
    textColor: "#fff",
    badge: "NOVO",
    badgeColor: "#00b4ff",
    featuredItem: "Pack Sci-Fi Essentials",
    featuredPrice: "R$59,90",
  },
];

export const GENRES = [
  "Todos",
  "Veículos",
  "Personagens",
  "Arquitetura",
  "Natureza",
  "Sci-Fi",
  "Fantasy",
  "Animais",
];

export const SORT_OPTIONS = [
  "Mais Recente",
  "Mais Populares",
  "Preço Menor",
  "Preço Maior",
];

export const PRICE_RANGES = [
  "Todos os Preços",
  "Até R$20",
  "R$20 – R$50",
  "R$50 – R$100",
  "Acima de R$100",
];