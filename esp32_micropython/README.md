# MarmIOT ESP32 MicroPython Code

This folder contains the MicroPython code for ESP32 devices that connect to the MarmIOT backend and send sensor data and button press events.

## Features

- **WiFi Configuration** : If the ESP32 cannot connect to a WiFi network, it starts a configuration access point.
- **Sensor Registration** : Automatically registers the sensor with the MarmIOT backend.
- **Button Press Detection** : Detects button presses and sends events to the backend.
- **Regular Connection Events** : Sends regular connection events to the backend every 30 seconds.
- **Configuration Interface** : Web interface for configuring WiFi and server settings.

## Hardware Requirements

- ESP32 board (e.g., ESP32-WROOM-32)
- MicroPython firmware installed on the ESP32
- Button connected to GPIO 0 (Boot button on most ESP32 boards)
- Onboard LED connected to GPIO 2 (on most ESP32 boards)

## Installation

### Step 1: Install MicroPython on ESP32

1. Download the latest MicroPython firmware for ESP32 from the [MicroPython website](https://micropython.org/download/esp32/).

2. Install the firmware on your ESP32 board using a tool like `esptool`:

```bash
esptool.py --port /dev/ttyUSB0 erase_flash
esptool.py --port /dev/ttyUSB0 --baud 460800 write_flash -z 0x1000 esp32-20230426-v1.20.0.bin
```

### Step 2: Upload the Code

1. Connect to your ESP32 board using a serial terminal (e.g., `screen`, `putty`, or `ampy`).

2. Upload the `main.py` file to your ESP32 board:

```bash
ampy --port /dev/ttyUSB0 put main.py
```

### Step 3: Configure the ESP32

1. If the ESP32 cannot connect to a WiFi network, it will start a configuration access point with the following credentials:
   - **SSID** : `MarmIOT-Config`
   - **Password** : `marmiot123`

2. Connect to the `MarmIOT-Config` WiFi network using your computer or smartphone.

3. Open a web browser and navigate to `http://192.168.4.1`.

4. Fill in the configuration form with your WiFi credentials and the IP address of your MarmIOT backend server.

5. Click the "Save Configuration" button. The ESP32 will restart and attempt to connect to your WiFi network.

## Configuration

The ESP32 stores its configuration in a `config.json` file. You can manually edit this file or use the web interface to configure the following settings:

- `ssid` : The SSID of your WiFi network.
- `password` : The password for your WiFi network.
- `server_ip` : The IP address of your MarmIOT backend server.
- `server_port` : The port of your MarmIOT backend server (default: 3000).

## Usage

Once configured, the ESP32 will:

1. Connect to your WiFi network.
2. Register itself with the MarmIOT backend.
3. Send regular connection events every 30 seconds.
4. Send button press events when the button is pressed.

## Troubleshooting

### ESP32 Cannot Connect to WiFi

- Ensure that the WiFi credentials are correct.
- Ensure that the ESP32 is within range of your WiFi network.
- Check that your WiFi network is functioning properly.

### ESP32 Cannot Connect to the Backend

- Ensure that the backend server is running.
- Ensure that the server IP address and port are correct.
- Check that the backend server is accessible from your WiFi network.

### Configuration Interface Not Working

- Ensure that the ESP32 is in configuration mode (LED should be blinking).
- Ensure that you are connected to the `MarmIOT-Config` WiFi network.
- Try refreshing the web page or restarting the ESP32.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.