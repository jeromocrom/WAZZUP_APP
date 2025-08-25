WAZZUP — Fix 'main' entry + Gestures

1) Place these files at the project root:
   - index.js        (entrypoint JS with GH Root HOC)
   - App.js          (bridge to App.tsx)
   - package-main-fix.ps1

2) Run in PowerShell (from project root):
   powershell -ExecutionPolicy Bypass -File .\package-main-fix.ps1 -Path .\package.json -Main index.js

3) Ensure you have App.tsx at the project root (the real app).

4) Restart clean:
   Stop-Process -Name node -Force -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force .expo .cache 2>$null
   npx expo start -c

# 🎯 Objectif

---------------------  Guide rapide pour : ------------------------

* récupérer (cloner) ton dépôt
* organiser ton dossier de travail
* versionner proprement tes changements
* envoyer (push) sur GitHub en fin de session

---

## 0) Pré-requis (une seule fois)

* Installer **Git for Windows** : [https://git-scm.com/downloads](https://git-scm.com/downloads)
* Configurer ton identité :

```bash
git config --global user.name "TonNomGitHub"
git config --global user.email "ton-email@exemple.com"
```

* (Option recommandé) **SSH** :

```bash
ssh-keygen -t ed25519 -C "ton-email@exemple.com"
# Ajouter la clé publique id_ed25519.pub dans GitHub > Settings > SSH and GPG keys
ssh -T git@github.com
```

---

## 1) Récupérer le dépôt (cloner)

> À faire sur une nouvelle machine ou pour repartir propre.

**HTTPS** :

```bash
cd /e
git clone https://github.com/<utilisateur>/<repo>.git
cd <repo>
```

**SSH** (recommandé) :

```bash
cd /e
git clone git@github.com:<utilisateur>/<repo>.git
cd <repo>
```

> ✅ Après clone, tu peux ouvrir le projet dans VS Code.

---

## 2) Organisation du dossier

* Crée un dossier parent **`E:/dev`** (exemple) et mets chaque projet dans un sous-dossier :

```
E:/dev/
 ├─ wazzup-app-full/
 │   ├─ src/              # code source
 │   ├─ assets/           # images, polices, icônes
 │   ├─ .env.example      # modèle de configuration (pas le vrai .env)
 │   ├─ .gitignore
 │   ├─ README.md
 │   └─ package.json      # (si Node/React/React Native)
```

* **.gitignore** (exemple React/React Native) :

```
node_modules/
.expo/
.env
.DS_Store
*.log
coverage/
build/
dist/
```

* **README.md** : objectifs, commande de lancement, notes d’installation.

---

## 3) Workflow quotidien (solo)

1. **Mettre à jour ta copie** avant de commencer :

```bash
git pull origin main
```

2. **Coder** (modifie/ajoute des fichiers).
3. **Voir ce qui a changé** :

```bash
git status
```

4. **Stager** les fichiers à committer :

```bash
git add .              # tout
# ou sélectif
git add src/App.js package.json
```

5. **Commit** avec un message clair :

```bash
git commit -m "fix: corrige l’affichage du header sur Android"
```

6. **Pousser** vers GitHub :

```bash
git push -u origin main
```

> Répète `git add` → `git commit` → `git push` autant que nécessaire.

---

## 4) Branches (bonne pratique même en solo)

* Crée une branche par fonctionnalité ou correctif :

```bash
git checkout -b feature/auth-screen
# ... tu codes ...
git add .
git commit -m "feat: écran d’authentification (UI + validations)"
git push -u origin feature/auth-screen
```

* Ouvre une **Pull Request** sur GitHub pour fusionner dans `main`.
* Après merge :

```bash
git checkout main
git pull origin main
git branch -d feature/auth-screen
```

---

## 5) Conventions de messages de commit (exemples)

* `feat:` nouvelle fonctionnalité
* `fix:` correction de bug
* `docs:` documentation
* `refactor:` réorganisation du code (sans nouvelle feature)
* `chore:` maintenance, CI, dépendances

Exemples :

```
feat: import auto d’événements Facebook (ville + date)
fix: évite crash si .env manquant
refactor: extraction du composant Button
chore: mise à jour react-native 0.xx
```

---

## 6) Fin de session – checklist

```bash
git status                 # rien d’oublié ?
git add .                  # ou ciblé
git commit -m "..."        # message clair
git push                   # envoie sur GitHub
```

> Optionnel : créer une **release** GitHub pour les jalons importants.

---

## 7) Récupérer les dernières modifs (collab)

* Toujours **pull** avant de commencer :

```bash
git pull origin main
```

* Si conflit :

  1. Ouvre les fichiers marqués `<<<<<<<` / `=======` / `>>>>>>>`
  2. Choisis les bons blocs, supprime les marqueurs
  3. `git add <fichiers>` puis `git commit` (ou via ton IDE)

---

## 8) Annuler / Sauvegarde temporaire

* **Annuler un fichier modifié (non staged)** :

```bash
git checkout -- src/App.js
```

* **Retirer du staging** :

```bash
git restore --staged src/App.js
```

* **Sauvegarde temporaire (stash)** :

```bash
git stash            # met de côté tes modifs
# ... tu fais autre chose ...
git stash pop        # réapplique tes modifs
```

---

## 9) Dépannage rapide

* **403 permission denied** → pas d’accès en écriture :

  * Demande l’accès au repo **ou** pousse vers un dépôt que tu possèdes
  * Vérifie `git remote -v`
* **Mauvais compte mémorisé** (Windows Credential Manager) :

  * Panneau de config > Gestionnaire d’identifiants > Identifiants Windows > supprimer `github.com`
* **Changer l’URL du remote** :

```bash
git remote set-url origin git@github.com:<utilisateur>/<repo>.git
# ou HTTPS
git remote set-url origin https://github.com/<utilisateur>/<repo>.git
```

---

## 10) Raccourcis utiles

```bash
git log --oneline --graph --decorate   # historique lisible
git diff                               # diff local
git clean -fd                          # supprime fichiers non suivis (⚠️)
```

---

### ✅ Résumé ultra-court

1. `git pull origin main`
2. coder
3. `git add .`
4. `git commit -m "message"`
5. `git push`

Prêt à l’emploi ✨
