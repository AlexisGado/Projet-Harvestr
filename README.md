# Projet-Harvestr

On ne build plus le projet (on n'utilise plus que ts-node), il y aura peut-être besoin de clone

1. Créer la liste des 1to1-matching : npx ts-node ./src/data/matching.js blacklist.json

-   blacklist.json est placé dans src/data et contient un objet de la forme
    {
    blacklistPersonNames: string[],
    blacklistOrganizationNames: string[],
    blacklistPersonEmails: string[]
    }

2. Lancer le script d'anonymisation : npx ts-node ./src/main.js data-to-anonymize.json matching.json
   où :

-   data-to-anonymize.json et placé dans src/data contient les messages à anonymiser sous la forme d'une liste de Messages (cf data-type.ts pour voir les champs)

-   matching.json a été crée à l'étape 2 dans src/data et contient un array avec des élements de type
    {
    blacklist: string,
    anonym: string
    }

Ce script donne pour résultat data-anonymized.json dans le dossier src, la liste de messages anonymisés de data-to-anonymized.json
