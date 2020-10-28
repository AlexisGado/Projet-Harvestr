# Projet-Harvestr

Fait : 

-chargement d'un csv avec donnée séparée par , (et pas ;), 
-anonymisation d'un script par stringify (méthode couteuse) 
mais on ne rate pas d'élément de la blacklist
-nom et mail non accordées
-blacklist donnée par champ
-pas de Map mais des array d'objets
-créer un fichier generate-anonym-attrib qui crée un csv avec 3 listes de noms,
 mails, entreprises aléatoires 

A faire : 

-ne plus utiliser stringlify couteux mais parcourir les attributs
(message.requester/submitter.name/email (4champs), 
message.message.requester/submitter.organization.name, 
message.content/clientID/Title ? pour remplacer les mots blacklists
-voir si on accordre nom et mail quand on remplace les attributs 