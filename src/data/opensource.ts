export type Contribution = {
  id: string;
  title: string;
  description: string;
  link: string;
  status: "Merged" | "Open" | "Closed";
  date: string;
};

export type OpenSourceProject = {
  name: string;
  slug: string;
  logoLight: string;
  logoDark: string;
  link: string;
  description: string;
  prs: Contribution[];
  issues: Contribution[];
};

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: "Bruno",
    slug: "bruno",
    logoLight: "/images/opensource/bruno-light.svg",
    logoDark: "/images/opensource/bruno-dark.svg",
    link: "https://github.com/usebruno/bruno",
    description:
      "Лёгкий open-source клиент API для тестирования и исследования API.",
    prs: [
      {
        id: "9295",
        title:
          "fix(app): вернуть Ctrl+Y для Redo и объединить переключение свёртки в Ctrl+I",
        description:
          "Восстановлено сочетание Ctrl+Y для Redo в компонентах CodeEditor и перенесено переключение свёртки документа на Ctrl+I по всему приложению.",
        link: "https://github.com/usebruno/bruno/pull/9295",
        status: "Open",
        date: "Sep 2026",
      },
    ],
    issues: [],
  },
  {
    name: "Excalidraw",
    slug: "excalidraw",
    logoLight: "/images/opensource/excalidraw-light.webp",
    logoDark: "/images/opensource/excalidraw-dark.webp",
    link: "https://github.com/excalidraw/excalidraw",
    description:
      "Виртуальная доска для совместной работы и набросков от руки.",
    prs: [
      {
        id: "12105",
        title:
          "fix(editor): сохранить обнаружение петель при масштабировании линейных элементов",
        description:
          "Сохранено обнаружение петель у линейных элементов при масштабировании за счёт проверок порога конечных точек.",
        link: "https://github.com/excalidraw/excalidraw/pull/12105",
        status: "Open",
        date: "Sep 2026",
      },
      {
        id: "11734",
        title: "fix: добавить подсказки к иконкам в шапке сайдбара",
        description:
          "Добавлены tooltips к кнопкам-иконкам в шапке сайдбара для лучшей заметности.",
        link: "https://github.com/excalidraw/excalidraw/pull/11734",
        status: "Open",
        date: "Jul 2026",
      },
    ],
    issues: [
      {
        id: "11731",
        title: "У иконок библиотечного сайдбара нет подсказок",
        description: "Отсутствуют tooltips у иконок библиотечного сайдбара.",
        link: "https://github.com/excalidraw/excalidraw/issues/11731",
        status: "Open",
        date: "Jul 2026",
      },
      {
        id: "11730",
        title: "Выпадающий список языков использует нативный select браузера",
        description:
          "Выбор языка оформлен нативным браузерным стилем вместо кастомных меню.",
        link: "https://github.com/excalidraw/excalidraw/issues/11730",
        status: "Open",
        date: "Jul 2026",
      },
    ],
  },
  {
    name: "Vengeance UI",
    slug: "vengeanceui",
    logoLight: "/images/opensource/vengeance-light.svg",
    logoDark: "/images/opensource/vengeance-dark.svg",
    link: "https://github.com/Ashutoshx7/VengeanceUI",
    description:
      "Современная React UI-библиотека с анимированными компонентами для эффектных лендингов.",
    prs: [
      {
        id: "86",
        title:
          "fix(docs): улучшить подсветку в codeblock, адаптив навбара и вкладки документации",
        description:
          "Улучшена подсветка синтаксиса в codeblock, адаптивность навбара и вкладки документации.",
        link: "https://github.com/Ashutoshx7/VengeanceUI/pull/86",
        status: "Merged",
        date: "Sep 2026",
      },
      {
        id: "69",
        title:
          "feat(docs): унифицировать и переработать UI codeblock с поддержкой двух тем",
        description:
          "Унифицирует дизайн CodeBlock и устраняет падения при разработке на Next.js.",
        link: "https://github.com/Ashutoshx7/VengeanceUI/pull/69",
        status: "Merged",
        date: "Aug 2026",
      },
    ],
    issues: [],
  },
  {
    name: "Reicon",
    slug: "reicon",
    logoLight: "/images/opensource/reicon-light.webp",
    logoDark: "/images/opensource/reicon-dark.webp",
    link: "https://github.com/dqev/reicon",
    description:
      "Тщательно собранная open-source библиотека SVG-иконок для современных веб-приложений.",
    prs: [
      {
        id: "67",
        title: "docs: подсветка синтаксиса в блоках кода MCP server",
        description:
          "Добавлена ручная JSX-подсветка в текстовые блоки кода в документации MCP Server.",
        link: "https://github.com/dqev/reicon/pull/67",
        status: "Merged",
        date: "Aug 2026",
      },
      {
        id: "66",
        title:
          "fix: исправить имена файлов при скачивании логотипа и CDN-прокси для svg",
        description:
          "Исправлена блокировка скачивания SVG из-за CORS и корректны имена файлов при загрузке.",
        link: "https://github.com/dqev/reicon/pull/66",
        status: "Merged",
        date: "Aug 2026",
      },
      {
        id: "63",
        title: "docs: подсветка синтаксиса в блоках troubleshooting",
        description:
          "Добавлена JSX-разметка подсветки в сниппеты troubleshooting.",
        link: "https://github.com/dqev/reicon/pull/63",
        status: "Merged",
        date: "Aug 2026",
      },
      {
        id: "62",
        title:
          "fix: включать ответы в экспорт FAQ в markdown и в LLM-чат",
        description:
          "Исправлен экспорт FAQ в markdown, где не попадали JSX-ответы.",
        link: "https://github.com/dqev/reicon/pull/62",
        status: "Merged",
        date: "Aug 2026",
      },
      {
        id: "61",
        title: "chore: исправить smoke test Header — дубли разрешения ссылок",
        description:
          "Исправлен падающий smoke test из-за дублирующего разрешения ссылок.",
        link: "https://github.com/dqev/reicon/pull/61",
        status: "Merged",
        date: "Aug 2026",
      },
      {
        id: "59",
        title: "fix: устранить CORS на illustration",
        description:
          "Устранена ошибка CORS, блокировавшая скачивание PNG/SVG.",
        link: "https://github.com/dqev/reicon/pull/59",
        status: "Merged",
        date: "Aug 2026",
      },
    ],
    issues: [
      {
        id: "57",
        title: "Блок кода illustration не прокручивается",
        description:
          "Окно предпросмотра кода illustration обрезает переполняющийся контент.",
        link: "https://github.com/dqev/reicon/issues/57",
        status: "Closed",
        date: "Aug 2026",
      },
    ],
  },
];
