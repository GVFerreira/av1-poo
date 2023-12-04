// backend/index.js
const express = require('express')
const cors = require('cors')
const app = express()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
})

const ffprobe = require('fluent-ffmpeg')

const bodyParser = require('body-parser')
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))

const { MensagemTexto, MensagemVideo, MensagemFoto, MensagemArquivo } = require('./mensagens')

class Canal {
  constructor(identificador) {
    this.identificador = identificador;
  }

  enviarMensagem(tipo, texto, arquivo) {
    const tipoArquivo = arquivo.mimetype
    const fileExtension = tipoArquivo.split('/').pop()
    switch(tipo) {
      case 'texto':
        console.log(`Detalhes da mensagem: \nCanal: ${this.identificador} \nTipo: ${tipo} \nTexto: ${texto} \nData e hora: ${new Date}`)
        break
      
      default:
        console.log(`Detalhes da mensagem: \nCanal: ${this.identificador} \nTipo ${tipo} \nFormato (extensão): ${fileExtension} \nArquivo ${arquivo.originalname} \nData e hora: ${new Date}`)

    }
  }
}

class CanalWhatsApp extends Canal {
  constructor(numeroTelefone) {
    super(`WhatsApp - Telefone: ${numeroTelefone}`);
    this.numeroTelefone = numeroTelefone;
  }

  enviarMensagem(tipo, texto, arquivo) {
    // Lógica específica para enviar mensagem via WhatsApp
    super.enviarMensagem(tipo, texto, arquivo);
  }
}

class CanalTelegram extends Canal {
  constructor(usuario) {
    super(`Telegram - Telefone: ${usuario}`);
    this.usuario = usuario;
  }

  enviarMensagem(tipo, texto, arquivo) {
    // Lógica específica para enviar mensagem via Telegram
    super.enviarMensagem(tipo, texto, arquivo);
  }
}

class CanalFacebook extends Canal {
  constructor(usuario) {
    super(`Facebook - Usuário: ${usuario}`);
    this.usuario = usuario;
  }

  enviarMensagem(tipo, texto, arquivo) {
    // Lógica específica para enviar mensagem via Facebook
    super.enviarMensagem(tipo, texto, arquivo);
  }
}

class CanalInstagram extends Canal {
  constructor(usuario) {
    super(`Instagram - Usuário: ${usuario}`);
    this.usuario = usuario;
  }

  enviarMensagem(tipo, texto, arquivo) {
    // Lógica específica para enviar mensagem via Instagram
    super.enviarMensagem(tipo, texto, arquivo);
  }
}

// Enviar mensagens
app.post('/enviar-mensagem', upload.single('arquivo'), async (req, res) => {
  const { canal, tipo, texto, destinatario } = req.body
  const arquivo = req.file

  let canalObj

  // Identificando o tipo de canal
  switch (canal) {
    case 'whatsapp':
      canalObj = new CanalWhatsApp(destinatario)
      break
    case 'telegram':
      canalObj = new CanalTelegram(destinatario)
      break
    case 'facebook':
      canalObj = new CanalFacebook(destinatario)
      break
    case 'instagram':
      canalObj = new CanalInstagram(destinatario)
      break
    default:
      return res.status(400).json({ error: 'Canal não suportado' })
  }

  let mensagemObj

  // Identificando o tipo de mensagem
  switch (tipo) {
    case 'texto':
      mensagemObj = new MensagemTexto(texto, new Date())
      break
    case 'video':
      const videoInfo = await obterInfoVideo(arquivo)
      mensagemObj = new MensagemVideo(texto, arquivo, videoInfo.formato, videoInfo.duracao)
      break
    case 'foto':
      const fotoInfo = obterInfoFoto(arquivo)
      mensagemObj = new MensagemFoto(texto, arquivo, fotoInfo.formato)
      break
    case 'arquivo':
      const arquivoInfo = obterInfoArquivo(arquivo)
      mensagemObj = new MensagemArquivo(texto, arquivo, arquivoInfo.formato)
      break
    default:
      return res.status(400).json({ error: 'Tipo de mensagem inválido' })
  }

  canalObj.enviarMensagem(tipo, texto, arquivo)
  res.json({ success: true })
})

app.post('/obter-info-video', (req, res) => {
  const { buffer } = req.body;
  console.log('Requisição recebida em /obter-info-video')

  ffprobe(buffer, (err, metadata) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao obter informações do vídeo' });
    }

    const formato = metadata.format.format_name;
    const duracao = metadata.format.duration;
    res.json({ formato, duracao });
  });
});

// Função para obter informações do vídeo
async function obterInfoVideo(video) {
  return new Promise((resolve, reject) => {
    ffprobe(video.buffer, (err, metadata) => {
      if (err) {
        reject(err)
      } else {
        const formato = metadata.format.format_name
        const duracao = metadata.format.duration
        resolve({ formato, duracao })
      }
    })
  })
}

// Função para obter informações da foto
function obterInfoFoto(foto) {
  const formato = foto.mimetype
  return { formato }
}

// Função para obter informações do arquivo genérico
function obterInfoArquivo(arquivo) {
  const formato = arquivo.mimetype
  return { formato }
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
