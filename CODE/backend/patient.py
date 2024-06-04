from flask import Blueprint, request, jsonify
from functions import convert_id, build_query, connect_to_database, convert_objectid

patient_bp = Blueprint('patient', __name__)
db = connect_to_database()


# Routes for Patients
@patient_bp.route('/', methods=['GET'])
def get_patients():
    try:
        patients = list(db.patient.find())
        patients_with_appointments = []

        for patient in patients:
            patient_id = str(patient['_id'])  # Convert ObjectId to string
            appointments = list(db.appointment.find({'patient_id': patient_id}))

            if appointments:
                patient['appointments'] = [convert_objectid(app) for app in appointments]
            else:
                patient['appointments'] = 'N/A'

            # Convert patient_id to string
            patient = convert_id(patient)
            patients_with_appointments.append(patient)

        return jsonify({'status': 'success', 'patients': patients_with_appointments})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@patient_bp.route('/add', methods=['POST'])
def add_patient():
    try:
        new_patient_data = request.json
        result = db.patient.insert_one(new_patient_data)
        inserted_id = str(result.inserted_id)
        new_patient_data['_id'] = inserted_id
        return jsonify({'status': 'success', 'message': 'Patient added', 'patient': new_patient_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@patient_bp.route('/get_patient_info', methods=['POST'])
def get_patient_info():
    try:
        request_data = request.json
        patient_name = request_data.get('name')
        patient_id = request_data.get('_id')
        if not patient_name and not patient_id:
            return jsonify({'status': 'error', 'message': 'Patient name or ObjectId not provided'}), 400
        query = build_query(name=patient_name, objectId=patient_id, email=None)
        patient = db.patient.find_one(query)
        if patient:
            patient = convert_id(patient)
            return jsonify({'status': 'success', 'patient': patient})
        else:
            return jsonify({'status': 'error', 'message': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@patient_bp.route('/update', methods=['PUT'])
def update_patient():
    try:
        updated_data = request.json
        patient_name = updated_data.get('name')
        patient_id = updated_data.get('_id')
        if not patient_name and not patient_id:
            return jsonify({'status': 'error', 'message': 'Patient name or ObjectId not provided'}), 400
        query = build_query(name=patient_name, objectId=patient_id, email=None)
        db.patient.update_one(query, {"$set": updated_data})
        return jsonify({'status': 'success', 'message': 'Patient updated'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@patient_bp.route('/delete', methods=['DELETE'])
def delete_patient():
    try:
        request_data = request.json
        patient_name = request_data.get('name')
        patient_id = request_data.get('_id')
        if not patient_name and not patient_id:
            return jsonify({'status': 'error', 'message': 'Patient name or ObjectId not provided'}), 400
        query = build_query(name=patient_name, objectId=patient_id, email=None)
        result = db.patient.delete_one(query)
        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Patient deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
