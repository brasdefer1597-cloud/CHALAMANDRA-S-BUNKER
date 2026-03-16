import { ChessPiece, StrategyTactic } from '../types';

export const CHESS_PIECES: ChessPiece[] = [
  {
    id: 'king',
    name: 'El Rey',
    criminalRole: 'El Patrón / Capo',
    description: 'La pieza más valiosa pero la más vulnerable. Su caída significa el fin de la partida. Mantiene la visión estratégica y delega todas las operaciones de riesgo.',
    chessFunction: 'Movimiento limitado, objetivo de protección absoluta.',
    criminalFunction: 'Toma decisiones estratégicas, delega operaciones, evita la exposición directa.',
    riskLevel: 'Critical',
    icon: 'Crown', // Mapped icon
    color: 'text-amber-400'
  },
  {
    id: 'queen',
    name: 'La Dama',
    criminalRole: 'El Lugarteniente / Brazo Derecho',
    description: 'La pieza más poderosa y versátil del tablero. Proyecta el poder del líder y ejecuta operaciones complas y sensibles.',
    chessFunction: 'Movimiento ilimitado en cualquier dirección. Ataque y defensa.',
    criminalFunction: 'Ejecuta operaciones complas, gestiona sub-líderes, coordina logística a gran escala.',
    riskLevel: 'High',
    icon: 'StarIcon', // Mapped icon
    color: 'text-fuchsia-500'
  },
  {
    id: 'rook',
    name: 'Las Torres',
    criminalRole: 'Infraestructura & Plazas',
    description: 'Representan el poderío fijo y territorial. Controlan rutas, laboratorios y territorios específicos, garantizando la logística.',
    chessFunction: 'Movimiento lineal de largo alcance. Control de columnas.',
    criminalFunction: 'Rutas de transporte, laboratorios, almacenes, control de territorios físicos.',
    riskLevel: 'Medium',
    icon: 'Castle', // Mapped icon
    color: 'text-indigo-400'
  },
  {
    id: 'bishop',
    name: 'Los Alfiles',
    criminalRole: 'Socios Especializados (Legal/Lavado)',
    description: 'Operan de forma indirecta (diagonal), atravesando defensas institucionales. Son los encargados de la infiltración y el blanqueo.',
    chessFunction: 'Movimiento diagonal. Control de colores específicos.',
    criminalFunction: 'Abogados, contadores, corrupción de funcionarios, relaciones públicas.',
    riskLevel: 'Medium',
    icon: 'BookOpen', // Mapped icon
    color: 'text-cyan-400'
  },
  {
    id: 'knight',
    name: 'Los Caballos',
    criminalRole: 'Operativos Tácticos / Sicarios',
    description: 'Capacidad de saltar obstáculos y atacar de forma impredecible. Son la herramienta de choque y coerción de la organización.',
    chessFunction: 'Movimiento en L. Única pieza que puede saltar sobre otras.',
    criminalFunction: 'Emboscadas, ajustes de cuentas, movimientos sorpresa, evasión de cercos policiales.',
    riskLevel: 'High',
    icon: 'ShieldAlert', // Mapped icon
    color: 'text-red-500'
  },
  {
    id: 'pawn',
    name: 'Los Peones',
    criminalRole: 'Soldados / Punteros',
    description: 'La primera línea de defensa. Prescindibles individualmente, fuertes en número. Su potencial de ascenso (promoción) es un gran incentivo.',
    chessFunction: 'Avance lento, captura diagonal. Promoción potencial.',
    criminalFunction: 'Vigilancia, menudeo, carne de cañón. Si sobreviven, pueden ascender en la jerarquía.',
    riskLevel: 'Low',
    icon: 'Users', // Mapped icon
    color: 'text-green-500'
  }
];

export const STRATEGIES: StrategyTactic[] = [
  {
    id: 'vision',
    title: 'Visión de Tablero',
    chessConcept: 'Pensamiento a largo plazo (Grandmaster Vision).',
    criminalConcept: 'Planificación generacional, anticipación a leyes y rivales.',
    icon: 'Eye' // Mapped icon
  },
  {
    id: 'sacrifice',
    title: 'Sacrificio Táctico',
    chessConcept: 'Gambitos y sacrificios de calidad, buscando una ventaja posicional superior.',
    criminalConcept: 'Entregar cargamentos o subordinados (Peones) para desviar la atención y salvar la estructura central.',
    icon: 'Skull' // Mapped icon
  },
  {
    id: 'control',
    title: 'Control del Centro',
    chessConcept: 'Dominio de las casillas centrales (e4, d4, e5, d5) que otorgan movilidad.',
    criminalConcept: 'Dominio de nodos logísticos clave: puertos, fronteras y jueces (Alfiles/Torres).',
    icon: 'Crosshair' // Mapped icon
  },
  {
    id: 'tempo',
    title: 'Iniciativa y Tempo',
    chessConcept: 'Forzar al rival a reaccionar a tus movimientos, ganando tiempo.',
    criminalConcept: 'Ataques constantes o expansión económica que desbordan a la competencia o las autoridades.',
    icon: 'Activity' // Mapped icon
  }
];

export const REALITY_CHECKS = [
  {
    title: 'El Factor Humano',
    content: 'A diferencia de las piezas de madera, los criminales tienen miedo, ambición y pueden traicionar. Una Torre nunca delata al Rey; un jefe de plaza sí.',
    icon: 'User' // Mapped icon
  },
  {
    title: 'Tablero Dinámico',
    content: 'En el ajedrez, las reglas son fijas. En el crimen, las leyes cambian, los gobiernos caen y la tecnología altera el juego constantemente, creando un tablero sin fin.',
    icon: 'TrendingUp' // Mapped icon
  },
  {
    title: 'Jaque Mate Mortal',
    content: 'En el deporte se reinicia la partida. En la realidad, el Jaque Mate suele significar cadena perpetua o muerte, y la organización se disuelve o se reestructura.',
    icon: 'Skull' // Mapped icon
  }
];