// Манифест оптимизированных изображений презентации «Соболёк».
// Исходники живут вне репозитория; в public/sobolek/ — WebP-копии
// в трёх ширинах (480 / 960 / максимальная), имена: <name>-<width>.webp.

export type SobolekImage = {
  /** Базовое имя файла в public/sobolek/ */
  name: string;
  /** Доступные ширины, по возрастанию (последняя = интринсик) */
  widths: number[];
  /** Интринсик-размеры самой крупной версии (для width/height, анти-CLS) */
  width: number;
  height: number;
  alt: string;
};

export const IMAGES = {
  hero: {
    name: "hero",
    widths: [480, 960, 1122],
    width: 1122,
    height: 1402,
    alt: "Соболёк — белый антропоморфный соболь в бело-бирюзовой спортивной одежде и кепке — с планшетом в лапе приветственно машет пользователю",
  },
  direction: {
    name: "direction",
    widths: [480, 960, 1122],
    width: 1122,
    height: 1402,
    alt: "Утверждённый образ Соболька: персонаж с планшетом в лапе, пушистый белый хвост с тёмным кончиком читается в силуэте",
  },
  passportFront: {
    name: "passport-front",
    widths: [480, 960, 1122],
    width: 1122,
    height: 1402,
    alt: "Паспорт персонажа: Соболёк в полный рост, вид спереди, руки свободно опущены",
  },
  passportTurnaround: {
    name: "passport-turnaround",
    widths: [480, 960, 1600],
    width: 1600,
    height: 900,
    alt: "Три ракурса Соболька в варианте с шарфом: вид спереди, вид сзади и промежуточный ракурс",
  },
  passportApose: {
    name: "passport-apose",
    widths: [480, 960, 1086],
    width: 1086,
    height: 1448,
    alt: "Соболёк в A-позе в фирменной одежде — базовая поза для 3D-моделирования",
  },
  passportAnatomy: {
    name: "passport-anatomy",
    widths: [480, 960, 1086],
    width: 1086,
    height: 1448,
    alt: "Базовая анатомия Соболька: A-поза без одежды и обуви для построения 3D-модели",
  },
  modelSculpt: {
    name: "model-sculpt",
    widths: [480, 960, 1412],
    width: 1412,
    height: 960,
    alt: "Скульпт предварительной 3D-модели Соболька: серый рендер без материалов, ракурс три четверти",
  },
  modelWireframe: {
    name: "model-wireframe",
    widths: [480, 960, 1496],
    width: 1496,
    height: 1004,
    alt: "Полигональная сетка предварительной 3D-модели Соболька, вид спереди",
  },
  modelParts: {
    name: "model-parts",
    widths: [480, 960, 1332],
    width: 1332,
    height: 976,
    alt: "Рабочая разбивка 3D-модели на элементы: тело, кепка, жилет, футболка, шорты, кроссовки и хвост выделены цветом",
  },
} as const satisfies Record<string, SobolekImage>;
