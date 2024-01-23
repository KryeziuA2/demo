import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import plotly.express as px


# Read data from CSV file
file_path = "./Sleep_health_and_lifestyle_dataset/data.csv"
data = pd.read_csv(file_path)

# Create FHIR-like resources
fhir_resources = []

for _, entry in data.iterrows():
    resource = {
        "resourceType": "PersonData",
        "PersonID": entry["Person ID"],
        "Gender": entry["Gender"],
        "Age": entry["Age"],
        "Occupation": entry["Occupation"],
        "SleepDuration": entry["Sleep Duration"],
        "QualityOfSleep": entry["Quality of Sleep"],
        "PhysicalActivityLevel": entry["Physical Activity Level"],
        "StressLevel": entry["Stress Level"],
        "BMICategory": entry["BMI Category"],
        "BloodPressure": entry["Blood Pressure"],
        "HeartRate": entry["Heart Rate"],
        "DailySteps": entry["Daily Steps"],
        "SleepDisorder": entry["Sleep Disorder"]
    }
    fhir_resources.append(resource)

# Create a FHIR Bundle
fhir_bundle = {
    "resourceType": "Bundle",
    "type": "collection",
    "entry": [{"resource": res} for res in fhir_resources]
}

# Convert to JSON
json_data = json.dumps(fhir_bundle, indent=2)

# Write JSON data to a file
with open("output.json", "w", encoding="utf-8") as json_file:
    json_file.write(json_data)

print("Conversion completed. JSON data written to output.json")
