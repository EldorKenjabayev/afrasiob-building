class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = 'ws://192.168.4.1/ws';
    this.reconnectTimeout = null;
    this.connect();
    // Eslatma: planshet/brauzer yopilganda LEDlar o'chirilmaydi.
    // ESP32 o'zi idle rejimda tasodifiy xonadonlarni yoqib turadi.
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WS: Ulandi');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onclose = () => {
        console.log('WS: Uzildi, qayta ulanmoqda...');
        this.reconnectTimeout = setTimeout(() => this.connect(), 2500);
      };

      this.ws.onerror = (err) => {
        console.error('WS: Xatolik', err);
      };
    } catch (e) {
      console.error('WS:', e);
    }
  }

  sendCommand(cmd) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(cmd);
      console.log('WS: Yuborildi ->', cmd);
    } else {
      console.log('WS: Tarmoq ulangan emas. Kutilayotgan komanda ->', cmd);
    }
  }
}

const wsService = new WebSocketService();
export default wsService;
