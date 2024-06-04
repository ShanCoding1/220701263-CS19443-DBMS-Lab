from flask import Blueprint, jsonify

department_bp = Blueprint('department_bp', __name__)

departments = [
    { "index": "DEPT01", "name": 'Cardiology', "staffs": 20, "appointments": 150 },
    { "index": "DEPT02", "name": 'Neurology', "staffs": 15, "appointments": 120 },
    { "index": "DEPT03", "name": 'Orthopedics', "staffs": 18, "appointments": 130 },
    { "index": "DEPT04", "name": 'Pediatrics', "staffs": 25, "appointments": 170 },
    { "index": "DEPT05", "name": 'Dermatology', "staffs": 12, "appointments": 100 },
    { "index": "DEPT06", "name": 'Oncology', "staffs": 22, "appointments": 160 },
    { "index": "DEPT07", "name": 'Gynecology', "staffs": 17, "appointments": 140 },
]

def format_department_data(department):
    formatted_department = {
        "id": department["index"],
        "name": department["name"],
        "staffs": department["staffs"],
        "appointments": department["appointments"]
    }
    return formatted_department

@department_bp.route('/getDetails', methods=['GET'])
def get_department_details():
    formatted_departments = [format_department_data(department) for department in departments]
    return jsonify({'departments': formatted_departments})

