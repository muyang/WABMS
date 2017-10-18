# WABMS
A Web Agent-Based Modeling and Simulation tool for Traffic based SUMO and socket.io

Developed based on TraCI and socket.io
 ![image](https://github.com/muyang/WABMS/raw/master/framework.png)


Requirements:

Ubuntu 14.04 + (not tested on Windows yet.)
Python 2.7

SUMO 0.24.0 or later

flask 0.10.1

flask socketIO
pip install eventlet  gevent gevent-websocket 
(install eventlet or gevent and gevent-websocket to improve performance) 

web map APIs, like google map, OSM, Leaflet etc.


step 1: Install python 2.7, flask, socketIO and SUMO

python downloads:
https://www.python.org/downloads/

pip install flask sockIO

SUMO is a free and open traffic simulation suite which is available since 2001. SUMO allows modelling of intermodal traffic systems including road vehicles, public transport and pedestrians. Included with SUMO is a wealth of supporting tools which handle tasks such as route finding, visualization, network import and emission calculation. SUMO can be enhanced with custom models and provides various APIs to remotely control the simulation.


http://www.dlr.de/ts/en/desktopdefault.aspx/tabid-9883/16931_read-41000/

step 2: Configuring Path Settings
To run programs from the command line comfortably you must configure your PATH variable and the SUMO_HOME variable.

Windows
Note:
If you have installed SUMO via the windows .msi installer file this is done automatically.
Right-click My Computer, and then click Properties.
Click the Advanced tab.
Click Environment variables.
Under user variables select PATH and click Edit. If no such variable exists you must create it with the New-Button
Append ;C:\Program Files\sumo-0.31.0\bin to the end of the PATH value (don't delete the existing values!)
Under user variables select SUMO_HOME and click Edit. If no such variable exists you must create it with the New-Button
Set C:\Program Files\sumo-0.31.0 as the value of the SUMO_HOME variable
Note:
Replace C:\Program Files\sumo-0.31.0\ with your sumo directory.
Caution:
You must close and reopen any existing command-line window for the new variable setting to become effective.
Linux
Temporary Solution
To set an environment variable temporarily, you can use the following command in your terminal:

export SUMO_HOME="/your/path/to/sumo/"

This sets the environment variable to be used by any program or script you start in your current shell session. This does not affect any other shell session and only works until you end the session.

Note:
Replace /your/path/to/sumo/ with your sumo directory.
Permanent Solution
To set an environment variable permanently, follow these steps:

Open a file explorer of your choice and go to /home/YOUR_NAME/.
Open the file named .bashrc with a text editor of your choice. (You may have to enable showing hidden files in your file explorer)
Place this code export SUMO_HOME="/your/path/to/sumo/" somewhere in the file and save. (Don't delete any existing content!)
Reboot your computer. (Alternatively, log out of your account and log in again.)
The environment variable will now be used by any program you start from the command line with your current user account.

Note:
Replace YOUR_NAME with your username; Replace /your/path/to/sumo/ with your sumo directory.



TraCI

TraCI is the short term for "Traffic Control Interface". Giving the access to a running road traffic simulation, it allows to retrieve values of simulated objects and to manipulate their behaviour "on-line".

http://sumo.dlr.de/wiki/TraCI

http://www.sumo.dlr.de/pydoc/traci.html




