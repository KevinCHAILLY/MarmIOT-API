# MarmIOT ESP32 MicroPython Code
# This code runs on ESP32 devices to connect to the MarmIOT backend
# and send sensor data and button press events.

import network
import urequests
import json
import machine
import time
import socket
import gc

# Configuration
CONFIG_FILE = "config.json"
DEFAULT_SSID = "MarmIOT-Config"
DEFAULT_PASSWORD = "marmiot123"
DEFAULT_SERVER_IP = "192.168.1.100"
DEFAULT_SERVER_PORT = 3000

# Sensor configuration
SENSOR_ID = "esp32-" + str(machine.unique_id())[:8]
SENSOR_NAME = "ESP32 Sensor"
SENSOR_LOCATION = "Unknown"

# Button configuration
BUTTON_PIN = 0  # GPIO 0 (Boot button on most ESP32 boards)
button = machine.Pin(BUTTON_PIN, machine.Pin.IN, machine.Pin.PULL_UP)

# LED configuration
LED_PIN = 2  # GPIO 2 (Onboard LED on most ESP32 boards)
led = machine.Pin(LED_PIN, machine.Pin.OUT)

# WiFi connection status
wifi_connected = False

# HTTP server for configuration
config_server = None

def load_config():
    """Load configuration from file"""
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except:
        return {
            "ssid": None,
            "password": None,
            "server_ip": DEFAULT_SERVER_IP,
            "server_port": DEFAULT_SERVER_PORT
        }

def save_config(config):
    """Save configuration to file"""
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f)

def connect_wifi(ssid, password):
    """Connect to WiFi network"""
    global wifi_connected
    
    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    
    if not sta_if.isconnected():
        print(f"Connecting to {ssid}...")
        sta_if.connect(ssid, password)
        
        # Wait for connection
        for _ in range(10):
            if sta_if.isconnected():
                wifi_connected = True
                print("Connected to WiFi")
                print("Network config:", sta_if.ifconfig())
                return True
            time.sleep(1)
    
    if sta_if.isconnected():
        wifi_connected = True
        print("Already connected to WiFi")
        print("Network config:", sta_if.ifconfig())
        return True
    
    print("Failed to connect to WiFi")
    wifi_connected = False
    return False

def start_config_ap():
    """Start configuration access point"""
    ap_if = network.WLAN(network.AP_IF)
    ap_if.active(True)
    ap_if.config(essid=DEFAULT_SSID, password=DEFAULT_PASSWORD)
    
    print("Configuration AP started")
    print("SSID:", DEFAULT_SSID)
    print("Password:", DEFAULT_PASSWORD)
    print("AP config:", ap_if.ifconfig())
    
    return ap_if.ifconfig()[0]  # Return AP IP address

def stop_config_ap():
    """Stop configuration access point"""
    ap_if = network.WLAN(network.AP_IF)
    ap_if.active(False)
    print("Configuration AP stopped")

def handle_config_request(client):
    """Handle HTTP request for configuration"""
    request = client.recv(1024).decode()
    
    # Parse request
    lines = request.split("\r\n")
    method = lines[0].split()[0]
    path = lines[0].split()[1]
    
    # Handle GET request for config page
    if method == "GET" and path == "/":
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>MarmIOT Configuration</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                form { display: flex; flex-direction: column; gap: 10px; }
                label { font-weight: bold; }
                input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                button { padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background-color: #45a049; }
                .status { margin-top: 20px; padding: 10px; border-radius: 4px; }
                .success { background-color: #dff0d8; color: #3c763d; }
                .error { background-color: #f2dede; color: #a94442; }
            </style>
        </head>
        <body>
            <h1>MarmIOT Configuration</h1>
            <form id="configForm">
                <label for="ssid">WiFi SSID:</label>
                <input type="text" id="ssid" name="ssid" required>
                
                <label for="password">WiFi Password:</label>
                <input type="password" id="password" name="password" required>
                
                <label for="server_ip">Server IP:</label>
                <input type="text" id="server_ip" name="server_ip" value="192.168.1.100" required>
                
                <label for="server_port">Server Port:</label>
                <input type="number" id="server_port" name="server_port" value="3000" required>
                
                <button type="submit">Save Configuration</button>
            </form>
            <div id="status" class="status"></div>
            
            <script>
                document.getElementById('configForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const ssid = document.getElementById('ssid').value;
                    const password = document.getElementById('password').value;
                    const server_ip = document.getElementById('server_ip').value;
                    const server_port = document.getElementById('server_port').value;
                    
                    fetch('/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ssid: ssid,
                            password: password,
                            server_ip: server_ip,
                            server_port: server_port
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        const statusDiv = document.getElementById('status');
                        if (data.success) {
                            statusDiv.innerHTML = 'Configuration saved successfully! The device will restart.';
                            statusDiv.className = 'status success';
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        } else {
                            statusDiv.innerHTML = 'Error saving configuration: ' + data.error;
                            statusDiv.className = 'status error';
                        }
                    })
                    .catch(error => {
                        const statusDiv = document.getElementById('status');
                        statusDiv.innerHTML = 'Error: ' + error;
                        statusDiv.className = 'status error';
                    });
                });
            </script>
        </body>
        </html>
        """
        client.send("HTTP/1.1 200 OK\r\n")
        client.send("Content-Type: text/html\r\n")
        client.send("Connection: close\r\n\r\n")
        client.send(html)
        
    # Handle POST request to save config
    elif method == "POST" and path == "/save":
        # Parse body
        body = request.split("\r\n\r\n")[1]
        try:
            config = json.loads(body)
            save_config(config)
            
            response = {"success": True}
            client.send("HTTP/1.1 200 OK\r\n")
            client.send("Content-Type: application/json\r\n")
            client.send("Connection: close\r\n\r\n")
            client.send(json.dumps(response))
            
            # Restart device
            time.sleep(2)
            machine.reset()
            
        except Exception as e:
            response = {"success": False, "error": str(e)}
            client.send("HTTP/1.1 400 Bad Request\r\n")
            client.send("Content-Type: application/json\r\n")
            client.send("Connection: close\r\n\r\n")
            client.send(json.dumps(response))
    
    client.close()

def start_config_server():
    """Start HTTP server for configuration"""
    global config_server
    
    ap_ip = start_config_ap()
    
    # Start HTTP server
    addr = socket.getaddrinfo(ap_ip, 80)[0][-1]
    config_server = socket.socket()
    config_server.bind(addr)
    config_server.listen(1)
    
    print(f"Configuration server started at http://{ap_ip}")
    
    while True:
        try:
            cl, addr = config_server.accept()
            print("Client connected from", addr)
            handle_config_request(cl)
        except OSError as e:
            print("Configuration server error:", e)
            break

def stop_config_server():
    """Stop configuration server"""
    global config_server
    
    if config_server:
        config_server.close()
        config_server = None
        print("Configuration server stopped")

def register_sensor():
    """Register sensor with the server"""
    config = load_config()
    
    if not wifi_connected:
        print("Not connected to WiFi, cannot register sensor")
        return False
    
    url = f"http://{config['server_ip']}:{config['server_port']}/api/sensors"
    
    sensor_data = {
        "sensorId": SENSOR_ID,
        "name": SENSOR_NAME,
        "location": SENSOR_LOCATION
    }
    
    try:
        response = urequests.post(url, json=sensor_data, headers={"Content-Type": "application/json"})
        
        if response.status_code == 201:
            print("Sensor registered successfully")
            return True
        else:
            print("Failed to register sensor:", response.text)
            return False
            
    except Exception as e:
        print("Error registering sensor:", e)
        return False

def send_event(event_type, data):
    """Send event to the server"""
    config = load_config()
    
    if not wifi_connected:
        print("Not connected to WiFi, cannot send event")
        return False
    
    url = f"http://{config['server_ip']}:{config['server_port']}/api/events"
    
    event_data = {
        "type": event_type,
        "data": data,
        "sensor": {
            "sensorId": SENSOR_ID
        }
    }
    
    try:
        response = urequests.post(url, json=event_data, headers={"Content-Type": "application/json"})
        
        if response.status_code == 201:
            print("Event sent successfully")
            return True
        else:
            print("Failed to send event:", response.text)
            return False
            
    except Exception as e:
        print("Error sending event:", e)
        return False

def check_button_press():
    """Check if button is pressed"""
    if button.value() == 0:  # Button is pressed (active low)
        time.sleep_ms(50)  # Debounce
        if button.value() == 0:
            return True
    return False

def main():
    """Main function"""
    global wifi_connected
    
    # Load configuration
    config = load_config()
    
    # Try to connect to WiFi if credentials are available
    if config["ssid"] and config["password"]:
        if connect_wifi(config["ssid"], config["password"]):
            # Register sensor
            if register_sensor():
                # Main loop
                last_connection_time = time.time()
                
                while True:
                    # Check button press
                    if check_button_press():
                        send_event("button_press", "Button pressed")
                        # Blink LED
                        led.on()
                        time.sleep(0.5)
                        led.off()
                        
                    # Send connection event every 30 seconds
                    if time.time() - last_connection_time > 30:
                        send_event("connection", "Regular connection")
                        last_connection_time = time.time()
                        
                    time.sleep(0.1)
            else:
                # Could not register sensor, start config mode
                start_config_server()
        else:
            # Could not connect to WiFi, start config mode
            start_config_server()
    else:
        # No WiFi credentials, start config mode
        start_config_server()

if __name__ == "__main__":
    gc.collect()  # Run garbage collector
    main()