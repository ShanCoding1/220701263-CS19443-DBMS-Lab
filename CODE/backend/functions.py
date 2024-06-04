from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os

load_dotenv()


# function to convert ObjectId to string
def convert_id(data):
    if isinstance(data, list):
        for item in data:
            item['_id'] = str(item['_id'])
    else:
        data['_id'] = str(data['_id'])
    return data


# to build query dynamically
def build_query(name, objectId, email):
    query = {}
    if name:
        query['name'] = name
    if objectId:
        query['_id'] = ObjectId(objectId)
    if email:
        query['email'] = email
    return query


def connect_to_database():
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client['HospitalManagement']
    return db


def check_appointment_collision(doctor_id, appointment_time, db):
    time_before = appointment_time - timedelta(minutes=10)
    time_after = appointment_time + timedelta(minutes=10)
    existing_appointment = db.appointment.find_one({
        "doctor_id": doctor_id,
        "appointment_time": {"$gte": time_before, "$lte": time_after}
    })
    return existing_appointment is not None


def convert_objectid(data):
    if isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

