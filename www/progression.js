const streakThresholds = [5, 10, 15, 25, 35, 50, 75, 100, 150, 195];
const playtimeMinutes = [5, 15, 30, 60, 120, 240, 480, 960, 1800, 3600];
const streakBadgeStep = 5;

function rewardIcon(kind, level, size = '') {
  if (!level) return '<span class="reward-icon reward-empty '+size+'" aria-hidden="true">–</span>';
  const symbols = ['✦','◆','★','✿','✪'];
  const color = Math.min(4, Math.floor((level-1)/(kind==='badge'?8:2)));
  const symbol = kind==='badge'?level:kind==='final'?'★':symbols[color];
  return '<span class="reward-icon reward-'+kind+' reward-color-'+color+' '+size+'" aria-hidden="true">'+symbol+'</span>';
}

function playerRewards(streak, lifetimeMs, questionCount) {
  const streakTitles = streakThresholds.filter(threshold => streak >= threshold).length;
  const timeTitles = playtimeMinutes.filter(minutes => lifetimeMs >= minutes * 60000).length;
  const streakBadges = Math.floor(Math.min(streak, questionCount) / streakBadgeStep);
  const finalBadge = streak >= questionCount;
  return {streakTitles, timeTitles, streakBadges, finalBadge};
}

const progressCopy = {
  tr: {
    labels: ['Profil','Kurallar','Dünya sıran','Kayıtlı oyuncular','Toplam rozet','Toplam unvan','Oynama süresi','Seri unvanı','Süre unvanı','Henüz yok','Yeni unvan','Yeni rozet','Tam Seri','Yüklenemedi','Oturumu kapat','Yeniden dene'],
    streak: ['Çaylak','Bayrak Gezgini','Gözlemci','Ülke Kaşifi','Bayrak Uzmanı','Harita Ustası','Kıta Kaşifi','Dünya Ustası','Bayrak Şampiyonu','Bayrak Efsanesi'],
    time: ['İlk Adım','Meraklı','Gezgin','Maceracı','Kâşif','Kıdemli Gezgin','Dünya Gezgini','Atlas Ustası','Dünya Emektarı','Sonsuz Gezgin'],
    rules: ['Bayraktan ülkeyi veya ülkeden bayrağı seç. Her soru 10 saniye sürer. Bir yanlış veya süre aşımı seriyi bitirir.','500 ms içinde doğru cevap ×3, 1 saniye içinde ×2 puan verir. Bazı sorularda kademe bonusu vardır. Tüm seriyi tamamlamak toplam puanı ×10 yapar.','Bu cihazda her 24 saatte 30 dakika oynayabilirsin. Her 5 doğru cevapta bir seri rozeti, tüm soruları bitirince ek bir rozet kazanırsın. Unvanlar en iyi serine ve kaydedilen toplam oynama sürene göre açılır.','Kullanıcı adında 3–20 harf veya rakam kullan. Hakaret, nefret söylemi ve uygunsuz adlara izin verilmez. Yeni hesap şifresi en az 6 karakter olmalı.']
  },
  en: {
    labels: ['Profile','Rules','World rank','Registered players','Total badges','Total titles','Playtime','Streak title','Playtime title','None yet','New title','New badge','Complete Streak','Could not load','Sign out','Retry'],
    streak: ['Rookie','Flag Traveler','Observer','Country Explorer','Flag Expert','Map Master','Continent Explorer','World Master','Flag Champion','Flag Legend'],
    time: ['First Step','Curious Player','Traveler','Adventurer','Explorer','Seasoned Traveler','World Traveler','Atlas Master','Veteran','Endless Traveler'],
    rules: ['Pick the country matching the flag, or the flag matching the country. You have 10 seconds per question. A mistake or timeout ends the streak.','A correct answer within 500 ms earns ×3 and within one second earns ×2. Some questions have stage bonuses. Completing the streak multiplies its total points by 10.','You can play for 30 minutes per 24 hours on this device. Earn a streak badge every five correct answers and an extra badge for completing all questions. Titles unlock as your best streak and recorded playtime grow.','Use 3–20 letters or numbers in your nickname. Insults, hate speech and inappropriate names are prohibited. New account passwords must have at least six characters.']
  },
  ru: {
    labels: ['Профиль','Правила','Место в мире','Игроков зарегистрировано','Всего значков','Всего званий','Время игры','Звание за серию','Звание за время','Пока нет','Новое звание','Новый значок','Полная серия','Не удалось загрузить','Выйти','Повторить'],
    streak: ['Новичок','Путешественник','Наблюдатель','Знаток стран','Знаток флагов','Мастер карт','Исследователь континентов','Знаток мира','Чемпион флагов','Легенда флагов'],
    time: ['Первый шаг','Любознательный','Странник','Искатель приключений','Исследователь','Бывалый странник','Кругосветный путешественник','Мастер атласа','Ветеран','Вечный странник'],
    rules: ['Выберите страну по флагу или флаг по стране. На ответ даётся 10 секунд. Ошибка или истечение времени завершает серию.','Правильный ответ за 500 мс приносит ×3 очков, за одну секунду — ×2. Некоторые вопросы дают бонус этапа. За полную серию очки умножаются на 10.','На этом устройстве можно играть 30 минут за 24 часа. За каждые пять верных ответов подряд даётся значок, за все вопросы — дополнительный. Звания зависят от лучшей серии и учтённого времени игры.','В имени должно быть 3–20 букв или цифр. Оскорбления, разжигание ненависти и неприемлемые имена запрещены. Пароль нового аккаунта должен содержать не менее шести символов.']
  },
  ar: {
    labels: ['الملف الشخصي','القواعد','الترتيب العالمي','اللاعبون المسجلون','مجموع الشارات','مجموع الألقاب','وقت اللعب','لقب السلسلة','لقب وقت اللعب','لا يوجد بعد','لقب جديد','شارة جديدة','السلسلة الكاملة','تعذر التحميل','تسجيل الخروج','إعادة المحاولة'],
    streak: ['مبتدئ','رحالة الأعلام','مراقب','مستكشف الدول','خبير الأعلام','خبير الخرائط','مستكشف القارات','خبير العالم','بطل الأعلام','أسطورة الأعلام'],
    time: ['الخطوة الأولى','لاعب فضولي','مسافر','مغامر','مستكشف','مسافر متمرس','رحالة العالم','خبير الأطلس','لاعب مخضرم','رحالة دائم'],
    rules: ['اختر الدولة المطابقة للعلم أو العلم المطابق للدولة. لكل سؤال 10 ثوانٍ. تنتهي السلسلة عند الخطأ أو انتهاء الوقت.','الإجابة الصحيحة خلال 500 مللي ثانية تمنح ثلاثة أضعاف النقاط، وخلال ثانية تمنح ضعفها. لبعض الأسئلة مكافآت، وإكمال السلسلة يضاعف مجموع نقاطها عشر مرات.','يمكنك اللعب 30 دقيقة كل 24 ساعة على هذا الجهاز. تحصل على شارة لكل خمس إجابات صحيحة متتالية وشارة إضافية عند إكمال جميع الأسئلة. تُفتح الألقاب حسب أفضل سلسلة ووقت اللعب المسجل.','استخدم من 3 إلى 20 حرفًا أو رقمًا في اسمك. تُحظر الإهانات وخطاب الكراهية والأسماء غير اللائقة. يجب ألا تقل كلمة مرور الحساب الجديد عن ستة أحرف.']
  },
  cs: {
    labels: ['Profil','Pravidla','Světové pořadí','Registrovaní hráči','Celkem odznaků','Celkem titulů','Herní čas','Titul za sérii','Titul za herní čas','Zatím žádný','Nový titul','Nový odznak','Úplná série','Nepodařilo se načíst','Odhlásit se','Zkusit znovu'],
    streak: ['Nováček','Cestovatel za vlajkami','Pozorovatel','Průzkumník zemí','Znalec vlajek','Mistr map','Průzkumník kontinentů','Znalec světa','Šampion vlajek','Legenda vlajek'],
    time: ['První krok','Zvědavý hráč','Cestovatel','Dobrodruh','Průzkumník','Zkušený cestovatel','Světoběžník','Mistr atlasu','Veterán','Věčný poutník'],
    rules: ['Vyber zemi podle vlajky nebo vlajku podle země. Na otázku máš 10 sekund. Chyba nebo vypršení času ukončí sérii.','Správná odpověď do 500 ms přinese trojnásobek bodů, do jedné sekundy dvojnásobek. Některé otázky mají bonus. Dokončením série získáš desetinásobek jejích bodů.','Na tomto zařízení můžeš hrát 30 minut za 24 hodin. Za každých pět správných odpovědí v řadě získáš odznak a za celou sérii další. Tituly se odemykají podle nejlepší série a zaznamenaného herního času.','Přezdívka musí mít 3–20 písmen nebo číslic. Urážky, nenávistné projevy a nevhodné přezdívky jsou zakázány. Heslo nového účtu musí mít alespoň šest znaků.']
  }
};

const rulesDetails = {
  tr: ['Cevaplanan soru','Rozet ilerlemesi','Her yeni oyun sıfır doğru cevapla başlar. Kazandığın puanlar, unvanlar ve rozetler hesabında birikir.','Süreye ekranda açık olan sorular dahildir. Geçmiş turlarda yalnızca doğru cevap sayısı kayıtlıysa, soru toplamına o sayı eklenir.','üst üste doğru'],
  en: ['Questions answered','Badge progress','Each new game starts with zero correct answers. You keep the points, titles and badges you have earned.','Playtime counts time spent on questions in the foreground. Older rounds contribute their recorded correct answers when only that count is available.','correct in a row'],
  ru: ['Дано ответов','Прогресс значков','Каждая новая игра начинается с нуля верных ответов. Заработанные очки, звания и значки сохраняются в аккаунте.','Учитывается время на вопросы, пока игра открыта на экране. Если в старом раунде записаны только верные ответы, в итог входит их число.','верных подряд'],
  ar: ['الأسئلة المجاب عنها','تقدّم الشارات','تبدأ كل لعبة جديدة من صفر إجابات صحيحة. يحتفظ حسابك بالنقاط والألقاب والشارات التي كسبتها.','يُحسب وقت الأسئلة أثناء ظهور اللعبة على الشاشة. إذا كانت الجولة القديمة تسجل الإجابات الصحيحة فقط، يُضاف عددها إلى الإجمالي.','إجابات صحيحة متتالية'],
  cs: ['Zodpovězené otázky','Postup odznaků','Každá nová hra začíná s nulou správných odpovědí. Získané body, tituly a odznaky se ukládají na účet.','Herní čas se počítá u otevřených otázek, když je hra na obrazovce. Pokud má starší kolo uložený pouze počet správných odpovědí, přičte se tento počet.','správně za sebou']
};
