import io
import base64
import random
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def generate_graph():
    # Generate a random network nodes graph
    fig, ax = plt.subplots(figsize=(4, 3))
    fig.patch.set_facecolor('black')
    ax.set_facecolor('black')
    
    # Fake node connection graph
    x = np.random.rand(10) * 10
    y = np.random.rand(10) * 10
    
    ax.plot(x, y, color='#0f0', marker='o', linestyle='-', linewidth=0.5, markersize=4)
    ax.tick_params(colors='#0f0')
    ax.spines['bottom'].set_color('#0f0')
    ax.spines['top'].set_color('#0f0') 
    ax.spines['right'].set_color('#0f0')
    ax.spines['left'].set_color('#0f0')
    
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', facecolor=fig.get_facecolor())
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return image_base64

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/hack', methods=['POST'])
def hack_status():
    data = request.json
    strategy_mutated = data.get('strategy_mutated', False)
    
    # Random progress 0-15% increase
    progress_increase = int(np.random.normal(7, 3) * (1.5 if strategy_mutated else 1.0))
    progress_increase = max(1, min(progress_increase, 20)) # Clamp between 1-20
    
    # Event messages
    events = [
        "Bypassing firewall sequence...",
        "Injecting payload to target server...",
        "Analyzing node vulnerabilities...",
        "Decrypting admin credentials...",
        "Tracing IP address route...",
        "Rerouting connection through proxy...",
        "Establishing secondary tunnel..."
    ]
    
    warnings = [
        "WARNING: Trace detected!",
        "ALERT: Firewall active.",
        "ERROR: Node connection timed out.",
        "WARNING: Intrusion countermeasures engaging.",
    ]
    
    success_rate = np.random.rand()
    if success_rate > 0.85:
        event = np.random.choice(warnings)
        status = "warning"
    else:
        event = np.random.choice(events)
        status = "success"
        
    return jsonify({
        'progress_increase': progress_increase,
        'event': event,
        'status': status,
        'graph': generate_graph()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
