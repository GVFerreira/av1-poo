// backend/mensagens.js
class MensagemTexto {
    constructor(texto, dataEnvio) {
      this.texto = texto
      this.dataEnvio = dataEnvio
    }
  
    enviar() {
      console.log(`Enviando mensagem de texto: ${this.texto}, Data: ${this.dataEnvio}`)
      
    }
}
  
class MensagemVideo {
    constructor(texto, arquivo, formato, duracao) {
      this.texto = texto
      this.arquivo = arquivo
      this.formato = formato
      this.duracao = duracao
    }
  
    enviar() {
      console.log(`Enviando mensagem de vídeo: ${this.texto}, Arquivo: ${this.arquivo}`)
      
    }
}
  
class MensagemFoto {
    constructor(texto, arquivo, formato) {
      this.texto = texto
      this.arquivo = arquivo
      this.formato = formato
    }
  
    enviar() {
      console.log(`Enviando mensagem de foto: ${this.texto}, Arquivo: ${this.arquivo}`)
      
    }
}
  
class MensagemArquivo {
    constructor(texto, arquivo, formato) {
      this.texto = texto
      this.arquivo = arquivo
      this.formato = formato
    }
  
    enviar() {
      console.log(`Enviando mensagem de arquivo: ${this.texto}, Arquivo: ${this.arquivo}`)
      
    }
}
  
module.exports = {
    MensagemTexto,
    MensagemVideo,
    MensagemFoto,
    MensagemArquivo,
}
  