from flask import Blueprint, request, jsonify
from functions import convert_id, build_query, connect_to_database
from werkzeug.security import check_password_hash

doctor_bp = Blueprint('doctor', __name__)
db = connect_to_database()


# Routes for Doctors
@doctor_bp.route('/', methods=['GET'])
def get_doctors():
    try:
        doctors = list(db.doctor.find())
        doctors = [convert_id(doctor) for doctor in doctors]
        return jsonify({'status': 'success', 'doctors': doctors})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/add', methods=['POST'])
def add_doctor():
    try:
        new_doctor_data = request.json
        result = db.doctor.insert_one(new_doctor_data)
        inserted_id = str(result.inserted_id)
        new_doctor_data['_id'] = inserted_id
        return jsonify({'status': 'success', 'message': 'Doctor added', 'doctor': new_doctor_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/login', methods=['POST'])
def doctor_login():
    try:
        request_data = request.json
        email = request_data.get('email')
        password = request_data.get('password')
        doctor = db.doctor.find_one({"email": email})
        if password == doctor["password"]:
            doctor = convert_id(doctor)
            return jsonify({'status': 'success', 'message': 'Doctor logged in', 'doctor': doctor}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/get_doctor_info', methods=['POST'])
def get_doctor_info():
    try:
        request_data = request.json
        doctor_name = request_data.get('name')
        doctor_id = request_data.get('objectId')
        doctor_email = request_data.get('email')
        if not doctor_name and not doctor_id and not doctor_email:
            return jsonify({'status': 'error', 'message': 'Doctor name or ObjectId or email not provided'}), 400
        query = build_query(name=doctor_name, objectId=doctor_id, email=doctor_email)
        doctor = db.doctor.find_one(query)
        if doctor:
            doctor = convert_id(doctor)
            return jsonify({'status': 'success', 'doctor': doctor})
        else:
            return jsonify({'status': 'error', 'message': 'Doctor not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/update', methods=['PUT'])
def update_doctor():
    try:
        updated_data = request.json
        doctor_name = updated_data.get('name')
        doctor_id = updated_data.get('_id')
        if not doctor_name and not doctor_id:
            return jsonify({'status': 'error', 'message': 'Doctor name or ObjectId not provided'}), 400
        query = build_query(name=doctor_name, objectId=doctor_id, email=None)
        db.doctor.update_one(query, {"$set": updated_data})
        return jsonify({'status': 'success', 'message': 'Doctor updated'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/delete', methods=['DELETE'])
def delete_doctor():
    try:
        request_data = request.json
        doctor_name = request_data.get('name')
        doctor_id = request_data.get('objectId')
        doctor_email = request_data.get('email')
        if not doctor_name and not doctor_id and not doctor_email:
            return jsonify({'status': 'error', 'message': 'Doctor name or ObjectId or email not provided'}), 400
        query = build_query(name=doctor_name, objectId=doctor_id, email=doctor_email)
        result = db.doctor.delete_one(query)
        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Doctor deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Doctor not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@doctor_bp.route('/assign_nurse', methods=['PUT'])
def assign_nurse():
    try:
        request_data = request.json
        doctor_name = request_data.get('name')
        doctor_id = request_data.get('objectId')
        nurse_name = request_data.get('nurseName')
        nurse_email = request_data.get('nurseEmail')

        if not doctor_name and not doctor_id:
            return jsonify({'status': 'error', 'message': 'Doctor name or ObjectId not provided'}), 400
        if not nurse_name and not nurse_email:
            return jsonify({'status': 'error', 'message': 'Nurse name or email not provided'}), 400

        nurse_query = {}
        if nurse_name:
            nurse_query['name'] = nurse_name
        if nurse_email:
            nurse_query['email'] = nurse_email
        nurse = db.nurse.find_one(nurse_query)

        if nurse:
            nurse_id = str(nurse['_id'])
            query = build_query(name=doctor_name, objectId=doctor_id, email=None)
            db.doctor.update_one(query, {"$set": {"nurse_id": nurse_id}})
            return jsonify({'status': 'success', 'message': 'Nurse assigned to doctor'})
        else:
            return jsonify({'status': 'error', 'message': 'Nurse not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
