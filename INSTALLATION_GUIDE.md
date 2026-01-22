# Guide d'Installation de MarmIOT

Ce guide vous explique comment installer et configurer l'application MarmIOT sur trois machines virtuelles (VM) sous Debian 13. Chaque VM aura un rôle spécifique :
- **VM 1** : Base de données MariaDB
- **VM 2** : Backend (API Node.js)
- **VM 3** : Frontend (React)

## Prérequis
- Trois machines virtuelles avec Debian 13 installées.
- Accès root ou sudo sur chaque VM.
- Connexion réseau entre les VM.

## Configuration des VM

### VM 1 : Base de données MariaDB

#### Étape 1 : Mise à jour du système
Ouvrez un terminal et exécutez les commandes suivantes pour mettre à jour votre système :

```bash
sudo apt update
```
**Rôle** : Met à jour la liste des paquets disponibles.

```bash
sudo apt upgrade -y
```
**Rôle** : Met à jour tous les paquets installés.

#### Étape 2 : Installation de MariaDB
Installez MariaDB avec la commande suivante :

```bash
sudo apt install mariadb-server -y
```
**Rôle** : Installe le serveur MariaDB.

#### Étape 3 : Configuration de MariaDB
Sécurisez l'installation de MariaDB :

```bash
sudo mysql_secure_installation
```
**Rôle** : Configure la sécurité de MariaDB (mot de passe root, suppression des utilisateurs anonymes, etc.).

#### Étape 4 : Création de la base de données et de l'utilisateur
Connectez-vous à MariaDB :

```bash
sudo mysql -u root -p
```
**Rôle** : Ouvre une session MariaDB en tant qu'utilisateur root.

Créez la base de données et l'utilisateur pour MarmIOT :

```sql
CREATE DATABASE marmiot;
CREATE USER 'marmiot_user'@'%' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON marmiot.* TO 'marmiot_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```
**Rôle** : Crée la base de données `marmiot`, un utilisateur `marmiot_user` avec le mot de passe `yourpassword`, et lui donne tous les droits sur la base de données.

#### Étape 5 : Configuration du pare-feu
Autorisez le trafic sur le port 3306 (port par défaut de MariaDB) :

```bash
sudo ufw allow 3306
```
**Rôle** : Autorise les connexions entrantes sur le port 3306.

```bash
sudo ufw enable
```
**Rôle** : Active le pare-feu.

#### Étape 6 : Configuration de MariaDB pour accepter les connexions distantes
Éditez le fichier de configuration de MariaDB :

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```
**Rôle** : Ouvre le fichier de configuration de MariaDB.

Trouvez la ligne `bind-address = 127.0.0.1` et remplacez-la par :

```ini
bind-address = 0.0.0.0
```
**Rôle** : Permet à MariaDB d'accepter les connexions depuis n'importe quelle adresse IP.

Redémarrez MariaDB pour appliquer les changements :

```bash
sudo systemctl restart mariadb
```
**Rôle** : Redémarre le service MariaDB pour appliquer les modifications.

### VM 2 : Backend (API Node.js)

#### Étape 1 : Mise à jour du système
Ouvrez un terminal et exécutez les commandes suivantes pour mettre à jour votre système :

```bash
sudo apt update
```
**Rôle** : Met à jour la liste des paquets disponibles.

```bash
sudo apt upgrade -y
```
**Rôle** : Met à jour tous les paquets installés.

#### Étape 2 : Installation de Node.js et npm
Installez Node.js et npm :

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
**Rôle** : Ajoute le dépôt Node.js à votre système.

```bash
sudo apt install -y nodejs
```
**Rôle** : Installe Node.js et npm.

Vérifiez l'installation :

```bash
node -v
npm -v
```
**Rôle** : Affiche les versions de Node.js et npm pour confirmer l'installation.

#### Étape 3 : Clonage du dépôt Git
Clonez le dépôt Git du projet :

```bash
git clone https://github.com/KevinCHAILLY/MarmIOT-API.git
```
**Rôle** : Télécharge le code source du projet depuis GitHub.

```bash
cd MarmIOT-API/backend
```
**Rôle** : Se déplace dans le dossier du backend.

#### Étape 4 : Installation des dépendances
Installez les dépendances du projet :

```bash
npm install --legacy-peer-deps
```
**Rôle** : Installe toutes les dépendances nécessaires pour le backend.

#### Étape 5 : Configuration de l'environnement
Créez un fichier `.env` à partir du fichier `.env.example` :

```bash
cp .env.example .env
```
**Rôle** : Copie le fichier d'exemple de configuration.

Éditez le fichier `.env` :

```bash
nano .env
```
**Rôle** : Ouvre le fichier `.env` pour le modifier.

Modifiez les valeurs pour correspondre à votre configuration :

```ini
DB_HOST=<IP_DE_LA_VM_MARIADB>
DB_PORT=3306
DB_USERNAME=marmiot_user
DB_PASSWORD=yourpassword
DB_NAME=marmiot
PORT=3000
SWAGGER_PATH=/api-docs
```
**Rôle** : Configure les paramètres de connexion à la base de données et au serveur.

#### Étape 6 : Construction et démarrage du backend
Construisez le projet :

```bash
npm run build
```
**Rôle** : Compile le code TypeScript en JavaScript.

Démarrez le serveur :

```bash
npm start
```
**Rôle** : Démarre le serveur backend.

#### Étape 7 : Configuration du pare-feu
Autorisez le trafic sur le port 3000 :

```bash
sudo ufw allow 3000
```
**Rôle** : Autorise les connexions entrantes sur le port 3000.

```bash
sudo ufw enable
```
**Rôle** : Active le pare-feu.

### VM 3 : Frontend (React)

#### Étape 1 : Mise à jour du système
Ouvrez un terminal et exécutez les commandes suivantes pour mettre à jour votre système :

```bash
sudo apt update
```
**Rôle** : Met à jour la liste des paquets disponibles.

```bash
sudo apt upgrade -y
```
**Rôle** : Met à jour tous les paquets installés.

#### Étape 2 : Installation de Node.js et npm
Installez Node.js et npm :

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
**Rôle** : Ajoute le dépôt Node.js à votre système.

```bash
sudo apt install -y nodejs
```
**Rôle** : Installe Node.js et npm.

Vérifiez l'installation :

```bash
node -v
npm -v
```
**Rôle** : Affiche les versions de Node.js et npm pour confirmer l'installation.

#### Étape 3 : Clonage du dépôt Git
Clonez le dépôt Git du projet :

```bash
git clone https://github.com/KevinCHAILLY/MarmIOT-API.git
```
**Rôle** : Télécharge le code source du projet depuis GitHub.

```bash
cd MarmIOT-API/frontend
```
**Rôle** : Se déplace dans le dossier du frontend.

#### Étape 4 : Installation des dépendances
Installez les dépendances du projet :

```bash
npm install --legacy-peer-deps
```
**Rôle** : Installe toutes les dépendances nécessaires pour le frontend.

#### Étape 5 : Configuration de l'environnement
Éditez le fichier `src/api.ts` pour configurer l'URL de l'API :

```bash
nano src/api.ts
```
**Rôle** : Ouvre le fichier `api.ts` pour le modifier.

Modifiez l'URL de l'API pour correspondre à l'adresse IP de la VM backend :

```javascript
const API_BASE_URL = "http://<IP_DE_LA_VM_BACKEND>:3000/api";
```
**Rôle** : Configure l'URL de l'API pour que le frontend puisse communiquer avec le backend.

#### Étape 6 : Construction et démarrage du frontend
Construisez le projet :

```bash
npm run build
```
**Rôle** : Compile le code React en fichiers statiques.

Installez un serveur web pour servir le frontend (par exemple, Nginx) :

```bash
sudo apt install nginx -y
```
**Rôle** : Installe le serveur web Nginx.

Copiez les fichiers construits dans le dossier de Nginx :

```bash
sudo cp -r dist/* /var/www/html/
```
**Rôle** : Copie les fichiers du frontend dans le dossier de Nginx.

Démarrez Nginx :

```bash
sudo systemctl start nginx
```
**Rôle** : Démarre le serveur web Nginx.

#### Étape 7 : Configuration du pare-feu
Autorisez le trafic sur le port 80 :

```bash
sudo ufw allow 80
```
**Rôle** : Autorise les connexions entrantes sur le port 80.

```bash
sudo ufw enable
```
**Rôle** : Active le pare-feu.

## Accès à l'application

Une fois toutes les VM configurées, vous pouvez accéder à l'application depuis un navigateur web en utilisant l'adresse IP de la VM frontend :

```
http://<IP_DE_LA_VM_FRONTEND>
```

## Documentation de l'API

Vous pouvez accéder à la documentation de l'API Swagger en utilisant l'adresse IP de la VM backend :

```
http://<IP_DE_LA_VM_BACKEND>:3000/api-docs
```

## Résolution des problèmes

### Problèmes de connexion à la base de données
- Vérifiez que MariaDB est en cours d'exécution sur la VM 1.
- Vérifiez que le pare-feu sur la VM 1 autorise les connexions sur le port 3306.
- Vérifiez que les informations de connexion dans le fichier `.env` du backend sont correctes.

### Problèmes de connexion entre le frontend et le backend
- Vérifiez que le backend est en cours d'exécution sur la VM 2.
- Vérifiez que le pare-feu sur la VM 2 autorise les connexions sur le port 3000.
- Vérifiez que l'URL de l'API dans le fichier `src/api.ts` du frontend est correcte.

### Problèmes de construction ou de démarrage
- Vérifiez que Node.js et npm sont correctement installés.
- Vérifiez que toutes les dépendances sont installées avec `npm install --legacy-peer-deps`.
- Consultez les logs pour identifier les erreurs spécifiques.

## Conclusion

Félicitations ! Vous avez réussi à installer et configurer l'application MarmIOT sur trois machines virtuelles. Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à consulter la documentation ou à demander de l'aide.