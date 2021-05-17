# Anomaly Detection Web Application:

Our application is an anomaly detevtion web app. The user has to choose two csv files, one for learning and the other one for anomalies. He chooses of he want to check on linear or hybrid algorithm.
By pressing the button 'check files', if the files are valid the user needs to press the button 'upload files' and then the algorithms start to work in the bakground.
As a result of the process of the algorithms we see in our web page a table with the anomalies and in which line it happened.


### App features:
  - **Select the algorithm we want to choose- linear or hybrid. The user can choose which algorithm he wants at any time, which means it can be changed from linear to hybrid and from hybrid to linear according to the wish of the user.**
  - **Choose two files, one for learning and the other one for anomalies.**
  - **Check the validity of the files by pressing 'check files', if they are not valid - an error exception will be writen next to the box where the user has to choose the file.** 
  - **Upload the files by pressing the button 'upload files' (after they are valid).**
  - **Show the anomalies in a table of two columns: description, which describes the two correlative features and timeStep, which is the line where was an anomaly.**


### App content:
 We organized our code in these folders:
* controller
* model
* view

**controller** 
   app.js - the server, the one which connects between all the requests we have in our web app to the model (which I will explain soon).
   It handels on the get and post requests('/', '/detect')

**model** 
	we have two folders and others files:<br/>
	The folders:<br/>
	algorithms: (we want to implement on the data we got from the user)<br/>
			- LinearAlgorithm.js<br/>
			- HybridAlgorithm.js<br/>
	generatedFiles: (files we created in our project in order to use them for the algorithms)<br/>
			- anomaly.csv<br/>
			- train.csv<br/>
	
Other files:<br/>
	- AnomalyDetectionUtil.js<br/>
	- Anomaly Report.js<br/>
	- CorrelatedFeatures.js<br/>
	- DetectAnomalies.js<br/>
	- Shapes.js<br/>
	- TimeSeries.js<br/>
	All these files are the implementation for the algorithms.
		
**view**<br/>
	- checkFiles.js<br/>
	- display.css<br/>
	- display.html<br/>
	- index.css<br/>
	- index.html<br/>
	The index.html shows the buttons of choose the algorithm, loading the files, check them and upload them.
	The display.html shows the table with the information on the anomalies.
	The css files are for the design of the html files.


**Instructions for using the application:**
- Prepare two CSV files : first of them is for learning, and the second one about the anomalies.
- Download IDE webStorm 2021.1.1 in order to run the application in a comfortable place.
- Clone the project.
- Install all the moudles we need for running the server, do it by writing in the terminal: npm install.
- Connenct to the server by writing npm run dev in the terminal(of the webStorm for example).
- Connect to port 8080 on a web page for example, write in google chrom: localhost:8080/ .
- The web page we created has to be shown in front of you in the google chrom.
- Now, choose on which algorithm you want to work(linear or hybrid), choose two valid csv files(for learning and for anomalies) and click checkFiles, if they are valid the button will be changed to upload files, press it and then you will see the table with all the anomlies and where it has happened.

**Anomaly Detection Web App - Explenation Video**

[Watch here](https://youtu.be/EkVAL1K9l5Q)

#### Authors:
* Hadas Babayov
* Liav Trabelsy
* Ronli Vignanski
* Eyal Hazi







