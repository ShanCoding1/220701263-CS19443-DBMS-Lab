from flask import Blueprint, request, jsonify
from datetime import datetime
from bson.objectid import ObjectId
from functions import connect_to_database, check_appointment_collision, convert_objectid, convert_id

appointment_bp = Blueprint('appointment', __name__)
db = connect_to_database()


# Function to update appointment data with patient_id and doctor_id
def update_appointment_with_ids(appointment_data):
    patient_name = appointment_data.get('patient_name')
    doctor_name = appointment_data.get('doctor_name')

    # Perform the aggregation pipeline to get patient_id and doctor_id
    pipeline = [
        {"$match": {"name": {"$in": [patient_name, doctor_name]}}},
        {"$group": {"_id": "$name", "id": {"$first": "$_id"}}}
    ]
    patient = list(db.patient.aggregate(pipeline))
    doctor = list(db.doctor.aggregate(pipeline))
    patient_id = next((p['id'] for p in patient if p['_id'] == patient_name), None)
    doctor_id = next((d['id'] for d in doctor if d['_id'] == doctor_name), None)

    appointment_data['patient_id'] = patient_id
    appointment_data['doctor_id'] = doctor_id


# Routes for Appointments
@appointment_bp.route('/add', methods=['POST'])
def add_appointment():
    try:
        appointment_data = request.json
        doctor_id = appointment_data.get('doctor_id')
        appointment_time_str = appointment_data.get('appointment_time')

        appointment_time = datetime.strptime(appointment_time_str, "%Y-%m-%d %H:%M:%S")
        appointment_data['appointment_time'] = appointment_time
        if check_appointment_collision(doctor_id=doctor_id, appointment_time=appointment_time, db=db):
            return jsonify(
                {'status': 'error', 'message': 'Appointment collides with existing appointment for the doctor'}), 400

        update_appointment_with_ids(appointment_data)
        result = db.appointment.insert_one(appointment_data)
        appointment_data['_id'] = str(result.inserted_id)

        appointment_data['doctorName'] = appointment_data.pop('doctor_name', None)
        appointment_data = convert_objectid(appointment_data)

        return jsonify({'status': 'success', 'message': 'Appointment added', 'appointment': appointment_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500



@appointment_bp.route('/update', methods=['PUT'])
def update_appointment():
    try:
        appointment_data = request.json
        appointment_id = appointment_data.get('appointment_id')
        appointment_time_str = appointment_data.get('appointment_time')
        appointment_time = datetime.strptime(appointment_time_str, "%Y-%m-%d %H:%M:%S")
        appointment_data['appointment_time'] = appointment_time

        doctor_id = appointment_data.get('doctor_id')
        if check_appointment_collision(doctor_id=doctor_id, appointment_time=appointment_time, db=db):
            return jsonify(
                {'status': 'error', 'message': 'Appointment collides with existing appointment for the doctor'}), 400
        update_appointment_with_ids(appointment_data)
        db.appointment.update_one({"_id": ObjectId(appointment_id)}, {"$set": {"appointment_time": appointment_time}})
        appointment_data['_id'] = appointment_id
        appointment_data = convert_objectid(appointment_data)

        return jsonify({'status': 'success', 'message': 'Appointment time updated', 'appointment': appointment_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@appointment_bp.route('/', methods=['GET'])
def get_all_appointments():
    try:
        appointments = list(db.appointment.find())
        appointments = [convert_objectid(app) for app in appointments]

        return jsonify({'status': 'success', 'appointments': appointments})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
