# Projet-Harvestr

(((
Utilisation typescript : utiliser les scripts initialize_json puis start_default
Utilisation javascript : utiliser les scripts build puis initialize_json_js puis start_default_js
)))



1) Build : "rimraf ./dist && tsc" (script build)

2) Generer la liste de pseudos : node ./dist/data/genere-anon-data.js

3) Lancer le script : node ./dist/main.js data-to-anonymize.json anon-data.json blacklist.json
où :
- anon-data.json a deja été créé à l'étape 2)
- data-to-anonymize.json contient les messages à anonymiser sous la forme d'une liste de Messages (cf data-type.ts pour voir les champs)
- blacklist.json contient un objet de la forme
{
    blacklistPersonNames: string[],
    blacklistOrganizationNames: string[],
    blacklistPersonEmails: string[]
}
Ces 3 fichiers json sont doivent être dans dans dist/data/

4) Le resultat se trouve sous la meme forme que data-to-anonymize.json dans le dossier dist
