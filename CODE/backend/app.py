from flask import Flask
from patient import patient_bp
from doctor import doctor_bp
from nurse import nurse_bp
from extra import extras_bp
from appointment import appointment_bp
from departments import department_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Register blueprints
app.register_blueprint(patient_bp, url_prefix='/patients')
app.register_blueprint(doctor_bp, url_prefix='/doctor')
app.register_blueprint(nurse_bp, url_prefix='/nurse')
app.register_blueprint(extras_bp, url_prefix='/extra')
app.register_blueprint(appointment_bp, url_prefix='/appointment')
app.register_blueprint(department_bp, url_prefix='/department')

if __name__ == "__main__":
    app.run(debug=True)
