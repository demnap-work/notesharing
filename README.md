# NoteSharing 1.0 – Backend & Frontend Setup

## Requisiti
- **Python 3.9+**
- **pip** (gestore pacchetti Python)
- **Git**

---

## 🚀 Avvio Backend

### 1. Clonare il repository
Clonare il progetto backend da GitHub (URL sarà fornito in seguito):
```bash
git clone <URL_REPO_BACKEND>
cd <NOME_FOLDER_BACKEND>
```

### 2. Installare le dipendenze
Eseguire il comando:
```bash
pip install -r requirements.txt
```

> ℹ️ La libreria **pymongo** è inclusa ma non utilizzata.

---

### 3. Configurazione database
Spostarsi nella cartella **`configFiles/`** e aprire il file:
```
connectionsDB.properties
```

Impostare i dati di accesso al proprio database sotto la configurazione:
```
[notesharingDBMS]
```

Verificare inoltre che nella sezione **[initConfiguration]** siano impostati i seguenti valori:

```ini
version=1.0.0
dateLast=10-09-2025
appName=NoteSharing 1.0   
host=0.0.0.0
port=5050
sslContext=false
debuging=true
methodEnabled=GET,POST,PUT,PATCH,DELETE
liveTimeSessionToken=60
resourcingServices=/configFiles/resourcingServices.xml
logFile=/log/logErr.log
baseUrl=http://localhost:4200/
menuCode=DTD
dbDefault=notesharingDBMS
```

---

### 4. Avvio del backend
Spostarsi nella cartella dove è presente il file `__init__.py` ed eseguire:

```bash
python __init__.py
```
oppure  
```bash
python3 __init__.py
```

Il server partirà su:
```
http://0.0.0.0:5050
```

---

## 🌐 Avvio Frontend

### 1. Clonare il repository
Clonare il progetto frontend da GitHub (URL sarà fornito in seguito).

### 2. Avviare con Simple Web Server
- Scaricare e avviare il tool **Simple Web Server**.  
- Cliccare su **Crea nuovo server**.  
- In **Seleziona folder**, indicare la cartella in cui è presente il progetto frontend.  
- Avviare il server.  

Una volta avviato, il tool suggerirà alcuni URL di avvio.  
👉 È importante aprire il progetto utilizzando **l’indirizzo IP completo della propria macchina** (ad esempio `http://192.168.1.10:4200`) e **non `localhost`**, per evitare problemi di CORS.

---

## ✅ Avvio completo
1. Avviare prima il **backend** (`python __init__.py`).  
2. Avviare il **frontend** con Simple Web Server.  
3. Aprire il browser e navigare all’indirizzo IP della propria macchina suggerito dal tool (es. `http://192.168.1.10:4200`).  
