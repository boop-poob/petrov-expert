/*
  ОСНОВНЫЕ НАСТРОЙКИ САЙТА.
  Форма подключена к Formspree и уже ведёт на подтверждённый адрес 1042341@mail.ru.
  Никаких ключей, Resend или переменных Vercel для формы не требуется.
*/
window.SITE_CONFIG = {
  expertName: 'Георгий Петров',
  expertRole: 'Эксперт по управлению строительными проектами',
  cityLine: 'Москва и регионы',

  // Контакты
  phone: '',
  phoneDisplay: '',
  email: '1042341@mail.ru',
  telegramUrl: 'https://t.me/georgtan',
  maxUrl: 'https://max.ru/u/f9LHodD0cOJsV-xBwFlrBDA_PjKTekvex2hc3m5JS6xu-4ecgSW3tmvhwts',

  // Заявки с формы сразу отправляются через Formspree.
  formEndpoint: 'https://formspree.io/f/mpqgkvby',

  // Национальный реестр специалистов в области строительства (НОСТРОЙ).
  registryNumber: '',
  registryLabel: 'Включён в НРС НОСТРОЙ',
  registryWorkType: 'Организация выполнения работ по строительству, реконструкции, капитальному ремонту, сносу объектов капитального строительства.',
  registryUrl: 'https://nrs.nostroy.ru/?s.registrationNumber=&s.fio=%D0%BF%D0%B5%D1%82%D1%80%D0%BE%D0%B2+%D0%B3%D0%B5%D0%BE%D1%80%D0%B3%D0%B8%D0%B9+%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87&s.inclusionProtocolDate=&s.updated=&s.inclusionCertificateDate=&s.suspensionProtocolDate=&s.workType=&s.statusCode=',
  registryQrPath: 'assets/images/nrs-nostroy-qr.svg',

  // Аналитика. Оставьте пустым до настройки.
  yandexMetrikaId: '',
  googleAnalyticsId: '',

  // Юридические данные для страницы privacy.html — заполнить до публикации на собственном домене.
  legalName: 'Заполнить до публикации',
  legalAddress: 'Заполнить до публикации',
  legalEmail: '1042341@mail.ru',
  privacyDate: '04.07.2026',

  // Временный адрес проекта. После покупки домена заменить также в canonical и sitemap.
  productionDomain: 'https://gp-construction.vercel.app'
};
