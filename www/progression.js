const streakThresholds = [5, 10, 15, 25, 35, 50, 75, 100, 150, 195];
const streakBadgeStep = 5;

function rewardIcon(kind, level, size = '') {
  if (!level) return '<span class="reward-icon reward-empty '+size+'" aria-hidden="true">–</span>';
  const symbols = ['✦','◆','★','✿','✪'];
  if(kind==='streak'){
    const color=Math.min(4,Math.floor((level-1)/2));
    return '<span class="reward-icon reward-streak reward-color-'+color+'" aria-hidden="true">'+symbols[color]+'</span>';
  }
  const tier=kind==='final'?4:Math.min(3,Math.floor((level-1)/50));
  const face=number(level);
  const label=kind==='final'?p('finalBadge'):number(level)+' '+rulesDetails[lang][4];
  return '<span class="reward-icon streak-medal medal-tier-'+tier+' '+size+'" role="img" aria-label="'+safe(label)+'"><span class="medal-face" aria-hidden="true">'+face+'</span></span>';
}

function playerMedal(bestStreak, questionCount, size = '') {
  const rewards=playerRewards(bestStreak,questionCount);
  return rewards.finalBadge
    ? rewardIcon('final',questionCount,size)
    : rewardIcon('badge',rewards.streakBadges*streakBadgeStep,size);
}

function playerRewards(streak, questionCount) {
  const streakTitles = streakThresholds.filter(threshold => streak >= threshold).length;
  const streakBadges = Math.floor(Math.min(streak, questionCount) / streakBadgeStep);
  const finalBadge = streak >= questionCount;
  return {streakTitles, streakBadges, finalBadge};
}

const progressCopy = {
  tr: {
    labels: {
      profile: "Profil",
      rules: "Kurallar",
      rank: "Dünya sıran",
      players: "Kayıtlı oyuncular",
      badges: "Toplam rozet",
      titles: "Toplam unvan",
      playtime: "Oynama süresi",
      streakTitle: "Seri unvanı",
      none: "Henüz yok",
      newTitle: "Yeni unvan",
      newBadge: "Yeni rozet",
      finalBadge: "Tam Seri",
      loadError: "Yüklenemedi",
      signOut: "Oturumu kapat",
      retry: "Yeniden dene",
      topThree: "Dünya İlk 3",
      leaderLoading: "Sıralama yükleniyor…",
      leaderEmpty: "Henüz sıralamada oyuncu yok."
    },
    streak: ['Çaylak','Bayrak Gezgini','Gözlemci','Ülke Kaşifi','Bayrak Uzmanı','Harita Ustası','Kıta Kaşifi','Dünya Ustası','Bayrak Şampiyonu','Bayrak Efsanesi'],
    rules: ['Bayraktan ülkeyi veya ülkeden bayrağı seç. Her soru 10 saniye sürer. Bir yanlış veya süre aşımı seriyi bitirir.','500 ms içinde doğru cevap ×3, 1 saniye içinde ×2 puan verir. Bazı sorularda kademe bonusu vardır. Tüm seriyi tamamlamak toplam puanı ×10 yapar.','Bu cihazda her 24 saatte 30 dakika oynayabilirsin. Her 5 doğru cevapta bir seri rozeti, tüm soruları bitirince ek bir rozet kazanırsın. Unvanlar en iyi serine göre açılır.','Kullanıcı adında 3–20 harf veya rakam kullan. Hakaret, nefret söylemi ve uygunsuz adlara izin verilmez. Yeni hesap şifresi en az 6 karakter olmalı.']
  },
  en: {
    labels: {
      profile: "Profile",
      rules: "Rules",
      rank: "World rank",
      players: "Registered players",
      badges: "Total badges",
      titles: "Total titles",
      playtime: "Playtime",
      streakTitle: "Streak title",
      none: "None yet",
      newTitle: "New title",
      newBadge: "New badge",
      finalBadge: "Complete Streak",
      loadError: "Could not load",
      signOut: "Sign out",
      retry: "Retry",
      topThree: "World Top 3",
      leaderLoading: "Loading leaderboard…",
      leaderEmpty: "No ranked players yet."
    },
    streak: ['Rookie','Flag Traveler','Observer','Country Explorer','Flag Expert','Map Master','Continent Explorer','World Master','Flag Champion','Flag Legend'],
    rules: ['Pick the country matching the flag, or the flag matching the country. You have 10 seconds per question. A mistake or timeout ends the streak.','A correct answer within 500 ms earns ×3 and within one second earns ×2. Some questions have stage bonuses. Completing the streak multiplies its total points by 10.','You can play for 30 minutes per 24 hours on this device. Earn a streak badge every five correct answers and an extra badge for completing all questions. Titles unlock as your best streak grows.','Use 3–20 letters or numbers in your nickname. Insults, hate speech and inappropriate names are prohibited. New account passwords must have at least six characters.']
  },
  ru: {
    labels: {
      profile: "Профиль",
      rules: "Правила",
      rank: "Место в мире",
      players: "Игроков зарегистрировано",
      badges: "Всего значков",
      titles: "Всего званий",
      playtime: "Время игры",
      streakTitle: "Звание за серию",
      none: "Пока нет",
      newTitle: "Новое звание",
      newBadge: "Новый значок",
      finalBadge: "Полная серия",
      loadError: "Не удалось загрузить",
      signOut: "Выйти",
      retry: "Повторить",
      topThree: "Мировой топ-3",
      leaderLoading: "Загрузка рейтинга…",
      leaderEmpty: "В рейтинге пока нет игроков."
    },
    streak: ['Новичок','Путешественник','Наблюдатель','Знаток стран','Знаток флагов','Мастер карт','Исследователь континентов','Знаток мира','Чемпион флагов','Легенда флагов'],
    rules: ['Выберите страну по флагу или флаг по стране. На ответ даётся 10 секунд. Ошибка или истечение времени завершает серию.','Правильный ответ за 500 мс приносит ×3 очков, за одну секунду — ×2. Некоторые вопросы дают бонус этапа. За полную серию очки умножаются на 10.','На этом устройстве можно играть 30 минут за 24 часа. За каждые пять верных ответов подряд даётся значок, за все вопросы — дополнительный. Звания зависят от лучшей серии.','В имени должно быть 3–20 букв или цифр. Оскорбления, разжигание ненависти и неприемлемые имена запрещены. Пароль нового аккаунта должен содержать не менее шести символов.']
  },
  ar: {
    labels: {
      profile: "الملف الشخصي",
      rules: "القواعد",
      rank: "الترتيب العالمي",
      players: "اللاعبون المسجلون",
      badges: "مجموع الشارات",
      titles: "مجموع الألقاب",
      playtime: "وقت اللعب",
      streakTitle: "لقب السلسلة",
      none: "لا يوجد بعد",
      newTitle: "لقب جديد",
      newBadge: "شارة جديدة",
      finalBadge: "السلسلة الكاملة",
      loadError: "تعذر التحميل",
      signOut: "تسجيل الخروج",
      retry: "إعادة المحاولة",
      topThree: "أفضل 3 لاعبين عالميًا",
      leaderLoading: "جارٍ تحميل الترتيب…",
      leaderEmpty: "لا يوجد لاعبون في الترتيب بعد."
    },
    streak: ['مبتدئ','رحالة الأعلام','مراقب','مستكشف الدول','خبير الأعلام','خبير الخرائط','مستكشف القارات','خبير العالم','بطل الأعلام','أسطورة الأعلام'],
    rules: ['اختر الدولة المطابقة للعلم أو العلم المطابق للدولة. لكل سؤال 10 ثوانٍ. تنتهي السلسلة عند الخطأ أو انتهاء الوقت.','الإجابة الصحيحة خلال 500 مللي ثانية تمنح ثلاثة أضعاف النقاط، وخلال ثانية تمنح ضعفها. لبعض الأسئلة مكافآت، وإكمال السلسلة يضاعف مجموع نقاطها عشر مرات.','يمكنك اللعب 30 دقيقة كل 24 ساعة على هذا الجهاز. تحصل على شارة لكل خمس إجابات صحيحة متتالية وشارة إضافية عند إكمال جميع الأسئلة. تُفتح الألقاب حسب أفضل سلسلة.','استخدم من 3 إلى 20 حرفًا أو رقمًا في اسمك. تُحظر الإهانات وخطاب الكراهية والأسماء غير اللائقة. يجب ألا تقل كلمة مرور الحساب الجديد عن ستة أحرف.']
  },
  cs: {
    labels: {
      profile: "Profil",
      rules: "Pravidla",
      rank: "Světové pořadí",
      players: "Registrovaní hráči",
      badges: "Celkem odznaků",
      titles: "Celkem titulů",
      playtime: "Herní čas",
      streakTitle: "Titul za sérii",
      none: "Zatím žádný",
      newTitle: "Nový titul",
      newBadge: "Nový odznak",
      finalBadge: "Úplná série",
      loadError: "Nepodařilo se načíst",
      signOut: "Odhlásit se",
      retry: "Zkusit znovu",
      topThree: "Světová top 3",
      leaderLoading: "Načítání žebříčku…",
      leaderEmpty: "V žebříčku zatím nejsou hráči."
    },
    streak: ['Nováček','Cestovatel za vlajkami','Pozorovatel','Průzkumník zemí','Znalec vlajek','Mistr map','Průzkumník kontinentů','Znalec světa','Šampion vlajek','Legenda vlajek'],
    rules: ['Vyber zemi podle vlajky nebo vlajku podle země. Na otázku máš 10 sekund. Chyba nebo vypršení času ukončí sérii.','Správná odpověď do 500 ms přinese trojnásobek bodů, do jedné sekundy dvojnásobek. Některé otázky mají bonus. Dokončením série získáš desetinásobek jejích bodů.','Na tomto zařízení můžeš hrát 30 minut za 24 hodin. Za každých pět správných odpovědí v řadě získáš odznak a za celou sérii další. Tituly se odemykají podle nejlepší série.','Přezdívka musí mít 3–20 písmen nebo číslic. Urážky, nenávistné projevy a nevhodné přezdívky jsou zakázány. Heslo nového účtu musí mít alespoň šest znaků.']
  }
};

const rulesDetails = {
  tr: ['Cevaplanan soru','Rozet ilerlemesi','Her yeni oyun sıfır doğru cevapla başlar. Kazandığın puanlar, unvanlar ve rozetler hesabında birikir.','Süreye ekranda açık olan sorular dahildir. Geçmiş turlarda yalnızca doğru cevap sayısı kayıtlıysa, soru toplamına o sayı eklenir.','üst üste doğru'],
  en: ['Questions answered','Badge progress','Each new game starts with zero correct answers. You keep the points, titles and badges you have earned.','Playtime counts time spent on questions in the foreground. Older rounds contribute their recorded correct answers when only that count is available.','correct in a row'],
  ru: ['Дано ответов','Прогресс значков','Каждая новая игра начинается с нуля верных ответов. Заработанные очки, звания и значки сохраняются в аккаунте.','Учитывается время на вопросы, пока игра открыта на экране. Если в старом раунде записаны только верные ответы, в итог входит их число.','верных подряд'],
  ar: ['الأسئلة المجاب عنها','تقدّم الشارات','تبدأ كل لعبة جديدة من صفر إجابات صحيحة. يحتفظ حسابك بالنقاط والألقاب والشارات التي كسبتها.','يُحسب وقت الأسئلة أثناء ظهور اللعبة على الشاشة. إذا كانت الجولة القديمة تسجل الإجابات الصحيحة فقط، يُضاف عددها إلى الإجمالي.','إجابات صحيحة متتالية'],
  cs: ['Zodpovězené otázky','Postup odznaků','Každá nová hra začíná s nulou správných odpovědí. Získané body, tituly a odznaky se ukládají na účet.','Herní čas se počítá u otevřených otázek, když je hra na obrazovce. Pokud má starší kolo uložený pouze počet správných odpovědí, přičte se tento počet.','správně za sebou']
};
