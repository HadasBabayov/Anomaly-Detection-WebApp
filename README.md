# Anomaly Detection Web Application:

Our application is an anomaly detevtion web app. The user has to choose and upload two csv files, one for learning and the other one for anomalies. He chooses of he want to check on linear or hybrid algorithm.
By pressing the button 'check files', if the files are valid the user needs to press the button 'upload files' and then the algorithms start to work in the bakground.
As a result of the process of the algorithms we see in our web page a table with the anomalies and in which line it happened.


### App features:
  - **Select the algorithm we want to choose- linear or hybrid. The user can choose which algorithm he wants at any time, which means it can be changed from linear to hybrid and from hybrid to linear according to the wish of the user.**
  - **Choose two files, one for learning and the other one for anomalies.**
  - **Check the validity of the files by pressing 'check files', if they are not valid - an error exception will be writen next to the box where the user has to choose the file.** 
  - **Upload the files by pressing the button 'upload files' (after they are valid).**
  - **Show the anomalies in a table of two columns: description, which describes the two correlative features and timeStep, which is the line where was an anomaly.**


### App content:
 We organized our code in the design pattern of MVC.These are the folderswe created:
* controller - responsible to connect between the view and the model<br/>
* model - responsible for parsing the csv data we got from the user, learn them and write the anomalies<br/>
* view - responsible for showing the results to the screen<br/>

**controller**<br/>
   app.js - the server, the one which connects between all the requests we have in our web app to the model (which I will explain soon).
   It handels on the get and post requests('/', '/detect')

**model**<br/>
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
	The css files are for the design of the html files.<br/>

Both the features we have to do, user case 1 and user case 2, use the same code. Most of the work in our application, learning and showing the detection anomalies, are in a function that handels the case of a '/' POST request. The response to this request is by a JSON which contains the results. The html page with the upload files button performs a '/detect' request, and the function that handels this case reuses the code by creating a fetch request to '/'.
    

**Instructions for using the application:**
- Download node.js version 16.0.0 (latest version).
- Prepare two CSV files : first of them is for learning, and the second one about the anomalies. The first line of the csv files has to be the features names.
- Download IDE webStorm 2021.1.1 in order to run the application in a comfortable place. NOTICE: The csv files must be encoded with a new line '\n', if your files are encoded in 
  a different way, please change their encoding to UNIX new line ('\n').
- Clone the project.
- Do in the terminal cd "Anomaly Detection WebApp"
- Install all the moudles we need for running the server, do it by writing in the terminal: npm install.
- Connenct to the server by writing npm run dev in the terminal(of the webStorm for example).
- Connect to port 8080 on a web page for example, write in google chrom: localhost:8080/ .
- The web page we created has to be shown in front of you in the google chrom.
- Now, choose on which algorithm you want to work(linear or hybrid), choose two valid csv files(for learning and for anomalies) and click checkFiles, if they are valid the button will be changed to upload files, press it and then you will see the table with all the anomlies and where it has happened.
- If you want to exit from the server, do ctrl c where you run it.

**Anomaly Detection Web App - Explenation Video**

[Watch here](https://youtu.be/ZQ-VuTAEcls)

#### Authors:
* Hadas Babayov
* Liav Trabelsy
* Ronli Vignanski
* Eyal Hazi





















