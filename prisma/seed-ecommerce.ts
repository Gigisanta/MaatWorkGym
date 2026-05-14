import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting e-commerce seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ecommerceCategory.deleteMany();
  await prisma.ecommerceConfig.deleteMany();

  console.log('Cleaned existing data');

  // ============================================
  // CATEGORIES
  // ============================================
  const proteinas = await prisma.ecommerceCategory.create({
    data: { name: 'Proteínas', slug: 'proteinas', icon: 'Protein', description: 'Proteínas en polvo para recuperación y crecimiento muscular', sortOrder: 1 },
  });
  const creatina = await prisma.ecommerceCategory.create({
    data: { name: 'Creatina', slug: 'creatina', icon: 'Zap', description: 'Creatina monohidrato para fuerza y potencia', sortOrder: 2 },
  });
  const preentrenos = await prisma.ecommerceCategory.create({
    data: { name: 'Pre-entrenos', slug: 'pre-entrenos', icon: 'Flame', description: 'Pre-entrenos con cafeína y beta-alanina', sortOrder: 3 },
  });
  const aminoacidos = await prisma.ecommerceCategory.create({
    data: { name: 'Aminoácidos', slug: 'aminoacidos', icon: 'Pill', description: 'BCAAs, glutamina y aminoácidos esenciales', sortOrder: 4 },
  });
  const vitaminas = await prisma.ecommerceCategory.create({
    data: { name: 'Vitaminas', slug: 'vitaminas', icon: 'Heart', description: 'Vitaminas y minerales para complementar tu dieta', sortOrder: 5 },
  });
  const quemadores = await prisma.ecommerceCategory.create({
    data: { name: 'Quemadores', slug: 'quemadores', icon: 'Fire', description: 'Termogénicos y quemadores de grasa', sortOrder: 6 },
  });
  const colageno = await prisma.ecommerceCategory.create({
    data: { name: 'Colágeno', slug: 'colageno', icon: 'Sparkles', description: 'Colágeno hidrolizado para articulaciones y piel', sortOrder: 7 },
  });
  const accesorios = await prisma.ecommerceCategory.create({
    data: { name: 'Accesorios', slug: 'accesorios', icon: 'Dumbbell', description: 'Shakers, cinturones, guantes y más', sortOrder: 8 },
  });

  console.log('Created 8 categories');

  // ============================================
  // PRODUCTS
  // ============================================
  const products = [
    // PROTEÍNAS
    {
      name: 'Whey Protein Concentrada',
      slug: 'whey-protein-concentrada',
      brand: 'Essential',
      categoryId: proteinas.id,
      shortDescription: 'Proteína de suero de leche concentrada 80%',
      description: 'Whey Protein Concentrada de alta calidad. Ideal para después del entrenamiento. 80% de pureza.',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['20g proteína por porción', 'Recuperación muscular', 'Alta biodisponibilidad', 'Sabor excepcional'],
      ingredients: 'Suero de leche concentrado, lecitina de soja, sabores naturales.',
      directions: 'Mezclar 30g con 200ml de agua. Tomar post-entreno.',
      warnings: 'Consultar a su médico si está embarazada o en período de lactancia.',
      servingsPerContainer: 30, servingSize: '30g',
      variants: [
        { flavor: 'Chocolate', size: '1kg', price: 18500, originalPrice: 22000, stock: 45, sku: 'EWC-CH-1K' },
        { flavor: 'Vainilla', size: '1kg', price: 18500, originalPrice: 22000, stock: 38, sku: 'EWC-VN-1K' },
        { flavor: 'Fresa', size: '1kg', price: 18500, originalPrice: 22000, stock: 22, sku: 'EWC-FR-1K' },
        { flavor: 'Chocolate', size: '2.5kg', price: 42000, originalPrice: 52000, stock: 18, sku: 'EWC-CH-2K' },
        { flavor: 'Vainilla', size: '2.5kg', price: 42000, originalPrice: 52000, stock: 15, sku: 'EWC-VN-2K' },
      ],
    },
    {
      name: 'Whey Protein Isolate',
      slug: 'whey-protein-isolate',
      brand: 'Essential',
      categoryId: proteinas.id,
      shortDescription: 'Proteína aislada 90% proteína, baja en lactosa',
      description: 'Whey Protein Isolate de grado farmacéutico. 90% de proteína pura.',
      image: 'https://images.unsplash.com/photo-1571915497664-4e5cd716bd4d?w=800',
      featured: true, bestSeller: false, isNew: true,
      benefits: ['25g proteína por porción', '90% pureza', 'Baja en lactosa', 'Absorción rápida'],
      ingredients: 'Suero de leche aislado, lecitina de soja.',
      directions: 'Mezclar 28g con 150ml de agua.',
      warnings: 'Consulte a su médico si tiene problemas renales.',
      servingsPerContainer: 35, servingSize: '28g',
      variants: [
        { flavor: 'Chocolate', size: '1kg', price: 28500, originalPrice: 32000, stock: 30, sku: 'EWI-CH-1K' },
        { flavor: 'Vainilla', size: '1kg', price: 28500, originalPrice: 32000, stock: 25, sku: 'EWI-VN-1K' },
        { flavor: 'Sin sabor', size: '1kg', price: 26500, originalPrice: 30000, stock: 20, sku: 'EWI-NS-1K' },
      ],
    },
    {
      name: 'Protein Bar VIP',
      slug: 'protein-bar-vip',
      brand: 'ProFuel',
      categoryId: proteinas.id,
      shortDescription: 'Barra proteica 20g proteína, bajo en azúcar',
      description: 'Barra proteica gourmet con 20g de proteína.',
      image: 'https://images.unsplash.com/photo-1622484211148-5c28d1d853d8?w=800',
      featured: false, bestSeller: true, isNew: false,
      benefits: ['20g proteína', 'Solo 1.5g azúcar', '12g fibra', 'Listo para llevar'],
      ingredients: 'Proteína de leche, aislado de soja, chocolate negro.',
      directions: 'Consumir como snack entre comidas.',
      warnings: 'Contiene derivados de leche y soja.',
      servingsPerContainer: 12, servingSize: '60g',
      variants: [
        { flavor: 'Chocolate', size: '60g', price: 2800, originalPrice: 3200, stock: 80, sku: 'PVB-CH-60' },
        { flavor: 'Caramelo', size: '60g', price: 2800, originalPrice: 3200, stock: 65, sku: 'PVB-CA-60' },
        { flavor: 'Maní', size: '60g', price: 2800, originalPrice: 3200, stock: 50, sku: 'PVB-MN-60' },
      ],
    },
    // CREATINA
    {
      name: 'Creatina Monohidrato 3000',
      slug: 'creatina-monohidrato-3000',
      brand: 'PowerMax',
      categoryId: creatina.id,
      shortDescription: 'Creatina monohidrato micronizada 3g por porción',
      description: 'Creatina monohidrato de la más alta pureza micronizada.',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['3g creatina pura', 'Micronizada', 'Mejor absorción', 'Sin sabor'],
      ingredients: 'Creatina monohidrato micronizada.',
      directions: 'Mezclar 3g con agua. Tomar diariamente.',
      warnings: 'Mantenerse hidratado durante el uso.',
      servingsPerContainer: 66, servingSize: '3g',
      variants: [
        { flavor: 'Sin sabor', size: '200g', price: 15500, originalPrice: 18000, stock: 60, sku: 'PMC-200' },
        { flavor: 'Sin sabor', size: '500g', price: 34000, originalPrice: 40000, stock: 35, sku: 'PMC-500' },
        { flavor: 'Uva', size: '300g', price: 22000, originalPrice: 26000, stock: 28, sku: 'PMC-UV-300' },
      ],
    },
    {
      name: 'Creatina HCL 60 caps',
      slug: 'creatina-hcl-60-caps',
      brand: 'PowerMax',
      categoryId: creatina.id,
      shortDescription: 'Creatina HCl en cápsulas, sin mezcla',
      description: 'Creatina HCl en cápsulas de fácil ingesta.',
      image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800',
      featured: false, bestSeller: false, isNew: true,
      benefits: ['1g creatina HCl por cápsula', 'Sin mezcla', 'Fácil ingesta', 'Altamente soluble'],
      ingredients: 'Creatina HCl, gelatina.',
      directions: 'Tomar 2 cápsulas diarias con agua.',
      servingsPerContainer: 30, servingSize: '2 cápsulas',
      variants: [
        { flavor: 'N/A', size: '60 caps', price: 18500, originalPrice: 21000, stock: 40, sku: 'PHC-60' },
      ],
    },
    // PRE-ENTRENOS
    {
      name: 'Pre-Workout Nitro Blast',
      slug: 'pre-workout-nitro-blast',
      brand: 'PumpFuel',
      categoryId: preentrenos.id,
      shortDescription: 'Pre-entreno con 200mg cafeína + beta-alanina',
      description: 'Pre-entreno de alta intensidad con cafeína anhidra, beta-alanina, L-citrulina.',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['200mg cafeína', '3g beta-alanina', '4g L-citrulina', 'Pump extremo'],
      ingredients: 'L-citrulina, beta-alanina, cafeína anhidra, L-arginina.',
      directions: 'Mezclar 15g con 200ml de agua. Tomar 20-30 min antes.',
      warnings: 'Contiene cafeína. No consumir antes de dormir.',
      servingsPerContainer: 30, servingSize: '15g',
      variants: [
        { flavor: 'Frutilla', size: '450g', price: 22000, originalPrice: 27000, stock: 40, sku: 'PNB-FR-450' },
        { flavor: 'Mango', size: '450g', price: 22000, originalPrice: 27000, stock: 35, sku: 'PNB-MG-450' },
        { flavor: 'Fruit Punch', size: '450g', price: 22000, originalPrice: 27000, stock: 30, sku: 'PNB-FP-450' },
      ],
    },
    {
      name: 'Pre-Workout Stim-Free',
      slug: 'pre-workout-stim-free',
      brand: 'PumpFuel',
      categoryId: preentrenos.id,
      shortDescription: 'Pre-entreno sin cafeína, ideal para tardes/noches',
      description: 'Pre-entreno sin estimulantes. Beta-alanina y L-citrulina.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      featured: false, bestSeller: false, isNew: true,
      benefits: ['Sin cafeína', '3g beta-alanina', '5g L-citrulina', 'Sin estimulantes'],
      ingredients: 'L-citrulina, beta-alanina, extracto de remolacha.',
      directions: 'Mezclar 12g con 200ml de agua.',
      warnings: 'Puede causar cosquilleo por beta-alanina.',
      servingsPerContainer: 25, servingSize: '12g',
      variants: [
        { flavor: 'Limón', size: '300g', price: 18000, originalPrice: 22000, stock: 25, sku: 'PSF-LM-300' },
      ],
    },
    // AMINOÁCIDOS
    {
      name: 'BCAA 2:1:1 3000',
      slug: 'bcaa-2-1-1-3000',
      brand: 'AminoMax',
      categoryId: aminoacidos.id,
      shortDescription: 'BCAAs leucina, isoleucina, valina 2:1:1',
      description: 'Aminoácidos ramificados en proporción óptima 2:1:1.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['3g BCAAs por porción', 'Proporción 2:1:1', 'Previene catabolismo', 'Recuperación rápida'],
      ingredients: 'L-leucina, L-isoleucina, L-valina.',
      directions: 'Tomar antes/durante el entrenamiento.',
      servingsPerContainer: 60, servingSize: '5g',
      variants: [
        { flavor: 'Sin sabor', size: '300g', price: 14500, originalPrice: 17500, stock: 50, sku: 'ABC-300' },
        { flavor: 'Uva', size: '300g', price: 14500, originalPrice: 17500, stock: 40, sku: 'ABC-UV-300' },
      ],
    },
    {
      name: 'L-Glutamina 5000',
      slug: 'l-glutamina-5000',
      brand: 'AminoMax',
      categoryId: aminoacidos.id,
      shortDescription: 'Glutamina para recuperación post-entreno',
      description: 'L-Glutamina pura para recuperación muscular.',
      image: 'https://images.unsplash.com/photo-1544033527-b192c21eb370?w=800',
      featured: false, bestSeller: false, isNew: false,
      benefits: ['5g L-glutamina pura', 'Recuperación muscular', 'Soporte inmune', 'Sin sabor'],
      ingredients: 'L-Glutamina.',
      directions: 'Mezclar 5g con agua post-entreno.',
      servingsPerContainer: 40, servingSize: '5g',
      variants: [
        { flavor: 'Sin sabor', size: '200g', price: 12500, originalPrice: 15000, stock: 45, sku: 'AGL-200' },
      ],
    },
    // VITAMINAS
    {
      name: 'Multivitamínico Daily',
      slug: 'multivitaminico-daily',
      brand: 'VitaLife',
      categoryId: vitaminas.id,
      shortDescription: 'Complejo vitamínico y mineral completo',
      description: 'Multivitamínico diario con 23 vitaminas y minerales.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      featured: true, bestSeller: false, isNew: false,
      benefits: ['23 vitaminas y minerales', 'Vitamina D3', 'Vitamina B12', 'Zinc y magnesio'],
      ingredients: 'Vitaminas A, C, D, E, K, complejo B, minerales.',
      directions: 'Tomar 1 cápsula al día con el desayuno.',
      servingsPerContainer: 60, servingSize: '1 cápsula',
      variants: [
        { flavor: 'N/A', size: '60 caps', price: 9500, originalPrice: 12000, stock: 70, sku: 'VMD-60' },
        { flavor: 'N/A', size: '120 caps', price: 17500, originalPrice: 22000, stock: 35, sku: 'VMD-120' },
      ],
    },
    {
      name: 'Vitamina D3 + K2',
      slug: 'vitamina-d3-k2',
      brand: 'VitaLife',
      categoryId: vitaminas.id,
      shortDescription: 'Vitamina D3 5000 UI con K2 para absorción',
      description: 'Vitamina D3 de alta potencia con K2 (menaquinona-7).',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
      featured: false, bestSeller: true, isNew: false,
      benefits: ['5000 UI vitamina D3', '100mcg K2', 'Mejor absorción calcio', 'Salud ósea'],
      ingredients: 'Vitamina D3, vitamina K2, aceite de oliva.',
      directions: 'Tomar 1 cápsula diaria con comida con grasas.',
      servingsPerContainer: 60, servingSize: '1 cápsula',
      variants: [
        { flavor: 'N/A', size: '60 softgels', price: 13500, originalPrice: 16000, stock: 55, sku: 'VDK-60' },
      ],
    },
    {
      name: 'Magnesio Bisglicinato',
      slug: 'magnesio-bisglicinato',
      brand: 'VitaLife',
      categoryId: vitaminas.id,
      shortDescription: 'Magnesio quelado para relajación muscular',
      description: 'Magnesio en forma de bisglicinato para máxima absorción.',
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800',
      featured: false, bestSeller: false, isNew: true,
      benefits: ['400mg magnesio elemental', 'Forma quelada', 'Mejor absorción', 'Relajación muscular'],
      ingredients: 'Magnesio bisglicinato, cápsula vegetal.',
      directions: 'Tomar 2 cápsulas antes de dormir.',
      servingsPerContainer: 60, servingSize: '2 cápsulas',
      variants: [
        { flavor: 'N/A', size: '60 caps', price: 11500, originalPrice: 14000, stock: 40, sku: 'VMG-60' },
      ],
    },
    // QUEMADORES
    {
      name: 'Thermo Burn Complex',
      slug: 'thermo-burn-complex',
      brand: 'CutMax',
      categoryId: quemadores.id,
      shortDescription: 'Quemador termogénico con cafeína y té verde',
      description: 'Quemador de grasa termogénico con cafeína, té verde y L-carnitina.',
      image: 'https://images.unsplash.com/photo-1638718841864-78f5c52ef05e?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['200mg cafeína', '500mg té verde EGCG', '300mg L-carnitina', 'Aumenta metabolismo'],
      ingredients: 'Extracto de té verde, cafeína, L-carnitina, capsicum.',
      directions: 'Tomar 2 cápsulas por la mañana. No después de las 14hs.',
      warnings: 'Contiene cafeína. No usar si es sensible a estimulantes.',
      servingsPerContainer: 45, servingSize: '2 cápsulas',
      variants: [
        { flavor: 'N/A', size: '90 caps', price: 19500, originalPrice: 24000, stock: 35, sku: 'CTB-90' },
      ],
    },
    {
      name: 'L-Carnitina 3000',
      slug: 'l-carnitina-3000',
      brand: 'CutMax',
      categoryId: quemadores.id,
      shortDescription: 'L-Carnitina líquida para transporte de grasas',
      description: 'L-Carnitina en solución oral para facilitar el transporte de ácidos grasos.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c4fe799f?w=800',
      featured: false, bestSeller: false, isNew: false,
      benefits: ['3g L-carnitina por porción', 'Sabor deliciosa', 'Fácil ingesta', 'Transporte de grasas'],
      ingredients: 'L-carnitina, acidulante, saborizante natural.',
      directions: 'Tomar 10ml antes del entrenamiento.',
      servingsPerContainer: 25, servingSize: '10ml',
      variants: [
        { flavor: 'Frutilla', size: '250ml', price: 14500, originalPrice: 18000, stock: 30, sku: 'CLC-FR-250' },
        { flavor: 'Naranja', size: '250ml', price: 14500, originalPrice: 18000, stock: 28, sku: 'CLC-NJ-250' },
      ],
    },
    // COLÁGENO
    {
      name: 'Colágeno Hidrolizado Tipo I y III',
      slug: 'colageno-hidrolizado-tipo-i-iii',
      brand: 'GlowCollagen',
      categoryId: colageno.id,
      shortDescription: 'Colágeno hidrolizado para piel y articulaciones',
      description: 'Colágeno hidrolizado en polvo con Tipo I y III. 10g por porción.',
      image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800',
      featured: true, bestSeller: true, isNew: false,
      benefits: ['10g colágeno por porción', 'Tipo I y III', 'Sabor neutro', 'Mejor solubilidad'],
      ingredients: 'Colágeno hidrolizado tipo I y III.',
      directions: 'Mezclar 10g en café o jugo. En ayunas.',
      servingsPerContainer: 30, servingSize: '10g',
      variants: [
        { flavor: 'Sin sabor', size: '300g', price: 16500, originalPrice: 20000, stock: 45, sku: 'GC1-300' },
        { flavor: 'Naranja', size: '300g', price: 17500, originalPrice: 21000, stock: 30, sku: 'GC1-NJ-300' },
      ],
    },
    {
      name: 'Colágeno + Vitamina C',
      slug: 'colageno-vitamina-c',
      brand: 'GlowCollagen',
      categoryId: colageno.id,
      shortDescription: 'Colágeno con vitamina C para mayor absorción',
      description: 'Colágeno hidrolizado fortificado con vitamina C.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      featured: false, bestSeller: false, isNew: true,
      benefits: ['9g colágeno', '500mg vitamina C', 'Mayor absorción', 'Piel y articulaciones'],
      ingredients: 'Colágeno hidrolizado, ácido ascórbico.',
      directions: 'Mezclar 12g con agua. 1 vez al día.',
      servingsPerContainer: 25, servingSize: '12g',
      variants: [
        { flavor: 'Mango', size: '300g', price: 18500, originalPrice: 22000, stock: 25, sku: 'GCC-MG-300' },
      ],
    },
    // ACCESORIOS
    {
      name: 'Shaker Pro 700ml',
      slug: 'shaker-pro-700ml',
      brand: 'FitGear',
      categoryId: accesorios.id,
      shortDescription: 'Shaker con bola mezcladora y tapa segura',
      description: 'Shaker de alta calidad con bola mezcladora de acero inoxidable.',
      image: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800',
      featured: true, bestSeller: false, isNew: false,
      benefits: ['700ml capacidad', 'Bola mezcladora', 'Sin BPA', 'Apto lavavajillas'],
      ingredients: '',
      directions: 'Agregar líquido y polvo, cerrar y agitar.',
      warnings: 'No usar con líquidos calientes.',
      servingsPerContainer: 1, servingSize: '700ml',
      variants: [
        { flavor: 'Negro', size: '700ml', price: 5500, originalPrice: 7000, stock: 100, sku: 'SGP-NG-700' },
        { flavor: 'Rojo', size: '700ml', price: 5500, originalPrice: 7000, stock: 80, sku: 'SGP-RJ-700' },
        { flavor: 'Azul', size: '700ml', price: 5500, originalPrice: 7000, stock: 65, sku: 'SGP-AZ-700' },
        { flavor: 'Blanco', size: '700ml', price: 5500, originalPrice: 7000, stock: 50, sku: 'SGP-BL-700' },
      ],
    },
    {
      name: 'Guantes de Entrenamiento Pro',
      slug: 'guantes-entrenamiento-pro',
      brand: 'FitGear',
      categoryId: accesorios.id,
      shortDescription: 'Guantes con soporte de muñeca y palma acolchada',
      description: 'Guantes de entrenamiento con gel acolchado y soporte de muñeca.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      featured: false, bestSeller: true, isNew: false,
      benefits: ['Soporte de muñeca', 'Palma con gel', 'Material respirable', 'Agarre antideslizante'],
      ingredients: '',
      directions: 'Usar durante ejercicios con pesas.',
      servingsPerContainer: 1, servingSize: '1 par',
      variants: [
        { flavor: 'Negro', size: 'S', price: 8500, originalPrice: 10500, stock: 40, sku: 'GEP-NG-S' },
        { flavor: 'Negro', size: 'M', price: 8500, originalPrice: 10500, stock: 50, sku: 'GEP-NG-M' },
        { flavor: 'Negro', size: 'L', price: 8500, originalPrice: 10500, stock: 45, sku: 'GEP-NG-L' },
        { flavor: 'Negro', size: 'XL', price: 8500, originalPrice: 10500, stock: 30, sku: 'GEP-NG-XL' },
      ],
    },
  ];

  let productCount = 0;
  for (const productData of products) {
    const { variants, ...productInfo } = productData;

    const product = await prisma.product.create({
      data: {
        ...productInfo,
        tags: productInfo.name.toLowerCase().split(' '),
      },
    });

    for (const variant of variants) {
      await prisma.productVariant.create({
        data: { ...variant, productId: product.id },
      });
    }
    productCount++;
    console.log(`Created product: ${product.name} (${variants.length} variants)`);
  }

  console.log(`Created ${productCount} products`);

  // ============================================
  // INITIAL CONFIG
  // ============================================
  const configs = [
    { key: 'storeName', value: 'SEVJO Supplements' },
    { key: 'storeLogo', value: '/logo.svg' },
    { key: 'welcomeMessage', value: 'Bienvenido a SEVJO Supplements! Tu tienda de suplementos deportivos de confianza.' },
    { key: 'contactEmail', value: 'hola@sevjo.maat.work' },
    { key: 'contactPhone', value: '+54 11 5555-5555' },
    { key: 'address', value: 'Av. Libertador 5555, Buenos Aires, Argentina' },
    { key: 'shippingCost', value: '2500' },
    { key: 'freeShippingThreshold', value: '35000' },
    { key: 'taxRate', value: '0.21' },
  ];

  for (const config of configs) {
    await prisma.ecommerceConfig.create({ data: config });
  }
  console.log(`Created ${configs.length} config entries`);

  // ============================================
  // SAMPLE COUPONS
  // ============================================
  const coupons = [
    {
      code: 'BIENVENIDO',
      title: 'Descuento de Bienvenida',
      description: '15% off en tu primera compra',
      discountType: 'percentage' as const,
      discountValue: 15,
      minPurchase: 0,
      maxDiscount: 5000,
      usageLimit: 1,
      featured: true,
      active: true,
    },
    {
      code: 'ENVIOGRATIS',
      title: 'Envío Gratis',
      description: 'Envío sin costo en compras mayores a $20.000',
      discountType: 'fixed' as const,
      discountValue: 2500,
      minPurchase: 20000,
      featured: false,
      active: true,
    },
    {
      code: 'PUMP10',
      title: '10% Extra',
      description: '10% adicional en pre-entrenos',
      discountType: 'percentage' as const,
      discountValue: 10,
      minPurchase: 0,
      featured: false,
      active: true,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }
  console.log(`Created ${coupons.length} coupons`);

  console.log('\nE-commerce seed completed!');
  console.log(`   8 categories`);
  console.log(`   ${productCount} products`);
  console.log(`   ${coupons.length} coupons`);
  console.log(`   ${configs.length} config entries`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
