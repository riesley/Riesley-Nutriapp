import React, { useState, useMemo } from 'react';
import {
  Activity,
  Flame,
  Droplets,
  Plus,
  Trash2,
  UserCheck,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  ArrowLeftRight,
  Search,
  Utensils,
  Sparkles,
  Scale,
  ChevronRight,
  Info,
  Award,
  HeartPulse,
  PlusCircle,
  BookOpen,
  Filter
} from 'lucide-react';

// ==========================================
// BANCO DE DADOS DE ALIMENTOS (BASE TACO / USDA)
// Valores por 100g de alimento com 15 micronutrientes
// ==========================================
const INITIAL_FOOD_DB = [
  {
    id: 'pao_sal',
    name: 'Pão de Sal (Francês)',
    category: 'Carboidratos',
    measureDesc: '1 unidade média (50g)',
    defaultGrams: 50,
    kcal: 300,
    protein: 8.0,
    carbs: 58.6,
    fat: 3.1,
    fiber: 2.3,
    micros: {
      ferro: 1.0, calcio: 16, magnesio: 22, zinco: 0.8, potassio: 142, sodio: 648, fosforo: 95, selenio: 15,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.04, folato: 35, vitE: 0.1
    }
  },
  {
    id: 'ovo_inteiro',
    name: 'Ovo de Galinha Inteiro (Cozido/Mexido)',
    category: 'Proteínas & Gorduras',
    measureDesc: '1 unidade média (50g)',
    defaultGrams: 150,
    kcal: 146,
    protein: 13.3,
    carbs: 0.6,
    fat: 9.5,
    fiber: 0,
    micros: {
      ferro: 1.5, calcio: 49, magnesio: 11, zinco: 1.1, potassio: 126, sodio: 140, fosforo: 185, selenio: 30.8,
      vitC: 0, vitD: 2.0, vitA: 160, vitB12: 1.1, vitB6: 0.17, folato: 44, vitE: 1.05
    }
  },
  {
    id: 'arroz_branco',
    name: 'Arroz Branco Cozido',
    category: 'Carboidratos',
    measureDesc: '1 escumadeira cheia (100g)',
    defaultGrams: 150,
    kcal: 128,
    protein: 2.5,
    carbs: 28.1,
    fat: 0.2,
    fiber: 1.6,
    micros: {
      ferro: 0.3, calcio: 4, magnesio: 10, zinco: 0.5, potassio: 35, sodio: 2, fosforo: 40, selenio: 7.5,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.05, folato: 3, vitE: 0.05
    }
  },
  {
    id: 'arroz_integral',
    name: 'Arroz Integral Cozido',
    category: 'Carboidratos',
    measureDesc: '1 escumadeira cheia (100g)',
    defaultGrams: 150,
    kcal: 124,
    protein: 2.6,
    carbs: 25.8,
    fat: 1.0,
    fiber: 2.7,
    micros: {
      ferro: 0.4, calcio: 5, magnesio: 59, zinco: 0.7, potassio: 75, sodio: 2, fosforo: 106, selenio: 9.8,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.14, folato: 4, vitE: 0.2
    }
  },
  {
    id: 'feijao_preto',
    name: 'Feijão Preto Cozido',
    category: 'Carboidratos',
    measureDesc: '1 concha média (100g)',
    defaultGrams: 120,
    kcal: 77,
    protein: 4.5,
    carbs: 14.0,
    fat: 0.5,
    fiber: 8.4,
    micros: {
      ferro: 1.5, calcio: 29, magnesio: 40, zinco: 0.7, potassio: 256, sodio: 2, fosforo: 88, selenio: 1.2,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.07, folato: 149, vitE: 0.2
    }
  },
  {
    id: 'patinho_grelhado',
    name: 'Carne Bovina (Patinho Moído/Grelhado)',
    category: 'Proteínas',
    measureDesc: '1 porção média (120g)',
    defaultGrams: 150,
    kcal: 219,
    protein: 35.9,
    carbs: 0,
    fat: 7.3,
    fiber: 0,
    micros: {
      ferro: 2.8, calcio: 5, magnesio: 25, zinco: 6.2, potassio: 340, sodio: 60, fosforo: 245, selenio: 26.0,
      vitC: 0, vitD: 0.1, vitA: 0, vitB12: 2.6, vitB6: 0.5, folato: 8, vitE: 0.3
    }
  },
  {
    id: 'frango_grelhado',
    name: 'Peito de Frango Grelhado',
    category: 'Proteínas',
    measureDesc: '1 filé grande (150g)',
    defaultGrams: 150,
    kcal: 159,
    protein: 32.0,
    carbs: 0,
    fat: 2.5,
    fiber: 0,
    micros: {
      ferro: 0.4, calcio: 6, magnesio: 31, zinco: 0.9, potassio: 310, sodio: 50, fosforo: 250, selenio: 24.5,
      vitC: 0, vitD: 0.1, vitA: 6, vitB12: 0.3, vitB6: 0.6, folato: 4, vitE: 0.25
    }
  },
  {
    id: 'batata_inglesa',
    name: 'Batata Inglesa Cozida',
    category: 'Carboidratos',
    measureDesc: '1 unidade média (150g)',
    defaultGrams: 200,
    kcal: 52,
    protein: 1.2,
    carbs: 11.9,
    fat: 0,
    fiber: 1.3,
    micros: {
      ferro: 0.2, calcio: 4, magnesio: 15, zinco: 0.2, potassio: 300, sodio: 2, fosforo: 35, selenio: 0.3,
      vitC: 13.0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.25, folato: 10, vitE: 0.01
    }
  },
  {
    id: 'aveia_flocos',
    name: 'Aveia em Flocos',
    category: 'Carboidratos',
    measureDesc: '2 colheres de sopa (30g)',
    defaultGrams: 40,
    kcal: 394,
    protein: 13.9,
    carbs: 66.6,
    fat: 8.5,
    fiber: 9.1,
    micros: {
      ferro: 4.5, calcio: 48, magnesio: 119, zinco: 2.6, potassio: 336, sodio: 5, fosforo: 153, selenio: 28.0,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.12, folato: 56, vitE: 0.7
    }
  },
  {
    id: 'banana_prata',
    name: 'Banana Prata',
    category: 'Frutas',
    measureDesc: '1 unidade média (75g)',
    defaultGrams: 100,
    kcal: 98,
    protein: 1.3,
    carbs: 26.0,
    fat: 0.1,
    fiber: 2.0,
    micros: {
      ferro: 0.4, calcio: 8, magnesio: 26, zinco: 0.1, potassio: 358, sodio: 1, fosforo: 22, selenio: 1.0,
      vitC: 21.6, vitD: 0, vitA: 3, vitB12: 0, vitB6: 0.37, folato: 20, vitE: 0.1
    }
  },
  {
    id: 'laranja_pera',
    name: 'Laranja Pêra',
    category: 'Frutas',
    measureDesc: '1 unidade média (140g)',
    defaultGrams: 140,
    kcal: 37,
    protein: 1.0,
    carbs: 8.9,
    fat: 0.1,
    fiber: 0.8,
    micros: {
      ferro: 0.1, calcio: 22, magnesio: 9, zinco: 0.1, potassio: 163, sodio: 1, fosforo: 15, selenio: 0.5,
      vitC: 53.7, vitD: 0, vitA: 11, vitB12: 0, vitB6: 0.06, folato: 30, vitE: 0.18
    }
  },
  {
    id: 'mamao_formosa',
    name: 'Mamão Formosa',
    category: 'Frutas',
    measureDesc: '1 fatia média (150g)',
    defaultGrams: 150,
    kcal: 45,
    protein: 0.8,
    carbs: 11.6,
    fat: 0.1,
    fiber: 1.8,
    micros: {
      ferro: 0.2, calcio: 25, magnesio: 17, zinco: 0.1, potassio: 222, sodio: 3, fosforo: 11, selenio: 0.6,
      vitC: 78.5, vitD: 0, vitA: 274, vitB12: 0, vitB6: 0.04, folato: 37, vitE: 0.3
    }
  },
  {
    id: 'brocolis_cozido',
    name: 'Brócolis Cozido',
    category: 'Vegetais',
    measureDesc: '1 xícara cheia (100g)',
    defaultGrams: 100,
    kcal: 25,
    protein: 2.1,
    carbs: 4.4,
    fat: 0.5,
    fiber: 3.4,
    micros: {
      ferro: 0.6, calcio: 51, magnesio: 15, zinco: 0.4, potassio: 148, sodio: 12, fosforo: 49, selenio: 1.6,
      vitC: 42.0, vitD: 0, vitA: 77, vitB12: 0, vitB6: 0.2, folato: 108, vitE: 1.45
    }
  },
  {
    id: 'espinafre_refogado',
    name: 'Espinafre Cozido/Refogado',
    category: 'Vegetais',
    measureDesc: '3 colheres de sopa (80g)',
    defaultGrams: 80,
    kcal: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    micros: {
      ferro: 2.7, calcio: 99, magnesio: 79, zinco: 0.5, potassio: 466, sodio: 70, fosforo: 49, selenio: 1.0,
      vitC: 18.0, vitD: 0, vitA: 469, vitB12: 0, vitB6: 0.24, folato: 146, vitE: 2.0
    }
  },
  {
    id: 'azeite_oliva',
    name: 'Azeite de Oliva Extra Virgem',
    category: 'Gorduras',
    measureDesc: '1 colher de sopa (12g)',
    defaultGrams: 12,
    kcal: 884,
    protein: 0,
    carbs: 0,
    fat: 100.0,
    fiber: 0,
    micros: {
      ferro: 0.5, calcio: 1, magnesio: 0, zinco: 0, potassio: 1, sodio: 2, fosforo: 0, selenio: 0,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0, folato: 0, vitE: 14.3
    }
  },
  {
    id: 'pasta_amendoim',
    name: 'Pasta de Amendoim Integral',
    category: 'Gorduras',
    measureDesc: '1 colher de sopa cheia (20g)',
    defaultGrams: 20,
    kcal: 588,
    protein: 25.0,
    carbs: 20.0,
    fat: 50.0,
    fiber: 6.0,
    micros: {
      ferro: 1.9, calcio: 43, magnesio: 154, zinco: 2.9, potassio: 649, sodio: 15, fosforo: 358, selenio: 7.5,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.5, folato: 87, vitE: 9.0
    }
  },
  {
    id: 'castanha_para',
    name: 'Castanha-do-Pará (Brasil)',
    category: 'Gorduras',
    measureDesc: '2 unidades (10g)',
    defaultGrams: 10,
    kcal: 643,
    protein: 14.5,
    carbs: 15.1,
    fat: 63.5,
    fiber: 7.9,
    micros: {
      ferro: 2.3, calcio: 146, magnesio: 365, zinco: 4.2, potassio: 651, sodio: 2, fosforo: 725, selenio: 400.0,
      vitC: 0.7, vitD: 0, vitA: 0, vitB12: 0, vitB6: 0.1, folato: 22, vitE: 5.7
    }
  },
  {
    id: 'whey_protein',
    name: 'Whey Protein Concentrado (80%)',
    category: 'Proteínas',
    measureDesc: '1 scoop padrão (30g)',
    defaultGrams: 30,
    kcal: 400,
    protein: 80.0,
    carbs: 10.0,
    fat: 5.0,
    fiber: 0,
    micros: {
      ferro: 0.8, calcio: 450, magnesio: 60, zinco: 1.5, potassio: 500, sodio: 210, fosforo: 350, selenio: 12.0,
      vitC: 0, vitD: 0, vitA: 0, vitB12: 1.5, vitB6: 0.4, folato: 15, vitE: 0
    }
  },
  {
    id: 'leite_integral',
    name: 'Leite de Vaca Integral',
    category: 'Proteínas & Gorduras',
    measureDesc: '1 copo médio (200ml)',
    defaultGrams: 200,
    kcal: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    fiber: 0,
    micros: {
      ferro: 0.1, calcio: 123, magnesio: 10, zinco: 0.4, potassio: 140, sodio: 43, fosforo: 93, selenio: 3.7,
      vitC: 0, vitD: 1.2, vitA: 46, vitB12: 0.45, vitB6: 0.04, folato: 5, vitE: 0.07
    }
  }
];

// ==========================================
// METAS RECOMENDADAS DE MICRONUTRIENTES (DRI ADULTO ATIVO)
// ==========================================
const MICRONUTRIENT_SPECS = [
  // Minerais
  { key: 'ferro', name: 'Ferro', unit: 'mg', target: 14, type: 'mineral', desc: 'Transporte de oxigênio e energia celular' },
  { key: 'calcio', name: 'Cálcio', unit: 'mg', target: 1000, type: 'mineral', desc: 'Contração muscular e densidade óssea' },
  { key: 'magnesio', name: 'Magnésio', unit: 'mg', target: 400, type: 'mineral', desc: 'Mais de 300 reações enzimáticas e sono' },
  { key: 'zinco', name: 'Zinco', unit: 'mg', target: 11, type: 'mineral', desc: 'Imunidade, síntese proteica e hormonal' },
  { key: 'potassio', name: 'Potássio', unit: 'mg', target: 3500, type: 'mineral', desc: 'Equilíbrio hidroeletrolítico e bomba Na/K' },
  { key: 'sodio', name: 'Sódio (Limite)', unit: 'mg', target: 2000, isUpperLimit: true, type: 'mineral', desc: 'Controle de volume plasmático e contração' },
  { key: 'fosforo', name: 'Fósforo', unit: 'mg', target: 700, type: 'mineral', desc: 'Produção de ATP e saúde estrutural' },
  { key: 'selenio', name: 'Selênio', unit: 'mcg', target: 55, type: 'mineral', desc: 'Defesa antioxidante e função tireoidiana' },
  // Vitaminas
  { key: 'vitC', name: 'Vitamina C', unit: 'mg', target: 90, type: 'vitamina', desc: 'Síntese de colágeno e absorção de ferro' },
  { key: 'vitD', name: 'Vitamina D', unit: 'mcg', target: 15, type: 'vitamina', desc: 'Saúde óssea, imune e força muscular' },
  { key: 'vitA', name: 'Vitamina A', unit: 'mcg', target: 900, type: 'vitamina', desc: 'Saúde ocular, epitelial e imunológica' },
  { key: 'vitB12', name: 'Vitamina B12', unit: 'mcg', target: 2.4, type: 'vitamina', desc: 'Formação de hemácias e sistema nervoso' },
  { key: 'vitB6', name: 'Vitamina B6', unit: 'mg', target: 1.3, type: 'vitamina', desc: 'Metabolismo de aminoácidos e glicogênio' },
  { key: 'folato', name: 'Folato (Vit. B9)', unit: 'mcg', target: 400, type: 'vitamina', desc: 'Síntese de DNA e divisão celular' },
  { key: 'vitE', name: 'Vitamina E', unit: 'mg', target: 15, type: 'vitamina', desc: 'Proteção de membranas celulares contra radicais' }
];

const MEAL_SLOTS = [
  { id: 'cafe', title: 'Café da Manhã', time: '07:30' },
  { id: 'almoco', title: 'Almoço', time: '12:30' },
  { id: 'lanche', title: 'Lanche da Tarde', time: '16:00' },
  { id: 'treino', title: 'Pré / Pós-Treino', time: '18:30' },
  { id: 'jantar', title: 'Jantar', time: '20:30' }
];

// ==========================================
// PACIENTES DE EXEMPLO DA CONSULTORIA
// ==========================================
const INITIAL_PATIENTS = [
  {
    id: 'p1',
    name: 'Riesley Ribeiro (Atleta / Hipertrofia)',
    goal: 'Hipertrofia Limpa & Alta Performance',
    weightKg: 86,
    targets: {
      kcal: 2850,
      protein: 190, // ~2.2g/kg
      carbs: 345,   // ~4.0g/kg
      fat: 78,      // ~0.9g/kg
      fiber: 35,
      waterMl: 3400 // ~40ml/kg
    },
    waterConsumed: 2250,
    logs: [
      { id: 'l1', mealId: 'cafe', foodId: 'pao_sal', grams: 50 },
      { id: 'l2', mealId: 'cafe', foodId: 'ovo_inteiro', grams: 150 },
      { id: 'l3', mealId: 'cafe', foodId: 'mamao_formosa', grams: 150 },
      { id: 'l4', mealId: 'almoco', foodId: 'arroz_branco', grams: 200 },
      { id: 'l5', mealId: 'almoco', foodId: 'feijao_preto', grams: 140 },
      { id: 'l6', mealId: 'almoco', foodId: 'patinho_grelhado', grams: 160 },
      { id: 'l7', mealId: 'almoco', foodId: 'brocolis_cozido', grams: 100 },
      { id: 'l8', mealId: 'almoco', foodId: 'azeite_oliva', grams: 12 },
      { id: 'l9', mealId: 'lanche', foodId: 'aveia_flocos', grams: 40 },
      { id: 'l10', mealId: 'lanche', foodId: 'banana_prata', grams: 100 },
      { id: 'l11', mealId: 'lanche', foodId: 'whey_protein', grams: 30 },
      { id: 'l12', mealId: 'lanche', foodId: 'castanha_para', grams: 5 }
    ]
  },
  {
    id: 'p2',
    name: 'Mariana Costa (Emagrecimento)',
    goal: 'Recomposição Corporal & Déficit Calórico',
    weightKg: 64,
    targets: {
      kcal: 1680,
      protein: 135, // ~2.1g/kg
      carbs: 150,   // ~2.3g/kg
      fat: 58,      // ~0.9g/kg
      fiber: 28,
      waterMl: 2500
    },
    waterConsumed: 1750,
    logs: [
      { id: 'm1', mealId: 'cafe', foodId: 'ovo_inteiro', grams: 100 },
      { id: 'm2', mealId: 'cafe', foodId: 'pao_sal', grams: 50 },
      { id: 'm3', mealId: 'almoco', foodId: 'arroz_integral', grams: 120 },
      { id: 'm4', mealId: 'almoco', foodId: 'feijao_preto', grams: 100 },
      { id: 'm5', mealId: 'almoco', foodId: 'frango_grelhado', grams: 140 },
      { id: 'm6', mealId: 'almoco', foodId: 'espinafre_refogado', grams: 80 },
      { id: 'm7', mealId: 'lanche', foodId: 'laranja_pera', grams: 140 },
      { id: 'm8', mealId: 'lanche', foodId: 'whey_protein', grams: 30 }
    ]
  },
  {
    id: 'p3',
    name: 'Lucas Mendes (Endurance & Corrida)',
    goal: 'Performance Esportiva & Reposição de Glicogênio',
    weightKg: 74,
    targets: {
      kcal: 3100,
      protein: 150,
      carbs: 460,
      fat: 72,
      fiber: 38,
      waterMl: 3300
    },
    waterConsumed: 3000,
    logs: [
      { id: 'c1', mealId: 'cafe', foodId: 'aveia_flocos', grams: 60 },
      { id: 'c2', mealId: 'cafe', foodId: 'banana_prata', grams: 150 },
      { id: 'c3', mealId: 'cafe', foodId: 'leite_integral', grams: 250 },
      { id: 'c4', mealId: 'almoco', foodId: 'arroz_branco', grams: 250 },
      { id: 'c5', mealId: 'almoco', foodId: 'feijao_preto', grams: 150 },
      { id: 'c6', mealId: 'almoco', foodId: 'patinho_grelhado', grams: 150 },
      { id: 'c7', mealId: 'treino', foodId: 'pao_sal', grams: 100 },
      { id: 'c8', mealId: 'treino', foodId: 'pasta_amendoim', grams: 25 }
    ]
  }
];

export default function App() {
  // Estados principais
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState('p1');
  const [foodDb, setFoodDb] = useState(INITIAL_FOOD_DB);
  const [viewMode, setViewMode] = useState('paciente'); // 'paciente' ou 'nutricionista'
  const [activeTab, setActiveTab] = useState('diario'); // 'diario' | 'micros' | 'equivalencia' | 'alimentos'

  // Estados de filtro de micronutrientes
  const [microFilter, setMicroFilter] = useState('todos'); // 'todos' | 'mineral' | 'vitamina' | 'alerta'

  // Estados para adicionar alimento na refeição
  const [addingMealId, setAddingMealId] = useState('cafe');
  const [selectedFoodId, setSelectedFoodId] = useState('pao_sal');
  const [selectedGrams, setSelectedGrams] = useState(50);
  const [foodSearch, setFoodSearch] = useState('');

  // Estados para Calculadora de Substituição / Equivalência
  const [swapBaseFoodId, setSwapBaseFoodId] = useState('pao_sal');
  const [swapBaseGrams, setSwapBaseGrams] = useState(50);

  // Estados para Cadastrar Novo Alimento Personalizado
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Carboidratos',
    measureDesc: '1 porção (100g)',
    kcal: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    ferro: '',
    calcio: '',
    magnesio: '',
    zinco: '',
    potassio: '',
    sodio: '',
    vitC: '',
    vitD: '',
    vitB12: ''
  });
  const [customFoodSuccess, setCustomFoodSuccess] = useState(false);

  // Paciente atual selecionado
  const currentPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) || patients[0],
    [patients, selectedPatientId]
  );

  // Cálculo consolidado do dia (Calorias, Macros, Fibras e 15 Micronutrientes)
  const dailyTotals = useMemo(() => {
    const totals = {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      micros: {}
    };

    MICRONUTRIENT_SPECS.forEach((m) => {
      totals.micros[m.key] = 0;
    });

    currentPatient.logs.forEach((entry) => {
      const food = foodDb.find((f) => f.id === entry.foodId);
      if (!food) return;
      const ratio = entry.grams / 100;

      totals.kcal += food.kcal * ratio;
      totals.protein += food.protein * ratio;
      totals.carbs += food.carbs * ratio;
      totals.fat += food.fat * ratio;
      totals.fiber += (food.fiber || 0) * ratio;

      MICRONUTRIENT_SPECS.forEach((m) => {
        const val = food.micros?.[m.key] || 0;
        totals.micros[m.key] += val * ratio;
      });
    });

    return totals;
  }, [currentPatient, foodDb]);

  // Alertas de micronutrientes (< 50% da meta ou sódio acima do limite)
  const microAlerts = useMemo(() => {
    const low = [];
    const high = [];
    MICRONUTRIENT_SPECS.forEach((spec) => {
      const val = dailyTotals.micros[spec.key] || 0;
      const pct = (val / spec.target) * 100;
      if (spec.isUpperLimit) {
        if (pct > 100) high.push({ ...spec, val, pct });
      } else {
        if (pct < 50) low.push({ ...spec, val, pct });
      }
    });
    return { low, high };
  }, [dailyTotals]);

  // Handlers de interação
  const handleSelectFoodToAdd = (foodId) => {
    setSelectedFoodId(foodId);
    const f = foodDb.find((item) => item.id === foodId);
    if (f) setSelectedGrams(f.defaultGrams || 100);
  };

  const handleAddFoodToMeal = (e) => {
    e.preventDefault();
    if (!selectedFoodId || Number(selectedGrams) <= 0) return;

    const newEntry = {
      id: 'log_' + Date.now(),
      mealId: addingMealId,
      foodId: selectedFoodId,
      grams: Number(selectedGrams)
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id ? { ...p, logs: [...p.logs, newEntry] } : p
      )
    );
  };

  const handleRemoveLog = (logId) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? { ...p, logs: p.logs.filter((l) => l.id !== logId) }
          : p
      )
    );
  };

  const handleUpdateWater = (deltaMl) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? { ...p, waterConsumed: Math.max(0, p.waterConsumed + deltaMl) }
          : p
      )
    );
  };

  const handleUpdateTarget = (field, value) => {
    const numVal = Math.max(0, Number(value) || 0);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id
          ? {
              ...p,
              targets: {
                ...p.targets,
                [field]: numVal
              }
            }
          : p
      )
    );
  };

  const handleUpdateWeight = (value) => {
    const numVal = Math.max(30, Number(value) || 70);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatient.id ? { ...p, weightKg: numVal } : p
      )
    );
  };

  const handleCreateCustomFood = (e) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;

    const created = {
      id: 'custom_' + Date.now(),
      name: newFood.name.trim(),
      category: newFood.category,
      measureDesc: newFood.measureDesc || 'Porção (100g)',
      defaultGrams: 100,
      kcal: Number(newFood.kcal) || 0,
      protein: Number(newFood.protein) || 0,
      carbs: Number(newFood.carbs) || 0,
      fat: Number(newFood.fat) || 0,
      fiber: Number(newFood.fiber) || 0,
      micros: {
        ferro: Number(newFood.ferro) || 0,
        calcio: Number(newFood.calcio) || 0,
        magnesio: Number(newFood.magnesio) || 0,
        zinco: Number(newFood.zinco) || 0,
        potassio: Number(newFood.potassio) || 0,
        sodio: Number(newFood.sodio) || 0,
        fosforo: 50,
        selenio: 5,
        vitC: Number(newFood.vitC) || 0,
        vitD: Number(newFood.vitD) || 0,
        vitA: 0,
        vitB12: Number(newFood.vitB12) || 0,
        vitB6: 0.1,
        folato: 15,
        vitE: 0.2
      }
    };

    setFoodDb((prev) => [created, ...prev]);
    setSelectedFoodId(created.id);
    setCustomFoodSuccess(true);
    setTimeout(() => setCustomFoodSuccess(false), 3500);
    setNewFood({
      name: '',
      category: 'Carboidratos',
      measureDesc: '1 porção (100g)',
      kcal: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      ferro: '',
      calcio: '',
      magnesio: '',
      zinco: '',
      potassio: '',
      sodio: '',
      vitC: '',
      vitD: '',
      vitB12: ''
    });
  };

  // Alimentos filtrados na busca
  const filteredFoods = useMemo(() => {
    if (!foodSearch.trim()) return foodDb;
    return foodDb.filter((f) =>
      f.name.toLowerCase().includes(foodSearch.toLowerCase())
    );
  }, [foodDb, foodSearch]);

  // Alimento selecionado no formulário de adição rápida (preview nutricional instantâneo)
  const previewSelectedFood = useMemo(() => {
    const f = foodDb.find((item) => item.id === selectedFoodId);
    if (!f) return null;
    const ratio = (Number(selectedGrams) || 0) / 100;
    return {
      ...f,
      calcKcal: Math.round(f.kcal * ratio),
      calcProtein: (f.protein * ratio).toFixed(1),
      calcCarbs: (f.carbs * ratio).toFixed(1),
      calcFat: (f.fat * ratio).toFixed(1),
      calcFiber: ((f.fiber || 0) * ratio).toFixed(1)
    };
  }, [foodDb, selectedFoodId, selectedGrams]);

  // Cálculo de Equivalência / Substituição Inteligente
  const swapResults = useMemo(() => {
    const baseFood = foodDb.find((f) => f.id === swapBaseFoodId);
    if (!baseFood) return { baseFood: null, equivalents: [] };
    const targetKcal = (baseFood.kcal * (Number(swapBaseGrams) || 100)) / 100;

    const equivalents = foodDb
      .filter((f) => f.id !== baseFood.id && f.category === baseFood.category && f.kcal > 0)
      .map((f) => {
        const neededGrams = Math.round((targetKcal / f.kcal) * 100);
        const ratio = neededGrams / 100;
        return {
          ...f,
          neededGrams,
          eqKcal: Math.round(f.kcal * ratio),
          eqProtein: (f.protein * ratio).toFixed(1),
          eqCarbs: (f.carbs * ratio).toFixed(1),
          eqFat: (f.fat * ratio).toFixed(1)
        };
      });

    return { baseFood, targetKcal: Math.round(targetKcal), equivalents };
  }, [foodDb, swapBaseFoodId, swapBaseGrams]);

  // Cálculos percentuais de calorias
  const kcalPct = Math.min(
    100,
    Math.round((dailyTotals.kcal / (currentPatient.targets.kcal || 1)) * 100)
  );
  const remainingKcal = Math.round(currentPatient.targets.kcal - dailyTotals.kcal);

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black pb-16">
      {/* HEADER SUPERIOR - IDENTIDADE VISUAL RIESLEY RIBEIRO NUTRIÇÃO */}
      <header className="sticky top-0 z-30 border-b border-[#1e2230] bg-[#090a0f]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/30">
              <span className="font-black text-lg tracking-tighter text-[#090a0f]">RR</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-wider uppercase text-white">
                  Riesley Ribeiro <span className="text-emerald-400">Nutrição</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Consultoria Pro
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Controle Clínico e Esportivo de Calorias, Macros e Micronutrientes (Base TACO)
              </p>
            </div>
          </div>

          {/* Seletor de Paciente & Alternador de Visão (Paciente vs Nutricionista) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-[#12141c] border border-[#1e2230] rounded-lg px-3 py-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-zinc-100 focus:outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#12141c] text-zinc-100">
                    {p.name} ({p.weightKg} kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex bg-[#12141c] p-1 rounded-lg border border-[#1e2230]">
              <button
                onClick={() => setViewMode('paciente')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'paciente'
                    ? 'bg-emerald-500 text-[#090a0f] shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Visão Paciente
              </button>
              <button
                onClick={() => setViewMode('nutricionista')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'nutricionista'
                    ? 'bg-emerald-500 text-[#090a0f] shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Ajustar Metas (Nutri)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* PAINEL DO NUTRICIONISTA (Visível quando o modo 'nutricionista' está ativo) */}
        {viewMode === 'nutricionista' && (
          <section className="bg-[#12141c] border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#1e2230]">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    Prescrição Dietética — Ajuste de Metas do Paciente
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Altere o peso ou as metas de macronutrientes para recalcular instantaneamente o painel e os g/kg.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                Objetivo: {currentPatient.goal}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Peso Corporal (kg)
                </label>
                <input
                  type="number"
                  value={currentPatient.weightKg}
                  onChange={(e) => handleUpdateWeight(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Base para cálculo g/kg
                </span>
              </div>

              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Meta Calorias (kcal)
                </label>
                <input
                  type="number"
                  value={currentPatient.targets.kcal}
                  onChange={(e) => handleUpdateTarget('kcal', e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-emerald-400 focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {Math.round(currentPatient.targets.kcal / currentPatient.weightKg)} kcal/kg
                </span>
              </div>

              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  value={currentPatient.targets.protein}
                  onChange={(e) => handleUpdateTarget('protein', e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  {(currentPatient.targets.protein / currentPatient.weightKg).toFixed(2)} g/kg
                </span>
              </div>

              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Carboidratos (g)
                </label>
                <input
                  type="number"
                  value={currentPatient.targets.carbs}
                  onChange={(e) => handleUpdateTarget('carbs', e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-sky-400 mt-1 block">
                  {(currentPatient.targets.carbs / currentPatient.weightKg).toFixed(2)} g/kg
                </span>
              </div>

              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Lipídios / Gord. (g)
                </label>
                <input
                  type="number"
                  value={currentPatient.targets.fat}
                  onChange={(e) => handleUpdateTarget('fat', e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-amber-400 mt-1 block">
                  {(currentPatient.targets.fat / currentPatient.weightKg).toFixed(2)} g/kg
                </span>
              </div>

              <div className="bg-[#090a0f] border border-[#1e2230] p-3 rounded-xl">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Meta de Água (ml)
                </label>
                <input
                  type="number"
                  value={currentPatient.targets.waterMl}
                  onChange={(e) => handleUpdateTarget('waterMl', e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-cyan-400 focus:outline-none border-b border-zinc-700 focus:border-emerald-400"
                />
                <span className="text-[11px] text-cyan-400 mt-1 block">
                  {Math.round(currentPatient.targets.waterMl / currentPatient.weightKg)} ml/kg
                </span>
              </div>
            </div>
          </section>
        )}

        {/* RESUMO SUPERIOR: CALORIAS, MACRONUTRIENTES (g e g/kg) E HIDRATAÇÃO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card Principal de Calorias */}
          <div className="lg:col-span-4 bg-[#12141c] border border-[#1e2230] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  Balanço Energético Diário
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{currentPatient.name}</h2>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="my-2 flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {Math.round(dailyTotals.kcal)}
                  <span className="text-base font-normal text-zinc-400">
                    {' '}
                    / {currentPatient.targets.kcal} kcal
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {remainingKcal >= 0 ? (
                    <>
                      Restam <strong className="text-emerald-400">{remainingKcal} kcal</strong> para atingir a meta prescrita
                    </>
                  ) : (
                    <>
                      Meta superada em{' '}
                      <strong className="text-amber-400">{Math.abs(remainingKcal)} kcal</strong>
                    </>
                  )}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center shrink-0 bg-[#090a0f]">
                <span className="text-sm font-extrabold text-emerald-400">{kcalPct}%</span>
              </div>
            </div>

            {/* Barra de progresso calórica */}
            <div className="mt-4">
              <div className="w-full h-3 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#00e676] transition-all duration-500"
                  style={{ width: `${kcalPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400 mt-2">
                <span>Peso atual: {currentPatient.weightKg} kg</span>
                <span>Fibras: {dailyTotals.fiber.toFixed(1)}g / {currentPatient.targets.fiber}g</span>
              </div>
            </div>
          </div>

          {/* Cards de Macronutrientes com g/kg */}
          <div className="lg:col-span-5 bg-[#12141c] border border-[#1e2230] rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Divisão de Macronutrientes
                </span>
                <h3 className="text-base font-bold text-white">Metas e Taxa por Quilo (g/kg)</h3>
              </div>
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-3.5 my-auto">
              {/* Proteínas */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    Proteínas
                    <span className="text-[11px] font-normal text-zinc-400">
                      ({(dailyTotals.protein / currentPatient.weightKg).toFixed(2)} g/kg consumido)
                    </span>
                  </span>
                  <span className="font-bold text-emerald-400">
                    {dailyTotals.protein.toFixed(1)}g{' '}
                    <span className="text-zinc-500 font-normal">/ {currentPatient.targets.protein}g</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (dailyTotals.protein / (currentPatient.targets.protein || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Carboidratos */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                    Carboidratos
                    <span className="text-[11px] font-normal text-zinc-400">
                      ({(dailyTotals.carbs / currentPatient.weightKg).toFixed(2)} g/kg consumido)
                    </span>
                  </span>
                  <span className="font-bold text-sky-400">
                    {dailyTotals.carbs.toFixed(1)}g{' '}
                    <span className="text-zinc-500 font-normal">/ {currentPatient.targets.carbs}g</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230]">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (dailyTotals.carbs / (currentPatient.targets.carbs || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Lipídios / Gorduras */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Gorduras (Lipídios)
                    <span className="text-[11px] font-normal text-zinc-400">
                      ({(dailyTotals.fat / currentPatient.weightKg).toFixed(2)} g/kg consumido)
                    </span>
                  </span>
                  <span className="font-bold text-amber-400">
                    {dailyTotals.fat.toFixed(1)}g{' '}
                    <span className="text-zinc-500 font-normal">/ {currentPatient.targets.fat}g</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230]">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (dailyTotals.fat / (currentPatient.targets.fat || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card de Hidratação + Status de Micronutrientes */}
          <div className="lg:col-span-3 bg-[#12141c] border border-[#1e2230] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                  Hidratação Diária
                </span>
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {currentPatient.waterConsumed} ml
                <span className="text-xs font-normal text-zinc-400">
                  {' '}
                  / {currentPatient.targets.waterMl} ml
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230] mt-2">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentPatient.waterConsumed / (currentPatient.targets.waterMl || 1)) * 100
                    )}%`
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <button
                  onClick={() => handleUpdateWater(250)}
                  className="py-1.5 px-2 rounded-lg bg-[#090a0f] hover:bg-cyan-500/15 border border-[#1e2230] hover:border-cyan-500/40 text-xs font-semibold text-cyan-300 transition"
                >
                  +250ml
                </button>
                <button
                  onClick={() => handleUpdateWater(500)}
                  className="py-1.5 px-2 rounded-lg bg-[#090a0f] hover:bg-cyan-500/15 border border-[#1e2230] hover:border-cyan-500/40 text-xs font-semibold text-cyan-300 transition"
                >
                  +500ml
                </button>
                <button
                  onClick={() => handleUpdateWater(-250)}
                  className="py-1.5 px-2 rounded-lg bg-[#090a0f] hover:bg-rose-500/15 border border-[#1e2230] text-xs font-semibold text-zinc-400 hover:text-rose-300 transition"
                >
                  -250ml
                </button>
              </div>
            </div>

            {/* Resumo Rápido de Micronutrientes */}
            <div className="mt-4 pt-3 border-t border-[#1e2230] flex items-center justify-between">
              <div className="text-xs">
                <span className="text-zinc-400 block">Rastreio de Micronutrientes:</span>
                {microAlerts.low.length === 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Excelente densidade nutricional
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> {microAlerts.low.length} micros abaixo de 50%
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveTab('micros')}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center"
              >
                Ver 15 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* NAVEGAÇÃO DE ABAS PRINCIPAIS DO APLICATIVO */}
        <nav className="flex flex-wrap items-center gap-2 border-b border-[#1e2230] pb-3">
          <button
            onClick={() => setActiveTab('diario')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'diario'
                ? 'bg-emerald-500 text-[#090a0f] shadow-lg shadow-emerald-500/20'
                : 'bg-[#12141c] text-zinc-300 hover:text-white border border-[#1e2230]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Diário de Refeições & Contador
          </button>

          <button
            onClick={() => setActiveTab('micros')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'micros'
                ? 'bg-emerald-500 text-[#090a0f] shadow-lg shadow-emerald-500/20'
                : 'bg-[#12141c] text-zinc-300 hover:text-white border border-[#1e2230]'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Painel de Micronutrientes (15 Vitaminas & Minerais)
            {microAlerts.low.length > 0 && (
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-extrabold ${
                  activeTab === 'micros'
                    ? 'bg-[#090a0f] text-emerald-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {microAlerts.low.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('equivalencia')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'equivalencia'
                ? 'bg-emerald-500 text-[#090a0f] shadow-lg shadow-emerald-500/20'
                : 'bg-[#12141c] text-zinc-300 hover:text-white border border-[#1e2230]'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Calculadora de Substituição (Equivalência)
          </button>

          <button
            onClick={() => setActiveTab('alimentos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'alimentos'
                ? 'bg-emerald-500 text-[#090a0f] shadow-lg shadow-emerald-500/20'
                : 'bg-[#12141c] text-zinc-300 hover:text-white border border-[#1e2230]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cadastrar Alimento (Base TACO)
          </button>
        </nav>

        {/* =========================================================
            ABA 1: DIÁRIO ALIMENTAR + PAINEL RÁPIDO DE MICRONUTRIENTES
           ========================================================= */}
        {activeTab === 'diario' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna Esquerda: Registro de Alimentos e Refeições do Dia */}
            <div className="lg:col-span-7 space-y-5">
              {/* Formulário de Adição Rápida de Alimento */}
              <div className="bg-[#12141c] border border-[#1e2230] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-400" />
                    Adicionar Alimento ao Diário
                  </h3>
                  <span className="text-[11px] text-zinc-400">Cálculo proporcional automático</span>
                </div>

                <form onSubmit={handleAddFoodToMeal} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Refeição */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1">
                        Refeição
                      </label>
                      <select
                        value={addingMealId}
                        onChange={(e) => setAddingMealId(e.target.value)}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        {MEAL_SLOTS.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.title} ({slot.time})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Escolha do Alimento */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1">
                        Alimento (Tabela TACO)
                      </label>
                      <select
                        value={selectedFoodId}
                        onChange={(e) => handleSelectFoodToAdd(e.target.value)}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        {foodDb.map((food) => (
                          <option key={food.id} value={food.id}>
                            {food.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantidade em Gramas */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1">
                        Quantidade (g/ml)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={selectedGrams}
                        onChange={(e) => setSelectedGrams(e.target.value)}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Preview instantâneo do alimento antes de inserir */}
                  {previewSelectedFood && (
                    <div className="bg-[#090a0f] border border-[#1e2230] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-zinc-400">Medida caseira ref.: </span>
                        <strong className="text-zinc-200">{previewSelectedFood.measureDesc}</strong>
                        <div className="flex flex-wrap gap-3 mt-1 font-semibold">
                          <span className="text-emerald-400">{previewSelectedFood.calcKcal} kcal</span>
                          <span className="text-zinc-300">P: {previewSelectedFood.calcProtein}g</span>
                          <span className="text-sky-400">C: {previewSelectedFood.calcCarbs}g</span>
                          <span className="text-amber-400">G: {previewSelectedFood.calcFat}g</span>
                          <span className="text-zinc-400">Fibras: {previewSelectedFood.calcFiber}g</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#090a0f] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Lançar na Refeição
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Lista de Refeições do Dia */}
              <div className="space-y-4">
                {MEAL_SLOTS.map((slot) => {
                  const mealLogs = currentPatient.logs.filter((l) => l.mealId === slot.id);
                  let mealKcal = 0;
                  let mealP = 0;
                  let mealC = 0;
                  let mealF = 0;

                  mealLogs.forEach((l) => {
                    const food = foodDb.find((f) => f.id === l.foodId);
                    if (food) {
                      const r = l.grams / 100;
                      mealKcal += food.kcal * r;
                      mealP += food.protein * r;
                      mealC += food.carbs * r;
                      mealF += food.fat * r;
                    }
                  });

                  return (
                    <div
                      key={slot.id}
                      className="bg-[#12141c] border border-[#1e2230] rounded-2xl overflow-hidden"
                    >
                      <div className="px-5 py-3.5 bg-[#0d0f17] border-b border-[#1e2230] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <h4 className="font-bold text-sm sm:text-base text-white">{slot.title}</h4>
                          <span className="text-xs text-zinc-500">({slot.time})</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-emerald-400">{Math.round(mealKcal)} kcal</span>
                          <span className="text-zinc-400">
                            P: {mealP.toFixed(0)}g · C: {mealC.toFixed(0)}g · G: {mealF.toFixed(0)}g
                          </span>
                        </div>
                      </div>

                      {mealLogs.length === 0 ? (
                        <div className="p-4 text-xs text-zinc-500 flex items-center justify-between">
                          <span>Nenhum alimento registrado nesta refeição.</span>
                          <button
                            onClick={() => setAddingMealId(slot.id)}
                            className="text-emerald-400 font-semibold hover:underline"
                          >
                            + Selecionar refeição
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#1e2230]">
                          {mealLogs.map((log) => {
                            const food = foodDb.find((f) => f.id === log.foodId);
                            if (!food) return null;
                            const r = log.grams / 100;
                            return (
                              <div
                                key={log.id}
                                className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#161924] transition"
                              >
                                <div>
                                  <div className="text-sm font-semibold text-zinc-100">
                                    {food.name}{' '}
                                    <span className="text-emerald-400 font-bold">({log.grams}g)</span>
                                  </div>
                                  <div className="text-[11px] text-zinc-400 flex flex-wrap gap-2.5 mt-0.5">
                                    <span>{Math.round(food.kcal * r)} kcal</span>
                                    <span>• P: {(food.protein * r).toFixed(1)}g</span>
                                    <span>• C: {(food.carbs * r).toFixed(1)}g</span>
                                    <span>• G: {(food.fat * r).toFixed(1)}g</span>
                                    {food.micros?.ferro > 0 && (
                                      <span className="text-zinc-500">
                                        • Ferro: {(food.micros.ferro * r).toFixed(1)}mg
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveLog(log.id)}
                                  title="Remover item"
                                  className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coluna Direita: Visão Rápida de Micronutrientes no Próprio Diário */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#12141c] border border-[#1e2230] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Monitoramento Biológico
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Termômetro de Micronutrientes (DRI)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('micros')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition"
                  >
                    Expandir Todos
                  </button>
                </div>

                <p className="text-xs text-zinc-400 mb-4">
                  Abaixo estão os 15 principais minerais e vitaminas calculados automaticamente a partir dos alimentos lançados nas refeições de hoje:
                </p>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {MICRONUTRIENT_SPECS.map((spec) => {
                    const currentVal = dailyTotals.micros[spec.key] || 0;
                    const pct = Math.round((currentVal / spec.target) * 100);
                    const clampedPct = Math.min(100, pct);

                    let barColor = 'bg-emerald-400';
                    let badgeColor = 'text-emerald-400';
                    if (spec.isUpperLimit) {
                      if (pct > 100) {
                        barColor = 'bg-rose-500';
                        badgeColor = 'text-rose-400';
                      } else {
                        barColor = 'bg-sky-400';
                        badgeColor = 'text-sky-400';
                      }
                    } else if (pct < 50) {
                      barColor = 'bg-amber-400';
                      badgeColor = 'text-amber-400';
                    }

                    return (
                      <div
                        key={spec.key}
                        className="bg-[#090a0f] border border-[#1e2230] rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div>
                            <span className="font-bold text-white">{spec.name}</span>
                            <span className="text-[11px] text-zinc-500 ml-1.5">({spec.desc})</span>
                          </div>
                          <span className={`font-bold ${badgeColor}`}>
                            {currentVal.toFixed(1)} / {spec.target} {spec.unit} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#12141c] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${clampedPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            ABA 2: PAINEL COMPLETO DE MICRONUTRIENTES (DESTAQUE)
           ========================================================= */}
        {activeTab === 'micros' && (
          <section className="space-y-6">
            {/* Cabeçalho e Filtros de Vitaminas e Minerais */}
            <div className="bg-[#12141c] border border-[#1e2230] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Análise de Densidade Nutricional — Riesley Ribeiro Nutrição
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Rastreador Completo de Vitaminas & Minerais (DRI)
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Monitoramento clínico para evitar deficiências ocultas, otimizar recuperação muscular, função tireoidiana e imunidade.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos (15)' },
                  { id: 'mineral', label: 'Minerais (8)' },
                  { id: 'vitamina', label: 'Vitaminas (7)' },
                  { id: 'alerta', label: `Atenção (<50%) (${microAlerts.low.length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMicroFilter(f.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      microFilter === f.id
                        ? 'bg-emerald-500 text-[#090a0f]'
                        : 'bg-[#090a0f] text-zinc-400 hover:text-white border border-[#1e2230]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Detalhado de Cards de Micronutrientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MICRONUTRIENT_SPECS.filter((spec) => {
                if (microFilter === 'mineral') return spec.type === 'mineral';
                if (microFilter === 'vitamina') return spec.type === 'vitamina';
                if (microFilter === 'alerta') {
                  const val = dailyTotals.micros[spec.key] || 0;
                  const pct = (val / spec.target) * 100;
                  return spec.isUpperLimit ? pct > 100 : pct < 50;
                }
                return true;
              }).map((spec) => {
                const val = dailyTotals.micros[spec.key] || 0;
                const pct = Math.round((val / spec.target) * 100);
                const clampedPct = Math.min(100, pct);

                let statusLabel = 'Adequado';
                let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
                let barColor = 'bg-emerald-400';

                if (spec.isUpperLimit) {
                  if (pct > 100) {
                    statusLabel = 'Acima do Limite';
                    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
                    barColor = 'bg-rose-500';
                  } else {
                    statusLabel = 'Dentro do Limite';
                    statusColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
                    barColor = 'bg-sky-400';
                  }
                } else {
                  if (pct < 50) {
                    statusLabel = 'Baixa Ingestão (<50%)';
                    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
                    barColor = 'bg-amber-400';
                  } else if (pct < 90) {
                    statusLabel = 'Em Progresso';
                    statusColor = 'text-sky-400 bg-sky-500/10 border-sky-500/30';
                    barColor = 'bg-sky-400';
                  }
                }

                return (
                  <div
                    key={spec.key}
                    className="bg-[#12141c] border border-[#1e2230] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#090a0f] text-zinc-400 border border-[#1e2230]">
                          {spec.type === 'mineral' ? 'Mineral' : 'Vitamina'}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-white">{spec.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{spec.desc}</p>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xl font-black text-white">
                          {val.toFixed(1)} <span className="text-xs font-normal text-zinc-400">{spec.unit}</span>
                        </span>
                        <span className="text-xs font-bold text-zinc-300">
                          Meta DRI: {spec.target} {spec.unit} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#090a0f] rounded-full overflow-hidden border border-[#1e2230]">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${clampedPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================
            ABA 3: CALCULADORA DE EQUIVALÊNCIA / SUBSTITUIÇÃO RÁPIDA
           ========================================================= */}
        {activeTab === 'equivalencia' && (
          <section className="bg-[#12141c] border border-[#1e2230] rounded-2xl p-6 space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Flexibilidade na Dieta
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Calculadora de Substituição Equivalente
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Escolha um alimento prescrito no plano alimentar e a quantidade em gramas para descobrir exatamente quanto consumir de outros alimentos do mesmo grupo mantendo as mesmas calorias.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#090a0f] border border-[#1e2230] p-4 rounded-xl">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                  Alimento Base Prescrito
                </label>
                <select
                  value={swapBaseFoodId}
                  onChange={(e) => setSwapBaseFoodId(e.target.value)}
                  className="w-full bg-[#12141c] border border-[#1e2230] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {foodDb.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                  Quantidade Prescrita (gramas)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={swapBaseGrams}
                  onChange={(e) => setSwapBaseGrams(e.target.value)}
                  className="w-full bg-[#12141c] border border-[#1e2230] rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {swapResults.baseFood && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-zinc-200">
                    Referência selecionada:{' '}
                    <strong className="text-white">
                      {swapBaseGrams}g de {swapResults.baseFood.name}
                    </strong>{' '}
                    ({swapResults.baseFood.category})
                  </div>
                  <div className="text-sm font-extrabold text-emerald-400">
                    Equivale a {swapResults.targetKcal} kcal
                  </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Opções de Substituição no Grupo ({swapResults.baseFood.category}):
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {swapResults.equivalents.map((eq) => (
                    <div
                      key={eq.id}
                      className="bg-[#090a0f] border border-[#1e2230] rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs text-zinc-500">{eq.category}</span>
                        <h4 className="text-base font-bold text-white mt-0.5">{eq.name}</h4>
                      </div>
                      <div className="my-3 pt-3 border-t border-[#1e2230]">
                        <div className="text-2xl font-black text-emerald-400">
                          {eq.neededGrams}g
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Fornece {eq.eqKcal} kcal • P: {eq.eqProtein}g • C: {eq.eqCarbs}g • G: {eq.eqFat}g
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            ABA 4: CADASTRAR NOVO ALIMENTO NO BANCO DE DADOS
           ========================================================= */}
        {activeTab === 'alimentos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulário de Cadastro */}
            <div className="lg:col-span-5 bg-[#12141c] border border-[#1e2230] rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-1">
                Cadastrar Alimento ou Suplemento (Por 100g)
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Adicione novos itens personalizados da sua consultoria com calorias, macronutrientes e micronutrientes.
              </p>

              {customFoodSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                  Alimento cadastrado com sucesso e já disponível no Diário!
                </div>
              )}

              <form onSubmit={handleCreateCustomFood} className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase text-zinc-400 mb-1">
                    Nome do Alimento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tilápia Grelhada, Creatina, Iogurte Natural..."
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase text-zinc-400 mb-1">
                      Grupo Alimentar
                    </label>
                    <select
                      value={newFood.category}
                      onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="Carboidratos">Carboidratos</option>
                      <option value="Proteínas">Proteínas</option>
                      <option value="Proteínas & Gorduras">Proteínas & Gorduras</option>
                      <option value="Gorduras">Gorduras</option>
                      <option value="Frutas">Frutas</option>
                      <option value="Vegetais">Vegetais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase text-zinc-400 mb-1">
                      Calorias (kcal/100g) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 128"
                      value={newFood.kcal}
                      onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Prot (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newFood.protein}
                      onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Carb (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Gord (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newFood.fat}
                      onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Fibra (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newFood.fiber}
                      onChange={(e) => setNewFood({ ...newFood, fiber: e.target.value })}
                      className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e2230]">
                  <span className="block text-[11px] font-bold uppercase text-emerald-400 mb-2">
                    Micronutrientes Principais por 100g (Opcional)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400">Ferro (mg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={newFood.ferro}
                        onChange={(e) => setNewFood({ ...newFood, ferro: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400">Cálcio (mg)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="0"
                        value={newFood.calcio}
                        onChange={(e) => setNewFood({ ...newFood, calcio: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400">Magnésio (mg)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="0"
                        value={newFood.magnesio}
                        onChange={(e) => setNewFood({ ...newFood, magnesio: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400">Potássio (mg)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="0"
                        value={newFood.potassio}
                        onChange={(e) => setNewFood({ ...newFood, potassio: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400">Sódio (mg)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="0"
                        value={newFood.sodio}
                        onChange={(e) => setNewFood({ ...newFood, sodio: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400">Vit. C (mg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={newFood.vitC}
                        onChange={(e) => setNewFood({ ...newFood, vitC: e.target.value })}
                        className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#090a0f] font-extrabold text-xs uppercase tracking-wider transition mt-2 cursor-pointer"
                >
                  Salvar na Base da Consultoria
                </button>
              </form>
            </div>

            {/* Tabela de Alimentos Cadastrados */}
            <div className="lg:col-span-7 bg-[#12141c] border border-[#1e2230] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-base font-bold text-white">
                  Alimentos Cadastrados na Base TACO ({filteredFoods.length})
                </h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar alimento..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="bg-[#090a0f] border border-[#1e2230] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredFoods.map((f) => (
                  <div
                    key={f.id}
                    className="bg-[#090a0f] border border-[#1e2230] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{f.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#12141c] text-emerald-400 border border-[#1e2230]">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Por 100g: <strong className="text-white">{f.kcal} kcal</strong> • Prot:{' '}
                        {f.protein}g • Carb: {f.carbs}g • Gord: {f.fat}g • Fibras: {f.fiber}g
                      </p>
                    </div>
                    <div className="text-[11px] text-zinc-400 sm:text-right">
                      <div>Fe: {f.micros?.ferro}mg • Ca: {f.micros?.calcio}mg</div>
                      <div>Mg: {f.micros?.magnesio}mg • K: {f.micros?.potassio}mg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}