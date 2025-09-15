import paho.mqtt.client as mqtt

class PahoMqttWrapper(object):
    def __init__(self, host="0.0.0.0", port=1883):
        self.client         = mqtt.Client()
        self.host           = host
        self.port           = port
        self.client.on_connect      = self.on_connect
        self.client.on_disconnect   = self.on_disconnect

    def connect(self):
        self.client.connect(self.host, self.port)
        self.client.loop_start()

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

    def on_connect(self, client, userdata, flags, rc):
        print("Connected to host {host}:{port}".format(
            host = self.host,
            port = self.port
        ))

    def on_disconnect(self, client, userdata, rc):
        if rc != 0: print("Unexpected disconnection.")

    def publish(self, topic, message):
        self.client.publish(topic, message)

if __name__ == "__main__":
    broker_address = "172.16.2.49"
    pmw = PahoMqttWrapper(host=broker_address)

    pmw.connect()

    topic = "test/topic"
    message = "ciaone"
    result = pmw.publish(topic, message)
    
    print(result)

    pmw.disconnect()


