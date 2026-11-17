/* ============================================================================
   تِبيان — المكتبة المشتركة لجميع الصفحات
   تصميم وتطوير سور للبرمجيات
   يُحمَّل بعد مكتبة Supabase:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="tibyan.js"></script>
   ========================================================================== */
(function () {
  "use strict";

  const SUPABASE_URL = "https://tsiacidrfnbfiyyzzhwy.supabase.co";
  const SUPABASE_KEY = "sb_publishable_FX3SdWzHTYOzVdQbDD--Gg_NE-gxG0n";
  const BUCKET = "tibyan-videos";

  const client = window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
  if (!client) console.error("تعذّر تحميل مكتبة Supabase.");

  /* القيمة value هي ما يُحفظ في عمود category */
  const CATEGORIES = [
    { value: "القرآن الكريم",   label: "القرآن الكريم",        art: "c1" },
    { value: "المصحف المرتل",   label: "المصحف المرتل",        art: "c7" },
    { value: "المصحف المجود",   label: "المصحف المجود",        art: "c4" },
    { value: "تلاوات خاشعة",    label: "تلاوات خاشعة",         art: "c2" },
    { value: "تجويد",           label: "التجويد",              art: "c3" },
    { value: "الحفظ والمراجعة", label: "الحفظ والمراجعة",      art: "c5" },
    { value: "التفسير والتدبر", label: "التفسير والتدبر",      art: "c1" },
    { value: "أذكار",           label: "أذكار وأدعية",         art: "c6" },
    { value: "أخرى",            label: "أخرى",                 art: "c1" }
  ];

  const STATUS_LABELS = { draft: "مسودة", pending: "قيد المراجعة", published: "منشورة", rejected: "مرفوضة" };

  const VIDEO_COLUMNS =
    "id,title,reader_name,category,description,video_url,thumbnail_url," +
    "status,created_at,published_at,user_id,view_count,duration_seconds,kind,caption";
  const SHORT_MAX_SECONDS = 90;

  const AYAT = [
    ["﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾", "سورة المزمل — ٤"],
    ["﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾", "سورة الرعد — ٢٨"],
    ["﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾", "سورة القمر — ١٧"],
    ["﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾", "سورة الإسراء — ٩"],
    ["﴿ وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ ﴾", "سورة الأعراف — ٢٠٤"],
    ["﴿ كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ ﴾", "سورة ص — ٢٩"]
  ];

  /* ---------------- الأيقونات ---------------- */
  /* أيقونات تِبيان: تصميم خاص ثنائي اللون — خط رفيع مع لمسة ذهبية مملوءة.
     رموز مستوحاة من الهوية الإسلامية: محراب، رَحْل المصحف، مسبحة، ساعة رملية، قبة، قلم الخط، صندوق الصدقة، نجمة ثمانية. */
  const P = {
    menu: ["M4 7h11M4 12h16M4 17h11", "M19 4.9l2.1 2.1-2.1 2.1-2.1-2.1zM19 14.9l2.1 2.1-2.1 2.1-2.1-2.1z"],
    search: ["M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20.5 20.5l-5-5", "M10.5 7.4 L11.41 8.31 L12.69 8.31 L12.69 9.59 L13.6 10.5 L12.69 11.41 L12.69 12.69 L11.41 12.69 L10.5 13.6 L9.59 12.69 L8.31 12.69 L8.31 11.41 L7.4 10.5 L8.31 9.59 L8.31 8.31 L9.59 8.31z"],
    home: ["M5 20.5V11c0-3.6 3.1-6.1 7-7.6 3.9 1.5 7 4 7 7.6v9.5zM9.6 20.5v-5.6c0-1.6 1-2.8 2.4-3.6 1.4.8 2.4 2 2.4 3.6v5.6M3 20.5h18", "M12 6.95a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 1 1 0-2.5z"],
    shorts: ["M8.5 3h7A2.5 2.5 0 0 1 18 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 18.5v-13A2.5 2.5 0 0 1 8.5 3z", "M13.2 6.4 9.4 12.9h2.8l-1.2 4.7 3.9-6.6h-2.8z"],
    fire: ["M12 2.8 L14.69 5.49 L18.51 5.49 L18.51 9.31 L21.2 12 L18.51 14.69 L18.51 18.51 L14.69 18.51 L12 21.2 L9.31 18.51 L5.49 18.51 L5.49 14.69 L2.8 12 L5.49 9.31 L5.49 5.49 L9.31 5.49z", "M12 7.9 L13.2 9.1 L14.9 9.1 L14.9 10.8 L16.1 12 L14.9 13.2 L14.9 14.9 L13.2 14.9 L12 16.1 L10.8 14.9 L9.1 14.9 L9.1 13.2 L7.9 12 L9.1 10.8 L9.1 9.1 L10.8 9.1z"],
    subs: ["M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2.2H4.4zM10 21a2 2 0 0 0 4 0", "M12 8.7 L12.76 9.46 L13.84 9.46 L13.84 10.54 L14.6 11.3 L13.84 12.06 L13.84 13.14 L12.76 13.14 L12 13.9 L11.24 13.14 L10.16 13.14 L10.16 12.06 L9.4 11.3 L10.16 10.54 L10.16 9.46 L11.24 9.46z"],
    library: ["M12 6.5C10 5 7.3 4.4 4 4.6v9.8c3.3-.2 6 .4 8 1.9 2-1.5 4.7-2.1 8-1.9V4.6c-3.3-.2-6 .4-8 1.9zM12 6.5v9.8M7 21l10-4.2M17 21 7 16.8", "M5.6 6.3c2.3 0 4 .5 5.2 1.4v6.4c-1.4-.8-3.1-1.2-5.2-1.2z"],
    history: ["M6.5 3.5h11M6.5 20.5h11M8 3.5c0 4.2 4 5.3 4 8.5s-4 4.3-4 8.5M16 3.5c0 4.2-4 5.3-4 8.5s4 4.3 4 8.5", "M9.3 19.3c.6-1.9 2.7-3.2 2.7-3.2s2.1 1.3 2.7 3.2zM10 6.5h4c-.5 1.2-2 2.2-2 2.2s-1.5-1-2-2.2z"],
    clock: ["M7 3.5h10v17l-5-3.7-5 3.7z", "M12 7.1a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 1 1 0-4.4z"],
    like: ["M12 20.2s-7.6-4.6-7.6-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.7c0 5.5-7.6 10.1-7.6 10.1z", "M12 16.6s-4-2.5-4-5.4A2.2 2.2 0 0 1 12 9.8a2.2 2.2 0 0 1 4 1.4c0 2.9-4 5.4-4 5.4z"],
    heart: ["M12 20.2s-7.6-4.6-7.6-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.7c0 5.5-7.6 10.1-7.6 10.1z", "M12 16.6s-4-2.5-4-5.4A2.2 2.2 0 0 1 12 9.8a2.2 2.2 0 0 1 4 1.4c0 2.9-4 5.4-4 5.4z"],
    playlist: ["M12 4.3c3.9 0 6.2 2.6 6.2 6s-2.5 6-6.2 6-6.2-2.6-6.2-6 2.3-6 6.2-6zM12 16.3v2.6M10.3 21.7 12 18.9l1.7 2.8", "M15.64 3.9a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM17.9 6.9a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM17.9 10.6a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM15.64 13.6a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM12 14.75a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM8.36 13.6a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM6.1 10.6a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM6.1 6.9a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1zM8.36 3.9a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 1 1 0-3.1z"],
    save: ["M3.5 8h6.3l2 2.2h8.7v9.3h-17zM3.5 8V5.5h6.3", "M15.3 12.4h1.7v1.7h1.7v1.7H17v1.7h-1.7v-1.7h-1.7v-1.7h1.7z"],
    grid: ["M12 2.8l4 4-4 4-4-4zM12 13.2l4 4-4 4-4-4zM6.8 8l4 4-4 4-4-4zM17.2 8l4 4-4 4-4-4z", "M12 10.4l1.6 1.6-1.6 1.6-1.6-1.6z"],
    mic: ["M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6", "M10.4 6.3a1.6 1.6 0 0 1 3.2 0v4.4a1.6 1.6 0 0 1-3.2 0z"],
    people: ["M3.5 20.5h17M6 20.5v-6h12v6M7 14.5c0-3 2.2-5.4 5-6.6 2.8 1.2 5 3.6 5 6.6M12 5.2v2.7M10.6 20.5v-2.6a1.4 1.4 0 0 1 2.8 0v2.6", "M12.7 1.6a1.6 1.6 0 1 0 1 2.8 2 2 0 0 1-1-2.8z"],
    upload: ["M12 2.8 L14.69 5.49 L18.51 5.49 L18.51 9.31 L21.2 12 L18.51 14.69 L18.51 18.51 L14.69 18.51 L12 21.2 L9.31 18.51 L5.49 18.51 L5.49 14.69 L2.8 12 L5.49 9.31 L5.49 5.49 L9.31 5.49z", "M11.1 8h1.8v3.1H16v1.8h-3.1V16h-1.8v-3.1H8v-1.8h3.1z"],
    plus: ["M12 5v14M5 12h14", ""],
    shield: ["M12 3l7 2.8v5.4c0 4.4-2.9 8.1-7 9.8-4.1-1.7-7-5.4-7-9.8V5.8zM8.8 12.2l2.2 2.2 4.2-4.4", "M12 5.2l5 2v4c0 .5 0 1-.1 1.5L12 5.2z"],
    settings: ["M4 7h16M4 12h16M4 17h16", "M15 5.1a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 1 1 0-3.8zM8 10.1a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 1 1 0-3.8zM13 15.1a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 1 1 0-3.8z"],
    user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6", "M12 6a2 2 0 1 1 0 4 2 2 0 1 1 0-4z"],
    info: ["M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5.5", "M12 6.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 1 1 0-2.2z"],
    doc: ["M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 12.5h6M9 16.5h4", "M14.6 3.6l3.8 3.8h-3.8z"],
    moon: ["M19.5 14.6A7.9 7.9 0 0 1 9.4 4.5a7.9 7.9 0 1 0 10.1 10.1z", "M17.3 3.9 L18 4.6 L19 4.6 L19 5.6 L19.7 6.3 L19 7 L19 8 L18 8 L17.3 8.7 L16.6 8 L15.6 8 L15.6 7 L14.9 6.3 L15.6 5.6 L15.6 4.6 L16.6 4.6z"],
    sun: ["M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4", "M12 7.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 1 1 0-8.4z"],
    share: ["M8.2 10.9l7.6-4.3M8.2 13.1l7.6 4.3", "M6.2 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 1 1 0-4.8zM17.8 3.2a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 1 1 0-4.8zM17.8 16a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 1 1 0-4.8z"],
    close: ["M6 6l12 12M18 6 6 18", ""],
    trash: ["M4 7h16M10 4h4M6 7l1 13h10l1-13M10 11v5.5M14 11v5.5", ""],
    play: ["", "M8 5.2v13.6l10.6-6.8z"],
    headphones: ["M4 15v-3a8 8 0 0 1 16 0v3M4 15.5a2 2 0 0 1 2-2h1.5V20H6a2 2 0 0 1-2-2zM20 15.5a2 2 0 0 0-2-2h-1.5V20H18a2 2 0 0 0 2-2z", "M5.2 15.6a.9.9 0 0 1 .9-.9h.4v4.1h-.4a.9.9 0 0 1-.9-.9zM18.8 15.6a.9.9 0 0 0-.9-.9h-.4v4.1h.4a.9.9 0 0 0 .9-.9z"],
    check: ["M12 2.8 L14.69 5.49 L18.51 5.49 L18.51 9.31 L21.2 12 L18.51 14.69 L18.51 18.51 L14.69 18.51 L12 21.2 L9.31 18.51 L5.49 18.51 L5.49 14.69 L2.8 12 L5.49 9.31 L5.49 5.49 L9.31 5.49zM8.6 12.2l2.3 2.3 4.5-4.6", "M12 2.8 L14.69 5.49 L18.51 5.49 L18.51 9.31 L21.2 12 L18.51 14.69 L18.51 18.51 L14.69 18.51 L12 21.2 L9.31 18.51 L5.49 18.51 L5.49 14.69 L2.8 12 L5.49 9.31 L5.49 5.49 L9.31 5.49z"],
    logout: ["M14 4h4.5a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 8l-4 4 4 4M6 12h10", ""],
    studio: ["M12 2.6 17 9.8l-5 11-5-11zM12 14.4v6.2M9.4 9.8h5.2", "M12 11.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 1 1 0-2.6z"],
    sort: ["M4 7h16M7 12h10M10 17h4", ""],
    reply: ["M14 7l5 5-5 5M19 12h-9a5 5 0 0 0-5 5v1", ""],
    volume: ["M4 9.5h3.2L12 5.5v13l-4.8-4H4zM15.8 9.2a4 4 0 0 1 0 5.6M18.4 6.6a7.6 7.6 0 0 1 0 10.8", ""],
    mute: ["M4 9.5h3.2L12 5.5v13l-4.8-4H4zM15.5 9.5l5 5M20.5 9.5l-5 5", ""],
    comment: ["M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-4.5 3.6v-3.6H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z", "M8.4 9.45a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 1 1 0-2.1zM12 9.45a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 1 1 0-2.1zM15.6 9.45a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 1 1 0-2.1z"],
    send: ["M4 4l17 7.2-7.4 2.3L11.2 21zM13.6 13.5 4 4", ""],
    stop: ["M6.5 6.5h11v11h-11z", ""],
    edit: ["M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4", ""],
    up: ["M6 15l6-6 6 6", ""],
    down: ["M6 9l6 6 6-6", ""],
    donate: ["M4.5 10h15v10.5h-15zM4.5 10l1.8-3.5h11.4l1.8 3.5M10 13.5h4M12 6.5V4.8", "M12 1.7a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 1 1 0-3.8zM8.5 15.8h7l-3.5 2.8z"],
    volunteer: ["M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-6 6-6 1.3 0 2.5.4 3.4 1.1", "M17.5 21s-4.3-2.6-4.3-5.7A2.4 2.4 0 0 1 17.5 13.8a2.4 2.4 0 0 1 4.3 1.5c0 3.1-4.3 5.7-4.3 5.7z"],
    copy: ["M9 9h10.5v11.5H9zM5 15V4h10.5", ""],
    bank: ["M3 9.2 12 4l9 5.2M5 9.5v8.5M9.7 9.5v8.5M14.3 9.5v8.5M19 9.5v8.5M3 20.5h18", "M12 6.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 1 1 0-2.2z"],
    link: ["M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1", ""],
    star: ["M12 2.8 L14.69 5.49 L18.51 5.49 L18.51 9.31 L21.2 12 L18.51 14.69 L18.51 18.51 L14.69 18.51 L12 21.2 L9.31 18.51 L5.49 18.51 L5.49 14.69 L2.8 12 L5.49 9.31 L5.49 5.49 L9.31 5.49z", "M12 7.9 L13.2 9.1 L14.9 9.1 L14.9 10.8 L16.1 12 L14.9 13.2 L14.9 14.9 L13.2 14.9 L12 16.1 L10.8 14.9 L9.1 14.9 L9.1 13.2 L7.9 12 L9.1 10.8 L9.1 9.1 L10.8 9.1z"]
  };
  function icon(name, cls = "") {
    const [main, accent] = P[name] || ["", ""];
    return `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${accent ? `<path class="ac" d="${accent}"/>` : ""}${main ? `<path class="ln" d="${main}"/>` : ""}</svg>`;
  }

  /* شعار تِبيان: نجمة ثمانية ذهبية وفي قلبها حرف التاء */
  function logoMark(size = 34) {
    return `<svg class="logo-svg" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#123f35"/>
      <path d="M24 6.5l5.1 5.1h7.3v7.3l5.1 5.1-5.1 5.1v7.3h-7.3L24 41.5l-5.1-5.1h-7.3v-7.3L6.5 24l5.1-5.1v-7.3h7.3z" fill="none" stroke="#e4cc8e" stroke-width="1.6" stroke-linejoin="round"/>
      <text x="24" y="31.5" text-anchor="middle" font-family="Amiri, serif" font-size="22" font-weight="700" fill="#e4cc8e">ت</text>
    </svg>`;
  }

  /* ---------------- النصوص والتنسيق ---------------- */
  const NUM_LOCALE = "ar-u-nu-latn";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }
  const esc = escapeHTML;

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFC").toLocaleLowerCase("ar")
      .replace(/[\u064B-\u0652\u0670]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
      .replace(/\s+/g, " ").trim();
  }

  function truncate(value, max) {
    const t = String(value ?? "").trim();
    return t.length > max ? t.slice(0, max).trim() + "…" : t;
  }

  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(NUM_LOCALE, { year: "numeric", month: "long", day: "numeric" }).format(d);
  }

  function timeAgo(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const s = (d.getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(NUM_LOCALE, { numeric: "auto" });
    const steps = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, sec] of steps) {
      if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), unit);
    }
    return "الآن";
  }

  function formatCount(n) {
    return new Intl.NumberFormat(NUM_LOCALE, { notation: "compact", maximumFractionDigits: 1 }).format(Number(n) || 0);
  }
  function formatViews(n) {
    n = Number(n) || 0;
    if (n === 0) return "لا مشاهدات";
    if (n === 1) return "مشاهدة واحدة";
    if (n === 2) return "مشاهدتان";
    return formatCount(n) + " مشاهدة";
  }
  function formatSubs(n) {
    n = Number(n) || 0;
    if (n === 0) return "لا مشتركين بعد";
    return formatCount(n) + " مشترك";
  }

  function formatDuration(sec) {
    sec = Math.round(Number(sec) || 0);
    if (!sec) return "";
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const pad = x => String(x).padStart(2, "0");
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  function categoryLabel(value) {
    const c = CATEGORIES.find(x => x.value === value);
    return c ? c.label : (value || "أخرى");
  }
  function categoryArt(value) {
    const c = CATEGORIES.find(x => x.value === value);
    return c ? c.art : "c1";
  }

  function fillCategorySelect(select, options = {}) {
    if (!select) return;
    const { includeAll = false, allLabel = "جميع التصنيفات", placeholder = "" } = options;
    const current = select.value;
    select.replaceChildren();
    if (placeholder) select.add(new Option(placeholder, ""));
    if (includeAll) select.add(new Option(allLabel, "all"));
    CATEGORIES.forEach(c => select.add(new Option(c.label, c.value)));
    if (current) select.value = current;
  }

  function sanitizeSearch(q) {
    return String(q || "").replace(/[,()"\\*%.:;]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  /* ---------------- الروابط والملفات ---------------- */
  function isHttpUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch { return false; }
  }

  function getYouTubeId(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value).trim());
      let id = "";
      if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
        id = url.pathname.split("/").filter(Boolean)[0] || "";
      } else if (/(^|\.)youtube(-nocookie)?\.com$/.test(url.hostname)) {
        if (url.pathname === "/watch") id = url.searchParams.get("v") || "";
        else {
          const parts = url.pathname.split("/").filter(Boolean);
          if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1] || "";
        }
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    } catch { return ""; }
  }

  function storagePath(value) {
    if (!value) return "";
    const raw = String(value).trim();
    if (/^https?:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        const marker = "/storage/v1/object/";
        const at = url.pathname.indexOf(marker);
        if (at === -1) return "";
        const rest = url.pathname.slice(at + marker.length).replace(/^(public|sign|authenticated)\//, "");
        if (!rest.startsWith(BUCKET + "/")) return "";
        return decodeURIComponent(rest.slice(BUCKET.length + 1));
      } catch { return ""; }
    }
    let path = raw.replace(/^\/+/, "");
    if (path.startsWith(BUCKET + "/")) path = path.slice(BUCKET.length + 1);
    return path;
  }

  const signedCache = new Map();
  async function signedUrls(paths, expiresIn = 3600) {
    const map = new Map();
    const need = [];
    [...new Set(paths.filter(Boolean))].forEach(p => {
      const hit = signedCache.get(p);
      if (hit && hit.until > Date.now()) map.set(p, hit.url);
      else need.push(p);
    });
    if (!need.length || !client) return map;
    const { data, error } = await client.storage.from(BUCKET).createSignedUrls(need, expiresIn);
    if (error) {
      console.warn("تعذّر إنشاء روابط الملفات:", error.message);
      return map;
    }
    (data || []).forEach(item => {
      if (item && item.signedUrl && !item.error) {
        map.set(item.path, item.signedUrl);
        signedCache.set(item.path, { url: item.signedUrl, until: Date.now() + (expiresIn - 120) * 1000 });
      }
    });
    return map;
  }
  async function signedUrl(path, expiresIn = 3600) {
    return (await signedUrls([path], expiresIn)).get(path) || "";
  }

  /* يحوّل قيم الصور (مسار أو رابط) إلى روابط قابلة للعرض */
  async function resolveImages(values) {
    const result = new Map();
    const paths = [];
    values.filter(Boolean).forEach(v => {
      const p = storagePath(v);
      if (p) paths.push(p);
      else if (isHttpUrl(v)) result.set(v, v);
    });
    const signed = await signedUrls(paths, 60 * 60 * 6);
    values.filter(Boolean).forEach(v => {
      const p = storagePath(v);
      if (p && signed.has(p)) result.set(v, signed.get(p));
    });
    return result;
  }

  async function resolveThumbnails(videos) {
    const images = await resolveImages(videos.map(v => v.thumbnail_url));
    const out = new Map();
    videos.forEach(v => {
      const url = images.get(v.thumbnail_url);
      if (url) out.set(String(v.id), url);
      else {
        const yt = getYouTubeId(v.video_url);
        if (yt) out.set(String(v.id), "https://img.youtube.com/vi/" + yt + "/hqdefault.jpg");
      }
    });
    return out;
  }

  function cleanFileName(name) {
    const parts = String(name || "file").split(".");
    const ext = parts.length > 1 ? parts.pop().toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const base = parts.join(".").normalize("NFKD").replace(/[^\w-]+/g, "-")
      .replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "file";
    return ext ? base + "." + ext : base;
  }
  function randomId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  async function uploadFile(userId, folder, file) {
    const path = `${userId}/${folder}/${Date.now()}-${randomId()}-${cleanFileName(file.name)}`;
    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      upsert: false, contentType: file.type || undefined
    });
    if (error) throw error;
    return path;
  }
  async function removeFile(value) {
    const path = storagePath(value);
    if (!path) return;
    const { error } = await client.storage.from(BUCKET).remove([path]);
    if (error) console.warn("تعذّر حذف الملف:", error.message);
  }
  function isAudioPath(path) {
    const ext = (String(path || "").split("?")[0].split(".").pop() || "").toLowerCase();
    return ["mp3", "m4a", "aac", "ogg", "oga", "wav", "flac", "opus", "weba"].includes(ext);
  }

  /* يقرأ مدة ملف صوت/فيديو من المتصفح قبل الرفع */
  function readMediaDuration(file) {
    return new Promise(resolve => {
      try {
        const url = URL.createObjectURL(file);
        const el = document.createElement(file.type.startsWith("audio/") ? "audio" : "video");
        el.preload = "metadata";
        const done = v => { URL.revokeObjectURL(url); resolve(v); };
        el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? Math.round(el.duration) : null);
        el.onerror = () => done(null);
        setTimeout(() => done(null), 8000);
        el.src = url;
      } catch { resolve(null); }
    });
  }

  /* ---------------- البيانات ---------------- */
  async function fetchVideos(o = {}) {
    let q = client.from("videos").select(VIDEO_COLUMNS).eq("status", "published");
    const kind = o.kind || (o.ids ? "all" : "video");
    if (kind !== "all") q = q.eq("kind", kind);
    if (o.categories && o.categories.length) q = q.in("category", o.categories);
    if (o.userIds) q = q.in("user_id", o.userIds.length ? o.userIds : ["00000000-0000-0000-0000-000000000000"]);
    if (o.ids) q = q.in("id", o.ids.length ? o.ids : [-1]);
    if (o.excludeId !== undefined && o.excludeId !== null) q = q.neq("id", o.excludeId);
    if (o.search) {
      const s = sanitizeSearch(o.search);
      if (s) {
        const like = `"*${s}*"`;
        q = q.or(`title.ilike.${like},reader_name.ilike.${like},description.ilike.${like},category.ilike.${like}`);
      }
    }
    if (o.order === "popular") q = q.order("view_count", { ascending: false }).order("created_at", { ascending: false });
    else if (o.order === "old") q = q.order("created_at", { ascending: true });
    else q = q.order("created_at", { ascending: false });
    if (o.limit) q = q.limit(o.limit);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }
  const fetchPublishedVideos = fetchVideos;

  async function channelsByUser(userIds) {
    const ids = [...new Set(userIds.filter(Boolean))];
    const map = new Map();
    if (!ids.length) return map;
    const { data, error } = await client
      .from("channels")
      .select("id,user_id,channel_name,description,avatar_url,banner_url,handle,status,created_at")
      .in("user_id", ids)
      .eq("status", "approved");
    if (error) { console.warn(error); return map; }
    const avatars = await resolveImages((data || []).map(c => c.avatar_url));
    (data || []).forEach(c => {
      c.avatar = avatars.get(c.avatar_url) || "";
      if (!map.has(c.user_id)) map.set(c.user_id, c);
    });
    return map;
  }

  async function channelStats(ids) {
    const map = new Map();
    if (!ids.length) return map;
    const { data, error } = await client.rpc("channel_stats", { p_ids: ids.map(String) });
    if (error) { console.warn(error); return map; }
    (data || []).forEach(r => map.set(String(r.channel_id), r));
    return map;
  }

  function channelUrl(ch) {
    if (!ch) return "channels.html";
    return ch.handle ? "channel.html?h=" + encodeURIComponent(ch.handle) : "channel.html?id=" + encodeURIComponent(ch.id);
  }
  function watchUrl(video, extra = "") {
    if (video && video.kind === "short" && !extra) return "shorts.html?s=" + encodeURIComponent(video.id);
    return "watch.html?v=" + encodeURIComponent(video.id) + extra;
  }

  /* ---------------- المستخدم والصلاحيات ---------------- */
  async function getUser() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session.user : null;
  }

  let rolesPromise = null;
  function getMyRoles(force = false) {
    if (!rolesPromise || force) rolesPromise = loadRoles();
    return rolesPromise;
  }
  async function loadRoles() {
    const empty = { user: null, user_id: null, is_admin: false, is_volunteer: false, has_channel: false, required_approvals: 1, setupMissing: false };
    const user = await getUser();
    if (!user) return empty;
    const { data, error } = await client.rpc("my_roles");
    if (error) {
      console.error("my_roles error:", error);
      return { ...empty, user, user_id: user.id, setupMissing: true, error };
    }
    return { ...empty, ...data, user };
  }

  function friendlyError(error) {
    const m = (error && (error.message || error.error_description)) || "";
    if (/my_roles|column .* does not exist|function .* does not exist|Could not find the function|relation .* does not exist|schema cache/i.test(m)) {
      return "لم يُشغَّل ملف إعداد قاعدة البيانات supabase-setup.sql (أو نسخته الأحدث) بعد.";
    }
    if (/row-level security|violates row-level/i.test(m)) return "لا تملك صلاحية تنفيذ هذه العملية.";
    if (/Payload too large|exceeded the maximum allowed size|413/i.test(m)) return "حجم الملف أكبر من الحد المسموح في إعدادات التخزين.";
    if (/duplicate key/i.test(m)) return "هذا العنصر موجود مسبقًا.";
    return m || "حدث خطأ غير متوقع.";
  }

  function loginUrl() {
    const next = (location.pathname.split("/").pop() || "index.html") + location.search + location.hash;
    return "login.html?next=" + encodeURIComponent(next);
  }
  function goLogin(message) {
    if (message) sessionStorage.setItem("tibyan-login-reason", message);
    location.href = loginUrl();
  }

  /* ---------------- عناصر الواجهة ---------------- */
  let toastEl = null, toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  function initial(name) {
    let t = String(name || "ت").trim()
      .replace(/^قناة\s+/, "")
      .replace(/^(الشيخ|القارئ|الدكتور|د\.)\s*/, "")
      .replace(/^ال(?=\S{2,})/, "");
    return t.charAt(0) || "ت";
  }
  function avatarHTML(name, url, size = "") {
    return `<span class="avatar ${size}">${url ? `<img src="${esc(url)}" alt="" loading="lazy">` : esc(initial(name))}</span>`;
  }

  function artHTML(video, small = false) {
    const sub = video.reader_name ? "القارئ " + video.reader_name : categoryLabel(video.category);
    return `<div class="art ${categoryArt(video.category)}">
      <div class="art-title">${esc(truncate(video.title || "تلاوة قرآنية", small ? 40 : 60))}</div>
      <div class="art-sub">${esc(sub)}</div>
    </div>`;
  }

  function thumbInner(video, url, opts = {}) {
    const audio = isAudioPath(storagePath(video.video_url) || video.video_url);
    return `${url ? `<img src="${esc(url)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
      ${url ? "" : artHTML(video, opts.small)}
      ${audio ? `<span class="badge-kind">${icon("headphones")}صوت</span>` : ""}
      ${video.duration_seconds ? `<span class="badge-time">${formatDuration(video.duration_seconds)}</span>` : ""}
      ${opts.progress ? `<span class="progress"><i style="width:${Math.min(100, opts.progress)}%"></i></span>` : ""}`;
  }

  const VERIFIED = `<span class="verified" title="قناة معتمدة">${icon("check")}</span>`;

  function cardHTML(video, ctx, layout = "grid", opts = {}) {
    const href = esc(opts.href || watchUrl(video));
    const thumb = ctx.thumbs ? ctx.thumbs.get(String(video.id)) : "";
    const ch = ctx.channels ? ctx.channels.get(video.user_id) : null;
    const chName = ch ? ch.channel_name : (video.reader_name || "تِبيان");
    const chHref = esc(ch ? channelUrl(ch) : "results.html?q=" + encodeURIComponent(video.reader_name || ""));
    const title = esc(video.title || "تلاوة قرآنية");
    const reader = video.reader_name && (!ch || video.reader_name.trim() !== ch.channel_name.trim())
      ? `<div>القارئ ${esc(video.reader_name)}</div>` : "";
    const stats = `${formatViews(video.view_count)}<span class="dot"></span>${esc(timeAgo(video.published_at || video.created_at))}`;

    if (layout === "list") {
      return `<article class="vrow">
        <a class="thumb" href="${href}">${thumbInner(video, thumb, opts)}</a>
        <div>
          <h3 class="vtitle"><a href="${href}">${title}</a></h3>
          <div class="vsub">${stats}</div>
          <a class="chan" href="${chHref}">${avatarHTML(chName, ch && ch.avatar, "xs")}${esc(chName)}${ch ? VERIFIED : ""}</a>
          ${reader ? `<div class="vsub">${reader}</div>` : ""}
          <div class="vdesc">${esc(truncate(video.description || "", 180))}</div>
          ${opts.actions || ""}
        </div>
      </article>`;
    }
    if (layout === "compact") {
      return `<article class="vcompact">
        <a class="thumb" href="${href}">${thumbInner(video, thumb, { ...opts, small: true })}</a>
        <div>
          <h3 class="vtitle"><a href="${href}">${title}</a></h3>
          <div class="vsub"><a href="${chHref}">${esc(chName)}</a>${ch ? VERIFIED : ""}<br>${stats}</div>
        </div>
      </article>`;
    }
    return `<article class="vcard">
      <a class="thumb" href="${href}">${thumbInner(video, thumb, opts)}</a>
      <div class="vmeta">
        <a href="${chHref}" aria-label="${esc(chName)}">${avatarHTML(chName, ch && ch.avatar)}</a>
        <div class="vtext">
          <h3 class="vtitle"><a href="${href}" title="${title}">${title}</a></h3>
          <div class="vsub">
            <a href="${chHref}">${esc(chName)}</a>${ch ? VERIFIED : ""}
            ${reader}
            <div>${stats}</div>
          </div>
        </div>
      </div>
    </article>`;
  }

  async function buildContext(videos) {
    const [thumbs, channels] = await Promise.all([
      resolveThumbnails(videos),
      channelsByUser(videos.map(v => v.user_id))
    ]);
    return { thumbs, channels };
  }

  function emptyHTML(title, text = "", action = "") {
    return `<div class="empty"><div class="glyph">۞</div><strong>${esc(title)}</strong><div>${esc(text)}</div>${action}</div>`;
  }

  function skeletonHTML(count = 8, layout = "grid") {
    const one = layout === "list"
      ? `<div class="vrow skeleton"><div class="thumb"></div><div><div class="line"></div><div class="line short"></div></div></div>`
      : `<div class="vcard skeleton"><div class="thumb"></div><div class="line"></div><div class="line short"></div></div>`;
    return Array.from({ length: count }, () => one).join("");
  }

  async function renderVideos(container, videos, opts = {}) {
    const layout = opts.layout || "grid";
    if (!videos.length) {
      container.innerHTML = emptyHTML(opts.emptyTitle || "لا توجد تلاوات بعد", opts.emptyText || "", opts.emptyAction || "");
      return;
    }
    const ctx = opts.ctx || await buildContext(videos);
    container.innerHTML = videos.map(v => cardHTML(v, ctx, layout, opts.cardOpts ? opts.cardOpts(v) : {})).join("");
    return ctx;
  }

  /* ---------------- المظهر ---------------- */
  function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("tibyan-theme", theme); } catch { /* تجاهل */ }
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  }

  /* ---------------- الهيكل: الشريط العلوي والجانبي ---------------- */
  const state = { roles: null, user: null, myChannel: null, subs: [] };

  function guideLink(href, iconName, label, key, active, extraHTML) {
    return `<a href="${esc(href)}" class="${key && key === active ? "active" : ""}">${extraHTML || icon(iconName)}<span>${esc(label)}</span></a>`;
  }

  function renderGuide(active) {
    const guide = document.getElementById("guide");
    if (!guide) return;
    const r = state.roles || {};
    const logged = !!state.user;

    let html = `<div class="guide-section primary">
      ${guideLink("index.html", "home", "الرئيسية", "home", active)}
      ${guideLink("shorts.html", "shorts", "مقاطع قصيرة", "shorts", active)}
      ${guideLink("index.html?sort=popular", "fire", "الأكثر استماعًا", "popular", active)}
      ${guideLink("subscriptions.html", "subs", "الاشتراكات", "subs", active)}
      ${guideLink("library.html", "library", "مكتبتي", "library", active)}
    </div>`;

    html += `<div class="guide-section">
      <div class="guide-title">أنت</div>
      ${guideLink("library.html#history", "history", "السجل", "history", active)}
      ${guideLink("library.html#later", "clock", "الاستماع لاحقًا", "later", active)}
      ${guideLink("library.html#liked", "like", "التلاوات التي أعجبتني", "liked", active)}
      ${guideLink("library.html#playlists", "playlist", "قوائم التشغيل", "playlists", active)}
      ${(r.has_channel || r.is_admin) ? guideLink("studio.html", "studio", "استوديو تِبيان", "studio", active) : ""}
    </div>`;

    if (logged && state.subs.length) {
      html += `<div class="guide-section"><div class="guide-title">الاشتراكات</div>
        ${state.subs.slice(0, 12).map(c => `<a href="${esc(channelUrl(c))}">${avatarHTML(c.channel_name, c.avatar, "xs")}<span>${esc(c.channel_name)}</span></a>`).join("")}
      </div>`;
    } else if (!logged) {
      html += `<div class="guide-section" style="padding:12px">
        <div class="muted" style="font-size:13px;margin-bottom:10px">سجّل الدخول للاشتراك في القنوات وحفظ التلاوات والتعليق.</div>
        <a class="signin-btn" href="${esc(loginUrl())}" style="display:inline-flex;height:36px;gap:6px">${icon("user", "sm")}<span>تسجيل الدخول</span></a>
      </div>`;
    }

    html += `<div class="guide-section"><div class="guide-title">استكشف</div>
      ${guideLink("categories.html", "grid", "التصنيفات", "categories", active)}
      ${guideLink("readers.html", "mic", "القرّاء", "readers", active)}
      ${guideLink("channels.html", "people", "القنوات", "channels", active)}
    </div>`;

    html += `<div class="guide-section"><div class="guide-title">ادعم تِبيان</div>
      ${r.is_volunteer ? "" : guideLink("volunteer.html", "volunteer", "تطوّع في المراجعة", "volunteer", active)}
      <a href="donate.html" class="donate-link ${active === "donate" ? "active" : ""}">${icon("donate")}<span>تبرّع لدعم الخادم</span></a>
    </div>`;

    html += `<div class="guide-section"><div class="guide-title">تِبيان</div>
      ${(r.is_volunteer || r.is_admin) ? guideLink("review.html", "shield", "مراجعة التلاوات", "review", active) : ""}
      ${r.is_admin ? guideLink("admin.html", "settings", "لوحة الإدارة", "admin", active) : ""}
      ${guideLink("account.html", "user", "حسابي", "account", active)}
      ${guideLink("about.html", "info", "عن تِبيان", "about", active)}
      ${guideLink("policy.html", "doc", "سياسة المحتوى", "policy", active)}
    </div>
    <div class="guide-foot">
      تُراجَع كل تلاوة قبل نشرها.<br>
      © ${new Date().getFullYear()} تِبيان<br>
      تصميم وتطوير <a href="https://soursoft.om" target="_blank" rel="noopener">سور للبرمجيات</a>
    </div>`;

    guide.innerHTML = html;
  }

  function renderUserArea() {
    const holder = document.getElementById("mast-user");
    if (!holder) return;
    const r = state.roles || {};
    const donateBtn = `<a class="icon-btn donate-btn" href="donate.html" title="ادعم تِبيان" aria-label="تبرّع">${icon("donate")}</a>`;
    const themeBtn = donateBtn + `<button class="icon-btn" id="theme-toggle" type="button" aria-label="تبديل المظهر">${icon(currentTheme() === "dark" ? "sun" : "moon")}</button>`;

    if (!state.user) {
      holder.innerHTML = `${themeBtn}<a class="signin-btn" href="${esc(loginUrl())}">${icon("user", "sm")}<span>تسجيل الدخول</span></a>`;
    } else {
      const name = state.myChannel ? state.myChannel.channel_name : (state.user.email || "");
      const create = (r.has_channel || r.is_admin)
        ? `<a class="create-btn" href="studio.html#upload" title="رفع تلاوة">${icon("plus", "sm")}<span>إنشاء</span></a>` : "";
      holder.innerHTML = `${create}${themeBtn}
        <button class="avatar-btn" id="avatar-btn" type="button" aria-label="قائمة الحساب" aria-haspopup="true">
          ${avatarHTML(name, state.myChannel && state.myChannel.avatar, "sm")}
        </button>`;
    }
    holder.style.display = "flex";
    holder.style.alignItems = "center";
    holder.style.gap = "6px";

    document.getElementById("theme-toggle").addEventListener("click", () =>
      setTheme(currentTheme() === "dark" ? "light" : "dark"));

    const avatarBtn = document.getElementById("avatar-btn");
    if (avatarBtn) avatarBtn.addEventListener("click", e => { e.stopPropagation(); toggleUserMenu(); });
  }

  function toggleUserMenu() {
    let menu = document.getElementById("user-menu");
    if (menu) { menu.remove(); return; }
    const r = state.roles || {};
    const ch = state.myChannel;
    const name = ch ? ch.channel_name : "حسابك";
    menu = document.createElement("div");
    menu.className = "menu";
    menu.id = "user-menu";
    menu.innerHTML = `
      <div class="menu-head">${avatarHTML(name, ch && ch.avatar, "md")}
        <div><strong>${esc(name)}</strong><span>${esc(state.user.email || "")}</span>
        ${ch ? `<div><a href="${esc(channelUrl(ch))}" style="color:var(--gold-ink);font-weight:700;font-size:13px;padding:0">عرض قناتك</a></div>` : ""}</div>
      </div>
      ${(r.has_channel || r.is_admin) ? `<a href="studio.html">${icon("studio")}استوديو تِبيان</a>` : ""}
      <a href="account.html">${icon("user")}حسابي${r.has_channel ? "" : " وطلب قناة"}</a>
      <a href="library.html">${icon("library")}مكتبتي</a>
      ${r.is_volunteer ? "" : `<a href="volunteer.html">${icon("volunteer")}تطوّع في المراجعة</a>`}
      <a href="donate.html">${icon("donate")}ادعم تِبيان</a>
      ${(r.is_volunteer || r.is_admin) ? `<a href="review.html">${icon("shield")}مراجعة التلاوات</a>` : ""}
      ${r.is_admin ? `<a href="admin.html">${icon("settings")}لوحة الإدارة</a>` : ""}
      <hr>
      <button class="menu-item" type="button" id="menu-theme">${icon(currentTheme() === "dark" ? "sun" : "moon")}المظهر: ${currentTheme() === "dark" ? "داكن" : "فاتح"}</button>
      <button class="menu-item" type="button" id="menu-logout">${icon("logout")}تسجيل الخروج</button>`;
    document.body.appendChild(menu);
    menu.addEventListener("click", e => e.stopPropagation());
    menu.querySelector("#menu-theme").addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
      menu.remove();
    });
    menu.querySelector("#menu-logout").addEventListener("click", async () => {
      await client.auth.signOut();
      location.href = "index.html";
    });
  }

  async function loadShellUser() {
    const roles = await getMyRoles();
    state.roles = roles;
    state.user = roles.user || null;
    if (!state.user || roles.setupMissing) return;

    const [mine, subs] = await Promise.all([
      client.from("channels").select("id,user_id,channel_name,description,avatar_url,banner_url,handle,status")
        .eq("user_id", state.user.id).order("created_at").limit(1),
      client.from("subscriptions").select("channel_id,created_at").eq("user_id", state.user.id)
    ]);

    const myChannel = mine.data && mine.data[0] ? mine.data[0] : null;
    let subChannels = [];
    if (subs.data && subs.data.length) {
      const { data } = await client.from("channels")
        .select("id,user_id,channel_name,avatar_url,handle,status")
        .in("id", subs.data.map(s => s.channel_id)).eq("status", "approved");
      subChannels = data || [];
    }
    const images = await resolveImages([myChannel && myChannel.avatar_url, ...subChannels.map(c => c.avatar_url)]);
    if (myChannel) myChannel.avatar = images.get(myChannel.avatar_url) || "";
    subChannels.forEach(c => { c.avatar = images.get(c.avatar_url) || ""; });
    subChannels.sort((a, b) => a.channel_name.localeCompare(b.channel_name, "ar"));

    state.myChannel = myChannel;
    state.subs = subChannels;
  }

  async function mountShell(opts = {}) {
    const active = opts.active || "";
    const head = document.getElementById("masthead");
    if (opts.overlayGuide) document.body.classList.add("guide-overlay");
    else if (localStorage.getItem("tibyan-guide-mini") === "1") document.body.classList.add("guide-mini");

    const params = new URLSearchParams(location.search);
    head.innerHTML = `
      <div class="mast-start">
        <button class="icon-btn" id="guide-toggle" type="button" aria-label="القائمة الجانبية">${icon("menu")}</button>
        <a class="logo" href="index.html" aria-label="تِبيان — الرئيسية">
          <span class="logo-mark">${logoMark()}</span>
          <span class="logo-text">تِبيان<small>منصة القرآن الكريم</small></span>
        </a>
      </div>
      <form class="search" id="search-form" role="search" action="results.html">
        <input name="q" id="search-q" type="search" placeholder="ابحث عن سورة أو قارئ أو قناة" autocomplete="off" aria-label="بحث" value="${esc(active === "results" ? params.get("q") || "" : "")}">
        <button type="submit" aria-label="بحث">${icon("search")}</button>
      </form>
      <div class="mast-end">
        <button class="icon-btn mobile-search-btn" id="mobile-search" type="button" aria-label="بحث">${icon("search")}</button>
        <span id="mast-user"></span>
      </div>`;

    if (!document.querySelector(".guide-scrim")) {
      const scrim = document.createElement("div");
      scrim.className = "guide-scrim";
      document.body.appendChild(scrim);
      scrim.addEventListener("click", () => document.body.classList.remove("guide-open"));
    }

    document.getElementById("guide-toggle").addEventListener("click", () => {
      const overlay = document.body.classList.contains("guide-overlay") || window.innerWidth <= 1000;
      if (overlay) document.body.classList.toggle("guide-open");
      else {
        const mini = document.body.classList.toggle("guide-mini");
        localStorage.setItem("tibyan-guide-mini", mini ? "1" : "0");
      }
    });
    document.getElementById("search-form").addEventListener("submit", e => {
      const q = document.getElementById("search-q").value.trim();
      if (!q) e.preventDefault();
    });
    document.getElementById("mobile-search").addEventListener("click", () => {
      head.classList.toggle("searching");
      if (head.classList.contains("searching")) document.getElementById("search-q").focus();
    });
    document.addEventListener("click", () => {
      const m = document.getElementById("user-menu");
      if (m) m.remove();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        const m = document.getElementById("user-menu");
        if (m) m.remove();
        document.body.classList.remove("guide-open");
        head.classList.remove("searching");
      }
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        document.getElementById("search-q").focus();
      }
    });

    renderGuide(active);
    renderUserArea();

    if (!client) return state;
    try {
      await loadShellUser();
    } catch (e) {
      console.warn("shell user error", e);
    }
    renderGuide(active);
    renderUserArea();
    return state;
  }

  /* ---------------- نافذة الحفظ في قائمة ---------------- */
  function modal(html) {
    const scrim = document.createElement("div");
    scrim.className = "modal-scrim";
    scrim.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(scrim);
    const close = () => scrim.remove();
    scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
    });
    const closeBtn = scrim.querySelector("[data-close]");
    if (closeBtn) closeBtn.addEventListener("click", close);
    return { root: scrim.firstElementChild, close };
  }

  async function openSaveDialog(video) {
    const user = await getUser();
    if (!user) return goLogin("سجّل الدخول لحفظ التلاوات في قوائمك.");

    const [pls, later] = await Promise.all([
      client.from("playlists").select("id,title,is_public").eq("user_id", user.id).order("created_at"),
      client.from("watch_later").select("video_id").eq("user_id", user.id).eq("video_id", video.id)
    ]);
    const playlists = pls.data || [];
    let inPlaylists = new Set();
    if (playlists.length) {
      const { data } = await client.from("playlist_items").select("playlist_id")
        .eq("video_id", video.id).in("playlist_id", playlists.map(p => p.id));
      inPlaylists = new Set((data || []).map(r => String(r.playlist_id)));
    }

    const m = modal(`
      <h2>حفظ في… <button class="icon-btn" data-close type="button" aria-label="إغلاق">${icon("close")}</button></h2>
      <label class="check"><input type="checkbox" data-later ${later.data && later.data.length ? "checked" : ""}> ${icon("clock", "sm")} الاستماع لاحقًا</label>
      <div id="pl-checks">${playlists.map(p => `
        <label class="check"><input type="checkbox" data-pl="${esc(p.id)}" ${inPlaylists.has(String(p.id)) ? "checked" : ""}>
        ${icon("playlist", "sm")} ${esc(p.title)} <span class="muted" style="font-size:12px">${p.is_public ? "عامة" : "خاصة"}</span></label>`).join("")}</div>
      <hr style="border:0;border-top:1px solid var(--line);margin:10px 0">
      <form id="new-pl">
        <input class="input" id="new-pl-title" maxlength="120" placeholder="اسم قائمة تشغيل جديدة">
        <label class="check" style="font-size:13px"><input type="checkbox" id="new-pl-public"> قائمة عامة يراها الجميع</label>
        <div class="row"><button class="btn brand" type="submit">${icon("plus")}إنشاء وإضافة</button></div>
      </form>`);

    m.root.querySelector("[data-later]").addEventListener("change", async e => {
      const q = e.target.checked
        ? client.from("watch_later").insert({ user_id: user.id, video_id: video.id })
        : client.from("watch_later").delete().eq("user_id", user.id).eq("video_id", video.id);
      const { error } = await q;
      if (error) { toast(friendlyError(error)); e.target.checked = !e.target.checked; return; }
      toast(e.target.checked ? "أُضيفت إلى «الاستماع لاحقًا»" : "أُزيلت من «الاستماع لاحقًا»");
    });

    m.root.querySelector("#pl-checks").addEventListener("change", async e => {
      const id = e.target.dataset.pl;
      if (!id) return;
      const q = e.target.checked
        ? client.from("playlist_items").insert({ playlist_id: Number(id) || id, video_id: video.id, position: Math.floor(Date.now() / 1000) })
        : client.from("playlist_items").delete().eq("playlist_id", id).eq("video_id", video.id);
      const { error } = await q;
      if (error) { toast(friendlyError(error)); e.target.checked = !e.target.checked; return; }
      toast(e.target.checked ? "أُضيفت إلى القائمة" : "أُزيلت من القائمة");
    });

    m.root.querySelector("#new-pl").addEventListener("submit", async e => {
      e.preventDefault();
      const title = m.root.querySelector("#new-pl-title").value.trim();
      if (!title) return;
      const { data, error } = await client.from("playlists")
        .insert({ user_id: user.id, title, is_public: m.root.querySelector("#new-pl-public").checked })
        .select("id").single();
      if (error) { toast(friendlyError(error)); return; }
      await client.from("playlist_items").insert({ playlist_id: data.id, video_id: video.id, position: Math.floor(Date.now() / 1000) });
      toast("أُنشئت القائمة وأُضيفت التلاوة");
      m.close();
    });
  }

  async function share(title, url) {
    url = url || location.href;
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("نُسخ الرابط");
    } catch (e) {
      if (e && e.name !== "AbortError") prompt("انسخ الرابط:", url);
    }
  }

  function randomAyah() {
    return AYAT[Math.floor(Date.now() / 86400000) % AYAT.length];
  }

  /* ---------------- المقاطع القصيرة ---------------- */
  function shortCardHTML(video, ctx) {
    const thumb = ctx && ctx.thumbs ? ctx.thumbs.get(String(video.id)) : "";
    const href = esc("shorts.html?s=" + encodeURIComponent(video.id));
    return `<a class="scard" href="${href}">
      <span class="sthumb">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        ${thumb ? "" : `<span class="art ${categoryArt(video.category)}"><span class="art-title">${esc(truncate(video.caption || video.title, 70))}</span><span class="art-sub">${esc(video.reader_name || "")}</span></span>`}
      </span>
      <span class="stitle">${esc(video.title)}</span>
      <span class="vsub">${formatViews(video.view_count)}</span>
    </a>`;
  }

  async function renderShortsShelf(container, options = {}) {
    try {
      const shorts = await fetchVideos({ kind: "short", categories: options.categories, userIds: options.userIds, limit: options.limit || 12, order: options.order });
      if (!shorts.length) { container.hidden = true; return []; }
      const thumbs = await resolveThumbnails(shorts);
      container.hidden = false;
      container.innerHTML = `<h2 class="section-title">${icon("shorts")} مقاطع قصيرة <a href="shorts.html">عرض الكل</a></h2>
        <div class="shelf">${shorts.map(v => shortCardHTML(v, { thumbs })).join("")}</div>`;
      return shorts;
    } catch (e) {
      console.warn(e);
      container.hidden = true;
      return [];
    }
  }

  window.Tibyan = {
    client, BUCKET, CATEGORIES, STATUS_LABELS, VIDEO_COLUMNS, state,
    icon, logoMark, escapeHTML, esc, normalizeText, truncate, formatDate, timeAgo, formatCount, formatViews, formatSubs,
    formatDuration, categoryLabel, categoryArt, fillCategorySelect, sanitizeSearch,
    isHttpUrl, getYouTubeId, storagePath, signedUrls, signedUrl, resolveImages, resolveThumbnails,
    cleanFileName, uploadFile, removeFile, isAudioPath, readMediaDuration,
    fetchVideos, fetchPublishedVideos, channelsByUser, channelStats, channelUrl, watchUrl,
    getUser, getMyRoles, friendlyError, loginUrl, goLogin,
    toast, avatarHTML, artHTML, thumbInner, cardHTML, buildContext, emptyHTML, skeletonHTML, renderVideos,
    setTheme, currentTheme, mountShell, modal, openSaveDialog, share, randomAyah, VERIFIED,
    SHORT_MAX_SECONDS, shortCardHTML, renderShortsShelf
  };
})();
