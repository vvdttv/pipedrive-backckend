const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔑 COLOQUE SUA API KEY AQUI
const API_KEY = 'a93117dbad6f841d401a6af210a70ad090548d6b';
const BASE_URL = 'https://iev.pipedrive.com/api/v1';

// Rota principal: proxy para Pipedrive
app.post('/api/pipedrive', async (req, res) => {
    const { endpoint, method = 'GET', body } = req.body;

    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint é obrigatório' });
    }

    try {
        const url = `${BASE_URL}${endpoint}?api_token=${API_KEY}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro Pipedrive (${response.status}):`, errorText);
            return res.status(response.status).json({
                error: `Erro Pipedrive: ${response.status}`,
                details: errorText
            });
        }

        const text = await response.text();
        if (!text) {
            return res.json({ success: true, data: null });
        }

        const data = JSON.parse(text);
        res.json(data);
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({
            error: 'Erro ao processar requisição',
            message: error.message
        });
    }
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend Pipedrive rodando!',
        endpoints: [
            'POST /api/pipedrive - Proxy para API Pipedrive',
            'GET /health - Status do servidor'
        ]
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});
```

Clique em **"Commit changes"**

---

### **Arquivo 3: `.gitignore`**

**Clique em "Add file" → "Create new file"**

Nome: `.gitignore`

Conteúdo (copie e cole):
```
node_modules/
.env
.DS_Store
*.log
dist/
.vscode/
.idea/
