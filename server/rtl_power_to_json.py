import json

# The input file is generated using the Signal Identification Guide (sigidwiki.com)
def rtl_power_to_json(rtl_power_output):
    dataOut = []
    frequencyOut = []
    logged = False
    with open(rtl_power_output, 'r') as f:
        for rawLine in f:
            line = rawLine.replace('\n', '')
            data = line.split(', ')
            dataOut.append(data)
            if len(data) > 7:
                description, freqStart, freqStop, url = data[0], int(data[1]), int(data[2]), data[7]
                current = {"freqStart": freqStart, "freqStop": freqStop, "description": description, "url": url}

                if (freqStart != 0 or freqStop != 0):
                    frequencyOut.append(current)
                else:
                    print("Skipping: " + str(current))

    # Sort in decreasing bandwidth order. This ensures that signals with smaller bandwidth
    # will be drawn on top of signals with larger bandwidth.
    frequencyOut.sort(key=lambda x: x["freqStop"] - x["freqStart"], reverse=True)

    # TODO: Remove once we automatically refresh the data
    if len(frequencyOut) == 0:
        with open("mock/frequencies.json", 'r') as f:
            frequencyOut = json.load(f)

    return {
        "data": dataOut,
        "frequencies": frequencyOut
    }