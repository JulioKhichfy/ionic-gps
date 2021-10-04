### Para rodar no celular, execute os passos abaixo:
- ionic cordova plugin add @mauron85/cordova-plugin-background-geolocation
- ionic cordova platform add android
- ionic cordova build android
- ionic cordova run android

#### Criação da app
- ionic start ionic-gps blank --type=angular --cordova
- ionic cordova plugin add @mauron85/cordova-plugin-background-geolocation
- npm install @ionic-native/background-geolocation
- npm install @ionic-native/core

##### EXTENSIONS INSTALLED - visual code studio 1.60.2
- Cordova Tools v2.3.0
- ADB Interface for VSCode v0.22.1
- npm v0.3.22

conecte o device na porta usb e verifique o status executando o comando no terminal:

- ADB devices -l

caso não encontre seu device listado, execute:

- ADB usb