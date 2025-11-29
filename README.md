# NoteAI 🤖📝

**NoteAI**, yapay zeka destekli, modern ve kullanıcı dostu bir not alma uygulamasıdır. Notlarınızı hızla oluşturun, zengin metin editörü ile düzenleyin ve uzun notlarınızı tek dokunuşla yapay zekaya özetletin.

## 🌟 Özellikler

- **✍️ Zengin Metin Editörü:** Kalın, italik, liste ve başlık özellikleri ile notlarınızı biçimlendirin.
- **🧠 AI Özetleme:** Uzun notlarınızı OpenAI destekli asistan ile saniyeler içinde özetleyin.
- **🚩 Önceliklendirme:** Notlarınıza renkli bayraklar (High, Medium, Low) atayarak önem sırasına koyun.
- **🎨 Modern Arayüz:** Temiz, ferah ve kullanıcı deneyimi odaklı tasarım.
- **🌑 Dark Mode:** Göz yormayan karanlık mod desteği (Geliştirme aşamasında).
- **📱 Cross-Platform:** Hem iOS hem de Android'de kusursuz çalışır.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React Native, Expo
- **Stil:** NativeWind (Tailwind CSS)
- **Backend:** Node.js (Vercel Serverless Functions)
- **AI:** OpenAI API (GPT-4o-mini)
- **Depolama:** AsyncStorage (Yerel depolama)

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

1. **Repo'yu klonlayın:**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/NoteAI.git
   cd NoteAI
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Backend Kurulumu (Opsiyonel):**
   - `backend` klasörünü Vercel'e deploy edin.
   - Vercel'de `OPENAI_API_KEY` environment variable'ını tanımlayın.
   - Oluşan API URL'ini `src/services/aiClient.ts` dosyasına ekleyin.

4. **Uygulamayı Başlatın:**
   ```bash
   npx expo start
   ```

## 📸 Ekran Görüntüleri

*(Buraya uygulamanızın ekran görüntülerini ekleyebilirsiniz)*

## 🔒 Gizlilik

Bu uygulama notlarınızı sadece cihazınızda saklar. AI özetleme işlemi için metinler şifreli olarak sunucuya gönderilir, işlenir ve geri döndürülür; sunucuda kalıcı olarak saklanmaz.

---
*Developed with ❤️ by Simge Tiras*

