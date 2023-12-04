// Client
import React from 'react'
import axios from 'axios'

function App() {
  const [mensagem, setMensagem] = React.useState('')
  const [canal, setCanal] = React.useState('whatsapp')
  const [tipoMensagem, setTipoMensagem] = React.useState('texto')
  const [destinatario, setDestinatario] = React.useState('')
  const [arquivo, setArquivo] = React.useState(null)
  const [formato, setFormato] = React.useState('')
  const [duracao, setDuracao] = React.useState('')
  const arquivoRef = React.useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setArquivo(file)

     // Verificar se o arquivo mudou antes de chamar a função obterInfoVideo
    if (file !== arquivoRef.current) {
      arquivoRef.current = file

      // Obter informações sobre o vídeo se o tipo de mensagem for vídeo
      if (tipoMensagem === 'video') {
        obterInfoVideo(file)
      }
    }
  }

  const formatarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, '')

    // Aplicar formatação (XX) XXXXX-XXXX
    const match = numeroLimpo.match(/^(\d{2})(\d{5})(\d{4})$/)

    if (match) {
      const numeroFormatado = `(${match[1]}) ${match[2]}-${match[3]}`
      return numeroFormatado

    } else {
      return numeroLimpo 

    }
  }

  const handleNumeroTelefoneChange = (e) => {
    const inputNumeroTelefone = e.target.value
    setDestinatario(formatarTelefone(inputNumeroTelefone))
  }

  const obterInfoVideo = async (videoFile) => {
    try {
      const videoInfo = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function (e) {
          const buffer = new Uint8Array(e.target.result)
  
          // Criar um objeto FormData e adicionar o buffer
          const formData = new FormData()
          formData.append('buffer', new Blob([buffer]))
  
          // Adicionar cabeçalho personalizado
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }

          // Fazer a solicitação POST
          axios.post('http://localhost:3001/obter-info-video', {config, formData})
            .then(response => resolve(response.data))
            .catch(reject)
        }
        reader.readAsArrayBuffer(videoFile)
      })
  
      setDuracao(videoInfo.duracao)
      setFormato(videoInfo.formato)

    } catch (error) {
      console.error('Erro ao obter informações do vídeo:', error.message)
    }
  }

  const enviarMensagem = async (e) => {
    e.preventDefault()
    try {

      const formData = new FormData()
      formData.append('canal', canal)
      formData.append('tipo', tipoMensagem)
      formData.append('texto', mensagem)
      formData.append('destinatario', destinatario)
      formData.append('arquivo', arquivo)
      formData.append('formato', formato)
      formData.append('duracao', duracao)

      await axios.post("http://localhost:3001/enviar-mensagem", formData, { 
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Mensagem enviada com sucesso!')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error.message)
    }
  }

  return (
    <form
      method="POST"
      className="container mx-auto mt-8 p-8 bg-gray-200 max-w-md rounded"
      encType="multipart/form-data"
    >
      <h1 className="text-2xl font-bold mb-4">Enviar Mensagem</h1>

      <label className="block mb-1" htmlFor="canal">Canal:</label>
      <select
        id="canal"
        name="canal"
        className="form-select mb-2 block w-full"
        value={canal}
        onChange={(e) => setCanal(e.target.value)}
        required
      >
        <option value="whatsapp">WhatsApp</option>
        <option value="telegram">Telegram</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
      </select>

      
      {['whatsapp', 'telegram'].includes(canal) && (
        <>
          <label className="block mb-1" htmlFor="destinatario">
            Número de Telefone:
          </label>
          <input
            id="destinatario"
            name="destinatario"
            type="text"
            className="form-input mb-2 block w-full"
            value={destinatario}
            onChange={handleNumeroTelefoneChange}
            maxLength={14}
            required
          />
        </>
      )}

      {['facebook', 'instagram'].includes(canal) && (
        <>
          <label className="block mb-1" htmlFor="destinatario">
            Usuário:
          </label>
          <input
            id="destinatario"
            name="destinatario"
            type="text"
            className="form-input mb-2 block w-full"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            required
          />
        </>
      )}

      <label className="block mb-1">Tipo de Mensagem:</label>
      <select
        id="tipoMensagem"
        name="tipoMensagem"
        className="form-select mb-2 block w-full"
        value={tipoMensagem}
        onChange={(e) => setTipoMensagem(e.target.value)}
        required
      >
        <option value="texto">Texto</option>
        <option value="video">Vídeo</option>
        <option value="foto">Foto</option>
        <option value="arquivo">Arquivo</option>
      </select>

      {['texto'].includes(tipoMensagem) && (
        <>
          <label className="block mb-1">Mensagem:</label>
          <textarea
            id="mensagem"
            name="mensagem"
            className="form-input mb-2 block w-full"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            required
          />
        </>
      )}

      
      {['video', 'foto', 'arquivo'].includes(tipoMensagem) && (
        <>
           <label className="block mb-4">
            Arquivo:
            <input
              type="file"
              accept={tipoMensagem === 'foto' ? 'image/*' : tipoMensagem === 'video' ? 'video/*' : '*/*'}
              onChange={handleFileChange}
              className="form-input mt-1 block w-full"
            />
          </label>
        </>
      )}

      <button
        className="bg-blue-700 text-white px-4 py-2 mt-4 rounded hover:bg-blue-500"
        onClick={enviarMensagem}
      >
        Enviar Mensagem
      </button>
    </form>
  )
}

export default App
