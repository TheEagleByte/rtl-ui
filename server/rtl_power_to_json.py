import json, datetime

# Converts the date and time into a datetime object
# Example date: "2016-10-08"
# Example time: "10:01:03"
def parse_date_time(date, time):
    date = date.split('-')
    time = time.split(':')
    return datetime.datetime(
        int(date[0]),   # Year 
        int(date[1]),   # Month
        int(date[2]),   # Day
        int(time[0]),   # Hour
        int(time[1]),   # Minute
        int(time[2]))   # Second

# The input file is generated using the Signal Identification Guide (sigidwiki.com)
def rtl_power_to_json(rtl_power_output):
    parsedData = []
    frequencyOut = []

    lowestFreq = 0
    highestFreq = 0
    startTime = None
    endTime = None
    lowestDb = 0
    highestDb = 0
    lowestDb = 0
    highestDb = 0
    
    with open(rtl_power_output, 'r') as f:
        for rawLine in f:
            line = rawLine.replace('\n', '')
            freqData = line.split('*')
            data = line.split(', ')
            
            row_date = data[0]
            row_time = data[1]
            row_timestamp = parse_date_time(row_date, row_time)
            row_hz_low = int(data[2])
            row_hz_high = int(data[3])
            row_hz_step = int(data[4])
            row_samples = int(data[5])

            if lowestFreq == 0 or row_hz_low < lowestFreq:
                lowestFreq = row_hz_low
            if highestFreq == 0 or row_hz_high > highestFreq:
                highestFreq = row_hz_high
            if startTime == None or row_timestamp < startTime:
                startTime = row_timestamp
            if endTime == None or row_timestamp > endTime:
                endTime = row_timestamp

            results = []
            for i in range(6, len(data)):
                db = float(data[i])

                if lowestDb == 0 or db < lowestDb:
                    lowestDb = db
                if highestDb == 0 or db > highestDb:
                    highestDb = db

                results.append({
                    "timestamp": row_timestamp,
                    "hz": row_hz_low + (i - 6) * row_hz_step,
                    "db": db
                })
            
            parsedData.append(results)

            if len(freqData) > 7:
                description, freqStart, freqStop, url = freqData[0], int(freqData[1]), int(freqData[2]), freqData[7]
                current = {
                    "freqStart": freqStart, 
                    "freqStop": freqStop, 
                    "description": description, 
                    "url": url
                }

                if (freqStart != 0 or freqStop != 0):
                    frequencyOut.append(current)
                else:
                    print("Skipping: " + str(current))

    # TODO: Remove once we automatically refresh the data
    if len(frequencyOut) == 0:
        with open("mock/frequencies.json", 'r') as f:
            frequencyOut = json.load(f)
    
    # Convert the raw values from an 1 * (N x M) to N * M array,
    # where N is the number of sweeps across the frequency range,
    # and M is the number of readings in each sweep.
    dataOut = []
    i = -1
    for d in parsedData:
        for j in range(0, len(d)):
            if d[j]["hz"] != parsedData[0][0]["hz"]:
                dataOut[i]["bins"].append({
                    "hz": d[j]["hz"],
                    "db": d[j]["db"]
                })
            else:
                dataOut.append({
                    "timestamp": d[j]["timestamp"],
                    "bins": []
                })
                i += 1

    return {
        "stats": {
            "freqRange": [lowestFreq, highestFreq],
            "timeRange": [startTime, endTime],
            "dbRange": [lowestDb, highestDb]
        },
        "data": dataOut,
        "frequencies": frequencyOut
    }