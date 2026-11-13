export type UseCategory = {
  id: string;
  title: string;
  description: string;
  items: {
    name: string;
    description: string;
    link?: string;
    tag?: string;
  }[];
};

export function usesCategoryId(id: string) {
  return `uses-${id}`;
}

export const usesData: UseCategory[] = [
  {
    id: "hardware",
    title: "Железо и эргономика",
    description:
      "Физическое оборудование и эргономичная среда, которыми пользуюсь каждый день для инженерии и глубокой работы.",
    items: [
      {
        name: "Samsung Galaxy Book 4",
        description:
          "Intel Core i5 13-го поколения, 8 ГБ RAM, Ubuntu Linux 24.04 LTS — основная машина для разработки.",
        tag: "Ноутбук",
      },
      {
        name: "Logitech MK240 Combo",
        description:
          "Компактная беспроводная клавиатура 60% и лёгкая мышь для удобного набора.",
        tag: "Периферия",
      },
      {
        name: "Ergonomic Stand & Setup",
        description:
          "Подставка поднимает экран до уровня глаз, коврик Clozeu и дистанция до экрана не меньше метра — для глаз и осанки.",
        tag: "Эргономика",
      },
      {
        name: "boAt Rockerz 400",
        description:
          "Накладные беспроводные наушники для фокус-сессий и музыки во время кода.",
        tag: "Аудио",
      },
    ],
  },
  {
    id: "editor",
    title: "Редактор и ОС",
    description:
      "Среда разработки, заточенная под скорость, эффективность и небольшой расход памяти.",
    items: [
      {
        name: "Zed Editor",
        description:
          "Основной редактор — очень быстрый, написан на Rust и почти не ест RAM.",
        link: "https://zed.dev",
        tag: "Редактор",
      },
      {
        name: "Cursor",
        description:
          "Второй AI-редактор — когда нужна полная поддержка расширений VS Code (VSX).",
        link: "https://cursor.com",
        tag: "Редактор",
      },
      {
        name: "Ubuntu 24.04 LTS",
        description:
          "Основная Linux-система для быстрого нативного терминала и dev-окружения.",
        tag: "ОС",
      },
      {
        name: "GNOME Terminal & Bash",
        description:
          "Стандартный Linux-терминал и shell для скриптов и Git-команд.",
        tag: "Терминал",
      },
    ],
  },
  {
    id: "ai-cli-cloud",
    title: "AI, CLI и облако",
    description:
      "AI-ассистенты, агентные CLI-инструменты и облачная инфраструктура, на которой держится разработка.",
    items: [
      {
        name: "Antigravity CLI, Claude & Codex",
        description:
          "Основной AI-набор — Antigravity CLI за студенческий доступ и щедрые лимиты, Claude и Codex для pair programming и быстрой генерации кода.",
        tag: "AI и агенты",
      },
      {
        name: "Bun & Node.js",
        description:
          "Любимый runtime и пакетный менеджер для JavaScript/TypeScript — за скорость.",
        link: "https://bun.sh",
        tag: "Runtime",
      },
      {
        name: "Git & GitHub CLI",
        description:
          "Версионный контроль через Git в терминале и gh CLI.",
        link: "https://cli.github.com",
        tag: "VCS",
      },
      {
        name: "Render & Cloudflare",
        description:
          "Render для деплоя бэкенд-серверов, Cloudflare — edge-кэш, DNS и быстрая доставка.",
        link: "https://render.com",
        tag: "Облако",
      },
    ],
  },
  {
    id: "dev-stack",
    title: "Софт и стек",
    description:
      "Языки, фреймворки и приложения продуктивности в повседневных проектах.",
    items: [
      {
        name: "Spring Boot & Go",
        description:
          "Spring Boot (основной Java-бэкенд) и Go для высокопроизводительных микросервисов и CLI.",
        tag: "Бэкенд",
      },
      {
        name: "React, Next.js & TypeScript",
        description:
          "Основной веб-стек для типобезопасных и быстрых фронтенд-приложений.",
        tag: "Фронтенд",
      },
      {
        name: "Tailwind CSS & Vite",
        description:
          "Utility-first CSS и мгновенная перезагрузка через Vite.",
        link: "https://tailwindcss.com",
        tag: "Инструменты",
      },
      {
        name: "Bruno",
        description:
          "Любимый open-source, Git-friendly API-клиент для REST и GraphQL.",
        link: "https://usebruno.com",
        tag: "API-клиент",
      },
      {
        name: "Paper, Excalidraw & Clippy",
        description:
          "Эскизы на бумаге и Excalidraw для системных диаграмм, Clippy — быстрый локальный буфер обмена.",
        link: "https://excalidraw.com",
        tag: "Дизайн",
      },
      {
        name: "Google Chrome, Brave & Firefox",
        description:
          "Chrome как основной браузер, Brave и Firefox — для тестов и приватности.",
        tag: "Браузер",
      },
      {
        name: "Spotify & Focused Workflow",
        description:
          "Spotify для музыки в фокусе, сообщения осознанно (Telegram/WhatsApp), без бесконечного скролла соцсетей.",
        tag: "Воркфлоу",
      },
    ],
  },
];
