from app import create_app

app = create_app()

@app.route('/')
def index():
    return "IntelliDash API Server is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 