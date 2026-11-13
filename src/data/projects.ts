import { projectTech } from "@/data/tech";
import type { TechItem } from "@/data/tech";

export interface Project {
  name: string;
  imgSrc: string;
  description: string;
  techStack: TechItem[];
  liveLink: string;
  githubLink: string;
  about: string;
  features: string[];
}

export const projects: Project[] = [
  {
    name: "Stargazer",
    imgSrc: "/projects/stargazer.png",
    description:
      "Клиентский инструмент для разработчиков: превращает stargazers GitHub и вехи репозитория в соцкарточки 1600×900 и праздничные MP4-циклы с 60 fps — на WebCodecs, HTML5 Canvas и Astro.",
    about:
      "Веб-приложение с приоритетом приватности для мейнтейнеров open source. Stargazer запрашивает актуальные метаданные контрибьюторов через GitHub REST API, рендерит детерминированные кадры canvas 1600×900 и кодирует нативные MP4-видеоциклы покадрово в браузере с WebCodecs — без очередей рендеринга на бэкенде и серверного трекинга.",
    features: [
      "Пайплайн WebCodecs и mp4-muxer в браузере кодирует настоящие MP4-циклы с 60 fps с аппаратным ускорением и без зависимости от бэкенда",
      "Полностью клиентская архитектура: GitHub Personal Access Token только во временном состоянии React — без трекинга на сервере и баз данных",
      "8 готовых 2D-движков анимации на canvas (Spotlight, Hyperdrive, Orbit, Milestone и др.) с детерминированной отрисовкой кадров за доли миллисекунды",
      "Интерактивная студия предпросмотра на Framer Motion с переключением темы между тёмным Obsidian и светлым Warm Stone",
    ],
    techStack: [
      projectTech.astro,
      projectTech.react,
      projectTech.typescript,
      projectTech.tailwindcss,
      projectTech.webcodecs,
      projectTech.framermotion,
    ],
    liveLink: "https://stargazer.charanmunur.in",
    githubLink: "https://github.com/CharanMunur/stargazer",
  },
  {
    name: "Shrtn",
    imgSrc: "/projects/shrtn.png",
    description:
      "Продакшен-сервис сокращения URL: редиректы на edge менее чем за 20 ms, умная маршрутизация по устройствам, самоуничтожающиеся ссылки и детальная аналитика кликов — Cloudflare, Render и Vercel.",
    about:
      "Полноценная платформа коротких ссылок и аналитики. Короткие ссылки обрабатываются за менее чем 20 ms через Go WebAssembly worker на Cloudflare Edge с Upstash Redis — клики асинхронно пишутся в PostgreSQL через Spring Boot. Поддерживаются кастомные алиасы, лимиты автодеактивации, защита паролем, умные редиректы iOS/Android, QR-коды и детальная аналитика по ссылкам: UTM, категории рефереров и скорость роста за 7 дней.",
    features: [
      "Go WebAssembly worker на Cloudflare Edge обрабатывает редиректы за менее чем 20 ms в 300+ точках по миру через Upstash Redis REST",
      "Кэш редиректов прогревается при создании ссылки, чтобы первый клик всегда шёл в Redis, а не в базу",
      "Ссылки с автодеактивацией отключаются и выталкиваются из кэша после достижения лимита кликов",
      "Умная маршрутизация по User-Agent на edge: отдельные цели для iOS, Android и desktop",
      "Учёт кликов асинхронно через ctx.waitUntil — запись аналитики не замедляет редирект",
      "Edge-кэширование статики убирает 502 от cold start на бесплатном тарифе Render",
      "Аналитика по ссылке: браузер, ОС, страна, категория реферера, UTM, теплокарта трафика 7×24 и скорость роста за 7 дней",
      "Защита паролем с bcrypt, генерация QR, экспорт аналитики в CSV или JSON",
    ],
    techStack: [
      // backend
      projectTech.go,
      projectTech.springboot,
      projectTech.postgresql,
      projectTech.redis,
      // frontend
      projectTech.react,
      projectTech.typescript,
      projectTech.tailwindcss,
      projectTech.shadcnui,
      projectTech.framermotion,
      // devops
      projectTech.cloudflare,
      projectTech.docker,
      // auth / other
      projectTech.jwt,
      projectTech.webassembly,
    ],
    liveLink: "https://shrtn.fun",
    githubLink: "https://github.com/CharanMunur/shrtn",
  },
  {
    name: "Clippy",
    imgSrc: "/projects/clippy.png",
    description:
      "Нативный менеджер буфера обмена для GNOME/Ubuntu: история текста и изображений, закрепление, поиск и перетаскивание записей прямо в другие приложения — как родной элемент рабочего стола.",
    about:
      "Сделал после перехода с Windows, когда не хватало истории буфера. Не нашёл в Linux аналога с аккуратным UI без тяжёлой настройки — написал сам на Rust с GTK4 и libadwaita. Следует системной светлой/тёмной теме и акцентному цвету, хранит всё локально без облака и телеметрии и тихо работает в фоне, пока не вызовешь глобальным сочетанием клавиш.",
    features: [
      "Автоматическая история буфера для текста и изображений, локально в SQLite",
      "Закрепление записей поверх списка — переживает «Очистить всё»",
      "Поиск по истории в реальном времени по мере ввода",
      "Клик копирует запись мгновенно, можно перетащить прямо в другое приложение",
      "Настраиваемое глобальное сочетание для показа/скрытия окна",
      "Нативный вид GNOME — системная тема и акцент через libadwaita",
      "Пакеты .deb и .rpm для Debian/Ubuntu и Fedora-семейства",
      "Без облачной синхронизации и телеметрии — всё остаётся на машине",
    ],
    techStack: [
      projectTech.rust,
      projectTech.gtk4,
      projectTech.libadwaita,
      projectTech.sqlite,
    ],
    liveLink: "https://github.com/CharanMunur/Clippy/releases",
    githubLink: "https://github.com/CharanMunur/clippy",
  },
  {
    name: "Markdown Editor",
    imgSrc: "/projects/markdown-editor.png",
    description:
      "Markdown-редактор на Monaco с живым предпросмотром в стиле GitHub, экспортом PDF через Print.js, переключением темы и опциональной синхронной прокруткой обеих панелей.",
    about:
      "Двухпанельный рабочий стол для написания и предпросмотра markdown в реальном времени. Monaco Editor для подсветки и автодополнения, справа — живой предпросмотр в стиле GitHub. Есть быстрый экспорт в PDF и синхронная прокрутка.",
    features: [
      "Monaco Editor с подсветкой синтаксиса и автодополнением",
      "Живой предпросмотр markdown в стиле GitHub в правой панели",
      "Синхронная прокрутка — превью следует за редактором при наборе",
      "Экспорт в PDF через Print.js одним кликом",
      "Копирование всего содержимого в буфер",
      "Переключение тёмной и светлой темы",
      "Сохранение в localStorage между сессиями",
      "Встроенный демо-файл markdown для быстрого старта",
    ],
    techStack: [
      // frontend core
      projectTech.react,
      projectTech.javascript,
      projectTech.tailwindcss,
      // main lib
      projectTech.monaco,
      // build tool
      projectTech.vite,
    ],
    liveLink: "https://markdown-editor-v1.netlify.app/",
    githubLink: "https://github.com/CharanMunur/markdown-editor",
  },
  {
    name: "Shadcn Scaffold",
    imgSrc: "/projects/shadcn-scaffold.png",
    description:
      "CLI-инструмент, который за мгновение поднимает готовые к продакшену React-приложения с Vite, TypeScript, Tailwind CSS v4 и shadcn/ui.",
    about:
      "Чтобы убрать усталость от бойлерплейта. shadcn-scaffold — интерактивная командная строка, которая полностью автоматизирует современный сетап React-проекта: алиасы путей, провайдеры тёмной темы, тяжёлые зависимости — часы ручной настройки сжимаются в одну быструю команду в терминале.",
    features: [
      "Интерактивный TUI на React Ink с динамическим выбором пакетов",
      "Интеграция Tailwind CSS v4 и базовых компонентов shadcn/ui без ручной настройки",
      "Подключает рабочие Theme Provider и переключатели режима",
      "Патчит tsconfig.json и настройки Vite для исправления алиасов путей",
      "Оркестрация дочерних процессов (Execa) для надёжной установки зависимостей",
      "Опубликован в NPM — запуск через npx или bunx",
    ],
    techStack: [
      projectTech.nodejs,
      projectTech.typescript,
      projectTech.ink,
      projectTech.commander,
      projectTech.execa,
    ],
    liveLink: "https://www.npmjs.com/package/shadcn-scaffold",
    githubLink: "https://github.com/CharanMunur/shadcn-scaffold",
  },
  {
    name: "SuperTodo",
    imgSrc: "/projects/supertodo.png",
    description:
      "Полнофункциональный todo: приоритеты, сроки, подзадачи и группировка по датам. Анимации на Framer Motion и UI на shadcn/ui для отполированного опыта.",
    about:
      "Личное приложение для продуктивности — больше, чем простой список. Подзадачи, приоритеты, дедлайны и группировка по датам для наглядного обзора. React, shadcn/ui и Framer Motion с упором на анимации и качественный UX.",
    features: [
      "Создание, редактирование и удаление задач с подзадачами и отметкой выполнения",
      "Приоритеты (High, Medium, Low) с визуальными индикаторами",
      "Выбор срока и представления с группировкой по датам",
      "Фильтры All, Pending, Completed — сортировка по статусу, приоритету или дате",
      "Плавные анимации Framer Motion при добавлении, завершении и удалении",
      "Тёмная и светлая тема с сохранением выбора",
      "Данные в localStorage — переживают обновление страницы",
    ],
    techStack: [
      // frontend core
      projectTech.react,
      projectTech.javascript,
      projectTech.tailwindcss,
      // UI & animation libs
      projectTech.shadcnui,
      projectTech.motion,
      // build tool
      projectTech.vite,
    ],
    liveLink: "https://supertodo-v1.netlify.app/",
    githubLink: "https://github.com/CharanMunur/supertodo",
  },
];

// End of projects data
