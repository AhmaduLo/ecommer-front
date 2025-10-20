# Shop E-Commerce

Une application de boutique en ligne moderne développée avec Angular.

## À propos

Cette application permet de :
- Parcourir un catalogue de produits
- Ajouter des articles au panier
- Effectuer des paiements sécurisés avec Stripe
- Gérer les produits depuis un espace administrateur

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- Node.js (version 14 ou supérieure)
- npm (généralement installé avec Node.js)

## Installation

1. Clonez le projet sur votre ordinateur
2. Ouvrez un terminal dans le dossier du projet
3. Installez les dépendances :
```bash
npm install
```

## Démarrage

Pour lancer l'application en mode développement :

```bash
npm start
```

Ensuite, ouvrez votre navigateur à l'adresse : `http://localhost:4200/`

L'application se rechargera automatiquement si vous modifiez les fichiers.

## Fonctionnalités

### Pour les utilisateurs
- **Accueil** : Découvrez les produits disponibles
- **Panier** : Ajoutez et gérez vos articles
- **Paiement** : Finalisez vos achats en toute sécurité via Stripe

### Pour les administrateurs
- **Tableau de bord** : Vue d'ensemble de la boutique
- **Gestion des produits** : Ajoutez, modifiez ou supprimez des produits
- **Connexion sécurisée** : Accès protégé à l'espace admin

## Technologies utilisées

- **Angular 16** : Framework principal
- **Stripe** : Solution de paiement sécurisé
- **TypeScript** : Langage de programmation
- **SCSS** : Stylisation de l'interface

## Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── admin/        # Espace administrateur
│   │   ├── users/        # Espace client
│   │   ├── header/       # En-tête du site
│   │   ├── footer/       # Pied de page
│   │   └── shared/       # Composants réutilisables
│   └── ...
```

## Commandes utiles

- `npm start` : Lancer le serveur de développement
- `npm run build` : Créer une version de production
- `npm test` : Lancer les tests

## Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le repository.

---

Développé avec Angular
