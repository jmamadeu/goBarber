import Mail from '../libs/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('fila rodando');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado!',
      text: 'Você tem um novo cancelamento!',
    });
  }
}

export default new CancellationMail();
