# MarmIOT

MarmIOT est une application de gestion de capteurs IoT basée sur ESP32. Elle permet de surveiller et de gérer des capteurs IoT, de recevoir des événements (comme des pressions de bouton), et de visualiser les données via une interface web.

## Architecture

L'application est divisée en trois parties principales :

1. **Backend** : Une API RESTful construite avec Node.js, Express, et TypeORM. Elle gère les capteurs et les événements, et se connecte à une base de données MariaDB.

2. **Frontend** : Une interface utilisateur construite avec React et Vite. Elle permet de visualiser les capteurs et les événements.

3. **Base de données** : Une base de données MariaDB pour stocker les données des capteurs et des événements.

## Fonctionnalités

- **Gestion des capteurs** : Ajout, modification, suppression, et visualisation des capteurs.
- **Gestion des événements** : Réception et visualisation des événements des capteurs (comme les pressions de bouton).
- **Documentation de l'API** : Documentation interactive de l'API avec Swagger.
- **Interface utilisateur** : Interface web pour visualiser les capteurs et les événements.

## Prérequis

- Node.js (v20 ou supérieur)
- npm (v9 ou supérieur)
- MariaDB (v10.6 ou supérieur)
- Docker (pour le déploiement avec Docker)

## Installation

Pour installer et configurer l'application, suivez le guide d'installation détaillé dans le fichier [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md).

## Configuration

### Backend

1. Clonez le dépôt Git :
   ```bash
   git clone https://github.com/KevinCHAILLY/MarmIOT-API.git
   ```

2. Accédez au dossier du backend :
   ```bash
   cd MarmIOT-API/backend
   ```

3. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```

4. Créez un fichier `.env` à partir du fichier `.env.example` et configurez les variables d'environnement :
   ```bash
   cp .env.example .env
   ```

5. Construisez le projet :
   ```bash
   npm run build
   ```

6. Démarrez le serveur :
   ```bash
   npm start
   ```

### Frontend

1. Accédez au dossier du frontend :
   ```bash
   cd MarmIOT-API/frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configurez l'URL de l'API dans le fichier `src/api.ts` :
   ```javascript
   const API_BASE_URL = "http://<IP_DE_LA_VM_BACKEND>:3000/api";
   ```

4. Construisez le projet :
   ```bash
   npm run build
   ```

5. Servez les fichiers statiques avec un serveur web comme Nginx.

### Base de données

1. Installez MariaDB :
   ```bash
   sudo apt install mariadb-server -y
   ```

2. Sécurisez l'installation de MariaDB :
   ```bash
   sudo mysql_secure_installation
   ```

3. Créez la base de données et l'utilisateur :
   ```sql
   CREATE DATABASE marmiot;
   CREATE USER 'marmiot_user'@'%' IDENTIFIED BY 'yourpassword';
   GRANT ALL PRIVILEGES ON marmiot.* TO 'marmiot_user'@'%';
   FLUSH PRIVILEGES;
   ```

## Déploiement avec Docker

Pour déployer l'application avec Docker, suivez les étapes suivantes :

1. Clonez le dépôt Git :
   ```bash
   git clone https://github.com/KevinCHAILLY/MarmIOT-API.git
   ```

2. Accédez au dossier du projet :
   ```bash
   cd MarmIOT-API
   ```

3. Configurez les variables d'environnement dans les fichiers `.env` du backend et du frontend.

4. Construisez et démarrez les conteneurs Docker :
   ```bash
   docker-compose up --build
   ```

## Utilisation

### Accès à l'application

Une fois l'application déployée, vous pouvez accéder à l'interface utilisateur depuis un navigateur web :

```
http://<IP_DE_LA_VM_FRONTEND>
```

### Documentation de l'API

Vous pouvez accéder à la documentation de l'API Swagger pour explorer les endpoints disponibles :

```
http://<IP_DE_LA_VM_BACKEND>:3000/api-docs
```

## Tests

Pour exécuter les tests du backend, utilisez la commande suivante :

```bash
cd backend
npm test
```

## Contribution

Les contributions sont les bienvenues ! Pour contribuer au projet, suivez les étapes suivantes :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos changements (`git commit -am 'Ajout de ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à me contacter directement.

## Remerciements

Merci à tous ceux qui ont contribué à ce projet !