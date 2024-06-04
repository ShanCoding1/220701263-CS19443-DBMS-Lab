from flask import Blueprint, jsonify, request
from functions import ObjectId, connect_to_database

extras_bp = Blueprint('extras', __name__)
db = connect_to_database()


def find_doctor_by_name(doctor_name):
    doctor = db.doctor.find_one({"name": doctor_name})
    return doctor


def find_nurse_by_id(nurse_id):
    nurse = db.nurse.find_one({"_id": ObjectId(nurse_id)})
    return nurse


@extras_bp.route('/find_nurse_from_doctor', methods=['POST'])
def find_doctor_and_nurse():
    try:
        request_data = request.json
        doctor_name = request_data.get('doctorName')
        if not doctor_name:
            return jsonify({'status': 'error', 'message': 'Doctor name not provided'}), 400

        doctor = find_doctor_by_name(doctor_name)
        if doctor:
            nurse_id = doctor.get('nurse_id')
            if nurse_id:
                nurse = find_nurse_by_id(nurse_id)
                if nurse:
                    doctor['_id'] = str(doctor['_id'])
                    nurse['_id'] = str(nurse['_id'])
                    return jsonify({'status': 'success', 'doctor': doctor, 'assigned_nurse': nurse})
                else:
                    return jsonify({'status': 'error', 'message': 'Nurse not found'}), 404
            else:
                return jsonify({'status': 'error', 'message': 'No nurse assigned to this doctor'}), 404
        else:
            return jsonify({'status': 'error', 'message': 'Doctor not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
