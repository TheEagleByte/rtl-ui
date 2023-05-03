import shutil
import os

# Function that runs rtl_power in a loop
def run_rtl_power():
    # Clear out the data folder if it exists
    if os.path.exists("data"):
        shutil.rmtree("data")
    os.mkdir("data")

    dataIndex = 0
    while True:
        # Run rtl_power
        # rtl_power -f 24M:100M:1M -i 1s -g 50 -1 mock/data-self.csv
        command = "rtl_power -f 24M:100M:1M -i 1s -g 50 -1 data/data" + str(dataIndex) + ".csv"
        print("Running: " + command)
        os.system(command)

        # Increment the data index
        dataIndex += 1