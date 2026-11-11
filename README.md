# Hangi Ülke Hangi Bayrak? — Android bulut derleme başlangıç projesi

Bu ZIP, V5 tarayıcı prototipini Capacitor projesine taşır. **Play Store'a yüklenmeye hazır ürün değildir.**

## Android Studio kurmadan deneme derlemesi
1. GitHub'da özel (private) bir depo oluşturun.
2. ZIP içeriğini (gizli `.github` klasörü dahil) deponun köküne yükleyin.
3. GitHub Actions > Android AAB (cloud build) > Run workflow.
4. Actions tamamlanınca `unsigned-aab-not-for-play-upload` adlı artifact'ı indirin.

**ÖNEMLİ:** Bu workflow yalnızca **imzasız** AAB üretir. Google Play'e yüklenemez. Mevcut uygulamayı güncellemek için Play App Signing / upload key bilgileri, uygun sürüm kodu ve imzalı release gereklidir. İlk yükleme için de imzalı AAB gerekir. İmzalama anahtarlarını asla sohbet üzerinden paylaşmayın; GitHub Secrets ile yapılandırın.

## Yayına geçmeden önce zorunlu işler
- Play Console > Politika durumu içindeki kaldırılma gerekçesini öğrenin ve düzeltin; üretim erişimi/uygulama durumu doğrulansın.
- Gerçek hesap sistemi (nickname + doğrulanan şifre), güvenli hesap kurtarma ve silme, sunucu tarafında nickname moderasyonu.
- Gerçek küresel ilk 35 sıralaması, sunucuda puan/süre kontrolü, hile önleme.
- 35 dakikalık limitin 24 saatlik güvenilir sunucu döngüsü ve arka plan davranışı.
- Bayrak görselleri için çevrimdışı paketleme veya sağlam erişim; mevcut demo uzaktan görsel yükler.
- Beş dilde metinlerin ve tüm 195 ülke adının editoryal doğrulanması.
- Veri güvenliği beyanı, gizlilik politikası, hesap silme bağlantısı, içerik derecelendirmesi, hedef API, test, ekran görüntüleri, mağaza açıklaması.
- Gerçek Android cihaz üzerinde işlevsel test ve yayın sürüm kodu.

4 karakterlik şifre isteği güvenlik açısından zayıftır. Gerçek hesapta sunucu tarafında parola karması, rate-limit ve ek koruma şarttır.
