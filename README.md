# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Continuous Integration (CI/CD)

This project uses **GitHub Actions** + **Expo EAS Build** for automated testing and building.

### Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `ci.yml` | Push / PR ke main | Jalankan lint, TypeScript check, dan Jest tests |
| `build-android.yml` | Push ke main / manual | Build APK & AAB dengan EAS |
| `build-ios.yml` | Push ke main / manual | Build IPA dengan EAS |

### Setup yang dibutuhkan

1. **Instalasi EAS CLI** di lokal:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Tambahkan secrets di GitHub Repository** (`Settings → Secrets and variables → Actions`):

   | Secret | Deskripsi |
   |--------|-----------|
   | `EXPO_TOKEN` | Token dari `eas login` |
   | `ANDROID_KEYSTORE` | Base64-encoded keystore (opsional, untuk signed build) |
   | `ANDROID_KEY_PASSWORD` | Password key alias |
   | `ANDROID_KEY_ALIAS` | Alias key |
   | `ANDROID_KEY_STORE_PASSWORD` | Password keystore |

3. **Konfigurasi di expo.dev**: Buat profile di [expo.dev/projects](https://expo.dev/projects) untuk project ini.

### Menjalankan secara manual

```bash
# Build Android
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview

# Submit ke Play Store / TestFlight
eas submit --platform android
eas submit --platform ios
```
