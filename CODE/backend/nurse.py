from flask import Blueprint, request, jsonify
from functions import convert_id, build_query, connect_to_database

nurse_bp = Blueprint('nurse', __name__)
db = connect_to_database()

# Routes for Nurses
@nurse_bp.route('/', methods=['GET'])
def get_nurses():
    try:
        nurses = list(db.nurse.find())
        nurses = [convert_id(nurse) for nurse in nurses]
        return jsonify({'status': 'success', 'nurses': nurses})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@nurse_bp.route('/add', methods=['POST'])
def add_nurse():
    try:
        new_nurse_data = request.json
        result = db.nurse.insert_one(new_nurse_data)
        inserted_id = str(result.inserted_id)
        new_nurse_data['_id'] = inserted_id
        return jsonify({'status': 'success', 'message': 'Nurse added', 'nurse': new_nurse_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@nurse_bp.route('/get_nurse_info', methods=['POST'])
def get_nurse_info():
    try:
        request_data = request.json
        nurse_name = request_data.get('name')
        nurse_id = request_data.get('objectId')
        nurse_email = request_data.get('email')
        if not nurse_name and not nurse_id and not nurse_email:
            return jsonify({'status': 'error', 'message': 'Nurse name or ObjectId or email not provided'}), 400
        query = build_query(name=nurse_name, objectId=nurse_id, email=nurse_email)
        nurse = db.nurse.find_one(query)
        if nurse:
            nurse = convert_id(nurse)
            return jsonify({'status': 'success', 'nurse': nurse})
        else:
            return jsonify({'status': 'error', 'message': 'Nurse not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@nurse_bp.route('/update', methods=['PUT'])
def update_nurse():
    try:
        updated_data = request.json
        nurse_name = updated_data.get('name')
        nurse_id = updated_data.get('objectId')
        if not nurse_name and not nurse_id:
            return jsonify({'status': 'error', 'message': 'Nurse name or ObjectId not provided'}), 400
        query = build_query(name=nurse_name, objectId=nurse_id, email=None)
        db.nurse.update_one(query, {"$set": updated_data})
        return jsonify({'status': 'success', 'message': 'Nurse updated'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@nurse_bp.route('/delete', methods=['DELETE'])
def delete_nurse():
    try:
        request_data = request.json
        nurse_name = request_data.get('name')
        nurse_id = request_data.get('objectId')
        nurse_email = request_data.get('email')
        if not nurse_name and not nurse_id and not nurse_email:
            return jsonify({'status': 'error', 'message': 'Nurse name or ObjectId or email not provided'}), 400
        query = build_query(name=nurse_name, objectId=nurse_id, email=nurse_email)
        result = db.nurse.delete_one(query)
        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Nurse deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Nurse not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
