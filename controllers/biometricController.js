// controllers/biometricController.js
const net = require('net');

const startBiometricRegistration = (req, res) => {
    const { finger } = req.body;
    const client = new net.Socket();

    client.connect(4370, '10.48.119.122', () => {
        console.log('Conectado ao dispositivo Intelbras SS 710');
        
        // Defina o comando binário conforme o dedo selecionado
        let command;
        switch(finger) {
            case 'left-thumb':
                command = Buffer.from([/* Comando binário para o polegar esquerdo */]);
                break;
            case 'left-index':
                command = Buffer.from([/* Comando binário para o indicador esquerdo */]);
                break;
            case 'left-middle':
                command = Buffer.from([/* Comando binário para o médio esquerdo */]);
                break;
            case 'left-ring':
                command = Buffer.from([/* Comando binário para o anelar esquerdo */]);
                break;
            case 'left-little':
                command = Buffer.from([/* Comando binário para o mindinho esquerdo */]);
                break;
            case 'right-thumb':
                command = Buffer.from([/* Comando binário para o polegar direito */]);
                break;
            case 'right-index':
                command = Buffer.from([/* Comando binário para o indicador direito */]);
                break;
            case 'right-middle':
                command = Buffer.from([/* Comando binário para o médio direito */]);
                break;
            case 'right-ring':
                command = Buffer.from([/* Comando binário para o anelar direito */]);
                break;
            case 'right-little':
                command = Buffer.from([/* Comando binário para o mindinho direito */]);
                break;
            default:
                return res.status(400).json({ success: false, message: 'Dedo inválido' });
        }
        
        client.write(command);
    });

    client.on('data', (data) => {
        console.log('Resposta do dispositivo: ' + data);
        res.status(200).json({ success: true, message: 'Registro de biometria iniciado com sucesso' });
        client.destroy(); // Encerrar a conexão após receber a resposta
    });

    client.on('close', () => {
        console.log('Conexão encerrada');
    });

    client.on('error', (err) => {
        console.error('Erro de comunicação: ' + err);
        res.status(500).json({ success: false, message: 'Erro de comunicação com a fechadura', error: err.message });
    });
};

module.exports = { startBiometricRegistration };
