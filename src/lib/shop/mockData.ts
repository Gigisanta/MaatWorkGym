// ============================================================================
// MOCK DATA — Dataset estático para testing local sin DB
// ============================================================================

import type {
  ShopProduct,
  Category,
  ProductsResponse,
  CategoriesResponse,
  FeaturedResponse,
  ApiResponse,
} from './types';

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: 'cat-protein', name: 'Proteínas', slug: 'protein', icon: '💪', description: 'Proteínas en polvo, barras y más para recuperación muscular', productCount: 8, sortOrder: 1 },
  { id: 'cat-preworkout', name: 'Pre-Entreno', slug: 'pre-workout', icon: '⚡', description: 'Pre-entrenos con cafeína, beta-alanina yarginina', productCount: 4, sortOrder: 2 },
  { id: 'cat-vitamins', name: 'Vitaminas', slug: 'vitamins', icon: '💊', description: 'Vitaminas, minerales y suplementos generales', productCount: 4, sortOrder: 3 },
  { id: 'cat-amino', name: 'Aminoácidos', slug: 'amino-acids', icon: '🔬', description: 'BCAA, glutamina, taurina y otros aminoácidos', productCount: 2, sortOrder: 4 },
  { id: 'cat-fatburner', name: 'Quemadores', slug: 'fat-burners', icon: '🔥', description: 'Termogénicos y quemadores de grasa', productCount: 2, sortOrder: 5 },
];

// ─── Helper to create category ref ─────────────────────────────────────────

const cat = (slug: string): { id: string; name: string; slug: string } => {
  const found = categories.find(c => c.slug === slug)!;
  return { id: found.id, name: found.name, slug: found.slug };
};

// ─── Products ───────────────────────────────────────────────────────────────

export const products: ShopProduct[] = [
  // ═══════════════════════════════════════════════════════
  // PROTEIN — 8 products
  // ═══════════════════════════════════════════════════════
  {
    id: 'prod-001',
    name: 'Whey Protein Isolate 2kg',
    slug: 'whey-protein-isolate-2kg',
    brand: 'Advanced Nutrition',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Proteína aislada de suero de leche 90% purity, baja en lactosa.',
    description: 'Whey Protein Isolate de altísima pureza (90%). Rica en aminoácidos esenciales, de rápida absorción. Ideal para post-entrenamiento. Baja en lactosa y grasas.',
    image: '/images/products/whey-isolate.jpg',
    gallery: ['/images/products/whey-isolate-1.jpg', '/images/products/whey-isolate-2.jpg'],
    tags: ['whey', 'protein', 'muscle recovery', 'low carb'],
    rating: 4.8,
    reviewCount: 342,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['Alta pureza (90% protein)', 'Baja en lactosa', 'Rápida absorción', 'Alto BCAA'],
    ingredients: 'Whey Protein Isolate, Lecitina de girasol, Aromas naturales.',
    directions: 'Mezclar 1 scoop (30g) con 200ml de agua o leche. Tomar post-entrenamiento o como snack proteico.',
    warnings: 'No superar la dosis recomendada. Consulte a su médico si está embarazada o en periodo de lactancia.',
    servingsPerContainer: 66,
    servingSize: '30g (1 scoop)',
    variants: [
      { id: 'var-001-choc', flavor: 'Chocolate', size: '2kg', price: 89990, originalPrice: 114990, stock: 15, sku: 'WPI-CHOC-2K' },
      { id: 'var-001-vain', flavor: 'Vainilla', size: '2kg', price: 89990, originalPrice: 114990, stock: 8, sku: 'WPI-VAIN-2K' },
      { id: 'var-001-fres', flavor: 'Fresa', size: '2kg', price: 89990, originalPrice: 114990, stock: 12, sku: 'WPI-FRES-2K' },
    ],
  },
  {
    id: 'prod-002',
    name: 'Mass Gainer 3kg',
    slug: 'mass-gainer-3kg',
    brand: 'PowerMax',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Ganador de masa muscular con 50g de proteína y 600kcal por porción.',
    description: 'Mass Gainer de alta calorías para quienes buscan ganar peso y volumen muscular. Con 50g de proteína y 600kcal por porción, fortified con creatina y glutamina.',
    image: '/images/products/mass-gainer.jpg',
    gallery: ['/images/products/mass-gainer-1.jpg'],
    tags: ['mass gainer', 'weight gain', 'calories', 'creatine'],
    rating: 4.5,
    reviewCount: 189,
    featured: false,
    bestSeller: true,
    isNew: false,
    benefits: ['600kcal por porción', '50g proteína', 'Con creatina', 'Alto en carbohidratos complejos'],
    ingredients: 'Maltodextrina, Whey Protein Concentrate, Creatina monohidratada, Glutamina, Vitaminas y minerales.',
    directions: 'Mezclar 2 scoops (150g) con 400ml de leche entera. Consumir post-entrenamiento o entre comidas.',
    warnings: 'Contiene lactosa y soja. No suitable para personas con diabetes.',
    servingsPerContainer: 20,
    servingSize: '150g (2 scoops)',
    variants: [
      { id: 'var-002-choc', flavor: 'Chocolate Intenso', size: '3kg', price: 74990, originalPrice: undefined, stock: 22, sku: 'MG-CHOC-3K' },
      { id: 'var-002-vain', flavor: 'Vainilla Crema', size: '3kg', price: 74990, originalPrice: undefined, stock: 14, sku: 'MG-VAIN-3K' },
    ],
  },
  {
    id: 'prod-003',
    name: 'Whey Protein Concentrate 1kg',
    slug: 'whey-protein-concentrate-1kg',
    brand: 'EssentialSports',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'WPC 80% con excelente sabor y textura. El más vendido.',
    description: 'Whey Protein Concentrate 80% de pureza. Relación calidad-precio inmejorable. Textura suave, sabores intensos. Ideal para uso diario.',
    image: '/images/products/wpc-1kg.jpg',
    gallery: ['/images/products/wpc-1kg-1.jpg'],
    tags: ['whey', 'protein', 'daily use', 'value'],
    rating: 4.6,
    reviewCount: 567,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['80% pureza', 'Excelente sabor', 'Textura suave', 'Precio accesible'],
    ingredients: 'Whey Protein Concentrate (80%), Aromas, Edulcorantes naturales, Lecitina de girasol.',
    directions: 'Mezclar 1 scoop (30g) con 200ml de agua. Dos veces al día, post-entrenamiento y como snack.',
    servingsPerContainer: 33,
    servingSize: '30g (1 scoop)',
    variants: [
      { id: 'var-003-choc', flavor: 'Chocolate', size: '1kg', price: 42990, originalPrice: 54990, stock: 45, sku: 'WPC-CHOC-1K' },
      { id: 'var-003-vain', flavor: 'Vainilla', size: '1kg', price: 42990, originalPrice: 54990, stock: 38, sku: 'WPC-VAIN-1K' },
      { id: 'var-003-gall', flavor: 'Galleta', size: '1kg', price: 44990, originalPrice: 54990, stock: 20, sku: 'WPC-GALL-1K' },
      { id: 'var-003-ddl', flavor: 'Dulce de Leche', size: '1kg', price: 44990, originalPrice: undefined, stock: 18, sku: 'WPC-DDL-1K' },
    ],
  },
  {
    id: 'prod-004',
    name: 'Caseína Micelar 2lb',
    slug: 'caseina-micelar-2lb',
    brand: 'Advanced Nutrition',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Caseína micelar de absorción lenta. Ideal para consumo antes de dormir.',
    description: 'Caseína micelar de primera calidad. Absorción lenta (hasta 7 horas), proporciona liberación sostenida de aminoácidos mientras dormís. Perfecta como último alimento del día.',
    image: '/images/products/casein.jpg',
    gallery: ['/images/products/casein-1.jpg'],
    tags: ['casein', 'slow release', 'night', 'bedtime'],
    rating: 4.7,
    reviewCount: 156,
    featured: false,
    bestSeller: false,
    isNew: true,
    benefits: ['Absorción hasta 7 horas', 'Alta en glutamina', 'Ideal pre-sueño', 'Menos哄水肿'],
    ingredients: 'Caseína Micelar, Goma Xanthana, Aromas, Edulcorantes.',
    directions: 'Mezclar 2 scoops (40g) con 250ml de agua o leche. Consumir 30 min antes de dormir.',
    warnings: 'No usar como sustituto de una comida completa.',
    servingsPerContainer: 25,
    servingSize: '40g (2 scoops)',
    variants: [
      { id: 'var-004-choc', flavor: 'Chocolate', size: '2lb (900g)', price: 63990, originalPrice: undefined, stock: 10, sku: 'CASEIN-CHOC-2L' },
      { id: 'var-004-vain', flavor: 'Vainilla', size: '2lb (900g)', price: 63990, originalPrice: undefined, stock: 7, sku: 'CASEIN-VAIN-2L' },
      { id: 'var-004-fres', flavor: 'Fresa', size: '2lb (900g)', price: 63990, originalPrice: undefined, stock: 5, sku: 'CASEIN-FRES-2L' },
    ],
  },
  {
    id: 'prod-005',
    name: 'Iso Zero 1.5kg — Sin sabor',
    slug: 'iso-zero-1-5kg',
    brand: 'PureProtein',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Isolate 95% sin sabor, sin endulzantes. Para agregar a recetas.',
    description: 'Whey Isolate 95% sin sabor, sin azúcar, sin endulzantes. Libre de gluten y lactosa. Perfecto para agregar a avena, pancakes, battidos o recetas de cocina fitness.',
    image: '/images/products/iso-zero.jpg',
    gallery: ['/images/products/iso-zero-1.jpg'],
    tags: ['whey', 'isolate', 'unsweetened', 'cooking', 'lactose free'],
    rating: 4.9,
    reviewCount: 98,
    featured: false,
    bestSeller: false,
    isNew: true,
    benefits: ['95% proteína', 'Sin sabor', 'Sin endulzantes', 'Lactosa free'],
    ingredients: 'Whey Protein Isolate 95%.',
    directions: 'Agregar 1 scoop (25g) a tus recetas favoritas. Puede mezclarse con agua, leche o jugos.',
    servingsPerContainer: 60,
    servingSize: '25g (1 scoop)',
    variants: [
      { id: 'var-005-1kg', flavor: 'Natural', size: '1.5kg', price: 58990, originalPrice: undefined, stock: 25, sku: 'ISOZERO-NAT-15K' },
      { id: 'var-005-500', flavor: 'Natural', size: '500g', price: 24990, originalPrice: undefined, stock: 30, sku: 'ISOZERO-NAT-500' },
    ],
  },
  {
    id: 'prod-006',
    name: 'Protein Bar x12 unidades',
    slug: 'protein-bar-x12',
    brand: 'FitBar',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Barras proteicas con 20g de proteína. Sabor chocolate negro.',
    description: 'Barras proteicas de chocolate negro con 20g de proteína de alta calidad. Con fibers prebióticas, sin aceite de palma. Snacking inteligente para antes o después del gym.',
    image: '/images/products/protein-bar.jpg',
    gallery: ['/images/products/protein-bar-1.jpg'],
    tags: ['bar', 'snack', 'protein', 'chocolate'],
    rating: 4.4,
    reviewCount: 223,
    featured: false,
    bestSeller: true,
    isNew: false,
    benefits: ['20g proteína por barra', 'Con fibra prebiótica', 'Sin aceite de palma', 'Pack x12'],
    ingredients: 'Proteína de leche, Chocolate negro (70%), Oligofructosa, Goma arábiga, Sal marina.',
    directions: 'Consumir 1 barra como snack entre comidas o post-entrenamiento.',
    warnings: 'Contiene derivados de leche y soja. Puede contener trazas de maní y frutos secos.',
    servingsPerContainer: 12,
    servingSize: '1 barra (60g)',
    variants: [
      { id: 'var-006-choc', flavor: 'Chocolate Negro', size: 'x12', price: 32990, originalPrice: 39990, stock: 40, sku: 'PBAR-CHOC-12' },
      { id: 'var-006-cac', flavor: 'Cacao y Naranja', size: 'x12', price: 32990, originalPrice: 39990, stock: 25, sku: 'PBAR-CAC-12' },
    ],
  },
  {
    id: 'prod-007',
    name: 'Whey Hydrolyzed 2kg',
    slug: 'whey-hydrolyzed-2kg',
    brand: 'EliteSeries',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Proteína hidrolizada de absorción ultra-rápida. Para competidores.',
    description: 'Whey Protein Hidrolizada de grado farmacéutico. Pre-digerida para absorción inmediata. Ideal para competidores y atletas avanzados que requieren máxima velocidad de recuperación.',
    image: '/images/products/hydro-whey.jpg',
    gallery: ['/images/products/hydro-whey-1.jpg'],
    tags: ['hydrolyzed', 'whey', 'competition', 'fast absorption'],
    rating: 4.9,
    reviewCount: 87,
    featured: true,
    bestSeller: false,
    isNew: false,
    benefits: ['Absorción ultra-rápida', 'Grado farmacéutico', 'Pre-digerida', '0g azúcar'],
    ingredients: 'Whey Protein Hidrolizada, Lecitina de girasol.',
    directions: 'Mezclar 1 scoop (30g) con 150ml de agua helada. Consumir inmediatamente post-entrenamiento.',
    warnings: 'Consultar con médico si tiene problemas renales.',
    servingsPerContainer: 66,
    servingSize: '30g (1 scoop)',
    variants: [
      { id: 'var-007-choc', flavor: 'Chocolate', size: '2kg', price: 129990, originalPrice: 159990, stock: 6, sku: 'HYDRO-CHOC-2K' },
      { id: 'var-007-vain', flavor: 'Vainilla', size: '2kg', price: 129990, originalPrice: 159990, stock: 4, sku: 'HYDRO-VAIN-2K' },
    ],
  },
  {
    id: 'prod-008',
    name: 'Vegetal Protein 1kg — Garbanzo y Arveja',
    slug: 'vegetal-protein-1kg',
    brand: 'PlantPower',
    category: cat('protein'),
    categoryId: 'cat-protein',
    shortDescription: 'Proteína vegetal 100% orgánica. Sin gluten, sin soja.',
    description: 'Blend de proteína de garbanzo y arveja, 75% pureza. 100% vegetal, orgánica, sin gluten ni soja. Rica en fibra y hierro. Ideal para veganos y quienes buscan alternativas vegetales.',
    image: '/images/products/vegetal-protein.jpg',
    gallery: ['/images/products/vegetal-protein-1.jpg'],
    tags: ['vegan', 'plant based', 'organic', 'gluten free'],
    rating: 4.3,
    reviewCount: 64,
    featured: false,
    bestSeller: false,
    isNew: true,
    benefits: ['100% vegetal', 'Orgánico certificado', 'Sin gluten', 'Alto en hierro'],
    ingredients: 'Proteína de Garbanzo orgánica, Proteína de Arveja orgánica, Goma de acacia.',
    directions: 'Mezclar 1 scoop (30g) con 200ml de bebida vegetal. Agitar bien.',
    warnings: 'No superar las 3 porciones diarias.',
    servingsPerContainer: 33,
    servingSize: '30g (1 scoop)',
    variants: [
      { id: 'var-008-nat', flavor: 'Natural', size: '1kg', price: 47990, originalPrice: undefined, stock: 18, sku: 'VEG-NAT-1K' },
      { id: 'var-008-cac', flavor: 'Cacao', size: '1kg', price: 49990, originalPrice: undefined, stock: 12, sku: 'VEG-CAC-1K' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PRE-WORKOUT — 4 products
  // ═══════════════════════════════════════════════════════
  {
    id: 'prod-009',
    name: 'Pre-Workout Explosion 300g',
    slug: 'pre-workout-explosion-300g',
    brand: 'PumpFuel',
    category: cat('pre-workout'),
    categoryId: 'cat-preworkout',
    shortDescription: 'Pre-entreno con 200mg cafeína + beta-alanina. Efecto explosivo.',
    description: 'Pre-entreno de alta intensidad con 200mg cafeína anhidra, 3g beta-alanina, 3g arginina y 2g citrulina. Máxima energía, enfoque mental y pump muscular.',
    image: '/images/products/preworkout.jpg',
    gallery: ['/images/products/preworkout-1.jpg'],
    tags: ['pre-workout', 'caffeine', 'pump', 'energy'],
    rating: 4.7,
    reviewCount: 289,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['200mg cafeína', '3g beta-alanina', 'Pump muscular', 'Enfoque mental'],
    ingredients: 'Beta-alanina, Arginina AKG, Citrulina malato, Cafeína anhidra, Taurina, Vitaminas B6 y B12.',
    directions: 'Disolver 1 scoop (15g) en 200ml de agua. Consumir 20-30 min antes del entrenamiento. No tomar después de las 18h.',
    warnings: 'Contiene cafeína (200mg). No recomendado para menores de 18 años, embarazadas o personas sensibles a la cafeína.',
    servingsPerContainer: 20,
    servingSize: '15g (1 scoop)',
    variants: [
      { id: 'var-009-frut', flavor: 'Frutal Fusion', size: '300g', price: 38990, originalPrice: undefined, stock: 30, sku: 'PRE-FRUT-300' },
      { id: 'var-009-cit', flavor: 'Cítrico Energy', size: '300g', price: 38990, originalPrice: undefined, stock: 25, sku: 'PRE-CIT-300' },
      { id: 'var-009-Uva', flavor: 'Uva', size: '300g', price: 38990, originalPrice: undefined, stock: 20, sku: 'PRE-UVA-300' },
    ],
  },
  {
    id: 'prod-010',
    name: 'Caffeinated Pre-Workout 500g',
    slug: 'caffeinated-pre-workout-500g',
    brand: 'PowerMax',
    category: cat('pre-workout'),
    categoryId: 'cat-preworkout',
    shortDescription: 'Con 350mg cafeína extended release. Para entrenamientos largos.',
    description: 'Pre-entreno con cafeína de liberación progresiva (350mg). Efecto sostenído sin crash. Con betanina por nitratos naturales para pump máximo.',
    image: '/images/products/caffeinated-pre.jpg',
    gallery: ['/images/products/caffeinated-pre-1.jpg'],
    tags: ['pre-workout', 'caffeine', 'extended release', 'long training'],
    rating: 4.6,
    reviewCount: 145,
    featured: false,
    bestSeller: false,
    isNew: false,
    benefits: ['350mg cafeína ER', 'Efecto sostenído', 'Betanina natural', 'Sin crash'],
    ingredients: 'Cafeína anhidra (extended release), Beta-alanina, Citrulina malato, Betanina (de remolacha), Taurina.',
    directions: 'Tomar 1 scoop (20g) con 250ml de agua 30 min antes. No exceder 1 porción diaria.',
    warnings: 'Alto contenido de cafeína. Evitar si es sensible o tiene problemas cardíacos.',
    servingsPerContainer: 25,
    servingSize: '20g (1 scoop)',
    variants: [
      { id: 'var-010-limon', flavor: 'Limón', size: '500g', price: 52990, originalPrice: 64990, stock: 15, sku: 'CPRE-LIM-500' },
      { id: 'var-010-naran', flavor: 'Naranja', size: '500g', price: 52990, originalPrice: 64990, stock: 12, sku: 'CPRE-NAR-500' },
    ],
  },
  {
    id: 'prod-011',
    name: 'Stim-Free Pre-Workout 250g',
    slug: 'stim-free-pre-workout-250g',
    brand: 'NaturalForce',
    category: cat('pre-workout'),
    categoryId: 'cat-preworkout',
    shortDescription: 'Pre-entreno sin estimulantes. Ideal para entrenar de noche.',
    description: 'Pre-entreno 100% libre de cafeína y estimulantes. Con citrulina, arginina y nitratos de remolacha para pump sin alterarte. Perfecto para entrenar a la noche.',
    image: '/images/products/stimfree-pre.jpg',
    gallery: ['/images/products/stimfree-pre-1.jpg'],
    tags: ['pre-workout', 'stim free', 'no caffeine', 'night workout'],
    rating: 4.5,
    reviewCount: 112,
    featured: false,
    bestSeller: false,
    isNew: true,
    benefits: ['0mg cafeína', 'Pump natural', 'Sin alterarse', 'Ideal de noche'],
    ingredients: 'Citrulina malato, Arginina AKG, Nitratos de remolacha, Glicina, Taurina.',
    directions: 'Mezclar 1 scoop (15g) con 250ml de agua. Consumir 20-30 min antes del entrenamiento.',
    warnings: 'Consultar con médico si toma medicación antihipertensiva.',
    servingsPerContainer: 16,
    servingSize: '15g (1 scoop)',
    variants: [
      { id: 'var-011-frut', flavor: 'Frutos Rojos', size: '250g', price: 31990, originalPrice: undefined, stock: 20, sku: 'SFRE-FRUT-250' },
      { id: 'var-011-manz', flavor: 'Manzana Verde', size: '250g', price: 31990, originalPrice: undefined, stock: 18, sku: 'SFRE-MANZ-250' },
    ],
  },
  {
    id: 'prod-012',
    name: 'Intra-Workout Pump 400g',
    slug: 'intra-workout-pump-400g',
    brand: 'PumpFuel',
    category: cat('pre-workout'),
    categoryId: 'cat-preworkout',
    shortDescription: 'Tomalo durante el entrenamiento.维持泵感 y resistencia.',
    description: 'Intra-workout con aminoácidos de cadena ramificada (BCAA 2:1:1), glutamina y citrulina. Mantené el pump y evitá el catabolismo muscular durante sesiones largas.',
    image: '/images/products/intra-workout.jpg',
    gallery: ['/images/products/intra-workout-1.jpg'],
    tags: ['intra-workout', 'bcaa', 'glutamine', 'endurance'],
    rating: 4.4,
    reviewCount: 78,
    featured: false,
    bestSeller: false,
    isNew: false,
    benefits: ['BCAA 2:1:1', '5g glutamina', 'Citrulina', 'Anticatabólico'],
    ingredients: 'L-Leucina, L-Isoleucina, L-Valina, L-Glutamina, Citrulina malato, Electrolitos.',
    directions: 'Disolver 2 scoops (20g) en 500ml de agua. Beber durante el entrenamiento a sorbos.',
    servingsPerContainer: 20,
    servingSize: '20g (2 scoops)',
    variants: [
      { id: 'var-012-uva', flavor: 'Uva', size: '400g', price: 35990, originalPrice: undefined, stock: 14, sku: 'INTRA-UVA-400' },
      { id: 'var-012-cit', flavor: 'Cítrico', size: '400g', price: 35990, originalPrice: undefined, stock: 10, sku: 'INTRA-CIT-400' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // VITAMINS — 4 products
  // ═══════════════════════════════════════════════════════
  {
    id: 'prod-013',
    name: 'Multivitamínico Daily 90 tabs',
    slug: 'multivitaminico-daily-90tabs',
    brand: 'VitaCore',
    category: cat('vitamins'),
    categoryId: 'cat-vitamins',
    shortDescription: 'Multivitamínico completo con 23 vitaminas y minerales.',
    description: 'Multivitamínico diario con todas las vitaminas esenciales (A, C, D, E, K, B-complex) y minerales (zinc, magnesio, selenio, hierro). 1 toma diaria con las comidas.',
    image: '/images/products/multivit.jpg',
    gallery: ['/images/products/multivit-1.jpg'],
    tags: ['multivitamin', 'daily', 'minerals', 'health'],
    rating: 4.8,
    reviewCount: 432,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['23 vitaminas y minerales', '1 toma diaria', 'Envase para 3 meses', 'Libre de gluten'],
    ingredients: 'Vitamina A, C, D3, E, K, B1, B2, B3, B5, B6, B7, B9, B12, Zinc, Magnesio, Hierro, Selenio, Cromo.',
    directions: 'Tomar 1 tableta con el desayuno. No masticar.',
    warnings: 'No superar la dosis recomendada. Consulte a su médico si está embarazada o en tratamiento médico.',
    servingsPerContainer: 90,
    servingSize: '1 tableta',
    variants: [
      { id: 'var-013-90', flavor: 'Sin sabor', size: '90 tabs', price: 24990, originalPrice: 29990, stock: 60, sku: 'MULTI-90' },
      { id: 'var-013-180', flavor: 'Sin sabor', size: '180 tabs', price: 44990, originalPrice: 54990, stock: 35, sku: 'MULTI-180' },
    ],
  },
  {
    id: 'prod-014',
    name: 'Vitamina D3 + K2 — 120 softgels',
    slug: 'vitamina-d3-k2-120-softgels',
    brand: 'BoneHealth',
    category: cat('vitamins'),
    categoryId: 'cat-vitamins',
    shortDescription: 'Vitamina D3 5000UI con K2 MK-7 para absorción ósea óptima.',
    description: 'Combinación sinérgica de Vitamina D3 (5000UI) y K2 MK-7 (menaquinona-7) para máxima absorción del calcio en huesos. Esencial para atletas y personas con poca exposición solar.',
    image: '/images/products/d3-k2.jpg',
    gallery: ['/images/products/d3-k2-1.jpg'],
    tags: ['vitamin d3', 'vitamin k2', 'bones', 'calcium'],
    rating: 4.9,
    reviewCount: 267,
    featured: false,
    bestSeller: true,
    isNew: false,
    benefits: ['5000UI D3', 'K2 MK-7 natural', 'Salud ósea', 'Sin conservantes'],
    ingredients: 'Vitamina D3 (colecalciferol), Vitamina K2 (menaquinona-7 MK-7), Aceite de oliva virgen extra.',
    directions: 'Tomar 1 softgel con una comida que contenga grasas.',
    warnings: 'Consultar con médico si toma anticoagulantes.',
    servingsPerContainer: 120,
    servingSize: '1 softgel',
    variants: [
      { id: 'var-014-120', flavor: 'Sin sabor', size: '120 softgels', price: 37990, originalPrice: undefined, stock: 45, sku: 'D3K2-120' },
    ],
  },
  {
    id: 'prod-015',
    name: 'Magnesio Quelato 180 caps',
    slug: 'magnesio-quelato-180-caps',
    brand: 'VitaCore',
    category: cat('vitamins'),
    categoryId: 'cat-vitamins',
    shortDescription: 'Magnesio quelado de alta biodisponibilidad. 400mg por dosis.',
    description: 'Magnesio en forma quelada (bisglicinato) para máxima absorción intestinal. 400mg de magnesio elemental por cápsula. Ayuda con calambres, fatiga y recuperación muscular.',
    image: '/images/products/magnesio.jpg',
    gallery: ['/images/products/magnesio-1.jpg'],
    tags: ['magnesium', 'muscle cramps', 'recovery', 'sleep'],
    rating: 4.7,
    reviewCount: 198,
    featured: false,
    bestSeller: false,
    isNew: false,
    benefits: ['400mg Mg elemental', 'Quelado (alta absorción)', 'Anti-calambres', 'Mejora el sueño'],
    ingredients: 'Magnesio bisglicinato, Cápsula: celulosa vegetal.',
    directions: 'Tomar 2 cápsulas antes de dormir. Máxima tolerancia gastrointestinal.',
    warnings: 'Consultar con médico si tiene problemas renales.',
    servingsPerContainer: 90,
    servingSize: '2 cápsulas (800mg)',
    variants: [
      { id: 'var-015-180', flavor: 'Sin sabor', size: '180 caps', price: 29990, originalPrice: 34990, stock: 50, sku: 'MAG-180' },
      { id: 'var-015-90', flavor: 'Sin sabor', size: '90 caps', price: 17990, originalPrice: undefined, stock: 40, sku: 'MAG-90' },
    ],
  },
  {
    id: 'prod-016',
    name: 'Omega 3 Premium 180 caps',
    slug: 'omega-3-premium-180-caps',
    brand: 'SeaGold',
    category: cat('vitamins'),
    categoryId: 'cat-vitamins',
    shortDescription: 'EPA 660mg + DHA 440mg de aceite de pescado salvaje. Triglicéridos.',
    description: 'Omega 3 de grado farmacéutico con 1100mg de EPA+DHA por porción. Aceite de pescado salvaje de aguas frías, purificado y libre de metales pesados. Forma de triglicéridos para mejor absorción.',
    image: '/images/products/omega3.jpg',
    gallery: ['/images/products/omega3-1.jpg'],
    tags: ['omega 3', 'fish oil', 'heart health', 'anti-inflammatory'],
    rating: 4.8,
    reviewCount: 321,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['1100mg EPA+DHA', 'Grado farmacéutico', 'Libre de mercurio', 'Triglicéridos'],
    ingredients: 'Aceite de pez ancho (sardina y anchova), Vitamina E natural (d-alfa tocoferol).',
    directions: 'Tomar 2 softgels con el almuerzo y 2 con la cena.',
    warnings: 'Si toma anticoagulantes, consultar médico antes de usar.',
    servingsPerContainer: 90,
    servingSize: '2 softgels',
    variants: [
      { id: 'var-016-180', flavor: 'Sin sabor', size: '180 caps', price: 45990, originalPrice: 57990, stock: 28, sku: 'O3-180' },
      { id: 'var-016-90', flavor: 'Sin sabor', size: '90 caps', price: 26990, originalPrice: undefined, stock: 35, sku: 'O3-90' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // AMINO ACIDS — 2 products
  // ═══════════════════════════════════════════════════════
  {
    id: 'prod-017',
    name: 'BCAA 2:1:1 — 300g',
    slug: 'bcaa-2-1-1-300g',
    brand: 'AminoMax',
    category: cat('amino-acids'),
    categoryId: 'cat-amino',
    shortDescription: 'Aminoácidos ramificados 2:1:1 con 5g por dosis. Libre de azúcar.',
    description: 'BCAA en ratio óptimo 2:1:1 (leucina:isoleucina:valina) con 5g por scoop. Previene el catabolismo muscular, reduce fatiga y mejora la recuperación. Sin azúcar, sin calorías.',
    image: '/images/products/bcaa.jpg',
    gallery: ['/images/products/bcaa-1.jpg'],
    tags: ['bcaa', 'branched chain', 'catabolism', 'recovery'],
    rating: 4.6,
    reviewCount: 254,
    featured: false,
    bestSeller: true,
    isNew: false,
    benefits: ['5g BCAA por dosis', 'Ratio 2:1:1', '0 azúcar', '0 calorías'],
    ingredients: 'L-Leucina, L-Isoleucina, L-Valina, Acidulante (ácido cítrico), Aromas, Edulcorantes.',
    directions: 'Mezclar 1 scoop (7g) con 300ml de agua. Consumir antes, durante o después del entrenamiento.',
    servingsPerContainer: 42,
    servingSize: '7g (1 scoop)',
    variants: [
      { id: 'var-017-uva', flavor: 'Uva', size: '300g', price: 27990, originalPrice: undefined, stock: 35, sku: 'BCAA-UVA-300' },
      { id: 'var-017-cit', flavor: 'Cítrico', size: '300g', price: 27990, originalPrice: undefined, stock: 30, sku: 'BCAA-CIT-300' },
      { id: 'var-017-frut', flavor: 'Frutilla', size: '300g', price: 27990, originalPrice: undefined, stock: 22, sku: 'BCAA-FRUT-300' },
    ],
  },
  {
    id: 'prod-018',
    name: 'L-Glutamina 500g',
    slug: 'l-glutamina-500g',
    brand: 'AminoMax',
    category: cat('amino-acids'),
    categoryId: 'cat-amino',
    shortDescription: 'L-Glutamina pura 100% para recuperación post-entrenamiento.',
    description: 'L-Glutamina pura USP grado farmacéutico. 5g por scoop. El aminoácido más abundante en el cuerpo, esencial para recuperación muscular, función inmune y salud intestinal.',
    image: '/images/products/glutamina.jpg',
    gallery: ['/images/products/glutamina-1.jpg'],
    tags: ['glutamine', 'recovery', 'immune', 'gut health'],
    rating: 4.7,
    reviewCount: 143,
    featured: false,
    bestSeller: false,
    isNew: false,
    benefits: ['5g L-Glutamina pura', 'Grado USP', 'Recuperación muscular', 'Salud intestinal'],
    ingredients: 'L-Glutamina pura.',
    directions: 'Mezclar 1 scoop (5g) con 200ml de agua o jugo. Post-entrenamiento y antes de dormir.',
    warnings: 'Consultar con médico si tiene problemas hepáticos o renales.',
    servingsPerContainer: 100,
    servingSize: '5g (1 scoop)',
    variants: [
      { id: 'var-018-500', flavor: 'Sin sabor', size: '500g', price: 22990, originalPrice: 27990, stock: 25, sku: 'GLUT-500' },
      { id: 'var-018-250', flavor: 'Sin sabor', size: '250g', price: 13990, originalPrice: undefined, stock: 40, sku: 'GLUT-250' },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // FAT BURNERS — 2 products
  // ═══════════════════════════════════════════════════════
  {
    id: 'prod-019',
    name: 'Termogénico Clásico 90 caps',
    slug: 'termogenico-clasico-90caps',
    brand: 'BurnMax',
    category: cat('fat-burners'),
    categoryId: 'cat-fatburner',
    shortDescription: 'Termogénico con guaraná, té verde y café verde. 200mg cafeína.',
    description: 'Termogénico clásico con triple acción: guaraná (150mg cafeína), té verde (EGCG) y café verde (ácido clorogénico). Aumenta el metabolismo basal y la termogénesis.',
    image: '/images/products/termogenico.jpg',
    gallery: ['/images/products/termogenico-1.jpg'],
    tags: ['fat burner', 'thermogenic', 'green tea', 'guarana'],
    rating: 4.4,
    reviewCount: 187,
    featured: true,
    bestSeller: true,
    isNew: false,
    benefits: ['Guaraná + Té verde + Café verde', '200mg cafeína natural', 'Aumenta metabolismo', 'Termogénesis'],
    ingredients: 'Extracto de Guaraná (150mg cafeína), Extracto de Té Verde (EGCG), Extracto de Café Verde, L-Carnitina, Pimienta negra.',
    directions: 'Tomar 2 cápsulas antes del desayuno y 1 antes del almuerzo. No tomar después de las 16h.',
    warnings: 'No recomendado para personas sensibles a la cafeína, con problemas cardíacos o hipertensión. No usar con otros productos con cafeína.',
    servingsPerContainer: 45,
    servingSize: '3 cápsulas',
    variants: [
      { id: 'var-019-90', flavor: 'Sin sabor', size: '90 caps', price: 31990, originalPrice: 39990, stock: 20, sku: 'BURN-90' },
    ],
  },
  {
    id: 'prod-020',
    name: 'L-Carnitine 3000mg — 20 ampollas',
    slug: 'l-carnitine-3000mg-20-ampollas',
    brand: 'LeanPro',
    category: cat('fat-burners'),
    categoryId: 'cat-fatburner',
    shortDescription: 'L-Carnitina líquida 3000mg por ampolla. Máxima concentración.',
    description: 'L-Carnitina líquida de alta concentración (3000mg por ampolla). Facilitates la conversión de grasa en energía. Sabor a fruta de la pasión. Absorción rápida.',
    image: '/images/products/l-carnitine.jpg',
    gallery: ['/images/products/l-carnitine-1.jpg'],
    tags: ['l-carnitine', 'fat burner', 'energy', 'liquid'],
    rating: 4.5,
    reviewCount: 129,
    featured: false,
    bestSeller: false,
    isNew: true,
    benefits: ['3000mg por ampolla', 'Absorción rápida', 'Sabor fruta de la pasión', 'Fácil de tomar'],
    ingredients: 'L-Carnitina (3000mg), Agua purificada, Acidulante, Conservante, Aromas naturales.',
    directions: 'Tomar 1 ampolla (30ml) directamente o diluida en 200ml de agua. Preferentemente en ayunas 30 min antes del ejercicio.',
    warnings: 'No superar la dosis recomendada. Consultar médico si está embarazada o en período de lactancia.',
    servingsPerContainer: 20,
    servingSize: '1 ampolla (30ml)',
    variants: [
      { id: 'var-020-20', flavor: 'Fruta de la Pasión', size: '20 ampollas', price: 44990, originalPrice: undefined, stock: 15, sku: 'LCAR-20' },
      { id: 'var-020-10', flavor: 'Fruta de la Pasión', size: '10 ampollas', price: 25990, originalPrice: undefined, stock: 25, sku: 'LCAR-10' },
    ],
  },
];

// ─── Mock API response helpers ───────────────────────────────────────────────

export function getMockProductsResponse(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): ProductsResponse {
  let filtered = [...products];

  if (params?.category) {
    filtered = filtered.filter(p => p.category.slug === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter(p => p.variants.some(v => v.price >= params.minPrice!));
  }
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.variants.some(v => v.price <= params.maxPrice!));
  }
  if (params?.inStock) {
    filtered = filtered.filter(p => p.variants.some(v => v.stock > 0));
  }

  return {
    products: filtered,
    total: filtered.length,
    page: 1,
    pageSize: 20,
  };
}

export function getMockProductBySlug(slug: string): ShopProduct | null {
  return products.find(p => p.slug === slug) ?? null;
}

export function getMockFeaturedResponse(): FeaturedResponse {
  const featured = products.filter(p => p.featured);
  const bestSellers = products.filter(p => p.bestSeller);
  const newArrivals = products.filter(p => p.isNew);
  return { featured, bestSellers, newArrivals };
}

export function getMockCategoriesResponse(): CategoriesResponse {
  return { categories };
}

// Simulate network delay
function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Mock fetch wrapper ─────────────────────────────────────────────────────

export async function mockFetch<T>(
  _url: string,
  mockFn: () => T
): Promise<T> {
  await delay(80);
  return mockFn();
}
