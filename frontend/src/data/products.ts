import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Laptop Gaming Pro",
    price: 15999000,
    description: "Laptop gaming high-end dengan processor Intel Core i9, RAM 32GB, dan RTX 4080. Sangat cocok untuk gaming dan produktivitas berat.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    category: {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 1,
    stock: 15,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    name: "Smartphone Premium",
    price: 12999000,
    description: "Smartphone flagship dengan kamera 108MP, layar AMOLED 120Hz, dan battery 5000mAh. Performa luar biasa untuk kebutuhan sehari-hari.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    category: {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 1,
    stock: 25,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    name: "Headphone Wireless",
    price: 2499000,
    description: "Headphone premium dengan noise cancellation, battery life 30 jam, dan kualitas audio Hi-Res. Nyaman digunakan seharian.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: {
      id: 2,
      name: "Audio",
      description: "Audio devices and accessories",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 2,
    stock: 50,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    name: "Smartwatch Sport",
    price: 3999000,
    description: "Smartwatch dengan GPS, heart rate monitor, water resistant, dan battery life 7 hari. Perfect untuk tracking aktivitas olahraga.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    category: {
      id: 3,
      name: "Wearables",
      description: "Wearable technology and smart devices",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 3,
    stock: 30,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 5,
    name: "Tablet Pro",
    price: 8999000,
    description: "Tablet dengan layar 11 inch, processor M1, support Apple Pencil. Ideal untuk digital art dan produktivitas.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    category: {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 1,
    stock: 20,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 6,
    name: "Camera Mirrorless",
    price: 18999000,
    description: "Kamera mirrorless dengan sensor APS-C, 4K video recording, dan lensa kit 18-55mm. Perfect untuk photography enthusiast.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    category: {
      id: 4,
      name: "Photography",
      description: "Photography equipment and accessories",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 4,
    stock: 10,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 7,
    name: "Gaming Chair",
    price: 4999000,
    description: "Kursi gaming ergonomis dengan material premium, adjustable armrests, dan lumbar support. Nyaman untuk gaming berjam-jam.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    category: {
      id: 5,
      name: "Furniture",
      description: "Office and gaming furniture",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 5,
    stock: 18,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    price: 1599000,
    description: "Mechanical keyboard RGB dengan hot-swappable switches, aluminum frame, dan customizable backlighting. Perfect untuk typing dan gaming.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    category: {
      id: 6,
      name: "Accessories",
      description: "Computer and gaming accessories",
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    category_id: 6,
    stock: 35,
    is_active: true,
    created_at: "",
    updated_at: ""
  }
];
