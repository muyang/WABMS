#!/usr/bin/env python
import os
import sys
import subprocess

#to import python modules from the $SUMO_HOME/tools directory
sys.path.append(os.path.join(os.environ["SUMO_HOME"], "tools"))
import sumolib
from sumolib import checkBinary
import traci
import time

from flask import Flask, Response, url_for, render_template
#from flask_socketio import SocketIO
from flask.ext.socketio import SocketIO, emit
####################################
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
#coords =[[28,112],[28,113],[29,114],[27,114]]
coords=[]
values = {
    'slider1': 25,
    'slider2': 0,
}

def init():
	PORT = 8873
	sumoProcess = subprocess.Popen([checkBinary("sumo"), "-c", "mwd_in_rain.sumocfg", "--remote-port", str(PORT)],
		                           stdout=sys.stdout, stderr=sys.stderr)

	traci.init(PORT)

def sim():	
	step = 0
	while step < 86400:	
		traci.simulationStep()
		xy=[]
		vehicles = traci.vehicle.getIDList()
		for v in vehicles:
			x=112.96771+(traci.vehicle.getPosition(v)[0]+1509.33)/98838.1145
			y=28.193671+(traci.vehicle.getPosition(v)[1]-105.97)/106287.597
			xy.append([x,y])		
		return xy
		time.sleep(10)
		step += 10
	traci.close()

@socketio.on('update')
def update_view(message):
	#print message[data]
	emit('test', sim(), broadcast=True)
	
@app.route('/')
def sumo():
	init()
	return render_template('sumo2.html')

if __name__ == "__main__":
	app.debug = True
	socketio.run(app, host='127.0.0.1',port=5000)
