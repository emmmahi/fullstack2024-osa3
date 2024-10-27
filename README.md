# Fullstack 2024 - osa 3

Paikallinen käyttö:
`npm run dev`

HPX! Tekemättä on automaatinen deployment puhelinluettelo-kansiosta:
Vaatisi jotain tälllaista `package.json`:
````
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \\\"Error: no test specified\\\" && exit 1",
    "build:ui": "rm -rf build && cd ../puhelinluettelo && npm run build && cp -r build .",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push",
    "lint": "eslint ."
  },
} 
````

Sovellus osoitteessa: 
https://fullstack2024-osa3-jvbv.onrender.com/
