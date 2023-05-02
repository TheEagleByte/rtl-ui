## Getting Started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) (optional)
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [rtl_power](https://osmocom.org/projects/rtl-sdr/wiki/Rtl-sdr) (needs to be in your PATH)

### Setup

Open two terminals, one for the frontend and one for the backend.

In the backend terminal, run the following commands:

```bash
cd server
pip install -r requirements.txt
```

In the frontend terminal, run the following commands:

```bash
cd web
yarn install
```

### Configuring RTL Power command

Currently, the api is configured to run the following command:

```python
"rtl_power -f 24M:100M:1M -i 1s -g 50 -1 data/data" + str(dataIndex) + ".csv"
```

If you want to change it at all, you can do so in the `server/rtl_power_loop.py` file.

### Running the App

In the backend terminal, run the following commands:

```bash
py api.py
```

In the frontend terminal, run the following commands:

```bash
yarn dev
```

### Viewing the App

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.